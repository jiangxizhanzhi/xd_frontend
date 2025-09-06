<template>
  <cb-inner-page :background="false">
    <div class="range-content page">
      <cb-tabs type="border-card" v-model="activeName">
        <cb-tab-pane :label="$t('test.test')" name="测试">
          <div v-if="activeName === '测试'" class="special-tabs">
            <cb-tabs v-model="testTabActive">
              <cb-tab-pane :label="$t('test.envInfo')" name="环境信息">
                <env-info
                  v-if="testTabActive === '环境信息'"
                  @update="updateOptions"
                  :taskId="current_task_id"
                  :mpSceneId="mpSceneId"
                  @sendData="getSendData"
                />
              </cb-tab-pane>
              <cb-tab-pane :label="$t('test.hostInfo')" name="主机信息">
                <host-info
                  v-if="testTabActive === '主机信息'"
                  :sceneId="mpSceneId"
                />
              </cb-tab-pane>
              <cb-tab-pane
                :label="$t('test.hostCollectData')"
                name="主机采集数据"
              >
                <host-collect
                  v-if="testTabActive === '主机采集数据'"
                  :sceneId="mpSceneId"
                />
              </cb-tab-pane>
              <cb-tab-pane
                :label="$t('test.flowCollectData')"
                name="流量采集数据"
              >
                <flow-collect
                  v-if="testTabActive === '流量采集数据'"
                  :sceneId="mpSceneId"
                />
              </cb-tab-pane>
              <cb-tab-pane :label="$t('test.vulnInfo')" name="漏洞信息">
                <loop-info
                  v-if="testTabActive === '漏洞信息'"
                  :scene-id="mpSceneId"
                />
              </cb-tab-pane>
            </cb-tabs>
            <div class="jump-button">
              <cb-button
                icon="icon-changjingguanli"
                type="primary"
                hollow
                @click="goSceneMonitoring()"
                :disabled="isShow"
                >{{ $t('test.sceneMonitor') }}</cb-button
              >
              <cb-button
                icon="icon-tuopu"
                type="primary"
                hollow
                @click="goThreePosture()"
                >{{ $t('test.situation') }}
              </cb-button>
            </div>
          </div>
        </cb-tab-pane>
        <!-- 评估 -->
        <cb-tab-pane :label="$t('assessment.assess')" name="评估">
          <div v-if="task_ids" class="assess-content">
            <assess-list
              :task_ids="task_ids"
              v-if="activeName === '评估'"
            ></assess-list>
            <!-- ref="assessListRef" -->
          </div>
          <div v-else class="no-data">
            <div class="info">
              <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
              <div>{{ $t('monitorReplay.noData') }}</div>
            </div>
          </div>
        </cb-tab-pane>
        <cb-tab-pane :label="$t('monitorReplay.monitorReplay')" name="复盘回放">
          <div class="display-content" v-if="mpSceneId">
            <reply v-if="activeName === '复盘回放'" :sceneId="mpSceneId" />
          </div>
          <div v-else class="no-data">
            <div class="info">
              <cb-iconfont type="icon-zanwuziyuan" size="56"></cb-iconfont>
              <div>{{ $t('monitorReplay.noData') }}</div>
            </div>
          </div>
        </cb-tab-pane>
      </cb-tabs>
      <div class="select-scene">
        <span
          v-if="activeName === '测试'"
          class="scene-manger"
          @click="deleteScene"
          >{{ $t('test.instanceManage') }}</span
        >
        <cb-select
          v-if="activeName === '测试'"
          v-model="taskId"
          :options="options"
          titleField="task_name"
          valueField="task_id"
          @change="taskChange"
        >
        </cb-select>
        <!-- //评估的task_ids=========== -->
        <cb-select
          v-else-if="activeName === '评估'"
          v-model="task_ids"
          :options="options"
          titleField="task_name"
          valueField="task_id"
          :placeholder="$t('assessment.selectInstance')"
        >
        </cb-select>
        <cb-select
          v-else
          v-model="mpSceneId"
          :options="options"
          titleField="task_name"
          valueField="mp_scene_id"
          :placeholder="$t('assessment.selectInstance')"
        >
        </cb-select>
      </div>
      <cb-dialog
        :title="$t('test.instanceManage')"
        :visible.sync="showDeleteDialog"
        width="640px"
      >
        <cb-search-table
          :cols="sceneColumns"
          :dataSource="options"
          :hidePaginOnDemand="true"
          :searchBarBg="false"
        >
          <template v-slot:operation="scope">
            <cb-button
              :disabled="scope.data.task_id == null"
              type="text"
              colorType="red"
              mr
              @click="handleDelete(scope.data, $event)"
            >
              {{ $t('common.delete') }}</cb-button
            >
          </template>
        </cb-search-table>
      </cb-dialog>
    </div>
  </cb-inner-page>
