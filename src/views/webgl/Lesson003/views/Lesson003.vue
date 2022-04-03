<!--
 * @Author: TYW
 * @Date: 2022-02-24 13:52:08
 * @LastEditTime: 2022-03-08 19:46:43
 * @LastEditors: TYW
 * @Description: 
-->
<template>
  <div id="lesson003_container" class="lesson003_container"></div>
</template>

<script lang="ts">
import { runUtil } from '../api/run';
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
  setup() {
    onMounted(() => {
      new runUtil().run("lesson003_container");
    });

    return {};
  }
});
</script>
<style scoped>
.lesson002_container {
  background: green;
  width: 100%;
  height: 100%;
}
</style>
