<template>
  <cb-inner-page :background="false">
    <div class="flag-record-wrapper">
      <div class="top-filter">
        <cb-date-picker
          v-model="timeQuantum"
          type="daterange"
          align="right"
          unlink-panels
          :range-separator="$t('scene.To')"
          :start-placeholder="$t('m.starttime')"
          :end-placeholder="$t('m.endtime')"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
        >
        </cb-date-picker>
      </div>
      <div v-if="dataLists.length > 0" class="data-content">
        <div
          v-for="(item, index) in dataLists"
          :key="index"
          class="item-detail"
        >
          <div class="left-line">
            <div class="line-top"></div>
            <div class="circle"></div>
            <div class="line"></div>
          </div>
          <div class="right-info">
            <div class="time">{{ item.time }}</div>
            <div class="card-wrapper">
              <div v-for="(itm, index) in item.record_list" class="single-card">
                <FlagCard
                  :statusLists="statusLists"
                  :difficultLists="difficultLists"
                  :categoryLists="categoryLists"
                  :tableData="itm"
                  :showBtn="true"
                  @flag-click="flagClick"
                  @practice-again="practiceAgain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-box" style="height: 240px">
        <Empty />
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import { getComConstantsConfig } from '@/api/common.js';
import { getCategoryListsApi, getFlagResolvedAll } from '@/api/practice.ts';
import { TYPE } from '../constant';
import FlagCard from '../components/flag-card.vue';
import Empty from '@/components/empty/index.vue';
export default {
  name: 'FlagRecord',
  components: {
    FlagCard,
    Empty,
  },
  data() {
    return {
      TYPE,
      list: {
        startTime: '',
        endTime: '',
      },
      categoryLists: [], // 方向数据
      difficultLists: [], // 难度分类数据
      statusLists: [], // 状态数据
      timeQuantum: '',
      pickerOptions: {
        disabledDate(time) {
          // 设置禁用状态，参数为当前日期，要求返回 Boolean
          return time.getTime() > Date.now();
        },
      },
      dataLists: [],
    };
  },
  watch: {
    timeQuantum: {
      handler(nv, ov) {
        if (nv) {
          this.list.startTime = _.get(nv, '[0]', '');
          this.list.endTime = _.get(nv, '[1]', '');
        } else {
          this.list.startTime = '';
          this.list.endTime = '';
        }
        this.getFlagResolvedAllTh();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getDifficultList();
    this.getStatusList();
    this.getCategoryLists();
    this.getFlagResolvedAllTh();
  },
  mounted() {},
  methods: {
    getFlagResolvedAllTh() {
      getFlagResolvedAll({
        start_time: this.list.startTime,
        end_time: this.list.endTime,
      }).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.dataLists = data;
      });
    },
    getName(list, id, key) {
      const data = list.filter((item) => item[key] === id);
      return data.length && data[0].name;
    },
    // 列表状态计算
    statusComputed(list, id) {
      const data = list.filter((item) => item.code === Number(id));
      if (data.length) {
        return data[0].name;
      }
    },
    getCategoryLists() {
      // 分类类型 0=理论基础 2=实践操作
      getCategoryListsApi({
        practice_type: TYPE.CaptureFlag,
      }).then((res) => {
        const newData = _.get(res, 'data.data');
        this.categoryLists = newData;
      });
    },
    getDifficultList() {
      getComConstantsConfig({ type: 10 }).then((res) => {
        let arr = res.data.data;
        arr = arr.map((item) => {
          return {
            resource_id: item.code,
            name: item.name,
          };
        });
        this.difficultLists = arr;
      });
    },
    getStatusList() {
      getComConstantsConfig({ type: 11 }).then((res) => {
        let arr = res.data.data;
        arr = arr.map((item) => {
          return {
            resource_id: item.code,
            name: item.name,
          };
        });
        this.statusLists = arr;
      });
    },
    flagClick(val) {
      this.$router.push({
        path: `/practice/capture-flag/exercise-details/${val.practice_id}`,
        query: {
          from: 'record',
        },
      });
    },
    practiceAgain(val) {
      this.$router.push({
        path: `/practice/capture-flag/exercise-details/${val.practice_id}`,
        query: {
          from: 'record',
          again: 'again',
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.flag-record-wrapper {
  padding: 16px;
  background: var(--bg-color-2);
}
.data-content {
  margin-top: 16px;
  .item-detail {
    display: flex;
    .left-line {
      width: 24px;
      .line-top {
        height: 4px;
        border-left: 1px dashed var(--neutral5);
        margin-left: 5.5px;
      }
      .circle {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px solid var(--neutral5);
      }
      .line {
        border-left: 1px dashed var(--neutral5);
        height: calc(100% - 16px);
        margin-left: 5.5px;
      }
    }
    &:first-child {
      .line-top {
        height: 4px;
        border-left: 1px dashed transparent;
      }
    }
    .right-info {
      width: calc(100% - 24px);
      .time {
        color: var(--neutral8);
        line-height: 22px;
        font-size: 14px;
        margin-bottom: 8px;
      }
      .card-wrapper {
        display: flex;
        flex-wrap: wrap;
        // 1920屏幕 放6个
        .single-card {
          margin-right: 16px;
          margin-bottom: 18px;
          width: calc(16.6% - 13.5px);
          &:nth-child(5n) {
            margin-right: 16px;
          }
          &:nth-child(6n) {
            margin-right: 0;
          }
        }
        // 1440屏幕 放5个
        @media screen and (max-width: 1440px) {
          .single-card {
            width: calc(20% - 13px);
            margin-right: 16px;
            margin-bottom: 18px;
            &:nth-child(5n) {
              margin-right: 0;
            }
            &:nth-child(6n) {
              margin-right: 16px;
            }
          }
        }
      }
    }
    &:last-child {
      .line {
        display: none;
      }
    }
  }
}
</style>
<style scoped></style>
