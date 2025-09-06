<template>
  <div class="visual-screen-left">
    <!-- 攻击统计 -->
    <Header :level="1" title="攻击统计" />
    <div class="attack-statistics">
      <div class="attack-statistics-top flex-fill-col">
        <div class="grid-content">
          <Header :level="3" title="攻击手法" class="title" />
          <attack-echarts></attack-echarts>
        </div>
        <div class="grid-content">
          <Header :level="3" title="攻击战果" class="title" />
          <attack-echarts
            :labelColor="resultLabelColor"
            :echartsData="resultEchartsData"
            :color="resultColor"
          >
          </attack-echarts>
        </div>
        <div class="grid-content">
          <Header :level="3" title="漏洞利用" class="title" />
          <attack-echarts
            :labelColor="leakLabelColor"
            :echartsData="leakEchartsData"
            :color="leakColor"
          >
          </attack-echarts>
        </div>
      </div>
      <div class="attack-statistics-bottom flex-fill-col">
        <div class="grid-content">
          <Header :level="3" title="攻击类别" class="title" />
          <attack-type></attack-type>
        </div>
        <div class="grid-content">
          <Header :level="3" title="攻击趋势" class="title" />
          <line-echarts :chartData="trendChartData"></line-echarts>
        </div>
        <div class="grid-content">
          <Header :level="3" title="拒绝服务" class="title" />
          <line-echarts
            :chartData="refuseChartData"
            :color="refuseColor"
          ></line-echarts>
        </div>
      </div>
    </div>

    <!-- 攻防日志 -->
    <Header :level="1" title="攻防日志" />
    <div class="attack-defending-log flex-fill-col">
      <div class="grid-content">
        <Header :level="3" title="攻击日志" class="title" />
        <scroll-table class="flex-column" :data="listData" :cols="colsTraffic">
          <template v-slot:dateTime="scope">
            <div class="date-time">
              <div class="date">{{ scope.data.dateTime.split(' ')[0] }}</div>
              <div class="time">{{ scope.data.dateTime.split(' ')[1] }}</div>
            </div>
          </template>
        </scroll-table>
      </div>
      <div class="grid-content">
        <Header :level="3" title="攻击阶段" class="title" />
        <attack-stage></attack-stage>
        <div class="stage">
          <div class="stage-item" v-for="item in stateData" :key="item.id">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AttackEcharts from './components/attack-echarts.vue';
