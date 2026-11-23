// =============================================================================
//  pitch.js - microphone -> the note of the instrument that is being played.
//  Shared by listen.html and the follow mode of the practice view. Needs keys.js
//  (KEYS_DATA, noteToMidi, midiToHz); uses the layout that is active on the page.
//
//    const mic = Pitch.createListener({ onNote(note, hz) {...}, onLevel(rms) {...} });
//    await mic.start();   ...   mic.stop();
//
//  onNote gets the note label (as the layout writes it) while a note is stable,
//  and null once it has been silent for a moment.
// =============================================================================
const Pitch = (() => {

  // ---------- The instrument's notes: [{ note, hz, midi }] sorted by pitch ----------
  let TABLE = [], HZ_MIN = 0, HZ_MAX = 0;

  function buildTable() {
    const seen = new Map();
    for (const id of buttonIds()) {
      const note = KEYS_DATA[id].note, midi = noteToMidi(note);
      if (midi !== null && !seen.has(note)) seen.set(note, { note, midi, hz: midiToHz(midi) });
    }
    TABLE  = [...seen.values()].filter(x => x.hz > 80).sort((a, b) => a.hz - b.hz);
    HZ_MIN = TABLE.length ? TABLE[0].hz * 0.92 : 0;
    HZ_MAX = TABLE.length ? TABLE[TABLE.length - 1].hz * 1.08 : 0;
  }

  // Nearest note of the instrument, within 60 cents (just over a quarter tone)
  function hzToNote(hz) {
    if (!hz || hz < HZ_MIN || hz > HZ_MAX) return null;
    let best = null, bestDist = Infinity;
    for (const entry of TABLE) {
      const cents = Math.abs(1200 * Math.log2(hz / entry.hz));
      if (cents < bestDist) { bestDist = cents; best = entry; }
    }
    return bestDist < 60 ? best : null;
  }

  // ---------- Fundamental from a spectrum ----------
  // Pitch = the fundamental, not simply the loudest peak. A reed (and a small tablet
  // microphone, which weakens low tones) often makes the 2nd or 3rd harmonic louder
  // than the fundamental; the loudest peak is then an octave (or a twelfth) too high.
  // So after finding the loudest peak fp, look below it: the lowest fp/k (k = 6..2)
  // that is a note of the instrument and has a real peak of its own is the fundamental.
  // "Real" = clearly above the local noise floor and not more than SUB_RANGE dB
  // weaker than the loudest peak.
  const SUB_MAX_K      = 6;    // highest harmonic number that may pass for the loudest peak
  const SUB_RANGE      = 30;   // dB a fundamental may be weaker than its loudest harmonic
  const SUB_PROMINENCE = 12;   // dB a fundamental must stand above the noise around it

  // freqBuf: spectrum in dB, binHz: width of one bin. Returns { hz, clarity }.
  function findFundamental(freqBuf, binHz) {
    const N      = freqBuf.length;
    const minBin = Math.max(1,   Math.floor(HZ_MIN / binHz));
    const maxBin = Math.min(N-2, Math.ceil( HZ_MAX / binHz));

    let bestBin = minBin, bestVal = -Infinity;            // loudest peak in the instrument's range
    for (let i = minBin; i <= maxBin; i++) {
      if (freqBuf[i] > bestVal) { bestVal = freqBuf[i]; bestBin = i; }
    }
    let mean = 0;                                         // clarity: dB above the mean (clean tone: 15+)
    for (let i = minBin; i <= maxBin; i++) mean += freqBuf[i];
    mean /= (maxBin - minBin + 1);
    const clarity = bestVal - mean;

    const peakHz = interpolate(freqBuf, bestBin) * binHz;
    for (let k = SUB_MAX_K; k >= 2; k--) {                // is the loudest peak a harmonic?
      const note = hzToNote(peakHz / k);
      if (!note) continue;
      const b = localMax(freqBuf, Math.round(note.hz / binHz), 2);
      if (b < 1 || b >= N - 1) continue;
      if (freqBuf[b] < bestVal - SUB_RANGE) continue;
      if (freqBuf[b] < noiseFloor(freqBuf, b) + SUB_PROMINENCE) continue;
      return { hz: interpolate(freqBuf, b) * binHz, clarity };
    }
    return { hz: peakHz, clarity };
  }

  function localMax(buf, i, radius) {                     // bin of the highest value within +-radius
    let best = i;
    for (let j = Math.max(1, i - radius); j <= Math.min(buf.length - 2, i + radius); j++) if (buf[j] > buf[best]) best = j;
    return best;
  }
  function noiseFloor(buf, i) {                           // median a third of an octave around i, peak left out
    const lo = Math.max(1, Math.floor(i / 1.26)), hi = Math.min(buf.length - 1, Math.ceil(i * 1.26));
    const vals = [];
    for (let j = lo; j <= hi; j++) if (Math.abs(j - i) > 3) vals.push(buf[j]);
    vals.sort((x, y) => x - y);
    return vals.length ? vals[vals.length >> 1] : -Infinity;
  }
  function interpolate(buf, i) {                          // parabolic peak position, sub-bin
    const y1 = buf[i - 1], y2 = buf[i], y3 = buf[i + 1];
    const denom = 2 * y2 - y1 - y3;
    return denom > 0 ? i + (y1 - y3) / (2 * denom) : i;
  }

  // ---------- A listening microphone ----------
  const FFT_SIZE      = 16384;  // analysis window (~0.34 s): bins of ~2.7 Hz, fine enough for low notes
  const LEVEL_SAMPLES = 4096;   // the level is measured over the newest ~85 ms, so a short pause is seen
  const MIN_CLARITY   = 8;      // dB above the mean spectrum = a clear tone
  const REQUIRED_HITS = 3;      // the same note this many frames in a row before it counts
  const FRAME_MS      = 35;

  // Friendly text for a failed microphone start
  function describeError(e) {
    if (e && e.name === "NotAllowedError") return "Microphone access was blocked. Allow it in the browser's address bar and try again.";
    if (e && e.name === "NotFoundError")   return "No microphone found.";
    return "Could not start the microphone: " + (e && e.message || e);
  }

  // opts: onNote(note|null, hz), onLevel(rms), onUnknown(hz) for a tone that is not on the instrument,
  //       threshold() -> rms below which it counts as silence (default 0.018),
  //       holdFrames: silent frames before onNote(null) (default 8 = ~0.3 s)
  function createListener(opts = {}) {
    const threshold  = opts.threshold || (() => 0.018);
    const holdFrames = opts.holdFrames !== undefined ? opts.holdFrames : 8;
    let audioCtx = null, analyser = null, stream = null, running = false, timer = 0;
    let candidate = null, hits = 0, hold = 0, current = null;
    const timeBuf = new Float32Array(FFT_SIZE);           // the whole window, oldest sample first
    let freqBuf = null;

    function frame() {
      if (!running) return;
      analyser.getFloatTimeDomainData(timeBuf);
      let sum = 0;
      for (let i = FFT_SIZE - LEVEL_SAMPLES; i < FFT_SIZE; i++) sum += timeBuf[i] * timeBuf[i];
      const rms = Math.sqrt(sum / LEVEL_SAMPLES);
      if (opts.onLevel) opts.onLevel(rms);

      if (rms < threshold()) {                            // silence: let go of the note after a moment
        candidate = null; hits = 0;
        if (hold > 0) hold--;
        else if (current !== null) { current = null; if (opts.onNote) opts.onNote(null, 0); }
      } else {
        analyser.getFloatFrequencyData(freqBuf);
        const r = findFundamental(freqBuf, audioCtx.sampleRate / analyser.fftSize);
        if (r.clarity > MIN_CLARITY) {
          const match = hzToNote(r.hz);
          if (match) {
            hits = match.note === candidate ? hits + 1 : 1;
            candidate = match.note;
            if (hits >= REQUIRED_HITS) {
              hold = holdFrames;
              current = match.note;
              if (opts.onNote) opts.onNote(match.note, r.hz);
            }
          } else {
            candidate = null; hits = 0;
            if (opts.onUnknown) opts.onUnknown(r.hz);
          }
        }
      }
      timer = setTimeout(frame, FRAME_MS);
    }

    async function start() {
      if (running) return;
      if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("The microphone needs a secure page: open this page via https://.");
      }
      buildTable();                                       // the layout may have changed since the page loaded
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } catch (e) {
        throw new Error(describeError(e));
      }
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      if (opts.smoothing !== undefined) analyser.smoothingTimeConstant = opts.smoothing;
      freqBuf = new Float32Array(analyser.frequencyBinCount);
      audioCtx.createMediaStreamSource(stream).connect(analyser);
      candidate = null; hits = 0; hold = 0; current = null;
      running = true;
      frame();
    }

    function stop() {
      running = false;
      clearTimeout(timer);
      if (stream)   stream.getTracks().forEach(t => t.stop());
      if (audioCtx) audioCtx.close();
      audioCtx = analyser = stream = null;
      current = null;
    }

    return {
      start, stop, timeBuf,
      get running()    { return running; },
      get sampleRate() { return audioCtx ? audioCtx.sampleRate : 0; },
    };
  }

  buildTable();
  return {
    createListener, findFundamental, hzToNote, buildTable,
    get table() { return TABLE; },
    get range() { return [HZ_MIN, HZ_MAX]; },
  };
})();
