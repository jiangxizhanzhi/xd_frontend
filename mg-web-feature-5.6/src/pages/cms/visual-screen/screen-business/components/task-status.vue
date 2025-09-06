<template>
  <div class="task-progress">
    <div class="progress">
      <progress-bar :percentage="80"></progress-bar>
    </div>
    <!-- <div class="statistics">
      <div>
        <div class="icon">{{ '37' }}</div>
        <div class="name">已下发</div>
      </div>
      <div>
        <div class="icon">{{ '2' }}</div>
        <div class="name">待下发</div>
      </div>
      <div>
        <div class="icon">{{ '3' }}</div>
        <div class="name">已提交</div>
      </div>
      <div>
        <div class="icon">{{ '14' }}</div>
        <div class="name">待提交</div>
      </div>
      <div>
        <div class="icon">{{ '14' }}</div>
        <div class="name">待评估</div>
      </div>
    </div> -->
  </div>
</template>

<script>
import ProgressBar from './progress-bar.vue';
export default {
  components: {
    ProgressBar,
  },
  props: {},
};
</script>

<style lang="scss" scoped>
.task-progress {
  width: 100%;
  height: 100%;
  .progress {
    margin-bottom: 12px;
    width: 100%;
    height: 100%;
  }
  .statistics {
    display: flex;
    align-items: center;
    justify-content: space-around;
    & > div {
      flex: 1;
      text-align: center;
      & > div {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .icon {
      height: 40px;
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
      background-image: url(~@/assets/img/visual-screen/screen-3/system.png);
      font-size: 16px;
      font-family: OPPOSans-H, OPPOSans !important;
      color: #fff;
    }
    .name {
      font-size: 12px;
      font-weight: 400;
      color: rgb(255, 255, 255, 0.6);
    }
  }
}
</style>
