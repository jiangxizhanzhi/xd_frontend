<template>
  <div class="train-manual-content">
    <div class="train-manual-content-left">
      <cb-tabs v-model="activeRole">
        <cb-tab-pane :label="$t('list.red')" name="red"> </cb-tab-pane>
        <cb-tab-pane :label="$t('list.blue')" name="blue"></cb-tab-pane>
      </cb-tabs>
      <div class="tree-wrap cyber-scroll-bar-small">
        <cb-tree
          :data="mission_stages"
          :props="defaultProps"
          :default-expand-all="true"
          :expand-on-click-node="false"
          node-key="id"
          :default-checked-keys="defaultKey"
          @node-click="handleNodeClick"
        >
          <span class="node-customized" slot-scope="{ node }">
            <span :title="node.label">{{ node.label }}</span>
          </span>
        </cb-tree>
      </div>
    </div>
    <div class="train-manual-content-right">
      <div class="markdown-wrap cyber-scroll-bar-small">
        <cb-markdown v-model="markdownData" type="viewer"></cb-markdown>
        <!-- 暂无数据 -->
        <div
          v-if="!markdownData"
          style="
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        >
          <empty-page ref="emptyComp" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import emptyPage from '@/pages/web/Empty';
import { getTrainingManual } from '@/api/web/red-blue';
export default {
  components: {
    emptyPage,
  },
  props: {},
  data() {
    return {
      activeRole: 'red',
      resource_id: this.$route.params && this.$route.params.resource_id,
      defaultProps: {
        children: 'mission_infos',
        label: 'title',
      },
      defaultKey: [],
      mission_stages: [],
      markdownData: '',
    };
  },
  watch: {
    activeRole: {
      handler(nv, ov) {
        this.getTrainManual();
      },
      immediate: true,
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
  mounted() {
    // this.getTrainManual();
  },
  methods: {
    getTrainManual() {
      const data = {
        resource_id: this.resource_id,
      };
      getTrainingManual(data).then((res) => {
        const data = _.get(res, 'data.data');
        if (data[this.activeRole].length) {
          this.mission_stages = data[this.activeRole][0].mission_stages;
        } else {
          this.mission_stages = [];
        }
        if (this.mission_stages.length) {
          this.mission_stages.forEach((item) => {
            item.title = item.stage;
          });
        }
        this.defaultKey = [this.mission_stages[0]?.mission_infos[0].id];
        this.markdownData =
          this.mission_stages[0]?.mission_infos[0].write_up || '';
      });
    },
    handleNodeClick(data) {
      this.markdownData = data.write_up;
    },
  },
};
</script>

<style lang="scss" scoped>
.train-manual-content {
  display: flex;
  background: var(--bg-color-2);
  padding: 0 16px;
  height: 100%;
  border-radius: 4px;
  &-left {
    padding: 0 16px 0 0;
    border-right: 1px solid var(--neutral1);
    max-width: 280px;
    min-width: 280px;
    .tree-wrap {
      height: calc(100% - 54px);
      overflow-y: scroll;
      .node-customized {
        font-size: 14px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  &-right {
    padding: 16px 0;
    width: 100%;
    height: 100%;
    .markdown-wrap {
      padding-left: 16px;
      height: 100%;
      overflow-y: scroll;
      position: relative;
    }
  }
}
::v-deep.cb-markdown .markdown-body {
  margin: 0 auto;
  padding: 0 0;
}
</style>
