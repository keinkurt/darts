var Darts;

Darts = Backbone.View.extend(function () {

    var subviews = {};

    function initialize() {
        var view = this;

        view.subviews.Config = new Config();
        view.subviews.Config.on("new", function (event) {
            // Remove the dialog
            $('#config-modal').modal('hide');
            // Remove the old board
            if (view.subviews.Board) { view.subviews.Board.remove(); }

            // Append new board wrapper
            $(".board").append("<div id='board-wrapper' class='container'></div>");

            // Create the board
            view.subviews.Board = new Board({
                players:    event.players,
                game:       event.game,
                cut:        event.cut
            });

            // Show game title at NavBar
            var game = event.game + (event.cut ? ' - Cut' : '');
            $('.game-title').text(game);

            // Assign the board to the wrapper and render
            view.assign("#board-wrapper", view.subviews.Board);
        });

        // Render the page
        view.render();
    }

    function render() {
        var view = this;

        view.assign({
            ".js-config-container": view.subviews.Config
        });
    }

    function assign(selector, view) {
        var selectors;
        if (_.isObject(selector)) {
            selectors = selector;
        }
        else {
            selectors = {};
            selectors[selector] = view;
        }
        if (!selectors) { return; }
        _.each(selectors, function (view, selector) {
            view.setElement(this.$(selector)).render();
        }, this);
    }

    return {
        subviews: subviews,

        initialize: initialize,
        render: render,
        assign: assign
    };

}());
