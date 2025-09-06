<template>
  <div class="content">
    <div class="top-content">
      <view-wraper
        :name="$t('personal.learningTime')"
        :count="parseFloat(this.duration)"
        icon="icon-lishizuijinshijian"
        size="21"
      ></view-wraper>
      <view-wraper
        :name="$t('personal.experimentalReport')"
        :count="parseInt(this.report_count)"
        icon="icon-shiyanbaogaoceshi"
        size="21"
        class="right-view-wraper"
      ></view-wraper>
    </div>
    <div class="bottom-content">
      <view-wraper
        :name="$t('personal.theoryPrac')"
        :count="parseInt(this.theory_practice_count)"
        icon="icon-fenshu"
        size="21"
      ></view-wraper>
      <view-wraper
        :name="$t('personal.operationPrac')"
        :count="parseInt(this.operation_practice_count)"
        icon="icon-zhongduanshebei"
        size="21"
        class="right-view-wraper"
      ></view-wraper>
    </div>
  </div>
</template>

<script>
import ViewWraper from './../view-wraper/index.vue';
import { getViewStudy } from '@/api/personal';
import { getLanguage } from '@cyber/helper';
export default {
  components: {
    ViewWraper,
  },
  data() {
    return {
      language: getLanguage(),
      duration: 0,
      report_count: 0,
      theory_practice_count: 0,
      operation_practice_count: 0,
    };
  },
  created() {},
  mounted() {
    this.getStudyViewData();
  },
  methods: {
    getStudyViewData() {
      getViewStudy()
        .then((res) => {
          this.studyOverview = _.get(res, 'data.data', {});
          //学习时长从分钟转换为小时，保留小数点后一位
          this.duration = Number((this.studyOverview.duration / 60).toFixed(1));
          // 实验报告
          this.report_count = this.studyOverview.report_count;
          //理论
          this.theory_practice_count = this.studyOverview.theory_practice_count;
          //实操
          this.operation_practice_count =
            this.studyOverview.operation_practice_count;
        })
        .catch(() => {});
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.content {
  margin: 0 7% 0 8%;
  margin-top: 27px;
  .top-content {
    display: flex;
    justify-content: space-around;
    margin-bottom: 48px;
  }
  .bottom-content {
    display: flex;
    justify-content: space-around;
  }
}
</style>
<style lang="scss">
.right-view-wraper {
  // width: 120px !important;
}
</style>
