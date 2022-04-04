<!--
 * @Author: TYW
 * @Date: 2022-04-03 10:38:19
 * @LastEditTime: 2022-04-04 15:04:47
 * @LastEditors: TYW
 * @Description: 
-->
<template>
  <div class="lesson002_container">
    <div>
      <h1>Triangle with Vertex</h1>
    </div>
    <div id="lesson002_container" class="lesson002_container"></div>
  </div>
</template>

<script lang="ts">
import { run } from '../api/Run';
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
  setup() {
    onMounted(() => {
      run('lesson002_container');
    });
    return {};
  }
});
</script>
<style scoped>
.lesson002_container {
  background: white;
  width: 100%;
  height: 100%;
}
</style>
