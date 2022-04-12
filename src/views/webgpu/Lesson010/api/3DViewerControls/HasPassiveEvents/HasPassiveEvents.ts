/*
 * @Author: TYW
 * @Date: 2022-04-05 21:15:20
 * @LastEditTime: 2022-04-06 20:53:07
 * @LastEditors: TYW
 * @Description: 
 */
export const detect = () => {
  let supported = false;
  function testFunc() {
    return true;
  }
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function () {
        supported = true;
      }
    });
   
    window.addEventListener('test', testFunc, opts);
    window.removeEventListener('test', testFunc, opts);
  } catch (e) {
    supported = false;
  }

  return supported;
};
