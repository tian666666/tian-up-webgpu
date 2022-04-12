/*
 * @Author: TYW
 * @Date: 2022-04-12 22:24:03
 * @LastEditTime: 2022-04-12 22:31:52
 * @LastEditors: TYW
 * @Description: 
 */

import { vec3 } from "gl-matrix";
import { CreateWireframe } from "./CreateWireframe";
import { SphereWireframeData } from "./Vertex_Data";

export const Create3DObject = async(domID: string, radius: number, u: number, v:number, center: vec3, isAnimation: boolean) => {
  const wireframeData = SphereWireframeData(radius, u, v, center) as Float32Array;
  await CreateWireframe(domID,wireframeData, isAnimation);
}