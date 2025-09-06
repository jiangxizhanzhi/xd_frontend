<template>
  <div
    v-if="$parent.readonly"
    class="simple-fish-bone--node cursor"
    :title="node.description"
    @click="answer"
  >
    <cb-tooltip>
      <div slot="content">
        {{ $t('fishBone.name') }}：{{ value }}<br />
        <template v-if="!node.isStage">
          <br />
          {{ $t('fishBone.desc') }}：{{ node.description }}
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
    <cb-tooltip v-show="!edit">
      <div slot="content">
        {{ $t('fishBone.name') }}：{{ value }}<br />
        <template v-if="!node.isStage">
          <br />{{ $t('fishBone.desc') }}：{{ node.description }}
        </template>
      </div>
      <div class="one-overflow">{{ value }}</div>
    </cb-tooltip>
    <div v-if="menuVisible" class="menu">
      <div v-if="node.isStage" class="cmd" @click="addLeaf">
        {{ $t('fishBone.addChildNodes') }}
      </div>
      <div class="cmd" @click="remove">
        <span>{{ $t('fishBone.delete') }}</span>
        <template v-if="!node.isStage">
          <span :class="language === 'en-US' ? '' : 'title-zh'">{{
            $t('fishBone.task')
          }}</span></template
        >
        <template v-else
          ><span :class="language === 'en-US' ? '' : 'title-zh'">{{
            $t('fishBone.nodes')
          }}</span></template
        >
      </div>
      <template>
        <div class="cmd" @click="addPrev">{{ $t('fishBone.addPreNode') }}</div>
        <div class="cmd" @click="addNext">{{ $t('fishBone.addNextNode') }}</div>
      </template>
    </div>
  </div>
</template>

<script>
import { getLanguage } from '@cyber/helper';
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
      language: getLanguage(),
    };
  },
  methods: {
    closeTooltip() {
      let list = document.getElementsByClassName('el-tooltip__popper');
      if (list.length > 0) {
        list[list.length - 1].style.display = 'none';
      }
    },
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
      this.closeTooltip();
    },
    remove() {
      this.menuVisible = false;
      this.$emit('remove');
      this.closeTooltip();
    },
    showMenu() {
      this.select();
      this.$parent.$children.forEach((vm) => {
        vm.menuVisible = false;
      });
      this.menuVisible = true;
      this.closeTooltip();
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
      this.closeTooltip();
    },
    addNext() {
      const i = _.get(this.$parent, 'selected.nodeIndex') || 0;
      this.$parent.addNode(i + 1);
      this.closeTooltip();
    },
  },
};
</script>

<style lang="scss" scoped>
.simple-fish-bone--node {
  position: relative;
  width: 100%;
  height: 100%;
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
      .title-zh {
        margin-left: -4px;
      }
    }
  }
  &.cursor {
    cursor: pointer;
  }
}
</style>
