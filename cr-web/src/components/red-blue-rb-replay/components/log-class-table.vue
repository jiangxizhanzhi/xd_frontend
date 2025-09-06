<template>
  <div class="log-class-table">
    <div class="radio-group">
      <cb-radio-group v-model="active">
        <cb-radio-button
          :label="$t('common.operatingSystemLogs')"
        ></cb-radio-button>
        <cb-radio-button
          :label="$t('common.applicationSystemLogs')"
        ></cb-radio-button>
        <cb-radio-button
          :label="$t('common.securitySoftLog')"
        ></cb-radio-button>
        <cb-radio-button :label="$t('common.originalLog')"></cb-radio-button>
      </cb-radio-group>
    </div>
    <!-- 操作系统日志 -->
    <div
      class="search-area"
      v-show="active == $t('common.operatingSystemLogs')"
    >
      <cb-search-input
        class="inputStyle"
        v-model="osRule"
        @keyup.enter.native="getOsTableData"
        :placeholder="$t('test.enterRuleDesc')"
      />
    </div>
    <div v-show="active == $t('common.operatingSystemLogs')" class="os-table">
      <scroll-table class="flex-column" :data="osTableData" :cols="logCols">
        <template v-slot:level="scope">
          <div>{{ getLevel(scope.data.level) }}</div>
        </template>
      </scroll-table>
    </div>
    <!-- 应用系统日志 -->
    <div
      class="search-area"
      v-show="active == $t('common.applicationSystemLogs')"
    >
      <cb-search-input
        class="inputStyle"
        v-model="appRule"
        @keyup.enter.native="getApplyTableData"
        :placeholder="$t('test.enterRuleDesc')"
      />
    </div>
    <div
      v-show="active == $t('common.applicationSystemLogs')"
      class="apply-table"
    >
      <scroll-table class="flex-column" :data="applyTableData" :cols="logCols">
        <template v-slot:level="scope">
          <div>{{ getLevel(scope.data.level) }}</div>
        </template>
      </scroll-table>
    </div>
    <!-- 安全软件日志 -->
    <div class="search-area" v-show="active == $t('common.securitySoftLog')">
      <cb-search-input
        class="inputStyle"
        v-model="securityRule"
        @keyup.enter.native="getSafeTableData"
        :placeholder="$t('test.enterRuleDesc')"
      />
    </div>
    <div v-show="active == $t('common.securitySoftLog')" class="safe-table">
      <scroll-table class="flex-column" :data="safeTableData" :cols="logCols">
        <template v-slot:level="scope">
          <div>{{ getLevel(scope.data.level) }}</div>
        </template>
      </scroll-table>
    </div>
    <div v-show="active == $t('common.originalLog')" class="original-table">
      <scroll-table
        class="flex-column"
        :data="originalTableData"
        :cols="originalLogCols"
      >
        <template v-slot:size="scope">
          <div>{{ getFileSize(scope.data.size) }}</div>
        </template>
      </scroll-table>
    </div>
  </div>
</template>

