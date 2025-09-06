<template>
  <div class="scense-contain flex-column">
    <Header :level="1" title="训练场景" />
    <!-- <div class="mrTop"></div> -->
    <cb-scroll
      ref="tableRfe"
      :data="listData"
      :class-option="optionSingleHeight"
      class="seamless-warp flex-fill-col"
    >
      <div class="train-scense" v-for="(item, index) in listData" :key="index">
        {{ item.title }}
      </div>
      <div class="space"></div>
    </cb-scroll>
  </div>
</template>

<script>
import Header from '../../components/header';
import { traniningScense } from '@/api/screen-center-group';
import { ref, reactive, onMounted } from '@vue/composition-api';
export default {
  name: 'AttackScore',
  components: {
    Header,
  },
  props: {},
  computed: {
    // 控制滚动方向，时间停顿等 公告
    optionSingleHeight() {
      return {
        // 滚动方向
        direction: 1,
        // 单行一次滚动高度,这个高度是一条公告的2倍，一条公告的高度在rehearse-notice 组件里写死64px
        //  这个高度最好事动态的，设置为表格的body高度，tr的倍数
        // singleHeight: 270,
        // // 等待时间
        // waitTime: 5000,
        limitMoveNum: 1,
      };
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {},
  setup() {
    let tableRfe = ref(null);
    const listData = reactive([
      {
        title: ``,
      },
    ]);

    onMounted(() => {
      traniningScense(
        '/training_team/v/base_info/',
        'b21a7d72756fa5b828edd4433194ff33',
      ).then((res) => {
        listData[0].title = res.data.description;
        tableRfe.value.reset();
      });
    });
    return { listData, tableRfe };
  },
};
</script>

<style scoped lang="scss">
.scense-contain {
  flex: 1.5;
  overflow: hidden;

  .seamless-warp {
    height: calc(100% - 40px - var(--header-2-content-space));
    overflow: hidden;
    .train-scense {
      font-size: var(--font-size-16);
      line-height: var(--training-scense-line-height);
    }
    .space {
      height: 20px;
    }
  }
  .mrTop {
    height: var(--header-2-content-space);
  }
}
</style>
