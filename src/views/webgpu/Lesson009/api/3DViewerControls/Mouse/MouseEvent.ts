/*
 * @Author: TYW
 * @Date: 2022-04-05 20:10:43
 * @LastEditTime: 2022-04-05 20:30:32
 * @LastEditors: TYW
 * @Description:
 */
export const mouseButtons = (ev: { buttons?: any; which?: any; button?: any }) => {
  if (typeof ev === 'object') {
    if ('buttons' in ev) {
      return ev.buttons;
    } else if ('which' in ev) {
      const b = ev.which;
      if (b === 2) {
        return 4;
      } else if (b === 3) {
        return 2;
      } else if (b > 0) {
        return 1 << (b - 1);
      }
    } else if ('button' in ev) {
      const b = ev.button;
      if (b === 1) {
        return 4;
      } else if (b === 2) {
        return 2;
      } else if (b >= 0) {
        return 1 << b;
      }
    }
  }
  return 0;
};

export const mouseElement = (ev: { target?: any; srcElement?: any }) => {
  return ev.target || ev.srcElement || window;
};

export const mouseRelativeX = (ev: {
  offsetX?: any;
  clientX?: any;
  target?: any;
  srcElement?: any;
}) => {
  if (typeof ev === 'object') {
    if ('offsetX' in ev) {
      return ev.offsetX;
    }
    const target = mouseElement(ev);
    const bounds = target.getBoundingClientRect();
    return ev.clientX - bounds.left;
  }
  return 0;
};

export const mouseRelativeY = (ev: {
  offsetY?: any;
  clientY?: any;
  target?: any;
  srcElement?: any;
}) => {
  if (typeof ev === 'object') {
    if ('offsetY' in ev) {
      return ev.offsetY;
    }
    const target = mouseElement(ev);
    const bounds = target.getBoundingClientRect();
    return ev.clientY - bounds.top;
  }
  return 0;
};
