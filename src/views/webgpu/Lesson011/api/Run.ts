/*
 * @Author: TYW
 * @Date: 2022-04-03 10:39:13
 * @LastEditTime: 2022-04-12 22:34:55
 * @LastEditors: TYW
 * @Description:
 */
import { vec3 } from 'gl-matrix';
import { Create3DObject } from './Create3DObject';
export const run = (
  domID: string,
  radius: number = 2,
  u: number = 20,
  v: number = 15,
  center: vec3 = [0, 0, 0],
  isAnimation = true
) => {
  Create3DObject(domID, radius, u, v, center, isAnimation);
};
