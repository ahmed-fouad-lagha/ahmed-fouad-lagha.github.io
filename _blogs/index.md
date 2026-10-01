---
layout: default
title: "Blogs"
permalink: /blogs/
desc: "Writing by Ahmed Fouad Lagha on machine learning, differential privacy, and synthetic data."
class: "blog"
sidebar_exclude: true
---
<ul class="blog_list">
    {% for blog in site.blogs %}
    {% if blog.url != page.url %}
    <li class="blog_entry">
        <a class="blog_link" href="{{ blog.url | relative_url }}">{{ blog.title }}</a>
        <span class="blog_date">{{ blog.show_date }}</span>
        <p class="blog_desc">{{ blog.desc }}</p>
    </li>
    {% endif %}
    {% endfor %}
</ul>