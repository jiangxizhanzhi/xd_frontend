<template>
  <div class="event-class-table">
    <div class="radio-group">
      <cb-radio-group v-model="active">
        <cb-radio-button :label="$t('probes.documentChange')"></cb-radio-button>
        <cb-radio-button :label="$t('probes.registryEvent')"></cb-radio-button>
      </cb-radio-group>
    </div>
    <div class="search-area" v-show="active == $t('probes.documentChange')">
      <cb-search-input
        class="inputStyle"
        v-model="filePath"
        @keyup.enter.native="getFileChangeData"
        :placeholder="$t('test.enterFilePath')"
      />
    </div>
    <div v-show="active == $t('probes.documentChange')" class="file-table">
      <scroll-table
        class="flex-column"
        :data="fileTableData"
        :cols="fileTableCols"
      >
        <template v-slot:level="scope">
          <div>{{ getLevel(scope.data.level) }}</div>
        </template>
        <template v-slot:size="scope">
          <div>{{ getFileSize(scope.data.file_size) }}</div>
        </template>
      </scroll-table>
    </div>
    <div class="search-area" v-show="active == $t('probes.registryEvent')">
      <cb-search-input
        class="inputStyle"
        v-model="regName"
        @keyup.enter.native="getRegisterData"
        :placeholder="$t('test.enterRegName')"
      />
    </div>
    <div v-show="active == $t('probes.registryEvent')" class="registry-table">
      <scroll-table
        class="flex-column"
        :data="registryTableData"
        :cols="registryTableCols"
      >
        <template v-slot:level="scope">
          <div>{{ getLevel(scope.data.level) }}</div>
        </template>
      </scroll-table>
    </div>
  </div>
</template>

<script>
import ScrollTable from './scroll-table.vue';
import {
  getFileModifyTableData,
  getRegisterModifyTableData,
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
      active: this.$t('probes.documentChange'),
      timeInterval: null,
      filePath: '',
      fileTableData: [],
      regName: '',
      registryTableData: [],
      classOption: {
        step: 0.5,
        hoverStop: true,
        limitMoveNum: 1,
      },
      fileTableCols: [
        { label: this.$t('test.times'), width: 20, prop: 'time' },
        { label: this.$t('test.docName'), width: 20, prop: 'path' },
        { label: this.$t('test.action'), width: 20, prop: 'event_desc' },
        { label: this.$t('test.level'), width: 20, slot: 'level' },
        { label: this.$t('test.doc'), width: 20, slot: 'size' },
      ],
      registryTableCols: [
        { label: this.$t('test.times'), width: 16, prop: 'time' },
        { label: this.$t('test.regName'), width: 16, prop: 'path' },
        { label: this.$t('test.action'), width: 16, prop: 'event_desc' },
        { label: this.$t('test.beforeModify'), width: 16, prop: 'md5_before' },
        { label: this.$t('test.afterModify'), width: 16, prop: 'md5_after' },
        { label: this.$t('test.level'), width: 16, slot: 'level' },
      ],
    };
  },
  created() {},
  mounted() {},
  watch: {
    nodeId: {
      handler(val) {
        if (val && this.sceneId) {
          this.getFileChangeData();
          this.getRegisterData();
          clearInterval(this.timeInterval);
          this.timeInterval = setInterval(() => {
            this.getFileChangeData();
            this.getRegisterData();
          }, 1000 * 5);
        } else {
          clearInterval(this.timeInterval);
          this.fileTableData = [];
          this.registryTableData = [];
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
    //文件变更事件
    getFileChangeData() {
      if (!this.nodeId) {
        return;
      }
      const params = {
        page: 1,
        per_page: 999,
        sceneId: this.sceneId,
        elementIds: [this.nodeId],
        endTime: this.replayTime,
        path: this.filePath,
        fetchIfSceneInstanceShutdown: this.replayTime ? true : false,
      };
      getFileModifyTableData(params).then((res) => {
        const data = _.get(res, 'data.data.list', []) || [];
        this.fileTableData = data;
      });
    },
    //注册表变更事件
    getRegisterData() {
      if (!this.nodeId) {
        return;
      }
      const params = {
        page: 1,
        per_page: 999,
        sceneId: this.sceneId,
        elementIds: [this.nodeId],
        endTime: this.replayTime,
        path: this.regName,
        fetchIfSceneInstanceShutdown: this.replayTime ? true : false,
      };
      getRegisterModifyTableData(params).then((res) => {
        const data = _.get(res, 'data.data.list', []) || [];
        this.registryTableData = data;
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
.event-class-table {
  width: 100%;
  height: 100%;
  position: relative;
  .radio-group {
    margin-bottom: 8px;
  }
  .file-table {
    width: 100%;
    height: 400px;
  }
  .registry-table {
    width: 100%;
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
