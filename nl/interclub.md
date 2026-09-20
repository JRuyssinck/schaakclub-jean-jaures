---
layout: page
title: Interclub
lang_ref: interclub
permalink: /nl/interclub/
---
Onze interclubploegen spelen in de Oost-Vlaamse liga (VSF). Thuiswedstrijden worden gespeeld
op zondag in de IVG-school, Kazernenstraat 16, 9000 Gent — zie [Wanneer & Waar]({{ "/nl/schedule/" | relative_url }})
voor de locatie. Bij uitwedstrijden speel je bij de tegenstander.

## Kalender september - december 2026

<div class="table-scroll">
<table class="results">
  <thead><tr><th>Datum</th><th>Thuis/Uit</th></tr></thead>
  <tbody>
    <tr data-date="2026-09-27"><td>27 september</td><td>Uit</td></tr>
    <tr data-date="2026-10-11"><td>11 oktober</td><td>Thuis</td></tr>
    <tr data-date="2026-11-15"><td>15 november</td><td>Uit</td></tr>
    <tr data-date="2026-11-29"><td>29 november</td><td>Thuis</td></tr>
    <tr data-date="2026-12-20"><td>20 december</td><td>Uit</td></tr>
  </tbody>
</table>
</div>

Meer data volgen later.

<div id="results-gate" class="results-gate" data-hash="af83146faaac21dfa259691c4583c0540d78e14c993f7ee5bc27ecf5ab5bdecb">
  <p>De stand en de detailuitslagen zijn enkel voor clubleden. Vraag het wachtwoord aan een bestuurslid.</p>
  <form id="results-gate-form">
    <input type="password" id="results-gate-input" placeholder="Wachtwoord" required>
    <button type="submit">Inloggen</button>
    <p id="results-gate-error" class="gate-error" hidden></p>
  </form>
</div>

<div id="results-content" hidden>

<h2>Stand</h2>

<p><em>De stand wordt binnenkort aangevuld.</em></p>

<h2>Detailuitslagen</h2>

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
<script src="{{ "/assets/js/highlight-next.js" | relative_url }}"></script>
