/*
 * @Author: TYW
 * @Date: 2022-04-03 10:39:13
 * @LastEditTime: 2022-04-04 21:00:46
 * @LastEditors: TYW
 * @Description:
 */
import { CreateSquare } from './CreateSquare';
export const run = (domID: string,primitiveType = "triangle-list") => {
  CreateSquare(domID,primitiveType);
};
