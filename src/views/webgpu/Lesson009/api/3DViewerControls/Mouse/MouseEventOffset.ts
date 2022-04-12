/*
 * @Author: TYW
 * @Date: 2022-04-05 21:11:07
 * @LastEditTime: 2022-04-05 21:30:44
 * @LastEditors: TYW
 * @Description:
 */

export const mouseEventOffset = (ev: any, target: any, out?: number[]) => {
  target = target || ev.currentTarget || ev.srcElement;
  if (!Array.isArray(out)) {
    out = [0, 0];
  }
  const cx = ev.clientX || 0;
  const cy = ev.clientY || 0;
  const rect = getBoundingClientOffset(target);
  out[0] = cx - rect.left;
  out[1] = cy - rect.top;
  return out;
};

const getBoundingClientOffset = (element: any) => {
  const rootPosition = { left: 0, top: 0 };
  if (element === window || element === document || element === document.body) {
    return rootPosition;
  } else {
    return element.getBoundingClientRect();
  }
};
