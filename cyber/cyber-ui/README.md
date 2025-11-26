# cyber-ui

南京赛宁网安组件库

## clone

```shell
git clone git@10.10.10.12:cyber-fe/cyber-ui.git
```

## 配置镜像

```shell
yarn config set registry http://10.100.3.3:8081/repository/npm-group/
```

## 安装依赖

```shell
yarn install
```

或者

```shell
yarn
```

## 使用

```shell
yarn add @cyber/ui
```

或者

```shell
npm install @cyber/ui
```

## 开发

- ### 本地开发

```shell
yarn start
```

- ### 组件编写规范

  - 目录结构

  ```text
  src
  |-- components
      |-- button 组件名
          |-- src
              |-- button.vue 对应组件实现
          |-- index.js 组件注册
          |-- index.md 组件示例
  ```

  - [规范](./COMPONENT_SPEC.md)
  - [开发一个组件的流程](./COMPONENT_DEV_SPEC.md)

- ### 提交信息规范

  采用 [Angular 规范](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)

  > - build：构建工具
  > - ci：ci 配置文件或者脚本
  > - docs： 文档
  > - feat： 新功能
  > - fix： bug 修复
  > - perf： 性能
  > - refactor： 重构
  > - test： 单元测试
  > - chore: 辅助工具

  样例：`feat: initial commit (Closes #1)`

## 文档编写注意点

### 示例文档编写注意点

- 大部分遵从 markdown 语法
- 组件演示部分属于 markdown 展示区域,注意两点
  - 类型`html`
  - 一定要有注释<!--live-demo.vue--> `live-demo` 随意取名字(但是不可以与 ui 组件名重复),但是`.vue`一定得有

### 组件内部注释文档注意

#### props

```javascript
export default {
  props: {
    /**
     * Color of the button.
     */
    color: {
      type: String,
      default: '#FCC',
    },
  },
};
```

#### Events 事件

```javascript
export default {
  methods: {
    emitSuccess() {
      /**
       * 成功返回
       *
       * @event success
       * @property {string} content content of the first prop passed to the event
       * @property {object} example the demo example
       */
      this.$emit('success', content, {
        demo: 'example',
      });
    },
  },
};
```

#### slots 插槽

```html
<template>
  <div>
    <!-- @slot Use this slot header -->
    <slot name="header"></slot>

    <!--
      @slot Modal footer
      @binding item an item passed to the footer
		-->
    <slot name="footer" :item="item" />
  </div>
</template>
```
