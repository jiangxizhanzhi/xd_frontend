<template>
  <div>
    <cb-button v-if="isPlan" class="select-btn" hollow @click="getCombatTech">
      {{ $t('combatTech.selectExistingEntry') }}
    </cb-button>
    <div
      class="simple-fish-bone"
      :class="[{ readonly }, theme]"
      @click="reset"
      @keydown="keydown"
      tabindex="0"
    >
      <slot />

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
                />
                <template v-if="readonly">
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
                />
                <template v-if="readonly">
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
    <LeafForm :visible.sync="leafFormVisible" />
  </div>
</template>

<script>
import FishBoneNode from './node';
import LeafForm from './LeafForm';
export default {
  components: {
    FishBoneNode,
    LeafForm,
  },
  props: {
    isPlan: {
      type: Boolean,
      default: false,
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
      default: 1, // up down
    },
    theme: {
      type: String,
      default: 'black', // green blue brown
    },
  },
  data() {
    return {
      currentValue: this.value,
      dialogGetCombatTech: false,
      dialogMissionDetail: false,
      resource_id: '',
      dialogCreateMission: false,
      showSelect: true,
      missionRes: {},
      nodes: [],
      selected: {},
      leafFormVisible: false,
      template: this.layout,
    };
  },
  computed: {
    canvasSize() {
      return {
        width: this.nodes.length * 280 + 'px',
      };
    },
    maxUp() {
      if (this.layout === 'down') {
        return 0;
      }
      return _.reduce(
        this.nodes,
        (max, o, i) => {
          const len = (o.templates || []).length || 0;
          if (i % 2 < 1 && len > max) max = len;
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
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.nodes = _.map(this.value, (node) => {
        return {
          uniqueId: _.uniqueId('node_'),
          title: node.stage,
          templates: _.map(node.templates, (leaf) => {
            return {
              uniqueId: _.uniqueId('leaf_'),
              stage: node.stage,
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
      } else if (event.key === 'Enter') {
        if (leafIndex > -1) {
          this.addLeaf(nodeIndex);
        } else {
          this.addNode(nodeIndex + 1);
        }
      } else if (event.key === 'Insert' && leafIndex < 0) {
        this.addLeaf(nodeIndex);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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

  --fish-bg-gird: rgba(57, 65, 80, 0.5);

  color: var(--neutral8);
  width: 100%;
  height: 100%;
  font-size: 14px;
  position: relative;
  .canvas {
    min-width: 100%;
    .canvas-inner {
      width: 100%;
      display: flex;
      padding: 30px 30px 60px 30px;
    }
    .group {
      .cell {
        height: 48px;
        line-height: 16px;
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
        height: 40px;
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
        padding-left: 8px;
        // padding-left: 25px;
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
      }
      .group {
        margin-left: -10px;
        .node {
          width: 212px;
          // width: 142px;
          margin-right: 0;
          .progress {
            position: absolute;
            top: 10px;
            // top: 0;
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
          // width: 160px;
          width: 248px;
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
