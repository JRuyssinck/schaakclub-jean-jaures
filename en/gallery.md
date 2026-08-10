---
layout: page
title: Gallery
lang_ref: gallery
permalink: /en/gallery/
---
<ul class="gallery-grid">
{% for item in site.data.gallery %}
  <li><img src="{{ "/assets/img/gallery/" | append: item.file | relative_url }}" alt="{{ item.alt_en }}" width="{{ item.width }}" height="{{ item.height }}" loading="lazy"></li>
{% endfor %}
</ul>
