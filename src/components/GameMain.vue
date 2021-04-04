<template>
  <div class="frame">
    <GameBoard/>
    <div id="gui"/>
  </div>
</template>

<script>

import GameBoard from './GameBoard.vue';

export default {
  props: {
    info: Object,
  },
  components: {
    GameBoard,
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
  border: 8px #080808 solid;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: auto;
  grid-column-gap: 8px;
  transform: translateZ(0);
}
</style>
