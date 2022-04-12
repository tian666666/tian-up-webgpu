/*
 * @Author: TYW
 * @Date: 2022-04-05 17:38:42
 * @LastEditTime: 2022-04-06 20:58:47
 * @LastEditors: TYW
 * @Description:
 */
import { mat4, ReadonlyMat4, vec3 } from 'gl-matrix';
import { recomposeMat4 } from './Mat4Recompose';
import { decomposeMat4 } from './Mat4Decompose';
import { slerp } from './GLQuatSlerp';
const determinant = mat4.determinant;
const lerp = vec3.lerp;

export const interpolate = (
  out: mat4,
  start: ReadonlyMat4,
  end: ReadonlyMat4,
  alpha: number
) => {
  const state0 = state();
  const state1 = state();
  const tmp = state();

  if (determinant(start) === 0 || determinant(end) === 0) return false;

  //decompose the start and end matrices into individual components
  const r0 = decomposeMat4(
    start,
    state0.translate,
    state0.scale,
    state0.skew,
    state0.perspective,
    state0.quaternion
  );
  const r1 = decomposeMat4(
    end,
    state1.translate,
    state1.scale,
    state1.skew,
    state1.perspective,
    state1.quaternion
  );
  if (!r0 || !r1) return false;

  //now lerp/slerp the start and end components into a temporary     lerp(tmptranslate, state0.translate, state1.translate, alpha)
  lerp(
    tmp.translate as vec3,
    state0.translate as vec3,
    state1.translate as vec3,
    alpha
  );
  lerp(tmp.skew as vec3, state0.skew as vec3, state1.skew as vec3, alpha);
  lerp(tmp.scale as vec3, state0.scale as vec3, state1.scale as vec3, alpha);
  lerp(
    tmp.perspective as vec3,
    state0.perspective as vec3,
    state1.perspective as vec3,
    alpha
  );
  slerp(tmp.quaternion, state0.quaternion, state1.quaternion, alpha);

  //and recompose into our 'out' matrix
  recomposeMat4(
    out,
    tmp.translate as vec3,
    tmp.scale as vec3,
    tmp.skew,
    tmp.perspective,
    tmp.quaternion
  );
  return true;
};

const state = () => {
  return {
    translate: customVec3(),
    scale: customVec3(1),
    skew: customVec3(),
    perspective: customVec4(),
    quaternion: customVec4()
  };
};

const customVec3 = (n?: any) => {
  return [n || 0, n || 0, n || 0];
};

const customVec4 = () => {
  return [0, 0, 0, 1];
};
