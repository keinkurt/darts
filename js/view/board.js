var Board;

Board = Backbone.View.extend(function () {

    var headerTemplate = [
        "<div id='restart-dialog'>",
            "<p>",
                "<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>",
                "Do you really want to restart the game?",
            "</p>",
        "</div>",
        "<div class='row board-header'>",
            "<div class='small-1 columns'>&nbsp;</div>",
            "<% if (players < 3) { %>",
                "<div class='small-2 columns'>&nbsp;</div>",
            "<% } %>",
            "<div class='small-2 columns playerHead player1'>",
                "<div class='view'><%= playerNames['1'] %></div>",
                "<input class='edit' type='text' value='<%= playerNames['1'] %>' />",
            "</div>",
            "<% if (players > 2) { %>",
                "<div class='small-2 columns playerHead player2'>",
                    "<div class='view'><%= playerNames['2'] %></div>",
                    "<input class='edit' type='text' value='<%= playerNames['2'] %>' />",
                "</div>",
            "<% } %>",
            "<div class='small-2 columns board-button-container'>",
                "<a href='javascript:void(0)' class='alert button board-button js-next'>Next</a>",
            "</div>",
            "<% if (players === 2) { %>",
                "<div class='small-2 columns playerHead player2'>",
                    "<div class='view'><%= playerNames['2'] %></div>",
                    "<input class='edit' type='text' value='<%= playerNames['2'] %>' />",
                "</div>",
            "<% } %>",
            "<% if (players > 2) { %>",
                "<div class='small-2 columns playerHead player3'>",
                "<div class='view'><%= playerNames['3'] %></div>",
                "<input class='edit' type='text' value='<%= playerNames['3'] %>' />",
                "</div>",
            "<% } %>",
            "<% if (players > 3) { %>",
                "<div class='small-2 columns playerHead player4'>",
                    "<div class='view'><%= playerNames['4'] %></div>",
                    "<input class='edit' type='text' value='<%= playerNames['4'] %>' />",
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
            player: '1',
            players: view.options.players,
            playerNames: { '1': "P1", '2': "P2", '3': "P3", '4': "P4" },
            game: view.options.game,
            cut: view.options.cut,
            rounds: 0,
            actions: [],
            finished: undefined
        };

        view.logic.initialize(view);

    }

    function newGame() {
        var view = this;

        view.state.player   = 1;
        view.state.rounds   = 0;
        view.state.actions  = [];
        view.state.finished = undefined;

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

        $('#restart-dialog').dialog( {
            title:      "Restart game?",
            autoOpen:   false,
            width:      500,
            resizable:  false,
            buttons:    {
                Restart: function() {
                    $(this).dialog("close");
                    view.newGame();
                    view.render();
                },
                Cancel: function() {
                    $(this).dialog("close");
                }
            }
        } );

        var game = view.state.game;
        game += view.state.cut ? '-Cut' : '';
        $('.js-game-title').text(game);
    }

    function updateScoreMark(event) {
        var view    = this,
            $mark   = $(event.currentTarget);

        if (view.state.nextTimer) {
            clearTimeout(view.state.nextTimer);
        }
        view.state.nextTimer = setTimeout('$(".js-next").trigger("click")', 5000);

        view.logic.updateScore( $mark, view, function() { return postUpdateScore(view) } );
    }

    function postUpdateScore(view) {
        if (view.state.finished) {
            var name = view.state.playerNames[view.state.finished];
            if ( window.confirm(name + " has won in round " + (view.state.rounds + 1) + ". Restart the game?") ) {
                view.newGame();
            }
            else {
                view.state.finished = undefined;
            }
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

        view.logic.undo(view, action, function() {
            view.render();
        } );
    }

    function restartGame() {
        $("#restart-dialog").dialog("open");
    }

    function editPlayer(event) {
        var view = this,
            $target = $(event.currentTarget);
            player = interpretPlayer($target);

        $(".board-header .player" + player).addClass("editing");
        $(".board-header .player" + player + " > input").focus().select();
    }

    function updateOnEnter(event) {
        if (event.keyCode == 13) {
            this.closeEdit(event);
        }
    }

    function closeEdit(event) {
         var view = this,
             $target = $(event.currentTarget),
             value = $target.val(),
             player = interpretPlayer( $target.parent() );

         view.state.playerNames[player] = value;
         $(".board-header .player" + player + " .view").html(value);
         $(".board-header .player" + player).removeClass("editing");
    }

    var events = {
        "click      .js-mark":          updateScoreMark,
        "click      .js-next":          next,
        "click      .js-undo":          undo,
        "mousedown  .columns":          preventTextSelection,
        "dblclick   .playerHead":       editPlayer,
        "keypress   .edit":             updateOnEnter,
        "blur       .edit":             closeEdit,
        "click      .js-restart-game":  restartGame
    };

    return {
        events: events,

        initialize: initialize,
        newGame: newGame,
        closeEdit: closeEdit,
        render: render
    };

}());
