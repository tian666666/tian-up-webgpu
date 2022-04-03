<!--
 * @Author: TYW
 * @Date: 2022-02-22 18:05:50
 * @LastEditTime: 2022-04-02 14:46:51
 * @LastEditors: TYW
 * @Description: 
-->
<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    |
    <router-link to="/about">About</router-link>
    |
    <router-link to="/Lesson001">Lesson001</router-link>
    |
    <router-link to="/Lesson002">Lesson002</router-link>
    |
    <router-link to="/Lesson003">Lesson003</router-link>
    |
  </div>
  <router-view />
</template>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
