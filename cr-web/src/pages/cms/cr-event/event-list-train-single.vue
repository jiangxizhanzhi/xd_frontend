<template>
  <!--  国际化已配置-->
  <cb-inner-page class="app-container" :background="true" title="单兵训练场景">
    <cb-search-table
      v-if="isAuthActive"
      ref="eventListTableRef"
      :url="url"
      rowKey="resource_id"
      :cols.sync="columns"
      :data.sync="query"
      :selection.sync="selection"
      :baseURL="baseURL"
      :searchBarBg="true"
      :show-search-btn="true"
      :queryStrKeep="['type', 'search']"
      @reset="handleReset"
    >
      <template v-slot:search>
        <cb-button button-type="add" @click="createScene"></cb-button>
        <cb-button
          hollow
          button-type="delete"
          :disabled="selection.length === 0"
          @click="deleteRow(selection, $event)"
        ></cb-button>
        <cb-button button-type="import" hollow @click="importFile">
          {{ $t('common.import') }}
        </cb-button>
        <cb-button
          hollow
          button-type="export"
          :disabled="selection.length === 0"
          loading
          @click="batchExportTh"
        >
          {{ $t('common.export') }}
        </cb-button>
        <cb-button
          hollow
          icon="icon-shouquancaozuo"
          :disabled="selection.length === 0"
          @click="batchAuth"
        >
          {{ $t('common.batchAuthSet') }}
        </cb-button>
      </template>
      <template v-slot:filter>
        <cb-search-input
          v-model="query.search"
          :placeholder="$t('crEvent.inputSceneName')"
          class="filter-item"
          style="width: 300px"
        />
      </template>
      <template v-slot:nodes_num="scope">
        <span>
          {{
            scope.data.scene_config_info &&
            scope.data.scene_config_info.node_count
          }}
        </span>
      </template>
      <template v-slot:founder="scope">
        <span>
          {{ scope.data.create_user || '' }}
        </span>
      </template>
      <template v-slot:share="scope">
        <cb-button
          type="text"
          color-type="yellow"
          v-show="
            scope.data.share === 2 && !scope.data.share_teachers.length > 0
          "
          @click="privateTh(scope.data)"
          >{{ $t('crEvent.private') }}</cb-button
        >
        <cb-button
          type="text"
          v-show="
            scope.data.share === 2 && scope.data.share_teachers.length > 0
          "
          @click="privateTh(scope.data)"
          >{{ $t('crEvent.sharedTeacher') }}({{
            scope.data.share_teachers.length
          }})</cb-button
        >
        <cb-button
          type="text"
          v-show="scope.data.share === 1"
          @click="privateTh(scope.data)"
          >{{ $t('crEvent.authorizeAll') }}</cb-button
        >
      </template>
      <template v-slot:operation="scope">
        <cb-button
          type="text"
          button-type="edit"
          @click="toEditPage(scope.data.type, scope.data.id)"
          mr
        >
        </cb-button>
        <cb-button
          :link-name="{
            name: 'scene-config-test-single',
            params: { id: scope.data.resource_id },
            query: { title: scope.data.name },
          }"
          type="text"
        >
          <template v-if="scope.data.scene_config_info.has_scene">
            <cb-iconfont class="jia-zai" type="icon-jiazai"></cb-iconfont>
            <span>{{ $t('crEvent.testing') }}</span>
          </template>
          <template v-else>
            <span>{{ $t('crEvent.test') }}</span>
          </template>
        </cb-button>
      </template>
      <!-- <template v-slot:customAuthorizationNode>
        <cb-popover
          placement="bottom"
          trigger="hover"
          width="250"
          :content="$t('crEvent.authorizationNodeTip')"
        >
          <div slot="reference">
            <span>{{ $t('crEvent.authorizationNode') }}</span>
            <cb-iconfont
              themedColor="--neutral7"
              type="icon-caozuoshuoming1"
            ></cb-iconfont>
          </div>
        </cb-popover>
      </template> -->
    </cb-search-table>
    <private-exercises-auth
      v-if="!isAuthActive"
      :authIds="authIds"
      @close="getAuthActive"
    ></private-exercises-auth>
    <import-file
      :visible.sync="importVisible"
      :action="upload_url"
      @reloadGetList="reloadGetList"
    />
  </cb-inner-page>
</template>

