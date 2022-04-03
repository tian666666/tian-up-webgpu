/*
 * @Author: TYW
 * @Date: 2022-03-08 19:23:46
 * @LastEditTime: 2022-03-08 19:23:46
 * @LastEditors: TYW
 * @Description:
 */
export class ShadersCode {
  public static vertex_shader: string = `#version 300 es
  in vec3 a_position;
  
  uniform mediump float uPointSize;
  uniform float uAngle;

  void main(void){
    gl_PointSize = uPointSize;
    //gl_Position = vec4(a_position, 1.0);
    gl_Position = vec4(
      cos(uAngle) * 0.8 + a_position.x,
      sin(uAngle) * 0.8 + a_position.y,
      a_position.z, 1.0 );
  }`;
  public static fragment_shader: string = `#version 300 es
  precision mediump float;

  uniform float uPointSize;

  out vec4 finalColor;
  
  void main(void){
    float c = (40.0 - uPointSize) / 20.0; 
    finalColor = vec4(c, c, c, 1.0);
  }`;
}
