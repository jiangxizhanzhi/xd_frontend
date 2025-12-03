<template>
  <cb-inner-page
    :background="true"
    title="多维度运营"
  >
    <div class="main-outer-box">
      <div class="main-wrap">
        <div class="list-item">
          <Block
            class="block-title"
            :title="company_name1"
          > </Block>
          <div class="chart-item">
            <cb-progress
              type="circle"
              :percentage="cpu_percent1"
              :stroke-width="10"
              :color="'var(--primary-color)'"
              stroke-linecap="square"
            >
              <template v-slot:circle-text>
                <div class="percent">{{ `${cpu_percent1}%` }}</div>
                <div class="title">{{ 'CPU' }}</div>
              </template>
            </cb-progress>
          </div>
          <div class="chart-item">
            <cb-progress
              type="circle"
              :percentage="memory_percent1"
              :stroke-width="10"
              :color="'var(--primary-color)'"
              stroke-linecap="square"
            >
              <template v-slot:circle-text>
                <div class="percent">{{ `${memory_percent1}%` }}</div>
                <div class="title">{{ '内存' }}</div>
              </template>
            </cb-progress>
          </div>
          <div class="chart-item">
            <cb-progress
              type="circle"
              :percentage="file_system_percent1"
              :stroke-width="10"
              :color="'var(--primary-color)'"
              stroke-linecap="square"
            >
              <template v-slot:circle-text>
                <div class="percent">{{ `${file_system_percent1}%` }}</div>
                <div class="title">{{ '磁盘' }}</div>
              </template>
            </cb-progress>
          </div>
        </div>
        <div class="list-item">
          <Block
            class="block-title"
            :title="company_name2"
          > </Block>
          <div class="chart-item">
            <cb-progress
              type="circle"
              :percentage="cpu_percent2"
              :stroke-width="10"
              :color="'var(--primary-color)'"
              stroke-linecap="square"
            >
              <template v-slot:circle-text>
                <div class="percent">{{ `${cpu_percent2}%` }}</div>
                <div class="title">{{ 'CPU' }}</div>
              </template>
            </cb-progress>
          </div>
          <div class="chart-item">
            <cb-progress
              type="circle"
              :percentage="memory_percent2"
              :stroke-width="10"
              :color="'var(--primary-color)'"
              stroke-linecap="square"
            >
              <template v-slot:circle-text>
                <div class="percent">{{ `${memory_percent2}%` }}</div>
                <div class="title">{{ '内存' }}</div>
              </template>
            </cb-progress>
          </div>
          <div class="chart-item">
            <cb-progress
              type="circle"
              :percentage="file_system_percent2"
              :stroke-width="10"
              :color="'var(--primary-color)'"
              stroke-linecap="square"
            >
              <template v-slot:circle-text>
                <div class="percent">{{ `${file_system_percent2}%` }}</div>
                <div class="title">{{ '磁盘' }}</div>
              </template>
            </cb-progress>
          </div>
        </div>
        <div class="list-item">
          <Block
            class="block-title"
            :title="company_name3"
          > </Block>
          <div class="chart-item">
            <cb-progress
              type="circle"
              :percentage="cpu_percent3"
              :stroke-width="10"
              :color="'var(--primary-color)'"
              stroke-linecap="square"
            >
              <template v-slot:circle-text>
                <div class="percent">{{ `${cpu_percent3}%` }}</div>
                <div class="title">{{ 'CPU' }}</div>
              </template>
            </cb-progress>
          </div>
          <div class="chart-item">
            <cb-progress
              type="circle"
              :percentage="memory_percent3"
              :stroke-width="10"
              :color="'var(--primary-color)'"
              stroke-linecap="square"
            >
              <template v-slot:circle-text>
                <div class="percent">{{ `${memory_percent3}%` }}</div>
                <div class="title">{{ '内存' }}</div>
              </template>
            </cb-progress>
          </div>
          <div class="chart-item">
            <cb-progress
              type="circle"
              :percentage="file_system_percent3"
              :stroke-width="10"
              :color="'var(--primary-color)'"
              stroke-linecap="square"
            >
              <template v-slot:circle-text>
                <div class="percent">{{ `${file_system_percent3}%` }}</div>
                <div class="title">{{ '磁盘' }}</div>
              </template>
            </cb-progress>
          </div>
        </div>
      </div>
    </div>

  </cb-inner-page>
</template>

<script>
import { getPhyStatics } from "@/api/multi-dimensional-operation.js";
import Block from '@/components/block';
export default {
  name: "index",
  components: {
    Block,
  },
  props: {},
  setup(props, { emit }) {
    return {
      company_name1: "",
      company_name2: "",
      company_name3: "",
      cpu_percent1: 0,
      cpu_percent2: 0,
      cpu_percent3: 0,
      file_system_percent1: 0,
      file_system_percent2: 0,
      file_system_percent3: 0,
      memory_percent1: 0,
      memory_percent2: 0,
      memory_percent3: 0,
    }
  },
  mounted() {
    this.getPhyStatics();
  },
  methods: {
    getPhyStatics() {
      getPhyStatics().then(res => {
        const data = _.get(res, 'data.data', {})
        this.company_name1 = data.company_name1;
        this.company_name2 = data.company_name2;
        this.company_name3 = data.company_name3;
        this.cpu_percent1 = data.cpu_percent1 || 0;
        this.cpu_percent2 = data.cpu_percent2 || 0;
        this.cpu_percent3 = data.cpu_percent3 || 0;
        this.file_system_percent1 = data.file_system_percent1 || 0;
        this.file_system_percent2 = data.file_system_percent2 || 0;
        this.file_system_percent3 = data.file_system_percent3 || 0;
        this.memory_percent1 = data.memory_percent1 || 0;
        this.memory_percent2 = data.memory_percent2 || 0;
        this.memory_percent3 = data.memory_percent3 || 0;
      })
    }
  }
}
</script>

<style scoped lang="scss">
.main-outer-box {
  padding-right: 16px;
  width: 100%;
  height: 100%;

  .main-wrap {
    width: 100%;
    height: 100%;
    border: 1px solid #cccccc;
    display: flex;
    flex-direction: column;
    border-bottom: none;


    .list-item {
      flex: 1;
      display: flex;
      border-bottom: 1px solid #cccccc;
      position: relative;

      .block-title {
        position: absolute;
        left: 16px;
        top: 16px;
      }

      .chart-item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;

        .percent {
          font-size: 22px;
          color: var(--neutral8);
        }

        .title {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
