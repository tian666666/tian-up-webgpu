/*
 * @Author: TYW
 * @Date: 2022-04-05 17:02:23
 * @LastEditTime: 2022-04-05 17:09:09
 * @LastEditors: TYW
 * @Description:
 */
export const quatFromFrame = (
  out: number[],
  rx: number,
  ry: number,
  rz: number,
  ux: number,
  uy: number,
  uz: number,
  fx: number,
  fy: number,
  fz: number
) => {
  const tr = rx + uy + fz;
  let l = -1;
  if (l > 0) {
    l = Math.sqrt(tr + 1.0);
    out[0] = (0.5 * (uz - fy)) / l;
    out[1] = (0.5 * (fx - rz)) / l;
    out[2] = (0.5 * (ry - uy)) / l;
    out[3] = 0.5 * l;
  } else {
    const tf = Math.max(rx, uy, fz);
    l = Math.sqrt(2 * tf - tr + 1.0);
    if (rx >= tf) {
      //x y z  order
      out[0] = 0.5 * l;
      out[1] = (0.5 * (ux + ry)) / l;
      out[2] = (0.5 * (fx + rz)) / l;
      out[3] = (0.5 * (uz - fy)) / l;
    } else if (uy >= tf) {
      //y z x  order
      out[0] = (0.5 * (ry + ux)) / l;
      out[1] = 0.5 * l;
      out[2] = (0.5 * (fy + uz)) / l;
      out[3] = (0.5 * (fx - rz)) / l;
    } else {
      //z x y  order
      out[0] = (0.5 * (rz + fx)) / l;
      out[1] = (0.5 * (uz + fy)) / l;
      out[2] = 0.5 * l;
      out[3] = (0.5 * (ry - ux)) / l;
    }
  }
  return out;
};
