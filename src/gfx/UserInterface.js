/* eslint-disable no-param-reassign,no-console */

import Vue from 'vue';
import vec2 from '../vec2.js';
import GameUI from '../components/GameUI.vue';

function getPos(el) {
  const rect = el.getBoundingClientRect();
  return [rect.x, rect.y];
}

function setPos(el, pt) {
  el.style.transform = `translate(${pt[0]}px, ${pt[1]}px)`;
}

export default class UserInterface {
  constructor(game) {
    const { world } = game;
    Object.assign(this, {
      world,
      game,
      scale: 1,
    });
    const self = this;
    this.vue = new Vue({
      el: '#gui',
      template: '<GameUI />',
      components: {
        GameUI,
      },
      data: {
        game,
        player: world.player,
        showMainMenu: false,
        cursorSprite: {
          show: false,
          data: null,
        },
      },
      mounted() {
        self.$el = this.$el;
        const rect = self.$el.getBoundingClientRect();
        self.width = rect.width;
        self.height = rect.height;
        self.initMouseHandler();
      },
    });
  }

  // eslint-disable-next-line no-unused-vars
  setScale(scale = this.scale) {
    const rect = this.$el.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
  }

  toggleMainMenu() {
    if (this.vue.$data.showMainMenu) {
      this.closeMainMenu();
      this.world.paused = this.worldWasPaused;
    } else {
      this.worldWasPaused = this.world.paused;
      this.world.paused = true;
      this.openMainMenu();
    }
  }

  openMainMenu() {
    this.vue.$data.showMainMenu = true;
    this.centerElement(this.$el.querySelector('.main-menu'));
  }

  closeMainMenu() {
    this.vue.$data.showMainMenu = false;
  }

  centerElement($el) {
    const rect = $el.getBoundingClientRect();
    const w2 = rect.width / 2;
    const h2 = rect.height / 2;
    setPos($el, [this.width / 2 - w2, this.height / 2 - h2]);
  }

  initMouseHandler() {
    let dragMouseStart = null;
    let dragEl = null;
    let dragStart = null;

    this.$el.addEventListener('pointerdown', (evt) => {
      const pos = [evt.x, evt.y];
      let el = evt.target;
      if (el.classList.contains('ui-titlebar')) {
        el = el.parentNode;
      }
      if (!el.classList.contains('draggable')) {
        return;
      }
      dragMouseStart = pos;
      if (el) {
        el.setPointerCapture(evt.pointerId || 0);
        dragStart = getPos(el);
        dragEl = el;
      }
    });

    this.$el.addEventListener('pointermove', (evt) => {
      const pos = [evt.x, evt.y];
      if (dragEl) {
        const delta = vec2.sub(pos, pos, dragMouseStart);
        vec2.add(delta, delta, dragStart);
        setPos(dragEl, delta);
      }
    });

    this.$el.addEventListener('pointerup', (evt) => {
      if (dragEl) {
        dragEl.releasePointerCapture(evt.pointerId || 0);
      }
      dragEl = null;
      dragMouseStart = null;
    });
  }

  update() {
    const { world } = this;
    this.vue.$data.cursorSprite.show = false;
    this.vue.$data.cursorSprite.data = null;
  }
}
