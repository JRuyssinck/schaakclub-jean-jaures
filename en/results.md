---
layout: page
title: Results
lang_ref: results
permalink: /en/results/
---
<div id="results-gate" class="results-gate" data-hash="af83146faaac21dfa259691c4583c0540d78e14c993f7ee5bc27ecf5ab5bdecb">
  <p>This page is for club members only. Ask a board member for the password.</p>
  <form id="results-gate-form">
    <input type="password" id="results-gate-input" placeholder="Password" required>
    <button type="submit">Log in</button>
    <p id="results-gate-error" class="gate-error" hidden></p>
  </form>
</div>

<div id="results-content" hidden>
<div class="table-scroll">
<table class="results">
  <thead>
    <tr><th>Season</th><th>Division</th><th>Round</th><th>Opponent</th><th>Score</th></tr>
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