<script>
import ScrollTable from './scroll-table.vue';
import {
  getLogALLCatagories,
  getLogTableData,
  getOriginLogTableData,
} from '@/api/web/replay';
export default {
  props: {
    //场景id
    sceneId: {
      type: String,
      default: () => {
        return '';
      },
    },
    //节点id
    nodeId: {
      type: String,
      default: () => {
        return '';
      },
    },
    //复盘时间
    replayTime: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  components: {
    ScrollTable,
  },
  data() {
    return {
      active: this.$t('common.operatingSystemLogs'),
      timeInterval: null,
      //操作系统日志
      osRule: '',
      osTableData: [],
      osCategories: [],
      //应用系统日志
      appRule: '',
      applyTableData: [],
      applyCategories: [],
      //安全软件日志
      securityRule: '',
      safeTableData: [],
      safeCategories: [],
      //原始日志
      originalTableData: [],
      classOption: {
        step: 0.5,
        hoverStop: true,
        limitMoveNum: 1,
      },

      logCols: [
        { label: this.$t('test.times'), width: 20, prop: 'time' },
        { label: this.$t('test.applyName'), width: 15, prop: 'app_name' },
        { label: this.$t('test.eventName'), width: 25, prop: 'event_desc' },
        { label: this.$t('test.level'), width: 15, slot: 'level' },
        { label: this.$t('test.rule'), width: 20, prop: 'description' },
      ],
      originalLogCols: [
        { label: this.$t('test.times'), width: 33, prop: 'create_time' },
        { label: this.$t('test.docName'), width: 33, prop: 'path' },
        { label: this.$t('test.fileSize'), width: 33, slot: 'size' },
      ],
    };
  },
  created() {},
  mounted() {},
  watch: {
    nodeId: {
      handler(val) {
        if (val && this.sceneId) {
          this.getCatagories();
          this.getOriginalTableData();
          clearInterval(this.timeInterval);
          this.timeInterval = setInterval(() => {
            this.getCatagories();
            this.getOriginalTableData();
          }, 1000 * 5);
        } else {
          clearInterval(this.timeInterval);
          this.osTableData = [];
          this.applyTableData = [];
          this.safeTableData = [];
          this.originalTableData = [];
        }
      },
      immediate: true,
      deep: true,
    },
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
  methods: {
    //获取操作系统日志、应用系统日志、安全软件日志的catagories
    getCatagories() {
      this.osCategories = [];
      this.applyCategories = [];
      this.safeCategories = [];
      getLogALLCatagories().then((res) => {
        const data = _.get(res, 'data.data', []) || [];
        let logCategories;
        data.forEach((item) => {
          if (item.code == '02') {
            logCategories = item;
          }
        });
        logCategories.children.forEach((item) => {
          if (item.code == '0201') {
            item.children.forEach((obj) => {
              this.osCategories.push(obj.code);
            });
          }
          if (item.code == '0202') {
            item.children.forEach((obj) => {
              this.applyCategories.push(obj.code);
            });
          }
          if (item.code == '0203') {
            item.children.forEach((obj) => {
              this.safeCategories.push(obj.code);
            });
          }
        });
        this.getOsTableData();
        this.getApplyTableData();
        this.getSafeTableData();
      });
    },
    //获取操作系统日志
    getOsTableData() {
      if (!this.nodeId) {
        return;
      }
      const params = {
        page: 1,
        per_page: 999,
        id: this.sceneId,
        nodeIds: [this.nodeId],
        catagories: this.osCategories,
        endTime: this.replayTime,
        keyword: this.osRule,
        fetchIfSceneInstanceShutdown: this.replayTime ? true : false,
      };
      getLogTableData(params).then((res) => {
        const data = _.get(res, 'data.data.list', []) || [];
        this.osTableData = data;
      });
    },
    //获取应用系统日志
    getApplyTableData() {
      if (!this.nodeId) {
        return;
      }
      const params = {
        page: 1,
        per_page: 999,
        id: this.sceneId,
        nodeIds: [this.nodeId],
        catagories: this.applyCategories,
        endTime: this.replayTime,
        keyword: this.appRule,
        fetchIfSceneInstanceShutdown: this.replayTime ? true : false,
      };
      getLogTableData(params).then((res) => {
        const data = _.get(res, 'data.data.list', []) || [];
        this.applyTableData = data;
      });
    },
    //获取安全软件日志
    getSafeTableData() {
      if (!this.nodeId) {
        return;
      }
      const params = {
        page: 1,
        per_page: 999,
        id: this.sceneId,
        nodeIds: [this.nodeId],
        catagories: this.safeCategories,
        endTime: this.replayTime,
        keyword: this.securityRule,
        fetchIfSceneInstanceShutdown: this.replayTime ? true : false,
      };
      getLogTableData(params).then((res) => {
        const data = _.get(res, 'data.data.list', []) || [];
        this.safeTableData = data;
      });
    },
    //获取原始日志
    getOriginalTableData() {
      const params = {
        page: 1,
        per_page: 999,
        sceneId: this.sceneId,
        elementIds: [this.nodeId],
        endTime: this.replayTime,
        fetchIfSceneInstanceShutdown: this.replayTime ? true : false,
      };
      getOriginLogTableData(params).then((res) => {
        const data = _.get(res, 'data.data.list', []) || [];
        this.originalTableData = data;
      });
    },
    getLevel(value) {
      if (value >= 0 && value <= 4) {
        return this.$t('test.low');
      } else if (value >= 5 && value <= 9) {
        return this.$t('test.middle');
      } else if (value >= 10) {
        return this.$t('test.high');
      } else {
        return '-';
      }
    },
    getFileSize(size) {
      if (size === null || size === '' || size === undefined) {
        return '-';
      }
      //把字节转换成正常文件大小
      var num = 1024.0; //byte
      if (size < num) {
        return size + 'B';
      } else if (size < Math.pow(num, 2)) {
        return (size / num).toFixed(2) + 'KB'; //KB
      } else if (size < Math.pow(num, 3)) {
        return (size / Math.pow(num, 2)).toFixed(2) + 'M'; //M
      } else if (size < Math.pow(num, 4)) {
        return (size / Math.pow(num, 3)).toFixed(2) + 'G'; //G
      } else {
        return (size / Math.pow(num, 4)).toFixed(2) + 'T'; //T
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.log-class-table {
  width: 100%;
  height: 100%;
  .radio-group {
    margin-bottom: 8px;
  }
  .os-table {
    height: 400px;
  }
  .apply-table {
    height: 400px;
  }
  .safe-table {
    height: 400px;
  }
  .original-table {
    height: 400px;
  }
  .search-area {
    position: absolute;
    top: 0px;
    right: 0px;
    .inputStyle {
      width: 250px;
    }
  }
}
</style>
