<!--
 * @Author: TYW
 * @Date: 2022-02-24 13:52:08
 * @LastEditTime: 2022-02-25 19:20:30
 * @LastEditors: TYW
 * @Description: 
-->
<template>
  <div id="lesson002_container" class="lesson002_container"></div>
</template>

<script lang="ts">
import { runUtil } from '../api/run';
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
  setup() {
    onMounted(() => {
      new runUtil().run("lesson002_container");
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
