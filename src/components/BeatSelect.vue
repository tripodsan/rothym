<template>
  <div class="step-content">
    <btnUp v-on:click="world.changeBeat(1)" class="xbtn"/>
    <btnUp v-on:click="world.changeNumDivs(1)" class="xbtn"/>
    <Metronome :world="world" class="metronome" />

    <div class="value">{{world.beat}}</div>
    <div class="divs">{{divs}}</div>

    <btnDown v-on:click="world.changeBeat(-1)" class="xbtn"/>
    <btnDown v-on:click="world.changeNumDivs(-1)" class="xbtn"/>
  </div>
</template>

<script>

import btnUp from '../assets/btn-up.svg';
import btnDown from '../assets/btn-down.svg';
import Metronome from './Metronome.vue';

const NOTES = [
  '-',
  'q', // quarters
  'n', // eighths
  '™', // triplets
  'y', // sixteens
];
export default {
  components: {
    btnUp,
    btnDown,
    Metronome,
  },
  props: {
    world: Object,
  },
  computed: {
    divs() {
      return NOTES[this.$props.world.divs];
    },
  },
};
</script>

<style scoped>
.step-content {
  display: grid;
  justify-content: center;
  align-content: center;
  column-gap: 10px;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto;
  grid-template-areas:
    ". . metronome"
    ". . metronome"
    ". . metronome"
}
.value {
  font-size: 72px;
  font-family: arial, verdana, sans-serif;
  text-align: center;
  align-self: baseline;
  color: black;
  line-height: 80px;
}
.divs {
  font-family: NoteFont;
  font-size: 72px;
  text-align: center;
  align-self: baseline;
  color: black;
  line-height: 80px;
}

.metronome {
  grid-area: metronome;
  align-self: center;
}
.xbtn {
  place-self: center;
  width: 40px;
  height: 30px;
  color: white;
  cursor: pointer;
}

.xbtn:hover {
  color: #dddddd;
}

@font-face {
  font-family: 'NoteFont';
  src: url('../assets/MusiSync.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

</style>
