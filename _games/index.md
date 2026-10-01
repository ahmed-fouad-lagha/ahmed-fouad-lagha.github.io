---
layout: default
title: "Games"
permalink: /games/
desc: "Playable Windows 95 games on this site: Minesweeper, Pac-Man, and Tetris."
sidebar_exclude: true
---
## Want to play?

{% for game in site.games %}
{% if game.url != page.url %}
* {{ game.title }}
    * Link: [Click me!]({{ game.url | relative_url }})
    * Command: Run `{{ game.command }}` in Start->Run
{% endif %}
{% endfor %}

## Have fun!