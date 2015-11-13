var Board;

Board = Backbone.View.extend(function () {

    var headerTemplate = [
       "<div class='row board-header'>",
            "<% if (players < 3) { %>",
                "<div class='small-2 columns'>&nbsp;</div>",
            "<% } %>",
            "<div class='small-2 columns playerHead player1'>",
                "<div class='view'><%= playerNames['1'] %></div>",
                "<input class='edit' type='text' maxlength='9' value='<%= playerNames['1'] %>' />",
            "</div>",
            "<% if (players > 2) { %>",
                "<div class='small-2 columns playerHead player2'>",
                    "<div class='view'><%= playerNames['2'] %></div>",
                    "<input class='edit' type='text' maxlength='9' value='<%= playerNames['2'] %>' />",
                "</div>",
            "<% } %>",
            "<div class='small-2 columns'><%= rounds %></div>",
            "<% if (players === 2) { %>",
                "<div class='small-2 columns playerHead player2'>",
                    "<div class='view'><%= playerNames['2'] %></div>",
                    "<input class='edit' type='text' maxlength='9' value='<%= playerNames['2'] %>' />",
                "</div>",
            "<% } %>",
            "<% if (players > 2) { %>",
                "<div class='small-2 columns playerHead player3'>",
                "<div class='view'><%= playerNames['3'] %></div>",
                "<input class='edit' type='text' maxlength='9' value='<%= playerNames['3'] %>' />",
                "</div>",
            "<% } %>",
            "<% if (players > 3) { %>",
                "<div class='small-2 columns playerHead player4'>",
                    "<div class='view'><%= playerNames['4'] %></div>",
                    "<input class='edit' type='text' maxlength='9' value='<%= playerNames['4'] %>' />",
                "</div>",
            "<% } %>",
            "<% if (players < 4) { %>",
                "<div class='small-2 columns'>&nbsp;</div>",
            "<% } %>",
            "<% if (players < 2) { %>",
                "<div class='small-2 columns'>&nbsp;</div>",
            "<% } %>",
            "<div class='small-2 columns board-button-container'>",
                "<a href='javascript:void(0)' class='alert button board-button js-next'>No Score</a>",
            "</div>",
        "</div>"
    ].join(""),

    scoreTemplate = [
        "<% _.each(marks, function (mark, index) { %>",
            "<div class='row board-score<%= mark.closed ? ' closed' : '' %><%= index + 1 < marks.length && index % 3 === 2 ? ' board-section' : ''%>'>",
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
                "<div class='small-2 columns'>&nbsp;</div>",
            "</div>",
        "<% }); %>"
    ].join(""),

    footerTemplate = [
        "<div class='row board-footer'>",
            "<% if (typeof(scores['3']) === 'undefined') { %>",
                "<div class='small-2 columns'>&nbsp;</div>",
            "<% } %>",
            "<div class='small-2 columns player1'><%= scores['1'] %></div>",
            "<% if (typeof(scores['3']) !== 'undefined') { %>",
                "<div class='small-2 columns player2'><%= scores['2'] %></div>",
            "<% } %>",
            "<div class='small-2 columns bord-button-container'>",
                "<a href='javascript:void(0)' class='alert button board-button js-undo'>Undo</a>",
            "</div>",
            "<% if (typeof(scores['2']) !== 'undefined' && typeof(scores['3']) === 'undefined') { %>",
                "<div class='small-2 columns player2'><%= scores['2'] %></div>",
            "<% } %>",
            "<% if (typeof(scores['3']) !== 'undefined') { %>",
                "<div class='small-2 columns player3'><%= scores['3'] %></div>",
            "<% } %>",
            "<% if (typeof(scores['4']) !== 'undefined') { %>",
                "<div class='small-2 columns player4'><%= scores['4'] %></div>",
            "<% } %>",
            "<% if (typeof(scores['4']) === 'undefined') { %>",
                "<div class='small-2 columns'>&nbsp;</div>",
            "<% } %>",
            "<% if (typeof(scores['2']) === 'undefined') { %>",
                "<div class='small-2 columns'>&nbsp;</div>",
            "<% } %>",
            "<div class='small-2 columns'>&nbsp;</div>",
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
            player: '1',
            startPlayer: '1',
            players: view.options.players,
            playerNames: { '1': "P1", '2': "P2", '3': "P3", '4': "P4" },
            game: view.options.game,
            cut: view.options.cut,
            rounds: 1,
            actions: [],
            finished: undefined
        };

        view.logic.initialize(view);
    }

    function newGame() {
        var view = this,
            lastStartPlayer = parseInt(view.state.startPlayer);

        view.state.startPlayer  = (lastStartPlayer < view.state.players) ? lastStartPlayer + 1 : 1;
        view.state.player       = view.state.startPlayer;
        view.state.rounds       = 1;
        view.state.actions      = [];
        view.state.finished     = undefined;

        view.logic.initialize(view);
    }

    function render() {
        var view = this,
            $header = $(view.templates.header(view.state)),
            $score = $(view.templates.score({
                marks: view.collection.toJSON()
            })),
            $footer = $(view.templates.footer(view));

        view.$el.empty();
        view.$el.append($header)
            .append($score)
            .append($footer);

        view.$(".board-header .player").removeClass("active");
        $(".board-header .player" + view.state.player).addClass("active");

        view.$(".board-score .player").removeClass("active");
        $(".board-score .player" + view.state.player).addClass("active");

        var game = view.state.game;
        game += view.state.cut ? '-Cut' : '';
        $('.js-game-title').text(game);
    }

    function updateScoreMark(event) {
        var view    = this,
            $mark   = $(event.currentTarget);

        clearTimeout(view.state.nextTimer);

        view.logic.updateScore( $mark, view, function() { return postUpdateScore(view) } );
    }

    function updateScoreValue(event) {
        var view    = this,
            $target = $(event.currentTarget),
            $mark   = $target.siblings('.js-mark'),
            player  = interpretPlayer($target);

        clearTimeout(view.state.nextTimer);

        if (player != view.state.player) {
            return false;
        }

        view.logic.updateScore( $mark, view, function() { return postUpdateScore(view) } );
    }

    function postUpdateScore(view) {
        if (view.state.finished) {
            var name = view.state.playerNames[view.state.finished];

            if ( window.confirm(name + " has won. Restart the game?") ) {
                view.newGame();
            }
            else {
                view.state.finished = undefined;
            }
        }
        else {
            view.state.nextTimer = setTimeout('$(".js-next").trigger("click")', 4000);
        }

        view.render();
    }

    function interpretPlayer($elem) {
        return $elem.hasClass("player1") ? 1
            : $elem.hasClass("player2") ? 2
            : $elem.hasClass("player3") ? 3
            : $elem.hasClass("player4") ? 4
            : 0;
    }

    function preventTextSelection(event) {
        event.preventDefault();
        return false;
    }

    function next() {
        var view = this;

        clearTimeout(view.state.nextTimer);
        view.logic.next(view, function() {
            view.render();
        } );

        view.render();
    }

    function undo() {
        var view = this,
            action = view.state.actions.pop();

        if (!action) {
            return;
        }

        clearTimeout(view.state.nextTimer);
        view.state.nextTimer = setTimeout('$(".js-next").trigger("click")', 4000);

        view.logic.undo(view, action, function() {
            view.render();
        } );
    }

    function editPlayer(event) {
        var player = interpretPlayer( $(event.currentTarget) );

        $(".board-header .player" + player).addClass("editing");
        $(".board-header .player" + player + " > input").focus().select();
    }

    function keypressOnEdit(event) {
        if (event.keyCode == 13) {
            this.closeEdit(event);
        }
        else if (event.keyCode == 9) {
            this.closeEdit(event);
            this.nextEdit(event);
        }
    }

    function closeEdit(event) {
         var view = this,
             $target = $(event.currentTarget),
             value = $target.val(),
             player = interpretPlayer( $target.parent() );

         view.state.playerNames[player] = value.substring(0, 9);
         $(".board-header .player" + player + " .view").html(value.substring(0, 9));
         $(".board-header .player" + player).removeClass("editing");
    }

    function nextEdit(event) {
        var view = this,
            player = interpretPlayer( $(event.currentTarget).parent() );

         nextPlayer = (player < view.state.players) ? player + 1 : 1;
         $(".board-header .player" + nextPlayer).addClass("editing");
         $(".board-header .player" + nextPlayer + " > input").focus().select();
    }

    var events = {
        "click      .js-mark":          updateScoreMark,
        "click      .player":           updateScoreValue,
        "click      .js-next":          next,
        "click      .js-undo":          undo,
        "mousedown  .columns":          preventTextSelection,
        "dblclick   .playerHead":       editPlayer,
        "keypress   .edit":             keypressOnEdit,
        "blur       .edit":             closeEdit,
    };

    return {
        events: events,

        initialize: initialize,
        newGame: newGame,
        closeEdit: closeEdit,
        nextEdit: nextEdit,
        render: render
    };

}());
