/* eslint-env browser */
/* global anime */
import Vue from 'vue';

import { BootstrapVue } from 'bootstrap-vue';
import VueVisible from '../gfx/v-visible.js';

import GameMain from '../components/GameMain.vue';

import World from './World.js';

import '../gfx/custom.scss';
import AudioManager from '../gfx/AudioManager.js';

// Install BootstrapVue
Vue.config.devtools = true;
Vue.config.performance = true;
Vue.use(VueVisible);
Vue.use(BootstrapVue);

const wait = async (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export default class Game {
  constructor() {
    const world = new World();

    Object.assign(this, {
      world,
    });

    this.boundUpdate = this.update.bind(this);
    this.initKeyHandler();

    this.audio = new AudioManager();
    this.audio.addSample('kick', '/sounds/Kick 001 Basic.wav');
    this.audio.addSample('snare', '/sounds/Snare 004.wav');
    this.audio.addSample('snare-rim', '/sounds/rim-punch.wav');
    this.audio.addSample('hihat', '/sounds/HiHat Closed 004 Flat Real.wav');
    this.audio.addSample('hihat_open', '/sounds/HiHat Open 001.wav');
    this.audio.addSample('clave', '/sounds/Percussion Clave 002 808.wav');
    this.audio.addSample('tom-high', '/sounds/Percussion Conga 001 High.wav');
    this.audio.addSample('tom-low', '/sounds/Percussion Conga 002 Low.wav');
    this.audio.addSample('ride', '/sounds/Cymbal Ride 001 Smooth.wav');
    this.audio.addSample('cow', '/sounds/Percussion Cowbell 001.wav');
    this.audio.addSample('crash', '/sounds/Crash 001.wav');
  }

  save() {
    return this.world.toJSON();
  }

  load(data) {
    console.log('loading', data);
    this.world.load(data);
  }

  initKeyHandler() {
    document.addEventListener('keydown', (evt) => {
      switch (evt.key) {
        case 'p':
          this.world.togglePause();
          break;
        case ' ':
          this.world.step();
          break;
        case 'Delete':
        case 'd':
          this.world.deleteSelected();
          break;
        default:
          break;
      }
    });
  }

  update() {
    this.world.tick();
    requestAnimationFrame(this.boundUpdate);
  }

  async run() {
    await wait(200);
    const self = this;
    this.vue = new Vue({
      el: '#main',
      template: '<GameMain />',
      components: { GameMain },
      data: {
        world: self.world,
        audio: this.audio,
        game: self,
      },
      mounted() {
        self.board = document.getElementById('main-board');
        self.world.init();

        anime({
          targets: [self.board],
          opacity: [0, 1],
          delay: 100,
          duration: 2000,
        });
        requestAnimationFrame(self.boundUpdate);
      },
    });
  }
}
