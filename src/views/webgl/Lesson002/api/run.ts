/*
 * @Author: TYW
 * @Date: 2022-02-24 13:52:35
 * @LastEditTime: 2022-03-08 19:55:38
 * @LastEditors: TYW
 * @Description:
 */
import { RenderCallBack, GLInstance, IGLExtend } from './gl';
import { RenderLoop } from './RenderLoop';
import { ShadersCode } from './ShadersCode';
import { ShaderUtil } from './ShaderUtil';

export class runUtil {
  private gPointSize: number = 0;
  private gPSizeStep: number = 3;
  private gAngle: number = 0;
  private gAngleStep: number = (Math.PI / 180.0) * 90; //90 degrees in Radians
  private uPointSizeLoc: WebGLUniformLocation | null = null;
  private gVertCnt: number = 0;
  private uAngle: WebGLUniformLocation | null = null;
  private onRender: RenderCallBack

  constructor() {
    this.onRender = function (gl: IGLExtend, dt: number = 1): void {
      this.gPointSize += this.gPSizeStep * dt;
      const size = Math.sin(this.gPointSize) * 10.0 + 30.0;
      // store data to the shader's uniform variable uPointSize
      gl.uniform1f(this.uPointSizeLoc, size);
      // update the angle at the rate of AngleStep Per Second
      this.gAngle += this.gAngleStep * dt;
      // pass new angle value to the shader.
      gl.uniform1f(this.uAngle, this.gAngle);

      gl.fClear();
      //Draw the points
      gl.drawArrays(gl.POINTS, 0, this.gVertCnt);
    };
  }
  public run(domID: string) {
    // get our extended gl context object
    const gl = GLInstance(domID)?.fSetSize().fClear() as IGLExtend;

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
    this.uPointSizeLoc = gl.getUniformLocation(shaderProg, 'uPointSize');
    this.uAngle = gl.getUniformLocation(shaderProg, 'uAngle');
    gl.useProgram(null);

    // set up data buffers
    const aryVerts = new Float32Array([0, 0, 0]);
    const bufVerts = gl.fCreateArrayBuffer(aryVerts, undefined);
    // How many vertices are we stroing in the array
    this.gVertCnt = aryVerts.length / 3;

    // gl.bindBuffer(gl.ARRAY_BUFFER, bufVerts);
    // gl.bufferData(gl.ARRAY_BUFFER, aryVerts, gl.STATIC_DRAW);
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // set up for drawing

    // NOTE since we only one have shader, we can turn it on and set the Attributes here
    // instead inside the render loop

    // activate the shader
    gl.useProgram(shaderProg);
    // store data to the shader's uniform varible uPointSize
    // gl.uniform1f(uPointSizeLoc, 50.0);

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
    // gl.drawArrays(gl.POINTS, 0, 2);
    new RenderLoop(this.onRender.bind(this), 1, gl).start();
  }
}
