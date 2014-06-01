(function (global) {
    function genericCricket(numbers) {
        function initialize(view) {
            view.collection = new Marks([]);
            numbers.forEach( function (number) {
                view.collection.push({ value: number, players: view.options.players });
            } );

            view.scores = {
                player1: 0,
                player2: 0,
                player3: 0,
                player4: 0,
                players: view.options.players
            };
        }

        function updateScore($target, view, cb) {
            var player = view.state.player,
                $player = $("." + player, $target.parent()),
                currentMarks = $player.text(),
                valueText = $target.text(),
                value = parseInt(valueText, 10) || valueText,
                currentMark;

            // Delay the highlight so that it runs after re-render is complete.
            // 1337 hax, I know :( will fix later
            setTimeout(function () {
                $("." + player + ".js-value-" + valueText)
                    .stop()
                    .css({backgroundColor: "#ddd"})
                    .animate({backgroundColor: "transparent"}, 1500);
            }, 100);

            view.collection.forEach(function (mark) {
                var modelValue = mark.get("value");

                if (modelValue === valueText) {
                    currentMark = mark;
                }
            });

            if (currentMarks === "(X)") { // at current player the mark is closed
                var posValues = numbers.slice(0);
                if (value === "D" && numbers.indexOf("B") >= 0) {
                    posValues.push("25");
                }
                var chars = ["T", "D", "B"];
                for ( i in chars ) {
                    var j = posValues.indexOf(chars[i]);
                    if (j >= 0) {
                        posValues.splice(j, 1);
                    }
                }

                if (view.state.cut === true) { // game with option Cut Throat
                    if (value === "B") {
                        value = 25;
                    }
                    else if (value === "T" || value === "D") {
                        var base,
                            factor = (value === "T") ? 3 : 2;

                        do {
                            base = window.prompt("Type in the base value!");
                            if (base === null) { return; }
                        } while (posValues.indexOf(base) === -1);

                        value = Number(base) * factor;
                    }

                    var scorer = [];
                    for (i = 1; i <= view.state.players; i++) {
                        if ( $(".player" + i, $target.parent()).text() !== "(X)" ) {
                            // the other player has got open the mark and gets points
                            view.scores["player" + i] += value;
                            scorer.push("player" + i);
                        }
                    }
                    view.state.actions.push({
                        type:   "cut-points",
                        player: player,
                        scorer: scorer,
                        value:  value,
                        valueText: valueText
                    });
                }
                else if (currentMark.canScorePoints(player)) { // game without option Cut Throat
                    // some one has open this mark - the player gets points
                    if (typeof value === "number") {
                        view.scores[player] += value;
                    }
                    else if (value === "B") {
                        value = 25;
                        view.scores[player] += value;
                    }
                    else {
                        var base,
                            factor = (value === "T") ? 3 : 2;

                        do {
                            base = window.prompt("Type in the base value!");
                            if (base === null) { return; }
                        } while (posValues.indexOf(base) === -1);

                        value = Number(base) * factor;
                        view.scores[player] += value;
                    }

                    view.state.actions.push({
                        type:    "points",
                        player:  player,
                        value:   value,
                        valueText: valueText
                    });
                }
            }
            else {
                view.state.actions.push({
                    type: "add",
                    player: player,
                    value: value,
                    valueText: valueText
                });
            }

            var currentScore = currentMark.get(player);

            if (currentMark.canScorePoints(player) || currentScore < 3) {
                currentMark.set(player, ++currentScore);
            }

            cb();
        }

        function nextRound(view, cb) {
            return cb();
        }

        function undo(view, action, currentPlayer, cb) {
            var type        = action.type,
                player      = action.player,
                value       = action.value,
                valueText   = action.valueText;

            if (type === "points") {
                view.scores[player] -= value;
                view.$(".board-footer ." + player).text(view.scores[player]);
            }
            else if (type === "cut-points") {
                var scorer = action.scorer;
                for ( i in scorer ) {
                    view.scores[scorer[i]] -= value;
                    view.$(".board-footer ." + scorer[i]).text(view.scores[scorer[i]]);
                }

            }

            if (currentPlayer !== player) {
                view.$(".board-header .player").removeClass("board-header-active");
                view.$(".board-header ." + player).addClass("board-header-active");

                view.state.player = player;
                view.state.rounds--;
            }

            view.collection.forEach(function (mark) {
                var modelValue = mark.get("value"),
                    currentScore;

                if (modelValue === valueText) {
                    currentScore = mark.get(player);
                    mark.set(player, --currentScore);
                }
            });

            cb();
        }

        return {
            initialize: initialize,

            updateScore: updateScore,
            nextRound: nextRound,
            undo: undo
        };
    }

    global.Games = global.Games || {};

    global.Games.Cricket = genericCricket([
        "20", "19", "18", "17", "16", "15", "B"
    ]);

    global.Games.Mickey = genericCricket([
        "20", "19", "18", "17", "16", "15", "14", "13", "12", "T", "D", "B"
    ]);

    var numbers = [
        "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"
    ];

    var wildcardNumbers = [];
    for (i = 0; i < 6; i++) {
        var nextNumber = numbers[Math.floor(Math.random() * numbers.length)];
        wildcardNumbers.push(nextNumber);
        numbers = _.without(numbers, nextNumber);
    }

    wildcardNumbers.push("B");

    global.Games.Wildcards = genericCricket(wildcardNumbers);

}(window));
