var Board;

Board = Backbone.View.extend(function () {

    var headerTemplate = [
        "<div class='row board-header'>",
            "<div class='small-1 columns'>&nbsp;</div>",
            "<% if (players < 3) { %>",
                "<div class='small-2 columns'>&nbsp;</div>",
            "<% } %>",
            "<div class='small-2 columns playerHead player1<%= player==='player1' ? ' board-header-active' : '' %>'>",
                "<div class='view'><%= playerNames.player1 %></div>",
                "<input class='edit' type='text' value='<%= playerNames.player1 %>' />",
            "</div>",
            "<% if (players > 2) { %>",
                "<div class='small-2 columns playerHead player2<%= player==='player2' ? ' board-header-active' : '' %>'>",
                    "<div class='view'><%= playerNames.player2 %></div>",
                    "<input class='edit' type='text' value='<%= playerNames.player2 %>' />",
                "</div>",
            "<% } %>",
            "<div class='small-2 columns game-mode js-restart-game'>",
                "<%= game %>",
            "</div>",
            "<% if (players === 2) { %>",
                "<div class='small-2 columns playerHead player2<%= player==='player2' ? ' board-header-active' : '' %>'>",
                    "<div class='view'><%= playerNames.player2 %></div>",
                    "<input class='edit' type='text' value='<%= playerNames.player2 %>' />",
                "</div>",
            "<% } %>",
            "<% if (players > 2) { %>",
                "<div class='small-2 columns playerHead player3<%= player==='player3' ? ' board-header-active' : '' %>'>",
                "<div class='view'><%= playerNames.player3 %></div>",
                "<input class='edit' type='text' value='<%= playerNames.player3 %>' />",
                "</div>",
            "<% } %>",
            "<% if (players > 3) { %>",
                "<div class='small-2 columns playerHead player4<%= player==='player4' ? ' board-header-active' : '' %>'>",
                    "<div class='view'><%= playerNames.player4 %></div>",
                    "<input class='edit' type='text' value='<%= playerNames.player4 %>' />",
                "</div>",
            "<% } %>",
            "<% if (players < 4) { %>",
                "<div class='small-2 columns'>&nbsp;</div>",
            "<% } %>",
            "<% if (players < 2) { %>",
                "<div class='small-2 columns'>&nbsp;</div>",
            "<% } %>",
            "<div class='small-1 columns'>&nbsp;</div>",
        "</div>"
    ].join(""),

    scoreTemplate = [
        "<% _.each(marks, function (mark, index) { %>",
            "<div class='row board-score<%= mark.closed ? ' closed' : '' %><%= index + 1 < marks.length && index % 3 === 2 ? ' board-section' : ''%>'>",
                "<div class='small-1 columns'>&nbsp;</div>",
                "<% if (mark.players < 3) { %>",
                    "<div class='small-2 columns'>&nbsp;</div>",
                "<% } %>",
                "<div class='small-2 columns player player1 js-value-<%= mark.value %>'><%= mark.player1Text %></div>",
                "<% if (mark.players > 2) { %>",
                    "<div class='small-2 columns player player2 js-value-<%= mark.value %>'><%= mark.player2Text %></div>",
                "<% } %>",
                "<div class='small-2 columns label board-divider js-mark'>",
                    "<%= mark.value %>",
                "</div>",
                "<% if (mark.players === 2) { %>",
                    "<div class='small-2 columns player player2 js-value-<%= mark.value %>'><%= mark.player2Text %></div>",
                "<% } %>",
                "<% if (mark.players > 2) { %>",
                    "<div class='small-2 columns player player3 js-value-<%= mark.value %>'><%= mark.player3Text %></div>",
                "<% } %>",
                "<% if (mark.players > 3) { %>",
                    "<div class='small-2 columns player player4 js-value-<%= mark.value %>'><%= mark.player4Text %></div>",
                "<% } %>",
                "<% if (mark.players < 4) { %>",
                    "<div class='small-2 columns'>&nbsp;</div>",
                "<% } %>",
                "<% if (mark.players < 2) { %>",
                    "<div class='small-2 columns'>&nbsp;</div>",
                "<% } %>",
                "<div class='small-1 columns'>&nbsp;</div>",
            "</div>",
        "<% }); %>"
    ].join(""),

    footerTemplate = [
        "<div class='row board-footer'>",
            "<div class='small-1 columns'>&nbsp;</div>",
            "<% if (players < 3) { %>",
                "<div class='small-2 columns'>&nbsp;</div>",
            "<% } %>",
            "<div class='small-2 columns player player1'><%= player1 %></div>",
            "<% if (players > 2) { %>",
                "<div class='small-2 columns player player2'><%= player2 %></div>",
            "<% } %>",
            "<div class='small-2 columns'>",
                "<a href='javascript:void(0)' class='alert button js-undo'>Undo</a>",
            "</div>",
            "<% if (players === 2) { %>",
                "<div class='small-2 columns player player2'><%= player2 %></div>",
            "<% } %>",
            "<% if (players > 2) { %>",
                "<div class='small-2 columns player player3'><%= player3 %></div>",
            "<% } %>",
            "<% if (players > 3) { %>",
                "<div class='small-2 columns player player4'><%= player4 %></div>",
            "<% } %>",
            "<% if (players < 4) { %>",
                "<div class='small-2 columns'>&nbsp;</div>",
            "<% } %>",
            "<% if (players < 2) { %>",
                "<div class='small-2 columns'>&nbsp;</div>",
            "<% } %>",
            "<div class='small-1 columns'>&nbsp;</div>",
        "</div>"
    ].join("");

    function initialize() {
        var view = this;

        view.templates = {
            header: _.template(headerTemplate),
            score: _.template(scoreTemplate),
            footer: _.template(footerTemplate)
        };

        view.logic = Games[view.options.game];

        view.state = {
            player: "player1",
            players: view.options.players,
            playerNames: { player1: "P1", player2: "P2", player3: "P3", player4: "P4" },
            game: view.options.game,
            cut: view.options.cut,
            rounds: 0,
            actions: []
        };

        view.logic.initialize(view);
    }

    function render() {
        var view = this,
            $header = $(view.templates.header(view.state)),
            $score = $(view.templates.score({
                marks: view.collection.toJSON()
            })),
            $footer = $(view.templates.footer(view.scores));

        view.$el.empty();
        view.$el.append($header)
            .append($score)
            .append($footer);
    }

    function updateScore(event) {
        var view = this;

        view.logic.updateScore(event, view, function () {
            view.render();
        });
    }

    function interpretPlayer($elem) {
        return $elem.hasClass("player1") ? "player1" :
            $elem.hasClass("player2") ? "player2" :
            $elem.hasClass("player3") ? "player3" : "player4";
    }

    function preventTextSelection(event) {
        event.preventDefault();
        return false;
    }

    function nextRound(event) {
        var view = this,
            $target = $(event.currentTarget),
            player = interpretPlayer($target);

        view.$(".board-header .player").removeClass("board-header-active");
        $(".board-header ." + player).addClass("board-header-active");

        view.state.player = player;
        view.state.rounds++;

        view.logic.nextRound(event, view, function () {
            view.render();
        });
    }

    function undo() {
        var view = this,
            action = view.state.actions.pop(),
            currentPlayer = interpretPlayer(view.$(".board-header-active"));

        if (!action) {
            return;
        }

        view.logic.undo(view, action, currentPlayer, function () {
            view.render();
        });
    }

    function restartGame() {
        var view = this;

        view.initialize();
        view.render();
    }

    function editPlayer(event) {
        var view = this,
            $target = $(event.currentTarget),
            player = interpretPlayer($target);

        $(".board-header ." + player).addClass("editing");
        $(".board-header ." + player + " > input").focus().select();
    }

    function updateOnEnter(event) {
        if (event.keyCode == 13) {
            var view = this,
                $target = $(event.currentTarget),
                player = interpretPlayer( $target.parent() );

            view.state.playerNames[player] = $target.val();
            $(".board-header ." + player).removeClass("editing");
            view.render();
        }
    }

    var events = {
        "click      .js-mark":          updateScore,
        "click      .js-undo":          undo,
        "mousedown  .columns":          preventTextSelection,
        "click      .player":           nextRound,
        "dblclick   .playerHead":       editPlayer,
        "keypress   .edit":             updateOnEnter,
        "click      .js-restart-game":  restartGame
    };

    return {
        events: events,

        initialize: initialize,
        render: render
    };

}());
