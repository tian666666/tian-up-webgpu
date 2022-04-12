/*
 * @Author: TYW
 * @Date: 2022-04-05 21:23:51
 * @LastEditTime: 2022-04-06 23:29:00
 * @LastEditors: TYW
 * @Description:
 */
export const RightNow = () => {
  if (performance && performance.now()) {
    return performance.now();
  } else {
    const dateNow = Date.now();
    if (dateNow) {
      return dateNow;
    } else {
      return +new Date();
    }
  }
};
