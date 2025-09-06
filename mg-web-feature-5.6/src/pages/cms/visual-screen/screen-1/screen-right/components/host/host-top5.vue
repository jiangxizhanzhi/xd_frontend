<template>
  <div class="host-state">
    <div class="type-item" v-for="item in hostState" :key="item.type">
      <div class="type-item-count">{{ item.count }}</div>
      <div class="type-item-bar">
        <div class="line" v-for="i in 3" :key="i">
          <div class="line-half">
            <span v-for="i in 3" :key="i"></span>
          </div>
        </div>
      </div>
      <div class="type-item-context">{{ item.type }}</div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    assetItem: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      hostState: [
        {
          type: 'Mongo',
          count: 243,
          percent: '20%',
        },
        {
          type: 'Apache',
          count: 222,
          percent: '20%',
        },
        {
          type: 'Mysql',
          count: 344,
          percent: '20%',
        },
        {
          type: 'SSH',
          count: 223,
          percent: '20%',
        },
        {
          type: 'Redis',
          count: 224,
          percent: '20%',
        },
      ],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.host-state {
  height: var(--host-state-height);
  display: flex;
  justify-content: space-between;
  .type-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 25%;
    & > div {
      width: 100%;
      text-align: center;
    }

    // count 样式
    .type-item-count {
      font-size: var(--font-size-16);
      color: var(--low-level-color);
      font-weight: bold;
      margin-bottom: 10px;
    }
    // 文字样式
    .type-item-context {
      font-size: var(--font-size-12);
      margin-top: 10px;
    }
    .type-item-bar {
      height: var(--host-attack-height);
      width: var(--host-attack-width);
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      //每个条的样式设置
      .line {
        width: 100%;
        height: var(--host-attack-in-div-height);
        background-color: var(--host-normal-color);
        // display: 0;
        .line-half {
          width: 70%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          span {
            display: inline-block;
            width: calc(var(--host-attack-in-div-height) / 2);
            height: 50%;
            background-color: var(--host-top5-little-square-bg);
          }
        }
      }
    }
  }
}
</style>
