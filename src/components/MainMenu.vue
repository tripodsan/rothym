<template>
    <div class="main-menu ui-window draggable">
        <div class="ui-titlebar">Main Menu</div>
        <div class="content" >
          <b-form-group label="saves" label-for="menu-saves">
            <b-form-select id="menu-saves" v-model="selectedSlot" :select-size="8">
              <option v-for="(game, index) in slots" :value="index">{{game.name}}</option>
            </b-form-select>
          </b-form-group>
          <b-button variant="primary" v-on:click="saveGame()">save</b-button>
          <b-button variant="primary" v-on:click="loadGame()">load</b-button>
        </div>
    </div>
</template>

<script>

import GameManager from '../core/GameManager';
// import Game from '../core/Game';

export default {
  props: {
    game: Object,
  },

  data() {
    return {
      selectedSlot: 0,
      slotsKey: 0,
    };
  },
  computed: {
    slots() {
      // eslint-disable-next-line no-unused-expressions
      this.slotsKey;
      return [...GameManager.loadGameInventory(), { name: '<new save>' }];
    },
  },
  methods: {
    saveGame() {
      const slot = this.slots[this.selectedSlot];
      let { name } = slot;
      if (name === '<new save>') {
        name = `game ${this.selectedSlot}`;
      }
      const data = this.game.save();
      // console.log(data);
      GameManager.saveGame(name, data);
      this.slotsKey += 1;
    },
    loadGame() {
      const slot = this.slots[this.selectedSlot];
      const { name } = slot;
      if (name === '<new save>') {
        return;
      }
      const data = GameManager.loadGame(name);
      this.game.load(data);
    },
  },
  components: {
  },
};
</script>

<style lang="scss" scoped>
    @use "./variables" as ui;

    .content {
        display: grid;
        padding: 8px;
        grid-template-columns: 200px;
        grid-template-rows: auto;
        grid-gap: 4px;
    }
</style>
