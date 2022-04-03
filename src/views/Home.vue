<!--
 * @Author: TYW
 * @Date: 2022-02-22 18:05:50
 * @LastEditTime: 2022-02-22 18:36:41
 * @LastEditors: TYW
 * @Description: 
-->
<template>
  <div class="home">
    <div ref="sceneRef"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
export default defineComponent({
  setup() {
    const sceneRef = ref();
    const init = () => {
      console.log("初始化");
    };
    onMounted(() => {
      init();
    });
    return {
      sceneRef
    };
  }
});
</script>
