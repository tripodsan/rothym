/* eslint-disable class-methods-use-this,no-console */

/* eslint-env browser */

class GameManager {
  loadGameInventory() {
    const games = window.localStorage.getItem('rothym-games');
    try {
      return JSON.parse(games) || [];
    } catch (e) {
      return [];
    }
  }

  saveGameInventory(games = []) {
    window.localStorage.setItem('rothym-games', JSON.stringify(games));
  }

  lastSave() {
    const g = this.loadGameInventory().sort((g0, g1) => g1.timestamp - g0.timestamp);
    return g[0];
  }

  saveGame(name, data) {
    const games = this.loadGameInventory();
    let game = games.find((g) => g.name === name);
    if (!game) {
      game = {
        name,
        filename: `rothym-game-${name}`,
      };
      games.push(game);
    }
    game.timestamp = Date.now();
    this.saveGameInventory(games);
    window.localStorage.setItem(game.filename, JSON.stringify(data));
  }

  loadGame(name) {
    const games = this.loadGameInventory();
    const game = games.find((g) => g.name === name);
    if (!game) {
      console.error('game does not exist', name);
      return null;
    }
    try {
      return JSON.parse(window.localStorage.getItem(game.filename));
    } catch (e) {
      console.error('unable to load game', name, e);
      return null;
    }
  }
}

export default new GameManager();
