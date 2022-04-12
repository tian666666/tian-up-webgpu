/*
 * @Author: TYW
 * @Date: 2022-04-04 13:23:05
 * @LastEditTime: 2022-04-12 22:31:41
 * @LastEditors: TYW
 * @Description:
 */
export const Shaders = () => {
  const vertex = `
        struct Uniforms {
            mvpMatrix : mat4x4<f32>
        };
        @binding(0) @group(0) var<uniform> uniforms : Uniforms;

        @stage(vertex)
        fn main(@location(0) pos: vec4<f32>) -> @builtin(position) vec4<f32> {
           return uniforms.mvpMatrix * pos;
        }`;

  const fragment = `
        @stage(fragment)
        fn main() -> @location(0) vec4<f32> {
            return vec4<f32>(1.0,1.0,0.0,1.0);
        }`;

  return { vertex, fragment };
};
