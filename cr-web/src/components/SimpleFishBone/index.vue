<template>
  <div class="simple-fish-bone-canvas cyber-scroll-bar">
    <div
      class="simple-fish-bone"
      :class="[{ readonly }, themeLabel]"
      @click="reset"
      @keydown="keydown"
      tabindex="0"
    >
      <slot>
        <div class="fishbone-header" v-if="!readonly">
          <div>
            <cb-button
              v-if="isPlan"
              class="select-btn"
              hollow
              @click="getCombatTech"
              >{{ $t('combatTech.selectExistingEntry') }}</cb-button
            >
            <layout-selector v-model="template" />
            <cb-select v-model="color" :options="themes" />
          </div>
          <div class="tips" :class="language === 'en-US' ? 'tips-flex' : ''">
            {{ $t('crEvent.oprateTip') }}
          </div>
        </div>
      </slot>
      <div class="canvas" :style="canvasSize">
        <div class="canvas-inner">
          <div
            class="group"
            v-for="(node, nodeIndex) in computedNodes"
            :key="node.uniqueId"
          >
            <div
              class="cell"
              v-for="n in node.top"
              :key="node.id + '-' + n"
            ></div>
            <template v-if="node.directionUp">
              <div
                class="cell leaf"
                v-for="(leaf, leafIndex) in node.templates"
                :key="leaf.uniqueId"
                :class="{
                  done: leaf.isDone,
                  selected:
                    selected.nodeIndex === nodeIndex &&
                    selected.leafIndex === leafIndex,
                  finish: leaf.resource_id,
                }"
              >
                <fish-bone-node
                  :node="leaf"
                  @change="change($event, nodeIndex, leafIndex)"
                  @remove="remove(nodeIndex, leafIndex)"
                  @select="select(nodeIndex, leafIndex)"
                  @answer="$emit('answer', leaf)"
                  @edit="editLeaf(leaf)"
                />
                <div class="finish-icon" v-if="leaf.resource_id">
                  <cb-iconfont
                    type="icon-gou"
                    class="gou-icon"
                    size="20"
                  ></cb-iconfont>
                </div>
              </div>
              <div
                class="cell node"
                :class="{
                  done:
                    node.templates.length > 0 &&
                    node.templates.length === node.done,
                  selected:
                    selected.nodeIndex === nodeIndex && selected.leafIndex < 0,
                }"
              >
                <cb-iconfont
                  class="icon-add"
                  v-if="!readonly"
                  type="icon-xinzeng"
                  :size="20"
                  @click="addNode(nodeIndex)"
                />
                <fish-bone-node
                  :node="node"
                  @change="change($event, nodeIndex)"
                  @remove="remove(nodeIndex)"
                  @add-leaf="addLeaf(nodeIndex)"
                  @select="select(nodeIndex)"
                  @edit="nodeFormVisibleShow"
                />
                <template v-if="readonly && node.done > 0">
                  <span
                    class="progress"
                    v-if="node.done < node.templates.length"
                    >{{ node.done }}/{{ node.templates.length }}</span
                  >
                  <cb-iconfont class="icon-done" v-else type="icon-gou" />
                </template>
              </div>
            </template>
            <template v-else>
              <div
                class="cell node"
                :class="{
                  done:
                    node.templates.length > 0 &&
                    node.templates.length === node.done,
                  selected:
                    selected.nodeIndex === nodeIndex && selected.leafIndex < 0,
                }"
              >
                <cb-iconfont
                  class="icon-add"
                  v-if="!readonly"
                  type="icon-xinzeng"
                  :size="20"
                  @click="addNode(nodeIndex)"
                />
                <fish-bone-node
                  :node="node"
                  @change="change($event, nodeIndex)"
                  @remove="remove(nodeIndex)"
                  @add-leaf="addLeaf(nodeIndex)"
                  @select="select(nodeIndex)"
                  @edit="nodeFormVisibleShow"
                />
                <template v-if="readonly && node.done > 0">
                  <span
                    class="progress"
                    v-if="node.done < node.templates.length"
                    >{{ node.done }}/{{ node.templates.length }}</span
                  >
                  <cb-iconfont class="icon-done" v-else type="icon-gou" />
                </template>
              </div>
              <div
                class="cell leaf"
                v-for="(leaf, leafIndex) in node.templates"
                :key="leaf.uniqueId"
                :class="{
                  done: leaf.isDone,
                  selected:
                    selected.nodeIndex === nodeIndex &&
                    selected.leafIndex === leafIndex,
                  finish: leaf.resource_id,
                }"
              >
                <fish-bone-node
                  :node="leaf"
                  @change="change($event, nodeIndex, leafIndex)"
                  @remove="remove(nodeIndex, leafIndex)"
                  @select="select(nodeIndex, leafIndex, leaf)"
                  @answer="$emit('answer', leaf)"
                  @edit="editLeaf(leaf)"
                />
                <div class="finish-icon" v-if="leaf.resource_id">
                  <cb-iconfont
                    type="icon-gou"
                    class="gou-icon"
                    size="20"
                  ></cb-iconfont>
                </div>
              </div>
            </template>
          </div>
          <div v-if="!readonly" class="group" key="__last_add">
            <div
              class="cell"
              v-for="n in maxUp"
              :key="'__last_cell_' + n"
            ></div>
            <div class="cell last">
              <cb-iconfont
                type="icon-xinzeng"
                :size="20"
                @click="addNode(computedNodes.length)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择任务方案 -->
    <cb-dialog
      :title="$t('combatTech.selectExistingEntry')"
      :visible.sync="dialogGetCombatTech"
      append-to-body
    >
      <select-combat-tech @selectCombatTech="getACombatTechMsg">
        <slot slot="closeWindow">
          <cb-button button-type="cancel" @click="dialogGetCombatTech = false">
            {{ $t('common.cancel') }}
          </cb-button>
        </slot>
      </select-combat-tech>
    </cb-dialog>
    <!--添加任务弹窗-->
    <cb-dialog
      v-if="dialogCreateMission"
      :title="$t('missions.createMission')"
      top="3%"
      :visible.sync="dialogCreateMission"
      class="edit-task"
      width="1100px"
      @close="closeDialog"
      :close-on-press-escape="false"
    >
      <div style="height: 600px; overflow: auto" class="cyber-scroll-bar">
        <mission-detail
          ref="createMission"
          :hide-select="showSelect"
          :templateMsg="templateMsg"
          :moduleName="moduleName"
          :businessType="businessType"
          @missionResponse="getMissionResponse"
          @closeDialog="closeDialog"
          @createAMission="createAMission"
        >
          <!-- <slot name="createSubmit">
            <div class="form-button-bar">
              <cb-button-group space="middle">
                <cb-button
                  button-type="confirm"
                  @click="missionSubmit"
                  mr
                >
                  {{ $t('common.submit') }}
                </cb-button>
                <cb-button
                  button-type="cancel"
                  @click="closeDialog"
                >
                  {{ $t('common.cancel') }}
                </cb-button>
              </cb-button-group>
            </div>
          </slot> -->
        </mission-detail>
      </div>
      <div slot="footer" class="form-button-bar">
        <cb-button-group space="middle">
          <cb-button button-type="confirm" @click="missionSubmit" mr>
            {{ $t('common.submit') }}
          </cb-button>
          <cb-button button-type="cancel" @click="closeDialog">
            {{ $t('common.cancel') }}
          </cb-button>
        </cb-button-group>
      </div>
    </cb-dialog>
    <!--编辑任务弹窗-->
    <cb-dialog
      v-if="dialogMissionDetail"
      top="3%"
      :title="$t('missions.updateMission')"
      :visible.sync="dialogMissionDetail"
      class="edit-task"
      @close="closeDialog"
      :close-on-press-escape="false"
      width="1100px"
    >
      <div style="height: 600px; overflow: auto" class="cyber-scroll-bar">
        <mission-detail
          :id="resource_id"
          :moduleName="moduleName"
          :businessType="businessType"
          ref="editMission"
          @missionResponse="getMissionResponse"
          @closeDialog="closeDialog"
          @editMission="editSuccess"
        >
          <!-- <slot name="editSubmit">
            <div class="form-button-bar">
              <cb-button-group space="middle">
                <cb-button buttonType="confirm" @click="missionEdit">
                  {{ $t('common.submit') }}
                </cb-button>
                <cb-button buttonType="cancel" @click="closeDialog">
                  {{ $t('common.cancel') }}
                </cb-button>
              </cb-button-group>
            </div>
          </slot> -->
        </mission-detail>
      </div>
      <div slot="footer" class="form-button-bar">
        <cb-button-group space="middle">
          <cb-button buttonType="confirm" @click="missionEdit">
            {{ $t('common.submit') }}
          </cb-button>
          <cb-button buttonType="cancel" @click="closeDialog">
            {{ $t('common.cancel') }}
          </cb-button>
        </cb-button-group>
      </div>
    </cb-dialog>
    <LeafForm :visible.sync="leafFormVisible" />
    <NodeForm :visible.sync="nodeFormVisible" />
  </div>
