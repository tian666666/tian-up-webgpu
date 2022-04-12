/*
 * @Author: TYW
 * @Date: 2022-04-03 10:39:13
 * @LastEditTime: 2022-04-06 20:20:29
 * @LastEditors: TYW
 * @Description:
 */
import { Create3DObject } from './Create3DObject';
export const run = (domID: string, isAnimation = true) => {
  Create3DObject(domID, isAnimation);
};
