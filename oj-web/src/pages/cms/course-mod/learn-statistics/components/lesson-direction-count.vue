<template>
  <div class="info-content">
    <div class="user-title">{{ $t('m.statisticsOfCoursesTaken') }}</div>
    <div class="none" v-if="lessonData.length <= 0">
      {{ $t('componentServerEdit.noData') }}
    </div>
    <cb-scrollbar>
      <div class="user fl">
        <div
          class="info-item"
          v-for="(item, index) in lessonData"
          :key="index + item.name"
        >
          <label class="one-overflow fl" :title="item.name"
            >{{ item.name }}：</label
          >
          <div class="progress fl">
            <cb-progress
              :percentage="(item.finish_count / item.count) * 100"
              :format="format"
            ></cb-progress>
          </div>
          <span class="tag fl basic-color"
            >{{ item.finish_count }}{{ $t('m.pc') }}</span
          >
        </div>
      </div>
    </cb-scrollbar>
  </div>
</template>
<script>
// import _ from 'lodash'
import Http from '@/utils/http.js';
export default {
  data() {
    return {
      lessonData: [],
      isHundredPer: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.resource_id = this.$route.params.userId;
    this.getDirectionCount();
  },
  methods: {
    getDirectionCount() {
      Http.getAxios(
        '/admin/course/courses/learn_direction_statistics/?user=' +
          this.resource_id,
      )
        .then((res) => {
          this.lessonData = res.data;
        })
        .catch(() => {});
    },
    format(percentage) {
      if (percentage === 100) {
        this.isHundredPer = true;
      } else {
        this.isHundredPer = false;
      }
      return '';
    },
  },
};
</script>
<style scoped lang="scss">
.info-content {
  width: 100%;
  height: 100%;
  padding: 15px;
  position: relative;
  .user-title {
    font-size: 16px;
    font-weight: 400;
    color: var(--font-color-primary);
    margin-bottom: 20px;
  }
  .none {
    text-align: center;
    color: var(--font-color-regular);
    font-size: 14px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .cb-scrollbar {
    height: calc(100% - 40px) !important;
  }
  .el-scrollbar__bar.is-horizontal {
    height: 0 !important;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-scrollbar__view {
    height: calc(100% - 40px) !important;
    .user {
      width: 100%;
      height: 80%;
      .info-item {
        width: 100%;
        height: 33px;
        display: flex;
        align-items: center;
        label {
          width: 100px;
          font-size: 14px;
          color: var(--font-color-primary);
        }
        .progress {
          width: calc(100% - 160px);
          ::v-deep .cb-progress .el-progress--line .el-progress__text {
            float: right !important;
          }
          ::v-deep .cb-progress .el-progress--line .el-progress-bar {
            margin-left: 0;
            padding-left: 0;
          }
        }
        .tag {
          margin-left: 10px;
          width: 50px;
        }
        .basic-color {
          color: var(--font-color-primary);
          font-size: 14px;
        }
        .green-color {
          color: var(--green-color);
        }
      }
    }
  }
}
</style>
