<!--
 * @Author: lixiao
 * @Date: 2022-02-22 09:36:21
 * @LastEditors: Lixiao
 * @LastEditTime: 2022-02-22 09:36:22
 * @Desciption: Do not edit
 * @Email: 932184220@qq.com
-->
<template>
  <div class="visual-screen2">
    <div class="team">
      <ScreenHeader :name="name" />
      <div class="team-content">
        <Top :id="scene" />
        <Bottom :id="scene" />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import ScreenHeader from '../components/header.vue';
import Top from './top';
import Bottom from './bottom';
import { querySystem } from '../api';
export default defineComponent({
  name: '',
  components: { ScreenHeader, Top, Bottom },
  setup() {
    const name = ref('');
    const scene = ref('');
    const topo = ref('');

    onMounted(() => {
      querySystem().then((res) => {
        name.value = res.data.data.name;
        scene.value = res.data.data.scene;
        topo.value = res.data.data.topo;
      });
    });

    return {
      name,
      scene,
      topo,
    };
  },
});
</script>
<style lang="scss" scoped></style>
