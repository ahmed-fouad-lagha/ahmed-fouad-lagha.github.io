// From: https://blog.briandrupieski.com/generate-anchors-in-jekyll-blog-post
// Vendored AnchorJS 5.0.0 (MIT): https://github.com/bryndrumsy/anchorjs

$(function() {
    // if a p only has an img inside of it, urlify the alt text 
    // of the img and set that as the p's id so anchors can use it
    $(".post_content p > img").each(function(idx, el) { 
        var $el = $(el);
        var idText = anchors.urlify("img-" + $el.attr("alt")); 
        $el.parent().attr("id", idText); 
    });
    // if a table has the "alt" property, use it to set the table's 
    // id otherwise just use the index of that table within .post-content
    $(".post_content table").each(function(idx, el) { 
        var $el = $(el);
        var uniqueTextForTable = $el.attr("alt") ? $el.attr("alt") : idx;
        var idText = anchors.urlify("table-" + uniqueTextForTable); 
        $el.attr("id", idText); 
    });
    anchors.options.visible = 'hover';
    anchors.add('.post_content h1, .post_content h2, .post_content h3, .post_content h4, .post_content h5, .post_content h6');
});