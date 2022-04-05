<!--
 * @Author: TYW
 * @Date: 2022-04-03 10:38:19
 * @LastEditTime: 2022-04-05 00:08:29
 * @LastEditors: TYW
 * @Description: 
-->
<template>
  <div class="containerT">
    <div class="contianerF">
      <h1>Create 3D Model Object</h1>
    </div>
    <div id="lesson008_container" class="containerG"></div>
  </div>
</template>

<script lang="ts">
import { run } from '../api/Run';
import { defineComponent, onMounted, ref, watch } from 'vue';
export default defineComponent({
  setup() {
    onMounted(() => {
      run('lesson008_container');
    });
    return {};
  }
});
</script>
<style scoped>
.containerT {
  width: 100%;
  height: 100%;
}
.containerF {
  height: 8rem;
  width: 100%;
}
.containerG {
  background: black;
  width: 100%;
  height: calc(100% - 12rem);
}
</style>
