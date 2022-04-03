/*
 * @Author: TYW
 * @Date: 2022-02-22 18:05:50
 * @LastEditTime: 2022-02-25 19:31:44
 * @LastEditors: TYW
 * @Description: 
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "@typescript-eslint/no-inferrable-types": "off", // 关闭类型推断
    "@typescript-eslint/no-this-alias": "off"
  }
}
