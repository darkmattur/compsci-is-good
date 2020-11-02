"use strict";

export default class Article{
    constructor(insert_nav_item_func){
        this.articles = {}
        this.article_index = 0
        this.insert_nav_item = insert_nav_item_func
    }

    addEventListeners(){
        let thisclass = this;
        //add js for carousel
        $(".carousel-control-next").on("click", () => {
            thisclass.article_index = (thisclass.article_index + 1).mod(Object.keys(thisclass.articles).length)
            thisclass.set_card_text(i)
        });

        $(".carousel-control-prev").on("click", () => {
            thisclass.article_index = (thisclass.article_index - 1).mod(Object.keys(thisclass.articles).length)
            thisclass.set_card_text(i)
        });

        $(".carousel-indicators>li").click(function () {
            console.log($(this))
            thisclass.article_index = parseInt($(this).attr('data-slide-to'))
            thisclass.set_card_text(i)
        });

        //inject article when read_more btn clicked
        $("#article-navbar .btn").on("click", () => {
            var article_name = Object.keys(thisclass.articles)[thisclass.article_index]
            thisclass.set_article_text(article_name)
        });
    }

    set_card_text(i) {
        var [article_name, article_data] = Object.entries(this.articles)[i]
        $('#article-navbar .card-title').text(article_name)
        $('#article-navbar .card-text').text(article_data['description'])
    }

    insert_carousel_item(image, slide_to, active){
        $(".carousel-inner").prepend(`
                <div class="carousel-item ${active}">
                    <img class="d-block" src= 'articles/images/${image}' alt="">
                </div>
            `)
    
            $('.carousel-indicators').append(`
                <li data-target="#CarouselTest" data-slide-to="${slide_to}" class="${active}"></li>
            `)
    }

    set_article_text(article_name) {
        var article_author = this.articles[article_name]['author']
        $('article').show()
        $('article .card-title').text(article_name)
        this.load_article(article_name);
        $('.article-author .btn').text(article_author)
        $('.article-author .btn').attr('href', '#'+article_author.dash_lower())
    }

    show_article(){
        $("#article-navbar").show();
        $("#article-container").show();
        $("#about-us-container").hide();
    }

    load_article(articleName) {
        // Reference to the tag we're updating
        var articleBody = document.getElementById('article-body');
        var articleName = articleName.dash_lower();
        // Load the article as HTML code. Then convert it to a
        // string. Finally, we insert the string in to `index.html` 
        fetch(`articles/${articleName}.html`)
            .then(HTMLcode => HTMLcode.text())
            .then(article => articleBody.innerHTML = article);
    }

    inject_dom(){
        let i = 0;
        for (var article_name in this.articles) {
            var article_data = this.articles[article_name]
            var active = (i == 0 ? "active" : '')

            if (i == 0) {
                this.set_card_text(i)
                this.set_article_text(article_name)
            }

            this.insert_carousel_item(article_data['image'], i, active)
            i++;
        }
    }

    setup(){
        let thisclass = this

        $.getJSON('/articles/articles.json', function (data) {
            thisclass.articles = data["articles"]
            thisclass.inject_dom()
            thisclass.addEventListeners();
        });
    }
}

/*
Instead of displaying a different HTML document for each article, a snippet of 
HTML code is inserted in to the `main` tag of `index.html` when the user wants 
to view a page. This creates the effect of visiting different webpages, but the 
user stays on `index.html`. That's why `index.html` looks empty. 

For example, if the user were to click on the "social media" button in the navbar,
the website would use Javascript to replace the `innerHTML` of the element with id `article-body` in 
`index.html` .
 */


/* loadArticle injects the HTML of a specified article
   in to the `main` tag of index.html.
 */