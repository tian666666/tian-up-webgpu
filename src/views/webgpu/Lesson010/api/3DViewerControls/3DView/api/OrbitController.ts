/*
 * @Author: TYW
 * @Date: 2022-04-05 17:10:19
 * @LastEditTime: 2022-04-12 00:13:16
 * @LastEditors: TYW
 * @Description:
 */
import { createFilteredVector, FilteredVector } from './FilteredVector';
import { quatFromFrame } from './QuatFromFrame';
import { mat4, quat, ReadonlyMat4, ReadonlyVec3, vec3 } from 'gl-matrix';
const lookAt = mat4.lookAt;
const mat4FromQuat = mat4.fromQuat;
const invert44 = mat4.invert;

const len3 = (x: number, y: number, z: number) => {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
};

const len4 = (w: number, x: number, y: number, z: number) => {
  return Math.sqrt(
    Math.pow(w, 2) + Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)
  );
};

const normalize4 = (out: number[], a: any[]) => {
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const aw = a[3];
  const al = len4(ax, ay, az, aw);
  if (al > 1e-6) {
    out[0] = ax / al;
    out[1] = ay / al;
    out[2] = az / al;
    out[3] = aw / al;
  } else {
    out[0] = out[1] = out[2] = 0.0;
    out[3] = 1.0;
  }
};

export class OrbitCameraController {
  public radius: FilteredVector;
  public center: FilteredVector;
  public rotation: FilteredVector;

  public computedRadius;
  private _computedCenter: any;
  public get computedCenter() {
    return this._computedCenter;
  }
  public set computedCenter(valueA) {
    console.log('终极这里改变了？');
    this._computedCenter = valueA;
  }
  // public computedCenter;
  public computedRotation;
  public computedUp: any;
  public computedEye: any;
  public computedMatrix: any;

