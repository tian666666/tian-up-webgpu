/*
 * @Author: TYW
 * @Date: 2022-04-05 20:40:52
 * @LastEditTime: 2022-04-06 22:57:58
 * @LastEditors: TYW
 * @Description:
 */

import { parseUnit } from './ParseUnit';

const PIXELS_PER_INCH = 96;

const defaults = {
  ch: 8,
  ex: 7.15625,
  em: 16,
  rem: 16,
  in: PIXELS_PER_INCH,
  cm: PIXELS_PER_INCH / 2.54,
  mm: PIXELS_PER_INCH / 25.4,
  pt: PIXELS_PER_INCH / 72,
  pc: PIXELS_PER_INCH / 6,
  px: 1
};

export const toPX = (str: any): any => {
  if (!str && str !== 0) return null;
  if (str === 'ch') {
    return defaults['ch'];
  }
  if (str === 'ex') {
    return defaults['ex'];
  }
  if (str === 'em') {
    return defaults['em'];
  }
  if (str === 'rem') {
    return defaults['rem'];
  }
  if (str === 'in') {
    return defaults['in'];
  }
  if (str === 'cm') {
    return defaults['cm'];
  }
  if (str === 'mm') {
    return defaults['mm'];
  }
  if (str === 'pt') {
    return defaults['pt'];
  }
  if (str === 'pc') {
    return defaults['pc'];
  }

  if (str === 'px') {
    return defaults['px'];
  }
  // detect number of units
  const parts = parseUnit(str);
  if (!isNaN(parts[0])) {
    if (parts[1]) {
      const px = toPX(parts[1]);
      return typeof px === 'number' ? parts[0] * px : null;
    } else {
      return parts[0];
    }
  }

  return null;
};
