---
layout: page
title: Foto's
lang_ref: gallery
permalink: /nl/gallery/
---
<ul class="gallery-grid">
{% for item in site.data.gallery %}
  <li><img src="{{ "/assets/img/gallery/" | append: item.file | relative_url }}" alt="{{ item.alt_nl }}"></li>
{% endfor %}
</ul>
