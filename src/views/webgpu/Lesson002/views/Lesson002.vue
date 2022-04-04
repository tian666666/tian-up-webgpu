<!--
 * @Author: TYW
 * @Date: 2022-04-03 10:38:19
 * @LastEditTime: 2022-04-04 21:45:19
 * @LastEditors: TYW
 * @Description: 
-->
<template>
  <div class="containerT">
    <div class="containerF">
      <h1>Triangle with Vertex</h1>
    </div>
    <div id="lesson002_container" class="containerG"></div>
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
