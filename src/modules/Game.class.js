'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  status = 'idle';
  score = 0;

  constructor(
    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = board;
  }

  moveLeft() {
    const moved = this.processLeftMoveWithoutRendering();

    if (moved) {
      this.addRandomTile();
    }
    this.#renderBoard(this.getState());
  }
  processLeftMoveWithoutRendering() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const originalRow = this.board[row];
      const newRow = this.mergeRowByPriority(originalRow);

      if (!this.arraysEqual(originalRow, newRow)) {
        moved = true;
        this.board[row] = newRow;
      }
    }

    return moved;
  }
  mergeRowByPriority(row) {
    const result = [];
    let skip = false;
    const newRow = row.filter((val) => val !== 0);

    for (let i = 0; i < newRow.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (i + 1 < newRow.length && newRow[i] === newRow[i + 1]) {
        result.push(newRow[i] * 2);
        this.score += newRow[i] * 2;
        skip = true;
      } else {
        result.push(newRow[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }
  moveRight() {
    this.reverseRows();
    this.moveLeft();
    this.reverseRows();
  }
  moveUp() {
    this.board = this.transpose(this.board);

    const moved = this.processLeftMoveWithoutRendering();

    this.board = this.transpose(this.board);

    if (moved) {
      this.addRandomTile();
    }
    this.#renderBoard(this.getState());
  }
  moveDown() {
    this.board = this.transpose(this.board);
    this.reverseRows();

    const moved = this.processLeftMoveWithoutRendering();

    this.reverseRows();
    this.board = this.transpose(this.board);

    if (moved) {
      this.addRandomTile();
    }
    this.#renderBoard(this.getState());
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => [...row]);
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    const button = document.querySelector('.button');

    if (button.classList.contains('restart')) {
      this.status = 'playing';
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return this.status;
        }
      }
    }

    const canMove = this.canMakeMove();

    if (!canMove) {
      this.status = 'lose';
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    const getRandomPosition = () => {
      const row = Math.floor(Math.random() * 4);
      const col = Math.floor(Math.random() * 4);

      return [row, col];
    };

    const getRandomValue = () => {
      return Math.random() < 0.1 ? 4 : 2;
    };

    const [row1, col1] = getRandomPosition();

    this.board[row1][col1] = getRandomValue();

    let row2, col2;

    do {
      [row2, col2] = getRandomPosition();
    } while (row2 === row1 && col2 === col1);

    this.board[row2][col2] = 2;
    this.#renderBoard(this.getState());
  }

  /**
   * Resets the game.
   */
  restart() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.board[i][j] = 0;
      }
    }

    this.#renderBoard(this.getState());
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[row][col] = value;
  }

  canMakeMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  reverseRows() {
    for (let i = 0; i < 4; i++) {
      this.board[i].reverse();
    }
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  #renderBoard(state) {
    const rows = document.querySelectorAll('.game-field tbody tr');

    for (let i = 0; i < 4; i++) {
      const cells = rows[i].querySelectorAll('td');

      for (let j = 0; j < 4; j++) {
        cells[j].textContent = state[i][j] === 0 ? '' : state[i][j];

        cells[j].classList.forEach((cl) => {
          if (cl.startsWith('field-cell--')) {
            cells[j].classList.remove(cl);
          }
        });

        if (state[i][j] !== 0) {
          cells[j].classList.add(`field-cell--${state[i][j]}`);
        }
      }
    }
  }
}

module.exports = Game;