import AttackType from './components/attack-type.vue';
import LineEcharts from './components/line-echarts.vue';
import AttackStage from './components/attack-stage.vue';
import ScrollTable from './components/scroll-table.vue';
import Header from '../components/header';
export default {
  components: {
    AttackEcharts,
    AttackType,
    LineEcharts,
    AttackStage,
    ScrollTable,
    Header,
  },
  props: {},
  data() {
    return {
      trendChartData: [
        {
          name: '恶意程序',
          xData: ['19:17', '21:17', '03:17', '07:17', '11:17', '15:17'],
          yData: [120, 132, 101, 134, 98, 230, 110],
        },
        {
          name: '扫描探测',
          xData: ['19:17', '21:17', '03:17', '07:17', '11:17', '15:17'],
          yData: [220, 282, 191, 234, 290, 130, 58],
        },
        {
          name: '漏洞利用',
          xData: ['19:17', '21:17', '03:17', '07:17', '11:17', '15:17'],
          yData: [150, 232, 301, 154, 190, 330, 120],
        },
        {
          name: '其他',
          xData: ['19:17', '21:17', '03:17', '07:17', '11:17', '15:17'],
          yData: [120, 132, 201, 134, 190, 230, 100],
        },
      ],
      refuseChartData: [
        {
          name: 'UDP',
          xData: ['19:17', '21:17', '03:17', '07:17', '11:17', '15:17'],
          yData: [120, 132, 101, 134, 90, 230, 110],
        },
        {
          name: 'DNS',
          xData: ['19:17', '21:17', '03:17', '07:17', '11:17', '15:17'],
          yData: [220, 182, 191, 134, 290, 330, 58],
        },
        {
          name: 'SYN',
          xData: ['19:17', '21:17', '03:17', '07:17', '11:17', '15:17'],
          yData: [150, 232, 201, 254, 190, 330, 100],
        },
        {
          name: 'HTTP',
          xData: ['19:17', '21:17', '03:17', '07:17', '11:17', '15:17'],
          yData: [220, 132, 101, 134, 190, 130, 130],
        },
        {
          name: 'FIN',
          xData: ['19:17', '21:17', '03:17', '07:17', '11:17', '15:17'],
          yData: [280, 232, 201, 234, 290, 230, 280],
        },
        {
          name: 'ICMP',
          xData: ['19:17', '21:17', '03:17', '07:17', '11:17', '15:17'],
          yData: [120, 332, 301, 134, 390, 330, 200],
        },
      ],
      refuseColor: [
        ['#F15E5F', 'rgba(241,94,95,0)'],
        ['#62D2C1', 'rgba(98,210,193,0)'],
        ['#057DEF', 'rgba(5,125,239,0)'],
        ['#D3D147', 'rgba(211,209,71,0)'],
        ['#E59538', 'rgba(229,149,56,0)'],
        ['#6F64FB', 'rgba(111,100,251,0)'],
      ],
      resultLabelColor: ['#609BF3', '#92FCA4'],
      leakLabelColor: ['#609BF3', '#F15E5F'],
      resultEchartsData: [
        {
          value: 17,
          name: '信息收集',
        },
        {
          value: 22,
          name: '渗透',
        },
        {
          value: 15,
          name: '通用',
        },
        {
          value: 17,
          name: '控制',
        },
      ],
      resultColor: [
        ['#39EFFF', '#3AA5FF'],
        ['#85ECEB', '#3AA5FF'],
        ['#7D61DA', '#3AA5FF'],
        ['#B674F3', '#3AA5FF'],
      ],
      leakColor: [
        ['#85F0E4', '#3AA5FF'],
        ['#39EFFF', '#3AA5FF'],
        ['#85ECEB ', '#3AA5FF'],
        ['#48B7F6', '#3AA5FF'],
        ['#7D61DA', '#3AA5FF'],
        ['#B674F3', '#3AA5FF'],
      ],
      leakEchartsData: [
        {
          value: 17,
          name: '其他',
        },
        {
          value: 22,
          name: '弱密码',
        },
        {
          value: 15,
          name: 'XSS漏洞',
        },
        {
          value: 17,
          name: '跨站脚本',
        },
        {
          value: 17,
          name: '网页木马',
        },
        {
          value: 17,
          name: 'SQL注入',
        },
      ],
      listData: [
        {
          title: '应用漏洞攻击',
          date: 'HACKER',
          level: '文件服务器',
          dateTime: '20210815 19:23:50',
          IP: '100.100.300.200',
        },
        {
          title: '应用漏洞攻击',
          date: 'HACKER',
          level: '文件服务器',
          dateTime: '20210815 19:23:45',
          IP: '100.100.300.200',
        },
        {
          title: '应用漏洞攻击',
          date: 'HACKER',
          level: '文件服务器',
          dateTime: '20210815 19:23:40',
          IP: '100.100.300.200',
        },
        {
          title: '应用漏洞攻击',
          date: 'HACKER',
          level: '文件服务器',
          dateTime: '20210815 19:23:32',
          IP: '100.100.300.200',
        },
      ],
      colsTraffic: [
        {
          label: '时间',
          prop: 'dateTime',
          slot: 'dateTime',
        },
        {
          label: '来源IP',
          prop: 'IP',
        },
        {
          label: '来源用户',
          prop: 'date',
        },
        {
          label: '攻击类别',
          prop: 'title',
        },
        {
          label: '目标IP',
          prop: 'level',
        },
      ],
      stateData: [
        {
          id: 1,
          name: '侦查',
        },
        {
          id: 2,
          name: '构建',
        },
        {
          id: 3,
          name: '投放',
        },
        {
          id: 4,
          name: '利用',
        },
        {
          id: 5,
          name: '安装',
        },
        {
          id: 6,
          name: '控制',
        },
        {
          id: 7,
          name: '达成',
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped></style>
