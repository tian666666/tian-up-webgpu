<!--
 * @Author: TYW
 * @Date: 2022-04-03 10:38:19
 * @LastEditTime: 2022-04-04 21:45:57
 * @LastEditors: TYW
 * @Description: 
-->
<template>
  <div class="containerT">
    <div class="containerF">
      <h1>Create Point or Line Primitives</h1>
      <div>
        <div><b>Input a primitive type:</b></div>
        <div>
          optional primitive types: point-list line-list line-strip
          triangle-list triangle-strip
        </div>
        <input type="text" v-model="primitiveType" />
      </div>
    </div>
    <div id="lesson003_container" class="containerG"></div>
  </div>
</template>

<script lang="ts">
import { run } from '../api/Run';
import { defineComponent, onMounted, ref, watch } from 'vue';
export default defineComponent({
  setup() {
    let primitiveType = ref('line-list');
    onMounted(() => {
      run('lesson003_container', primitiveType.value);
    });
    watch(
      () => primitiveType.value,
      newVal => {
        run('lesson003_container', newVal);
      }
    );
    return { primitiveType };
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
