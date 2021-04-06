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
      playedNote: -1,
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
    let delta = this.world.numNotes - this.notes.length;
    if (delta > 0) {
      let i = 0;
      const d = delta / this.notes.length;
      let p = 0;
      while (delta > 0) {
        p += d;
        while (p >= 1) {
          delta -= 1;
          this.notes.splice(i + 1, 0, 0);
          i += 1;
          p -= 1;
        }
        i += 1;
      }
    } else {
      let i = 0;
      const d = -delta / this.world.numNotes;
      let p = 0;
      while (delta < 0) {
        p += d;
        while (p >= 1) {
          delta += 1;
          this.notes.splice(i + 1, 1);
          p -= 1;
        }
        i += 1;
      }
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
    this.autoMute = false;
  }

  toJSON() {
    const data = {
      text: this.text,
      notes: this.notes.join(''),
      instruments: this.instruments.slice(1),
    };
    if (this.muted) {
      data.muted = true;
    }
    return data;
  }

  static fromJSON(data) {
    const cell = new Cell({
      text: data.text,
      notes: data.notes.split('').map((c) => Number.parseInt(c, 10)),
      instruments: ['', ...data.instruments],
      muted: data.muted,
    });
    return cell;
  }

  boot(world) {
    this.world = world;
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
