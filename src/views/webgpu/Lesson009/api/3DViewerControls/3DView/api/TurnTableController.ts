/*
 * @Author: TYW
 * @Date: 2022-04-05 14:08:51
 * @LastEditTime: 2022-04-07 23:04:37
 * @LastEditors: TYW
 * @Description:
 */
import { createFilteredVector, FilteredVector } from './FilteredVector';
import { mat4, ReadonlyMat4, vec3 } from 'gl-matrix';
const invert44 = mat4.invert;
const rotateM = mat4.rotate;
const cross = vec3.cross;
const normalize3 = vec3.normalize;
const dot3 = vec3.dot;
const len3 = (x: number, y: number, z: number) => {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
};

const clamp1 = (x: number) => {
  return Math.min(1.0, Math.max(-1.0, x));
};

const findOrthoPair = (v: any) => {
  const vx = Math.abs(v[0]);
  const vy = Math.abs(v[1]);
  const vz = Math.abs(v[2]);

  const u: vec3 = [0, 0, 0];
  if (vx > Math.max(vy, vz)) {
    u[2] = 1;
  } else if (vy > Math.max(vx, vz)) {
    u[0] = 1;
  } else {
    u[1] = 1;
  }

  let vv = 0;
  let uv = 0;
  for (let i = 0; i < 3; ++i) {
    vv += v[i] * v[i];
    uv += u[i] * v[i];
  }
  for (let i = 0; i < 3; ++i) {
    u[i] -= (uv / vv) * v[i];
  }
  normalize3(u, u);
  return u;
};

export class TurntableController {
  public center: FilteredVector;
  public up: FilteredVector;
  public right: FilteredVector;
  public radius: FilteredVector;
  public angle: FilteredVector;
  public computedCenter;
  public computedUp;
  public computedRight;
  public computedRadius;
  public computedAngle;
  public computedToward: vec3;
  public computedEye: any;
  public computedMatrix;

  constructor(
    zoomMin: number,
    zoomMax: number,
    center: any[],
    up: any[],
    right: any[],
    radius: any,
    theta: any,
    phi: any
  ) {
    this.center = createFilteredVector([center]) as FilteredVector;

    this.up = createFilteredVector([up]) as FilteredVector;

    this.right = createFilteredVector([right]) as FilteredVector;

    this.radius = createFilteredVector([[radius]]) as FilteredVector;

    this.angle = createFilteredVector([[theta, phi]]) as FilteredVector;
    this.angle.bounds = [
      [-Infinity, -Math.PI / 2],
      [Infinity, Math.PI / 2]
    ];

    this.setDistanceLimits(zoomMin, zoomMax);

    this.computedCenter = this.center.curve(0);
    this.computedUp = this.up.curve(0);
    this.computedRight = this.right.curve(0);
    this.computedRadius = this.radius.curve(0);
    this.computedAngle = this.angle.curve(0);
    this.computedToward = [0, 0, 0];
    this.computedEye = [0, 0, 0];
    this.computedMatrix = new Array(16);
    for (let i = 0; i < 16; ++i) {
      this.computedMatrix[i] = 0.5;
    }

    this.recalcMatrix(0);
  }

  setDistanceLimits(minDist: number, maxDist: number) {
    if (minDist > 0) {
      minDist = Math.log(minDist);
    } else {
      minDist = -Infinity;
    }
    if (maxDist > 0) {
      maxDist = Math.log(maxDist);
    } else {
      maxDist = Infinity;
    }
    maxDist = Math.max(maxDist, minDist);
    this.radius.bounds[0][0] = minDist;
    this.radius.bounds[1][0] = maxDist;
  }

  getDistanceLimits(out: number[]) {
    const bounds = this.radius.bounds[0];
    if (out) {
      out[0] = Math.exp(bounds[0][0]);
      out[1] = Math.exp(bounds[1][0]);
      return out;
    }
    return [Math.exp(bounds[0][0]), Math.exp(bounds[1][0])];
  }

