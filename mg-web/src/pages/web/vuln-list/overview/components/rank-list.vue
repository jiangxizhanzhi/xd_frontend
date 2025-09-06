<template>
  <div
    class="rank-list"
    v-loading="loading"
    element-loading-background="rgba(0,0,0,.1)"
  >
    <div v-if="rankList.length > 0" class="wrapper">
      <div class="rank-item" v-for="item in rankList" :key="item.name">
        <span class="title" :title="item.name">{{ item.name }}</span>
        <cb-progress
          :percentage="Math.round(item.ratio * 100)"
          :color="progressColor"
          :bgColor="progressBgColor"
          :strokeWidth="8"
          :showText="false"
        >
          <template v-slot:line-right>
            <span class="tip-num">{{ item.num }}</span>
          </template>
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
import Empty from '@/components/empty';
import { getVulnOverviewTopTen } from '@/api/vuln';
export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: true,
      rankList: [],
      progressColor: this.$themed('primary-color'),
      progressBgColor: this.$themed('neutral0'),
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
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
      this.progressColor = this.$themed('primary-color');
      this.progressBgColor = this.$themed('neutral0');
    },
    fetchData() {
      getVulnOverviewTopTen()
        .then((res) => {
          this.rankList = _.get(res, 'data.data', []);
        })
        .finally((res) => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.rank-list {
  padding: 1vh 1vw;
  width: 100%;
  height: calc(100% - 48px);
  .wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .rank-item {
      height: 10%;
      .title {
        display: block;
        margin-bottom: 8px;
        width: 80%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 14px;
        color: var(--neutral8);
      }
      ::v-deep .cb-progress-line-slot-left {
        margin-right: 0;
      }
      ::v-deep .cb-progress-bar__outer {
        border: none;
        border-radius: 4px;
      }
      ::v-deep .cb-progress-bar__inner {
        border-radius: 4px;
      }
      .tip-num {
        line-height: 22px;
        font-size: 14px;
        color: var(--neutral8);
      }
    }
  }
  .no-data {
    width: 100%;
    height: 100%;
  }
}
</style>
