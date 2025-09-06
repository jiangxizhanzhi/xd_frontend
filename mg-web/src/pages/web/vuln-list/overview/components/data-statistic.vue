<template>
  <div class="data-statistic">
    <div class="statistic-item" v-for="item in statisticList" :key="item.key">
      <span class="num">{{ item.num }}</span>
      <span class="name">{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { getVulnOverviewInfo } from '@/api/vuln';

export default {
  data() {
    return {
      statisticList: [
        {
          key: 'env',
          name: this.$t('common.reproduceEnvironment'),
          num: 0,
        },
        {
          key: 'poc',
          name: 'POC',
          num: 0,
        },
        {
          key: 'exp',
          name: 'EXP',
          num: 0,
        },
        {
          key: 'paper',
          name: 'Paper',
          num: 0,
        },
        {
          key: 'vendor',
          name: this.$t('vulnIndex.affectManufacturer'),
          num: 0,
        },
        {
          key: 'product',
          name: this.$t('vulnIndex.affectProduct'),
          num: 0,
        },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getVulnOverviewInfo().then((res) => {
        let data = _.get(res, 'data.data', null);
        if (!_.isEmpty(data)) {
          for (let key in data) {
            this.statisticList.forEach((item) => {
              if (item.key === key) {
                item.num = data[key];
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.data-statistic {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: calc(100% - 48px);
  .statistic-item {
    width: calc(100% / 3);
    display: flex;
    flex-direction: column;
    align-items: center;
    .num {
      text-align: center;
      line-height: 3vh;
      font-size: 20px;
      color: var(--neutral8);
    }
    .name {
      text-align: center;
      line-height: 2.5vh;
      font-size: 14px;
      color: var(--neutral8);
    }
  }
}
</style>