  recalcMatrix(t: any) {
    //Recompute curves
    this.center.curve(t);
    this.up.curve(t);
    this.right.curve(t);
    this.radius.curve(t);
    this.angle.curve(t);

    //Compute frame for camera matrix
    const up = this.computedUp;
    const right = this.computedRight;
    let uu = 0.0;
    let ur = 0.0;
    for (let i = 0; i < 3; ++i) {
      ur += up[i] * right[i];
      uu += up[i] * up[i];
    }
    const ul = Math.sqrt(uu);
    let rr = 0.0;
    for (let i = 0; i < 3; ++i) {
      right[i] -= (up[i] * ur) / uu;
      rr += right[i] * right[i];
      up[i] /= ul;
    }
    const rl = Math.sqrt(rr);
    for (let i = 0; i < 3; ++i) {
      right[i] /= rl;
    }

    //Compute toward vector
    const toward = this.computedToward;
    cross(toward, up as vec3, right as vec3);
    normalize3(toward, toward);

    //Compute angular parameters
    const radius = Math.exp(this.computedRadius[0]);
    const theta = this.computedAngle[0];
    const phi = this.computedAngle[1];

    const ctheta = Math.cos(theta);
    const stheta = Math.sin(theta);
    const cphi = Math.cos(phi);
    const sphi = Math.sin(phi);

    const center = this.computedCenter;

    const wx = ctheta * cphi;
    const wy = stheta * cphi;
    const wz = sphi;

    const sx = -ctheta * sphi;
    const sy = -stheta * sphi;
    const sz = cphi;

    const eye = this.computedEye;
    const mat = this.computedMatrix;
    for (let i = 0; i < 3; ++i) {
      const x = wx * right[i] + wy * toward[i] + wz * up[i];
      mat[4 * i + 1] = sx * right[i] + sy * toward[i] + sz * up[i];
      mat[4 * i + 2] = x;
      mat[4 * i + 3] = 0.0;
    }

    const ax = mat[1];
    const ay = mat[5];
    const az = mat[9];
    const bx = mat[2];
    const by = mat[6];
    const bz = mat[10];
    let cx = ay * bz - az * by;
    let cy = az * bx - ax * bz;
    let cz = ax * by - ay * bx;
    const cl = len3(cx, cy, cz);
    cx /= cl;
    cy /= cl;
    cz /= cl;
    mat[0] = cx;
    mat[4] = cy;
    mat[8] = cz;

    for (let i = 0; i < 3; ++i) {
      eye[i] = center[i] + mat[2 + 4 * i] * radius;
    }

    for (let i = 0; i < 3; ++i) {
      let rrb = 0.0;
      for (let j = 0; j < 3; ++j) {
        rrb += mat[i + 4 * j] * eye[j];
      }
      mat[12 + i] = -rrb;
    }
    mat[15] = 1.0;

  }

  getMatrix(t: any, result: any[]) {
    this.recalcMatrix(t);
    const mat = this.computedMatrix;
    if (result) {
      for (let i = 0; i < 16; ++i) {
        result[i] = mat[i];
      }
      return result;
    }
    return mat;
  }

  rotate(t: any, dtheta: any, dphi: any, droll: number) {
    const zAxis = [0, 0, 0];
    this.angle.move([t, dtheta, dphi]);
    if (droll) {
      this.recalcMatrix(t);

      const mat = this.computedMatrix;
      zAxis[0] = mat[2];
      zAxis[1] = mat[6];
      zAxis[2] = mat[10];

      const up = this.computedUp;
      const right = this.computedRight;
      const toward = this.computedToward;

      for (let i = 0; i < 3; ++i) {
        mat[4 * i] = up[i];
        mat[4 * i + 1] = right[i];
        mat[4 * i + 2] = toward[i];
      }
      rotateM(mat as mat4, mat as mat4, droll, zAxis as vec3);
      for (let i = 0; i < 3; ++i) {
        up[i] = mat[4 * i];
        right[i] = mat[4 * i + 1];
      }

      this.up.set([t, up[0], up[1], up[2]]);
      this.right.set([t, right[0], right[1], right[2]]);
    }
  }

  pan(t: any, dx: number, dy: number, dz: number) {
    dx = dx || 0.0;
    dy = dy || 0.0;
    dz = dz || 0.0;

    this.recalcMatrix(t);
    const mat = this.computedMatrix;

    const dist = Math.exp(this.computedRadius[0]);

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

    const vx = rx * dx + ux * dy;
    const vy = ry * dx + uy * dy;
    const vz = rz * dx + uz * dy;
    this.center.move([t, vx, vy, vz]);

    //Update z-component of radius
    let radius = Math.exp(this.computedRadius[0]);
    radius = Math.max(1e-4, radius + dz);
    this.radius.set([t, Math.log(radius)]);
  }

