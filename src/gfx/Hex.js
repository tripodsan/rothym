/* eslint-disable no-multi-spaces */
import vec2 from '../vec2.js';

const ROOT_THREE = Math.sqrt(3);
const ROOT_THREE2 = ROOT_THREE / 2;
const ROOT_THREE3 = ROOT_THREE / 3;

export default class Hex {
  constructor(size) {
    Object.assign(this, {
      size,
      w: ROOT_THREE * size,
      w2: (ROOT_THREE * size) / 2,
      h: size * 2,
      h2: size,
      h4: size / 2,
      h12: size * 3,
      mCartToHex: [
        [ROOT_THREE3 / size, -1 / (3 * size)],
        [0, 2 / (3 * size)],
      ],
      mHexToCart: [
        [size * ROOT_THREE, size * ROOT_THREE2],
        [0, (size * 3) / 2],
      ],
    });
  }

  cartToHex(pt) {
    const p = vec2.matrixMult([0, 0], this.mCartToHex, pt);
    return Hex.hexRound(p);
  }

  hexToCart(hex) {
    return vec2.matrixMult([0, 0], this.mHexToCart, hex);
  }

  static axial2chunk(pos, chunkSize) {
    return Hex.offset2chunk(Hex.axial2offset(pos), chunkSize);
  }

  static offset2chunk(offs, chunkSize) {
    return [Math.floor(offs[0] / chunkSize), Math.floor(offs[1] / chunkSize)];
  }

  static axial2offset(hex) {
    // eslint-disable-next-line no-bitwise
    return [hex[0] + Math.floor(hex[1] / 2), hex[1]];
  }

  static offset2axial(offs) {
    // eslint-disable-next-line no-bitwise
    return [offs[0] - Math.floor(offs[1] / 2), offs[1]];
  }

  /**
   * Draws a hex path. Center of hexagon is 0,0
   *
   *      0
   *   1    5
   *   2    4
   *      3
   *
   * @param size
   * @param dx
   * @param dy
   * @param reverse
   * @returns {*[]}
   */
  static createHexPath(size, dx = 0, dy = 0, reverse = false) {
    const w2 = (ROOT_THREE * size) / 2;
    const h2 = size;
    const h4 = size / 2;
    if (reverse) {
      return [
        'M',  dx, -h2 + dy, // 0
        'l',  w2,  h4,      // 5
        'l',   0,  h2,      // 4
        'l', -w2,  h4,      // 3
        'l', -w2, -h4,      // 2
        'l',   0, -h2,      // 1
        'Z',
      ];
    }
    return [
      'M',  dx, -h2 + dy, // 0
      'l', -w2,  h4,      // 1
      'l',   0,  h2,      // 2
      'l',  w2,  h4,      // 3
      'l',  w2, -h4,      // 4
      'l',   0, -h2,      // 5
      'Z',
    ];
  }

  /**
   * Gets the hex vertices. Center of hexagon is 0,0
   *
   *      0
   *   1    5
   *   2    4
   *      3
   *
   * @param size
   * @param dx
   * @param dy
   * @returns {*[]}
   */
  static getHexVertices(size, dx = 0, dy = 0) {
    const w2 = (ROOT_THREE * size) / 2;
    const h2 = size;
    const h4 = size / 2;
    return [
      [dx, dy - h2],
      [dx - w2, dy - h4],
      [dx - w2, dy + h4],
      [dx, dy + h2],
      [dx + w2, dy + h4],
      [dx + w2, dy - h4],
    ];
  }

  /**
   * Creates a complex from tile points
   * @param hexSize
   * @param def
   * @param dx
   * @param dy
   */
  createComplexTilePath(hexSize, def, dx = 0, dy = 0) {
    const path = [];
    const verts = Hex.getHexVertices(hexSize, dx, dy);
    def.paths.forEach((p) => {
      let first = true;
      for (let i = 0; i < p.length; i += 3) {
        const tileIdx = p[i];
        const v0 = p[i + 1];
        const v1 = p[i + 2];
        // get the dx and dy based on the tile index
        const d = this.hexToCart(def.tiles[0][tileIdx]);
        for (let vIdx = v0; vIdx <= v1; vIdx++) {
          const v = vec2.clone(verts[vIdx % verts.length]);
          vec2.add(v, v, d);
          path.push(first ? 'M' : 'L', v[0], v[1]);
          first = false;
        }
      }
      path.push('Z');
    });
    return path;
  }

