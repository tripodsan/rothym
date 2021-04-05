<template>
    <div class="cell-content">
      <svg class="beats" viewBox="-125 -125 250 250" preserveAspectRatio="xMidYMid meet">
        <g class="cell draggable">
          <path/>
          <circle class="ring" :r="size" />
          <g class="notes">
            <circle v-for="note in notes" :key="note.id"
                    :class="['note', `on${note.note}`]"
                    :cx="note.pos[0]"
                    :cy="note.pos[1]"
                    v-on:animationend="onAnimationEnd"
                    v-on:pointerdown="onNoteClick(note)"
            />
          </g>
          <circle class="cursor" />
        </g>
      </svg>
      <div class="text">{{cell.text}}</div>
      <btnMute v-on:click="cell.toggleMute()" :class="['btnMute', 'xbtn', cell.muted ? '' : 'disabled']"/>
    </div>
</template>

<script>

import SVG from '../gfx/SVG.js';
import btnMute from '../assets/btn-mute.svg';

export default {
  components: {
    btnMute,
  },

  props: {
    cell: Object,
    size: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
    };
  },

  computed: {
    notes() {
      return this.$props.cell.getNotes().map((note, idx, arr) => ({
        id: idx,
        pos: this.getNotePos((idx * 2 * Math.PI) / arr.length),
        note,
        cell: this.$props.cell,
      }));
    },
  },

  methods: {
    onAnimationEnd(evt) {
      evt.target.classList.remove('pulse');
    },
    onNoteClick(note) {
      note.cell.toggleNote(note.id);
    },

    getNotePos(a) {
      return [
        Math.cos(a - Math.PI / 2) * this.size,
        Math.sin(a - Math.PI / 2) * this.size,
      ];
    },

    updateCell() {
      // update cursor
      const c = this.cell;
      const $cursor = this.$el.querySelector('svg .cursor');
      const a = c.measureTime() * Math.PI * 2.0;
      SVG.setCircle($cursor, this.getNotePos(a));

      // play notes
      if (c.playedNote >= 0) {
        const $notes = this.$el.querySelector('svg .notes');
        const note = c.notes[c.playedNote];
        const $n = $notes.childNodes[c.playedNote];
        this.$root.audio.play(c.instruments[note]);
        c.playedNote = -1;
        if ($n) {
          $n.classList.add('pulse');
        }
      }
      requestAnimationFrame(this.updateCell);
    },
  },

  mounted() {
    this.updateCell();
  },
};
</script>

<style scoped>
.cell-content {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  justify-content: center;
  align-content: center;
}
.beats {
  grid-column: 1;
  grid-row: 1;
}
.btnMute {
  grid-column: 1;
  grid-row: 1;
}
.cell > path {
  stroke: #66aaed;
  stroke-width: 2px;
  fill: #275ba1;
  /*fill-opacity: 0.6;*/
}

.cell circle.ring {
  /*r: 40px;*/
  stroke: white;
  stroke-width: 2px;
  fill: none;
}
.cell > circle.cursor {
  r: 8px;
  stroke: yellow;
  fill: yellow;
}

.cell .note {
  r: 5px;
  stroke: white;
  fill: white;
  cursor: pointer;
}

.cell .note.on1 {
  r: 7px;
  stroke: black;
  fill: black;
}

.cell .note.on2 {
  r: 7px;
  stroke: gray;
  fill: gray;
}

@keyframes pulse {
  from {r: 7px;}
  to {r: 20px;}
}

.cell .note.pulse {
  animation-name: pulse;
  animation-duration: 0.1s;
  animation-direction: alternate;
}

.text {
  font-size: 24px;
  font-family: verdana, sans-serif;
  text-align: center;
  color: black;
}

.xbtn {
  place-self: center;
  width: 60px;
  color: white;
  cursor: pointer;
}
.xbtn.disabled {
  opacity: 0.2;
}

.xbtn:hover {
  color: #dddddd;
}
</style>
