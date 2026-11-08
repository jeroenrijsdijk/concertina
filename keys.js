// keys.js - the button layout and note helpers shared by concertina.html and listen.html.
// Keep both pages in the same folder as this file. To change the built-in layout, edit KEYS_DATA below
// (or upload a JSON layout in concertina.html).

// =============================================================================
//  Concertina button data  (default: My Geuns)
//  Can be replaced at runtime by uploading a JSON layout file.
// =============================================================================
const DEFAULT_LAYOUT_NAME = "My Geuns";
let KEYS_DATA = {
   1:{side:1,row:1,button:5,pushpull:1,note:"E1"},
   2:{side:1,row:1,button:4,pushpull:1,note:"A1"},
   3:{side:1,row:1,button:3,pushpull:1,note:"C#2"},
   4:{side:1,row:1,button:2,pushpull:1,note:"A2"},
   5:{side:1,row:1,button:1,pushpull:1,note:"G#2"},
   6:{side:1,row:2,button:5,pushpull:1,note:"C1"},
   7:{side:1,row:2,button:4,pushpull:1,note:"G1"},
   8:{side:1,row:2,button:3,pushpull:1,note:"C2"},
   9:{side:1,row:2,button:2,pushpull:1,note:"E2"},
  10:{side:1,row:2,button:1,pushpull:1,note:"G2"},
  11:{side:1,row:3,button:5,pushpull:1,note:"B1"},
  12:{side:1,row:3,button:4,pushpull:1,note:"D2"},
  13:{side:1,row:3,button:3,pushpull:1,note:"G2"},
  14:{side:1,row:3,button:2,pushpull:1,note:"B2"},
  15:{side:1,row:3,button:1,pushpull:1,note:"D3"},
  16:{side:1,row:1,button:5,pushpull:2,note:"F1"},
  17:{side:1,row:1,button:4,pushpull:2,note:"BB1"},
  18:{side:1,row:1,button:3,pushpull:2,note:"D#2"},
  19:{side:1,row:1,button:2,pushpull:2,note:"G2"},
  20:{side:1,row:1,button:1,pushpull:2,note:"BB2"},
  21:{side:1,row:2,button:5,pushpull:2,note:"G1"},
  22:{side:1,row:2,button:4,pushpull:2,note:"B1"},
  23:{side:1,row:2,button:3,pushpull:2,note:"D2"},
  24:{side:1,row:2,button:2,pushpull:2,note:"F2"},
  25:{side:1,row:2,button:1,pushpull:2,note:"A2"},
  26:{side:1,row:3,button:5,pushpull:2,note:"A1"},
  27:{side:1,row:3,button:4,pushpull:2,note:"F#2"},
  28:{side:1,row:3,button:3,pushpull:2,note:"A2"},
  29:{side:1,row:3,button:2,pushpull:2,note:"C3"},
  30:{side:1,row:3,button:1,pushpull:2,note:"E3"},
  31:{side:2,row:1,button:1,pushpull:1,note:"C#3"},
  32:{side:2,row:1,button:2,pushpull:1,note:"C#3"},
  33:{side:2,row:1,button:3,pushpull:1,note:"G#3"},
  34:{side:2,row:1,button:4,pushpull:1,note:"C#4"},
  35:{side:2,row:1,button:5,pushpull:1,note:"A4"},
  36:{side:2,row:2,button:1,pushpull:1,note:"C3"},
  37:{side:2,row:2,button:2,pushpull:1,note:"E3"},
  38:{side:2,row:2,button:3,pushpull:1,note:"G3"},
  39:{side:2,row:2,button:4,pushpull:1,note:"C4"},
  40:{side:2,row:2,button:5,pushpull:1,note:"E4"},
  41:{side:2,row:3,button:1,pushpull:1,note:"G3"},
  42:{side:2,row:3,button:2,pushpull:1,note:"B3"},
  43:{side:2,row:3,button:3,pushpull:1,note:"D4"},
  44:{side:2,row:3,button:4,pushpull:1,note:"G4"},
  45:{side:2,row:3,button:5,pushpull:1,note:"D#4"},
  46:{side:2,row:1,button:1,pushpull:2,note:"C#3"},
  47:{side:2,row:1,button:2,pushpull:2,note:"D#3"},
  48:{side:2,row:1,button:3,pushpull:2,note:"G3"},
  49:{side:2,row:1,button:4,pushpull:2,note:"BB3"},
  50:{side:2,row:1,button:5,pushpull:2,note:"D4"},
  51:{side:2,row:2,button:1,pushpull:2,note:"B2"},
  52:{side:2,row:2,button:2,pushpull:2,note:"D3"},
  53:{side:2,row:2,button:3,pushpull:2,note:"F3"},
  54:{side:2,row:2,button:4,pushpull:2,note:"A3"},
  55:{side:2,row:2,button:5,pushpull:2,note:"B3"},
  56:{side:2,row:3,button:1,pushpull:2,note:"F#3"},
  57:{side:2,row:3,button:2,pushpull:2,note:"A3"},
  58:{side:2,row:3,button:3,pushpull:2,note:"C4"},
  59:{side:2,row:3,button:4,pushpull:2,note:"E4"},
  60:{side:2,row:3,button:5,pushpull:2,note:"F#4"}
};

// =============================================================================
//  Notes
//  Labels use Irish session notation: two octaves below standard scientific
//  pitch (Irish C3 = standard C5 = MIDI 72). Sharp = "#", flat = capital "B"
//  after the letter ("BB1" = B flat, "EB2" = E flat). Notes are compared as
//  MIDI numbers, so enharmonic spellings (A# / BB) are the same note.
// =============================================================================
const SEMITONE    = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 };
const PITCH_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

function noteToMidi(label) {
  const m = /^([A-G])(#|B)?(-?\d+)$/.exec(label || "");
  if (!m) return null;
  const accidental = m[2] === "#" ? 1 : m[2] === "B" ? -1 : 0;
  return (parseInt(m[3], 10) + 2 + 1) * 12 + SEMITONE[m[1]] + accidental;
}

function midiToName(midi) {
  return PITCH_NAMES[midi % 12] + (Math.floor(midi / 12) - 1 - 2);
}

function midiToHz(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// =============================================================================
//  Layout helpers
// =============================================================================
function buttonIds() {
  return Object.keys(KEYS_DATA).map(Number).sort((a, b) => a - b);
}
