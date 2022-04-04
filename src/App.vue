<!--
 * @Author: TYW
 * @Date: 2022-02-22 18:05:50
 * @LastEditTime: 2022-04-04 22:59:04
 * @LastEditors: TYW
 * @Description: 
-->
<template>
  <div id="nav" class="nav">
    <router-link to="/Home">Home</router-link>
    |
    <router-link to="/Lesson001">Lesson001</router-link>
    |
    <router-link to="/Lesson002">Lesson002</router-link>
    |
    <router-link to="/Lesson003">Lesson003</router-link>
    |
    <router-link to="/Lesson004">Lesson004</router-link>
    |
    <router-link to="/Lesson005">Lesson005</router-link>
    |
    <router-link to="/Lesson006">Lesson006</router-link>
    |
    <router-link to="/Lesson007">Lesson007</router-link>
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
.nav {
  max-height: 3rem;
  overflow: auto;
}
</style>
