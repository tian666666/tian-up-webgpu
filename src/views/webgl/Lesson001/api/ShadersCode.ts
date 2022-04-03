/*
 * @Author: TYW
 * @Date: 2022-02-23 18:53:06
 * @LastEditTime: 2022-02-23 19:54:57
 * @LastEditors: TYW
 * @Description:
 */
export class ShadersCode {
  public static vertex_shader: string = `#version 300 es
		in vec3 a_position;
		
		uniform float uPointSize;

		void main(void){
			gl_PointSize = uPointSize;
			gl_Position = vec4(a_position, 1.0);
		}
    `;
  public static fragment_shader: string = `#version 300 es
		precision mediump float;

		out vec4 finalColor;
		
		void main(void) {
			finalColor = vec4(0.0, 0.0, 0.0, 1.0);
		}
    `;
}
