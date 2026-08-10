---
layout: page
title: Results
lang_ref: results
permalink: /en/results/
---
<table class="results">
  <thead>
    <tr><th>Season</th><th>Division</th><th>Round</th><th>Opponent</th><th>Score</th></tr>
  </thead>
  <tbody>
  {% assign items = site.results | sort: "round" %}
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
