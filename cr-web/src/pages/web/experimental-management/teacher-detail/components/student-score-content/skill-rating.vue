<template>
  <!-- 综合演训教员学员评分页面技能评分 -->
  <div class="skill-rating">
    <block :title="$t('rbt.skillRate')"></block>
    <div class="chart-wrap">
      <cb-echart-radar
        v-if="pieLabelArr.length > 0 && ready"
        ref="rader"
        radarShape="sharp"
        :indicator="pieLabelArr"
        :radarData="radarData"
        :radarRadius="radarRadius"
        :axisName="axisName"
        :color="color"
      ></cb-echart-radar>
    </div>
  </div>
</template>

<script>
import block from '@/components/block';
import validateUtils from '@/utils/validate';
import { cutStr } from '@/utils/index.js';
import { getRadarLabelsApi } from '@/api/web/team-training';
export default {
  components: {
    block,
  },
  props: {
    // 接收学员的技能评分数据
    radarData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      color: ['primary-color'],
      // radarDatas: [10, 20, 50, 60, 0, 0, 100],
      ready: true,
      pieLabelArr: [],
      radarRadius: ['0%', '60%'],
    };
  },
  watch: {},
  computed: {
    axisName() {
      return {
        fontSize: 12,
        formatter: (text) => {
          let strlength = validateUtils.validateLength(text);
          let maxlength = 14;
          if (strlength > maxlength) {
            text = cutStr(text, maxlength) + '...';
          }
          return text;
          // 两行显示
          /* let newParamsName = '',
            paramsNameNumber = params.length, // name长度
            provideNumber = 10; // 每行能显示的字的个数
          if (paramsNameNumber > provideNumber) {
            for (let p = 0; p < 2; p++) {
              let tempStr = '',
                start = p * provideNumber,
                end = start + provideNumber;
              if (p === 1) {
                tempStr = params.substring(start, end) + '...';
              } else {
                tempStr = params.substring(start, end) + '\n';
              }
              newParamsName += tempStr;
            }
          } else {
            newParamsName = params;
          }
          return newParamsName; */
        },
      };
    },
  },
  methods: {
    // 获取雷达技能标签
    getRadarLabelsList() {
      getRadarLabelsApi().then((res) => {
        const data = _.get(res, 'data.data.labels');
        this.pieArrs = data;
        const arrs = [];
        _.forEach(data, (item, index) => {
          if (index === 0) {
            arrs.push({
              name: item,
              max: 100,
              axisLabel: {
                align: 'center',
                verticalAlign: 'top',
                show: true,
                fontSize: 10,
                color: this.$themed('neutral5'),
                showMaxLabel: true, //不显示最大值，即外圈不显示数字30
                showMinLabel: true, //显示最小数字，即中心点显示0
              },
            });
          } else {
            arrs.push({
              name: item,
              max: 100,
            });
          }
        });
        this.pieLabelArr = arrs;
      });
    },
  },
  created() {},
  mounted() {
    this.getRadarLabelsList();
  },
};
</script>
<style lang="scss" scoped>
.skill-rating {
  width: 100%;
  height: 100%;
  .chart-wrap {
    height: calc(100% - 36px);
  }
}
</style>
