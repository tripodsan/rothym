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
      size: 100,
      beat: 4,
      nextTime: 0,
      notes: [1, 0, 1, 0, 1, 0, 1, 0],
      instruments: ['', 'snare'],
      text: '',
    }, opts);
  }

  msPerMeasure() {
    const mspb = 1000 / (this.world.speed / 60); // milliseconds per beat
    return mspb * this.beat;
  }

  measureTime() {
    const mspb = this.msPerMeasure();
    const mt = this.world.time / mspb;
    return mt - Math.floor(mt);
  }

  tick() {
    // check if we need to play a note
    if (this.world.time >= this.nextTime) {
      const idx = Math.floor((this.world.time / this.msPerMeasure()) * this.notes.length);
      this.playNote(idx % this.notes.length);
      this.nextTime = ((idx + 1) / this.notes.length) * this.msPerMeasure();
    }
  }

  playNote(idx) {
    console.log(idx);
    if (this.notes[idx]) {
      this.playedNote = idx;
    } else {
      this.playedNote = -1;
    }
  }

  toggleNote(idx) {
    this.notes[idx] = (this.notes[idx] + 1) % this.instruments.length;
  }

  getNotePos(a) {
    return [
      Math.cos(a - Math.PI / 2) * this.size,
      Math.sin(a - Math.PI / 2) * this.size,
    ];
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

  afterLoad() {
  }

  destroy() {
    this.destroyed = true;
  }

  canDrop(pos = this.pos, rotation = this.rotation) {
    return true;
  }

  onDrop(pos = this.pos, rotation = this.rotation) {
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
