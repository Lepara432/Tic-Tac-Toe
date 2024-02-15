const App = {
  $: {
    menu: document.querySelector('[data-id ="menu"]'),
    menuItems: document.querySelector('[data-id ="menu-items"]'),
    resetBtn: document.querySelector('[data-id="reset-btn"]'),
    newRoundBtn: document.querySelector('[data-id ="new-round-btn"]'),
    squares: document.querySelectorAll('[data-id = "square"]'),
    modal: document.querySelector('[data-id ="modal"]'),
    modalText: document.querySelector('[data-id ="modal-contents"]'),
    modalBtn: document.querySelector('[data-id ="modal-button"]'),
    turn: document.querySelector('[data-id ="turn"]'),
  },
  state: {
    moves: [],
  },
  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;

    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((value) => p1Moves.includes(value));
      const p2Wins = pattern.every((value) => p2Moves.includes(value));

      console.log(p1Moves);
      console.log(p2Moves);
      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress",
      winner,
    };
  },
  init() {
    App.registerEventListeners();
  },
  registerEventListeners() {
    App.$.modalBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      App.$.modal.classList.add("hidden");
    });
    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        // Check if there is already an icon

        if (square.hasChildNodes()) {
          return;
        }
        // Determine which player icon to add
        const lastMove = App.state.moves[App.state.moves.length - 1];
        const oppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0 ? 1 : oppositePlayer(lastMove.playerId);

        const nextPlayer = oppositePlayer(currentPlayer);

        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.innerText = `Player ${nextPlayer} , you are up!`;
        if (currentPlayer === 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnLabel.classList = "turquoise";
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnLabel.classList = "yellow";
        }
        App.$.turn.replaceChildren(turnIcon, turnLabel);

        App.state.currentPlayer = currentPlayer === 1 ? 2 : 1;

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        square.replaceChildren(squareIcon);

        const game = App.getGameStatus(App.state.moves);

        console.log(game);
        if (game.status === "complete") {
          App.$.modal.classList.remove("hidden");
          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = "Tie game";
          }
          App.$.modalText.textContent = message;
        }
      });
    });
  },
};

window.addEventListener("load", App.init);
