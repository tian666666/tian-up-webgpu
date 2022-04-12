/*
 * @Author: TYW
 * @Date: 2022-04-05 20:38:53
 * @LastEditTime: 2022-04-06 22:58:26
 * @LastEditors: TYW
 * @Description:
 */
import { toPX } from './ToPx';

export const mouseWheelListen = (
  element: any,
  callback: any,
  noScroll: boolean
) => {
  if (typeof element === 'function') {
    noScroll = !!callback;
    callback = element;
    element = window;
  }
  const lineHeight = toPX('ex');
  const listener = function (ev: any) {
    if (noScroll) {
      ev.preventDefault();
    }
    let dx = ev.deltaX || 0;
    let dy = ev.deltaY || 0;
    let dz = ev.deltaZ || 0;
    const mode = ev.deltaMode;
    let scale = 1;
    switch (mode) {
      case 1:
        scale = lineHeight;
        break;
      case 2:
        scale = window.innerHeight;
        break;
    }
    dx *= scale;
    dy *= scale;
    dz *= scale;
    if (dx || dy || dz) {
      return callback(dx, dy, dz, ev);
    }
  };
  element.addEventListener('wheel', listener);
  return listener;
};
