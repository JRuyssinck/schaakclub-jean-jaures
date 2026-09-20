// Highlights the next upcoming date in any table row carrying a data-date
// attribute, comparing against the visitor's local date. This has to run
// client-side because the site is static -- there's no build step that
// re-runs as time passes, so a build-time "next match" would go stale.
(function () {
  var rows = document.querySelectorAll("tr[data-date]");
  if (!rows.length) return;

  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var next = null;
  rows.forEach(function (row) {
    var rowDate = new Date(row.getAttribute("data-date"));
    if (rowDate >= today && (!next || rowDate < new Date(next.getAttribute("data-date")))) {
      next = row;
    }
  });

  if (next) next.classList.add("next-match");
})();