  translate(t: any, dx: any, dy: any, dz: any) {
    this.center.move([t, dx || 0.0, dy || 0.0, dz || 0.0]);
  }

  //Recenters the coordinate axes
  setMatrix(t: any, mat: any[] | ReadonlyMat4, axes: number, noSnap: any) {
    //Get the axes for tare
    let ushift = 1;
    if (typeof axes === 'number') {
      ushift = axes | 0;
    }
    if (ushift < 0 || ushift > 3) {
      ushift = 1;
    }
    const vshift = (ushift + 2) % 3;
    const fshift = (ushift + 1) % 3;

    //Recompute state for new t value
    if (!mat) {
      this.recalcMatrix(t);
      mat = this.computedMatrix;
    }

    //Get right and up vectors
    let ux = mat[ushift];
    let uy = mat[ushift + 4];
    let uz = mat[ushift + 8];
    if (!noSnap) {
      const ul = len3(ux, uy, uz);
      ux /= ul;
      uy /= ul;
      uz /= ul;
    } else {
      const ax = Math.abs(ux);
      const ay = Math.abs(uy);
      const az = Math.abs(uz);
      const am = Math.max(ax, ay, az);
      if (ax === am) {
        ux = ux < 0 ? -1 : 1;
        uy = uz = 0;
      } else if (az === am) {
        uz = uz < 0 ? -1 : 1;
        ux = uy = 0;
      } else {
        uy = uy < 0 ? -1 : 1;
        ux = uz = 0;
      }
    }

    let rx = mat[vshift];
    let ry = mat[vshift + 4];
    let rz = mat[vshift + 8];
    const ru = rx * ux + ry * uy + rz * uz;
    rx -= ux * ru;
    ry -= uy * ru;
    rz -= uz * ru;
    const rl = len3(rx, ry, rz);
    rx /= rl;
    ry /= rl;
    rz /= rl;

    let fx = uy * rz - uz * ry;
    let fy = uz * rx - ux * rz;
    let fz = ux * ry - uy * rx;
    const fl = len3(fx, fy, fz);
    fx /= fl;
    fy /= fl;
    fz /= fl;

    // this.center.jump([t, ex, ey, ez]);
    this.radius.idle(t);
    this.up.jump([t, ux, uy, uz]);
    this.right.jump([t, rx, ry, rz]);

    let phi, theta;
    let tu = 1;
    if (ushift === 2) {
      const cx = mat[1];
      const cy = mat[5];
      const cz = mat[9];
      const cr = cx * rx + cy * ry + cz * rz;
      const cf = cx * fx + cy * fy + cz * fz;
      if (tu < 0) {
        phi = -Math.PI / 2;
      } else {
        phi = Math.PI / 2;
      }
      theta = Math.atan2(cf, cr);
    } else {
      const tx = mat[2];
      const ty = mat[6];
      const tz = mat[10];
      tu = tx * ux + ty * uy + tz * uz;
      const tr = tx * rx + ty * ry + tz * rz;
      const tf = tx * fx + ty * fy + tz * fz;

      phi = Math.asin(clamp1(tu));
      theta = Math.atan2(tf, tr);
    }

    this.angle.jump([t, theta, phi]);

    this.recalcMatrix(t);
    const dx = mat[2];
    const dy = mat[6];
    const dz = mat[10];

    const imat = this.computedMatrix;
    invert44(imat as mat4, mat as mat4);
    const w = imat[15];
    const ex = imat[12] / w;
    const ey = imat[13] / w;
    const ez = imat[14] / w;

    const gs = Math.exp(this.computedRadius[0]);
    this.center.jump([t, ex - dx * gs, ey - dy * gs, ez - dz * gs]);
  }

  lastT() {
    return Math.max(
      this.center.lastT(),
      this.up.lastT(),
      this.right.lastT(),
      this.radius.lastT(),
      this.angle.lastT()
    );
  }

  idle(t: any) {
    this.center.idle(t);
    this.up.idle(t);
    this.right.idle(t);
    this.radius.idle(t);
    this.angle.idle(t);
  }

  flush(t: any) {
    this.center.flush(t);
    this.up.flush(t);
    this.right.flush(t);
    this.radius.flush(t);
    this.angle.flush(t);
  }

  setDistance(t: any, d: number) {
    if (d > 0) {
      this.radius.set([t, Math.log(d)]);
    }
  }

