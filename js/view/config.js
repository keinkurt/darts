var Config;

Config = Backbone.View.extend(function () {

    var overlayTemplate = [
        "<div class='js-modal-background modal-background'>",
        "</div>"
    ].join(""),

    template = [
        "<div class='js-modal-dialog modal'>",
            "<div class='modal-header'><h3>Game</h3></div>",
            "<div class='modal-description'>",
                "<label for='tabs'># of Players</label>",
                "<ul class='button-group js-players'>",
                    "<li><a href='#' class='button secondary'>1</a></li>",
                    "<li><a href='#' class='button secondary'>2</a></li>",
                    "<li><a href='#' class='button secondary'>3</a></li>",
                    "<li><a href='#' class='button'>4</a></li>",
                "</ul>",
                "<label for='tabs'>Game</label>",
                "<ul class='button-group js-game'>",
                    "<% _.each(Games, function (game, name) { %>",
                        "<li><a href='#' class='button secondary'><%= name %></a></li>",
                    "<% }); %>",
                "</ul>",
                "<label for='tabs'>Options</label>",
                "<ul class='button-group js-options'>",
                     "<li><a href='#' name='cut' class='button secondary'>Cut-Throat</a></li>",
                "</ul>",
            "</div>",
            "<div class='modal-footer'>",
                "<a href='#' class='js-modal-close'>Cancel</a>",
                "<a href='#' class='button success js-new-game'>OK</a>",
            "</div>",
        "</div>"
    ].join("");

    function initialize() {
        var view = this;

        view.templates = {
            overlay: _.template(overlayTemplate),
            modal: _.template(template)
        };
    }

    function render() {
        var view = this;

        view.state = {
            players: 4,
            game: "Cricket",
            cut: false
        };

        $("body")
            .append(view.templates.overlay({}))
            .find(".js-modal-background")
            .fadeIn(100);

        view.$el
            .append(view.templates.modal(view.state))
            .find(".js-modal-dialog")
            .fadeIn(100)
            .css({ top: 0 });

        view.$(".js-game .button")
            .first()
            .removeClass("secondary");
    }

    function remove(event) {
        var $dialog = $(".js-modal-dialog"),
            $background = $(".js-modal-background");

        if (event) { event.preventDefault(); }

        $dialog
            .css({ top: "-560px" });

        $background
            .fadeOut(300, function onComplete() {
                $background.remove();
                $dialog.remove();
            });
    }

    function newGame() {
        var view = this;

        view.trigger("new",  view.state);
    }

    function updatePlayers(event) {
        var view = this,
            $target = $(event.currentTarget),
            playersText = $target.text(),
            players = parseInt(playersText, 10);

        view.state.players = players;

        view.$(".js-players .button").addClass("secondary");
        $target.removeClass("secondary");
    }

    function updateGame(event) {
        var view = this,
            $target = $(event.currentTarget),
            game = $target.text();

        view.state.game = game;

        view.$(".js-game .button").addClass("secondary");
        $target.removeClass("secondary");
    }

    function updateOptions(event) {
        var view = this,
            $target = $(event.currentTarget),
            option = $target.prop("name");

        view.state[option] = $target.hasClass("secondary") ? true : false;

        $target.toggleClass("secondary");
    }

    var events = {
        "click .js-modal-close" : remove,
        "click .js-new-game": newGame,
        "click .js-players .button": updatePlayers,
        "click .js-game .button": updateGame,
        "click .js-options .button": updateOptions
    };

    return {
        events: events,
        template: template,

        initialize: initialize,
        render: render,
        remove: remove
    }; 

}());
