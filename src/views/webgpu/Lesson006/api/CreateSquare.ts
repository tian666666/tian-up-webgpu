/*
 * @Author: TYW
 * @Date: 2022-04-03 15:32:18
 * @LastEditTime: 2022-04-05 00:04:27
 * @LastEditors: TYW
 * @Description:
 */
import { CreateGPUBuffer, InitWebGPU } from './WebGPUInstance';
import { Shaders } from './ShaderUtil';
export const CreateSquare = async (domID: string) => {
  const IWebGPU = await InitWebGPU(domID);
  if (!IWebGPU) {
    return null;
  }

  const device = IWebGPU.Device;
  const webgpu = IWebGPU.WebGPU;

  const vertexData = new Float32Array([
    //position    //color
    -0.5,
    -0.5,
    1,
    0,
    0, // vertex a
    0.5,
    -0.5,
    0,
    1,
    0, // vertex b
    -0.5,
    0.5,
    1,
    1,
    0, // vertex d
    -0.5,
    0.5,
    1,
    1,
    0, // vertex d
    0.5,
    -0.5,
    0,
    1,
    0, // vertex b
    0.5,
    0.5,
    0,
    0,
    1 // vertex c
  ]);

  const vertexBuffer = CreateGPUBuffer(device, vertexData);

  const shader = Shaders();

  const pipeline = (await device.createRenderPipelineAsync({
    vertex: {
      module: device.createShaderModule({ code: shader.vertex }),
      entryPoint: 'main',
      buffers: [
        {
          arrayStride: 4 * (2 + 3),
          attributes: [
            {
              shaderLocation: 0,
              format: 'float32x2',
              offset: 0
            },
            {
              shaderLocation: 1,
              format: 'float32x3',
              offset: 8
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
      topology: 'triangle-list'
    }
  })) as GPURenderPipeline;

  const commandEncoder = device.createCommandEncoder() as GPUCommandEncoder;
  const textureView = webgpu.getCurrentTexture().createView() as GPUTextureView;

  const renderPassColorAttachment: GPURenderPassColorAttachment = {
    view: textureView,
    clearValue: { r: 0.2, g: 0.247, b: 0.314, a: 1.0 },
    loadValue: { r: 0.2, g: 0.247, b: 0.314, a: 1.0 }, // background color
    loadOp: 'clear',
    storeOp: 'store'
  };
  const renderPass = commandEncoder?.beginRenderPass({
    colorAttachments: [renderPassColorAttachment]
  }) as GPURenderPassEncoder;

  renderPass.setPipeline(pipeline);
  renderPass.setVertexBuffer(0, vertexBuffer);
  renderPass.draw(6);
  renderPass.end();

  device.queue.submit([commandEncoder?.finish()]);
};
