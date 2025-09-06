<template>
  <div class="course-tree elc-tree-course">
    <cb-tree
      :data="treeData"
      :default-expand-all="true"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      ><span
        class="el-tree-node__label one-overflow treeSpan"
        slot-scope="{ node, data }"
        ><template v-if="data.node_type === 0">
          <span class="tree-once-third">{{ data.name }}</span>
        </template>
        <template v-if="data.node_type === 1">
          <template v-if="data.course_type">
            <span class="tree-once-third"
              >{{
                $t('m.theFirst') + ' ' + data.type_index + ' ' + $t('m.chapter')
              }}
              {{ data.name }}</span
            >
          </template>
          <template v-else>
            <span class="tree-once-third font14"
              >{{ data.type_index }} {{ data.name }}</span
            >
          </template>
        </template>
        <template v-if="data.node_type === 2">
          <template>
            <div class="learn-progress" :style="{ '--percent': data.learn }">
              <div class="pie-left"></div>
              <div class="pie-right"></div>
            </div>
            <span
              class="tag-common tag-compulsory"
              v-if="data.compulsory === LEARN_TYPE.COMPULSORY"
              >{{ $t('m.compulsory') }}</span
            >
            <span
              class="tag-common tag-elective"
              v-else-if="data.compulsory === LEARN_TYPE.ELECTIVE"
              >{{ $t('m.elective') }}</span
            >
          </template>
          <template v-if="data.course_type">
            <span class="tree-once-third font14"
              >{{ $t('m.lesson') }} {{ data.type_index }}</span
            >
          </template>
          <template v-else>
            <span class="tree-once-third font14">{{ data.type_index }}</span>
          </template>
          <template>
            <span
              class="tree-once-third font14 span-mgL5"
              v-if="data.type === 0"
              >{{ $t('m.theoryCourse') }} - {{ data.name }}</span
            >
            <span
              class="tree-once-third font14 span-mgL5"
              v-if="data.type === 1"
              >{{ $t('m.experimentCourse') }} - {{ data.name }}</span
            >
          </template>
        </template>
      </span>
    </cb-tree>
  </div>
</template>

<script>
import { LEARN_TYPE } from '../../constant.js';
export default {
  props: {
    treeData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      LEARN_TYPE,
    };
  },
  methods: {
    handleNodeClick(data) {
      if (data.node_type === 2) {
        const resourceId = this.$route.params && this.$route.params.resource_id;
        const lessonId = data.lesson_id;
        if (this.$route.path.indexOf('all-course') != -1) {
          this.$router.push({
            path: `/all-course/lesson/${resourceId}/${lessonId}/`,
          });
        } else if (this.$route.path.indexOf('knowledge-course') != -1) {
          this.$router.push({
            path: `/knowledge-course/lesson/${resourceId}/${lessonId}/`,
          });
        } else {
          this.$router.push({
            path: `/course/lesson/${resourceId}/${lessonId}/`,
          });
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.course-tree {
  padding: 10px;
  .span-mgL5 {
    margin-left: 5px;
  }
  .font14 {
    font-size: 14px;
  }
}

.learn-progress {
  width: 14px;
  height: 14px;
  margin-left: 9px;
  vertical-align: middle;
  text-align: left;
  border-radius: 50%;
  border: 1px solid var(--primary-color);
  overflow: hidden;
  display: inline-block;
  .pie-left,
  .pie-right {
    width: 50%;
    height: 100%;
    float: left;
    position: relative;
    overflow: hidden;
  }
  .pie-left::before,
  .pie-right::before,
  .pie-right::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100% !important;
    background-color: var(--primary-color);
  }
  .pie-left::before {
    left: 100%;
    transform-origin: left;
    transform: rotate(calc(3.6deg * (var(--percent) - 50)));
    opacity: calc(99999 * (var(--percent) - 50));
  }
  .pie-right::before {
    right: 100%;
    transform-origin: right;
    transform: rotate(calc(3.6deg * var(--percent)));
  }
  .pie-right::after {
    opacity: calc(99999 * (var(--percent) - 50));
  }
}

.elc-tree-course {
  ::v-deep {
    .treeSpan {
      width: 100%;
      display: block;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }

    ::-webkit-scrollbar {
      width: 9px !important;
    }

    .el-tree {
      padding: 7px 0 10px;
    }

    .el-tree-node__content {
      padding: 2px 0;
      height: 24px;
      padding-left: 10px !important;

      .custom-tree-node {
        width: 100%;
      }
    }

    .el-tree-node__expand-icon.is-leaf {
      display: none;
    }

    .el-tree-node {
      margin-top: 0 !important;
    }

    .el-tree-node__content:hover {
      padding: 2px 0;
      height: 24px;
      border-radius: 22px;
    }

    .el-tree-node {
      position: relative;
      padding-left: 16px;
    }

    .el-tree-node__expand-icon.is-leaf {
      display: none;
    }
    .el-tree-node__children {
      padding-left: 27px;
    }

    .el-tree-node :last-child:before {
      height: 38px;
    }

    .el-tree > .el-tree-node:before {
      border-left: none;
    }

    .el-tree > .el-tree-node:after {
      border-top: none;
    }

    .el-tree-node:before {
      content: '';
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }

    .el-tree-node:after {
      content: '';
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }

    .el-tree-node:before {
      bottom: 0;
      height: 100%;
      top: -26px;
      width: 1px;
    }

    .el-tree-node:after {
      height: 20px;
      top: 12px;
      width: 35px;
    }
  }
}
</style>
<style lang="scss">
.elc-tree-course {
  .treeSpan,
  .el-tree-node__label,
  .el-tree-node__children span:last-child {
    color: var(--neutral8);
  }

  .expanded::before {
    color: var(--neutral7);
  }

  .el-tree {
    background: transparent !important;
  }

  .el-tree-node__content:hover {
    background: transparent !important;

    .tree-once-third {
      color: var(--primary-color);
    }
  }

  .el-tree-node:before {
    border-left: 1px dashed var(--neutral7);
  }
  .el-tree-node:after {
    border-top: 1px dashed var(--neutral7);
  }
}
</style>
