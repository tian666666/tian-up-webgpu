/*
 * @Author: TYW
 * @Date: 2022-04-05 20:41:36
 * @LastEditTime: 2022-04-06 21:31:27
 * @LastEditors: TYW
 * @Description:
 */
export const parseUnit = (str: string, out?: any[]) => {
  if (!out) out = [0, ''];

  str = String(str);
  const match = str.match(
    /^(0?[-.]?\d+)(r?e[m|x]|v[h|w|min|max]+|p[x|t|c]|[c|m]m|%|s|in|ch)$/
  );

  if (match) {
    out[0] = parseFloat(match[1]) || match[1];
    out[1] = match[2];
  } else {
    const num = parseFloat(str);
    out[0] = num;
  }

  return out;
};
