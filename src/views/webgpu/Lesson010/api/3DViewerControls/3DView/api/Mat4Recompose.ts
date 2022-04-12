/*
 * @Author: TYW
 * @Date: 2022-04-05 17:41:53
 * @LastEditTime: 2022-04-05 17:45:11
 * @LastEditors: TYW
 * @Description: 
 */
import { mat4, ReadonlyVec3 } from 'gl-matrix';

export const recomposeMat4 = (
  matrix: mat4,
  translation: ReadonlyVec3,
  scale: ReadonlyVec3,
  skew: number[],
  perspective: any[],
  quaternion: any
) => {
  const temp = mat4.create();
  mat4.identity(matrix);

  //apply translation & rotation
  mat4.fromRotationTranslation(matrix, quaternion, translation);

  //apply perspective
  matrix[3] = perspective[0];
  matrix[7] = perspective[1];
  matrix[11] = perspective[2];
  matrix[15] = perspective[3];

  // apply skew
  // temp is a identity 4x4 matrix initially
  mat4.identity(temp);

  if (skew[2] !== 0) {
    temp[9] = skew[2];
    mat4.multiply(matrix, matrix, temp);
  }

  if (skew[1] !== 0) {
    temp[9] = 0;
    temp[8] = skew[1];
    mat4.multiply(matrix, matrix, temp);
  }

  if (skew[0] !== 0) {
    temp[8] = 0;
    temp[4] = skew[0];
    mat4.multiply(matrix, matrix, temp);
  }

  //apply scale
  mat4.scale(matrix, matrix, scale);
  return matrix;
};
