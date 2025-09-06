<template>
  <div
    v-if="$parent.readonly"
    class="simple-fish-bone--node cursor"
    @click="answer"
  >
    <!-- <span :title="value">{{ value }}</span> -->
    <div :title="value" class="content">
      <span class="content-span">{{ value }}</span>
    </div>
  </div>
  <div
    v-else
    class="simple-fish-bone--node"
    @dblclick.stop="beginEdit"
    @contextmenu.prevent="showMenu"
    @click="select"
  >
    <cb-input
      v-show="edit"
      v-model="value"
      ref="input"
      @change="submit"
      @blur="endEdit"
    />
    <span v-show="!edit">{{ value }}</span>
    <div v-if="menuVisible" class="menu">
      <div v-if="node.isStage" class="cmd" @click="addLeaf">添加子节点</div>
      <div class="cmd" @click="remove">
        删除<template v-if="!node.isStage">子</template>节点
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    node: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      edit: this.node.edit || false,
      value: this.node.title || '',
      menuVisible: false,
    };
  },
  methods: {
    beginEdit() {
      if (this.node.isStage) {
        this.edit = true;
        this.$nextTick().then(() => {
          this.$refs.input.focus();
        });
      } else {
        this.$emit('edit');
      }
    },
    endEdit() {
      if (this.value) {
        this.edit = false;
      }
    },
    submit() {
      if (this.value) {
        this.$emit('change', this.value);
      }
      this.endEdit();
    },
    addLeaf() {
      this.menuVisible = false;
      this.$emit('add-leaf');
    },
    remove() {
      this.menuVisible = false;
      this.$emit('remove');
    },
    showMenu() {
      this.select();
      this.$parent.$children.forEach((vm) => {
        vm.menuVisible = false;
      });
      this.menuVisible = true;
    },
    select() {
      this.$emit('select');
    },
    answer() {
      this.$emit('answer');
    },
  },
};
</script>

<style lang="scss" scoped>
.simple-fish-bone--node {
  position: relative;
  width: 100%;
  height: 100%;
  // span {
  .content {
    padding-right: 8px;
    text-overflow: ellipsis;
    display: -webkit-box;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .content-span {
    width: 100%;
    // padding-right: 15px;
    padding-right: 8px;
    display: inline-block;
    overflow: hidden;
    display: -webkit-box;
    margin: 10px 0;
    text-overflow: ellipsis;
    // white-space: nowrap;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }
  // span {
  //   width: 100%;
  //   // padding-right: 15px;
  //   display: inline-block;
  //   // overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  // }
  // }
  .el-input {
    margin-left: -10px;
  }
  .menu {
    position: absolute;
    z-index: 9;
    top: 15px;
    left: 120px;
    width: 200px;
    background: var(--bg-color-3);
    border-color: var(--neutral3);
    border-style: solid;
    border-width: 1px;
    .cmd {
      padding: 0 20px;
      cursor: pointer;
    }
  }
  &.cursor {
    cursor: pointer;
  }
}
</style>
