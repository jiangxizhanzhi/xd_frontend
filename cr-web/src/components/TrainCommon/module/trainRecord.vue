<template>
  <div id="components-train-record">
    <div v-if="showTreeFile" style="width: 100%; height: 100%">
      <div v-if="missionData.length" class="tasks-tree fl elc-tree">
        <cb-scrollbar>
          <cb-tree
            class="filter-tree"
            :data="missionData"
            :default-expand-all="true"
            :expand-on-click-node="false"
            node-key="id"
            :default-expanded-keys="expandDefault"
            highlight-current
            @node-click="handleNodeClick"
          >
            <span
              slot-scope="{ node, data }"
              class="el-tree-node__label one-overflow treeSpan"
            >
              <span
                v-if="data.task_evaluate_status"
                :class="
                  data.task_evaluate_status === 2
                    ? 'red'
                    : data.task_evaluate_status === 1
                    ? 'green'
                    : ''
                "
                >[{{ data.task_evaluate_status_name }}]</span
              >
              <span
                class="black"
                :title="data.name"
                :class="thirdStatus ? 'treeSpanSecond' : ''"
              >
                {{ data.name }}
              </span>
            </span>
          </cb-tree>
        </cb-scrollbar>
      </div>
      <div v-if="missionData.length" class="task-detail fl">
        <div
          style="height: 100%; width: 100%; overflow: auto"
          class="cyber-scroll-bar"
        >
          <span class="tasks-desc-title">{{ $t('m.trainingTime') }}</span>
          <div class="task-desc">{{ trainRecordForm.time || '---' }}</div>
          <span class="tasks-desc-title">{{ $t('m.tasksDescriptions') }}</span>
          <div class="desc-task">
            {{ trainRecordForm.description || '---' }}
          </div>
          <span class="tasks-desc-title">{{ $t('m.taskRecord') }}</span>
          <div class="task-record">
            <CbMarkdown
              v-if="trainRecordForm.training_record"
              ref="taskRecordContent"
              v-model="trainRecordForm.training_record"
              type="viewer"
            />
            <!-- <empty-page v-else ref="emptyComp" /> -->
            <div v-else ref="emptyComp">---</div>
          </div>
        </div>
      </div>
      <div v-else class="fl" style="width: 100%; height: 100%">
        <empty-page ref="emptyComp" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import emptyPage from '@/pages/web/Empty';
