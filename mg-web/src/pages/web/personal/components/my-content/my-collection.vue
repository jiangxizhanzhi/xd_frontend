<template>
  <div class="card-thumb-wrapper">
    <div class="content-box-wrapper">
      <div class="content-box" @click="view(tableDatas)">
        <div class="left-box">
          <div class="content-style">
            <div class="name-style one-overflow title-style">
              <span class="type-style">{{ tableDatas.business_name }}</span>
              <span v-if="theoryType">【{{ theoryType }}】</span>
              <span class="content-style">{{ tableDatas.name }}</span>
            </div>
            <div class="name-style one-overflow" :title="tableDatas.content">
              {{ tableDatas.content }}
            </div>
          </div>
        </div>
        <div class="right-box">
          <div class="time-style">{{ tableDatas.create_time }}</div>
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
    collectionLists: {
      type: Array,
      default: () => [],
    },
    theoryType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    // 点击查看详情
    view(tableDatas) {
      if (tableDatas.business_type === this.collectionLists[0].value) {
        // 课程
        this.$router.push({
          path: `/oj/all-course/detail/${tableDatas.resource_id}/`,
        });
      } else if (tableDatas.business_type === this.collectionLists[1].value) {
        // 课时
        this.$router.push({
          path: `/oj/all-course/lesson/${tableDatas.resource_id}/`,
        });
      } else {
        // 实操
        this.$router.push({
          name: 'collection-exercise-details',
          params: {
            id: tableDatas.resource_id,
          },
          query: {
            practice_type: parseInt(tableDatas.business_type),
            from: 'collection',
          },
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
    width: 80%;
    display: flex;
    align-items: center;
    height: 56px;
    .content-style {
      height: 22px;
      width: 800px;
      .title-style {
        cursor: pointer;
      }
      .type-style {
        display: inline-block;
        background: var(--neutral0);
        padding: 4px 8px;
        margin-right: 8px;
      }
    }
  }
  .right-box {
    width: 20%;
    .time-style {
      float: right;
      text-align: right;
      width: 160px;
      margin-top: 16px;
      color: var(--neutral5);
      font-size: 12px;
    }
  }
  .content-box {
    border-bottom: 1px solid var(--neutral1);
    display: flex;
    height: 56px;
    font-size: 14px;
  }
}
</style>
