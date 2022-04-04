/*
 * @Author: TYW
 * @Date: 2022-04-03 15:35:35
 * @LastEditTime: 2022-04-04 21:14:41
 * @LastEditors: TYW
 * @Description:
 */
import { CheckWebGPU } from './WebGPUCheck';
interface IGPUInstance {
  WebGPU: GPUCanvasContext;
  Adapter: GPUAdapter;
  Device: GPUDevice;
  Format: GPUTextureFormat;
  Canvas: HTMLCanvasElement
}
interface IWebGPU extends GPUCanvasContext {
  customValue?: string;
}

export const InitWebGPU = async (canvasContainerID: string) => {
  const checkgpu = CheckWebGPU();
  if (!checkgpu.isSupportWebGPU) {
    console.error(checkgpu.desc);
  }
  const canvasContainer: HTMLDivElement | null = document.getElementById(
    canvasContainerID
  ) as HTMLDivElement;
  if (!canvasContainer) {
    console.error('WebGPU Container is not exist !');
    return null;
  }

  // clear
  canvasContainer.innerHTML = '';
  // create
  const canvas: HTMLCanvasElement = document.createElement(
    'canvas'
  ) as HTMLCanvasElement;

  const w: number = canvasContainer.clientWidth;
  const h: number = canvasContainer.clientHeight;

  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width = w;
  canvas.height = h;

  canvasContainer.appendChild(canvas);

  
  const webgpu = canvas.getContext('webgpu') as IWebGPU;
  if (!webgpu) {
    console.error('WebGPU context is not available!');
    return null;
  }
  const adapter = (await navigator.gpu?.requestAdapter()) as GPUAdapter;
  const device = (await adapter?.requestDevice()) as GPUDevice;
  const format = 'bgra8unorm';
  webgpu.configure({
    device: device,
    format: webgpu.getPreferredFormat(adapter),
    compositingAlphaMode: "premultiplied" as GPUCanvasCompositingAlphaMode
  });
  const gpuRes: IGPUInstance = {
    WebGPU: webgpu,
    Adapter: adapter,
    Device: device,
    Format: format,
    Canvas: canvas
  };
  return gpuRes;
};


export const CreateGPUBuffer = (device: GPUDevice, data: Float32Array, usageFlag: GPUBufferUsageFlags = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST) => {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage: usageFlag,
    mappedAtCreation: true
  });
  new Float32Array(buffer.getMappedRange()).set(data);
  buffer.unmap();
  return buffer;
}