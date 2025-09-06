<template>
  <div class="org-tree-container">
    <div class="org-tree" :class="{ horizontal, collapsable }">
      <org-tree-node
        :data="orgTreeData"
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
import ScorePie from './scorePie';
import Select from './select.vue';
import Rate from './rate.vue';
import { getLanguage } from '@cyber/helper';

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
    labelWidth: [String, Number],
    labelClassName: [Function, String],
    selectedClassName: [Function, String],
  },
  watch: {
    data(newValue, oldValue) {
      this.orgTreeData = newValue;
    },
    // 传出去
    orgTreeData(newValue, oldValue) {
      this.$emit('OrgTreeDataChage', newValue);
    },
  },
  data() {
    return {
      language: getLanguage(),
      orgTreeData: this.data,
      options: [
        // {
        //   value: 0,
        //   label: '0%',
        // },
        {
          value: 10,
          label: '10%',
        },
        {
          value: 20,
          label: '20%',
        },
        {
          value: 30,
          label: '30%',
        },
        {
          value: 40,
          label: '40%',
        },
        {
          value: 50,
          label: '50%',
        },
        {
          value: 60,
          label: '60%',
        },
        {
          value: 70,
          label: '70%',
        },
        {
          value: 80,
          label: '80%',
        },
        {
          value: 90,
          label: '90%',
        },
        // {
        //   value: 100,
        //   label: '100%',
        // },
      ],
      value: '',
    };
  },
  mounted() {},
  methods: {
    updataNode(tree, curKey, keyField, val, level) {
      for (const node of tree) {
        if (node[keyField] === curKey && node.level === level) {
          node.score = val;
        }
        if (node.children && node.children.length) {
          this.updataNode(node.children, curKey, keyField, val, level);
        }
      }
      return tree;
    },
    append(data) {
      alert(data);
    },
    // 权重占比切换
    mySelectChange(val, data) {
      let newTreeData = [];
      if (data.type === 'ability') {
        // 能力占比切换
        newTreeData = this.updataNode(
          [this.orgTreeData],
          'ability',
          'type',
          val,
          2,
        );
        newTreeData = this.updataNode(
          [this.orgTreeData],
          'training',
          'type',
          100 - val,
          2,
        );
        // 判断训练得分的total字段是不是0
        if (newTreeData[0].children[1].children[0].total === 0) {
          let final_score =
            newTreeData[0].children[0].children[0].score * (val / 100);
          newTreeData = this.updataNode(
            [this.orgTreeData],
            1,
            'level',
            final_score,
            1,
          );
        } else {
          let final_score =
            newTreeData[0].children[0].children[0].score * (val / 100) +
            Math.round(
              (newTreeData[0].children[1].children[0].score /
                newTreeData[0].children[1].children[0].total) *
                100 *
                ((100 - val) / 100),
            );
          newTreeData = this.updataNode(
            [this.orgTreeData],
            1,
            'level',
            final_score,
            1,
          );
        }
      } else {
        // 训练得分占比切换
        newTreeData = this.updataNode(
          [this.orgTreeData],
          'training',
          'type',
          val,
          2,
        );
        newTreeData = this.updataNode(
          [this.orgTreeData],
          'ability',
          'type',
          100 - val,
          2,
        );
        if (newTreeData[0].children[1].children[0].total === 0) {
          let final_score =
            newTreeData[0].children[0].children[0].score * ((100 - val) / 100);
          newTreeData = this.updataNode(
            [this.orgTreeData],
            1,
            'level',
            final_score,
            1,
          );
        } else {
          let final_score =
            newTreeData[0].children[0].children[0].score * ((100 - val) / 100) +
            Math.round(
              (newTreeData[0].children[1].children[0].score /
                newTreeData[0].children[1].children[0].total) *
                100 *
                (val / 100),
            );
          newTreeData = this.updataNode(
            [this.orgTreeData],
            1,
            'level',
            final_score,
            1,
          );
        }
      }

      // 计算总得分，然后给第一级
      this.orgTreeData = newTreeData[0];
    },
    //星星修改时的事件
    myRateChange(val, data) {
      //更新星星此节点的数值，然后更新树，重新渲染
      this.orgTreeData = this.updataNode(
        [this.orgTreeData],
        data.abilityType,
        'abilityType',
        val,
        5,
      )[0];
      //查找所有星星的的节点，为了计算星星总和
      let node = this.findNode([this.orgTreeData], (node) => {
        return node.level === 4 && node.type === 'ability';
      }).children;
      //计算星星总和
      let num = 0;
      node.forEach((element) => {
        num += element.score;
      });
      //星星总和给其父节点，然后更新树，重新渲染
      this.orgTreeData = this.updataNode(
        [this.orgTreeData],
        'allAbilityType',
        'type',
        num,
        3,
      )[0];
      //一级总分
      let newTreeData = this.orgTreeData;
      let percent1 = newTreeData.children[0].score;
      let percent2 = newTreeData.children[1].score;
      let abilityScore = newTreeData.children[0].children[0].score;
      let trainingScore =
        newTreeData.children[1].children[0].total !== 0
          ? Math.round(
              (newTreeData.children[1].children[0].score /
                newTreeData.children[1].children[0].total) *
                100,
            )
          : 0; //训练得分score/total四舍五入 ,total为0,训练得分直接取0
      let final_score = Number(
        (
          abilityScore * (percent1 / 100) +
          trainingScore * (percent2 / 100)
        ).toFixed(2),
      );
      this.orgTreeData = this.updataNode(
        [this.orgTreeData],
        1,
        'level',
        final_score,
        1,
      )[0];
    },
    //获取树的children
    findNode(tree, func) {
      for (const node of tree) {
        if (func(node)) return node;
        if (node.children) {
          const res = this.findNode(node.children, func);
          if (res) return res;
        }
      }
      return null;
    },

    renderContent(h, data) {
      if (data.level === 1) {
        return h(ScorePie, {
          props: {
            scoreData: Number(data.score),
          },
        });
      } else if (data.level === 2) {
        return h('div', { class: 'org-tree-level2' }, [
          // h('span', { class: 'org-tree-level2-span' }, data.name),
          h(
            'span',
            {
              class:
                this.language === 'en-US'
                  ? 'org-tree-level2-span-en'
                  : 'org-tree-level2-span',
            },
            data.name,
          ),
          h(Select, {
            props: {
              options: this.options,
              scoreData: Number(data.score),
            },
            on: {
              selectChange: (val) => {
                this.mySelectChange(val, data);
              },
            },
          }),
        ]);
      } else if (data.level === 3) {
        // return h('div', { class: 'org-tree-level3' }, [
        return h(
          'div',
          {
            class:
              this.language === 'en-US'
                ? 'org-tree-level3-en'
                : 'org-tree-level3',
          },
          [
            h('span', null, data.name),
            h(
              'span',
              { class: 'org-tree-level3-span' },
              data.total
                ? `${data.score}/${data.total} ${this.$t('rbt.scores')}`
                : `${data.score} ${this.$t('rbt.scores')}`,
            ),
          ],
        );
      } else if (data.level === 4) {
        // return <div class="org-tree-level4">{data.name}</div>;
        return h('div', { class: 'org-tree-level4' }, data.name);
      } else if (data.level === 5) {
        if (data.type === 'ability') {
          return h('div', { class: 'org-tree-level5' }, [
            `${data.name}：`,
            h(Rate, {
              props: {
                options: this.options,
                scoreData: data.score,
              },
              on: {
                rateChange: (val) => {
                  this.myRateChange(val, data);
                },
              },
            }),
          ]);
        } else {
          return h('div', { class: 'org-tree-level5' }, [
            h('span', null, data.name),
            h(
              'span',
              { class: 'org-tree-level5-span' },
              `${data.score} ${this.$t('rbt.scores')}`,
            ),
          ]);
        }
      } else if (data.level === 6) {
        // return <div class="org-tree-level6">{data.name}</div>;
        return h('div', { class: 'org-tree-level6' }, data.name);
      } else if (data.level === 7) {
        return h('div', { class: 'org-tree-level7' }, [
          h('span', null, data.name),
          h(
            'span',
            { class: 'org-tree-level7-span' },
            `${data?.score ? data?.score : 0} ${this.$t('rbt.scores')}`,
          ),
        ]);
      } else {
        return null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.org-tree-container {
  display: inline-block;
  padding: 15px;
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
    .org-tree-level2 {
      display: flex;
      .org-tree-level2-span {
        position: relative;
        font-size: 14px;
        top: 7px;
        min-width: 80px;
      }
      .org-tree-level2-span-en {
        position: relative;
        font-size: 14px;
        top: 7px;
        min-width: 135px;
      }
      ::v-deep .cb-select {
        width: 80px !important;
        .el-select {
          .el-input {
            .el-input__suffix {
              .el-input__suffix-inner {
                .el-select__caret {
                  color: var(--primary-color);
                }
              }
            }
            .el-input__inner {
              color: var(--primary-color);
            }
          }
        }
      }
      .el-select {
        ::v-deep .el-input__inner {
          border: none;
        }
        border: none;
        width: 80px;
      }
    }
    .org-tree-level3-en {
      border: 1px solid var(--neutral3);
      padding: 5px 3px;
      display: flex;
      font-size: 14px;
      min-width: 204px;
      .org-tree-level3-span {
        margin-left: 10px;
        color: var(--primary-color);
        min-width: 46px;
      }
    }
    .org-tree-level3 {
      border: 1px solid var(--neutral3);
      padding: 5px 3px;
      display: flex;
      font-size: 14px;

      min-width: 158px;
      .org-tree-level3-span {
        margin-left: 10px;
        color: var(--primary-color);
        min-width: 46px;
      }
    }
    .org-tree-level4 {
      font-size: 14px;
      min-width: 40px;
    }
    .org-tree-level5 {
      color: var(--neutral8);
      display: flex;
      font-size: 14px;
      border: 1px solid var(--neutral3);
      padding: 5px 5px;
      text-align: left;
      // word-break: break-all;
      .org-tree-level5-span {
        min-width: 56px;
        margin-left: 10px;
        // margin-top: -2px;
        color: var(--primary-color);
      }
    }
    .org-tree-level6 {
      font-size: 14px;
      min-width: 40px;
    }
    .org-tree-level7 {
      display: flex;
      font-size: 14px;
      border: 1px solid var(--neutral3);
      padding: 5px 5px;
      text-align: left;
      .org-tree-level7-span {
        min-width: 56px;
        margin-left: 10px;
        // margin-top: -2px;
        color: var(--primary-color);
      }
    }
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
  // background-color: #fff;
  border: 1px solid var(--neutral3);
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.35s ease;

  &:hover {
    // background-color: #e7e8e9;
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
  // padding-top: 20px;
  display: table-cell;
  vertical-align: top;
  padding-top: 1px;

  &.is-leaf,
  &.collapsed {
    padding-left: 10px;
    padding-right: 10px;
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 1px;
    left: 0;
    width: 50%;
    height: 19px;
  }

  &:after {
    left: 50%;
    border-left: 1px solid var(--neutral3);
  }

  &:not(:first-child):before,
  &:not(:last-child):after {
    border-top: 1px solid var(--neutral3);
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
    border-right: 1px solid var(--neutral3);
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
    top: 1px;
    left: 50%;
    width: 0;
    height: 20px;
    border-left: 1px solid var(--neutral3);
  }

  &:after {
    content: '';
    display: table;
    clear: both;
  }
}

.horizontal {
  .org-tree-node {
    // display: flex;
    // flex-direction: row;
    // justify-content: flex-start;
    // align-items: center;
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
      width: 19px;
      height: 50%;
    }

    &:after {
      top: 50%;
      left: 0;
      border-left: 0;
      margin-top: 1px;
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
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: flex-start;
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
    }
  }
}
</style>
