<template>
  <cb-inner-page :background="true" title="通用采集管理">
    <div class="universal-probe" v-loading="loading">
      <div class="catalogue">
        <div class="infoClass">
          <p class="group">{{ $t('probes.infoClass') }}</p>
          <div
            v-for="(item, index) in infoList"
            :class="{ info: true, active: item.name === currentName }"
            :key="index"
            @click="menuSelect(item.name)"
          >
            <span>{{ item.value }}</span>
          </div>
        </div>
        <div class="eventClass">
          <p class="group">{{ $t('probes.eventClass') }}</p>
          <div
            v-for="(item, index) in eventList"
            :class="{ info: true, active: item.name === currentName }"
            :key="index"
            @click="menuSelect(item.name)"
          >
            <span>{{ item.value }}</span>
          </div>
        </div>
        <div class="logClass">
          <p class="group">{{ $t('probes.logClass') }}</p>
          <div
            v-for="(item, index) in logList"
            :class="{ info: true, active: item.name === currentName }"
            :key="index"
            @click="menuSelect(item.name)"
          >
            <span>{{ item.value }}</span>
          </div>
          <!-- 日志文件 -->
          <div
            :class="{ info: true, active: 'logFile' === currentName }"
            @click="menuSelect('logFile')"
          >
            <span>{{ $t('probes.logFile') }}</span>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="search-area">
          <cb-search-input
            v-model="search"
            :placeholder="$t('probes.inputProbeName')"
            @keyup.enter.native="getData(true)"
          ></cb-search-input>
        </div>
        <div class="table-area cyber-scroll-bar-small" ref="tableArea">
          <!-- 信息类,搜索时若无匹配数据则不展示 -->
          <div
            v-for="(item, index) in infoList"
            :key="index"
            class="table"
            :id="item.name"
            v-show="isSearch ? item.data.length !== 0 : true"
          >
            <title-left :title="item.value"></title-left>
            <cb-search-table
              :cols="cols"
              :dataSource="item.data"
              :hidePaginOnDemand="true"
              :searchBarBg="false"
            >
            </cb-search-table>
          </div>
          <!-- 事件类 -->
          <div
            v-for="item in eventList"
            :key="item.name"
            class="table"
            :id="item.name"
            v-show="isSearch ? item.data.length !== 0 : true"
          >
            <title-left :title="item.value"></title-left>
            <cb-search-table
              :cols="cols"
              :dataSource="item.data"
              :hidePaginOnDemand="true"
              :searchBarBg="false"
            >
            </cb-search-table>
          </div>
          <!-- 日志类 -->
          <div
            v-for="item in logList"
            :key="item.value"
            class="table"
            :id="item.name"
            v-show="isSearch ? item.data.length !== 0 : true"
          >
            <title-left :title="item.value"></title-left>
            <cb-search-table
              :cols="cols"
              :dataSource="item.data"
              :hidePaginOnDemand="true"
              :searchBarBg="false"
            >
            </cb-search-table>
          </div>
          <!-- 日志文件 -->
          <div class="table" id="logFile" v-show="!isSearch">
            <title-left :title="$t('probes.logFile')"></title-left>
            <p>{{ $t('probes.customAdd') }}</p>
          </div>
          <!-- 无数据 -->
          <div class="no-data" v-show="noData">
            <div class="info">
              <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
              <div>{{ $t('m.noData') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import TitleLeft from '@/components/Title/BgTitle';
export default {
  components: { TitleLeft },
  data() {
    return {
      loading: true,
      search: '',
      isSearch: false,
      //无数据
      noData: false,
      currentName: 'hardwareInfo',
      infoList: [
        {
          name: 'hardwareInfo',
          value: this.$t('probes.hardwareInfo'),
          data: [],
        },
        { name: 'systemInfo', value: this.$t('probes.systemInfo'), data: [] },
        {
          name: 'InterfaceInfo',
          value: this.$t('probes.InterfaceInfo'),
          data: [],
        },
        { name: 'portInfo', value: this.$t('probes.portInfo'), data: [] },
        { name: 'processInfo', value: this.$t('probes.processInfo'), data: [] },
      ],
      eventList: [
        {
          name: 'documentChange',
          value: this.$t('probes.documentChange'),
          data: [],
        },
        {
          name: 'operationInfo',
          value: this.$t('probes.registryEvent'),
          data: [],
        },
      ],
      logList: [
        { name: 'systemLog', value: this.$t('probes.systemLog'), data: [] },
        {
          name: 'applicationSystemLog',
          value: this.$t('probes.applicationSystemLog'),
          data: [],
        },
        {
          name: 'securitySoftwareLog',
          value: this.$t('probes.securitySoftwareLog'),
          data: [],
        },
      ],
      cols: [
        {
          label: this.$t('probes.name'),
          prop: 'name',
        },
        {
          label: this.$t('probes.applicableSystem'),
          getData: (data) => {
            //系统日志名称与适用系统相同
            if (data.probe_id == '008') {
              return data.name;
            }
            const type = ['Windows', 'Unix', 'Linux', 'BSD', 'Other'];
            const OsTypes = data.os_types;
            const types = _.map(OsTypes, (index) => type[index]);
            return types.join(', ');
          },
        },
        {
          label: this.$t('probes.analysisEngine'),
          prop: 'engine',
        },
      ],
    };
  },

  created() {},

  computed: {
    tableArea() {
      return this.$refs.tableArea;
    },
  },

  mounted() {
    this.getData();
    this.$nextTick(() => {
      //  this.tableArea.addEventListener("scroll", this.handleScroll);
    });
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    getData(serachByName) {
      this.loading = true;
      this.noData = false;
      //数据先清空
      this.infoList.forEach((item) => {
        item.data = [];
      });
      this.eventList.forEach((item) => {
        item.data = [];
      });
      this.logList.forEach((item) => {
        item.data = [];
      });
      //搜索
      if (serachByName && this.search) {
        this.isSearch = true;
        this.$request
          .get(
            `/probes/abilities/page/?page=1&per_page=999&abilityName=${this.search}`,
            null,
            {
              baseURL: '/api/mp',
            },
          )
          .then((res) => {
            const data = res.data.data.list;
            if (data.length == 0) {
              this.noData = true;
            }
            data.forEach((item, index) => {
              if (item.probe_id == '001') {
                this.infoList[0].data.push(item);
              } else if (item.probe_id == '002') {
                this.infoList[1].data.push(item);
              } else if (item.probe_id == '003') {
                this.infoList[2].data.push(item);
              } else if (item.probe_id == '004') {
                this.infoList[3].data.push(item);
              } else if (item.probe_id == '005') {
                this.infoList[4].data.push(item);
              } else if (item.probe_id == '006') {
                this.eventList[0].data.push(item);
              } else if (item.probe_id == '007') {
                this.eventList[1].data.push(item);
              } else if (item.probe_id == '008') {
                this.logList[0].data.push(item);
              } else if (item.probe_id == '009') {
                this.logList[1].data.push(item);
              } else if (item.probe_id == '010') {
                this.logList[2].data.push(item);
              } else {
              }
            });
            this.loading = false;
          })
          .catch(() => {});
      } else {
        this.isSearch = false;
        this.$request
          .get('/probes/abilities/page/?page=1&per_page=999', null, {
            baseURL: '/api/mp',
          })
          .then((res) => {
            const data = res.data.data.list;
            if (data.length == 0) {
              this.noData = true;
            }
            data.forEach((item, index) => {
              if (item.probe_id == '001') {
                this.infoList[0].data.push(item);
              } else if (item.probe_id == '002') {
                this.infoList[1].data.push(item);
              } else if (item.probe_id == '003') {
                this.infoList[2].data.push(item);
              } else if (item.probe_id == '004') {
                this.infoList[3].data.push(item);
              } else if (item.probe_id == '005') {
                this.infoList[4].data.push(item);
              } else if (item.probe_id == '006') {
                this.eventList[0].data.push(item);
              } else if (item.probe_id == '007') {
                this.eventList[1].data.push(item);
              } else if (item.probe_id == '008') {
                this.logList[0].data.push(item);
              } else if (item.probe_id == '009') {
                this.logList[1].data.push(item);
              } else if (item.probe_id == '010') {
                this.logList[2].data.push(item);
              } else {
              }
            });
            this.loading = false;
          })
          .catch(() => {});
      }
    },
    handleScroll() {
      //获取dom滚动距离
      const scrollTop = this.$refs.tableArea.scrollTop;
      //获取可视区高度
      const offsetHeight = this.$refs.tableArea.offsetHeight;
      //获取滚动条总高度
      const scrollHeight = this.$refs.tableArea.scrollHeight;

      for (let i = 0; i < this.infoList.length - 1; i++) {
        //offsetTop: 获取当前元素到其定位父级（offsetParent）的顶部距离
        let offset_before = this.$refs[`${this.infoList[i].name}`].offsetTop;
        let offset_after = this.$refs[`${this.infoList[i + 1].name}`].offsetTop;
        //判断滚动距离落在哪两个item之间
        if (scrollTop >= offset_before && scrollTop < offset_after) {
          //判断是否滚动到了底部
          if (scrollTop + offsetHeight >= scrollHeight) {
            //滚到底部时取最近的
            if (
              this.$refs[this.currentName].offsetTop >
              this.$refs[`${this.infoList[i].name}`].offsetTop
            ) {
              // this.currentName = this.infoList[i].name;
            }
          } else {
            this.currentName = this.infoList[i].name;
          }
          break;
        }
      }
    },

    menuSelect(name) {
      this.currentName = name;
      this.$nextTick(() => {
        // this.$refs[`${item.name}`].scrollIntoView({behavior:"smooth"})
        document
          .querySelector('#' + name)
          .scrollIntoView({ behavior: 'smooth' });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.universal-probe {
  display: flex;
  color: var(--neutral8);
  height: 100%;
  font-size: 14px;
  .catalogue {
    width: 15%;
    height: 100%;
    p {
      margin-top: 16px;
      margin-bottom: 16px;
    }
  }
  .content {
    width: 80%;
    height: 100%;
    border-left: 4px solid var(--bg-color-1);
    padding-left: 16px;
    .search-area {
      margin-top: 10px;
      margin-bottom: 15px;
    }
    .table-area {
      position: relative;
      height: calc(100vh - 165px);
      overflow: hidden;
      overflow-y: auto;
    }
  }
  .group {
    font-size: 16px;
    color: var(--neutral5);
  }
  .active {
    color: var(--primary-color);
  }
  .info {
    margin-bottom: 10px;
    &:hover {
      color: var(--primary-color);
    }
    span {
      cursor: pointer;
      text-decoration: none;
    }
  }
  .table {
    margin-bottom: 15px;
    background: var(--bg-color-2);
    p {
      padding-left: 30px;
      padding-bottom: 15px;
    }
  }
  .no-data {
    height: 100%;
    width: 100%;
    text-align: center;
    position: relative;
    .info {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
    }
  }
  ::v-deep .cb-search-table {
    padding: 0 16px;
  }
  ::v-deep .cb-search-table .ant-table .ant-table-tbody .cb-table-zebra {
    background: var(--bg-color-2);
  }
}
</style>

<style lang="scss"></style>