  /**
   * Creates a hex segment nr.
   * @param segNr
   * @param hexSize
   * @param segSize
   * @param dx
   * @param dy
   */
  // eslint-disable-next-line class-methods-use-this
  createHexSegmentPath(segNr, hexSize, segSize, dx = 0, dy = 0) {
    const path = [];
    const verts = Hex.getHexVertices(hexSize, dx, dy);

    // move center in
    const d = hexSize - segSize;
    const cx = dx + Math.cos(Hex.RAD_60 * (-segNr)) * d;
    const cy = dy + Math.sin(Hex.RAD_60 * (-segNr)) * d;

    path.push('M', cx, cy);
    path.push('L', verts[(segNr + 4) % 6][0], verts[(segNr + 4) % 6][1]);
    path.push('L', verts[(segNr + 5) % 6][0], verts[(segNr + 5) % 6][1]);
    path.push('Z');
    return path;
  }

  static range(cube, r) {
    const results = [];
    for (let x = -r; x <= r; x += 1) {
      const y0 = Math.max(-r, -x - r);
      const y1 = Math.min(r, -x + r);
      for (let y = y0; y <= y1; y += 1) {
        const z = -x - y;
        results.push([cube[0] + x, cube[1] + y, cube[2] + z]);
      }
    }
    return results;
  }

  static cubeRound(cube) {
    let x = Math.round(cube[0]);
    let y = Math.round(cube[1]);
    let z = Math.round(cube[2]);
    const dx = Math.abs(x - cube[0]);
    const dy = Math.abs(y - cube[1]);
    const dz = Math.abs(z - cube[2]);
    if (dx > dy && dx > dz) {
      x = -y - z;
    } else if (dy > dz) {
      y = -x - z;
    } else {
      z = -x - y;
    }
    return [x, y, z];
  }

  static cubeToAxial(cube) {
    return [cube[0], cube[2]];
  }

  static axialToCube(hex) {
    const x = hex[0];
    const z = hex[1];
    const y = -x - z;
    return [x, y, z];
  }

  static hexDistance(a, b) {
    return (Math.abs(a[0] - b[0])
      + Math.abs(a[0] + a[1] - b[0] - b[1])
      + Math.abs(a[1] - b[1])) / 2;
  }

  static hexRound(hex) {
    return Hex.cubeToAxial(Hex.cubeRound(Hex.axialToCube(hex)));
  }

  static rotate(hex, n = 1, center = [0, 0]) {
    const p = Hex.axialToCube(hex);
    const c = Hex.axialToCube(center);
    const dp = [p[0] - c[0], p[1] - c[1], p[2] - c[2]];
    // rotate n times
    for (let i = 0; i < n % 3; i++) {
      dp.unshift(dp.pop());
    }
    if (n % 2 === 1) {
      dp[0] = -dp[0];
      dp[1] = -dp[1];
      dp[2] = -dp[2];
    }
    const r = [dp[0] + c[0], dp[1] + c[1], dp[2] + c[2]];
    return Hex.cubeToAxial(r);
  }
}

Hex.DIRECTION = {
  EAST: 0,
  SOUTH_EAST: 1,
  SOUTH_WEST: 2,
  WEST: 3,
  NORTH_WEST: 4,
  NORTH_EAST: 5,
  BY_NAME: {
    e: 0,
    se: 1,
    sw: 2,
    w: 3,
    nw: 4,
    ne: 5,
  },
  DELTAS: [
    [1, 0], // e
    [0, 1], // se
    [-1, 1], // sw
    [-1, 0], // w
    [0, -1], // nw
    [1, -1], // ne
  ],
};

Hex.ROOT_THREE = ROOT_THREE;
Hex.ROOT_THREE2 = ROOT_THREE2;
Hex.ROOT_THREE3 = ROOT_THREE3;
Hex.RAD_60 = Math.PI / 3;
Hex.RAD_30 = Math.PI / 6;
