/*
 * @Author: TYW
 * @Date: 2022-04-05 14:14:43
 * @LastEditTime: 2022-04-06 20:25:48
 * @LastEditors: TYW
 * @Description:
 */
export const dcubicHermite = (
  p0: number[],
  v0: number[],
  p1: number[],
  v1: number[],
  t: number,
  f: any[]
) => {
  const dh00 = 6 * t * t - 6 * t;
  const dh10 = 3 * t * t - 4 * t + 1;
  const dh01 = -6 * t * t + 6 * t;
  const dh11 = 3 * t * t - 2 * t;
  if (p0.length) {
    if (!f) {
      f = new Array(p0.length);
    }
    for (let i = p0.length - 1; i >= 0; --i) {
      f[i] = dh00 * p0[i] + dh10 * v0[i] + dh01 * p1[i] + dh11 * v1[i];
    }
    return f;
  }
  return null;
};

export const cubicHermite = (
  p0: number[],
  v0: number[],
  p1: number[],
  v1: number[],
  t: number,
  f: any[]
) => {
  const ti = t - 1,
    t2 = t * t,
    ti2 = ti * ti;
  const h00 = (1 + 2 * t) * ti2;
  const h10 = t * ti2;
  const h01 = t2 * (3 - 2 * t);
  const h11 = t2 * ti;
  if (p0.length) {
    if (!f) {
      f = new Array(p0.length);
    }
    for (let i = p0.length - 1; i >= 0; --i) {
      f[i] = h00 * p0[i] + h10 * v0[i] + h01 * p1[i] + h11 * v1[i];
    }
    return f;
  }
  return null;
};
