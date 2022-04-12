/*
 * @Author: TYW
 * @Date: 2022-04-05 18:14:48
 * @LastEditTime: 2022-04-06 20:59:34
 * @LastEditors: TYW
 * @Description:
 */
/**
 * Performs a spherical linear interpolation between two quat
 *
 * out the receiving quaternion
 * a the first operand
 * b the second operand
 * t interpolation amount between the two inputs
 *  out
 */
export const slerp = (out: number[], a: any[], b: any[], t: number) => {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations

  const ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  let bx = b[0],
    by = b[1],
    bz = b[2],
    bw = b[3];

  let omega, cosom, sinom, scale0, scale1;

  // calc cosine
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  // adjust signs (if necessary)
  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  // calculate coefficients
  if (1.0 - cosom > 0.000001) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  }
  // calculate final values
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
};
