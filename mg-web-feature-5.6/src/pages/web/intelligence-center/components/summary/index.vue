<template>
  <div>
    <!--课程学习-->
    <div class="box">
      <div class="title">
        {{ index }}. {{ $t('intelligence.report.summary.title') }}
      </div>
      <div class="sub-box" v-if="data.summary_data">
        <div class="card">
          <cb-markdown v-model="data.summary_data" type="viewer"></cb-markdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card',
  components: {},
  props: {
    data: {
      type: Object,
      default: {},
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.box {
  position: relative;
  font-size: 14px;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-color);
  }
  .sub-box {
    margin-bottom: 16px;
    .card {
      margin: 8px 0;
      padding: 0 8px;
      line-height: 1.8;
      background-color: var(--neutral0);
      .header {
        position: relative;
        text-align: center;
        font-weight: 600;
        font-size: 16px;
        color: var(--green-color);
        &.suggest {
          color: var(--orange-color);
        }
        &::before,
        &::after {
          content: '';
          display: inline-block;
          width: 170px;
          height: 1px;
          background-color: var(--neutral1);
        }
        &::before {
          position: relative;
          top: -5px;
          right: 16px;
        }
        &::after {
          position: relative;
          top: -5px;
          left: 16px;
        }
      }
    }
  }
}
</style>
