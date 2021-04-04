/* eslint-env browser */
/* globals Stats, anime */

import Vue from 'vue';

import { BootstrapVue } from 'bootstrap-vue';
import VueVisible from '../gfx/v-visible.js';

import GameMain from '../components/GameMain.vue';

import World from './World.js';

import SVGRenderer from '../gfx/SVGRenderer.js';
import UserInterface from '../gfx/UserInterface.js';

import '../gfx/custom.scss';

// Install BootstrapVue
Vue.config.devtools = true;
Vue.config.performance = true;
Vue.use(VueVisible);
Vue.use(BootstrapVue);

const wait = async (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export default class Game {
  constructor() {
    const world = new World();

    // some FPS stats
    const stats = new Stats();
    document.body.appendChild(stats.dom);
    stats.showPanel(0);

    Object.assign(this, {
      world,
      stats,
    });

    this.boundUpdate = this.update.bind(this);
    this.initKeyHandler();
  }

  save() {
    return {
      world: this.world.toJSON(),
    };
  }

  load(data) {
    this.world = World.fromJSON(data.world);
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
        case 'm':
          this.userInterface.toggleMainMenu();
          break;
        case 'Escape':
          this.world.player.unselect();
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

  updateGUI() {
    const { info } = this.vue.$data;
    const { cell } = info;
    cell.selected = this.world.selected;

    // render mouse info
    const { mouse } = info;
    mouse.position = this.world.mousePos;
    // const mc = this.world.getCellAt(this.world.mousePos);
    // if (mc) {
    //   mouse.cell = `${mc.getTitle()} - ${mc.type} - ${mc.rotation * 60}°`;
    // } else {
    //   mouse.cell = '-';
    // }
    // const rc = this.world.getResourceAt(this.world.mousePos);
    // mouse.resource = `${rc ? rc.getTitle() : '-'}`;
    // mouse.terrain = this.world.terrain.get(this.world.mousePos);

    // render world info
    const { world } = info;
    world.tick = this.world.tickCount;
    world.state = this.world.paused ? '(paused)' : '(running)';
  }

  update() {
    this.stats.begin();
    this.world.tick();
    this.renderer.render();
    this.updateGUI();
    this.userInterface.update();
    this.stats.end();

    requestAnimationFrame(this.boundUpdate);
  }

  async run() {
    await wait(200);
    const self = this;
    this.vue = new Vue({
      el: '#main',
      template: '<GameMain v-bind:info="info" />',
      components: { GameMain },
      data: {
        info: {
          mouse: {
            position: 0,
            resource: 0,
            cell: 0,
            terrain: '',
          },
          cell: {
            selected: null,
          },
          world: {
            tick: 0,
            state: '',
          },
        },
      },
      mounted() {
        self.svg = document.getElementById('svg-main');
        self.renderer = new SVGRenderer(self.world, self.svg);
        self.userInterface = new UserInterface(self);
        self.renderer.setScale();
        self.userInterface.setScale();
        self.world.init();

        anime({
          targets: [self.svg],
          opacity: [0, 1],
          delay: 100,
          duration: 2000,
        });
        requestAnimationFrame(self.boundUpdate);
      },
    });

    window.addEventListener('resize', () => {
      this.renderer.setScale();
      this.userInterface.setScale();
    });
  }
}
