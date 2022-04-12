/*
 * @Author: TYW
 * @Date: 2022-04-03 15:32:18
 * @LastEditTime: 2022-04-12 22:41:50
 * @LastEditors: TYW
 * @Description:
 */
import {
  CreateGPUBuffer,
  CreateGPUBufferUint,
  CreateTransforms,
  CreateViewProjection,
  InitWebGPU
} from './WebGPUInstance';
import { CreateAnimation } from './Camera';
import { Shaders } from './ShaderUtil';
import { mat4, vec3 } from 'gl-matrix';
import createCamera from './3DViewerControls/index';
export const CreateWireframe = async (domID: string, wireframeData: Float32Array, isAnimation = true) => {
  const IWebGPU = await InitWebGPU(domID);
  if (!IWebGPU) {
    return null;
  }

  const device = IWebGPU.Device;
  const webgpu = IWebGPU.WebGPU;
  const canvas = IWebGPU.Canvas;

  const numberOfVertices = wireframeData.length / 3;

  const vertexBuffer = CreateGPUBuffer(device, wireframeData);

  const shader = Shaders();

  const pipeline = (await device.createRenderPipelineAsync({
    vertex: {
      module: device.createShaderModule({ code: shader.vertex }),
      entryPoint: 'main',
      buffers: [
        {
          arrayStride: 12,
          attributes: [
            {
              shaderLocation: 0,
              format: 'float32x3',
              offset: 0
            }
          ]
        }
      ]
    },
    fragment: {
      module: device.createShaderModule({ code: shader.fragment }),
      entryPoint: 'main',
      targets: [{ format: IWebGPU.Format }]
    },
    primitive: {
      topology: 'line-list'
    }
  })) as GPURenderPipeline;

  // create uniform data
  const modelMatrix = mat4.create();
  const mvpMatrix = mat4.create();
  let vMatrix = mat4.create();
  let vpMatrix = mat4.create();
  const vp = CreateViewProjection(canvas.width / canvas.height);
  vpMatrix = vp.viewProjectionMatrix;

  // add rotation and camera:
  const rotation = vec3.fromValues(0, 0, 0);
  const camera = createCamera(canvas, vp.cameraOption);
  console.log('当前相机信息', camera);
  // create uniform buffer and bind group
  const uniformBuffer = device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  });

  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
          offset: 0,
          size: 64
        }
      }
    ]
  });

  let textureView = webgpu.getCurrentTexture().createView() as GPUTextureView;

  const renderPassDescription = {
    colorAttachments: [
      {
        view: textureView,
        clearValue: { r: 0.2, g: 0.247, b: 0.314, a: 1.0 },
        // loadValue: { r: 0.2, g: 0.247, b: 0.314, a: 1.0 }, // background color
        loadOp: 'clear',
        storeOp: 'store'
      }
    ]
  };

  function draw() {
    if (!isAnimation) {
      if (camera.tick()) {
        const pMatrix = vp.projectionMatrix;
        vMatrix = camera.matrix;
        mat4.multiply(vpMatrix, pMatrix, vMatrix);
      }
    }

    CreateTransforms(modelMatrix, [0, 0, 0], rotation);
    mat4.multiply(mvpMatrix, vpMatrix, modelMatrix);
    device.queue.writeBuffer(uniformBuffer, 0, mvpMatrix as ArrayBuffer);

    textureView = webgpu.getCurrentTexture().createView() as GPUTextureView;
    renderPassDescription.colorAttachments[0].view = textureView;

    const commandEncoder = device.createCommandEncoder() as GPUCommandEncoder;

    const renderPass = commandEncoder.beginRenderPass(
      renderPassDescription as GPURenderPassDescriptor
    ) as GPURenderPassEncoder;

    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setBindGroup(0, uniformBindGroup);
    renderPass.draw(numberOfVertices);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
  }

  CreateAnimation(draw, rotation, isAnimation);
};
