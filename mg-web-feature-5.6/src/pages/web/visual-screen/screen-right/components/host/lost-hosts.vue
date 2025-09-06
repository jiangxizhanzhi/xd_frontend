<template>
  <div class="warning-log">
    <Header :level="3" title="失陷主机列表" />
    <div class="log-table">
      <scroll-table :data="listData" :cols="colsTraffic">
        <template v-slot:level="scope">
          <span :class="getLevel(scope.data)">{{ scope.data.level }}</span>
        </template></scroll-table
      >
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
        },
        {
          label: 'IP',
          prop: 'ip',
        },
        {
          label: '归属用户',
          prop: 'targetHost',
        },
      ],
      listData: [
        {
          targetHost: 'PETER',
          date: '19:30:22',
          ip: '101:100:300:200',
        },
        {
          targetHost: 'PETER',
          date: '19:30:22',
          ip: '101:100:300:23',
        },
        {
          targetHost: 'PETER',
          date: '19:30:22',
          ip: '101:100:300:31',
        },
        {
          targetHost: 'PETER',
          date: '19:30:22',
          ip: '101:100:300:33',
        },
        {
          targetHost: 'PEtTER',
          date: '19:30:22',
          ip: '101:100:300:21',
        },
        {
          targetHost: 'PETER',
          date: '19:30:22',
          ip: '101:100:300:11',
        },
        {
          targetHost: 'PETER',
          date: '19:30:22',
          ip: '101:100:300:200',
        },
        {
          targetHost: 'PETER',
          date: '19:30:22',
          ip: '101:100:300:56',
        },
        {
          targetHost: 'PETER',
          date: '19:30:22',
          ip: '101:100:300:200',
        },
        {
          targetHost: 'PETER',
          date: '19:30:22',
          ip: '101:100:300:200',
        },
        {
          targetHost: 'PETER',
          date: '19:30:22',
          ip: '101:100:300:200',
        },
      ],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    getLevel(row) {
      const classObj = {};
      if (row.level === '高') {
        classObj.high = true;
      } else if (row.level === '中') {
        classObj.middle = true;
      } else if (row.level === '低') {
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
</style>
