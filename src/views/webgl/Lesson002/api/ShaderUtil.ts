/*
 * @Author: TYW
 * @Date: 2022-02-23 18:49:46
 * @LastEditTime: 2022-02-24 14:09:41
 * @LastEditors: TYW
 * @Description: 
 */
export class ShaderUtil {
  static createShader(gl: WebGL2RenderingContext,src: string,type: number) {
    const shader = gl.createShader(type) as WebGLShader;
    gl.shaderSource(shader,src);
    gl.compileShader(shader);

    //get error data if shader failed compiling
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Error compiling shader : " + src, gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;

  }

  static createProgram(gl: WebGL2RenderingContext, vShader: WebGLShader, fShader: WebGLShader, doValidate: boolean) {
    // link shaders together
    const prog = gl.createProgram() as WebGLProgram;
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);
    
    // check if successful
    if(!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Error creating shader program.", gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      return null;
    }

    // only do this for additional debugging
    if(doValidate) {
      gl.validateProgram(prog);
      if(!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
        console.error("Error validating program", gl.getProgramInfoLog(prog));
        gl.deleteProgram(prog);
        return null;
      }
    }

    // can delete the shaders since the program has been made
    // TODO, detaching might cause issues on some browsers , might only need to delete.
    gl.detachShader(prog, vShader);
    gl.detachShader(prog, fShader);
    gl.deleteShader(fShader);
    gl.deleteShader(vShader);

    return prog;
  }
}