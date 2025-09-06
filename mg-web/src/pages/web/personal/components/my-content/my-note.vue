<template>
  <div class="card-thumb-wrapper">
    <div class="content-box-wrapper">
      <div class="content-box" @click="toDetail(tableDatas)">
        <div class="top-box">
          <div class="content-style">
            <div class="top-style">
              <div class="name-style title-style">
                <span v-if="filterType" class="type-style">
                  {{ filterType }}
                </span>
                <span v-if="theoryType" class="theory-type-style">
                  【{{ theoryType }}】
                </span>
                {{ tableDatas.theme_name }}
              </div>
              <div class="time-style">{{ tableDatas.create_time }}</div>
            </div>
          </div>
        </div>
        <div class="name-style three-overflow" :title="tableDatas.content">
          {{ tableDatas.content }}
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
    theoryType: {
      type: String,
      default: '',
    },
    filterType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    // 我的回复
    toDetail(item) {
      if (item.business_type === 1 && item.root_business_id) {
        this.$router.push({
          path: `oj/all-course/detail/${item.root_business_id}/`,
          query: { comment_type: item.business_type },
        });
      } else if (item.business_type === 2 && item.root_business_id) {
        this.$router.push({
          path: `oj/all-course/lesson/${item.root_business_id}/`,
          query: { comment_type: item.business_type },
        });
      } else if (item.business_type === 3 && item.root_business_id) {
        this.$router.push({
          path: `oj/practice/capture-flag/exercise-details/${item.root_business_id}`,
          query: { comment_type: item.business_type, from: 'note' },
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
          query: { resource_type: item.resource_type, from: 'note' },
        });
      } else if (item.resource_type === 4) {
        // 练习笔记
        this.$router.push({
          path: `oj/all-course/lesson/${item.business_id}`,
          query: { resource_type: item.resource_type },
        });
      } else if (item.resource_type === 5) {
        // 理论题笔记
        this.$router.push({
          path: `oj/practice/rationale/exercise-details/${item.business_id}`,
          query: { resource_type: item.resource_type, from: 'note' },
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
      cursor: pointer;
    }
  }
  .content-box {
    padding: 16px 0;
    border-bottom: 1px solid var(--neutral1);
    font-size: 14px;
  }
  .top-box {
    width: 100%;
    .content-style {
      width: 100%;
      margin-bottom: 8px;
      .top-style {
        display: flex;
        justify-content: space-between;
      }
      .title-style {
        color: var(--primary-color);
        font-weight: 600;
        font-size: 14px;
      }
      .name-style {
        line-height: 24px;
        .type-style {
          color: var(--neutral8);
          display: inline-block;
          background: var(--neutral0);
          padding: 0 8px;
          height: 26px;
          line-height: 26px;
          // margin-right: 8px;
          font-weight: 400;
        }
        .theory-type-style {
          // color: var(--neutral8);
          font-weight: 400;
        }
      }
      .time-style {
        color: var(--neutral5);
        font-size: 12px;
      }
    }
  }
}
</style>
