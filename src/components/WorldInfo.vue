<template>
    <div class="world">
        <h3>World Info</h3>
        <div class="info">
<!--            <div>Tick</div><div class="gui-pos-value">{{info.tick}} {{info.state}}</div>-->
          <b-button onclick="">play</b-button>
        </div>
    </div>
</template>

<script>

export default {
  props: {
    info: Object,
  },
};
</script>

<style scoped>
    .info {
        display: grid;
        grid-template-columns: 100px auto;
        grid-column-gap: 8px;
    }
    .world {
        color: #aaaaaa;
    }
    .world h3 {
        font-size: 14px;
        color: white;
    }
    .world h4 {
        font-size: 13px;
        margin: 4px 0 8px 0;
        color: white;
    }
</style>
