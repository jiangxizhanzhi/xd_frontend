<template>
  <div class="visual-screen" id="visual-screen">
    <Header />
    <div class="content-warpper">
      <ScreenLeft />
      <ScreenCenterGroup></ScreenCenterGroup>
      <ScreenRight />
    </div>
  </div>
</template>
<script>
import ScreenLeft from './screen-left/index.vue';
import ScreenCenter from './screen-center/index.vue';
import ScreenCenterGroup from './screen-center-group/index.vue';
import ScreenRight from './screen-right/index.vue';
import Header from './components/screen-header.vue';
import Barrage from './components/barrage.vue';
import { useTime, getScreenInfo } from '@/hooks';
import Score from './components/score';
export default {
  name: 'VisualScreen',
  components: {
    ScreenLeft,
    ScreenCenter,
    ScreenRight,
    Header,
    Score,
    ScreenCenterGroup,
    Barrage,
  },
  props: {},
  setup() {
    const time = useTime();
    const screen = getScreenInfo();
    return { time, screen };
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>
<style scoped lang="scss"></style>
