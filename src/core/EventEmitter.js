export default class EventEmitter {
  on(event, cb) {
    if (!this._listeners) {
      this._listeners = {};
    }
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(cb);
  }

  off(event, cb) {
    if (this._listeners && this._listeners[event]) {
      const idx = this._listeners[event].indexOf(cb);
      if (idx >= 0) {
        this._listeners[event].splice(idx, 1);
      }
    }
  }

  emit(event, ...data) {
    if (this._listeners && this._listeners[event]) {
      this._listeners[event].forEach((cb) => cb(...data));
    }
  }
}
