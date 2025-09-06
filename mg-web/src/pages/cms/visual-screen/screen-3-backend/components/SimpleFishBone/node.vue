<template>
  <div
    v-if="$parent.readonly"
    class="simple-fish-bone--node cursor"
    :title="node.description"
    @click="answer"
  >
    <cb-tooltip>
      <div slot="content">
        {{ $t('dynamicControl.name') }}:{{ value }}<br />
        <template v-if="!node.isStage">
          <br />
          {{ $t('fishBone.desc') }}:{{ node.description }}
        </template>
      </div>
      <div class="one-overflow">{{ value }}</div>
    </cb-tooltip>
  </div>
  <div
    v-else
    class="simple-fish-bone--node"
    @dblclick.stop="$emit('edit')"
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
    <cb-tooltip v-show="!edit" style="cursor: pointer">
      <div slot="content">
        {{ $t('dynamicControl.name') }}:{{ value }}<br />
        <template v-if="!node.isStage"> </template>
      </div>
      <div class="one-overflow">{{ value }}</div>
    </cb-tooltip>
    <div v-if="menuVisible" class="menu">
      <div v-if="node.isStage" class="cmd" @click="addLeaf">
        {{ $t('dynamicControl.addDynamic') }}
      </div>
      <template>
        <div class="cmd" @click="addPrev">
          {{ $t('dynamicControl.addPreviousStage') }}
        </div>
        <div class="cmd" @click="addNext">
          {{ $t('dynamicControl.addNextStage') }}
        </div>
      </template>
      <div class="cmd">
        <div v-if="!node.isStage" @click="remove('task')">
          {{ $t('dynamicControl.delete') }}
          <template>{{ $t('dynamicControl.dynamic') }}</template>
        </div>
        <div v-else @click="remove('stage')">
          {{ $t('dynamicControl.delete') }}
          <template>{{ $t('dynamicControl.plan') }}</template>
        </div>
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
    remove(key) {
      this.menuVisible = false;
      this.$confirm(
        key === 'task'
          ? this.$t('dynamicControl.dynamicDelete')
          : this.$t('dynamicControl.planDelete'),
      ).then(() => {
        this.$emit('remove');
      });
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
    addPrev() {
      const i = _.get(this.$parent, 'selected.nodeIndex') || 0;
      this.$parent.addNode(i);
    },
    addNext() {
      const i = _.get(this.$parent, 'selected.nodeIndex') || 0;
      this.$parent.addNode(i + 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.simple-fish-bone--node {
  position: relative;
  width: 100%;
  height: 100%;
  color: var(--neutral5);
  .el-input {
    margin-left: -10px;
  }
  .menu {
    position: absolute;
    z-index: 9;
    top: 15px;
    left: 120px;
    width: 200px;
    background: var(--bg-color-4);
    border-color: var(--neutral3);
    border-style: solid;
    border-width: 1px;
    .cmd {
      padding: 0 20px;
      cursor: pointer;
      color: var(--neutral8);
    }
  }
  &.cursor {
    cursor: pointer;
  }
}
</style>
