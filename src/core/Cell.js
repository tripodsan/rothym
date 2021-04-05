export default class Cell {
  static nextId() {
    Cell.counter = (Cell.counter || 0) + 1;
    return `c${Cell.counter}`;
  }

  constructor(opts) {
    const id = opts.id || Cell.nextId();
    Object.assign(this, {
      id,
      pos: [0, 0],
      world: null, // set during boot
      selected: false,
      prevNote: -1,
      notes: [1, 0, 1, 0, 1, 0, 1, 0],
      instruments: ['', 'snare'],
      text: '',
      muted: false,
      autoMute: false,
    }, opts);
  }

  getNotes() {
    return this.notes.slice(0, this.world.numNotes);
  }

  onMetricsChanged() {
    while (this.notes.length < this.world.numNotes) {
      this.notes.push(0);
    }
  }

  msPerMeasure() {
    const mspb = 1000 / (this.world.speed / 60); // milliseconds per beat
    return mspb * this.world.beat;
  }

  measureTime() {
    const mspb = this.msPerMeasure();
    const mt = this.world.time / mspb;
    return mt - Math.floor(mt);
  }

  tick() {
    const mtime = (this.world.time / this.msPerMeasure()) * this.world.numNotes;
    const idx = Math.floor(mtime);
    if (Math.abs(mtime - idx) > 0.2) {
      return;
    }
    if (idx !== this.prevNote) {
      this.prevNote = idx;
      this.playNote(idx % this.world.numNotes);
    }
    if (!this.muted && this.autoMute && idx >= this.world.numNotes) {
      this.muted = true;
    }
  }

  playNote(idx) {
    if (this.notes[idx] && !this.muted) {
      this.playedNote = idx;
    } else {
      this.playedNote = -1;
    }
  }

  setNote(idx, value) {
    this.notes.splice(idx, 1, value);
  }

  toggleNote(idx) {
    this.setNote(idx, (this.notes[idx] + 1) % this.instruments.length);
  }

  toggleMute() {
    this.muted = !this.muted;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      template: this.template.name,
      pos: this.pos,
      rotation: this.rotation,
      modules: this.modules.toJSON(),
    };
  }

  static fromJSON(templateReg, data) {
    const template = templateReg.getByName(data.template);
    const cell = new Cell({
      id: data.id,
      template,
      pos: data.pos,
      rotation: data.rotation,
      _bootData: data,
    });
    return cell;
  }

  boot(world) {
    this.world = world;
  }

  // eslint-disable-next-line class-methods-use-this
  afterLoad() {
  }

  destroy() {
    this.destroyed = true;
  }

  select(selected) {
    this.selected = selected;
  }

  getTitle() {
    return `(${this.id})`;
  }

  toString() {
    return `${this.pos}`;
  }
}
