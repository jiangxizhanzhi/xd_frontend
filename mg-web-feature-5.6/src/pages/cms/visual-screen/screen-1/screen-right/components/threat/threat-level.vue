<template>
  <div class="flex-column">
    <Header :level="3" title="威胁等级" />
    <div class="threat flex-fill-col">
      <div v-for="item in threatPercentage" :key="item.name">
        <div>
          <!-- <div class="div-width"> -->
          <span>{{ item.name }}</span>
          <span class="level-style">&nbsp;{{ item.num }}%</span>
        </div>
        <!-- </div> -->
        <!-- <div class="level-style">
          <div class="div-width"></div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import Header from '../../../components/header';
export default {
  components: {
    Header,
  },
  props: {},
  data() {
    return {
      threatPercentage: [
        {
          name: '高危',
          num: 78,
        },
        {
          name: '中危',
          num: 79,
        },
        {
          name: '低危',
          num: 78,
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
.threat {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  margin: 0 var(--margin-size);
  font-size: var(--font-size-14);
  margin-top: var(--header-3-content-space);

  & > div {
    width: 100%;
    height: 33%;
    display: flex;
    align-items: center;
    // %de 样式
    .percentage {
      font-size: var(--font-size-20);
      color: var(--font-yellow-color);
    }
    // 百分比值的颜色和大小
    .level-style {
      font-size: var(--font-size-20);
      color: var(--font-yellow-color);
    }
    & > div {
      height: 50%;
      display: flex;
      align-items: center;
    }
    .level-style {
      align-items: flex-start;
    }
  }
}
</style>
