/*
 * @Author: TYW
 * @Date: 2022-04-03 10:33:36
 * @LastEditTime: 2022-04-03 10:41:17
 * @LastEditors: TYW
 * @Description:
 */
export const CheckWebGPU = () => {
  let result = 'Great, your current browser supports WebGPU!';
  let isSupportWebGPU = true;
  if (!navigator.gpu) {
    result = ` Your current borwser does not support WebGPU! Maek sure you are on a system with WebGPU enabled.
              SPIR-WbGPU is only supported in
              <a href="https://www.google.com/chrome/canary/">Chrome canary</a>
              with the flat "enable-unsafe-webgpu" enabled. 
              See the
              <a href="https://github.com/gpuweb/gpuweb/wiki/Implementation-Status">Implementation Status</a> page for more details`;

    isSupportWebGPU = false;
  }
  return {
    desc: result,
    isSupportWebGPU: isSupportWebGPU
  };
};