<script>
import ImportFile from './components/import-export/import-file';
import privateExercisesAuth from './private-exercises-batch.vue';
import { EVENT_DIFFICULT_LIST } from './constants.js';
import IndexDB from '@/utils/indexDB.js';
export default {
  name: 'EnentList',
  components: {
    ImportFile,
    privateExercisesAuth,
  },
  data() {
    const that = this;
    return {
      EVENT_DIFFICULT_LIST,
      authIds: [],
      importVisible: false,
      // url: '/admin/ce_base/cr_events/',
      // // 单兵训练列表页
      url: '/admin/ceBase/crEvents/list',
      baseURL: '/api/ojj',
      // 单兵的导入
      upload_url: '/admin/ceBase/crEvents/batchLoad',
      // 单兵type211
      query: {
        search: '',
        type: 1,
      },
      formatter: {
        type: (row) => {
          return this.$CONSTANT.DICT.EventType[row.type].toString();
        },
      },
      selection: [],
      columns: [
        {
          label: this.$t('table.name'),
          prop: 'name',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('crEvent.sceneDesc'),
          prop: 'description',
          width: 276,
          resizable: true,
        },
        {
          label: this.$t('crEvent.nodeScale'),
          slot: 'nodes_num',
          width: 100,
        },
        {
          label: this.$t('device.cpuRamDisk'),
          getData: (row) => {
            const core =
              row.scene_config_info.total_cpu + this.$t('monitorReplay.core');
            const ram = row.scene_config_info.total_ram + 'MB';
            const disk = row.scene_config_info.total_disk + 'G';
            return `${core}/${ram}/${disk}`;
          },
          width: 150,
        },
        {
          label: this.$t('crEvent.trainDifficulty'),
          getData(row) {
            const filterData = _.filter(that.EVENT_DIFFICULT_LIST, (item) => {
              return item.value === row.difficult;
            });
            return filterData.length > 0 ? filterData[0].name : '';
          },
          width: 100,
        },
        {
          label: this.$t('crEvent.founder'),
          slot: 'founder',
          width: 150,
        },
        {
          label: this.$t('crEvent.createTime'),
          prop: 'create_time',
          width: '150px',
        },
        {
          label: this.$t('common.authorizedOperation'),
          slot: 'share',
          width: 100,
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
          width: 160,
        },
      ],
      isAuthActive: true,
      cacheAllList: [], // 单兵所有缓存值
      myCacheList: [], // 本人的缓存
    };
  },
  computed: {},
  created() {
    IndexDB.dbInit('single');
  },
  async mounted() {
    this.cacheAllList = await IndexDB.dbOperation('single', 'getAll');
    if (this.cacheAllList && this.cacheAllList[0]) {
      // 如果有值，则去判断是否有本人的缓存
      this.myCacheList = _.filter(this.cacheAllList, (item) => {
        const idSplit = item.id.slice(0, 32); // 截取uesrId
        return idSplit === this.$store.state.user.id;
      });
    }
  },
  methods: {
    handleReset() {
      this.query.type = 1;
      this.query.search = '';
    },
    deleteRow(row, done) {
      const ids = row.map((i) => {
        return i.resource_id;
      });
      //删除接口
      this.$request
        .delete(
          '/admin/ceBase/crEvents',
          {
            ids: ids,
          },
          { baseURL: '/api/ojj' },
        )
        .then(() => {
          done();
          this.$refs.eventListTableRef.reload();
          this.selection = [];
        })
        .catch((error) => {
          done(false);
        });
    },
    batchExportTh(done) {
      if (this.$_.isEmpty(this.selection)) {
        return;
      }
      const arr = _.map(this.selection, (item) => {
        return item.resource_id;
      });
      const postData = {
        ids: arr,
      };

      // 导出单兵
      //方法1
      this.$request
        .binaryDownload('post', '/admin/ceBase/crEvents/batchDump', postData, {
          baseURL: '/api/ojj',
        })
        .then((res) => {})
        .finally(() => {
          done();
        });
    },
    importFile() {
      this.importVisible = true;
    },
    reloadGetList() {
      this.$refs.eventListTableRef.reload();
    },
    comGo(type, id) {
      this.$confirm(
        this.$t('crEvent.isRecoverTopoScene'),
        this.$t('common.info'),
        {
          type: 'warning',
        },
      )
        .then(() => {
          const cacheSplit = this.myCacheList[0].id.split('-');
          // 切割id，判断是新增还是编辑
          if (cacheSplit[1] === 'add') {
            this.$router.push({
              name: 'cr-event-train-single-create',
            });
          } else {
            this.$router.push({
              name: 'cr-event-train-single-edit',
              params: { id: cacheSplit[1] },
            });
          }
        })
        .catch(() => {
          IndexDB.dbOperation('single', 'delete', this.myCacheList[0].id).then(
            (res) => {
              this.myCacheList = [];
              if (type === 'add') {
                this.$router.push({
                  name: 'cr-event-train-single-create',
                });
              } else {
                this.$router.push({
                  name: 'cr-event-train-single-edit',
                  params: { id: id },
                });
              }
            },
          );
        });
    },
    createScene() {
      if (this.myCacheList && this.myCacheList[0]) {
        this.comGo('add');
      } else {
        this.$router.push({
          name: 'cr-event-train-single-create',
        });
      }
    },
    toEditPage(type, id) {
      if (type === this.$CONSTANT.EventType.TRAINING_SINGLE.value) {
        if (this.myCacheList && this.myCacheList[0]) {
          this.comGo('edit', id);
        } else {
          this.$router.push({
            name: 'cr-event-train-single-edit',
            params: { id: id },
          });
        }
      }
    },
    // 授权操作
    batchAuth() {
      const { selection } = this;
      if (selection && selection.length > 0) {
        this.authIds = selection.map((item) => item.resource_id);
        this.isAuthActive = false;
      }
    },
    getAuthActive(value) {
      this.isAuthActive = value;
      this.selection = [];
    },
    // 授权操作页
    privateTh(row) {
      this.$router.push({
        name: 'event-auth-single',
        params: {
          eventId: row.id,
          resourceId: row.resource_id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .dialogVisible {
  .el-dialog__headerbtn {
    top: 12px !important;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #ff7676 !important;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  .top[data-v-af8eade4] {
    width: auto;
  }
}
.event_button {
  margin-right: 5px;
}
.jia-zai {
  animation-name: loading;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes loading {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
::v-deep th[key^='undefined'] {
  width: 180px;
}
</style>
