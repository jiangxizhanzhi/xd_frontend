<template>
  <div class="org-tree-container">
    <div class="org-tree" :class="{ horizontal, collapsable }">
      <org-tree-node
        :data="data"
        :props="props"
        :judge="judge"
        :NodeClass="NodeClass"
        :horizontal="horizontal"
        :label-width="labelWidth"
        :collapsable="collapsable"
        :render-content="renderContent"
        :label-class-name="labelClassName"
        @on-expand="(e, data) => $emit('on-expand', e, data)"
        @on-node-focus="(e, data) => $emit('on-node-focus', e, data)"
        @on-node-click="(e, data) => $emit('on-node-click', e, data)"
        @on-node-mouseover="(e, data) => $emit('on-node-mouseover', e, data)"
        @on-node-mouseout="(e, data) => $emit('on-node-mouseout', e, data)"
      />
    </div>
  </div>
</template>

<script>
import render from './node';

export default {
  name: 'Vue2OrgTree',
  components: {
    OrgTreeNode: {
      render,
      functional: true,
    },
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    props: {
      type: Object,
      default: () => ({
        label: 'label',
        expand: 'expand',
        children: 'children',
      }),
    },
    judge: {
      type: Object,
      required: false,
    },
    NodeClass: {
      type: Array,
      required: false,
    },
    horizontal: Boolean,
    selectedKey: String,
    collapsable: Boolean,
    renderContent: Function,
    labelWidth: [String, Number],
    labelClassName: [Function, String],
    selectedClassName: [Function, String],
  },
};
</script>

<style lang="scss" scoped>
.org-tree-container {
  display: inline-block;
  padding: 15px;
  font-family: 'Courier New', Courier, monospace;
}

.org-tree {
  display: table;
  text-align: center;

  &:before,
  &:after {
    content: '';
    display: table;
  }

  &:after {
    clear: both;
  }
}

.org-tree-node,
.org-tree-node-children {
  position: relative;
  margin: 0;
  padding: 0;
  list-style-type: none;

  &:before,
  &:after {
    transition: all 0.35s;
  }
}
.org-tree-node-label {
  position: relative;
  display: inline-block;

  .org-tree-node-label-inner {
    padding: 10px 15px;
    text-align: left;
    border-radius: 3px;
    border: 1px solid var(--neutral3);
    color: var(--neutral8);
    font-size: 14px;
    display: flex;
    &-text {
      max-width: 200px;
    }
    &-span {
      margin-left: 8px;
      color: var(--primary-color);
    }
  }
  .org-tree-node-label-inner1 {
    // width: 68px;
    // height: 20px;
    padding: 4px 6px;
    background: var(--neutral0);
    border-radius: 1px;
    color: var(--primary-color);
    cursor: pointer;
  }
}
.org-tree-node-btn {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 20px;
  height: 20px;
  z-index: 10;
  margin-left: -11px;
  margin-top: 9px;
  background-color: var(--white-color);
  border: 1px solid #ccc;
  border-radius: 50%;
  box-shadow: 0 0 2px var(--neutral2);
  cursor: pointer;
  transition: all 0.35s ease;

  &:hover {
    background-color: #e7e8e9;
    transform: scale(1.15);
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
  }

  &:before {
    top: 50%;
    left: 4px;
    right: 4px;
    height: 0;
    border-top: 1px solid var(--neutral3);
  }

  &:after {
    top: 4px;
    left: 50%;
    bottom: 4px;
    width: 0;
    border-left: 1px solid var(--neutral3);
  }

  &.expanded:after {
    border: none;
  }
}
.org-tree-node {
  padding-top: 20px;
  display: table-cell;
  vertical-align: top;
  color: var(--neutral5);
  font-size: 14px;

  &.is-leaf,
  &.collapsed {
    padding-left: 10px;
    padding-right: 10px;
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 19px;
  }

  &:after {
    left: 50%;
    border-left: 1px solid #ddd;
  }

  &:not(:first-child):before,
  &:not(:last-child):after {
    border-top: 1px solid #ddd;
  }
}
.collapsable .org-tree-node.collapsed {
  padding-bottom: 30px;

  .org-tree-node-label:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 50%;
    height: 20px;
    border-right: 1px solid #ddd;
  }
}
.org-tree > .org-tree-node {
  padding-top: 0;

  &:after {
    border-left: 0;
  }
}
.org-tree-node-children {
  padding-top: 20px;
  display: table;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 20px;
    border-left: 1px solid #ddd;
  }

  &:after {
    content: '';
    display: table;
    clear: both;
  }
}

.horizontal {
  .org-tree-node {
    display: table-cell;
    float: none;
    padding-top: 0;
    padding-left: 20px;

    &.is-leaf,
    &.collapsed {
      padding-top: 10px;
      padding-bottom: 10px;
    }

    &:before,
    &:after {
      box-sizing: border-box;
      width: 19px;
      height: 50%;
    }

    &:after {
      top: 50%;
      left: 0;
      border-left: 0;
    }

    &:only-child:before {
      top: 1px;
      border-bottom: 1px solid var(--neutral3);
    }

    &:not(:first-child):before,
    &:not(:last-child):after {
      border-top: 0;
      border-left: 1px solid var(--neutral3);
    }

    &:not(:only-child):after {
      border-top: 1px solid var(--neutral3);
    }

    .org-tree-node-inner {
      display: table;
    }
  }

  .org-tree-node-label {
    display: table-cell;
    vertical-align: middle;
  }

  &.collapsable .org-tree-node.collapsed {
    padding-right: 30px;

    .org-tree-node-label:after {
      top: 0;
      left: 100%;
      width: 20px;
      height: 50%;
      border-right: 0;
      border-bottom: 1px solid var(--neutral3);
    }
  }

  .org-tree-node-btn {
    top: 50%;
    left: 100%;
    margin-top: -11px;
    margin-left: 9px;
  }

  & > .org-tree-node:only-child:before {
    border-bottom: 0;
  }

  .org-tree-node-children {
    display: table-cell;
    padding-top: 0;
    padding-left: 20px;

    &:before {
      top: 50%;
      left: 0;
      width: 20px;
      height: 0;
      border-left: 0;
      border-top: 1px solid var(--neutral3);
    }

    &:after {
      display: none;
    }

    & > .org-tree-node {
      display: block;
      text-align: left;
    }
  }
}
</style>