  constructor(initQuat: any, initCenter: any, initRadius: number) {
    this.radius = createFilteredVector([[initRadius]]) as FilteredVector;

    this.center = createFilteredVector([initCenter]) as FilteredVector;
    this.rotation = createFilteredVector([initQuat]) as FilteredVector;

    this.computedRadius = this.radius.curve(0);

    this.computedCenter = this.center.curve(0);
    console.log('执行this.center.curve(0)-constructor', this.center);
    this.computedRotation = this.rotation.curve(0);
    this.computedUp = [0.1, 0, 0];
    this.computedEye = [0.1, 0, 0];

    this.computedMatrix = [0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    this.recalcMatrix(0);
  }

  lastT() {
    return Math.max(
      this.radius.lastT(),
      this.center.lastT(),
      this.rotation.lastT()
    );
  }

  recalcMatrix(t: number) {
    // console.log('执行recalcMatrix', {
    //   radius: this.radius,
    //   center: this.center,
    //   rotation: this.rotation
    // });
    this.radius.curve(t);

    this.center.curve(t);
    this.rotation.curve(t);

    const quat = this.computedRotation;
    if (isNaN(this.computedRotation[0])) {
      console.log('');
      debugger;
    }
    normalize4(quat, quat);

    const mat = this.computedMatrix;
    if (isNaN(this.computedMatrix[0])) {
      console.log('');
      debugger;
    }
    mat4FromQuat(mat as mat4, quat as quat);

    const center = this.computedCenter
      ? isNaN(this.computedCenter[0])
        ? [0, 0, 0]
        : this.computedCenter
      : [0, 0, 0];
    const eye = this.computedEye;
    const up = this.computedUp;
    if (isNaN(this.computedUp[0])) {
      debugger;
    }
    const radius = Math.exp(this.computedRadius[0]);

    eye[0] = center[0] + radius * mat[2];
    if (isNaN(eye[0])) {
      debugger;
    }
    eye[1] = center[1] + radius * mat[6];
    eye[2] = center[2] + radius * mat[10];
    up[0] = mat[1];
    up[1] = mat[5];
    up[2] = mat[9];

    for (let i = 0; i < 3; ++i) {
      let rr = 0.0;
      for (let j = 0; j < 3; ++j) {
        rr += mat[i + 4 * j] * eye[j];
      }
      mat[12 + i] = -rr;
    }
    if (isNaN(this.computedEye[0])) {
      const aaa = this.computedEye;
      debugger;
    }
  }

  getMatrix(t: number, result: number[]) {
    this.recalcMatrix(t);
    const m = this.computedMatrix;
    if (result) {
      for (let i = 0; i < 16; ++i) {
        result[i] = m[i];
      }
      return result;
    }
    return m;
  }

  idle(t: any) {
    this.center.idle(t);
    this.radius.idle(t);
    this.rotation.idle(t);
  }

  flush(t: any) {
    this.center.flush(t);
    this.radius.flush(t);
    this.rotation.flush(t);
  }

  pan(t: number, dx: number, dy: number, dz: number) {
    dx = dx || 0.0;
    dy = dy || 0.0;
    dz = dz || 0.0;
    this.recalcMatrix(t);
    const mat = this.computedMatrix;

    let ux = mat[1];
    let uy = mat[5];
    let uz = mat[9];
    const ul = len3(ux, uy, uz);
    ux /= ul;
    uy /= ul;
    uz /= ul;

    let rx = mat[0];
    let ry = mat[4];
    let rz = mat[8];
    const ru = rx * ux + ry * uy + rz * uz;
    rx -= ux * ru;
    ry -= uy * ru;
    rz -= uz * ru;
    const rl = len3(rx, ry, rz);
    rx /= rl;
    ry /= rl;
    rz /= rl;

    let fx = mat[2];
    let fy = mat[6];
    let fz = mat[10];
    const fu = fx * ux + fy * uy + fz * uz;
    const fr = fx * rx + fy * ry + fz * rz;
    fx -= fu * ux + fr * rx;
    fy -= fu * uy + fr * ry;
    fz -= fu * uz + fr * rz;
    const fl = len3(fx, fy, fz);
    fx /= fl;
    fy /= fl;
    fz /= fl;

    const vx = rx * dx + ux * dy;
    const vy = ry * dx + uy * dy;
    const vz = rz * dx + uz * dy;
    console.log('centermove', this.center);
    this.center.move([t, vx, vy, vz]);

    //Update z-component of radius
    let radius = Math.exp(this.computedRadius[0]);
    radius = Math.max(1e-4, radius + dz);
    this.radius.set([t, Math.log(radius)]);
  }

  rotate(t: number, dx: number, dy: number, dz: number) {
    this.recalcMatrix(t);

    dx = dx || 0.0;
    dy = dy || 0.0;

    const mat = this.computedMatrix;

    const rx = mat[0];
    const ry = mat[4];
    const rz = mat[8];

    const ux = mat[1];
    const uy = mat[5];
    const uz = mat[9];

    const fx = mat[2];
    const fy = mat[6];
    const fz = mat[10];

    const qx = dx * rx + dy * ux;
    const qy = dx * ry + dy * uy;
    const qz = dx * rz + dy * uz;

    let bx = -(fy * qz - fz * qy);
    let by = -(fz * qx - fx * qz);
    let bz = -(fx * qy - fy * qx);
    let bw = Math.sqrt(
      Math.max(0.0, 1.0 - Math.pow(bx, 2) - Math.pow(by, 2) - Math.pow(bz, 2))
    );
    const bl = len4(bx, by, bz, bw);
    if (bl > 1e-6) {
      bx /= bl;
      by /= bl;
      bz /= bl;
      bw /= bl;
    } else {
      bx = by = bz = 0.0;
      bw = 1.0;
    }

    const rotation = this.computedRotation;
    const ax = rotation[0];
    const ay = rotation[1];
    const az = rotation[2];
    const aw = rotation[3];

    let cx = ax * bw + aw * bx + ay * bz - az * by;
    let cy = ay * bw + aw * by + az * bx - ax * bz;
    let cz = az * bw + aw * bz + ax * by - ay * bx;
    let cw = aw * bw - ax * bx - ay * by - az * bz;

    //Apply roll
    if (dz) {
      bx = fx;
      by = fy;
      bz = fz;
      const s = Math.sin(dz) / len3(bx, by, bz);
      bx *= s;
      by *= s;
      bz *= s;
      bw = Math.cos(dx);
      cx = cx * bw + cw * bx + cy * bz - cz * by;
      cy = cy * bw + cw * by + cz * bx - cx * bz;
      cz = cz * bw + cw * bz + cx * by - cy * bx;
      cw = cw * bw - cx * bx - cy * by - cz * bz;
    }

    const cl = len4(cx, cy, cz, cw);
    if (cl > 1e-6) {
      cx /= cl;
      cy /= cl;
      cz /= cl;
      cw /= cl;
    } else {
      cx = cy = cz = 0.0;
      cw = 1.0;
    }

    this.rotation.set([t, cx, cy, cz, cw]);
  }

  lookAt(
    t: number,
    eye: number[] | vec3,
    center: any[] | vec3,
    up: number[] | vec3
  ) {
    this.recalcMatrix(t);
    if (isNaN(center[0])) {
      debugger;
    }
    center = center || this.computedCenter;
    if (isNaN(center[0])) {
      debugger;
    }
    eye = eye || this.computedEye;

    up = up || this.computedUp;

    const mat = this.computedMatrix;
    lookAt(mat as mat4, eye as vec3, center as vec3, up as vec3);

    const rotation = this.computedRotation;
    quatFromFrame(
      rotation,
      mat[0],
      mat[1],
      mat[2],
      mat[4],
      mat[5],
      mat[6],
      mat[8],
      mat[9],
      mat[10]
    );
    normalize4(rotation, rotation);
    this.rotation.set([t, rotation[0], rotation[1], rotation[2], rotation[3]]);

    let fl = 0.0;
    for (let i = 0; i < 3; ++i) {
      fl += Math.pow(center[i] - eye[i], 2);
    }
    this.radius.set([t, 0.5 * Math.log(Math.max(fl, 1e-6))]);

    this.center.set([t, center[0], center[1], center[2]]);
  }

  translate(t: any, dx: any, dy: any, dz: any) {
    console.log('translate？', this.center);
    debugger;
    this.center.move([t, dx || 0.0, dy || 0.0, dz || 0.0]);
  }

  setMatrix(t: number, matrix: number[] | mat4) {
    const rotation = this.computedRotation;
    quatFromFrame(
      rotation,
      matrix[0],
      matrix[1],
      matrix[2],
      matrix[4],
      matrix[5],
      matrix[6],
      matrix[8],
      matrix[9],
      matrix[10]
    );
    normalize4(rotation, rotation);
    this.rotation.set([t, rotation[0], rotation[1], rotation[2], rotation[3]]);

    const mat = this.computedMatrix;
    invert44(mat as mat4, matrix as mat4);
    const w = mat[15];
    if (Math.abs(w) > 1e-6) {
      const cx = mat[12] / w;
      const cy = mat[13] / w;
      const cz = mat[14] / w;

      this.recalcMatrix(t);
      const r = Math.exp(this.computedRadius[0]);
      console.log('这里设置的值是setMatrix', this.center);
      this.center.set([t, cx - mat[2] * r, cy - mat[6] * r, cz - mat[10] * r]);
      console.log('这里设置的值是setMatrix之后', this.center);
      this.radius.idle(t);
    } else {
      this.center.idle(t);
      this.radius.idle(t);
    }
  }

  setDistance(t: any, d: number) {
    if (d > 0) {
      this.radius.set([t, Math.log(d)]);
    }
  }

  setDistanceLimits(lo: number, hi: number) {
    if (lo > 0) {
      lo = Math.log(lo);
    } else {
      lo = -Infinity;
    }
    if (hi > 0) {
      hi = Math.log(hi);
    } else {
      hi = Infinity;
    }
    hi = Math.max(hi, lo);
    this.radius.bounds[0][0] = lo;
    this.radius.bounds[1][0] = hi;
  }

  getDistanceLimits(out: number[]) {
    const bounds = this.radius.bounds;
    if (out) {
      out[0] = Math.exp(bounds[0][0]);
      out[1] = Math.exp(bounds[1][0]);
      return out;
    }
    return [Math.exp(bounds[0][0]), Math.exp(bounds[1][0])];
  }

  toJSON() {
    this.recalcMatrix(this.lastT());
    console.log('执行cener的改变');
    return {
      center: this.computedCenter.slice(),
      rotation: this.computedRotation.slice(),
      distance: Math.log(this.computedRadius[0]),
      zoomMin: this.radius.bounds[0][0],
      zoomMax: this.radius.bounds[1][0]
    };
  }

  fromJSON(options: {
    center: any;
    rotation: any;
    distance: any;
    zoomMin: number;
    zoomMax: number;
  }) {
    const t = this.lastT();
    const c = options.center;
    if (c) {
      console.log('在这个formjson 执行了center的赋值？');
      this.center.set([t, c[0], c[1], c[2]]);
    }
    const r = options.rotation;
    if (r) {
      this.rotation.set([t, r[0], r[1], r[2], r[3]]);
    }
    const d = options.distance;
    if (d && d > 0) {
      this.radius.set([t, Math.log(d)]);
    }
    this.setDistanceLimits(options.zoomMin, options.zoomMax);
  }
}

export const createOrbitController = (options?: {
  center?: any;
  rotation?: any;
  radius?: any;
  zoomMin?: any;
  zoomMax?: any;
  eye?: any;
  up?: any;
}) => {
  options = options || {};
  let center = options.center || [0, 0, 0];
  let rotation = options.rotation || [0, 0, 0, 1];
  const radius = options.radius || 1.0;

  center = [].slice.call(center, 0, 3);
  rotation = [].slice.call(rotation, 0, 4);
  normalize4(rotation, rotation);

  const result = new OrbitCameraController(rotation, center, Math.log(radius));

  result.setDistanceLimits(options.zoomMin, options.zoomMax);

  if ('eye' in options || 'up' in options) {
    result.lookAt(0, options.eye, options.center, options.up);
  }

  return result;
};
