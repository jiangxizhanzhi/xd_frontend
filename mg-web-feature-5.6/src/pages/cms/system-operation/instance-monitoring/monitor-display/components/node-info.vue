<template>
  <div class="node-info-box ft12" :class="getClass(flag)">
    <div class="icon-box" v-for="item in nodePic" :key="item.name">
      <div class="number">{{ item.value }}</div>
      <img :src="item.icon" />
      <div>{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NodeInfo',
  props: {
    nodePic: {
      type: Array,
      default: () => [],
    },
    flag: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {
    getClass() {
      return function (flag) {
        if (flag == 'traffic') {
          return 'trafficStyle';
        }
      };
    },
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {},
};
</script>

<style lang="scss" scoped>
.trafficStyle {
  height: 100px !important;
  position: absolute !important;
  bottom: 10px !important;
  width: 100% !important;
}
.node-info-box {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
  height: calc(100% - 32px);
  color: #fff;
  .icon-box {
    position: relative;
  }
  div {
    text-align: center;
  }
  .number {
    position: absolute;
    top: calc(50% - 9px);
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
    font-size: 18px;
    text-shadow: 0 0 8px rgb(231 239 255 / 20%), 0 0 8px rgb(231 239 255 / 20%),
      0 0 8px rgb(231 239 255 / 20%), 0 0 8px rgb(231 239 255 / 20%);
    background: linear-gradient(0deg, #bde1ff 0%, #ffffff 50%, #e7efff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  img {
    width: 70px;
    height: 70px;
  }
}
</style>
