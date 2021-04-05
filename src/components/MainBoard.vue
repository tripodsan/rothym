<template>
  <div id="main-board">
    <div class="content">
      <BPMSelect :world="world"/>
      <BeatSelect :world="world"/>
      <Controls :world="world"/>
      <div/>
      <UICell v-for="cell in world.cells" :key="cell.id" :cell="cell" />
    </div>
  </div>
</template>

<script>

import BPMSelect from './BPMSelect.vue';
import UICell from './UICell.vue';
import Controls from './Controls.vue';
import BeatSelect from './BeatSelect.vue';
import Metronome from './Metronome.vue';

export default {
  components: {
    Metronome,
    BeatSelect,
    Controls,
    UICell,
    BPMSelect,
  },
  props: {
    world: Object,
  },
};
</script>
<style scoped>
#main-board {
  display: block;
  border: 1px #222222 solid;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  user-select: none;
  /*opacity: 0;*/
  font-family: "Lucida Grande", "sans-serif";
  font-size: 10px;
  grid-column: 1;
  grid-row: 1;
  transform: translateZ(1px);
  background: #b8a481;
}

.content {
  /*padding: 8px;*/
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: auto;
  /*grid-column-gap: 8px;*/
  /*grid-row-gap: 8px;*/
}

</style>
