<template>
  <div class="card-thumb-wrapper">
    <div class="content-box-wrapper">
      <div class="content-box" @click="toDetail(tableDatas)">
        <div class="left-box">
          <div class="content-style">
            <div class="top-style">
              <div class="name-style one-overflow title-style">
                {{ tableDatas.theme_name }}
              </div>
              <div class="time-style name-style">
                {{ tableDatas.create_time }}
              </div>
            </div>
            <div class="name-style comment-style">
              {{ tableDatas.root_comment }}
            </div>
            <div class="name-style bottom-style">
              {{ tableDatas.content }}
            </div>
          </div>
        </div>
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
    // 我的回复
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
          query: { comment_type: item.business_type, from: 'replay' },
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
          query: { resource_type: item.resource_type, from: 'replay' },
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
  background: var(--bg-color-3);
  .content-box-wrapper {
    width: 100%;
    padding: 0 16px;
    &:hover {
      background: var(--neutral0);
    }
  }
  .left-box {
    width: 100%;
    display: flex;
    align-items: center;

    .content-style {
      padding: 16px 0;
      width: 100%;
      .top-style {
        display: flex;
        justify-content: space-between;
      }
      .title-style {
        color: var(--primary-color);
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
      }
      .comment-style {
        font-weight: 600;
        font-size: 14px;
      }
      .name-style {
        line-height: 24px;
      }
      .bottom-style {
        background: var(--bg-color-2);
        color: var(--neutral6);

        padding: 8px 16px;
        margin-top: 4px;
      }
      .time-style {
        color: var(--neutral5);
        font-size: 12px;
      }
    }
  }
  .content-box {
    border-bottom: 1px solid var(--neutral1);
    display: flex;
    cursor: pointer;
    font-size: 14px;
  }
}
</style>
