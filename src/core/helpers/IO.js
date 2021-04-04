const IO = {
  toJSON(obj) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }
    if (obj.toJSON) {
      return obj.toJSON();
    }
    if (Array.isArray(obj)) {
      return obj.map(IO.toJSON);
    }
    return Object.entries(obj).reduce((p, [key, value]) => {
      // eslint-disable-next-line no-param-reassign
      p[key] = IO.toJSON(value);
      return p;
    }, {});
  },

  fromJSON(clazz, obj) {
    if (Array.isArray(obj)) {
      return obj.map(clazz.fromJSON);
    }
    return clazz.fromJSON(obj);
  },
};

export default IO;
