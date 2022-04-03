<!--
 * @Author: TYW
 * @Date: 2022-02-23 19:06:24
 * @LastEditTime: 2022-02-23 20:05:50
 * @LastEditors: TYW
 * @Description: 
-->
<template>
  <div id="lesson001_container" class="lesson001_container"></div>
</template>

<script lang="ts">
import { run } from '../api/run';
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
  setup() {
    onMounted(() => {
      run('lesson001_container');
    });

    return {};
  }
});
</script>
<style scoped>
.lesson001_container {
  background: green;
  width: 100%;
  height: 100%;
}
</style>
