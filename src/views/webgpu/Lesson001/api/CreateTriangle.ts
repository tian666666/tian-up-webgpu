/*
 * @Author: TYW
 * @Date: 2022-04-03 15:32:18
 * @LastEditTime: 2022-04-04 21:40:27
 * @LastEditors: TYW
 * @Description:
 */
import { InitWebGPU } from './WebGPUInstance';
import { Shaders } from './ShaderUtil';
export const CreateTriangle = async (
  domID: string,
  color = '(0.0,1.0,0.0,1.0)'
) => {
  const IWebGPU = await InitWebGPU(domID);
  if (!IWebGPU) {
    return null;
  }

  const device = IWebGPU.Device;
  const webgpu = IWebGPU.WebGPU;

  const shader = Shaders(color);

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
      topology: 'triangle-list'
    }
  })) as GPURenderPipeline;

  const commandEncoder =
    device.createCommandEncoder() as GPUCommandEncoder;
  const textureView =
    webgpu.getCurrentTexture().createView() as GPUTextureView;

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
  renderPass.draw(3, 1, 0, 0);
  renderPass.end();

  device.queue.submit([commandEncoder?.finish()]);
};
