/*
 * @Author: TYW
 * @Date: 2022-02-22 18:39:09
 * @LastEditTime: 2022-03-07 18:16:29
 * @LastEditors: TYW
 * @Description:
 */
export interface IGLExtend extends WebGL2RenderingContext {
  fClear(): IGLExtend;
  fSetSize(w?: number, h?: number): IGLExtend;
  fCreateArrayBuffer(floatArry: Float32Array, isStatic: boolean | undefined) : WebGLBuffer;
}

// 回调函数
export type RenderCallBack = (gl: IGLExtend, dt: number) => void;

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
  // setup GL, Set all the defualt configurations we need
  // set clear color
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Methods
  gl.fClear = function (): IGLExtend {
    this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
    return this;
  };
  // create and fill our Array buffer.
  gl.fCreateArrayBuffer = function(floatArry: Float32Array, isStatic: boolean | undefined): WebGLBuffer {
    // so we can call this function without setting isStatic
    if(isStatic === undefined) {
      isStatic = true;
    }
    const buf = this.createBuffer() as WebGLBuffer;
    this.bindBuffer(this.ARRAY_BUFFER, buf);
    this.bufferData(this.ARRAY_BUFFER, floatArry, isStatic ? this.STATIC_DRAW : this.DYNAMIC_DRAW);
    this.bindBuffer(this.ARRAY_BUFFER, null);
    return buf;
  }

  // setters - getters
  // set the size of the canvas html element and the rendering view port
  gl.fSetSize = function (w: number = canvasContainer.offsetWidth, h: number = canvasContainer.offsetHeight): IGLExtend {
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
