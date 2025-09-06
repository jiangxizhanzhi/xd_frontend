<template>
  <div class="warning-log">
    <Header :level="3" title="威胁信息" />
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
          label: '威胁类型',
          prop: 'threatType',
        },
        {
          label: '威胁名称',
          prop: 'threatname',
        },
        {
          label: '威胁等级',
          prop: 'level',
          class: 'level',
          slot: 'level',
        },
        {
          label: '目标主机',
          prop: 'targetHost',
        },
      ],
      listData: [
        {
          targetHost: '101.100.201.60',
          threatType: '恶意URL',
          level: '低',
          threatname: '篡改信息',
          asset: 'web服务器',
        },
        {
          targetHost: '101.100.201.50',
          threatType: '恶意程序',
          level: '低',
          threatname: '篡改信息',
          asset: 'web服务器',
        },
        {
          targetHost: '101.100.201.45',
          threatType: '恶意内容',
          level: '中',
          threatname: '篡改信息',
          asset: 'web服务器',
        },
        {
          targetHost: '101.100.201.42',
          threatType: '关联恶意软件',
          level: '高',
          threatname: '篡改信息',
          asset: 'web服务器',
        },
        {
          targetHost: '101.100.201.40',
          threatType: '网站信任',
          level: '低',
          threatname: '篡改信息',
          asset: 'web服务器',
        },
        {
          targetHost: '101.100.201.31',
          threatType: '关联恶意软件',
          level: '高',
          threatname: '篡改信息',
          asset: 'web服务器',
        },
        {
          targetHost: '101.100.201.30',
          threatType: '关联恶意软件',
          level: '低',
          threatname: '篡改信息',
          asset: 'web服务器',
        },
        {
          targetHost: '101.100.201.15',
          threatType: '网站信任',
          level: '低',
          threatname: '篡改信息',
          asset: 'web服务器',
        },
        {
          targetHost: '101.100.201.14',
          threatType: '恶意内容',
          level: '低',
          threatname: '篡改信息',
          asset: 'web服务器',
        },
        {
          targetHost: '101.100.201.11',
          threatType: '恶意内容',
          level: '高',
          threatname: '篡改信息',
          asset: 'web服务器',
        },
        {
          targetHost: '101.100.201.23',
          threatType: '恶意内容',
          level: '低',
          threatname: '篡改信息',
          asset: 'web服务器',
        },
        {
          targetHost: '101.100.201.99',
          threatType: '恶意URL',
          level: '高',
          threatname: '篡改信息',
          asset: 'web服务器',
        },
        {
          targetHost: '101.100.201.100',
          threatType: '恶意程序',
          level: '中',
          threatname: '篡改信息',
          asset: 'web服务器',
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
  color: var(--high-level-color);
}
.middle {
  color: var(--middle-level-color);
}
.low {
  color: var(--low-level-color);
}
</style>
