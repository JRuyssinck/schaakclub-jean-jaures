// Simple email-address obfuscation: the address never appears as plain
// text or as a mailto: href in the static HTML, only as reversed
// fragments in data attributes. This blocks the vast majority of simple
// scrapers that just regex static HTML for "@" patterns or mailto: links.
// Not bulletproof against a scraper that executes JavaScript, but that's
// a much smaller, more targeted category of bot. Real visitors with JS
// enabled get a normal, clickable mailto link with the address as a
// tooltip.
(function () {
  document.querySelectorAll(".protected-email").forEach(function (el) {
    var user = el.dataset.user.split("").reverse().join("");
    var domain = el.dataset.domain.split("").reverse().join("");
    var address = user + "@" + domain;
    el.href = "mailto:" + address;
    el.title = address;
  });
})();
