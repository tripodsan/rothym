import Game from './core/Game.js';
import GameManager from './core/GameManager.js';
import Cell from './core/Cell.js';

const game = new Game();
const { world } = game;

world.paused = true;
const load = false;

if (!load) {
  world.addCell(new Cell({
    pos: [-250, 0],
    notes: [1, 0, 0, 0, 1, 0, 0, 0],
    instruments: ['', 'kick'],
    text: 'Kick',
  }));
  world.addCell(new Cell({
    pos: [0, 0],
    notes: [0, 0, 1, 0, 0, 0, 1, 0],
    instruments: ['', 'snare'],
    text: 'Snare',
  }));
  world.addCell(new Cell({
    pos: [250, 0],
    notes: [1, 1, 1, 1, 1, 1, 1, 2],
    instruments: ['', 'hihat', 'hihat_open'],
    text: 'Hi-Hat',
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
