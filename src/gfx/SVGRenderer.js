/* eslint-disable no-param-reassign,no-bitwise */
/* eslint-env browser */

import vec2 from '../vec2.js';
import SVG from './SVG.js';
import AudioManager from './AudioManager.js';

export default class SVGRenderer {
  constructor(world, svg) {
    Object.assign(this, {
      world,
      svg,
      $main: svg.getElementById('main'),
      $cells: svg.getElementById('cells'),
      $bpm: svg.querySelector('#bpm text'),
      $btnPlay: svg.getElementById('play'),
      $btnStop: svg.getElementById('stop'),
      selected: null,
      scale: 1,
      pan: [0, 0],
      audio: new AudioManager(),
      grid: [250, 250],
    });

    this.initShapes();
    this.initMouseHandler();
    this.initAudio();
  }

  initShapes() {
    // create background
    const $pat = this.svg.getElementById('hex-pattern');
    const $circle = $pat.querySelector('circle');
    SVG.setCircle($circle, [this.grid[0] / 2, this.grid[1] / 2]);
    // const {
    //   w, w2, h, h2,
    // } = this.hex;
    // const p = Hex.createHexPath(this.hex.size, w2, h2);
    // p.push(
    //   'M', w2, h,
    //   'l', 0, h2,
    // );
    $pat.setAttributeNS(null, 'width', this.grid[0]);
    $pat.setAttributeNS(null, 'height', this.grid[1]);
    $pat.setAttributeNS(null, 'patternTransform', `translate(${this.grid[0] / 2} ${this.grid[1] / 2})`);
    // $hex.setAttributeNS(null, 'd', p.join(' '));
  }

  initAudio() {
    this.audio.addSample('kick', '/sounds/Kick 001 Basic.wav');
    this.audio.addSample('snare', '/sounds/Snare 004.wav');
    this.audio.addSample('hihat', '/sounds/HiHat Closed 004 Flat Real.wav');
    this.audio.addSample('hihat_open', '/sounds/HiHat Open 001.wav');
  }

  initMouseHandler() {
    // let dragMouseStart = null;
    let dragCell = null;
    let dragPanStart = null;
    let dragMouseStartScreen = null;

    this.svg.addEventListener('pointerdown', (evt) => {
      // const pos = this.screenToWorld(evt);
      if (evt.target.classList.contains('note')) {
        const el = evt.target.closest('.cell');
        if (el) {
          const noteIdx = evt.target.data.idx;
          el.cell.toggleNote(noteIdx);
          this.updateNotes(el.cell);
        }
        return;
      }

      if (evt.target.id === 'bpm-up') {
        this.world.changeSpeed(1);
        return;
      }
      if (evt.target.id === 'bpm-down') {
        this.world.changeSpeed(-1);
        return;
      }
      if (evt.target.id === 'play' || evt.target.id === 'stop') {
        this.world.togglePause();
        return;
      }

      // vec2.sub(hex, hex, this.offset);
      const el = evt.target.closest('.draggable');
      // dragMouseStart = pos;
      dragMouseStartScreen = [evt.x, evt.y];
      const cell = el ? el.cell : null;
      if (cell && evt.which === 1) {
        dragCell = cell;
        cell.drag = {
          delta: [0, 0],
          start: el.cell.pos,
          pos: el.cell.pos,
          rotation: cell.rotation,
        };
        this.svg.setPointerCapture(evt.pointerId || 0);
        this.world.selectCell(dragCell);
      } else if (evt.which === 3) {
        dragPanStart = vec2.clone(this.pan);
        this.world.selectCell(null);
        this.svg.style.cursor = 'hand';
        this.svg.setPointerCapture(evt.pointerId || 0);
      }
    });

    this.svg.addEventListener('pointermove', (evt) => {
      if (dragCell) {
        // dragCell.drag.delta = vec2.sub(pos, pos, dragMouseStart);
        // // recalc new position
        // const pt = this.hex.hexToCart(dragCell.pos);
        // vec2.add(pt, pt, dragCell.drag.delta);
        // dragCell.drag.pos = this.hex.cartToHex(pt);
      }

      if (dragPanStart) {
        const delta = [evt.x - dragMouseStartScreen[0], evt.y - dragMouseStartScreen[1]];
        const newPan = vec2.clone(dragPanStart);
        vec2.add(newPan, newPan, delta);
        this.setScale(this.scale, newPan);
      }
    });

    this.svg.addEventListener('pointerup', (evt) => {
      if (dragCell) {
        if (dragCell.drag.pos !== dragCell.drag.start) {
          if (dragCell.canDrop(dragCell.drag.pos)) {
            // const oldChunk = this.getChunk(dragCell.pos);
            // const newChunk = this.getChunk(dragCell.drag.pos);
            dragCell.onDrop(dragCell.drag.pos, dragCell.drag.rotation);
            // if (oldChunk !== newChunk) {
            //   oldChunk.cells.delete(dragCell);
            //   newChunk.cells.add(dragCell);
            // }
          }
        }
        delete dragCell.drag;
        this.world.selectCell(dragCell);
        // this.updateCell(dragCell);
        dragCell = null;
      }
      this.svg.releasePointerCapture(evt.pointerId || 0);
      dragPanStart = null;
      // dragMouseStart = null;
      // buildMode = false;
      this.svg.style.cursor = 'initial';
    });

    this.svg.addEventListener('wheel', (evt) => {
      const newScale = evt.deltaY > 0 ? this.scale * 0.9 : this.scale * 1.1;
      const rect = this.svg.getBoundingClientRect();
      const delta = [evt.x - rect.width / 2, evt.y - rect.height / 2];

      // translate the 'pan' back from the delta to the 0,0 of the screen
      const newPan = vec2.sub(vec2.create(), this.pan, delta);
      // scale it relative the new scale
      vec2.scale(newPan, newPan, newScale / this.scale);
      // translate it back
      vec2.add(newPan, newPan, delta);
      this.setScale(newScale, newPan);
    });
  }

