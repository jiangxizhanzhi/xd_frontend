<template>
  <div class="taskListActing">
    <!-- <div class="title">
      <i />
      {{ $t('m.exerciseDocument') }}
    </div>-->
    <!-- <title-name :name="$t('m.exerciseDocument')" /> -->
    <div class="title-user">
      <title-director
        :square-color="'bg-color-sky-blue'"
        :name="$t('m.exerciseDocument')"
      />
    </div>
    <div class="list-acting">
      <template>
        <cb-scrollbar>
          <div class="markDownCommon taskDescription">
            <!-- <div class="taskDescription markDownCommon"> -->

            <CbMarkdown v-if="contentNew" v-model="contentNew" type="viewer" />
            <empty-page v-else />
          </div>
        </cb-scrollbar>
      </template>
    </div>
  </div>
</template>

<script>
import { getExercisePaper } from '@/api/web/task_editor.js';
import TitleDirector from '@/pages/web/RedVsBlue/Director/components/title.vue';

import EmptyPage from '@/pages/web/Empty';
export default {
  components: {
    TitleDirector,
    EmptyPage,
  },
  props: {
    parentHash: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      content: '',
      editorOption: {
        theme: 'snow',
      },
      exerciseDocument: this.$t('m.exerciseDocument'),
      centerDialogVisible: false,
      tableData: [],
      subtaskId: 'Xx时xx分xx秒：使用xx工具探测网络拓扑结构完毕（附图）',
      description: '',
      principal: '',
      taskLists: [
        { message: '任务一：侦察发现xx网络拓扑结构' },
        { message: '任务二：针对发现的安防软硬件，改进行动方案' },
        { message: '任务三：定位XX服务器，扫描服务器漏洞' },
        { message: '任务四：利用漏洞控制XX服务器' },
        { message: '任务五：清理相关痕迹' },
      ],
      parentHashNew: '',
      contentNew: '',
    };
  },
  computed: {},
  watch: {
    parentHash: {
      handler(val, oldval) {
        if (val) {
          this.parentHashNew = val;
          this.getExercisePaper();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    //学员登录获取演习文书
    getExercisePaper() {
      this.resource_id = this.$route.params && this.$route.params.resource_id;
      if (this.parentHashNew) {
        getExercisePaper(this.url, {
          resource_id: this.resource_id,
          group_hash: this.parentHashNew,
        }).then((res) => {
          this.contentNew = res.data.data.exercise_paper || '';
        });
      }
    },
    // getExercisePaper() {
    //   this.resource_id = this.$route.params && this.$route.params.resource_id;
    //   if (this.parentHashNew) {
    //     getExercisePaper(this.resource_id, {
    //       group_hash: this.parentHashNew,
    //     }).then((res) => {
    //       this.contentNew = res.data.exercise_paper || '';
    //     });
    //   }
    // },
    startBtn() {
      // this.disabled = false
    },
  },
};
</script>

<style lang="scss" scoped>
.taskListActing {
  height: 100%;
  .title-user {
    margin: 10px 0;
  }
  .taskDescription {
    width: 100%;
    height: 100%;
  }

  .ql-toolbar.ql-snow {
    border: 2px solid #3b435a !important;
  }
  .ql-container.ql-snow {
    border: 2px solid #3b435a !important;
    border-top: 0px !important;
  }
  .ql-snow .ql-stroke {
    stroke: white !important;
  }
  .ql-snow .ql-fill,
  .ql-snow .ql-stroke.ql-fill {
    fill: white !important;
  }
  .ql-snow .ql-picker {
    color: white !important;
  }

  .list-acting {
    width: auto;
    height: calc(100% - 39px);
    .el-scrollbar {
      height: 100%;
      border-radius: 0px !important;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    .el-scrollbar {
      margin-top: 0px !important;
    }
    .el-switch {
      .el-switch__core {
        border-color: #9fa7aa !important;
        width: 53px !important;
      }
    }
    .el-switch.is-checked .el-switch__core::after {
      background: #fffeff;
    }
    .el-switch .el-switch__core::after {
      background: #9fa6ac;
    }
  }
  .el-table__row {
    i {
      color: #3974f4;
    }
  }
  .el-table .cell {
    margin-left: 12% !important;
  }

  .el-table::before {
    height: 0px;
  }
  .el-table__row {
    background: #262d47 !important;
    &:nth-child(2n) {
      background: #21273f !important;
    }
  }
  .el-table .cell {
    margin-left: 18%;
    font-size: 13px;
  }
  .has-gutter {
    color: #c0c5d8;
    font-size: 14px;
  }
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table td,
  .el-table th.is-leaf {
    border: none;
  }
  .el-table__body-wrapper {
    color: #97a0bf;
    font-size: 14px;
  }
  .el-table td {
    padding: 4px 0;
  }
  .el-table .success-row {
    background: red;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #35406b !important;
    color: #fff;
  }
  .el-textarea__inner {
    background: transparent !important;
    color: #626a87;
    font-size: 13px;
  }

  .footer {
    height: 55px;
    margin: 38px 0px;

    .el-form {
      margin-top: 2px;
    }
    .el-form-item {
      margin-bottom: 5px;
      margin-right: 11px;
      label {
        color: #a8afc1;
      }
    }
    .el-form-item:nth-of-type(1n) {
      width: 58%;
    }
    .el-form-item:nth-of-type(2n) {
      width: 22%;
      float: right;
    }
    .upload-demo {
      .el-button--primary {
        /* color: #FFF; */
        background-color: transparent;
        border-color: transparent;
      }
    }
    .el-form-item__content {
      width: 100%;
    }
    .el-input__inner {
      width: 95%;
      height: 30px;
      background: #222840;
      border: 1px solid #3d4667 !important;
      color: #8a93b0;
      padding: 0 12px !important;
      font-size: 13px;
    }
    .el-input {
      margin-left: 9px;
    }
    button {
      width: 100%;
      height: 25px;
      border-radius: 5px;
      text-align: center;
      padding: 1px !important;
      border-color: #409eff;
      span {
        font-size: 13px;
      }
    }
    textarea {
      border: 1px solid #3c4566 !important;
    }
    .el-textarea {
      margin: 10px;
    }
    .el-textarea__inner {
      width: 94% !important;
    }
  }
}
</style>
