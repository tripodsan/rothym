<template>
  <div class="control-content">
    <btnBack v-on:click="world.step(-1)" class="xbtn" />
    <btnPlay v-on:click="onPlay()" :class="[!world.paused ? 'hidden' : '', 'xbtn']" />
    <btnStop v-on:click="world.togglePause()" :class="[world.paused ? 'hidden' : '', 'xbtn']" />
    <btnFwd  v-on:click="world.step(1)" class="xbtn" />
  </div>
</template>

<script>

import btnPlay from '../assets/btn-play.svg';
import btnStop from '../assets/btn-stop.svg';
import btnFwd from '../assets/btn-fwd.svg';
import btnBack from '../assets/btn-back.svg';

// remember first time
let firstPlay = true;

export default {
  props: {
    world: Object,
  },
  methods: {
    onPlay() {
      if (firstPlay) {
        this.$root.audio.play('metronome');
        firstPlay = false;
      }
      this.world.togglePause();
    },
  },
  components: {
    btnPlay,
    btnStop,
    btnFwd,
    btnBack,
  },
};
</script>

<style scoped>
.control-content {
  display: grid;
  justify-content: center;
  align-content: center;
  column-gap: 10px;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto;
}
.hidden {
  display: none;
}
.xbtn {
  width: 100px;
  height: 100px;
  color: white;
  cursor: pointer;
}
.xbtn:hover {
  color: #dddddd;
}
</style>
