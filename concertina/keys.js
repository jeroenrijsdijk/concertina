// keys.js - the button layout and note helpers shared by all pages (tool, practice, listen).
// Keep the pages in the same folder as this file. To change the built-in layout, edit KEYS_DATA below,
// or upload a JSON layout in concertina.html: that layout is kept in the browser and used by every page.

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

// =============================================================================
//  Your own layout
//  An uploaded layout is checked, kept in the browser (localStorage) and used by
//  every page, until "Default layout" brings back the built-in one above.
// =============================================================================
const LAYOUT_STORE_KEY = "concertina.layout";
const MAX_BUTTON_ID    = 200;     // ids index the distance matrix, so keep them small
const DEFAULT_KEYS_DATA = JSON.parse(JSON.stringify(KEYS_DATA));
let LAYOUT_NAME = DEFAULT_LAYOUT_NAME;

// Returns a description of what is wrong with one button entry, or null when it is usable
function validateButton(v) {
  if (!v || typeof v !== "object") return "not an object";
  const required = ["side", "row", "button", "pushpull", "note"];
  const missing  = required.filter(f => v[f] === undefined);
  if (missing.length > 0) return `missing ${missing.join(", ")}`;
  if (![1, 2].includes(v.side))     return `side must be 1 or 2 (got ${v.side})`;
  if (![1, 2, 3].includes(v.row))   return `row must be 1, 2 or 3 (got ${v.row})`;
  if (![1, 2, 3, 4, 5].includes(v.button)) return `button must be 1 to 5 (got ${v.button})`;
  if (![1, 2].includes(v.pushpull)) return `pushpull must be 1 or 2 (got ${v.pushpull})`;
  if (noteToMidi(v.note) === null)  return `unknown note "${v.note}" (use e.g. G3, F#2, BB1)`;
  return null;
}

// Layout file contents (an object: { name, "1": {...}, "2": {...}, ... }) -> { name, buttons }.
// Throws an Error that says what is wrong.
function parseLayout(data, fallbackName) {
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("This is not a layout file.");
  const name = String(data.name || fallbackName || "My layout").slice(0, 80);
  const buttons = {};
  for (const [k, v] of Object.entries(data)) {
    if (!/^\d+$/.test(k)) continue;              // "name" and other non-button fields
    const id = Number(k);
    if (id < 1 || id > MAX_BUTTON_ID) throw new Error(`Button id ${k}: must be 1 to ${MAX_BUTTON_ID}`);
    const problem = validateButton(v);
    if (problem) throw new Error(`Button ${id}: ${problem}`);
    buttons[id] = { side: v.side, row: v.row, button: v.button, pushpull: v.pushpull, note: v.note };
  }
  if (Object.keys(buttons).length === 0) throw new Error("No valid buttons found in this file.");
  return { name, buttons };
}

// Use a layout on this page, and keep it for the other pages and the next visit
function useLayout(name, buttons) {
  KEYS_DATA   = buttons;
  LAYOUT_NAME = name;
  try { localStorage.setItem(LAYOUT_STORE_KEY, JSON.stringify({ name, ...buttons })); } catch (e) { /* no storage: this page only */ }
}

function useDefaultLayout() {
  KEYS_DATA   = JSON.parse(JSON.stringify(DEFAULT_KEYS_DATA));
  LAYOUT_NAME = DEFAULT_LAYOUT_NAME;
  try { localStorage.removeItem(LAYOUT_STORE_KEY); } catch (e) { /* fine */ }
}

function hasStoredLayout() { try { return !!localStorage.getItem(LAYOUT_STORE_KEY); } catch (e) { return false; } }

// On every page load: the layout kept from an earlier upload, if it is still valid
(function restoreLayout() {
  try {
    const raw = localStorage.getItem(LAYOUT_STORE_KEY);
    if (!raw) return;
    const { name, buttons } = parseLayout(JSON.parse(raw));
    KEYS_DATA   = buttons;
    LAYOUT_NAME = name;
  } catch (e) {
    try { localStorage.removeItem(LAYOUT_STORE_KEY); } catch (e2) { /* fine */ }   // broken: forget it
  }
})();
