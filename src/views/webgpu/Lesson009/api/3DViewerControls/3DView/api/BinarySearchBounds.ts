/*
 * @Author: TYW
 * @Date: 2022-04-05 14:39:49
 * @LastEditTime: 2022-04-06 21:06:00
 * @LastEditors: TYW
 * @Description:
 */

const geFunc = <T>(
  a: T[],
  y: T,
  c: (a: T, b: T) => number | null | undefined,
  l: number,
  h: number
) => {
  let i = h + 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    const p =
      c !== undefined
        ? c(x, y)
        : (x as unknown as number) - (y as unknown as number);
    if ((p as unknown as number) >= 0) {
      i = m;
      h = m - 1;
    } else {
      l = m + 1;
    }
  }
  return i;
};

const gtFunc = <T>(
  a: T[],
  y: T,
  c: (a: T, b: T) => number | null | undefined,
  l: number,
  h: number
) => {
  let i = h + 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    const p =
      c !== undefined
        ? c(x, y)
        : (x as unknown as number) - (y as unknown as number);
    if ((p as unknown as number) > 0) {
      i = m;
      h = m - 1;
    } else {
      l = m + 1;
    }
  }
  return i;
};
const ltFunc = <T>(
  a: T[],
  y: T,
  c: (a: T, b: T) => number | null | undefined,
  l: number,
  h: number
) => {
  let i = l - 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    const p =
      c !== undefined
        ? c(x, y)
        : (x as unknown as number) - (y as unknown as number);
    if ((p as unknown as number) < 0) {
      i = m;
      l = m + 1;
    } else {
      h = m - 1;
    }
  }
  return i;
};

const leFunc = <T>(
  a: T[],
  y: T,
  c: (a: T, b: T) => number | null | undefined,
  l: number,
  h: number
) => {
  let i = l - 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    const p =
      c !== undefined
        ? c(x, y)
        : (x as unknown as number) - (y as unknown as number);
    if ((p as unknown as number) < 0) {
      i = m;
      l = m + 1;
    } else {
      h = m - 1;
    }
  }
  return i;
};

const eqFunc = <T>(
  a: T[],
  y: T,
  c: (a: T, b: T) => number | null | undefined,
  l: number,
  h: number
) => {
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    const p =
      c !== undefined
        ? c(x, y)
        : (x as unknown as number) - (y as unknown as number);
    if ((p as unknown as number) === 0) {
      return m;
    }
    if ((p as unknown as number) <= 0) {
      l = m + 1;
    } else {
      h = m - 1;
    }
  }
  return -1;
};
const norm = <T>(
  a: T[],
  y: T,
  c?: (a: T, b: T) => number | null | undefined,
  l?: number,
  h?: number,
  f?: any
) => {
  if (typeof c === 'function') {
    return f(
      a,
      y,
      c,
      l === undefined ? 0 : l | 0,
      h === undefined ? a.length - 1 : h | 0
    );
  }
  return f(
    a,
    y,
    undefined,
    c === undefined ? 0 : c | 0,
    l === undefined ? a.length - 1 : l | 0
  );
};

export class BSearch {
  public static ge = <T>(
    a: T[],
    y: T,
    c?: (a: T, b: T) => number | null | undefined,
    l?: number,
    h?: number
  ) => {
    return norm(a, y, c, l, h, geFunc);
  };

  public static gt = <T>(
    a: T[],
    y: T,
    c?: (a: T, b: T) => number | null | undefined,
    l?: number,
    h?: number
  ) => {
    return norm(a, y, c, l, h, gtFunc);
  };

  public static lt = <T>(
    a: T[],
    y: T,
    c?: (a: T, b: T) => number | null | undefined,
    l?: number,
    h?: number
  ) => {
    return norm(a, y, c, l, h, ltFunc);
  };

  public static le = <T>(
    a: T[],
    y: T,
    c?: (a: T, b: T) => number | null | undefined,
    l?: number,
    h?: number
  ) => {
    return norm(a, y, c, l, h, leFunc);
  };

  public static eq = <T>(
    a: T[],
    y: T,
    c?: (a: T, b: T) => number | null | undefined,
    l?: number,
    h?: number
  ) => {
    return norm(a, y, c, l, h, eqFunc);
  };
}
