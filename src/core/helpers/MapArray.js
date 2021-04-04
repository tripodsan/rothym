export default class MapArray {
  constructor() {
    this.map = new Map();
  }

  add(key, value) {
    let a = this.map.get(key);
    if (!a) {
      a = [];
      this.map.set(key, a);
    }
    if (a.indexOf(value) >= 0) {
      return false;
    }
    a.push(value);
    return true;
  }

  remove(key, value) {
    const a = this.map.get(key);
    if (!a) {
      return false;
    }
    const idx = a.indexOf(value);
    if (idx < 0) {
      return false;
    }
    a.splice(idx, 1);
    return true;
  }

  get(key) {
    return this.map.get(key) || [];
  }

  has(key) {
    return this.get(key).length > 0;
  }

  values() {
    const ret = [];
    for (const values of this.map.values()) {
      for (const value of values) {
        if (ret.indexOf(value) < 0) {
          ret.push(value);
        }
      }
    }
    return ret;
  }
}
