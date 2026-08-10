---
layout: page
title: Resultaten
lang_ref: results
permalink: /nl/results/
---
<table class="results">
  <thead>
    <tr><th>Seizoen</th><th>Afdeling</th><th>Ronde</th><th>Tegenstander</th><th>Score</th></tr>
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
