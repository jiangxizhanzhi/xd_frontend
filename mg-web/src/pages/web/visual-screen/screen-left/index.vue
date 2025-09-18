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
              <div class="date">{{ scope.data.timestamp.split(' ')[0] }}</div>
              <div class="time">{{ scope.data.timestamp.split(' ')[1] }}</div>
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
import ScrollTable from '../components/scroll-table.vue';
import Header from '../components/header';
import dayjs from 'dayjs';
import { ref, reactive, onMounted, onUnmounted } from '@vue/composition-api';
import { redBlueTraffic, getTime } from '@/api/screen-center';
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
  setup() {
    let listData = ref([]);
    const colsTraffic = reactive([
      {
        label: '时间',
        prop: 'timestamp',
        slot: 'dateTime',
      },
      {
        label: '来源IP',
        prop: 'source_ip',
      },
      {
        label: '协议',
        prop: 'protocol_type',
      },
      {
        label: '目标IP',
        prop: 'target_ip',
      },
    ]);

    // 团队和红蓝对抗场景id和团队id会不同
    //场景id
    let senceId = '3dde20172064d97aafa0a02bd6080874';
    // team id
    let teamId = '90d8f51db9b8563a435f18c5ccd0b6fe';
    if (window.location.href.indexOf('visual-screen2') != -1) {
      // 综合演训
      senceId = '3dde20172064d97aafa0a02bd6080874';
      // team id
      teamId = '90d8f51db9b8563a435f18c5ccd0b6fe';
    }
    function getTrafficBase(preNow) {
      let now = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const query = {
        per_page: 100,
        page: 1,
        sceneId: senceId,
        start_time: preNow,
        end_time: now,
      };
      redBlueTraffic('/systemOperation/scene/pageFlowMonitor/', query)
        .then((res) => {
          listData.value = res.data.data.list;
        })
        .catch((res) => {
          // console.log('error-------------------');
        });
    }
    function getTrafficLog() {
      let preNow = dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss');
      // 战场流量 需要获取作战开始到当前时间的流量
      getTime(teamId).then((res) => {
        preNow = res.data.create_time;
        getTrafficBase(preNow);
      });
    }
    let timer = null;
    onMounted(() => {
      getTrafficLog();
      timer = setInterval(getTrafficLog, 30000);
    });
    onUnmounted(() => {
      clearInterval(timer);
    });
    return {
      listData,
      colsTraffic,
    };
  },
};
</script>
<style lang="scss" scoped></style>
