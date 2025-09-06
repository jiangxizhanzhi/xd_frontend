<template>
  <div class="warning-log">
    <Header :level="3" title="警告日志" />
    <div class="log-table">
      <scroll-table :data="listData" :cols="colsTraffic">
        <template v-slot:date="scope">
          <div class="date-div">
            <div class="height-div">{{ scope.data.date.split(' ')[0] }}</div>
            <div class="height-div">{{ scope.data.date.split(' ')[1] }}</div>
          </div>
        </template>
        <template v-slot:level="scope">
          <span :class="getLevel(scope.data)">{{ scope.data.level }}</span>
        </template>
      </scroll-table>
    </div>
  </div>
</template>
<script>
import ScrollTable from '../../../components/scroll-table.vue';
import Header from '../../../components/header';

export default {
  components: {
    ScrollTable,
    Header,
  },
  props: {},
  data() {
    return {
      colsTraffic: [
        {
          label: '时间',
          prop: 'date',
          slot: 'date',
        },
        {
          label: '风险级别',
          prop: 'level',
          class: 'level',
          slot: 'level',
        },

        {
          label: '告警类型',
          prop: 'warnType',
        },
        {
          label: '告警名称',
          prop: 'warnName',
        },

        {
          label: '资产',
          prop: 'asset',
        },
      ],
      listData: [
        {
          warnName: '普通远控木马事件',
          date: '20210815 19:30:21',
          level: '低风险',
          warnType: '远程木马',
          asset: 'web服务器',
        },
        {
          warnName: 'AGENT远控木马事件',
          date: '20210815 19:30:21',
          level: '低风险',
          warnType: '远程木马',
          asset: 'web服务器',
        },
        {
          warnName: '普通远控木马事件',
          date: '20210815 19:30:21',
          level: '中风险',
          warnType: '远程木马',
          asset: 'web服务器',
        },
        {
          warnName: '普通远控木马事件',
          date: '20210815 19:30:21',
          level: '高风险',
          warnType: '远程木马',
          asset: 'web服务器',
        },
        {
          warnName: '普通远控木马事件',
          date: '20210815 19:30:21',
          level: '低风险',
          warnType: '远程木马',
          asset: 'web服务器',
        },
        {
          warnName: 'AGENT远控木马事件',
          date: '20210815 19:30:21',
          level: '高风险',
          warnType: '远程木马',
          asset: 'web服务器',
        },
        {
          warnName: 'AGENT远控木马事件',
          date: '20210815 19:30:21',
          level: '低风险',
          warnType: '远程木马',
          asset: 'web服务器',
        },
        {
          warnName: 'AGENT远控木马事件',
          date: '20210815 19:30:21',
          level: '低风险',
          warnType: '远程木马',
          asset: 'web服务器',
        },
        {
          warnName: '远控木马事件',
          date: '20210815 19:30:21',
          level: '低风险',
          warnType: '远程木马',
          asset: 'web服务器',
        },
        {
          warnName: 'AGENT远控木马事件',
          date: '20210815 19:30:21',
          level: '高风险',
          warnType: '远程木马',
          asset: 'web服务器',
        },
        {
          warnName: '远控木马事件',
          date: '20210815 19:30:21',
          level: '低风险',
          warnType: '远程木马',
          asset: 'web服务器',
        },
        {
          warnName: '远控木马事件',
          date: '20210815 19:30:21',
          level: '高风险',
          warnType: '远程木马',
          asset: 'web服务器',
        },
        {
          warnName: 'AGENT远控木马事件',
          date: '20210815 19:30:21',
          level: '中风险',
          warnType: '远程木马',
          asset: 'web服务器',
        },
        {
          warnName: '',
          date: '',
          level: '',
          warnType: '',
          asset: '',
        },
      ],
    };
  },
  computed: {},
  created() {},
  mounted() {
    // setTimeout(() => {
    //   this.listData = [
    //     {
    //       warnName: 'fafafa',
    //       date: '20210815 19:30:21',
    //       level: '低风险',
    //       warnType: '远程木马',
    //       asset: 'web服务器',
    //     },
    //     {
    //       warnName: 'fffff',
    //       date: '20210815 19:30:21',
    //       level: '高风险',
    //       warnType: '远程木马',
    //       asset: 'web服务器',
    //     },
    //     {
    //       warnName: 'fafafa',
    //       date: '20210815 19:30:21',
    //       level: '中风险',
    //       warnType: '远程木马',
    //       asset: 'web服务器',
    //     },
    //     {
    //       warnName: 'fffff',
    //       date: '20210815 19:30:21',
    //       level: '低风险',
    //       warnType: '远程木马',
    //       asset: 'web服务器',
    //     },
    //     {
    //       warnName: 'fafafa',
    //       date: '20210815 19:30:21',
    //       level: '高风险',
    //       warnType: '远程木马',
    //       asset: 'web服务器',
    //     },
    //     {
    //       warnName: 'fffff',
    //       date: '20210815 19:30:21',
    //       level: '低风险',
    //       warnType: '远程木马',
    //       asset: 'web服务器',
    //     },
    //   ];
    // }, 2000);
  },
  watch: {},
  methods: {
    getLevel(row) {
      const classObj = {};
      if (row.level === '高风险') {
        classObj.high = true;
      } else if (row.level === '中风险') {
        classObj.middle = true;
      } else if (row.level === '低风险') {
        classObj.low = true;
      }
      return classObj;
    },
  },
};
</script>
<style lang="scss" scoped>
.high {
  color: rgba(253, 58, 44, 1);
}
.middle {
  color: rgba(253, 118, 44, 1);
}
.low {
  color: rgba(57, 255, 178, 1);
}

.date-div {
  height: 100%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  .height-div {
    height: 50%;
    display: flex;
    align-items: center;
  }
}
</style>
