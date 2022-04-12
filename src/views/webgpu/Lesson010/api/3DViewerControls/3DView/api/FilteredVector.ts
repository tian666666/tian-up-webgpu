/*
 * @Author: TYW
 * @Date: 2022-04-05 14:28:26
 * @LastEditTime: 2022-04-12 20:36:39
 * @LastEditors: TYW
 * @Description:
 */
import { cubicHermite, dcubicHermite } from './CubicHermite';
import { BSearch } from './BinarySearchBounds';

const clamp = (lo: number, hi: number, x: number) => {
  return Math.min(hi, Math.max(lo, x));
};

export class FilteredVector {
  public dimension: number;
  public bounds: any[][];
  public _state;
  public _velocity;
  public _time: any;
  public _scratch: any;
  constructor(state0: any, velocity0: any, t0: any) {
    // state0 = Array.isArray(state0) ? (state0.length > 0 ? state0 : [0]) : [0];
    this.dimension = state0.length;
    this.bounds = [new Array(this.dimension), new Array(this.dimension)];
    for (let i = 0; i < this.dimension; ++i) {
      this.bounds[0][i] = -Infinity;
      this.bounds[1][i] = Infinity;
    }
    this._state = state0.slice().reverse();
    this._velocity = velocity0.slice().reverse();
    this._time = [t0];
    this._scratch = [
      state0.slice(),
      state0.slice(),
      state0.slice(),
      state0.slice(),
      state0.slice()
    ];
  }

  flush(t: any) {
    const idx = BSearch.gt(this._time, t) - 1;
    if (idx <= 0) {
      return;
    }
    this._time.splice(0, idx);
    this._state.splice(0, idx * this.dimension);
    this._velocity.splice(0, idx * this.dimension);
  }
  curve(t: any) {
    const time = this._time;
    const n = time.length;
    const idx = BSearch.le(time, t);
    const result = this._scratch[0];
    const state = this._state;
    const velocity = this._velocity;
    const d = this.dimension;
    const bounds = this.bounds;
    if (idx < 0) {
      let ptr = d - 1;
      for (let i = 0; i < d; ++i, --ptr) {
        result[i] = state[ptr];
      }
    } else if (idx >= n - 1) {
      let ptr = state.length - 1;
      const tf = t - time[n - 1];
      for (let i = 0; i < d; ++i, --ptr) {
        result[i] = state[ptr] + tf * velocity[ptr];
      }
    } else {
      let ptr = d * (idx + 1) - 1;
      const t0 = time[idx];
      const t1 = time[idx + 1];
      const dt = t1 - t0 || 1.0;
      const x0 = this._scratch[1];
      const x1 = this._scratch[2];
      const v0 = this._scratch[3];
      const v1 = this._scratch[4];
      let steady = true;
      for (let i = 0; i < d; ++i, --ptr) {
        x0[i] = state[ptr];
        v0[i] = velocity[ptr] * dt;
        x1[i] = state[ptr + d];
        v1[i] = velocity[ptr + d] * dt;
        steady = steady && x0[i] === x1[i] && v0[i] === v1[i] && v0[i] === 0.0;
      }
      if (steady) {
        for (let i = 0; i < d; ++i) {
          result[i] = x0[i];
        }
      } else {
        cubicHermite(x0, v0, x1, v1, (t - t0) / dt, result);
      }
    }
    const lo = bounds[0];
    const hi = bounds[1];
    for (let i = 0; i < d; ++i) {
      result[i] = clamp(lo[i], hi[i], result[i]);
    }

    return result;
  }

  dcurve(t: any) {
    const time = this._time;
    const n = time.length;
    const idx = BSearch.le(time, t);
    const result = this._scratch[0];
    const state = this._state;
    const velocity = this._velocity;
    const d = this.dimension;
    if (idx >= n - 1) {
      let ptr = state.length - 1;
      const tf = t - time[n - 1];
      for (let i = 0; i < d; ++i, --ptr) {
        result[i] = velocity[ptr];
      }
    } else {
      let ptr = d * (idx + 1) - 1;
      const t0 = time[idx];
      const t1 = time[idx + 1];
      const dt = t1 - t0 || 1.0;
      const x0 = this._scratch[1];
      const x1 = this._scratch[2];
      const v0 = this._scratch[3];
      const v1 = this._scratch[4];
      let steady = true;
      for (let i = 0; i < d; ++i, --ptr) {
        x0[i] = state[ptr];
        v0[i] = velocity[ptr] * dt;
        x1[i] = state[ptr + d];
        v1[i] = velocity[ptr + d] * dt;
        steady = steady && x0[i] === x1[i] && v0[i] === v1[i] && v0[i] === 0.0;
      }
      if (steady) {
        for (let i = 0; i < d; ++i) {
          result[i] = 0.0;
        }
      } else {
        dcubicHermite(x0, v0, x1, v1, (t - t0) / dt, result);
        for (let i = 0; i < d; ++i) {
          result[i] /= dt;
        }
      }
    }
    return result;
  }
  // 时间可能是数组导致平移的问题 临时解决方法
  lastT() {
    const time = this._time;
    const timeRes = time[time.length - 1];
    if (Array.isArray(timeRes) && timeRes.length > 0) {
      return timeRes[0];
    } else {
      return timeRes;
    }
    // return time[time.length - 1];
  }

  stable() {
    const velocity = this._velocity;
    let ptr = velocity.length;
    for (let i = this.dimension - 1; i >= 0; --i) {
      if (velocity[--ptr]) {
        return false;
      }
    }
    return true;
  }

