<template>
  <div class="count-bottom flex-fill-col">
    <div v-for="item in assetInfo" :key="item.name" class="item-des">
      <div>
        <div class="mr-bottom num">{{ item.num }}</div>
        <div class="name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import TotalAssetsItem from './total-assets-item.vue';
export default {
  components: {
    TotalAssetsItem,
  },
  props: {
    assetInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
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
<style lang="scss" scoped>
.count-bottom {
  display: flex;
  flex-wrap: wrap;

  .item-des {
    position: relative;
    height: 100%;
    width: calc((100% - 80px) / 4);
    margin: 0 10px;
    background: var(--asset-down-bg-color);

    & > div {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      & > div {
        text-align: center;
      }
      .num {
        font-size: var(--font-size-16);
        color: var(--font-gree-color);
        font-weight: 600;
      }
      .name {
        font-size: var(--font-size-12);
        color: var;
      }
    }
  }
}
</style>
