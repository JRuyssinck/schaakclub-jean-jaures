---
layout: page
title: News
lang_ref: news
permalink: /en/news/
---
<ul class="news-list">
{% assign items = site.news | where: "lang", "en" | sort: "date" | reverse %}
{% for item in items %}
  <li>
    <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
    <div class="meta">{% include localized-date.html date=item.date lang=page.lang %}</div>
    <p>{{ item.excerpt }}</p>
  </li>
{% endfor %}
</ul>
