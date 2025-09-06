<template>
  <div class="visual-screen2">
    <div class="main">
      <div
        class="fun-btn"
        @click="hidden = !hidden"
        :class="[hidden ? 'is-show' : 'is-hide']"
      ></div>
      <iframe
        class="u3d"
        runat="server"
        :src="url"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
      ></iframe>
      <ScreenHeader :name="name" />
      <div class="main-content">
        <Top :id="scene" :hidden="hidden" />
        <Bottom :id="scene" />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref, provide } from '@vue/composition-api';
import ScreenHeader from '../components/header.vue';
import Top from './top';
import Bottom from './bottom';
import { querySystem } from '../api';
export default defineComponent({
  name: '',
  components: { ScreenHeader, Top, Bottom },
  props: {},
  setup() {
    const name = ref('');
    const scene = ref('');
    const topo = ref('');
    const url = ref('');
    const hidden = ref(false);
    const rate = ref(window.screen.width / 1920);

    provide('rate', rate.value);

    onMounted(() => {
      querySystem().then((res) => {
        name.value = res.data.data.name;
        scene.value = res.data.data.scene;
        topo.value = res.data.data.topo;
        url.value =
          'http://' +
          location.host +
          '/situation/?sceneId=' +
          scene.value +
          '&topoId=' +
          topo.value;
      });
    });

    return {
      name,
      scene,
      topo,
      url,
      hidden,
      rate,
    };
  },
});
</script>
<style lang="scss" scoped>
.fun-btn {
  position: absolute;
  right: 0;
  top: 40px;
  width: 24px;
  height: 40px;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  cursor: pointer;
  z-index: 999;

  &.is-show {
    background-image: url(~@/assets/img/visual-screen/screen-2/show.png);
  }

  &.is-hide {
    background-image: url(~@/assets/img/visual-screen/screen-2/hide.png);
  }
}
</style>
