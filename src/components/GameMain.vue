<template>
  <div class="frame">
    <MainBoard v-bind:world="$root.world"/>
  </div>
</template>

<script>

import MainBoard from './MainBoard.vue';

export default {
  components: {
    MainBoard,
  },
};
</script>

<style>
body {
  background: black;
  margin: 0;
  padding: 0;
  color: white;
  overflow: hidden;
}

.hidden {
  display: none;
}

.frame {
  /*border: 8px #080808 solid;*/
  /*box-sizing: border-box;*/
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: auto;
  /*grid-column-gap: 8px;*/
  transform: translateZ(0);
}
</style>
