<template>
  <div class="bpm-content">
    <btnUp v-on:click="world.changeSpeed(100)" class="xbtn"/>
    <btnUp v-on:click="world.changeSpeed(10)" class="xbtn"/>
    <btnUp v-on:click="world.changeSpeed(1)" class="xbtn"/>
    <div></div>

    <div class="value">{{speed[0]}}</div>
    <div class="value">{{speed[1]}}</div>
    <div class="value">{{speed[2]}}</div>
    <div class="bpm-text">bpm</div>

    <btnDown v-on:click="world.changeSpeed(-100)" class="xbtn"/>
    <btnDown v-on:click="world.changeSpeed(-10)" class="xbtn"/>
    <btnDown v-on:click="world.changeSpeed(-1)" class="xbtn"/>
    <div></div>
  </div>
</template>

<script>

import btnUp from '../assets/btn-up.svg';
import btnDown from '../assets/btn-down.svg';
import UICell from './UICell.vue';
import Metronome from './Metronome.vue';

export default {
  components: {
    Metronome,
    UICell,
    btnUp,
    btnDown,
  },
  props: {
    world: Object,
  },
  computed: {
    speed() {
      return String(this.$props.world.speed).padStart(3, '0');
    },
  },
};
</script>

<style scoped>
.bpm-content {
  display: grid;
  justify-content: center;
  align-content: center;
  column-gap: 10px;
  grid-template-columns: auto auto auto auto;
  grid-template-rows: auto;
}

.value {
  font-size: 72px;
  font-family: futura, verdana, sans-serif;
  text-align: center;
  align-self: baseline;
  color: black;
  line-height: 80px;
}
.bpm-text {
  font-size: 24px;
  font-family: futura, verdana, sans-serif;
  text-align: center;
  align-self: start;
  color: black;
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
