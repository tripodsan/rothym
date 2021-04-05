<template>
  <div class="step-content">
    <btnUp v-on:click="world.changeBeat(1)" class="xbtn"/>
    <div></div>
    <btnUp v-on:click="world.changeNumNotes(1)" class="xbtn"/>
    <Metronome :world="world" class="metronome" />

    <div class="value">{{world.beat}}</div>
    <div class="value">/</div>
    <div class="value">{{divs}}</div>

    <btnDown v-on:click="world.changeBeat(-1)" class="xbtn"/>
    <div></div>
    <btnDown v-on:click="world.changeNumNotes(-1)" class="xbtn"/>
  </div>
</template>

<script>

import btnUp from '../assets/btn-up.svg';
import btnDown from '../assets/btn-down.svg';
import Metronome from './Metronome.vue';

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
      return this.$props.world.numNotes;
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
  grid-template-columns: auto auto auto auto;
  grid-template-rows: auto;
  grid-template-areas:
    ". . . metronome"
    ". . . metronome"
    ". . . metronome"
}
.value {
  font-size: 72px;
  font-family: futura, verdana, sans-serif;
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
</style>