</template>

<script>
import { setBreadcrumbTitle } from '@cyber/ui';
import EnvInfo from './test/env-info.vue';
import HostInfo from './test/host-info.vue';
import HostCollect from './test/host-collect.vue';
import FlowCollect from './test/flow-collect.vue';
import LoopInfo from './test/loophole-info.vue';
import AssessList from './assess/assess-list.vue'; //评估
import Reply from './reply/index.vue'; //评估
import { templateList } from '@/api/web/range-test';
import _ from 'lodash';
export default {
  components: {
    EnvInfo,
    HostInfo,
    HostCollect,
    FlowCollect,
    LoopInfo,
    AssessList,
    Reply,
  },
  name: '',
  data() {
    return {
      breadcrumbName: '',
      isShow: true,
      sendMessage: {},
      testTabActive: '环境信息',
      // activeName: '评估',
      activeName: this.$route.query.activeName
        ? this.$route.query.activeName
        : '测试',
      options: [],
      template_id: this.$route.params.templateId,
      taskId: '',
      mpSceneId: '',
      task_ids: '', //task_id
      current_task_id: '',
      currentTestId: '', //记录当前测试实例
      currentOption: '', //记录当前选项
      showDeleteDialog: false,
      sceneColumns: [
        {
          label: this.$t('test.instanceName'),
          prop: 'task_name',
        },
        {
          label: this.$t('test.operation'),
          width: 60,
          slot: 'operation',
        },
      ],
    };
  },
  watch: {
    activeName() {
      this.getTemplte();
    },
    testTabActive() {
      this.getTemplte();
    },
    task_ids: {
      handler(newData, oldData) {
        this.task_ids = newData;
      },
    },
  },
  mounted() {
    this.getTemplte(true);
  },
  created() {
    setBreadcrumbTitle(this.breadcrumbName);
  },
  methods: {
    //获取跳转3D的数据
    getSendData(msg, hasLayer) {
      this.sendMessage = msg;
      this.breadcrumbName = msg.template_name;
      setBreadcrumbTitle(this.breadcrumbName);
    },
    // 跳转场景监控
    goSceneMonitoring() {
      const path = `/page/mg/admin/system-operation/instance-monitoring/monitor-display/${this.sendMessage.mp_scene_id}?hiddenTab=true`;
      window.open(`${path}`, '_blank');
    },
    //跳转3D态势
    goThreePosture() {
      const path = '/page/mg/admin/screen-3/visual-screen';
      if (this.sendMessage.topo_id) {
        window.open(
          `${path}?name=${this.sendMessage.template_name}&room_id=${this.sendMessage.template_id}&topo_id=${this.sendMessage.topo_id}`,
          '_blank',
        );
      } else if (this.sendMessage.mp_scene_id) {
        window.open(
          `${path}?name=${this.sendMessage.template_name}&room_id=${this.sendMessage.template_id}&scene_id=${this.sendMessage.mp_scene_id}`,
          '_blank',
        );
      }
    },

    getTemplte(bool) {
      this.options = [];
      this.task_ids = '';
      this.mpSceneId = '';
      this.taskId = '';
      this.current_task_id = '';
      const data = {
        template_id: this.template_id,
        is_finished: false,
      };
      if (this.activeName === '测试') {
        data.is_finished = false;
      } else {
        data.is_finished = true;
      }
      templateList(data).then((res) => {
        const list = _.get(res, 'data.data.task_list');
        this.current_task_id = _.get(res, 'data.data.current_task_id');
        this.currentTestId = _.get(res, 'data.data.current_task_id');
        this.options = list;
        this.mpSceneId = (list.length && list[0].mp_scene_id) || '';

        //页面初始化加载，操作当前场景(启动关闭等操作)以及删除实例等操作后默认展示当前测试实例
        if (bool) {
          const fistData = list.filter((item) => {
            return item.task_id === this.current_task_id;
          });
          this.taskId = fistData && fistData[0]?.task_id;
          if (this.activeName === '测试') {
            this.mpSceneId = fistData && fistData[0].mp_scene_id;
          }
          //除了当前测试实例需要根据场景是否启动判断，其余实例都不能跳转场景监控
          if (this.taskId) {
            this.isShow = false;
          } else {
            this.isShow = true;
          }
        } else {
          if (this.currentOption) {
            this.taskId = this.currentOption;
            this.current_task_id = this.currentOption;
          } else {
            this.taskId = this.current_task_id;
          }
          const fistData = list.filter((item) => {
            return item.task_id === this.taskId;
          });
          if (this.activeName === '测试') {
            this.mpSceneId = fistData && fistData[0].mp_scene_id;
          }
        }

        if (this.$route.query.task_id) {
          this.task_ids = this.$route.query.task_id;
        } else {
          this.task_ids = (list.length && list[0].task_id) || '';
        }
        // this.task_ids = (list.length && list[0].task_id) || ''; //task_id
        // this.$refs.assessListRef.task_ids = list && list[0].task_id;
      });
    },
    taskChange(value) {
      //除了当前测试实例需要根据场景是否启动判断，其余实例都不能跳转场景监控
      if (this.currentTestId == value) {
        const currentTestExample = this.options.filter((item) => {
          return item.task_id === this.currentTestId;
        });
        if (currentTestExample[0].task_id) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      } else {
        this.isShow = true;
      }
      this.current_task_id = value;
      this.currentOption = value;
      const fistData = this.options.filter((item) => {
        return item.task_id === this.current_task_id;
      });
      this.mpSceneId = fistData && fistData[0]?.mp_scene_id;
    },
    updateOptions() {
      this.currentOption = '';
      this.getTemplte(true);
    },
    deleteScene() {
      this.showDeleteDialog = true;
    },
    handleDelete(data, done) {
      this.$confirm(this.$t('test.deleteInstance')).then(() => {
        const ids = [];
        ids.push(data.task_id);
        this.$request
          .delete(
            '/cr/eval/task',
            {
              task_ids: ids,
            },
            {
              baseURL: '/api/ojj',
            },
          )
          .then(() => {
            done();
            this.showDeleteDialog = false;
            this.currentOption = '';
            this.getTemplte(true);
          })
          .catch(() => {
            done(false);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.range-content {
  overflow-x: hidden;
  .cb-tabs {
    height: 100%;
  }
  ::v-deep.el-tabs {
    height: 100%;
    .el-tabs__content {
      margin-top: 1px;
      height: calc(100% - 40px);
      background: var(--bg-color-2) !important;
      padding: 15px !important;
    }
    .el-tab-pane {
      height: 100%;
    }
    .el-tabs__item {
      min-width: 100px;
      text-align: center;
    }
  }
  .assess-content {
    height: 100%;
    position: relative;
    background: var(--bg-color-2);
  }
  .special-tabs {
    height: 100%;
    position: relative;
    ::v-deep.el-tabs {
      height: 100%;
      .el-tabs__header {
        background: transparent;
      }
      .el-tabs__content {
        height: calc(100% - 48px);
        padding: 0px !important;
      }
      .el-tab-pane {
        height: 100%;
      }
      .el-tabs__item {
        background: transparent !important;
        height: 48px;
        line-height: 48px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
    }
  }
  .jump-button {
    position: absolute;
    top: 6px;
    right: 16px;
  }
  .display-content {
    background-size: cover;
    height: 100%;
    width: 100%;
    min-height: 900px;
  }
  .no-data {
    height: 100%;
    width: 100%;
    min-height: 750px;
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
  .scene-manger {
    font-size: 14px;
    margin-right: 20px;
    color: var(--primary-color);
    cursor: pointer;
  }
  .select-scene {
    position: absolute;
    top: 0px;
    right: 0;
    .cb-select {
      ::v-deep.el-select {
        .el-input__inner {
          height: 34px;
        }
      }
      ::v-deep.el-input__suffix {
        i {
          line-height: 10px;
        }
      }
    }
  }
}
</style>
