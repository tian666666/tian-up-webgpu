import { vec3 } from 'gl-matrix';

/*
 * @Author: TYW
 * @Date: 2022-04-05 09:45:42
 * @LastEditTime: 2022-04-05 09:47:55
 * @LastEditors: TYW
 * @Description:
 */
export const CreateAnimation = (
  draw: any,
  rotation: vec3 = vec3.fromValues(0, 0, 0),
  isAnimation = true
) => {
  function step() {
    if (isAnimation) {
      rotation[0] += 0.01;
      rotation[1] += 0.01;
      rotation[2] += 0.02;
    } else {
      rotation = [0, 0, 0];
    }
    draw();
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
};
