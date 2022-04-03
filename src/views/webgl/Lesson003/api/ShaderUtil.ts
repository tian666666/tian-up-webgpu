import {
  ATTR_NORMAL_LOC,
  ATTR_NORMAL_NAME,
  ATTR_POSITION_LOC,
  ATTR_POSITION_NAME,
  ATTR_UV_LOC,
  ATTR_UV_NAME,
  VTN
} from './gl';
import { Modal } from './Modal';

/*
 * @Author: TYW
 * @Date: 2022-03-07 19:35:39
 * @LastEditTime: 2022-03-08 19:52:33
 * @LastEditors: TYW
 * @Description:
 */
export interface IuniformLoc {
  uPointSize: WebGLUniformLocation | null;
  uAngle: WebGLUniformLocation | null;
}
export class Shader {
  public program: WebGLProgram | null;
  public gl: WebGL2RenderingContext | null = null;
  public attribLoc;
  public uniformLoc: IuniformLoc = {
    uPointSize: null,
    uAngle: null
  };
  constructor(
    GL: WebGL2RenderingContext,
    vertShaderSrc: string,
    fragShaderSrc: string
  ) {
    this.program = ShaderUtil.createProgramFromText(
      GL,
      vertShaderSrc,
      fragShaderSrc
    );
    if (this.program !== null) {
      this.gl = GL;
      this.gl.useProgram(this.program);
      this.attribLoc = ShaderUtil.getStandardAttribLocation(
        this.gl,
        this.program
      );
      // TODO :: Replace in later lessons with get standardUniformLocations.
      this.uniformLoc = {
        uPointSize: null,
        uAngle: null
      };
    }
    // Note :: Extended shaders should deactivate shader when done calling super and setting up custom parts in the constructor.
  }

  // methods
  activate() {
    this.gl?.useProgram(this.program);
    return this;
  }
  deactivate() {
    this.gl?.useProgram(null);
    return this;
  }

  // function helps clean up resources when shader is no longer needed
  dispose() {
    // unbind the program if its currently active
    if (this.gl?.getParameter(this.gl.CURRENT_PROGRAM) === this.program) {
      this.gl?.useProgram(null);
    }
    this.gl?.deleteProgram(this.program);
  }

  // render related methods

  // setup custom properties
  // abstract method, extended object may need to do some things before rendering.

  preRender() {
    console.log("");
  }

  // handler rendering a modal
  renderModal(modal: Modal) {
    // enable VAO , this will set all the predefined attributes for the shader
    this.gl?.bindVertexArray(modal.mesh.vao);

    if (modal.mesh.indexCount) {
      this.gl?.drawElements(
        modal.mesh.drawMode,
        modal.mesh.indexCount,
        this.gl?.UNSIGNED_SHORT,
        0
      );
    } else {
      this.gl?.drawArrays(
        modal.mesh.drawMode,
        0,
        modal.mesh.vertexCount as number
      );
    }
    this.gl?.bindVertexArray(null);

    return this;
  }
}
export class TestShader extends Shader {
  constructor(gl: WebGL2RenderingContext) {
    const vertSrc = ShaderUtil.domShaderSrc('vertex_shader') as string;
    const fragSrc = ShaderUtil.domShaderSrc('fragment_shader') as string;
    // call the base class constructor which will setup most of what we need
    super(gl, vertSrc, fragSrc);
    // our shader uses custom uniforms this is the time to get its location for future use
    this.uniformLoc.uPointSize = gl.getUniformLocation(
      this.program as WebGLProgram,
      'uPointSize'
    );
    this.uniformLoc.uAngle = gl.getUniformLocation(
      this.program as WebGLProgram,
      'uAngle'
    );
    // donw setting up shader
    gl.useProgram(null);
  }
  // simple function that passes in Angle and Pointsize uniform data to the shader program
  set(size: number, angle: number) {
    this.gl?.uniform1f(this.uniformLoc.uPointSize, size);
    this.gl?.uniform1f(this.uniformLoc.uAngle, angle);
    return this;
  }
}
export class ShaderUtil {
  // main utility functions

  // get the texxt of a script tag that are storing shader code
  static domShaderSrc(elmID: string) {
    const elm = document.getElementById(elmID) as HTMLElement;
    if (!elm || elm.innerText === '') {
      console.log(elmID + ' shader not found or no text.');
      return null;
    }
    return elm.innerText;
  }
  static createShader(gl: WebGL2RenderingContext, src: string, type: number) {
    const shader = gl.createShader(type) as WebGLShader;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    //get error data if shader failed compiling
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        'Error compiling shader : ' + src,
        gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  static createProgram(
    gl: WebGL2RenderingContext,
    vShader: WebGLShader,
    fShader: WebGLShader,
    doValidate: boolean
  ) {
    // link shaders together
    const prog = gl.createProgram() as WebGLProgram;
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);

    // force predefined locations for specific attributes. if the attribute isn't used in the shader its location will default to -1
    gl.bindAttribLocation(prog, ATTR_POSITION_LOC, ATTR_POSITION_NAME);
    gl.bindAttribLocation(prog, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME);
    gl.bindAttribLocation(prog, ATTR_UV_LOC, ATTR_UV_NAME);

    gl.linkProgram(prog);

    // check if successful
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(
        'Error creating shader program.',
        gl.getProgramInfoLog(prog)
      );
      gl.deleteProgram(prog);
      return null;
    }

    // only do this for additional debugging
    if (doValidate) {
      gl.validateProgram(prog);
      if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
        console.error('Error validating program', gl.getProgramInfoLog(prog));
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

  // helper functions
  // pass in script tag IDs for our two shaders and create a program from it
  static domShaderProgram(
    gl: WebGL2RenderingContext,
    vectID: string,
    fragID: string,
    doValidate: boolean
  ) {
    const vShaderTxt = ShaderUtil.domShaderSrc(vectID);
    if (!vShaderTxt) {
      return null;
    }
    const fShaderTxt = ShaderUtil.domShaderSrc(fragID);
    if (!fShaderTxt) {
      return null;
    }
    const vShader = ShaderUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER);
    if (!vShader) {
      return null;
    }
    const fShader = ShaderUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER);
    if (!fShader) {
      return null;
    }
  }

  static createProgramFromText(
    gl: WebGL2RenderingContext,
    vShaderTxt: string,
    fShaderTxt: string,
    doValidate?: boolean
  ) {
    const vShader = ShaderUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER);
    if (!vShader) {
      return null;
    }
    const fShader = ShaderUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER);
    if (!fShader) {
      gl.deleteShader(vShader);
      return null;
    }

    return ShaderUtil.createProgram(gl, vShader, fShader, true);
  }

  // get the locations of standard Attributes that we will mostly be using.
  // location will = -1 if atrribute is not found
  static getStandardAttribLocation(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
  ) {
    return {
      position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
      norm: gl.getAttribLocation(program, ATTR_NORMAL_NAME),
      uv: gl.getAttribLocation(program, ATTR_UV_NAME)
    };
  }
}
