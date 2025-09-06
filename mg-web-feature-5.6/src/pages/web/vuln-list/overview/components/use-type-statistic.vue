<template>
  <div
    class="use-type-statistic"
    v-loading="loading"
    element-loading-background="rgba(0,0,0,.1)"
  >
    <div v-if="rankList.length > 0" class="wrapper">
      <div class="rank-item" v-for="item in rankList" :key="item.category">
        <div class="title">
          <span class="name"
            >{{ attackTypeOptions[item.category]
            }}{{ $t('common.colon') }}</span
          >
          <span class="num">{{ item.count }}{{ $t('vulnIndex.per') }}</span>
        </div>
        <cb-progress
          :percentage="Math.round(item.ratio * 100)"
          :color="item.color"
          :bgColor="progressBgColor"
          :strokeWidth="8"
        >
        </cb-progress>
      </div>
    </div>
    <!-- no-data -->
    <div v-else-if="!loading" class="no-data">
      <empty></empty>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { attackTypeOptions } from '@/constants/index.js';
import Empty from '@/components/empty';
import { getVulnOverviewCategory } from '@/api/vuln';
export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: true,
      rankList: [],
      rankData: [],
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      colorOptions: {
        0: this.$themed('green-color'),
        1: this.$themed('primary-color'),
        3: this.$themed('red-color'),
        4: this.$themed('orange-color'),
      },
      progressBgColor: this.$themed('neutral0'),
      // 利用类型
      attackTypeOptions,
      attackTypeList: attackTypeOptions.list,
    };
  },
  created() {
    this.listen.createListen();
    this.fetchData();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    listenFunc() {
      this.colorOptions = {
        0: this.$themed('green-color'),
        1: this.$themed('primary-color'),
        3: this.$themed('red-color'),
        4: this.$themed('orange-color'),
      };
      this.progressBgColor = this.$themed('neutral0');
      this.handleData();
    },
    fetchData() {
      getVulnOverviewCategory()
        .then((res) => {
          this.rankData = _.get(res, 'data.data', []);
          this.handleData();
        })
        .finally((res) => {
          this.loading = false;
        });
    },
    handleData() {
      if (this.rankData.length > 0) {
        this.rankData.map((item) => {
          item.color = this.colorOptions[item.category];
        });
        this.rankList = this.rankData;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.use-type-statistic {
  padding: 0 1vw 0 1vw;
  width: 100%;
  height: calc(100% - 48px);
  .wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .rank-item {
      flex: 1;
      .title {
        line-height: 2.5vh;
        font-size: 14px;
        .name {
          color: var(--neutral8);
        }
        .num {
          color: var(--neutral8);
        }
      }
      ::v-deep .cb-progress-line-slot-left {
        margin-right: 0;
      }
      ::v-deep .cb-progress-bar__outer {
        border: none;
        border-radius: 12px;
      }
      ::v-deep .cb-progress-bar__inner {
        border-radius: 12px;
      }
    }
  }
  .no-data {
    width: 100%;
    height: 100%;
  }
}
</style>