  setScale(scale = this.scale, pan = this.pan) {
    this.scale = scale;
    const rect = this.svg.getBoundingClientRect();
    const w = rect.width / scale;
    const h = rect.height / scale;
    this.pan = pan;
    const panX = pan[0] / scale;
    const panY = pan[1] / scale;
    const x = panX % this.grid[0];
    const y = panY % this.grid[1];
    this.svg.setAttributeNS(null, 'viewBox', `${-w / 2} ${-h / 2} ${w} ${h}`);

    SVG.setPos(this.$main, [panX, panY]);

    const $pat = document.getElementById('hex-pattern');
    $pat.setAttributeNS(null, 'x', x);
    $pat.setAttributeNS(null, 'y', y);

    const $bg = document.getElementById('bg');
    const bgW = w + this.grid[0] * 2;
    const bgH = h + this.grid[1] * 2;
    $bg.setAttributeNS(null, 'x', -bgW / 2);
    $bg.setAttributeNS(null, 'y', -bgH / 2);
    $bg.setAttributeNS(null, 'width', bgW);
    $bg.setAttributeNS(null, 'height', bgH);
    // this.build();
  }

  // eslint-disable-next-line class-methods-use-this
  renderCell(c) {
    const $el = SVG.createFromTemplate('cell-template');
    $el.cell = c;
    c.$el = $el;

    const $circle = $el.querySelector('circle');
    SVG.attr($circle, 'r', c.size);
    const len = c.notes.length;
    const da = (2 * Math.PI) / len;
    const $notes = $el.querySelector('.notes');
    for (let i = 0; i < len; i += 1) {
      const $n = SVG.createFromTemplate('note-template');
      $n.data = {
        idx: i,
      };
      SVG.setCircle($n, c.getNotePos(da * i));
      if (c.notes[i]) {
        $n.classList.add('on');
        $n.classList.add(`i${c.notes[i]}`);
      }
      $n.addEventListener('animationend', () => {
        $n.classList.remove('pulse');
      });
      $notes.appendChild($n);
    }

    $el.querySelector('text').textContent = c.text;

    return $el;
  }

  // eslint-disable-next-line class-methods-use-this
  updateNotes(c) {
    const { $el } = c;
    const $notes = $el.querySelector('.notes');
    c.notes.forEach((note, idx) => {
      const $n = $notes.childNodes[idx];
      if ($n) {
        $n.classList.value = 'note';
        if (note) {
          $n.classList.add('on');
          $n.classList.add(`i${note}`);
        }
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  destroyCell(c) {
    c.$el.remove();
    c.$el = null;
  }

  updateCell(c) {
    SVG.setPos(c.$el, c.pos);

    // // update notes
    if (c.playedNote >= 0) {
      const $notes = c.$el.querySelector('.notes');
      const note = c.notes[c.playedNote];
      const $n = $notes.childNodes[c.playedNote];
      this.audio.play(c.instruments[note]);
      c.playedNote = -1;
      if ($n) {
        $n.classList.add('pulse');
      }
    }

    // cursor
    const $cursor = c.$el.querySelector('.cursor');
    const a = c.measureTime() * Math.PI * 2.0;
    SVG.setCircle($cursor, c.getNotePos(a));
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    // bpm
    const bpm = String(this.world.speed);
    if (this.$bpm.textContent !== bpm) {
      console.log('update bpm');
      this.$bpm.textContent = bpm;
    }
    if (this.world.paused) {
      this.$btnPlay.classList.remove('hidden');
      this.$btnStop.classList.add('hidden');
    } else {
      this.$btnPlay.classList.add('hidden');
      this.$btnStop.classList.remove('hidden');
    }

    // process added cells
    this.world.addedCells.forEach((cell) => {
      const $el = this.renderCell(cell);
      this.$cells.appendChild($el);
    });
    this.world.addedCells = [];

    // handle selected
    if (this.selected !== this.world.selected) {
      if (this.selected) {
        // no longer selected
        const c = this.selected;
        c.$el.classList.remove('selected');
      }
      this.selected = this.world.selected;
      if (this.selected) {
        const c = this.selected;
        c.$el.classList.add('selected');
      }
    }

    // process deleted
    this.world.deleted.forEach((cell) => {
      this.destroyCell(cell);
    });
    this.world.deleted = [];

    this.world.cells.forEach((cell) => {
      this.updateCell(cell);
    });
  }

  worldToScreen(point, el = this.svg) {
    const pt = this.svg.createSVGPoint();
    [pt.x, pt.y] = point;
    return pt.matrixTransform(el.getScreenCTM());
  }

  screenToWorld(point, el = this.svg) {
    let pt = this.svg.createSVGPoint();
    pt.x = point.x - this.pan[0];
    pt.y = point.y - this.pan[1];
    pt = pt.matrixTransform(el.getScreenCTM().inverse());
    return [pt.x, pt.y];
  }

  getRelativeCoords(container, el) {
    // get screen coords of container an el
    const p0 = this.worldToScreen([0, 0], container);
    const p1 = this.worldToScreen([0, 0], el);
    vec2.sub(p1, p1, p0);
    return this.screenToWorld(p1, container);
  }
}
