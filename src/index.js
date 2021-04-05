import Game from './core/Game.js';
import GameManager from './core/GameManager.js';
import Cell from './core/Cell.js';

const game = new Game();
const { world } = game;

world.paused = true;
const load = false;

if (!load) {
  world.addCell(new Cell({
    notes: [1, 0, 0, 0, 1, 0, 0, 0],
    instruments: ['', 'kick'],
    text: 'Kick',
  }));
  world.addCell(new Cell({
    notes: [0, 0, 1, 0, 0, 0, 1, 0],
    instruments: ['', 'snare'],
    text: 'Snare',
  }));
  world.addCell(new Cell({
    notes: [1, 1, 1, 1, 1, 1, 1, 2],
    instruments: ['', 'hihat', 'hihat_open'],
    text: 'Hi-Hat',
  }));
  world.addCell(new Cell({
    notes: [0, 0, 0, 1, 1, 0, 0, 2],
    instruments: ['', 'tom-high', 'tom-low'],
    text: 'Tom',
  }));
} else {
  const lastSave = GameManager.lastSave();
  if (lastSave) {
    const data = GameManager.loadGame(lastSave.name);
    game.load(data);
  }
}

// eslint-disable-next-line no-console
game.run().then().catch(console.error);
