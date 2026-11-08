# Concertina Fingering

**Find the optimal fingering for any tune on a 30-button Anglo C/G concertina.**

Paste a tune in ABC notation, click Analyse, and the tool tells you which button to press for each note — and whether to push or pull the bellows.

→ **[Try it online](https://jeroenrijsdijk.github.io/concertina/concertina.html)**

---

## What it does

An Anglo concertina is bisonoric: each button produces a different note on push and pull. Many notes can be played on more than one button, so for a full tune there are often thousands of possible fingering combinations.

This tool searches through all combinations and picks the route that is easiest to play, minimising awkward jumps, finger hops, and unnecessary bellows reversals.

Results are shown as:
- a **table** — hand, row, direction (push/pull), and button number for each note
- a **button diagram** — all 60 buttons visualised per note, colour-coded push (blue) / pull (red)
- a **downloadable PNG** — the button diagram as an image
- **playback** — the tune is played as written (durations, rests, repeats, tempo), so you can hear it

## Files

| File | Description |
|---|---|
| `concertina.html` | The web tool (needs `keys.js` and `vendor/` next to it) |
| `listen.html` | Live pitch detection from the microphone (needs `keys.js` next to it) |
| `keys.js` | The button layout (`KEYS_DATA`) and note helpers, shared by both pages |
| `help.html` | Help page and manual |
| `vendor/abcjs-basic-min.js` | The [abcjs](https://abcjs.net) library (v6.6.3, MIT; licence in `vendor/abcjs-LICENSE.txt`) |

## Using the web tool

Just open `concertina.html` in a browser, keeping the files of this repository together (`keys.js` and the `vendor` folder next to it). No installation, no server needed.

The Kesh Jig is pre-loaded as an example — click **Analyse** straight away.

To use your own tune, paste any ABC notation into the text area. Thousands of tunes in ABC format are available at [thesession.org](https://thesession.org) and [abcnotation.com](https://abcnotation.com).

## How the algorithm works

The search is **exact** (dynamic programming / Viterbi):

1. For each note in the tune, all buttons that produce that note are looked up
2. Each transition between two buttons is scored (same hand, push-pull balance, preferred rows, finger hops)
3. Because a route's score is the sum of its consecutive transitions, the cheapest route through all notes can be found without pruning — in linear time, so even long tunes are instant
4. The route with the lowest total score is returned
5. A second, "soft" pass (forward-backward with a temperature) gives the probability of each alternative button per note, shown as the smaller dots in the diagram

Scoring favours:
- Staying on the same hand
- Push-pull alternation on the same button (natural bellows reversal)
- The c and g rows over the t row
- Buttons 1 and 2 over outer buttons

## Button layout

This tool is tuned for a standard **30-button C/G Anglo concertina**. The full note layout is documented in `help.html`. If your instrument differs, the `KEYS_DATA` object in `keys.js` (shared by `concertina.html` and `listen.html`) can be adapted, or upload your own layout in `concertina.html`.

A **Download template** button exports the current layout as JSON. Edit it and upload it with **Upload layout** to use your own instrument. The active layout name is shown in the UI.

## ABC notation

The tool reads standard ABC headers:

```
X:1
T:The Kesh Jig
R:jig
M:6/8
L:1/8
K:Gmaj
|:GAG GAB|ABA ABd|egd edB|dBA ABd:|
```

The ABC is read with [abcjs](https://abcjs.net), the same library that draws the sheet music: key signatures and modes, explicit accidentals (`^c`, `_B`, `=f`), octave marks and ties are handled; chord symbols, decorations and comments are ignored. Repeats are not unrolled in the table (but are played), grace notes are not fingered, and for chords only the top note is used. Anything left out is reported under the Analyse button.

## Known limitations

- 30-button C/G Anglo only (adaptable via `KEYS_DATA`)
- Notes outside the instrument's range cannot be fingered; they are skipped and listed
- Chords are not supported (only the top note is used)
- Playback is a simple synthesized tone; ornaments and grace notes are not played

## History

Originally written in Ruby in 2015–2018 (that version is no longer part of this repository). Refactored and ported to a web tool in 2026, with a lot of help from Claude AI.

## License

MIT License — Copyright (c) 2024 jeroenrijsdijk

