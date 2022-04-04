<!--
 * @Author: TYW
 * @Date: 2022-04-03 10:38:19
 * @LastEditTime: 2022-04-04 15:52:22
 * @LastEditors: TYW
 * @Description: 
-->
<template>
  <div class="lesson001_container">
    <div>
      <h1>Crete Triangle</h1>
      <div>
        <div>Color:</div>
        <input type="text" v-model="inputColor" />
      </div>
    </div>
    <div id="lesson001_container" class="lesson001_container"></div>
  </div>
</template>

<script lang="ts">
import { run } from '../api/Run';
import { defineComponent, onMounted, ref, watch } from 'vue';
export default defineComponent({
  setup() {
    onMounted(() => {
      run('lesson001_container');
    });
    let inputColor = ref('(0.0,1.0,0.0,1.0)');
    watch(
      () => inputColor.value,
      newVal => {
        run('lesson001_container', newVal);
      }
    );
    return { inputColor };
  }
});
</script>
<style scoped>
.lesson001_container {
  background: white;
  width: 100%;
  height: 100%;
}
</style>
