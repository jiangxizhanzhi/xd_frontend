<template>
  <div class="step-box scroll-bar">
    <div class="box" v-for="(item, index) in taskList" :key="index">
      <div class="info">
        <!-- 任务状态 -->
        <div class="state" :class="getStateClass(item.status)">
          {{ getState(item.status) }}
        </div>
        <!-- 节点是否高亮 -->
        <div
          class="node"
          :class="item.isTime ? '' : 'node1'"
          :title="item.name"
        >
          {{ item.name }}
        </div>
        <!-- 线条是否高亮 -->
        <div class="borderLeft" :class="item.isTime ? '' : 'borderLeft1'"></div>
      </div>
      <div class="stage" :title="item.stage">
        {{ $t('m.trainStage') }}：{{ item.stage }}
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  props: {
    //任务列表数据
    taskList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    getState(state) {
      if (state == 1) {
        return this.$t('rbt.success');
      } else if (state == 2) {
        return this.$t('rbt.fail');
      } else if (state == 3) {
        return this.$t('rbt.reject');
      } else if (state == 11) {
        return this.$t('rbt.unSubmit');
      } else if (state == 0) {
        return this.$t('rbt.toEvaluate');
      }
    },
    getStateClass(state) {
      if (state == 1) {
        return 'success';
      } else if (state == 2) {
        return 'fail';
      } else if (state == 3) {
        return 'reject';
      } else if (state == 0) {
        return 'assess';
      }
      return 'other';
    },
    //根据复盘进度更新任务状态
    changeTaskStatus(time) {
      const replayTime = moment(time).valueOf();
      this.taskList.forEach((item, index) => {
        let taskTime;
        // 优先级，任务提交时间大于任务下发时间
        if (item.last_submit_time) {
          taskTime = moment(item.last_submit_time).valueOf();
        } else {
          taskTime = moment(item.create_time).valueOf();
        }
        if (taskTime <= replayTime) {
          this.$set(item, 'isTime', true);
        } else {
          this.$set(item, 'isTime', false);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.step-box {
  width: 100%;
  height: 100%;
  padding: 0px 20px;
  overflow: auto;
}
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  height: 72px;
  list-style: none;
  box-sizing: border-box;
  margin-bottom: 8px;
  padding: 0px 16px;
  background: var(--bg-color-3);
  .info {
    display: flex;
    // align-items: center;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 2;
    .state {
      height: 22px;
      font-size: 12px;
      line-height: 22px;
      padding: 0px 8px;
      text-align: center;
      flex-shrink: 0;
    }
  }
}

.borderLeft {
  width: 4px;
  height: 100%;
  background: transparent;
  position: absolute;
  top: 36px;
  bottom: 0;
  left: -12px;
  border-left: 1px var(--primary-color) dashed;
}

.borderLeft1 {
  border-left: 1px var(--neutral5) dashed;
}

.node::before {
  z-index: 1;
  content: '';
  background-color: var(--primary-color);
  width: 12px;
  height: 12px;
  color: #fff;
  position: absolute;
  border-radius: 50%;
  left: -12px;
  top: 36px;
  transform: translate(-50%, -50%);
}

.node {
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.node1::before {
  width: 12px;
  height: 12px;
  background: var(--bg-color-2);
  border: 1px solid var(--neutral5);
}

.name {
  width: 50px;
  padding: 10px 40px 20px 0;
}

.stage {
  margin-top: 4px;
  font-size: 14px;
  color: var(--neutral5);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.box:last-child .borderLeft {
  display: none;
}

.success {
  background: var(--green-color-2);
  color: var(--green-color);
}
.fail {
  background: var(--red-color-2);
  color: var(--red-color);
}
.reject {
  background: var(--orange-color-2);
  color: var(--orange-color);
}
.assess {
  background: var(--primary-color-2);
  color: var(--primary-color);
}
.other {
  background: var(--neutral0);
  color: var(--neutral8);
}
</style>
