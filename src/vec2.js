/* eslint-disable no-param-reassign,func-names,prefer-destructuring,camelcase */

const vec2 = {};

export default vec2;

/**
 * Make a cross product and only return the z component
 * @method crossLength
 * @static
 * @param  {Array} a
 * @param  {Array} b
 * @return {Number}
 */
vec2.crossLength = function (a, b) {
  return a[0] * b[1] - a[1] * b[0];
};

/**
 * Cross product between a vector and the Z component of a vector
 * @method crossVZ
 * @static
 * @param  {Array} out
 * @param  {Array} vec
 * @param  {Number} zcomp
 * @return {Array}
 */
vec2.crossVZ = function (out, vec, zcomp) {
  vec2.rotate(out, vec, -Math.PI / 2);// Rotate according to the right hand rule
  vec2.scale(out, out, zcomp); // Scale with z
  return out;
};

/**
 * Cross product between a vector and the Z component of a vector
 * @method crossZV
 * @static
 * @param  {Array} out
 * @param  {Number} zcomp
 * @param  {Array} vec
 * @return {Array}
 */
vec2.crossZV = function (out, zcomp, vec) {
  vec2.rotate(out, vec, Math.PI / 2); // Rotate according to the right hand rule
  vec2.scale(out, out, zcomp); // Scale with z
  return out;
};

/**
 * Rotate a vector by an angle
 * @method rotate
 * @static
 * @param  {Array} out
 * @param  {Array} a
 * @param  {Number} angle
 */
vec2.rotate = function (out, a, angle) {
  if (angle !== 0) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const x = a[0];
    const y = a[1];
    out[0] = c * x - s * y;
    out[1] = s * x + c * y;
  } else {
    out[0] = a[0];
    out[1] = a[1];
  }
  return out;
};

/**
 * Rotate a vector 90 degrees clockwise
 * @method rotate90cw
 * @static
 * @param  {Array} out
 * @param  {Array} a
 */
vec2.rotate90cw = function (out, a) {
  const x = a[0];
  out[0] = a[1];
  out[1] = -x;
};

/**
 * Transform a point position to local frame.
 * @method toLocalFrame
 * @param  {Array} out
 * @param  {Array} worldPoint
 * @param  {Array} framePosition
 * @param  {Number} frameAngle
 */
vec2.toLocalFrame = function (out, worldPoint, framePosition, frameAngle) {
  vec2.copy(out, worldPoint);
  vec2.sub(out, out, framePosition);
  vec2.rotate(out, out, -frameAngle);
};

/**
 * Transform a point position to global frame.
 * @method toGlobalFrame
 * @param  {Array} out
 * @param  {Array} localPoint
 * @param  {Array} framePosition
 * @param  {Number} frameAngle
 */
vec2.toGlobalFrame = function (out, localPoint, framePosition, frameAngle) {
  vec2.copy(out, localPoint);
  vec2.rotate(out, out, frameAngle);
  vec2.add(out, out, framePosition);
};

/**
 * Transform a vector to local frame.
 * @method vectorToLocalFrame
 * @param  {Array} out
 * @param  {Array} worldVector
 * @param  {Number} frameAngle
 */
vec2.vectorToLocalFrame = function (out, worldVector, frameAngle) {
  vec2.rotate(out, worldVector, -frameAngle);
};

/**
 * Transform a point position to global frame.
 * @method toGlobalFrame
 * @param  {Array} out
 * @param  {Array} localVector
 * @param  {Number} frameAngle
 */
vec2.vectorToGlobalFrame = function (out, localVector, frameAngle) {
  vec2.rotate(out, localVector, frameAngle);
};

/**
 * Compute centroid of a triangle spanned by vectors a,b,c. See http://easycalculation.com/analytical/learn-centroid.php
 * @method centroid
 * @static
 * @param  {Array} out
 * @param  {Array} a
 * @param  {Array} b
 * @param  {Array} c
 * @return  {Array} The out object
 */
vec2.centroid = function (out, a, b, c) {
  vec2.add(out, a, b);
  vec2.add(out, out, c);
  vec2.scale(out, out, 1 / 3);
  return out;
};

/**
 * Creates a new, empty vec2
 * @static
 * @method create
 * @return {Array} a new 2D vector
 */