</template>

<script>
import FishBoneNode from './node';
import LeafForm from './LeafForm';
import NodeForm from './NodeForm';
import LayoutSelector from './LayoutSelector';
import { getACombatTech } from '@/api/missions/mission';
import SelectCombatTech from '@/pages/cms/missions/combat-tech/components/select-combat-tech';
import MissionDetail from '@/pages/cms/missions/mission/components/mission-detail';
// import {getLanguage} from '@cyber/helper'
import { getI18n } from '@/lang/';
export default {
  components: {
    FishBoneNode,
    LeafForm,
    NodeForm,
    LayoutSelector,
    SelectCombatTech,
    MissionDetail,
  },
  props: {
    isPlan: {
      type: Boolean,
      default: false,
    },
    moduleName: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: Number,
      default: 1, // 1:fish 2:up 3:down
    },
    theme: {
      type: Number,
      default: 1, // 1:black 2:green 3:blue 4:brown
    },
    businessType: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      // language: getLanguage(),
      currentValue: this.value,
      dialogGetCombatTech: false,
      dialogMissionDetail: false,
      resource_id: '',
      templateMsg: {},
      dialogCreateMission: false,
      showSelect: true,
      missionRes: {},
      nodes: [],
      selected: {},
      leafFormVisible: false,
      nodeFormVisible: false,
      template: this.layout,
      color: this.theme,
      themes: [
        {
          key: 'black',
          label: this.$t('crEvent.black'),
          value: 1,
        },
        {
          key: 'green',
          label: this.$t('crEvent.green'),
          value: 2,
        },
        {
          key: 'blue',
          label: this.$t('crEvent.blue'),
          value: 3,
        },
        {
          key: 'brown',
          label: this.$t('crEvent.brown'),
          value: 4,
        },
      ],
    };
  },
  computed: {
    language() {
      // if (getI18n().locale !== 'zh-CN') {
      //   var language = 'en'
      // } else {
      //   language = 'zh-CN'
      // }
      return getI18n().locale;
    },
    themeLabel() {
      return _.chain(this.themes)
        .find(['value', this.color])
        .get('key')
        .value();
    },
    canvasSize() {
      return {
        width: this.nodes.length * 280 + 'px',
      };
    },
    maxUp() {
      if (this.template === 3) {
        return 0;
      } else if (this.template === 1) {
        return _.reduce(
          this.nodes,
          (max, o, i) => {
            const len = (o.templates || []).length || 0;
            if (i % 2 < 1 && len > max) max = len;
            return max;
          },
          0,
        );
      }
      return _.reduce(
        this.nodes,
        (max, o, i) => {
          const len = (o.templates || []).length || 0;
          if (i % 2 <= 1 && len > max) max = len;
          return max;
        },
        0,
      );
    },
    maxDown() {
      return _.reduce(
        this.nodes,
        (max, o, i) => {
          const len = (o.templates || []).length || 0;
          if (i % 2 > 0 && len > max) max = len;
          return max;
        },
        0,
      );
    },
    computedNodes() {
      return _.map(this.nodes, (o, i) => {
        o.isStage = true;
        o.done = _.chain(o.templates).filter('isDone').value().length;
        if (this.template === 2) {
          o.directionUp = true;
          o.top =
            Math.max(this.maxUp, this.maxDown) -
            ((o.templates || []).length || 0);
        } else if (this.template === 3) {
          o.directionUp = false;
          o.top = 0;
        } else {
          if (i % 2 < 1) {
            o.directionUp = true;
            o.top = this.maxUp - ((o.templates || []).length || 0);
          } else {
            o.directionUp = false;
            o.top = this.maxUp;
          }
        }
        return o;
      });
    },
  },
  watch: {
    value: {
      handler(nv, ov) {
        this.init();
      },
    },
    layout(v) {
      this.template = v;
    },
    theme(v) {
      this.color = v;
    },
    template(v) {
      this.$emit('update:layout', v);
    },
    color(v) {
      this.$emit('update:theme', v);
    },
  },
  created() {
    this.init();
  },
  methods: {
    init(value) {
      value = value || this.value;
      this.nodes = _.map(value, (node) => {
        return {
          uniqueId: _.uniqueId('node_'),
          title: node.stage,
          templates: _.map(node.templates, (leaf) => {
            return {
              uniqueId: _.uniqueId('leaf_'),
              title: leaf.title,
              isDone: leaf.isDone,
              description: leaf.description || '',
              resource_id: leaf.resource_id || '',
              write_up: leaf.write_up || '',
            };
          }),
        };
      });
    },
    updateData() {
      this.$emit(
        'input',
        _.map(this.nodes, (node) => {
          return {
            stage: node.title,
            templates: _.map(node.templates, (leaf) => {
              return {
                title: leaf.title,
                description: leaf.description || '',
                resource_id: leaf.resource_id || '',
                write_up: leaf.write_up || '',
              };
            }),
          };
        }),
      );
    },
    addNode(i) {
      this.nodes.splice(i, 0, {
        uniqueId: _.uniqueId('node_'),
        edit: true,
        title: '',
        templates: [],
      });
      this.updateData();
      this.select(i);
      this.nodeFormVisible = true;
    },
    nodeFormVisibleShow() {
      window.getSelection
        ? window.getSelection().removeAllRanges()
        : document.selection.empty();
      this.nodeFormVisible = true;
    },

    change(value, nodeIndex, leafIndex) {
      let node = this.nodes[nodeIndex] || {};
      if (leafIndex > -1) {
        if (!node.templates) return;
        node = node.templates[leafIndex] || {};
      }
      node.title = value;
      this.updateData();
      this.select(-1);
    },
    addLeaf(nodeIndex) {
      const stage = this.nodes[nodeIndex] || {};
      if (!stage.templates) return;
      stage.templates.push({
        uniqueId: _.uniqueId('leaf_'),
        edit: true,
        title: '',
      });
      this.updateData();
      this.select(nodeIndex, stage.templates.length - 1);
      this.editLeaf(_.last(stage.templates));
    },
    remove(nodeIndex, leafIndex) {
      if (leafIndex > -1) {
        const stage = this.nodes[nodeIndex] || {};
        if (!stage.templates) return;
        stage.templates.splice(leafIndex, 1);
      } else {
        this.nodes.splice(nodeIndex, 1);
      }
      this.updateData();
      this.select(-1);
    },
    reset() {
      this.$children.forEach((vm) => {
        vm.menuVisible = false;
      });
    },
    select(nodeIndex, leafIndex = -1) {
      this.selected = { nodeIndex, leafIndex };
    },
    editLeaf(leaf) {
      if (this.isPlan) {
        if (leaf.resource_id) {
          // 编辑任务
          this.resource_id = leaf.resource_id;
          this.dialogMissionDetail = true;
        } else {
          this.templateMsg = leaf;
          this.dialogCreateMission = true;
          this.showSelect = true;
        }
      } else {
        this.leafFormVisible = true;
      }
    },
    keydown(event) {
      const { nodeIndex = -1, leafIndex = -1 } = this.selected;
      if (nodeIndex < 0) return;
      if (event.target.localName === 'input') return;
      if (event.key === 'Delete') {
        this.remove(nodeIndex, leafIndex);
        this.closeTooltip();
      } else if (
        leafIndex < 0 &&
        (event.key === 'Insert' || (event.key === 'Enter' && event.ctrlKey))
      ) {
        this.addLeaf(nodeIndex);
        this.closeTooltip();
      } else if (event.key === 'Enter') {
        this.closeTooltip();
        if (leafIndex > -1) {
          this.addLeaf(nodeIndex);
        } else {
          this.addNode(nodeIndex + 1);
        }
      }
    },
    closeTooltip() {
      let list = document.getElementsByClassName('el-tooltip__popper');
      if (list.length > 0) {
        list[list.length - 1].style.display = 'none';
      }
    },

    // 已有作战技法弹框
    getCombatTech() {
      this.dialogGetCombatTech = true;
    },
    // 获取单个作战技法进行任务编排
    getACombatTechMsg(id) {
      if (id) {
        this.dialogGetCombatTech = false;
        getACombatTech(this.url, { resource_id: id }).then((res) => {
          this.init(_.get(res, 'data.data.combat_config'));
          this.updateData();
          this.template = _.get(res, 'data.data.template');
          this.color = _.get(res, 'data.data.color');
        });
        // getACombatTech(id).then((res) => {
        //   this.init(_.get(res, 'data.combat_config'));
        //   this.updateData();
        //   this.template = _.get(res, 'data.template');
        //   this.color = _.get(res, 'data.color');
        // });
      } else {
        this.$message.info(this.$t('missions.noSelectedCombatTech'));
      }
    },
    // 新增任务------------------
    // 获取实例任务创建成功后的实例信息
    getMissionResponse(res) {
      this.missionRes = res.data;
    },
    // 新建一个任务
    createAMission() {
      const { nodeIndex = -1, leafIndex = -1 } = this.selected;
      this.nodes[nodeIndex].templates[leafIndex].title = this.missionRes.title;
      this.nodes[nodeIndex].templates[leafIndex].description =
        this.missionRes.description;
      this.nodes[nodeIndex].templates[leafIndex].resource_id =
        this.missionRes.resource_id;
      this.updateData();
    },
    // 创建任务弹窗的验证
    getValidForm() {
      return this.$refs['createMission'].missionFormValid();
    },
    // 任务创建提交
    missionSubmit() {
      // 对任务详情页中内容进行校验,判断是否可提交
      if (this.getValidForm()) {
        // 根据表单数据，判断在同阶段下是否重名
        const { model } = this.$refs['createMission'];
        const { templates } = this.value[this.selected.nodeIndex];
        const titles = _.map(templates, 'title');
        titles.splice(this.selected.leafIndex, 1);
        // if (titles.indexOf(model.title) > -1) {
        //   this.$message.error(this.$t('combatTech.targetNameUnrepeatable'));
        //   return;
        // }
        this.$refs.createMission.submitReady();
      }
    },
    // 关闭弹框
    closeDialog() {
      this.dialogCreateMission = false;
      this.dialogMissionDetail = false;
      this.dialogCreateTemplateMission = false;
      const { nodeIndex = -1, leafIndex = -1 } = this.selected;
      const node =
        _.get(this.nodes, `${nodeIndex}.templates.${leafIndex}`) || {};
      if (!node.title) {
        this.remove(nodeIndex, leafIndex);
      }
    },
    // 编辑任务--------------------------
    // 任务编辑提交
    missionEdit() {
      // if (this.getEditValidForm()) {
      if (this.$refs.editMission) {
        const { model } = this.$refs['editMission'];
        const { templates } = this.value[this.selected.nodeIndex];
        const titles = _.map(templates, 'title');
        titles.splice(this.selected.leafIndex, 1);
        // if (titles.indexOf(model.title) > -1) {
        //   this.$message.error(this.$t('combatTech.targetNameUnrepeatable'));
        //   return;
        // }
        this.$refs.editMission.submitReady();
      }
    },
    // 编辑完成，获取响应数据
    editSuccess() {
      this.value[this.selected.nodeIndex].templates[
        this.selected.leafIndex
      ].title = this.missionRes.title;
      this.value[this.selected.nodeIndex].templates[
        this.selected.leafIndex
      ].description = this.missionRes.description;
      this.init();
      this.updateData();
      // this.board[this.stageIndex].missions[this.targetIndex] = {
      //   title: this.missionRes.title,
      //   description: this.missionRes.description,
      //   resource_id: this.missionRes.resource_id,
      // };
      // // 编辑完成之后验证阶段内是否存在重复目标
      // this.arrangeValid();
    },
    // 任务编排提交
    submitMissionArrange() {
      var message = { status: true, data: '' };
      // 循环遍历判断任务编排内是否存在空模板并生成任务方案
      const msgList = [];
      // 阶段数据加入msgList
      for (let stage = 0; stage < this.value.length; stage++) {
        msgList.push({ stage: this.value[stage].stage, templates: [] });
        // 目标数据加入msgList
        for (
          let target = 0;
          target < this.value[stage].templates.length;
          target++
        ) {
          // if (this.value[stage].templates[target].resource_id) {
          msgList[stage].templates.push({
            title: this.value[stage].templates[target].title,
            description: this.value[stage].templates[target].description,
            // 'missionId': this.board[stage].templates[target].missionId,
            resource_id: this.value[stage].templates[target].resource_id,
          });
          // } else {
          //   message.status = false;
          //   message.data = this.$t(
          //     'combatTech.emptyTemplatesCannotBeSubmitted',
          //   );
          //   return message;
          // }
        }
      }
      message.status = true;
      message.data = msgList;
      return message;
    },
  },
};
</script>