  jump(t: any[]) {
    const t0 = this.lastT();
    const d = this.dimension;
    // if (t < t0 || arguments.length !== d + 1) {
    //   return;
    // }
    if (t[0] < t0 || t.length !== d + 1) {
      return;
    }
    const state = this._state;
    const velocity = this._velocity;
    let ptr = state.length - this.dimension;
    const bounds = this.bounds;
    const lo = bounds[0];
    const hi = bounds[1];
    this._time.push(t0, t[0]);
    for (let j = 0; j < 2; ++j) {
      for (let i = 0; i < d; ++i) {
        state.push(state[ptr++]);
        velocity.push(0);
      }
    }
    this._time.push(t[0]);
    for (let i = d; i > 0; --i) {
      // state.push(clamp(lo[i - 1], hi[i - 1], arguments[i]));
      const clampRes = clamp(lo[i - 1], hi[i - 1], t[i]);
      if (isNaN(clampRes) || clampRes === undefined || clampRes === null) {
        debugger;
      }

      state.push(clampRes);
      velocity.push(0);
    }
  }

  push(t: any[]) {
    const t0 = this.lastT();
    const d = this.dimension;
    // if (t < t0 || arguments.length !== d + 1) {
    //   return;
    // }
    if (t[0] < t0 || t.length !== d + 1) {
      return;
    }
    const state = this._state;
    const velocity = this._velocity;
    let ptr = state.length - this.dimension;
    const dt = t[0] - t0;
    const bounds = this.bounds;
    const lo = bounds[0];
    const hi = bounds[1];
    const sf = dt > 1e-6 ? 1 / dt : 0;
    this._time.push(t[0]);
    for (let i = d; i > 0; --i) {
      // const xc = clamp(lo[i - 1], hi[i - 1], arguments[i]);
      const clampRes = clamp(lo[i - 1], hi[i - 1], t[i]);
      if (isNaN(clampRes) || clampRes === undefined || clampRes === null) {
        debugger;
      }
      state.push(clampRes);
      velocity.push((clampRes - state[ptr++]) * sf);
    }
  }

  set(t: any[]) {
    const d = this.dimension;
    // if (t < this.lastT() || arguments.length !== d + 1) {
    //   return;
    // }
    console.log('在set里赋值了？', t);
    if (t[0] < this.lastT() || t.length !== d + 1) {
      return;
    }
    const state = this._state;
    const velocity = this._velocity;
    const bounds = this.bounds;
    const lo = bounds[0];
    const hi = bounds[1];
    this._time.push(t[0]);
    for (let i = d; i > 0; --i) {
      // state.push(clamp(lo[i - 1], hi[i - 1], arguments[i]));
      const clampRes = clamp(lo[i - 1], hi[i - 1], t[i]);
      if (isNaN(clampRes) || clampRes === undefined || clampRes === null) {
        debugger;
      }

      state.push(clampRes);
      velocity.push(0);
    }
  }

  move(t: any[]) {
    const t0 = this.lastT();
    const d = this.dimension;
    // if (t <= t0 || arguments.length !== d + 1) {
    //   return;
    // }
    if (t[0] <= t0 || t.length !== d + 1) {
      return;
    }
    const state = this._state;
    const velocity = this._velocity;
    let statePtr = state.length - this.dimension;
    const bounds = this.bounds;
    const lo = bounds[0];
    const hi = bounds[1];
    const dt = t[0] - t0;
    const sf = dt > 1e-6 ? 1 / dt : 0.0;
    this._time.push(t);
    for (let i = d; i > 0; --i) {
      // const dx = arguments[i];
      const dx = t[i];
      const clampRes = clamp(lo[i - 1], hi[i - 1], state[statePtr++] + dx);
      if (isNaN(clampRes) || clampRes === undefined || clampRes === null) {
        debugger;
      }
      state.push(clampRes);
      velocity.push(dx * sf);
    }
  }

  idle(t: any) {
    const t0 = this.lastT();
    if (t < t0) {
      return;
    }
    const d = this.dimension;
    const state = this._state;
    const velocity = this._velocity;
    let statePtr = state.length - d;
    const bounds = this.bounds;
    const lo = bounds[0];
    const hi = bounds[1];
    const dt = t - t0;
    this._time.push(t);
    for (let i = d - 1; i >= 0; --i) {
      const clampRes = clamp(
        lo[i],
        hi[i],
        state[statePtr] + dt * velocity[statePtr]
      );
      if (isNaN(clampRes) || clampRes === undefined || clampRes === null) {
        const time22 = this._time;
        const aaaaa = time22[time22.length - 1];

        debugger;
      }

      state.push(clampRes);
      velocity.push(0);
      statePtr += 1;
    }
  }
}

const getZero = (d: any) => {
  const result = new Array(d);
  for (let i = 0; i < d; ++i) {
    result[i] = 0.0;
  }
  return result;
};

export function createFilteredVector(params: any[]) {
  const initState: any = params[0];
  const initVelocity: any = params[1];
  let initTime: number = params[2] as unknown as number;
  switch (params.length) {
    case 0:
      return new FilteredVector([0], [0], 0);
    case 1:
      if (typeof initState === 'number') {
        const zero = getZero(initState);
        return new FilteredVector(zero, zero, 0);
      } else {
        const zero = getZero(initState.length);

        return new FilteredVector(initState, zero, 0);
      }
    case 2:
      if (typeof initVelocity === 'number') {
        const zero = getZero(initState.length);

        return new FilteredVector(initState, zero, +initVelocity);
      } else {
        const zero = getZero(initState.length);
        initTime = 0;

        return new FilteredVector(initState, zero, initTime);
      }
    case 3:
      if (initState.length !== initVelocity.length) {
        throw new Error('state and velocity lengths must match');
      }

      return new FilteredVector(initState, initVelocity, initTime);
  }
}
