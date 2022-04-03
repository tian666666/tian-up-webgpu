/*
 * @Author: TYW
 * @Date: 2022-02-23 19:09:29
 * @LastEditTime: 2022-02-24 13:46:48
 * @LastEditors: TYW
 * @Description:
 */
import { GLInstance } from './gl';
import { ShadersCode } from './ShadersCode';
import { ShaderUtil } from './ShaderUtil';

export const run = (domID: string) => {
  // get our extended gl context object
  const gl = GLInstance(domID)
    ?.fSetSize()
    .fClear() as WebGL2RenderingContext;

  // shader steps
  // 1. get vertex and fragmetn shader text
  // 2. compile text and validate
  const vShader = ShaderUtil.createShader(
    gl,
    ShadersCode.vertex_shader,
    gl.VERTEX_SHADER
  ) as WebGLShader;
  const fShader = ShaderUtil.createShader(
    gl,
    ShadersCode.fragment_shader,
    gl.FRAGMENT_SHADER
  ) as WebGLShader;
  // 3. link the shaders together as a program
  const shaderProg = ShaderUtil.createProgram(
    gl,
    vShader,
    fShader,
    true
  ) as WebGLProgram;

  // 4. get location of uniforms and attributes
  gl.useProgram(shaderProg);
  const aPositionLoc = gl.getAttribLocation(shaderProg, 'a_position');
  const uPointSizeLoc = gl.getUniformLocation(shaderProg, 'uPointSize');

  // set up data buffers
  const aryVerts = new Float32Array([0, 0, 0, 0.5, 0.5, 0]);
  const bufVerts = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, bufVerts);
  gl.bufferData(gl.ARRAY_BUFFER, aryVerts, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // set up for drawing
  // activate the shader
  gl.useProgram(shaderProg);
  // store data to the shader's uniform varible uPointSize
  gl.uniform1f(uPointSizeLoc, 50.0);

  // how its down without VAOs
  // tell gl with buffer we want to use at the moment
  gl.bindBuffer(gl.ARRAY_BUFFER, bufVerts);
  // enable the position attribute in the shader
  gl.enableVertexAttribArray(aPositionLoc);
  // set which buffer the attribute will pull its data from
  gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);
  // done setting up the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // draw the points
  gl.drawArrays(gl.POINTS, 0, 2);
};
