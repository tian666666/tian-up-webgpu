/*
 * @Author: TYW
 * @Date: 2022-04-03 10:39:13
 * @LastEditTime: 2022-04-04 16:09:05
 * @LastEditors: TYW
 * @Description:
 */
import { CreatePrimitive } from './CreatePrimitive';
export const run = (domID: string,primitiveType = "point-list") => {
  CreatePrimitive(domID,primitiveType);
};