  lookAt(t: any, eye: number[], center: any[], up: any[]) {
    this.recalcMatrix(t);

    eye = eye || this.computedEye;
    center = center || this.computedCenter;
    up = up || this.computedUp;

    let ux = up[0];
    let uy = up[1];
    let uz = up[2];
    const ul = len3(ux, uy, uz);
    if (ul < 1e-6) {
      return;
    }
    ux /= ul;
    uy /= ul;
    uz /= ul;

    let tx = eye[0] - center[0];
    let ty = eye[1] - center[1];
    let tz = eye[2] - center[2];
    const tl = len3(tx, ty, tz);
    if (tl < 1e-6) {
      return;
    }
    tx /= tl;
    ty /= tl;
    tz /= tl;

    const right = this.computedRight;
    let rx = right[0];
    let ry = right[1];
    let rz = right[2];
    const ru = ux * rx + uy * ry + uz * rz;
    rx -= ru * ux;
    ry -= ru * uy;
    rz -= ru * uz;
    let rl = len3(rx, ry, rz);

    if (rl < 0.01) {
      rx = uy * tz - uz * ty;
      ry = uz * tx - ux * tz;
      rz = ux * ty - uy * tx;
      rl = len3(rx, ry, rz);
      if (rl < 1e-6) {
        return;
      }
    }
    rx /= rl;
    ry /= rl;
    rz /= rl;

    this.up.set([t, ux, uy, uz]);
    this.right.set([t, rx, ry, rz]);
    this.center.set([t, center[0], center[1], center[2]]);
    this.radius.set([t, Math.log(tl)]);

    let fx = uy * rz - uz * ry;
    let fy = uz * rx - ux * rz;
    let fz = ux * ry - uy * rx;
    const fl = len3(fx, fy, fz);
    fx /= fl;
    fy /= fl;
    fz /= fl;

    const tu = ux * tx + uy * ty + uz * tz;
    const tr = rx * tx + ry * ty + rz * tz;
    const tf = fx * tx + fy * ty + fz * tz;

    const phi = Math.asin(clamp1(tu));
    const theta = Math.atan2(tf, tr);

    const angleState = this.angle._state;
    let lastTheta = angleState[angleState.length - 1];
    const lastPhi = angleState[angleState.length - 2];
    lastTheta = lastTheta % (2.0 * Math.PI);
    const dp = Math.abs(lastTheta + 2.0 * Math.PI - theta);
    const d0 = Math.abs(lastTheta - theta);
    const dn = Math.abs(lastTheta - 2.0 * Math.PI - theta);
    if (dp < d0) {
      lastTheta += 2.0 * Math.PI;
    }
    if (dn < d0) {
      lastTheta -= 2.0 * Math.PI;
    }

    this.angle.jump([this.angle.lastT(), lastTheta, lastPhi]);
    this.angle.set([t, theta, phi]);
  }
}

export const createTurntableController = (options?: {
  center?: any;
  up?: any;
  right?: any;
  radius?: any;
  theta?: any;
  phi?: any;
  eye?: any;
  zoomMin?: any;
  zoomMax?: any;
}) => {
  options = options || {};

  let center = options.center || [0, 0, 0];
  let up = options.up || [0, 1, 0];
  let right = options.right || findOrthoPair(up);
  let radius = options.radius || 1.0;
  let theta = options.theta || 0.0;
  let phi = options.phi || 0.0;

  center = [].slice.call(center, 0, 3);

  up = [].slice.call(up, 0, 3);
  normalize3(up, up);

  right = [].slice.call(right, 0, 3);
  normalize3(right, right);

  if ('eye' in options) {
    const eye = options.eye;
    const toward = [eye[0] - center[0], eye[1] - center[1], eye[2] - center[2]];
    cross(right, toward as vec3, up);
    if (len3(right[0], right[1], right[2]) < 1e-6) {
      right = findOrthoPair(up);
    } else {
      normalize3(right, right);
    }

    radius = len3(toward[0], toward[1], toward[2]);

    const ut = dot3(up, toward as vec3) / radius;
    const rt = dot3(right, toward as vec3) / radius;
    phi = Math.acos(ut);
    theta = Math.acos(rt);
  }

  //Use logarithmic coordinates for radius
  radius = Math.log(radius);

  //Return the controller
  return new TurntableController(
    options.zoomMin,
    options.zoomMax,
    center,
    up,
    right,
    radius,
    theta,
    phi
  );
};
