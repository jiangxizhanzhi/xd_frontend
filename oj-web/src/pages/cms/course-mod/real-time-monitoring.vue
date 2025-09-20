<template>
  <div
    class="monitor-card-wrapper"
    v-if="realTimeData.length"
  >
    <div
      class="card"
      v-for="(item, index) in realTimeData"
      :key="index + item.user_id"
      @mouseover="mouseover(item.resource_id)"
      @mouseleave="mouseleave"
      @click="goToStudentStudyAnalysis(item)"
    >
      <div class="top-info">
        <div class="img-box">
          <img
            class="avatar"
            :src="item.user_avatar"
            alt=""
          />
        </div>
        <div class="user-txt">
          <span class="name">{{ item.name }}</span>
          <span class="time">学习时长：{{ item.time_cost }}</span>
          <div
            class="tag-wrap"
            :style="{ background: item.online ? 'var(--primary-color)' : '#a6b0c4' }"
          >
            <span class="outer-round">
              <span
                class="inner-round"
                :style="{ background: item.online ? 'var(--primary-color)' : '#a6b0c4' }"
              ></span>
            </span>
            <span class="text">{{ item.online ? '在线' : '离线' }}</span>
          </div>
        </div>
      </div>
      <div class="bottom-info">
        <cb-progress
          class="custom-progress-circle"
          type="circle"
          :percentage="item.score ? item.score : 0"
          :strokeWidth="10"
          strokeLinecap="round"
          titleTop="0"
          :width="90"
          circleTitle="综合评分"
        ></cb-progress>
        <cb-progress
          class="custom-progress-circle"
          type="circle"
          :percentage="item.process_percentage ? item.process_percentage : 0"
          :strokeWidth="10"
          strokeLinecap="round"
          titleTop="0"
          :width="90"
          circleTitle="当前进度"
        ></cb-progress>
      </div>
    </div>
  </div>
</template>

<script>
import { addRouteTab } from "@cyber/ui/src/utils";

export default {
  name: "real-time-monitoring",
  components: {},
  props: {
    realTimeData: {
      type: Array,
      // TODO 测试数据
      default: [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    return {}
  },
  data() {
    return {
      activeId: '',
      resource_id: '',
    }
  },
  methods: {
    goToStudentStudyAnalysis(data) {
      const url = this.$router.resolve({
        path: `/admin/courses/${data.user_id}/monitor`,
      });
      addRouteTab(url.route);
    },
    mouseover(id) {
      this.activeId = id;
    },
    mouseleave() {
      this.activeId = '';
    },
    editItem(data) {
      this.$emit('edit', data);
    },
    deleteItem(data) {
      this.$emit('delete', data);
    }
  }
}
</script>

<style scoped lang="scss">
.monitor-card-wrapper {
  max-height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 8px;

  .card {
    position: relative;
    flex: 0 0 calc(33% - 12px);
    height: 210px;
    background: linear-gradient(180deg,
        #E7F4FF 0%,
        #ffffff 30%,
        #ffffff 100%);
    cursor: pointer;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 16px 10px;
    border-radius: 2px;

    .avatar {
      height: 60px;
      width: 60px;
      border-radius: 50%;
    }

    .top-info {
      display: flex;

      .user-txt {
        display: flex;
        flex-direction: column;
        margin-left: 16px;
        justify-content: space-evenly;

        .name {
          font-size: 14px;
        }

        .time {
          color: var(--info-text);
          font-size: 12px;
        }
      }

    }

    .bottom-info {
      color: var(--info-text);
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding-top: 8px;

      .custom-progress-circle {
        ::v-deep .cb-progress-circle__title {
          font-size: 14px;
          color: var(--info-text);
        }
      }
    }
  }

  .tag-wrap {
    width: 64px;
    height: 24px;
    position: absolute;
    top: 16px;
    right: 0;
    background: var(--primary-color);
    border-radius: 24px 0 0 24px;
    display: flex;
    align-items: center;

    .outer-round {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: #ffffff;
      margin-left: 2px;

      .inner-round {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--primary-color);
      }
    }

    .text {
      font-size: 12px;
      color: #ffffff;
      margin-left: 2px;
    }
  }
}
</style>
