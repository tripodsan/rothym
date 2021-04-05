import Cell from './Cell.js';
import EventEmitter from './EventEmitter.js';

export default class World extends EventEmitter {
  constructor() {
    super();
    Object.assign(this, {
      cells: [],
      deleted: [],
      addedCells: [],
      selected: null,
      mousePos: [0, 0],
      paused: false,
      stepPending: false,
      tickCount: 0,
      startTime: 0,
      time: 0, // ms
      speed: 100, // bbm
      beat: 4,
      numNotes: 8,
      metronome: new Cell({
        notes: [1, 0, 1, 0, 1, 0, 1, 0],
        instruments: ['', 'metronome'],
        autoMute: true,
      }),
    });
    this.metronome.boot(this);
  }

  // eslint-disable-next-line class-methods-use-this
  init() {
  }

  toJSON() {
    return {
      age: this.tickCount,
      cells: this.cells.map((c) => c.toJSON()),
    };
  }

  // eslint-disable-next-line no-unused-vars
  static fromJSON(data) {
    const world = new World(data.seedString);
    data.cells.forEach((c) => {
      world.addCell(Cell.fromJSON(world.player.templateRegistry, c));
    });
    world.tickCount = data.age;
    world.cells.forEach((cell) => cell.afterLoad());
    return world;
  }

  changeSpeed(delta) {
    let msPerStep = this.msPerStep();
    const relSteps = this.time / msPerStep;
    this.speed = Math.min(300, Math.max(this.speed + delta, 10));
    msPerStep = this.msPerStep();
    this.time = relSteps * msPerStep;
    this.startTime = Date.now() - this.time;
  }

  changeBeat(dir) {
    this.beat = Math.min(Math.max(this.beat + dir, 2), 16);
    this.numNotes = Math.max(this.numNotes, this.beat);
    this.cells.forEach((c) => {
      c.onMetricsChanged();
    });
    this.updateMetronome();
  }

  changeNumNotes(dir) {
    this.numNotes = Math.min(Math.max(this.numNotes + dir, 2), 16);
    this.beat = Math.min(this.beat, this.numNotes);
    this.cells.forEach((c) => {
      c.onMetricsChanged();
    });
    this.updateMetronome();
  }

  updateMetronome() {
    const rep = Math.floor(this.numNotes / this.beat);
    for (let i = 0; i < this.numNotes; i++) {
      this.metronome.setNote(i, i % rep === 0 ? 1 : 0);
    }
  }

  togglePause() {
    this.paused = !this.paused;
    if (!this.paused) {
      this.startTime = Date.now() - this.time;
    }
  }

  step(direction = 1) {
    this.stepPending = direction;
  }

  msPerStep() {
    const msPerQuarter = 1000 / (this.speed / 60);
    return msPerQuarter / 2; // todo: calculate based on cells
  }

  tick() {
    const now = Date.now();
    if (this.paused && !this.stepPending) {
      return;
    }
    if (this.stepPending) {
      const msPerStep = this.msPerStep();
      const steps = Math.floor(this.time / msPerStep) + this.stepPending;
      this.startTime = now - steps * msPerStep;
      this.stepPending = 0;
    }

    if (!this.startTime) {
      this.startTime = now;
    }
    this.time = now - this.startTime;

    this.cells.forEach((c) => {
      c.tick();
    });
    this.metronome.tick();
    this.tickCount++;
  }

  deleteSelected() {
    if (this.selected) {
      this.removeCell(this.selected);
    }
  }

  selectCell(cell = null) {
    if (this.selected) {
      this.selected.select(false);
      this.selected = null;
    }
    if (cell) {
      cell.select(true);
      this.selected = cell;
    }
  }

  removeCell(c) {
    if (c === this.selected) {
      c.select(false);
      this.selected = null;
    }
    c.destroy();
    const idx = this.cells.indexOf(c);
    if (idx >= 0) {
      this.cells.splice(idx, 1);
    }
    this.deleted.push(c);
    c.modules.all.forEach((mod) => {
      this.modules.delete(mod.id);
    });
  }

  addCell(c) {
    c.boot(this);
    this.cells.push(c);
    this.addedCells.push(c);
    return this;
  }

  buildCell(clone, pos, rotation) {
    if (!clone) {
      return false;
    }
    if (!clone.canDrop(pos, rotation)) {
      return false;
    }
    const cell = new Cell({
      template: clone.template,
      rotation: rotation || clone.rotation,
      pos: pos || clone.pos,
    });
    this.addCell(cell);
    return true;
  }

  onScale(scale, pan) {
    this.emit('scaled', scale, pan);
  }
}