<style lang="scss" scoped>
.simple-fish-bone-canvas {
  overflow: auto;
  max-height: 670px;
}
.finish-icon {
  position: absolute;
  right: 5px;
  top: 0;
  .gou-icon {
    color: var(--success-color);
  }
}
.select-btn {
  margin-bottom: 10px;
}
.simple-fish-bone {
  --fish-node-bg-color: var(--neutral1);
  --fish-node-bg-color-green: var(--green-color-2);
  --fish-node-bg-color-blue: var(--blue-color-2);
  --fish-node-bg-color-brown: var(--orange-color-2);

  --fish-node-selected-bg-color: var(--neutral2);
  --fish-node-selected-bg-color-green: var(--green-color-4);
  --fish-node-selected-bg-color-blue: var(--blue-color-4);
  --fish-node-selected-bg-color-brown: var(--orange-color-4);

  --fish-bg-gird: #394150;

  color: var(--neutral8);
  width: 100%;
  height: 100%;
  font-size: 14px;
  position: relative;
  .fishbone-header {
    position: absolute;
    z-index: 9;
    top: 15px;
    left: 15px;
    display: flex;
    justify-content: space-between;
    width: calc(100% - 15px);
    .tips {
      color: var(--green-color);
      line-height: 35px;
      margin-right: 30px;
      padding-left: 5px;
    }
    .tips-flex {
      flex: 1;
      margin-left: 20px;
    }
  }
  .canvas {
    min-width: 100%;
    // background-image: radial-gradient(var(--bg-color-4), var(--fish-bg-color));
    .canvas-inner {
      width: 100%;
      display: flex;
      padding: 100px 30px 160px 30px;
      background: var(--neutral0);
      // background-image: linear-gradient(
      //     var(--fish-grid-color1) 1px,
      //     transparent 0
      //   ),
      //   linear-gradient(90deg, var(--fish-grid-color1) 1px, transparent 0),
      //   linear-gradient(var(--fish-grid-color2) 1px, transparent 0),
      //   linear-gradient(90deg, var(--fish-grid-color2) 1px, transparent 0);
      background-size: 150px 150px, 150px 150px, 30px 30px, 30px 30px;
    }
    .group {
      .cell {
        height: 40px;
        line-height: 40px;
        margin-top: 10px;
        position: relative;
        &.last {
          margin-left: 2px;
        }
        .icon-add {
          position: absolute;
          top: 10px;
          left: -36px;
          cursor: pointer;
        }
      }
      .node,
      .leaf {
        background: var(--fish-node-bg-color);
        &.selected,
        &.done {
          color: var(--neutral5);
          background: var(--fish-node-selected-bg-color);
        }
      }
      .node {
        width: 208px;
        margin: 10px 22px 0 38px;
        padding-left: 7px;
        &::before {
          display: block;
          content: '';
          position: absolute;
          top: 0;
          left: -18px;
          width: 0;
          height: 0;
          border-top-width: 20px;
          border-top-style: solid;
          border-bottom-width: 20px;
          border-left: 18px solid transparent;
          border-bottom-style: solid;
          border-top-color: var(--fish-node-bg-color);
          border-bottom-color: var(--fish-node-bg-color);
        }
        &::after {
          display: block;
          content: '';
          position: absolute;
          top: 0;
          right: -18px;
          width: 0;
          height: 0;
          border-top: 20px solid transparent;
          border-left-width: 18px;
          border-left-style: solid;
          border-bottom: 20px solid transparent;
          border-left-color: var(--fish-node-bg-color);
        }
        &.selected,
        &.done {
          &::before {
            border-top-color: var(--fish-node-selected-bg-color);
            border-bottom-color: var(--fish-node-selected-bg-color);
          }
          &::after {
            border-left-color: var(--fish-node-selected-bg-color);
          }
        }
      }
      .leaf {
        width: 220px;
        margin-left: 20px;
        padding-left: 25px;
      }
    }
  }
  &.green {
    .canvas {
      .group {
        .node,
        .leaf {
          background: var(--fish-node-bg-color-green);
          &.selected,
          &.done {
            color: var(--neutral5);
            background: var(--fish-node-selected-bg-color-green);
          }
        }
        .node {
          &::before {
            border-top-color: var(--fish-node-bg-color-green);
            border-bottom-color: var(--fish-node-bg-color-green);
          }
          &::after {
            border-left-color: var(--fish-node-bg-color-green);
          }
          &.selected,
          &.done {
            &::before {
              border-top-color: var(--fish-node-selected-bg-color-green);
              border-bottom-color: var(--fish-node-selected-bg-color-green);
            }
            &::after {
              border-left-color: var(--fish-node-selected-bg-color-green);
            }
          }
        }
      }
    }
  }
  &.blue {
    .canvas {
      .group {
        .node,
        .leaf {
          background: var(--fish-node-bg-color-blue);
          &.selected,
          &.done {
            color: var(--neutral5);
            background: var(--fish-node-selected-bg-color-blue);
          }
        }
        .node {
          &::before {
            border-top-color: var(--fish-node-bg-color-blue);
            border-bottom-color: var(--fish-node-bg-color-blue);
          }
          &::after {
            border-left-color: var(--fish-node-bg-color-blue);
          }
          &.selected,
          &.done {
            &::before {
              border-top-color: var(--fish-node-selected-bg-color-blue);
              border-bottom-color: var(--fish-node-selected-bg-color-blue);
            }
            &::after {
              border-left-color: var(--fish-node-selected-bg-color-blue);
            }
          }
        }
      }
    }
  }
  &.brown {
    .canvas {
      .group {
        .node,
        .leaf {
          background: var(--fish-node-bg-color-brown);
          &.selected,
          &.done {
            color: var(--neutral5);
            background: var(--fish-node-selected-bg-color-brown);
          }
        }
        .node {
          &::before {
            border-top-color: var(--fish-node-bg-color-brown);
            border-bottom-color: var(--fish-node-bg-color-brown);
          }
          &::after {
            border-left-color: var(--fish-node-bg-color-brown);
          }
          &.selected,
          &.done {
            &::before {
              border-top-color: var(--fish-node-selected-bg-color-brown);
              border-bottom-color: var(--fish-node-selected-bg-color-brown);
            }
            &::after {
              border-left-color: var(--fish-node-selected-bg-color-brown);
            }
          }
        }
      }
    }
  }
  &.readonly {
    .canvas {
      background: none;
      .canvas-inner {
        background: none;
        padding-top: 30px;
      }
      .group {
        margin-left: -10px;
        .node {
          width: 142px;
          margin-right: 0;
          .progress {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 12px;
          }
          &.done {
            color: var(--neutral5);
            background: var(--fish-node-selected-bg-color);
            &::before {
              border-top-color: var(--fish-node-selected-bg-color);
              border-bottom-color: var(--fish-node-selected-bg-color);
            }
            &::after {
              border-left-color: var(--fish-node-selected-bg-color);
            }
            .icon-done {
              position: absolute;
              top: 12px;
              right: 0;
              color: var(--neutral7);
            }
          }
        }
        .leaf {
          width: 160px;
        }
      }
    }
    &.green {
      .canvas {
        .group {
          .node {
            &.done {
              background: var(--fish-node-selected-bg-color-green);
              &::before {
                border-top-color: var(--fish-node-selected-bg-color-green);
                border-bottom-color: var(--fish-node-selected-bg-color-green);
              }
              &::after {
                border-left-color: var(--fish-node-selected-bg-color-green);
              }
            }
          }
        }
      }
    }
    &.blue {
      .canvas {
        .group {
          .node {
            &.done {
              background: var(--fish-node-selected-bg-color-blue);
              &::before {
                border-top-color: var(--fish-node-selected-bg-color-blue);
                border-bottom-color: var(--fish-node-selected-bg-color-blue);
              }
              &::after {
                border-left-color: var(--fish-node-selected-bg-color-blue);
              }
            }
          }
        }
      }
    }
    &.brown {
      .canvas {
        .group {
          .node {
            &.done {
              background: var(--fish-node-selected-bg-color-brown);
              &::before {
                border-top-color: var(--fish-node-selected-bg-color-brown);
                border-bottom-color: var(--fish-node-selected-bg-color-brown);
              }
              &::after {
                border-left-color: var(--fish-node-selected-bg-color-brown);
              }
            }
          }
        }
      }
    }
  }
}
</style>
