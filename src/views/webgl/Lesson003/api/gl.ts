/*
 * @Author: TYW
 * @Date: 2022-03-07 18:33:12
 * @LastEditTime: 2022-03-08 20:02:26
 * @LastEditors: TYW
 * @Description:
 */
// ---------------------------------------------
// global constants
// ---------------------------------------------

export const ATTR_POSITION_NAME = 'a_position';
export const ATTR_POSITION_LOC = 0;
export const ATTR_NORMAL_NAME = 'a_norm';
export const ATTR_NORMAL_LOC = 1;
export const ATTR_UV_NAME = 'a_uv';
export const ATTR_UV_LOC = 2;

export interface IGLExtend extends WebGL2RenderingContext {
  fClear(): IGLExtend;
  fSetSize(w?: number, h?: number): IGLExtend;
  fCreateArrayBuffer(
    floatArry: Float32Array,
    isStatic: boolean | undefined
  ): WebGLBuffer;
  mMeshCache: { dots: VTN | null };
  gl: WebGL2RenderingContext;
  fCreateMeshVAO(
    name: string,
    aryInd: number[] | null,
    aryVert: number[] | null,
    aryNorm?: number[] | null,
    aryUV?: number[] | null
  ): VTN;
}
export interface VTN {
  drawMode: number;
  vao: WebGLVertexArrayObject | null;
  bufVertices: WebGLBuffer | null;
  vertexComponentLen?: number;
  vertexCount?: number;
  bufNormals?: WebGLBuffer | null;
  bufUV?: WebGLBuffer | null;
  bufIndex?: WebGLBuffer | null;
  indexCount?: number;
}

// 回调函数
export type RenderCallBack = (gl: IGLExtend, dt: number) => void;

// custom GL Context Object
export const GLInstance = (canvasContainerID: string): IGLExtend | null => {
  const canvasContainer: HTMLDivElement | null = document.getElementById(
    canvasContainerID
  ) as HTMLDivElement;
  if (!canvasContainer) {
    console.error('WebGL Container is not exist !');
    return null;
  }

  // clear
  canvasContainer.innerHTML = '';
  // create
  const canvas: HTMLCanvasElement = document.createElement(
    'canvas'
  ) as HTMLCanvasElement;

  canvasContainer.appendChild(canvas);

  const gl = canvas.getContext('webgl2') as IGLExtend;

  if (!gl) {
    console.error('WebGL context is not available !');
    return null;
  }
  debugger;
  // setup custom properties
  // cache all the mesh structs, easy to unload buffers if they all exist in one place
  // gl.mMeshCache.dots = null;
  // setup GL, set all the default configurations we need
  // set clear color
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // reset the canvas with our set background color
  gl.fClear = function (): IGLExtend {
    this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
    return this;
  };

  // create and fill our Array buffer
  gl.fCreateArrayBuffer = function (
    floatArry: Float32Array,
    isStatic: boolean | undefined
  ): WebGLBuffer {
    // so we can call this function without setting isStatic
    if (isStatic === undefined) {
      isStatic = true;
    }
    const buf = this.createBuffer() as WebGLBuffer;
    this.bindBuffer(this.ARRAY_BUFFER, buf);
    this.bufferData(
      this.ARRAY_BUFFER,
      floatArry,
      isStatic ? this.STATIC_DRAW : this.DYNAMIC_DRAW
    );
    this.bindBuffer(this.ARRAY_BUFFER, null);
    return buf;
  };
  // turns arrays into GL buffers, then setup a VAO that will predefine the buffers to standard shader attributes
  gl.fCreateMeshVAO = function (
    name: string,
    aryInd: number[] | null,
    aryVert: number[] | null,
    aryNorm: number[] | null,
    aryUV: number[] | null
  ): VTN {
    const rtn: VTN = { drawMode: this.TRIANGLES, vao: null, bufVertices: null };
    // create and bind vao
    rtn.vao = this.createVertexArray();
    // bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is saved to the vao
    this.bindVertexArray(rtn.vao);

    // set up vertices
    if (aryVert !== undefined && aryVert !== null) {
      // create buffer
      rtn.bufVertices = this.createBuffer();
      // how many floats make up a vertex
      rtn.vertexComponentLen = 3;
      // how many vertices in the array
      rtn.vertexCount = aryVert.length / rtn.vertexComponentLen;

      this.bindBuffer(this.ARRAY_BUFFER, rtn.bufVertices);
      // then push array into it
      this.bufferData(
        this.ARRAY_BUFFER,
        new Float32Array(aryVert),
        this.STATIC_DRAW
      );
      // enable Attribute location
      this.enableVertexAttribArray(ATTR_POSITION_LOC);
      // put buffer at location of the vao
      this.vertexAttribPointer(ATTR_POSITION_LOC, 3, this.FLOAT, false, 0, 0);
    }

    // set up  normals
    if (aryNorm !== undefined && aryNorm !== null) {
      rtn.bufNormals = this.createBuffer();
      this.bindBuffer(this.ARRAY_BUFFER, rtn.bufNormals);
      this.bufferData(
        this.ARRAY_BUFFER,
        new Float32Array(aryNorm),
        this.STATIC_DRAW
      );
      this.enableVertexAttribArray(ATTR_NORMAL_LOC);
      this.vertexAttribPointer(ATTR_NORMAL_LOC, 3, this.FLOAT, false, 0, 0);
    }

    // set up uv
    if (aryUV !== undefined && aryUV !== null) {
      rtn.bufUV = this.createBuffer();
      this.bindBuffer(this.ARRAY_BUFFER, rtn.bufUV);
      this.bufferData(
        this.ARRAY_BUFFER,
        new Float32Array(aryUV),
        this.STATIC_DRAW
      );
      this.enableVertexAttribArray(ATTR_UV_LOC);
      // UV only has two floats per component
      this.vertexAttribPointer(ATTR_UV_LOC, 2, this.FLOAT, false, 0, 0);
    }

    // set up index
    if (aryInd !== undefined && aryInd !== null) {
      rtn.bufIndex = this.createBuffer();
      rtn.indexCount = aryInd.length;
      this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, rtn.bufIndex);
      this.bufferData(
        this.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(aryInd),
        this.STATIC_DRAW
      );
      this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
    }

    // clean up
    // unbind the VAO , very import , always unbind when your done using one
    this.bindVertexArray(null);
    // unbind any buffers that might be  set
    this.bindBuffer(this.ARRAY_BUFFER, null);

    // this.mMeshCache.dots = rtn;

    return rtn;
  };

  // setters getters
  // setters - getters
  // set the size of the canvas html element and the rendering view port
  gl.fSetSize = function (
    w: number = canvasContainer.offsetWidth,
    h: number = canvasContainer.offsetHeight
  ): IGLExtend {
    // set the size of the canvas, on chrome we need to set it 3 ways to make it work perfectly.
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = w;
    canvas.height = h;
    // when updating the canvas size, must reset the viewport of the canvas
    // else the resolution webgl renders at will not change
    this.viewport(0, 0, w, h);
    return this;
  };

  return gl;
};
