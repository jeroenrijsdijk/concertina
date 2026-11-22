// =============================================================================
//  Practice view (concertina.html#practice)
//  For a tablet on a music stand: the sheet music with the note under the cursor,
//  that note's button large and coloured push/pull, and the next two notes small,
//  so you can read ahead. Follows the shared cursor of concertina.html through
//  onHook("analysed" | "cursor" | "mode"); it changes nothing in the tool itself.
// =============================================================================
(function () {
  if (typeof onHook !== "function") return;     // concertina.html did not load

  const ROW_NAMES = ["", "t", "c", "g"];
  const CARDS     = [0, 1, 2].map(i => document.getElementById("card-" + i));
  const COLORS    = { push: "#1a4fa8", pull: "#c0281a", ink: "#14213d", muted: "#5b6577",
                      off: "#eef1f6", offLine: "#c7cdd8" };

  onHook("analysed", a => {
    const t = a.tune;
    document.getElementById("p-title").textContent = t.title || "Untitled tune";
    document.getElementById("p-meta").textContent  = [t.key, t.meter, t.rhythm].filter(Boolean).join(" · ");
    renderSheet("p-notation", document.getElementById("p-sheet"), true);
  });
  onHook("cursor", () => { if (mode === "practice") draw(); });
  onHook("mode",   m  => { if (m === "practice") { draw(); markSheets(cursor); } });

  // Redraw the canvases whenever a card changes size (rotation, window resize)
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => { if (mode === "practice") draw(); });
    CARDS.forEach(c => ro.observe(c.querySelector(".card-body")));
  }

  function draw() {
    if (!analysis || !playback) return;
    const ev = playback.events;
    document.getElementById("p-pos").textContent =
      ev[cursor] ? `${ev[cursor].routePos + 1} / ${playback.routeLength}` : "";
    CARDS.forEach((card, n) => fillCard(card, ev[cursor + n], n === 0 ? ev[cursor - 1] : null));
  }

  function fillCard(card, e, prev) {
    const canvas = card.querySelector("canvas");
    card.classList.remove("is-push", "is-pull", "empty");
    if (!e) {                                   // past the end of the tune
      card.classList.add("empty");
      card.querySelector(".card-dir").textContent  = "";
      card.querySelector(".card-note").textContent = "End";
      card.querySelector(".card-foot").textContent = "";
      const ch = card.querySelector(".card-change"); if (ch) ch.textContent = "";
      drawHands(canvas, null);
      return;
    }
    const id   = analysis.route[e.routePos];
    const k    = KEYS_DATA[id];
    const pull = k.pushpull === 2;
    card.classList.add(pull ? "is-pull" : "is-push");
    card.querySelector(".card-dir").textContent  = pull ? "PULL" : "PUSH";
    card.querySelector(".card-note").textContent = k.note;
    card.querySelector(".card-foot").textContent =
      `${k.side === 1 ? "Left" : "Right"} hand · row ${ROW_NAMES[k.row] || k.row} · button ${k.button}`;

    // Bellows reversal from the previous note: worth a glance while playing
    const ch = card.querySelector(".card-change");
    if (ch) {
      const before = prev && KEYS_DATA[analysis.route[prev.routePos]];
      ch.textContent = before && before.pushpull !== k.pushpull ? "⇄ bellows" : "";
      ch.style.display = ch.textContent ? "" : "none";
    }
    drawHands(canvas, id);
  }

  // Both hands as the player sees them: 3 rows (t, c, g) of buttons per hand, button 1
  // nearest the middle. Positions come from KEYS_DATA, so uploaded layouts work too.
  function drawHands(canvas, chosen) {
    const box = canvas.parentElement.getBoundingClientRect();
    const W = Math.max(box.width, 10), H = Math.max(box.height, 10);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // Physical buttons: one per side/row/button (push and pull share a button)
    const phys = new Map();
    let maxBtn = 1, maxRow = 1;
    for (const id of buttonIds()) {
      const k = KEYS_DATA[id];
      phys.set(`${k.side}-${k.row}-${k.button}`, k);
      maxBtn = Math.max(maxBtn, k.button);
      maxRow = Math.max(maxRow, k.row);
    }

    const labelH = Math.min(22, H * 0.12);
    const gap    = W * 0.09;                        // space between the hands, for the row names
    const padX   = W * 0.03;
    const handW  = (W - 2 * padX - gap) / 2;
    const stepX  = handW / (maxBtn + 0.5);          // + half a step for the row stagger
    const stepY  = (H - labelH - 8) / maxRow;
    const r      = Math.max(4, Math.min(stepX, stepY) * 0.40);
    const chosenK = chosen ? KEYS_DATA[chosen] : null;

    const pos = (side, row, button) => {
      const col     = side === 1 ? maxBtn - button : button - 1;   // left hand: button 1 innermost
      const stagger = (row - 1) * stepX * 0.25 * (side === 1 ? -1 : 1);
      const x0      = side === 1 ? padX : padX + handW + gap;
      return [x0 + stepX * (col + 0.75) + stagger + (side === 1 ? stepX * 0.5 : 0),
              labelH + 4 + stepY * (row - 0.5)];
    };

    // Hand labels, the chosen hand stronger
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 ${Math.round(labelH * 0.6)}px Oswald, system-ui, sans-serif`;
    [[1, "LEFT HAND"], [2, "RIGHT HAND"]].forEach(([side, txt]) => {
      ctx.fillStyle = chosenK && chosenK.side === side ? COLORS.ink : COLORS.muted;
      ctx.globalAlpha = chosenK && chosenK.side !== side ? 0.5 : 1;
      ctx.fillText(txt, (side === 1 ? padX : padX + handW + gap) + handW / 2, labelH / 2 + 2);
    });
    ctx.globalAlpha = 1;

    // Row names in the middle
    ctx.font = `600 ${Math.round(Math.min(stepY * 0.3, 20))}px 'Source Code Pro', monospace`;
    ctx.fillStyle = COLORS.muted;
    for (let row = 1; row <= maxRow; row++) {
      ctx.fillText(ROW_NAMES[row] || row, W / 2, labelH + 4 + stepY * (row - 0.5));
    }

    for (const k of phys.values()) {
      const [x, y] = pos(k.side, k.row, k.button);
      const isChosen = chosenK && k.side === chosenK.side && k.row === chosenK.row && k.button === chosenK.button;
      ctx.beginPath();
      ctx.arc(x, y, isChosen ? r * 1.12 : r, 0, Math.PI * 2);
      if (isChosen) {
        ctx.fillStyle = chosenK.pushpull === 2 ? COLORS.pull : COLORS.push;
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = `700 ${Math.round(r * 0.62)}px 'Source Code Pro', monospace`;
        ctx.fillText(chosenK.note, x, y + 1);
      } else {
        ctx.fillStyle = COLORS.off;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = COLORS.offLine;
        ctx.stroke();
        if (r > 14) {                                          // button numbers when there is room
          ctx.fillStyle = COLORS.offLine;
          ctx.font = `${Math.round(r * 0.5)}px 'Source Code Pro', monospace`;
          ctx.fillText(k.button, x, y + 1);
        }
      }
    }
  }
})();
