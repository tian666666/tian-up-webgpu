/*
 * @Author: TYW
 * @Date: 2022-04-03 15:32:18
 * @LastEditTime: 2022-04-04 15:02:56
 * @LastEditors: TYW
 * @Description:
 */
import { WebGPUInstance } from './WebGPUInstance';
import { Shaders } from './ShaderUtil';
export const CreateTriangle = async (
  domID: string
) => {
  const IWebGPU = await WebGPUInstance(domID);
  if (!IWebGPU) {
    return null;
  }
  const shader = Shaders();

  const pipeline = (await IWebGPU.Device?.createRenderPipelineAsync({
    vertex: {
      module: IWebGPU.Device.createShaderModule({ code: shader.vertex }),
      entryPoint: 'main'
    },
    fragment: {
      module: IWebGPU.Device.createShaderModule({ code: shader.fragment }),
      entryPoint: 'main',
      targets: [{ format: IWebGPU.Format as GPUTextureFormat }]
    },
    primitive: {
      topology: 'triangle-list'
    }
  })) as GPURenderPipeline;

  const commandEncoder =
    IWebGPU.Device?.createCommandEncoder() as GPUCommandEncoder;
  const textureView =
    IWebGPU.WebGPU?.getCurrentTexture().createView() as GPUTextureView;

  const renderPassColorAttachment: GPURenderPassColorAttachment = {
    view: textureView,
    loadValue: { r: 0.5, g: 0.5, b: 0.8, a: 1.0 }, // background color
    loadOp: 'clear',
    storeOp: 'store'
  };
  const renderPass = commandEncoder?.beginRenderPass({
    colorAttachments: [renderPassColorAttachment]
  }) as GPURenderPassEncoder;

  renderPass?.setPipeline(pipeline);
  renderPass?.draw(3, 1, 0, 0);
  renderPass?.end();

  IWebGPU.Device?.queue.submit([commandEncoder?.finish()]);
};
