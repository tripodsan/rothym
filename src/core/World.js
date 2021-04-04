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
    });
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
    this.speed = Math.max(this.speed + delta, 10);
  }

  togglePause() {
    this.paused = !this.paused;
    if (!this.paused) {
      this.startTime = Date.now() - this.time;
    }
  }

  step() {
    this.stepPending = true;
  }

  tick() {
    if (this.paused) {
      if (!this.stepPending) {
        return;
      }
      this.stepPending = false;
    }
    const now = Date.now();
    if (!this.startTime) {
      this.startTime = now;
    }
    this.time = now - this.startTime;

    this.cells.forEach((c) => {
      c.tick();
    });
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
