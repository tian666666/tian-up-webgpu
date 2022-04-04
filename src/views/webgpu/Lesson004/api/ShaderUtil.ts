/*
 * @Author: TYW
 * @Date: 2022-04-04 13:23:05
 * @LastEditTime: 2022-04-04 20:05:38
 * @LastEditors: TYW
 * @Description:
 */
export const Shaders = () => {
  const vertex = `  
    struct Output {
        @builtin(position) Position : vec4<f32>;
        @location(0) vColor : vec4<f32>;
    };

    @stage(vertex)
    fn main(@builtin(vertex_index) VertexIndex: u32) -> Output {
        var pos : array<vec2<f32>, 9> = array<vec2<f32>, 9>(             
            vec2<f32>(-0.63,  0.80),
            vec2<f32>(-0.65,  0.20),
            vec2<f32>(-0.20,  0.60),
            vec2<f32>(-0.37, -0.07),
            vec2<f32>( 0.05,  0.18),
            vec2<f32>(-0.13, -0.40),
            vec2<f32>( 0.30, -0.13),
            vec2<f32>( 0.13, -0.64),
            vec2<f32>( 0.70, -0.30)     
        );
    
        var color : array<vec3<f32>, 9> = array<vec3<f32>, 9>(             
            vec3<f32>(1.0, 0.0, 0.0),
            vec3<f32>(0.0, 1.0, 0.0),
            vec3<f32>(0.0, 0.0, 1.0),
            vec3<f32>(1.0, 0.0, 0.0),
            vec3<f32>(0.0, 1.0, 0.0),
            vec3<f32>(0.0, 0.0, 1.0),
            vec3<f32>(1.0, 0.0, 0.0),
            vec3<f32>(0.0, 1.0, 0.0),
            vec3<f32>(0.0, 0.0, 1.0),  
        );

        var output: Output;
        output.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
        output.vColor = vec4<f32>(color[VertexIndex], 1.0);
        return output;
    }`;

  const fragment = `
        @stage(fragment)
        fn main(@location(0) vColor: vec4<f32>) -> @location(0) vec4<f32> {
            return vColor;
        }
    `;
  return { vertex, fragment };
};
