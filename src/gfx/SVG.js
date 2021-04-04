/* eslint-env browser */
const SVG = {
  NS: 'http://www.w3.org/2000/svg',

  orderTop(el) {
    const p = el.parentNode;
    p.insertBefore(el, null);
  },

  setLine(el, p0, p1) {
    el.setAttributeNS(null, 'x1', p0[0]);
    el.setAttributeNS(null, 'y1', p0[1]);
    el.setAttributeNS(null, 'x2', p1[0]);
    el.setAttributeNS(null, 'y2', p1[1]);
  },

  setPath(el, p) {
    el.setAttributeNS(null, 'd', p.join(' '));
  },

  setRect(el, p0, p1, height = 0) {
    el.setAttributeNS(null, 'x', p0[0]);
    el.setAttributeNS(null, 'y', p0[1]);
    const w = Array.isArray(p1) ? p1[0] - p0[0] : p1;
    const h = Array.isArray(p1) ? p1[1] - p0[1] : height;
    el.setAttributeNS(null, 'width', w);
    el.setAttributeNS(null, 'height', h);
  },

  setCircle(el, p0, a) {
    el.setAttributeNS(null, 'cx', p0[0]);
    el.setAttributeNS(null, 'cy', p0[1]);
    if (a !== undefined) {
      el.setAttributeNS(null, 'transform', `rotate(${a} ${p0[0]} ${p0[1]})`);
    }
  },

  create(name, ...classes) {
    const $el = document.createElementNS(SVG.NS, name);
    if (classes.length) {
      $el.classList.add(...classes);
    }
    return $el;
  },

  attr(el, name, value) {
    el.setAttributeNS(null, name, String(value));
  },

  /**
   * @param id
   * @param opts
   * @returns {Node}
   */
  createFromTemplate(id, opts = {}) {
    const el = document.getElementById(id).cloneNode(true);
    if (opts.id) {
      el.setAttributeNS(null, 'id', opts.id);
    } else {
      el.removeAttributeNS(null, 'id');
    }
    return el;
  },

  getPos(el) {
    const tx = el.getAttributeNS(null, 'transform');
    if (!tx) {
      return [0, 0];
    }
    const m = tx.match(/.*translate\(\s*([-0-9.]+)\s+([-0-9.]+)\s*\).*/);
    if (!m) {
      return [0, 0];
    }
    return [Number.parseFloat(m[1]), Number.parseFloat(m[2])];
  },

  setPos(el, v, rotation = 0, scale = 1) {
    let tx = `translate(${v[0]} ${v[1]})`;
    if (rotation) {
      tx += ` rotate(${rotation * 60})`;
    }
    if (scale !== 1) {
      tx = `scale(${scale}) ${tx}`;
    }
    if (tx !== el.cachedTx) {
      el.setAttributeNS(null, 'transform', tx);
      // eslint-disable-next-line no-param-reassign
      el.cachedTx = tx;
    }
  },
};

export default SVG;
