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
                  "<button type='button' class='btn btn-default active'>4</button>",
                  "<button type='button' class='btn btn-default'>5</button>",
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

        view.$el.append(view.templates.modal({}));
    }

    function newGame() {
        var view = this,
            players = parseInt( view.$(".js-players .active").text(), 10),
            game = view.$(".js-game .active").text(),
            cut = view.$(".js-options [name='cut']")[0].classList.contains('active');

        if (players && game) {
            view.state = {
                players: players,
                game: game,
                cut: cut
            };

            view.trigger("new",  view.state);
        }
    }

    function updatePlayers(event) {
        $(".js-players .btn").removeClass("active");
        $(event.currentTarget).addClass("active");
    }

    function updateGame(event) {
        $(".js-game .btn").removeClass("active");
        $(event.currentTarget).addClass("active");
    }

    function updateOptions(event) {
        $(event.currentTarget).toggleClass("active");
    }

    var events = {
        "click .js-new-game":       newGame,
        "click .js-players .btn":   updatePlayers,
        "click .js-game .btn":      updateGame,
        "click .js-options .btn":   updateOptions
    };

    return {
        events: events,
        template: template,

        initialize: initialize,
        render: render,
    };

}());
