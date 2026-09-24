---
layout: default
title: "Games"
permalink: /games/
---
## Want to play?

{% for game in site.games %}
{% if game.title != "Games" %}
* {{ game.title }}
    * Link: [Click me!]({{ game.url | relative_url }})
    * Command: Run `{{ game.command }}` in Start->Run
{% endif %}
{% endfor %}

## Have fun!