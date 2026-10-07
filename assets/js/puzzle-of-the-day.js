// Interactive "puzzle of the day" fed by the Lichess daily-puzzle API
// (https://lichess.org/api/puzzle/daily, which sends CORS allow-origin:*).
// The board (chessboard.js) is draggable; chess.js tracks legality/state.
// Puzzle convention: puzzle.fen is the position with the solver to move,
// and puzzle.solution is a list of UCI moves alternating solver, opponent,
// solver, ... (even indices = solver, odd = opponent, auto-played).
// Static site, no backend -- all client-side, degrades to the Lichess link
// if the fetch or libraries fail.
(function () {
  var root = document.querySelector(".puzzle");
  if (!root || typeof window.Chessboard !== "function" || typeof window.Chess !== "function") return;

  var lang = root.dataset.lang === "en" ? "en" : "nl";
  var pieceBase = root.dataset.pieceBase;
  var statusEl = document.getElementById("puzzle-status");
  var resetBtn = document.getElementById("puzzle-reset");

  var T = {
    nl: {
      move: function (c) { return (c === "w" ? "Wit" : "Zwart") + " aan zet — vind de beste zet."; },
      good: "Goed! Ga verder.",
      wrong: "Niet juist, probeer opnieuw.",
      solved: "Opgelost! Goed gedaan.",
      error: "Kon de puzzel niet laden."
    },
    en: {
      move: function (c) { return (c === "w" ? "White" : "Black") + " to move — find the best move."; },
      good: "Correct! Keep going.",
      wrong: "Not quite, try again.",
      solved: "Solved! Well done.",
      error: "Could not load the puzzle."
    }
  }[lang];

  var game, board, solution, solIndex, playerColor, busy, solved;

  function setStatus(msg) { if (statusEl) statusEl.textContent = msg; }

  function onDragStart(source, piece) {
    if (busy || solved) return false;
    if (playerColor === "w" && piece.search(/^b/) !== -1) return false;
    if (playerColor === "b" && piece.search(/^w/) !== -1) return false;
    if (game.turn() !== playerColor) return false;
  }

  function playOpponent() {
    if (solIndex >= solution.length) { finishSolved(); return; }
    var uci = solution[solIndex];
    game.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || "q" });
    solIndex++;
    board.position(game.fen());
    busy = false;
    if (solIndex >= solution.length) finishSolved();
    else setStatus(T.move(playerColor));
  }

  function finishSolved() {
    solved = true;
    busy = false;
    setStatus(T.solved);
    if (resetBtn) resetBtn.hidden = false;
  }

  function onDrop(source, target) {
    if (busy || solved) return "snapback";
    var expected = solution[solIndex];
    if (!expected || source + target !== expected.slice(0, 4)) {
      setStatus(T.wrong);
      return "snapback";
    }
    game.move({ from: source, to: target, promotion: expected[4] || "q" });
    solIndex++;
    if (solIndex >= solution.length) {
      finishSolved();
    } else {
      busy = true;
      setStatus(T.good);
      window.setTimeout(playOpponent, 500);
    }
  }

  function onSnapEnd() { board.position(game.fen()); }

  function start(fen, sol) {
    game = new Chess(fen);
    solution = sol;
    solIndex = 0;
    busy = false;
    solved = false;
    playerColor = game.turn();
    if (board) board.destroy();
    board = Chessboard("puzzle-board", {
      position: fen,
      orientation: playerColor === "w" ? "white" : "black",
      draggable: true,
      pieceTheme: pieceBase + "{piece}.png",
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd
    });
    setStatus(T.move(playerColor));
    if (resetBtn) resetBtn.hidden = true;
  }

  window.addEventListener("resize", function () { if (board) board.resize(); });

  var initialFen, initialSolution;
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (initialFen) start(initialFen, initialSolution);
    });
  }

  fetch("https://lichess.org/api/puzzle/daily")
    .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
    .then(function (data) {
      if (!data || !data.puzzle || !data.puzzle.fen || !data.puzzle.solution) {
        throw new Error("unexpected response");
      }
      initialFen = data.puzzle.fen;
      initialSolution = data.puzzle.solution;
      start(initialFen, initialSolution);
    })
    .catch(function () {
      setStatus(T.error);
      var el = document.getElementById("puzzle-board");
      if (el) el.hidden = true;
    });
})();
