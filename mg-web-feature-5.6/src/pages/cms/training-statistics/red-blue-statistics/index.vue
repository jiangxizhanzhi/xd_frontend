<template>
  <cb-inner-page :background="false">
    <div class="wrapper-boxs">
      <div class="top-boxs">
        <div class="com-box">
          <div class="th-title">
            <title-name :name="$t('trainStatistics.personRankTop5')" />
          </div>
          <div class="th-echart">
            <bar-chart
              v-if="personTopArr.length !== 0"
              :barColor="'primary-color'"
              :dataList="personTopArr"
              :yName="$t('trainStatistics.theCumulativeScore')"
            />
            <div v-else class="center">
              <no-data></no-data>
            </div>
          </div>
        </div>
        <div class="com-box">
          <div class="th-title">
            <title-name :name="$t('trainStatistics.orgRankTop5')" />
          </div>
          <div class="th-echart">
            <bar-chart
              v-if="orgTopArr.length !== 0"
              :barColor="'green-color'"
              :dataList="orgTopArr"
              :yName="$t('trainStatistics.theAverageScore')"
            />
            <div v-else class="center">
              <no-data></no-data>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-boxs">
        <div class="th-title">
          <title-name :name="$t('trainStatistics.statistics')" />
        </div>
        <div class="table-boxs">
          <cb-search-table
            ref="sdlRefb"
            url="cr/admin/red_vs_blue_statistics/detail"
            baseURL="/api/ojj"
            :cols.sync="columns"
            :data="query"
            row-key="resource_id"
            :background="true"
            :searchBarBg="false"
          >
            <template v-slot:search>
              <cb-cascader
                class="mr20"
                v-model="organizationValue"
                :placeholder="$t('notice.validator.selectOrganization')"
                :options="options"
                @change="handleOrganizationChange"
                :props="optionProps"
                :clearable="true"
              ></cb-cascader>
              <cb-date-picker
                v-model="statisTime"
                type="daterange"
                align="right"
                unlink-panels
                :range-separator="$t('dashboard.to')"
                :start-placeholder="$t('dashboard.startTime')"
                :end-placeholder="$t('dashboard.endTime')"
                value-format="yyyy-MM-dd"
              >
              </cb-date-picker>
              <cb-search-input
                v-model="query.pattern"
                :placeholder="$t('trainStatistics.plzSelectName')"
                style="width: 300px"
              ></cb-search-input>
            </template>
          </cb-search-table>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import TitleName from '../components/title.vue';
import BarChart from '../components/bar-chart.vue';
import NoData from '../components/no-data.vue';
import { getOrgData } from '@/api/user.js';
import {
  getRedBluePersonTop5,
  getRedBlueOrgTop5,
} from '@/api/training-statistics.ts';
import ListenDomChange from '@cyber/ui/src/utils/listen-dom';
export default {
  components: {
    TitleName,
    BarChart,
    NoData,
  },
  props: {},
  data() {
    return {
      personTopArr: [],
      orgTopArr: [],
      options: [], //cascader数据源
      organizationValue: [], //保存级联选择器数据
      columns: [],
      query: {
        pattern: '',
        organization: '',
        startTime: '',
        endTime: '',
      },
      optionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'children',
      },
      statisTime: '',
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
    };
  },
  watch: {
    statisTime: {
      handler(nv, ov) {
        if (nv) {
          this.query.startTime = _.get(nv, '[0]', '');
          this.query.endTime = _.get(nv, '[1]', '');
        } else {
          this.query.startTime = '';
          this.query.endTime = '';
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  methods: {
    listenFunc() {},
    //获取个人排名TOP5数据
    getPersonTopList() {
      getRedBluePersonTop5().then((res) => {
        const data = _.get(res, 'data.data');
        _.forEach(data, (item) => {
          this.$set(item, 'name', item.name);
          this.$set(item, 'value', item.total_score);
        });
        this.personTopArr = data;
      });
    },
    //获取组织排名TOP5数据
    getOrgTopList() {
      getRedBlueOrgTop5().then((res) => {
        const data = _.get(res, 'data.data');
        _.forEach(data, (item) => {
          this.$set(item, 'name', item.org_name);
          this.$set(item, 'value', item.average_score);
        });
        this.orgTopArr = data;
      });
    },
    //获取组织架构的 Tree 结构，并做处理
    getOrganization() {
      getOrgData().then((res) => {
        this.options = _.get(res, 'data.data', []);
      });
    },
    //级联选择器选中数据之后改变请求参数发起请求
    handleOrganizationChange(val) {
      const { length } = val;
      this.query.organization = val[length - 1];
    },
  },
  created() {
    this.getOrganization();
    this.columns = [
      {
        label: this.$t('dashboard.username'),
        prop: 'username',
        width: 200,
        resizable: true,
      },
      {
        label: this.$t('dashboard.name'),
        prop: 'name',
        width: 200,
        resizable: true,
      },
      {
        label: this.$t('dashboard.organization'),
        prop: 'organization_data',
        width: 200,
        resizable: true,
      },
      {
        label: this.$t('systemManagement.userManage.role'),
        getData: (row) => {
          const { roles } = row;
          const list = [];
          roles.forEach((item) => {
            list.push(item.name);
          });
          return list.join('/');
        },
        prop: 'role',
        width: 200,
        resizable: true,
      },
      {
        label: this.$t('trainStatistics.redBlueTrainCount'),
        prop: 'train_times',
      },
      {
        label: this.$t('trainStatistics.submitRedBlueTaskCount'),
        prop: 'task_num',
      },
      {
        label: this.$t('trainStatistics.redBlueTaskRight'),
        getData(row) {
          const taskAccuracy =
            Math.round(row.task_accuracy * 100 * 1000) / 1000;
          return taskAccuracy + '%';
        },
      },
      {
        label: this.$t('trainStatistics.theCumulativeScore'),
        prop: 'total_score',
      },
      {
        label: this.$t('trainStatistics.comprehensiveRanking'),
        prop: 'overall_rank',
        width: '180px',
      },
    ];
  },
  mounted() {
    this.getPersonTopList();
    this.getOrgTopList();
    this.listenFunc();
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
};
</script>
<style lang="scss" scoped>
.time-range {
  color: var(--neutral8);
  font-size: 14px;
  margin-left: 10px;
}
.wrapper-boxs {
  width: 100%;

  .top-boxs,
  .bottom-boxs {
    width: 100%;
    box-sizing: border-box;
  }
  .top-boxs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .com-box,
  .bottom-boxs {
    background-color: var(--bg-color-2);
  }
  .com-box {
    width: calc(50% - 8px);
    height: 340px;
    .th-title {
      width: 100%;
      box-sizing: border-box;
      color: var(--neutral8);
      font-size: 14px;
    }
    .th-echart {
      height: 285px;
    }
    .center {
      height: 285px;
      position: relative;
      z-index: 3;
      text-align: center;
      color: var(--neutral6);
    }
  }

  .com-span {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: flex-start;
    // flex-direction: row;
    // flex-wrap: nowrap;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: var(--neutral7);
    padding: 0 5px;
    flex-basis: auto;
  }
}
.bottom-boxs {
  .table-boxs {
    padding: 0 16px;
  }
}
</style>
