<template>
  <div class="rhythm-content">
    <b-form-select v-on:change="load()" v-model="selected" :options="songs"/>
<!--    <b-button v-on:click="save()">save</b-button>-->
  </div>
</template>

<script>

import songs from '../config/songs.js';

export default {
  components: {
  },
  props: {
    world: Object,
  },

  data() {
    return {
      selected: 'rock',
      songs: Object.entries(songs).map(([value, song]) => ({
        value,
        text: song.name,
      })),
    };
  },

  methods: {
    save() {
      // eslint-disable-next-line no-console
      console.log(this.$root.game.save());
    },
    load() {
      this.$root.game.load(songs[this.selected]);
    },
  },
};
</script>

<style scoped>
.rhythm-content {
  display: grid;
  align-content: center;

}
</style>
