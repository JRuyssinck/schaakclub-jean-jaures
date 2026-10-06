// Makes the embedded Lichess daily-puzzle board follow the site's
// light/dark mode. The iframe ships with bg=light in the static HTML so
// it works without JS; if the visitor prefers dark, we rewrite the src
// once to bg=dark. The board itself is fully interactive (moves are
// validated by Lichess), rotates daily on their side, and needs no
// puzzle data maintained here.
(function () {
  var frame = document.getElementById("puzzle-frame");
  if (!frame) return;
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    frame.src = frame.src.replace("bg=light", "bg=dark");
  }
})();
