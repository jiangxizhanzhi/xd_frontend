<template>
  <div class="simple-fish-bone-canvas cyber-scroll-bar">
    <div
      class="simple-fish-bone"
      :class="[{ readonly }, themeLabel]"
      @click="reset"
      @keydown="keydown"
      tabindex="0"
      style="outline: none"
    >
      <!-- 主要组件内容 -->
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
                v-for="(leaf, leafIndex) in node.attack_message_req_list"
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
                <!-- <div class="finish-icon" v-if="leaf.resource_id">
                  <cb-iconfont
                    type="icon-gou"
                    themedColor="--success-color"
                    size="20"
                  ></cb-iconfont>
                </div> -->
              </div>
              <div
                class="cell node"
                :class="{
                  done:
                    node.attack_message_req_list.length > 0 &&
                    node.attack_message_req_list.length === node.done,
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
                  @edit="nodeFormVisible = true"
                />
                <template v-if="readonly && node.done > 0">
                  <span
                    class="progress"
                    v-if="node.done < node.attack_message_req_list.length"
                    >{{ node.done }}/{{
                      node.attack_message_req_list.length
                    }}</span
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
                    node.attack_message_req_list.length > 0 &&
                    node.attack_message_req_list.length === node.done,
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
                  @edit="nodeFormVisible = true"
                />
                <template v-if="readonly && node.done > 0">
                  <span
                    class="progress"
                    v-if="node.done < node.attack_message_req_list.length"
                    >{{ node.done }}/{{
                      node.attack_message_req_list.length
                    }}</span
                  >
                  <cb-iconfont class="icon-done" v-else type="icon-gou" />
                </template>
              </div>
              <div
                class="cell leaf"
                v-for="(leaf, leafIndex) in node.attack_message_req_list"
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
                <!-- <div class="finish-icon" v-if="leaf.resource_id">
                  <cb-iconfont
                    type="icon-gou"
                    themedColor="--success-color"
                    size="20"
                  ></cb-iconfont>
                </div> -->
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
    <!-- 任务方案任务弹框 -->
    <LeafForm ref="leafFormRef" :visible.sync="leafFormVisible" />
    <!-- 任务方案阶段弹框 -->
    <NodeForm :visible.sync="nodeFormVisible" />
  </div>
</template>

