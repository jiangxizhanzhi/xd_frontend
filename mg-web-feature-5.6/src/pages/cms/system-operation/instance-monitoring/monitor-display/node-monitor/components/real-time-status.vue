<template>
  <div class="real-status">
    <div class="tabs-wrapper">
      <span
        v-for="(item, index) in list"
        :key="JSON.stringify(item.name + index)"
        @click="handleClickTitle(index)"
        :class="['item ft14', { active: current === index }]"
        >{{ item.name }}
      </span>
    </div>
    <div class="get-event-wrap node-monitor-div">
      <div v-if="current === 0">
        <cb-carousel
          :interval="5000"
          :initial-index="0"
          arrow="never"
          indicator-position="none"
        >
          <cb-carousel-item v-for="(item, index) in groupDataList" :key="index">
            <scroll-table
              class="calculate-div-中"
              :data="item"
              :cols="colsTraffic"
              :isScroll="false"
            >
              <template v-slot:pid="scope">
                <div>
                  <span>{{ scope.data.pid || '-' }}</span>
                </div>
              </template>
            </scroll-table>
          </cb-carousel-item>
        </cb-carousel>
      </div>
      <div v-else-if="current === 1">
        <cb-carousel
          :interval="5000"
          :initial-index="0"
          arrow="never"
          indicator-position="none"
        >
          <cb-carousel-item v-for="(item, index) in groupData1" :key="index">
            <scroll-table
              class="calculate-div-中"
              :data="item"
              :cols="colsTraffic1"
              :isScroll="false"
            >
              <template v-slot:pid="scope">
                <div>
                  <span>{{ scope.data.pid || '-' }}</span>
                </div>
              </template>
              <template v-slot:port="scope">
                <div>
                  <span>{{ scope.data.local.port || '-' }}</span>
                </div>
              </template>
            </scroll-table>
          </cb-carousel-item>
        </cb-carousel>
      </div>
      <div v-else-if="current === 2">
        <cb-carousel
          :interval="5000"
          :initial-index="0"
          arrow="never"
          indicator-position="none"
        >
          <cb-carousel-item v-for="(item, index) in groupData2" :key="index">
            <scroll-table
              class="calculate-div-中"
              :data="item"
              :cols="colsTraffic2"
              :isScroll="false"
            />
          </cb-carousel-item>
        </cb-carousel>
      </div>
    </div>
  </div>
</template>
<script>
import ScrollTable from '../../components/scroll-table.vue';

function group(array, subGroupLength) {
  let index = 0;
  const newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)));
  }
  return newArray;
}
export default {
  components: {
    ScrollTable,
  },
  props: {
    realProgressList: {
      type: Array,
      default: () => [],
    },
    realHostList: {
      type: Array,
      default: () => [],
    },
    realConnectionList: {
      type: Array,
      default: () => [],
    },
  },
  name: 'realTimeStatus',
  data() {
    return {
      list: [
        { name: this.$t('systemOperation.nodeMonitoring.process'), index: 0 },
        { name: this.$t('systemOperation.nodeMonitoring.port'), index: 1 },
        {
          name: this.$t('systemOperation.nodeMonitoring.networkConnection'),
          index: 2,
        },
      ],
      current: 0,
      listData: this.realProgressList,
      listData1: this.realHostList,
      listData2: this.realConnectionList,
      colsTraffic: [
        {
          label: this.$t('systemOperation.nodeMonitoring.PID'),
          slot: 'pid',
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.memoryUsage'),
          prop: 'size',
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.command'),
          prop: 'cmd',
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.state'),
          prop: 'state',
        },
        {
          label: this.$t('systemOperation.nodeMonitoring.creatTime'),
          prop: 'start_time',
        },
      ],

      colsTraffic1: [
        {
          label: this.$t('systemOperation.nodeMonitoring.PID'),
          slot: 'pid',
        },
        {
          label: this.$t('systemOperation.realEquipmentManagement.portNumber'),
          slot: 'port',
        },
        {
          label: this.$t('systemManagement.system.protocol'),
          prop: 'protocol',
        },
      ],
      colsTraffic2: [
        {
          label: this.$t('systemManagement.system.protocol'),
          prop: 'protocol',
        },
        {
          label: this.$t('systemOperation.scene.localAddress'),
          prop: 'local_address',
        },
        {
          label: this.$t('systemOperation.scene.remoteAddress'),
          prop: 'foreign_address',
        },
        {
          label: this.$t('systemOperation.scene.status'),
          prop: 'state',
        },
      ],
    };
  },
  computed: {
    groupDataList() {
      if (this.realProgressList) {
        return group(this.realProgressList, 5);
      }
      return [];
    },
    groupData1() {
      if (this.realHostList) {
        return group(this.realHostList, 5);
      }
      return [];
    },
    groupData2() {
      if (this.realConnectionList) {
        return group(this.realConnectionList, 5);
      }
      return [];
    },
  },
  created() {},
  methods: {
    handleClickTitle(index) {
      // console.log(typeof index, index);
      this.current = index;
    },
  },
};
</script>
<style scoped lang="scss" scoped>
.item {
  color: #fefeff;
  &.active {
    background-color: var(--primary-color);
    color: #242c3b;
  }
}

.tabs-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 50%;
  max-width: 70%;
  margin: 0px auto 1% auto;
  background: rgba(255, 255, 255, 0.1);
  z-index: 10;
  position: relative;
  // border: 1px solid red;
  .item {
    flex: 1;
    text-align: center;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
  }
}
.real-status {
  padding: 10px 0px;
}
</style>
