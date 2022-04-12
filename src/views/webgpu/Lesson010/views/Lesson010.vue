<!--
 * @Author: TYW
 * @Date: 2022-04-03 10:38:19
 * @LastEditTime: 2022-04-12 20:50:53
 * @LastEditors: TYW
 * @Description: 
-->
<template>
  <div class="containerT">
    <div class="contianerF">
      <h1>Create Square using Index GPU Buffer</h1>
      <div>
        <div><b>Input camera type:</b></div>
        <div>optional camera types: Animation or Camera Control</div>
        <input type="text" v-model="cameraType" />
      </div>
    </div>
    <div id="lesson010_container" class="containerG"></div>
  </div>
</template>

<script lang="ts">
import { run } from '../api/Run';
import { defineComponent, onMounted, ref, watch } from 'vue';
export default defineComponent({
  setup() {
    let cameraType = ref('Animation');
    onMounted(() => {
      run('lesson010_container', cameraType.value === 'Animation');
    });
    watch(
      () => cameraType.value,
      newVal => {
        run('lesson010_container', newVal === 'Animation');
      }
    );
    return { cameraType };
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
