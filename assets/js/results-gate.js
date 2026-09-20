// Casual password gate for the results page. This is NOT real security --
// it's plain client-side JS shipped to every visitor, so the hash and the
// gated content are both inspectable via browser dev tools. It's meant only
// as a soft speed-bump for casual visitors, matching the club's request for
// "just a simple password" in front of non-sensitive match results.
(function () {
  var STORAGE_KEY = "resultsUnlocked";

  var gate = document.getElementById("results-gate");
  var content = document.getElementById("results-content");
  if (!gate || !content) return;

  var expectedHash = gate.dataset.hash;
  var form = document.getElementById("results-gate-form");
  var input = document.getElementById("results-gate-input");
  var error = document.getElementById("results-gate-error");
  var lang = document.documentElement.lang === "en" ? "en" : "nl";
  var errorText = {
    nl: "Fout wachtwoord, probeer opnieuw.",
    en: "Wrong password, try again.",
  }[lang];

  function unlock() {
    gate.hidden = true;
    content.hidden = false;
  }

  function sha256Hex(text) {
    var data = new TextEncoder().encode(text);
    return crypto.subtle.digest("SHA-256", data).then(function (digest) {
      return Array.from(new Uint8Array(digest))
        .map(function (b) {
          return b.toString(16).padStart(2, "0");
        })
        .join("");
    });
  }

  if (window.localStorage.getItem(STORAGE_KEY) === expectedHash) {
    unlock();
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    sha256Hex(input.value.trim()).then(function (attempt) {
      if (attempt === expectedHash) {
        window.localStorage.setItem(STORAGE_KEY, expectedHash);
        unlock();
      } else {
        error.textContent = errorText;
        error.hidden = false;
        input.value = "";
        input.focus();
      }
    });
  });
})();
