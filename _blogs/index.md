---
layout: default
title: "Blogs"
permalink: /blogs/
class: "blog"
sidebar_exclude: true
---
## Blogs

{% for blog in site.blogs %}
{% if blog.url != page.url %}
* ({{ blog.show_date }}) [{{blog.title}}]({{ blog.url | relative_url }})
    * {{ blog.desc }}
{% endif %}
{% endfor %}