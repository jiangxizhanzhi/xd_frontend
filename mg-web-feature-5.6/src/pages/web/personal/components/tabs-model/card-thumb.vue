<template>
  <div class="card-thumb-wrapper">
    <div class="content-box">
      <div
        class="left-box mr20 one-overflow fl"
        :title="tableDatas.resource_desc"
        @click="toDetail(tableDatas)"
      >
        {{ tableDatas.theme_name }}
      </div>
      <div class="right-box one-overflow fl" :title="tableDatas.content">
        {{ tableDatas.content }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tableDatas: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {
    toDetail(item) {
      if (item.business_type === 1) {
        this.$router.push({
          path: `oj/all-course/detail/${item.root_business_id}/`,
          query: { comment_type: item.business_type },
        });
      } else if (item.business_type === 2) {
        this.$router.push({
          path: `oj/all-course/lesson/${item.root_business_id}/`,
          query: { comment_type: item.business_type },
        });
      } else if (item.business_type === 3) {
        this.$router.push({
          path: `oj/practice/capture-flag/exercise-details/${item.root_business_id}`,
          query: { comment_type: item.business_type },
        });
      } else if (item.resource_type === 1) {
        // 课程训练课程详情笔记
        this.$router.push({
          path: `oj/all-course/detail/${item.business_id}/`,
          query: { resource_type: item.resource_type },
        });
      } else if (item.resource_type === 2) {
        // 展示目录详情的笔记
        this.$router.push({
          path: `oj/all-course/lesson/${item.business_id}/`,
          query: { resource_type: item.resource_type },
        });
      } else if (item.resource_type === 3) {
        // 攻防实训实操题笔记
        this.$router.push({
          path: `oj/practice/capture-flag/exercise-details/${item.business_id}`,
          query: { resource_type: item.resource_type },
        });
      } else if (item.resource_type === 4) {
        // 练习笔记
        this.$router.push({
          path: `oj/all-course/lesson/${item.business_id}`,
          query: { resource_type: item.resource_type },
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.card-thumb-wrapper {
  width: 100%;
  .content-box {
    border-bottom: 1px solid var(--neutral0);
    display: flex;
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    &:hover {
      background: var(--neutral0);
    }
    .left-box {
      width: 30%;
      height: 40px;
      padding: 0 18px;
      border: none;
      cursor: pointer;
      color: var(--primary-color);
    }
    .right-box {
      padding: 0 10px;
      width: calc(70% - 20px);
      box-sizing: border-box;
      background: none;
    }
  }
}
</style>
