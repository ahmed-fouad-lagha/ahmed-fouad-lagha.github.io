---
layout: default
title: "Blogs"
permalink: /blogs/
class: "blog"
---
## Blogs

{% for blog in site.blogs %}
{% if blog.title != "Blogs" %}
* ({{ blog.show_date }}) [{{blog.title}}]({{ blog.url | relative_url }}#post)
    * {{ blog.desc }}
{% endif %}
{% endfor %}