export default {
  name: 'TrainRecord',
  components: {
    emptyPage,
  },
  props: {
    showTreeFile: {
      type: Boolean,
      default: true,
    },
    missionData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      expandDefault: [],
      checkDefault: [],
      trainRecordForm: {
        time: '',
        description: '',
        training_record: '',
      },
      taskLists: [],
      training_record_md: '',
      resource_id: '',
      thirdStatus: false,
    };
  },
  watch: {
    checkDefault: function (newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          document.querySelector(
            '.el-tree-node__children .el-tree-node__content',
          ) &&
            document
              .querySelector('.el-tree-node__children .el-tree-node__content')
              .click();
        });
      }
    },
    showTreeFile: {
      handler(val, oldval) {
        if (val !== oldval) {
          this.resource_id =
            this.$route.params && this.$route.params.resource_id;
        }
      },
      deep: true,
      immediate: true,
    },
    missionData: {
      handler(val, oldval) {
        if (val) {
          this.handleMissonData(val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  methods: {
    handleMissonData(data) {
      this.expandDefault = [];
      this.checkDefault = [];
      _.forEach(data, (item) => {
        this.$set(item, 'level', 1);
        this.$set(item, 'name', item.stage_name);
        this.$set(item, 'children', item.questions);
        this.$set(item, 'id', 'key' + item.stage_name);
        _.forEach(item.children, (list) => {
          this.$set(list, 'name', list.title);
          this.$set(list, 'level', 2);
          this.$set(list, 'state', 1);
          this.$set(list, 'id', 'key' + item.stage_name + list.title);
        });
      });
      if (data && data.length) {
        this.expandDefault.push(data[0].children[0].id);
        this.checkDefault.push(data[0].children[0].id);
        this.trainRecordForm.time = data[0].children[0].time;
        this.trainRecordForm.description = data[0].children[0].description;
        this.trainRecordForm.training_record = data[0].children[0].record;
      }
    },
    handleNodeClick(data) {
      if (data.level === 2) {
        this.thirdStatus = true;
        this.trainRecordForm.description = data.description;
        this.trainRecordForm.time = data.time;
        if (data.record) {
          this.trainRecordForm.training_record = data.record;
        } else {
          this.trainRecordForm.training_record = '';
        }
      } else {
        this.thirdStatus = false;
      }
    },
    print() {
      sessionStorage.setItem('recordData', this.training_record_md);
      const routeData = this.$router.resolve({ path: '/print' });
      window.open(routeData.href, '_blank');
    },
  },
};
</script>

<style lang="scss">
#components-train-record {
  width: 100%;
  height: 100%;
  border: 1px solid var(--neutral3);
  .font10 {
    font-size: 10px;
  }

  .el-scrollbar {
    height: 100%;
    .is-horizontal {
      .el-scrollbar__thumb {
        width: 0 !important;
      }
    }
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
    margin-right: -9px !important;
  }
  .el-scrollbar__view {
    height: 100%;
  }
  /*左侧任务树*/
  .tasks-tree {
    width: 30%;
    height: 100%;
    .el-tree-node__content {
      padding-left: 0 !important;
      .red {
        color: var(--red-color);
      }
      .green {
        color: var(--green-color);
      }
    }
  }

  /*右侧任务详情*/
  .task-detail {
    width: 67%;
    height: 100%;
    margin-left: 2%;
    border-radius: 4px;
    .tasks-desc-title {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      font-weight: 300;
      width: 100%;
      color: var(--neutral7);
    }
    .task-desc {
      margin-bottom: 24px;
      font-size: 14px;
    }
    .desc-task {
      margin-bottom: 24px;
      font-size: 14px;
      word-break: break-all;
    }
    .task-record {
      .cb-markdown .markdown-body {
        margin: 0 auto;
        padding: 0;
      }
      .v-note-wrapper {
        height: inherit;
      }
      .empty_page {
        position: absolute;
        bottom: 0;
      }
      .taskRecordContent {
        box-shadow: rgba(0, 0, 0, 0) 0 0 0 0 !important;
      }
      .markdown-body {
        color: #fff;
      }
      .v-note-wrapper {
        min-height: 100%;
        background: transparent !important;
      }
      .markdown-body table tr {
        background-color: transparent !important;
      }
      .markdown-body .highlight pre,
      .markdown-body pre {
        background-color: #0f4377 !important;
      }
      .markdown-body em {
        font-style: italic;
      }
      .el-scrollbar__bar.is-horizontal {
        left: 0 !important;
      }
      .markdown-body h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        border-bottom: 0 !important;
      }
      .op-icon.dropdown-wrapper.dropdown .popup-dropdown[data-v-548e2160] {
        background: #1c2238 !important;
        color: #ffffff;
      }
      .op-icon.dropdown-wrapper.dropdown .dropdown-item[data-v-548e2160]:hover {
        background: #35406b !important;
      }
      .v-note-wrapper .v-note-panel .v-note-show,
      .v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper {
        overflow-y: hidden !important;
      }
      .v-note-wrapper .v-note-panel .v-note-show .v-show-content,
      #components-train-record
        .task-detail
        .task-record
        .v-note-wrapper
        .v-note-panel
        .v-note-show
        .v-show-content-html {
        overflow-y: hidden !important;
        height: 100% !important;
      }
      .v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper,
      .auto-textarea-wrapper .auto-textarea-input.no-resize,
      .v-note-wrapper .v-note-panel .v-note-show .v-show-content,
      .v-note-wrapper .v-note-panel .v-note-show .v-show-content-html,
      .v-note-wrapper .v-note-op.shadow {
        background: transparent !important;
        color: white;
      }
      .v-note-wrapper .v-note-panel .v-note-show .v-show-content,
      .v-note-wrapper .v-note-panel .v-note-show .v-show-content-html {
        width: 100%;
        height: 90%;
        padding: 8px 25px 15px 15px;
        overflow-y: auto;
        box-sizing: border-box;
        overflow-x: hidden;
        background: #fbfbfb;
      }
      .v-note-wrapper .v-note-op.shadow {
        border-bottom: 1px dashed #3b4465;
      }
      .v-note-wrapper .v-note-op .v-left-item .op-icon:hover,
      .v-note-wrapper .v-note-op .v-right-item .op-icon.selected,
      .v-note-wrapper .v-note-op .v-right-item .op-icon:hover {
        background: transparent !important;
        color: #dbdfeb;
      }
    }
  }
  .allTaskRecordContent {
    width: 100%;
    height: calc(100% - 20px);
    position: relative;
    padding: 10px 20px;
    .v-note-wrapper {
      min-height: 100%;
      height: auto;
    }
    .markdown-body em {
      font-style: italic;
    }
    .markdown-body h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      border-bottom: 0 !important;
    }
    .v-note-wrapper .v-note-panel .v-note-show,
    .v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper {
      overflow-y: hidden !important;
    }
    .v-note-wrapper .v-note-panel .v-note-show .v-show-content,
    #components-train-record
      .task-detail
      .task-record
      .v-note-wrapper
      .v-note-panel
      .v-note-show
      .v-show-content-html {
      overflow-y: hidden !important;
      height: 100% !important;
    }
    .v-note-wrapper .v-note-panel .v-note-show .v-show-content,
    .v-note-wrapper .v-note-panel .v-note-show .v-show-content-html {
      width: 100%;
      height: 90%;
      padding: 8px 25px 15px 15px;
      overflow-y: auto;
      box-sizing: border-box;
      overflow-x: hidden;
    }
    .print {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 99999;
    }
  }
}
</style>
