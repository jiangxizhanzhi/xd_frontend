<template>
  <div id="components-train-record">
    <div style="width: 100%; height: 100%">
      <div
        v-if="taskLists.length"
        class="tasks-tree fl elc-tree cyber-scroll-bar-small"
      >
        <cb-tree
          :data="taskLists"
          :default-expand-all="true"
          :expand-on-click-node="false"
          highlight-current
          @node-click="handleNodeClick"
          :default-checked-keys="defaultKey"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node one-overflow treeSpan"
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
      </div>
      <div
        v-if="taskLists.length"
        class="task-detail fl cyber-scroll-bar"
        style="overflow: auto"
      >
        <block :title="$t('m.tasksDescriptions')"></block>
        <div class="task-desc">{{ trainRecordForm.desc }}</div>
        <block :title="$t('m.taskRecord')"></block>
        <div class="task-record">
          <CbMarkdown
            v-if="trainRecordForm.training_record"
            v-model="trainRecordForm.training_record"
            type="viewer"
            class="taskRecordContent"
          />
          <empty-page v-else ref="emptyComp" />
        </div>
      </div>
      <empty-page v-if="!taskLists.length" ref="emptyComp" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import block from '@/components/block';
import emptyPage from '@/pages/web/Empty';
export default {
  name: 'TrainRecord',
  components: {
    emptyPage,
    block,
  },
  props: {
    taskLists: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      pattern: /<\/?[a-zA-Z]+(\s+[a-zA-Z]+=".*")*>/g,
      trainRecordForm: {
        desc: '',
        training_record: '',
      },
      thirdStatus: false,
      defaultKey: [],
    };
  },
  watch: {
    taskLists: {
      handler: function (val, oldval) {
        if (val !== oldval) {
          if (!_.isEmpty(val)) {
            this.defaultKey = [val[0]?.missions[0]?.resource_id];
          }
        }
      },
      immediate: true, // 关键
      deep: true,
    },
    defaultKey(newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (
            document.querySelector(
              '.el-tree-node__children .el-tree-node__content',
            )
          ) {
            document
              .querySelector('.el-tree-node__children .el-tree-node__content')
              .click();
          }
        });
      }
    },
  },
  created() {},
  methods: {
    handleNodeClick(data) {
      if (data.level === 2) {
        this.thirdStatus = true;
        this.trainRecordForm.desc = data.description;
        if (data.training_record && data.training_record.record) {
          this.trainRecordForm.training_record = data.training_record.record;
        } else {
          this.trainRecordForm.training_record = '';
        }
      } else {
        this.thirdStatus = false;
      }
    },
  },
};
</script>

<style lang="scss">
#components-train-record {
  width: 100%;
  height: 100%;
  .font10 {
    font-size: 10px;
  }

  /*左侧任务树*/
  .tasks-tree {
    width: 30%;
    height: 500px;
    overflow: auto;
    // padding-right: 1%;
  }
  /*右侧任务详情*/
  .task-detail {
    width: 67%;
    height: 500px;
    border-radius: 4px;
    margin-left: 2%;
    padding: 16px 0;
    .task-desc {
      min-height: 60px;
      padding-left: 16px;
      font-size: 14px;
    }
    .task-record {
      margin: 10px 0 0 7px;
      .empty_page {
        top: 100px;
        position: relative;
      }
      .taskRecordContent {
        box-shadow: rgba(0, 0, 0, 0) 0 0 0 0 !important;
        .v-note-panel {
          p {
            color: var(--neutral8);
          }
        }
      }
      .markdown-body {
        color: #fff;
        padding: 0;
        padding-left: 8px;
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
}
</style>
