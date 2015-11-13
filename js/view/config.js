var Config;

Config = Backbone.View.extend(function () {

    template = [
        "<div class='modal fade' id='config-modal' role='dialog'>",
          "<div class='modal-dialog' role='document'>",
            "<div class='modal-content'>",
              "<div class='modal-header'>",
                "<button type='button' class='close' data-dismiss='modal' aria-label='close'>",
                  "<span aria-hidden='true'>&times;</span>",
                "</button>",
                "<h4 class='modal-title'>Game</h4>",
              "</div>",
              "<div class='modal-body'>",
                "<h5># of Players</h5>",
                "<div class='btn-group btn-group-lg js-players' id='players'>",
                  "<button type='button' class='btn btn-default'>1</button>",
                  "<button type='button' class='btn btn-default'>2</button>",
                  "<button type='button' class='btn btn-default'>3</button>",
                  "<button type='button' class='btn btn-default'>4</button>",
                "</div>",
                "<h5>Game</h5>",
                "<div class='btn-group btn-group-lg js-game'>",
                  "<% _.each(Games, function (game, name) { %>",
                    "<button type='button' class='btn btn-default'><%= name %></button>",
                  "<% }); %>",
                "</div>",
                "<h5>Options</h5>",
                "<div class='btn-group btn-group-lg js-options'>",
                   "<button type='button' name='cut' class='btn btn-default'>Cut-Throat</button>",
                "</div>",
              "</div>",
              "<div class='modal-footer'>",
                "<button type='button' class='btn btn-default' data-dismiss='modal'>Cancel</a>",
                "<button type='button' class='btn btn-primary js-new-game'>OK</a>",
              "</div>",
            "</div>",
          "</div>",
        "</div>"
    ].join("");

    function initialize() {
        var view = this;

        view.templates = {
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

        view.$el.append(view.templates.modal(view.state))

        //view.$(".js-game .button")
            //.first()
            //.removeClass("secondary");
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

        //view.$(".js-players .button").addClass("secondary");
        //$target.removeClass("secondary");
    }

    function updateGame(event) {
        var view = this,
            $target = $(event.currentTarget),
            game = $target.text();

        view.state.game = game;

        //view.$(".js-game .button").addClass("secondary");
        //$target.removeClass("secondary");
    }

    function updateOptions(event) {
        var view = this,
            $target = $(event.currentTarget),
            option = $target.prop("name");

        //view.state[option] = $target.hasClass("secondary") ? true : false;

        //$target.toggleClass("secondary");
    }

    var events = {
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
    };

}());
