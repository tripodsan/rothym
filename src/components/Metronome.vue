<template>
  <div class="metronome-content">
    <UICell :cell="world.metronome" class="metronome"/>
  </div>
</template>

<script>

import UICell from './UICell.vue';

export default {
  components: {
    UICell,
  },
  props: {
    world: Object,
  },
};
</script>

<style scoped>
.metronome {
  width: 150px;
}
</style>
