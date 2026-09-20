---
layout: page
title: Interclub
lang_ref: interclub
permalink: /en/interclub/
---
Our interclub teams play in the East Flanders league (VSF). Home matches are played on
Sundays at IVG-school, Kazernenstraat 16, 9000 Ghent — see [When & Where]({{ "/en/schedule/" | relative_url }})
for the location. Away matches are played at the opponent's venue.

## Calendar September - December 2026

<div class="table-scroll">
<table class="results">
  <thead><tr><th>Date</th><th>Home/Away</th></tr></thead>
  <tbody>
    <tr data-date="2026-09-27"><td>September 27</td><td>Away</td></tr>
    <tr data-date="2026-10-11"><td>October 11</td><td>Home</td></tr>
    <tr data-date="2026-11-15"><td>November 15</td><td>Away</td></tr>
    <tr data-date="2026-11-29"><td>November 29</td><td>Home</td></tr>
    <tr data-date="2026-12-20"><td>December 20</td><td>Away</td></tr>
  </tbody>
</table>
</div>

More dates will follow later.

<div id="results-gate" class="results-gate" data-hash="af83146faaac21dfa259691c4583c0540d78e14c993f7ee5bc27ecf5ab5bdecb">
  <p>The standings and detailed results are for club members only. Ask a board member for the password.</p>
  <form id="results-gate-form">
    <input type="password" id="results-gate-input" placeholder="Password" required>
    <button type="submit">Log in</button>
    <p id="results-gate-error" class="gate-error" hidden></p>
  </form>
</div>

<div id="results-content" hidden>

<h2>Standings</h2>

<p><em>Standings will be added soon.</em></p>

<h2>Detailed results</h2>

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
<script src="{{ "/assets/js/highlight-next.js" | relative_url }}"></script>
