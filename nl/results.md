---
layout: page
title: Resultaten
lang_ref: results
permalink: /nl/results/
---
<div id="results-gate" class="results-gate" data-hash="af83146faaac21dfa259691c4583c0540d78e14c993f7ee5bc27ecf5ab5bdecb">
  <p>Deze pagina is enkel voor clubleden. Vraag het wachtwoord aan een bestuurslid.</p>
  <form id="results-gate-form">
    <input type="password" id="results-gate-input" placeholder="Wachtwoord" required>
    <button type="submit">Inloggen</button>
    <p id="results-gate-error" class="gate-error" hidden></p>
  </form>
</div>

<div id="results-content" hidden>
<div class="table-scroll">
<table class="results">
  <thead>
    <tr><th>Seizoen</th><th>Afdeling</th><th>Ronde</th><th>Tegenstander</th><th>Score</th></tr>
  </thead>
  <tbody>
  {% assign items = site.results | sort: "sort_key" | reverse %}
  {% for item in items %}
    <tr>
      <td>{{ item.season }}</td>
      <td>{{ item.division }}</td>
      <td>{{ item.round }}</td>
      <td>{{ item.opponent }}</td>
      <td>{{ item.score }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
</div>
</div>

<script src="{{ "/assets/js/results-gate.js" | relative_url }}"></script>
