/*
 * @Author: TYW
 * @Date: 2022-04-05 17:34:25
 * @LastEditTime: 2022-04-07 23:04:32
 * @LastEditors: TYW
 * @Description:
 */
import { BSearch } from './BinarySearchBounds';
import { mat4, ReadonlyVec3, vec3 } from 'gl-matrix';
import { interpolate } from './Mat4Interpolate';

const invert44 = mat4.invert;
const rotateX = mat4.rotateX;
const rotateY = mat4.rotateY;
const rotateZ = mat4.rotateZ;
const lookAt = mat4.lookAt;
const translate = mat4.translate;
const scale = mat4.scale;
const normalize = vec3.normalize;

export class MatrixCameraController {
  public _components;
  public _time: any;
  public prevMatrix;
  public nextMatrix;
  public computedMatrix;
  public computedInverse;
  public computedEye: any;
  public computedUp: any;
  public computedCenter: any;
  public computedRadius: any;
  public _limits: any;

  constructor(initialMatrix: any[]) {
    this._components = initialMatrix.slice();
    this._time = [0];
    this.prevMatrix = initialMatrix.slice();
    this.nextMatrix = initialMatrix.slice();
    this.computedMatrix = initialMatrix.slice();
    this.computedInverse = initialMatrix.slice();
    this.computedEye = [0, 0, 0];
    this.computedUp = [0, 0, 0];
    this.computedCenter = [0, 0, 0];
    this.computedRadius = [0];
    this._limits = [-Infinity, Infinity];
  }

  recalcMatrix(t: number) {
    const time = this._time;
    const tidx = BSearch.le(time, t);
    const mat = this.computedMatrix;
    if (tidx < 0) {
      return;
    }
    const comps = this._components;
    if (tidx === time.length - 1) {
      let ptr = 16 * tidx;
      for (let i = 0; i < 16; ++i) {
        mat[i] = comps[ptr++];
      }
    } else {
      const dt = time[tidx + 1] - time[tidx];
      let ptr = 16 * tidx;
      const prev = this.prevMatrix;
      let allEqual = true;
      for (let i = 0; i < 16; ++i) {
        prev[i] = comps[ptr++];
      }
      const next = this.nextMatrix;
      for (let i = 0; i < 16; ++i) {
        next[i] = comps[ptr++];
        allEqual = allEqual && prev[i] === next[i];
      }
      if (dt < 1e-6 || allEqual) {
        for (let i = 0; i < 16; ++i) {
          mat[i] = prev[i];
        }
      } else {
        interpolate(
          mat as mat4,
          prev as mat4,
          next as mat4,
          (t - time[tidx]) / dt
        );
      }
    }

    const up = this.computedUp;
    up[0] = mat[1];
    up[1] = mat[5];
    up[2] = mat[9];
    normalize(up as vec3, up as vec3);

    const imat = this.computedInverse;
    invert44(imat as mat4, mat as mat4);
    const eye = this.computedEye;
    const w = imat[15];
    eye[0] = imat[12] / w;
    eye[1] = imat[13] / w;
    eye[2] = imat[14] / w;

    const center = this.computedCenter;
    const radius = Math.exp(this.computedRadius[0]);
    for (let i = 0; i < 3; ++i) {
      center[i] = eye[i] - mat[2 + 4 * i] * radius;
    }
  }

  idle(t: number) {
    if (t < this.lastT()) {
      return;
    }
    const mc = this._components;
    let ptr = mc.length - 16;
    for (let i = 0; i < 16; ++i) {
      mc.push(mc[ptr++]);
    }
    this._time.push(t);
  }

  flush(t: any) {
    const idx = BSearch.gt(this._time, t) - 2;
    if (idx < 0) {
      return;
    }
    this._time.splice(0, idx);
    this._components.splice(0, 16 * idx);
  }

  lastT() {
    return this._time[this._time.length - 1];
  }

  lookAt(
    t: number,
    eye: number[] | ReadonlyVec3,
    center: number[] | ReadonlyVec3,
    up: number[] | ReadonlyVec3
  ) {
    const DEFAULT_CENTER = [0, 0, 0];
    this.recalcMatrix(t);
    eye = eye || this.computedEye;
    center = center || DEFAULT_CENTER;
    up = up || this.computedUp;
    this.setMatrix(
      t,
      lookAt(
        this.computedMatrix as mat4,
        eye as vec3,
        center as vec3,
        up as vec3
      )
    );
    let d2 = 0.0;
    for (let i = 0; i < 3; ++i) {
      d2 += Math.pow(center[i] - eye[i], 2);
    }
    d2 = Math.log(Math.sqrt(d2));
    this.computedRadius[0] = d2;
  }

  rotate(t: number, yaw: number, pitch: number, roll: number) {
    this.recalcMatrix(t);
    const mat = this.computedInverse;
    if (yaw) rotateY(mat as mat4, mat as mat4, yaw);
    if (pitch) rotateX(mat as mat4, mat as mat4, pitch);
    if (roll) rotateZ(mat as mat4, mat as mat4, roll);
    this.setMatrix(t, invert44(this.computedMatrix as mat4, mat as mat4));
  }

  pan(t: number, dx: any, dy: any, dz: any) {
    const tvec = [0, 0, 0];
    tvec[0] = -(dx || 0.0);
    tvec[1] = -(dy || 0.0);
    tvec[2] = -(dz || 0.0);
    this.recalcMatrix(t);
    const mat = this.computedInverse;
    translate(mat as mat4, mat as mat4, tvec as vec3);
    this.setMatrix(t, invert44(mat as mat4, mat as mat4));
  }

  translate(t: number, dx: number, dy: number, dz: number) {
    const tvec = [0, 0, 0];
    tvec[0] = dx || 0.0;
    tvec[1] = dy || 0.0;
    tvec[2] = dz || 0.0;
    this.recalcMatrix(t);
    const mat = this.computedMatrix;
    translate(mat as mat4, mat as mat4, tvec as vec3);
    this.setMatrix(t, mat);
  }

  setMatrix(t: number, mat: any[] | Float32Array) {
    if (t < this.lastT()) {
      return;
    }
    this._time.push(t);
    for (let i = 0; i < 16; ++i) {
      this._components.push(mat[i]);
    }
  }

  setDistance(d: number) {
    this.computedRadius[0] = d;
  }

  setDistanceLimits(a: number, b: number) {
    const lim = this._limits;
    lim[0] = a;
    lim[1] = b;
  }

  getDistanceLimits(out: number[]) {
    const lim = this._limits;
    if (out) {
      out[0] = lim[0];
      out[1] = lim[1];
      return out;
    }
    return lim;
  }
}

export const createMatrixCameraController = (options?: { matrix?: any }) => {
  options = options || {};
  const matrix = options.matrix || [
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
  ];
  return new MatrixCameraController(matrix);
};
