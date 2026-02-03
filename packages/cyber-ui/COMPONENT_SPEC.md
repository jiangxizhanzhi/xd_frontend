# 组件编写规范

组件库代码编写相关规范

## 1、命名规范

命名需严谨，确认英文语义，做到见名知意，提升代码的可读性, 不允许出现汉语拼音和数字

- 组件目录文件夹以及文件命名规范

  组件是多个单词的时候文件夹以及文件命名要么始终是单词大写开头，要么始终是横线连接比如：

  ```text
  components/
  |- MyComponent.vue
  ```

  ```text
  components/
  |- my-component.vue
  ```

- 组件暴露的命名规范

  为了组件库命名统一，无论是引用第三方组件库(element-ui)，还是单独组件，组件名前缀统一用`cb-`开头，对应组件文件中的`@displayName`改为`cb-xx`，比如：

  ```js
  /**
   * button 示例
   * @displayName cb-button 按钮
   * @example ../../../../docs/button.md
   */
  ```

- 变量、函数命名规范

  使用驼峰风格命名首字母小写，比如：`getUserList`等

- 常量命名规范

  所有字母大写，多个单词用下划线分割，如：`USER_STATUS`

- prop 名

  在声明 prop 的时候，其命名应该使用 camelCase（驼峰式命名），而在模版中应该使用 kebab-case（短横线命名）

  _遵循语言的约定，在 Javascript 中更自然的是 camelCas，而在 HTML 中则是 kebab-case_

  - 声明时：

    ```js
    props:{
      greetingText: {
        type: String,
        default: '',
      }
    },
    ...
    props
    ```

  - 模版中使用时：

    ```html
    <welcome-message greeting-text="hi" />
    ```

## 2、书写规范

- v-for 设置键值

  在组件上总是必须用`key`配合`v-for`，以便维护内部组件及其子树的状态如：

  ```html
  <ul>
    <li v-for="todo in todoList" :key="todo.id">{{ todo.text }}</li>
  </ul>
  ```

- 避免 v-if 和 v-for 用在一起

  不要把`v-if`和`v-for`同时用在同一个元素上

- 组件使用说明文档统一写在 docs 文件夹下

  每个组件功能完善后，对应的使用文档说明要统一写在外层 docs 目录下对应的`组件名.md`文件中

- 每个组件要写单元测试，写在对应组件文件目录下`__test__`
- 组件内样式或者修改第三方样式应该要限制在本组件内，防止污染其他组件或全局样式如：

  - 尽量使用 scoped，当需要修改库样式时(如 element)可搭配/deep/使用，基于 deep 的兼容性，尽量不要滥用，可用其他方法代替，如 class 的唯一性
  - 组件中 template 最外层 html 的 class 名应和当前组件名保持一致

- 开发组件时应尽量解耦, 业务部分不应当出现在组件内, 除一些默认功能外，所有事件都要暴露出来，不应在组件内处理
- 组件二次封装，保留 echarts/element-ui 的原生属性，减少局限性 (推荐使用`v-bind="$attrs" v-on="$listeners"`)
- 上层 props 传入组件的属性应单独区分开, 而不是全部在一个对象或数组内。 考虑尽量全的 props 属性，供组件使用时传递属性。 每个属性都要单独列出来，尽量不使用对象
- 不允许 vuex, vue-router, 请求, eventBus, 以及业务相关的耦合在组件内
