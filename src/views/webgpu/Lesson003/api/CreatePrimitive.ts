/*
 * @Author: TYW
 * @Date: 2022-04-03 15:32:18
 * @LastEditTime: 2022-04-04 21:44:18
 * @LastEditors: TYW
 * @Description:
 */
import { InitWebGPU } from './WebGPUInstance';
import { Shaders } from './ShaderUtil';
export const CreatePrimitive = async (
  domID: string,
  primitiveType = 'line-list'
) => {
  const IWebGPU = await InitWebGPU(domID);
  if (!IWebGPU) {
    return null;
  }
  const device = IWebGPU.Device;
  const webgpu = IWebGPU.WebGPU;

  let indexFormat = undefined;
  if (primitiveType === 'line-strip') {
    indexFormat = 'uint32';
  }

  const shader = Shaders();

  const pipeline = (await device.createRenderPipelineAsync({
    vertex: {
      module: device.createShaderModule({ code: shader.vertex }),
      entryPoint: 'main'
    },
    fragment: {
      module: device.createShaderModule({ code: shader.fragment }),
      entryPoint: 'main',
      targets: [{ format: IWebGPU.Format }]
    },
    primitive: {
      topology: primitiveType as GPUPrimitiveTopology,
      stripIndexFormat: indexFormat as GPUIndexFormat
    }
  })) as GPURenderPipeline;

  const commandEncoder = device.createCommandEncoder() as GPUCommandEncoder;
  const textureView = webgpu.getCurrentTexture().createView() as GPUTextureView;

  const renderPassColorAttachment: GPURenderPassColorAttachment = {
    view: textureView,
    loadValue: { r: 0.5, g: 0.5, b: 0.8, a: 1.0 }, // background color
    loadOp: 'clear',
    storeOp: 'store'
  };
  const renderPass = commandEncoder?.beginRenderPass({
    colorAttachments: [renderPassColorAttachment]
  }) as GPURenderPassEncoder;

  renderPass.setPipeline(pipeline);
  renderPass.draw(6); // 3 3个顶点  6 6个顶点  其他可以用默认值
  renderPass.end();

  device.queue.submit([commandEncoder?.finish()]);
};
