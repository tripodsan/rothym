<template>
    <div id="gui">
        <MainMenu v-visible="$root.showMainMenu" v-bind:game="$root.game"/>
    </div>
</template>

<script>

import MainMenu from './MainMenu.vue';

export default {
  props: {
  },
  components: {
    MainMenu,
  },
};
</script>
<style src="./GameUI.scss"/>
