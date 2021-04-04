<template>
    <div class="mouse">
        <h3>Mouse Info</h3>
        <div class="info">
            <div>Position</div><div class="gui-pos-value">{{info.position}} {{chunk}}</div>
            <div>Resource</div><div class="gui-res-value">{{info.resource}}</div>
            <div>Cell</div><div class="gui-cell-value">{{info.cell}}</div>
            <div>Terrain</div><div class="gui-res-value">{{info.terrain}}</div>
        </div>
    </div>
</template>

<script>

import Hex from '../gfx/Hex';

export default {
  props: {
    info: Object,
  },
  computed: {
    chunk() {
      return Hex.axial2chunk(this.info.position, 8);
    },
  },
};
</script>

<style scoped>
    .info {
        display: grid;
        grid-template-columns: 100px auto;
        grid-column-gap: 8px;
    }
    .mouse {
        color: #aaaaaa;
    }
    .mouse h3 {
        font-size: 14px;
        color: white;
    }
    .mouse h4 {
        font-size: 13px;
        margin: 4px 0 8px 0;
        color: white;
    }
</style>
