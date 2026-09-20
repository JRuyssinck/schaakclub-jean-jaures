// "Stelling van de dag" / "Position of the day": picks the same puzzle for
// every visitor on a given calendar day (day-of-year modulo puzzle count),
// from a small static list in _data/puzzles.yml. This is a static site with
// no backend, so "daily rotation" is computed client-side from the
// visitor's local date -- not a real chess engine, just a board renderer
// plus a reveal-the-solution button.
(function () {
  var container = document.querySelector(".puzzle");
  if (!container) return;

  var dataEl = document.getElementById("puzzle-data");
  if (!dataEl) return;
  var puzzles = JSON.parse(dataEl.textContent);
  if (!puzzles.length) return;

  var lang = container.dataset.lang === "en" ? "en" : "nl";

  var now = new Date();
  var startOfYear = new Date(now.getFullYear(), 0, 0);
  var dayOfYear = Math.floor((now - startOfYear) / 86400000);
  var puzzle = puzzles[dayOfYear % puzzles.length];

  var PIECES = {
    K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
    k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
  };

  function makeSquare(rank, file, glyph) {
    var sq = document.createElement("div");
    var isLight = (rank + file) % 2 === 0;
    sq.className = "puzzle-square " + (isLight ? "light" : "dark");
    if (glyph) sq.textContent = glyph;
    return sq;
  }

  var board = document.getElementById("puzzle-board");
  var rows = puzzle.fen.split(" ")[0].split("/");
  rows.forEach(function (row, rankIndex) {
    var file = 0;
    for (var i = 0; i < row.length; i++) {
      var ch = row[i];
      if (/\d/.test(ch)) {
        var empties = parseInt(ch, 10);
        for (var e = 0; e < empties; e++) {
          board.appendChild(makeSquare(rankIndex, file, ""));
          file++;
        }
      } else {
        board.appendChild(makeSquare(rankIndex, file, PIECES[ch] || ""));
        file++;
      }
    }
  });

  document.getElementById("puzzle-caption").textContent = puzzle["caption_" + lang];

  var revealBtn = document.getElementById("puzzle-reveal");
  var solutionEl = document.getElementById("puzzle-solution");
  revealBtn.addEventListener("click", function () {
    solutionEl.textContent = puzzle["solution_" + lang];
    solutionEl.hidden = false;
    revealBtn.hidden = true;
  });
})();
