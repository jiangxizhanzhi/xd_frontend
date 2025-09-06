<template>
  <div class="card-thumb-wrapper">
    <div class="content-box-wrapper">
      <div class="content-box" @click="toDetail(tableDatas)">
        <div class="top-box">
          <div class="answer-style">
            <div class="empty"></div>
            <div class="answer" style="font-size: 16px">
              {{ tableDatas.reply_num }}
            </div>
            <div class="answer answer-content">{{ $t('personal.answer') }}</div>
          </div>
        </div>
        <div class="bottom-box">
          <div class="content-style">
            <div class="top-style">
              <div class="one-overflow title-style">
                {{ tableDatas.theme_name }}
              </div>
              <div class="time-style">{{ tableDatas.create_time }}</div>
            </div>
            <div class="bottom-style">
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
          query: { comment_type: item.business_type, from: 'question' },
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
          query: { resource_type: item.resource_type, from: 'question' },
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
  .content-box {
    padding: 16px 0;
    border-bottom: 1px solid var(--neutral1);
    display: flex;
    cursor: pointer;
    font-size: 14px;
    .top-box {
      margin-right: 16px;
      width: 48px;
      .answer-style {
        height: 48px;
        width: 48px;
        outline: 1px solid var(--neutral3);
        .answer {
          width: 48px;
          text-align: center;
          line-height: 20px;
          font-size: 12px;
        }
        .answer-content {
          color: var(--neutral5);
        }
        .empty {
          height: 4px;
        }
      }
    }
  }
  .bottom-box {
    width: calc(100% - 60px);
    .content-style {
      width: 100%;
      .title-style {
        color: var(--primary-color);
        font-size: 14px;
        font-weight: 600;
      }
      .time-style {
        color: var(--neutral5);
        font-size: 12px;
      }
    }
    .top-style {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
  }
}
</style>