<script>
import FishBoneNode from './node';
import LeafForm from './LeafForm';
import NodeForm from './NodeForm';
export default {
  components: {
    FishBoneNode,
    LeafForm,
    NodeForm,
  },
  props: {
    isPlan: {
      type: Boolean,
      default: false,
    },
    // moduleName: {
    //   type: String,
    //   default: '',
    // },
    value: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentValue: this.value,
      dialogMissionDetail: false,
      resource_id: '',
      templateMsg: {},
      missionRes: {},
      nodes: [],
      selected: {},
      leafFormVisible: false,
      nodeFormVisible: false,
      template: 3,
      optionsTypeValue: '',
      colorsValue: '',
      linearValue: '',
    };
  },
  computed: {
    language() {
      // if (getI18n().locale !== 'zh-CN') {
      //   var language = 'en'
      // } else {
      //   language = 'zh-CN'
      // }
      // return getI18n().locale;
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
      // if (this.template === 3) {
      return 0;
      // }
    },
    maxDown() {
      return _.reduce(
        this.nodes,
        (max, o, i) => {
          const len = (o.attack_message_req_list || []).length || 0;
          if (i % 2 > 0 && len > max) max = len;
          return max;
        },
        0,
      );
    },
    computedNodes() {
      return _.map(this.nodes, (o, i) => {
        o.isStage = true;
        o.done = _.chain(o.attack_message_req_list)
          .filter('isDone')
          .value().length;
        o.directionUp = false;
        o.top = 0;
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
  },
  created() {
    this.init();
    //获取场景id(scene_id||topo_id,)
    this.scene_id = this.$route.query.scene_id
      ? this.$route.query.scene_id
      : this.$route.query.topo_id;
    if (this.scene_id === this.$route.query.topo_id) {
      this.is_instance = false;
    } else {
      this.is_instance = true;
    }

    //下拉框接口
    this.$request
      .get(
        '/situation/control/option',
        //新增参数is_instance
        { scene_id: this.scene_id, is_instance: this.is_instance },
        { baseURL: '/api/ojj' },
      )
      .then((res) => {
        this.$refs.leafFormRef.optionsType = res.data.data.attack_type_list;
        this.$refs.leafFormRef.optionsColor = res.data.data.color_list;
        this.$refs.leafFormRef.optionsLinear = res.data.data.line_type_list;
        this.$refs.leafFormRef.nodeList = [
          ...res.data.data.area_list,
          ...res.data.data.element_list,
        ];
        this.$refs.leafFormRef.areaList = res.data.data.area_list;
        this.$refs.leafFormRef.elementList = res.data.data.element_list;

        //源节点下拉框数据
        this.$refs.leafFormRef.sourceList = res.data.data.element_list; //合并的源节点数据,节点加区域
        this.optionsTypeValue = res.data.data.attack_type_list[0].code;
        this.colorsValue = res.data.data.color_list[0].code;
        this.linearValue = res.data.data.line_type_list[0].code;

        //媒体动效的源节点下拉框只有节点
        this.$refs.leafFormRef.nodeListMedia = res.data.data.element_list;
      });
  },
  methods: {
    init(value) {
      value = value || this.value;
      this.nodes = _.map(value, (node) => {
        return {
          uniqueId: _.uniqueId('node_'),
          title: node.name,
          attack_message_req_list: _.map(
            node.attack_message_req_list,
            (leaf) => {
              return {
                uniqueId: _.uniqueId('leaf_'),
                title: leaf.title, //动效描述
                isDone: leaf.isDone,
                resource_id: leaf.resource_id || '',
                type: leaf.type || this.optionsTypeValue, //动效
                source_id: leaf.source_id || '',
                target_id: leaf.target_id || '',
                look_at_target: leaf.look_at_target || false,
                line_color: leaf.line_color || this.colorsValue, //颜色
                duration_time: Number(leaf.duration_time), //持续时间,默认为3
                interval_time: Number(leaf.interval_time) || 0, //间隔时间,默认为0
                line_type: leaf.line_type || this.linearValue,
                line_width: leaf.line_width || 3, //线条默认3px
                media_animation_list: leaf.media_animation_list || [
                  {
                    area_id: '',
                    direction: '',
                    source_id_media: '',
                    url: '',
                    list: [],
                  },
                ],
              };
            },
          ),
        };
      });
    },
    updateData() {
      this.$emit(
        'input',
        _.map(this.nodes, (node) => {
          return {
            name: node.title,
            attack_message_req_list: _.map(
              node.attack_message_req_list,
              (leaf) => {
                return {
                  title: leaf.title,
                  resource_id: leaf.resource_id || '',
                  type: leaf.type || '', //动效
                  source_id: leaf.source_id || '',
                  target_id: leaf.target_id || '',
                  look_at_target: leaf.look_at_target || false,
                  line_color: leaf.line_color || '',
                  duration_time: Number(leaf.duration_time), //持续时间
                  interval_time: Number(leaf.interval_time) || 0, //间隔时间
                  line_type: leaf.line_type || '',
                  line_width: leaf.line_width || '',
                  media_animation_list: leaf.media_animation_list || [
                    {
                      area_id: '',
                      direction: '', // source_id: '',
                      source_id_media: '',
                      url: '',
                      list: [],
                    },
                  ],
                };
              },
            ),
          };
        }),
      );
    },
    addNode(i) {
      if (this.nodes.length > 7) {
        this.$message({
          message: this.$t('dynamicControl.moreEight'),
          type: 'warning',
        });

        return;
      }

      this.nodes.splice(i, 0, {
        uniqueId: _.uniqueId('node_'),
        edit: true,
        title: '',
        attack_message_req_list: [],
      });
      this.updateData();
      this.select(i);
      this.nodeFormVisible = true;
    },
    change(value, nodeIndex, leafIndex) {
      let node = this.nodes[nodeIndex] || {};
      if (leafIndex > -1) {
        if (!node.attack_message_req_list) return;
        node = node.attack_message_req_list[leafIndex] || {};
      }
      node.title = value;
      this.updateData();
      this.select(-1);
    },
    // 添加动效
    addLeaf(nodeIndex) {
      const name = this.nodes[nodeIndex] || {};
      if (!name.attack_message_req_list) return;
      name.attack_message_req_list.push({
        uniqueId: _.uniqueId('leaf_'),
        edit: true,
        title: '',
        duration_time: 3, //持续时间默认3秒
      });
      this.updateData();
      this.select(nodeIndex, name.attack_message_req_list.length - 1);
      this.editLeaf(_.last(name.attack_message_req_list));
    },
    remove(nodeIndex, leafIndex) {
      if (leafIndex > -1) {
        const name = this.nodes[nodeIndex] || {};
        if (!name.attack_message_req_list) return;
        name.attack_message_req_list.splice(leafIndex, 1);
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
      this.leafFormVisible = true;
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
        const { attack_message_req_list } = this.value[this.selected.nodeIndex];
        const titles = _.map(attack_message_req_list, 'title');
        titles.splice(this.selected.leafIndex, 1);
        this.$refs.createMission.submitReady();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}
input {
  -webkit-user-select: auto; /*webkit浏览器*/
}
textarea {
  -webkit-user-select: auto; /*webkit浏览器*/
}
.simple-fish-bone-canvas {
  overflow: auto;
  max-height: 600px;
}
.select-btn {
  margin-bottom: 10px;
}
.simple-fish-bone {
  --fish-node-bg-color: rgba(121, 136, 166, 0.2);
  --fish-node-bg-color-green: rgba(22, 217, 51, 0.1);
  --fish-node-bg-color-blue: rgba(36, 167, 255, 0.1);
  --fish-node-bg-color-brown: rgba(243, 144, 14, 0.1);

  --fish-node-selected-bg-color: rgba(121, 136, 166, 0.5);
  --fish-node-selected-bg-color-green: rgba(22, 217, 51, 0.26);
  --fish-node-selected-bg-color-blue: rgba(36, 167, 255, 0.26);
  --fish-node-selected-bg-color-brown: rgba(243, 144, 14, 0.26);

  --fish-bg-gird: #394150;

  color: var(--font-color-primary);
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
      color: var(--success-color);
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
    .canvas-inner {
      width: 100%;
      display: flex;
      padding: 10px 30px 160px 30px;
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
            background: linear-gradient(
              90deg,
              var(--fish-node-selected-bg-color),
              var(--invalid-color)
            );
            &::before {
              border-top-color: var(--fish-node-selected-bg-color);
              border-bottom-color: var(--fish-node-selected-bg-color);
            }
            &::after {
              border-left-color: var(--invalid-color);
            }
            .icon-done {
              position: absolute;
              top: 12px;
              right: 0;
              color: var(--white-color);
            }
          }
        }
        .leaf {
          width: 160px;
        }
      }
    }
  }
}
</style>