vec2.create = function () {
  const out = new Array(2);
  out[0] = 0;
  out[1] = 0;
  return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 * @static
 * @method clone
 * @param {Array} a vector to clone
 * @return {Array} a new 2D vector
 */
vec2.clone = function (a) {
  return Array.from(a);
};

/**
 * Creates a new vec2 initialized with the given values
 * @static
 * @method fromValues
 * @param {Number} x X component
 * @param {Number} y Y component
 * @return {Array} a new 2D vector
 */
vec2.fromValues = function (x, y) {
  return [x, y];
};

/**
 * Copy the values from one vec2 to another
 * @static
 * @method copy
 * @param {Array} out the receiving vector
 * @param {Array} a the source vector
 * @return {Array} out
 */
vec2.copy = function (out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
};

/**
 * Set the components of a vec2 to the given values
 * @static
 * @method set
 * @param {Array} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @return {Array} out
 */
vec2.set = function (out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
};

/**
 * Adds two vec2's
 * @static
 * @method add
 * @param {Array} out the receiving vector
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Array} out
 */
vec2.add = function (out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
};

/**
 * Subtracts two vec2's
 * @static
 * @method subtract
 * @param {Array} out the receiving vector
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Array} out
 */
vec2.subtract = function (out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
};

/**
 * Alias for vec2.subtract
 * @static
 * @method sub
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 * @static
 * @method multiply
 * @param {Array} out the receiving vector
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Array} out
 */
vec2.multiply = function (out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
};

/**
 * Multiplies vec and matrix
 * @static
 * @method multiply
 * @param {Array} out the receiving vector
 * @param {Array} m matrix
 * @param {Array} a the vector
 * @return {Array} out
 */
vec2.matrixMult = function (out, m, a) {
  out[0] = m[0][0] * a[0] + m[0][1] * a[1];
  out[1] = m[1][0] * a[0] + m[1][1] * a[1];
  return out;
};

/**
 * Alias for vec2.multiply
 * @static
 * @method mul
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 * @static
 * @method divide
 * @param {Array} out the receiving vector
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Array} out
 */
vec2.divide = function (out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
};

/**
 * Alias for vec2.divide
 * @static
 * @method div
 */
vec2.div = vec2.divide;

/**
 * Scales a vec2 by a scalar number
 * @static
 * @method scale
 * @param {Array} out the receiving vector
 * @param {Array} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @return {Array} out
 */
vec2.scale = function (out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
};

/**
 * Calculates the euclidean distance between two vec2's
 * @static
 * @method distance
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Number} distance between a and b
 */
vec2.distance = function (a, b) {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
};

/**
 * Alias for vec2.distance
 * @static
 * @method dist
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidean distance between two vec2's
 * @static
 * @method squaredDistance
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Number} squared distance between a and b
 */
vec2.squaredDistance = function (a, b) {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  return x * x + y * y;
};

/**
 * Alias for vec2.squaredDistance
 * @static
 * @method sqrDist
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 * @static
 * @method length
 * @param {Array} a vector to calculate length of
 * @return {Number} length of a
 */
vec2.length = function (a) {
  const x = a[0];
  const y = a[1];
  return Math.sqrt(x * x + y * y);
};

/**
 * Alias for vec2.length
 * @method len
 * @static
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 * @static
 * @method squaredLength
 * @param {Array} a vector to calculate squared length of
 * @return {Number} squared length of a
 */
vec2.squaredLength = function (a) {
  const x = a[0];
  const y = a[1];
  return x * x + y * y;
};

/**
 * Alias for vec2.squaredLength
 * @static
 * @method sqrLen
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 * @static
 * @method negate
 * @param {Array} out the receiving vector
 * @param {Array} a vector to negate
 * @return {Array} out
 */
vec2.negate = function (out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
};

/**
 * Normalize a vec2
 * @static
 * @method normalize
 * @param {Array} out the receiving vector
 * @param {Array} a vector to normalize
 * @return {Array} out
 */
vec2.normalize = function (out, a) {
  const x = a[0];
  const y = a[1];
  let len = x * x + y * y;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
  }
  return out;
};

/**
 * Calculates the dot product of two vec2's
 * @static
 * @method dot
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
  return a[0] * b[0] + a[1] * b[1];
};

/**
 * Returns a string representation of a vector
 * @static
 * @method str
 * @param {Array} a vector to represent as a string
 * @return {String} string representation of the vector
 */
vec2.str = function (a) {
  return `vec2(${a[0]}, ${a[1]})`;
};

/**
 * Linearly interpolate/mix two vectors.
 * @static
 * @method lerp
 * @param {Array} out
 * @param {Array} a First vector
 * @param {Array} b Second vector
 * @param {number} t Lerp factor
 */
vec2.lerp = function (out, a, b, t) {
  const ax = a[0];
  const ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
};

/**
 * Reflect a vector along a normal.
 * @static
 * @method reflect
 * @param {Array} out
 * @param {Array} vector
 * @param {Array} normal
 */
vec2.reflect = function (out, vector, normal) {
  const dot = vector[0] * normal[0] + vector[1] * normal[1];
  out[0] = vector[0] - 2 * normal[0] * dot;
  out[1] = vector[1] - 2 * normal[1] * dot;
};

/**
 * Get the intersection point between two line segments.
 * @static
 * @method getLineSegmentsIntersection
 * @param  {Array} out
 * @param  {Array} p0
 * @param  {Array} p1
 * @param  {Array} p2
 * @param  {Array} p3
 * @return {boolean} True if there was an intersection, otherwise false.
 */
vec2.getLineSegmentsIntersection = function (out, p0, p1, p2, p3) {
  const t = vec2.getLineSegmentsIntersectionFraction(p0, p1, p2, p3);
  if (t < 0) {
    return false;
  }
  out[0] = p0[0] + (t * (p1[0] - p0[0]));
  out[1] = p0[1] + (t * (p1[1] - p0[1]));
  return true;
};

/**
 * Get the intersection fraction between two line segments.
 * If successful, the intersection is at p0 + t * (p1 - p0)
 * @static
 * @method getLineSegmentsIntersectionFraction
 * @param  {Array} p0
 * @param  {Array} p1
 * @param  {Array} p2
 * @param  {Array} p3
 * @return {number} A number between 0 and 1 if there was an intersection, otherwise -1.
 */
vec2.getLineSegmentsIntersectionFraction = function (p0, p1, p2, p3) {
  const s1_x = p1[0] - p0[0];
  const s1_y = p1[1] - p0[1];
  const s2_x = p3[0] - p2[0];
  const s2_y = p3[1] - p2[1];

  const s = (-s1_y * (p0[0] - p2[0]) + s1_x * (p0[1] - p2[1])) / (-s2_x * s1_y + s1_x * s2_y);
  const t = (s2_x * (p0[1] - p2[1]) - s2_y * (p0[0] - p2[0])) / (-s2_x * s1_y + s1_x * s2_y);
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) { // Collision detected
    return t;
  }
  return -1; // No collision
};

/**
 * Gets the angle of the vector p0 -> p1
 * @param {array} p0
 * @param {array} p1
 * @returns {number} angle
 */
vec2.angle = function (p0, p1) {
  return Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
};
