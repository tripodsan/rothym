<template>
    <div>
        <div v-show="info.selected" class="cell">
            <h3>Cell Info</h3>
            <h4>{{info.selected && info.selected.template.name}}</h4>
        </div>
    </div>
</template>

<script>

export default {
  props: {
    info: Object,
  },
  components: {
  },
  data() {
    return {
    };
  },
  computed: {
  },
};
</script>

<style scoped>
    .cell {
        color: #aaaaaa;
    }
    .cell h3 {
        font-size: 14px;
        color: white;
    }
    .cell h4 {
        font-size: 13px;
        margin: 8px 0 4px 0;
        color: white;
    }
    .cell h5 {
        font-size: 12px;
        margin: 8px 0 4px 0;
        color: white;
    }
    .config-entry {
        display: grid;
        grid-template-columns: 100px auto;
        grid-column-gap: 8px;
    }
    .modules {
      margin-left: 10px;
    }
</style>
