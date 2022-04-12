<!--
 * @Author: TYW
 * @Date: 2022-04-03 10:38:19
 * @LastEditTime: 2022-04-12 22:58:39
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
      <div class="values-item">
        <div>radius:</div>
        <input type="text" v-model="radius" />
        <div>u:</div>
        <input type="text" v-model="u" />
        <div>v:</div>
        <input type="text" v-model="v" />
        <div>center:</div>
        <input type="text" v-model="center" />
      </div>
    </div>
    <div id="lesson011_container" class="containerG"></div>
  </div>
</template>

<script lang="ts">
import { run } from '../api/Run';
import { defineComponent, onMounted, ref, watch } from 'vue';
import { vec3 } from 'gl-matrix';
export default defineComponent({
  setup() {
    let cameraType = ref('Animation');
    onMounted(() => {
      run(
        'lesson011_container',
        2,
        20,
        15,
        [0, 0, 0],
        cameraType.value === 'Animation'
      );
    });
    watch(
      () => cameraType.value,
      newVal => {
        run(
          'lesson011_container',
          2,
          20,
          15,
          [0, 0, 0],
          newVal === 'Animation'
        );
      }
    );

    let radius = ref(2);

    watch(
      () => radius.value,
      newVal => {
        run(
          'lesson011_container',
          newVal,
          u.value,
          v.value,
          center.value as vec3,
          cameraType.value === 'Animation'
        );
      }
    );

    let u = ref(20);

    watch(
      () => u.value,
      newVal => {
        run(
          'lesson011_container',
          radius.value,
          newVal,
          v.value,
          center.value as vec3,
          cameraType.value === 'Animation'
        );
      }
    );

    let v = ref(15);
    watch(
      () => v.value,
      newVal => {
        run(
          'lesson011_container',
          radius.value,
          u.value,
          newVal,
          center.value as vec3,
          cameraType.value === 'Animation'
        );
      }
    );

    let center = ref([0, 0, 0]);

    watch(
      () => center.value,
      newVal => {
        const centerV = newVal.toString().split(',').map(Number) as vec3;
        run(
          'lesson011_container',
          radius.value,
          u.value,
          v.value,
          centerV,
          cameraType.value === 'Animation'
        );
      }
    );
    return { cameraType, radius, u, v, center };
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
.values-item {
  display: flex;
}
</style>
