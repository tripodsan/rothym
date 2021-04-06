import Cell from './Cell.js';
import EventEmitter from './EventEmitter.js';

export default class World extends EventEmitter {
  constructor() {
    super();
    Object.assign(this, {
      name: 'Simple Rock',
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
      divs: 2,
      metronome: new Cell({
        notes: [1, 0, 1, 0, 1, 0, 1, 0],
        instruments: ['', 'clave'],
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
      name: this.name,
      speed: this.speed,
      beat: this.beat,
      divs: this.divs,
      cells: this.cells.map((c) => c.toJSON()),
    };
  }

  load(data) {
    this.cells.splice(0, this.cells.length);
    this.name = data.name;
    this.speed = data.speed;
    this.beat = data.beat;
    this.divs = data.divs;
    this.numNotes = this.beat * this.divs;
    this.paused = true;
    this.time = 0;
    this.startTime = 0;
    this.updateMetronome();
    this.metronome.autoMute = true;
    data.cells.forEach((c) => {
      this.addCell(Cell.fromJSON(c));
    });
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
    this.numNotes = this.beat * this.divs;
    this.cells.forEach((c) => {
      c.onMetricsChanged();
    });
    this.updateMetronome();
  }

  changeNumDivs(dir) {
    this.divs = Math.min(Math.max(this.divs + dir, 1), 4);
    this.numNotes = this.beat * this.divs;
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
}
