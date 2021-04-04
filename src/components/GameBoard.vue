<template>
  <svg id="svg-main" preserveAspectRatio="xMidYMid meet">
    <rect id="bg" x="-50%" y="-50%" width="100%" height="100%" fill="url(#hex-pattern)"/>

    <g id="main">
      <g id="cells"></g>
      <g id="bpm" transform="translate(-325 -250)">
        <text dominant-baseline="middle" text-anchor="middle" y="10">100</text>
        <path id="bpm-up" d="M -50 -40 l 100 0 l -50 -40 Z" />
        <path id="bpm-down" d="M -50 40 l 100 0 l -50  40 Z" />
      </g>
      <g id="controls" transform="translate(-150 -250)">
        <path id="play" d="M 0 0 l -50 50 l 0 -100 Z" />
        <path id="stop" d="M 25 -50 l 0 100 l -100 0 l 0 -100 Z" />
      </g>
    </g>

    <defs id="defs">
      <pattern id="hex-pattern" patternUnits="userSpaceOnUse">
        <circle />
      </pattern>

      <g id="cell-template" class="cell draggable">
        <path/>
        <circle class="ring"/>
        <g class="notes"></g>
        <circle class="cursor" />
        <text dominant-baseline="middle" text-anchor="middle" y="150">snare</text>
      </g>

      <circle id="note-template" class="note" />

    </defs>
  </svg>
</template>

<script>

export default {
  props: [],
};
</script>
<style src="./GameBoard.css"/>

<style scoped>

</style>
