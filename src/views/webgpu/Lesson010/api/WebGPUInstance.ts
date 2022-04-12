/*
 * @Author: TYW
 * @Date: 2022-04-03 15:35:35
 * @LastEditTime: 2022-04-07 00:03:26
 * @LastEditors: TYW
 * @Description:
 */
import { CheckWebGPU } from './WebGPUCheck';
import { vec3, mat4 } from 'gl-matrix';

interface IGPUInstance {
  WebGPU: GPUCanvasContext;
  Adapter: GPUAdapter;
  Device: GPUDevice;
  Format: GPUTextureFormat;
  Canvas: HTMLCanvasElement;
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
    compositingAlphaMode: 'premultiplied' as GPUCanvasCompositingAlphaMode
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

export const CreateGPUBuffer = (
  device: GPUDevice,
  data: Float32Array,
  usageFlag: GPUBufferUsageFlags = GPUBufferUsage.VERTEX |
    GPUBufferUsage.COPY_DST
) => {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage: usageFlag,
    mappedAtCreation: true
  });
  new Float32Array(buffer.getMappedRange()).set(data);
  buffer.unmap();
  return buffer;
};

export const CreateGPUBufferUint = (
  device: GPUDevice,
  data: Uint32Array,
  usageFlag: GPUBufferUsageFlags = GPUBufferUsage.INDEX |
    GPUBufferUsage.COPY_DST
) => {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage: usageFlag,
    mappedAtCreation: true
  });
  new Uint32Array(buffer.getMappedRange()).set(data);
  buffer.unmap();
  return buffer;
};

export const CreateTransforms = (
  modelMat: mat4,
  translation: vec3 = [0, 0, 0],
  rotation: vec3 = [0, 0, 0],
  scaling: vec3 = [1, 1, 1]
) => {
  const rotateXMat = mat4.create();
  const rotateYMat = mat4.create();
  const rotateZMat = mat4.create();
  const translateMat = mat4.create();
  const scaleMat = mat4.create();

  // perform individual transformations
  mat4.fromTranslation(translateMat, translation);
  mat4.fromXRotation(rotateXMat, rotation[0]);
  mat4.fromYRotation(rotateYMat, rotation[1]);
  mat4.fromZRotation(rotateZMat, rotation[2]);
  mat4.fromScaling(scaleMat, scaling);

  // combine all transfromation matrices together to form a final transform matrix: modelMat
  mat4.multiply(modelMat, rotateXMat, scaleMat);
  mat4.multiply(modelMat, rotateYMat, modelMat);
  mat4.multiply(modelMat, rotateZMat, modelMat);
  mat4.multiply(modelMat, translateMat, modelMat);
};

export const CreateViewProjection = (
  respectRatio = 1.0,
  cameraPosition: vec3 = [2, 2, 4],
  lookDirection: vec3 = [0, 0, 0],
  upDirection: vec3 = [0, 1, 0]
) => {
  const viewMatrix = mat4.create();
  const projectionMatrix = mat4.create();
  const viewProjectionMatrix = mat4.create();
  mat4.perspective(
    projectionMatrix,
    (2 * Math.PI) / 5,
    respectRatio,
    0.1,
    100.0
  );

  mat4.lookAt(viewMatrix, cameraPosition, lookDirection, upDirection);
  mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

  const cameraOption = {
    eye: cameraPosition,
    center: lookDirection,
    zoomMax: 100,
    zoomSpeed: 2
  };

  return {
    viewMatrix,
    projectionMatrix,
    viewProjectionMatrix,
    cameraOption
  };
};
