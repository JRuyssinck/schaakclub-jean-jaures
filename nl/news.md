---
layout: page
title: Nieuws
lang_ref: news
permalink: /nl/news/
---
<ul class="news-list">
{% assign items = site.news | where: "lang", "nl" | sort: "date" | reverse %}
{% for item in items %}
  <li>
    <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
    <div class="meta">{{ item.date | date: "%-d %B %Y" }}</div>
    <p>{{ item.excerpt }}</p>
  </li>
{% endfor %}
</ul>
