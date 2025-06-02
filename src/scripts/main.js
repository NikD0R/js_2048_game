'use strict';

// Uncomment the next lines to use your game instance in the browser
document.addEventListener('DOMContentLoaded', () => {
  const Game = require('../modules/Game.class');
  const game = new Game();

  const button = document.querySelector('.button');
  const gameScore = document.querySelector('.game-score');
  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  button.addEventListener('click', () => {
    if (button.classList.contains('start')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
      game.start();

      document.addEventListener('keydown', (e) => {
        const keyName = e.key;

        if (game.getStatus() === 'lose') {
          loseMessage.classList.remove('hidden');

          return;
        }

        if (game.getStatus() === 'win') {
          winMessage.classList.remove('hidden');

          return;
        }

        if (keyName === 'ArrowRight') {
          game.moveRight();
        }

        if (keyName === 'ArrowLeft') {
          game.moveLeft();
        }

        if (keyName === 'ArrowUp') {
          game.moveUp();
        }

        if (keyName === 'ArrowDown') {
          game.moveDown();
        }

        gameScore.textContent = game.getScore();

        if (game.getStatus() === 'win') {
          winMessage.classList.remove('hidden');
        } else if (game.getStatus() === 'lose') {
          loseMessage.classList.remove('hidden');
        }
      });

      if (button.classList.contains('restart') && startMessage) {
        startMessage.classList.add('hidden');
      }
    } else {
      button.classList.remove('restart');
      button.classList.add('start');
      button.textContent = 'Start';

      if (!winMessage.classList.contains('hidden')) {
        winMessage.classList.add('hidden');
      }

      if (!loseMessage.classList.contains('hidden')) {
        loseMessage.classList.add('hidden');
      }

      gameScore.textContent = '0';
      game.restart();

      if (button.classList.contains('start') && startMessage) {
        startMessage.classList.remove('hidden');
      }
    }
  });
});
