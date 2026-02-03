# 新增组件开发流程

## 说明

CYBER-UI 是基于 element-ui 和 ant-design 基础上开发的

## 目录结构

```text
 src
 |-- components
     |-- button 组件名
         |-- src
             |-- button.vue 对应组件实现
         |-- index.js 组件注册
         |-- index.md 组件示例
 |-- style
     |-- components
         |-- button.scss
```

### 1.首先在 src/components 目录下创建一个文件夹，比如 button

### 2.在 button 目录下创建 src 目录，index.js 文件,index.md 文件

- 在 button/src/目录下创建.vue 文件，实现组件功能，比如 button.vue

- index.js 使用 install 函数注册插件

- `index.md` 组件实例，支持 markdown 语法，会显示在页面中代码演示的下面

- cyber/ui 页面属性表格读取的是 props 对象的属性，表格如下所示

  | 属性名 | 描述         | 类型   | 默认值 |
  | ------ | ------------ | ------ | ------ |
  | active | 选择的菜单项 | object | {}     |

  - props 对象会自动解析到页面中属性的表格中，props 对象里面可以定义多个对象，每个对象属性解析如下
    - 对象名----->表格的属性名
    - 对象前的多行注释----->表格的描述
    - 对象的 type ------>表格的类型
    - 对象的 default ------>表格的默认值

### 3.样式设置

在 src/style/components 目录下添加对应的.scss 文件

- 命名文件名与 src/components/ 对应组件的文件夹名字一样，比如 button.scss

- 定义主题颜色必须使用 @include themify(){} ，比如

  ```scss
  @import '../themify'; //引入themify
  body {
    @include themify() {
      //调用themify，在themify定义主题颜色
      .cb-button {
        color: themed(cy1);
      }
      &.is-disabled {
        color: themed(cy5-5) !important; //给cy5加透明度cy5-5 cy5的透明度时5*0.1
      }
    }
  }
  ```

- src/style/themes 目录是颜色变量的设置，dark.scss 是深主题，light.scss 是浅主题

- 颜色变量的命名规则是 cy+n，n 是十进制数字，ps：cy24

- src/style/themify 定义了一些 方法 等

  - @function themed(变量名)，获取颜色，ps： themed(cy5)

  - @function shade($color, $alpha: 5%)将$color 和#000 混合，$alpha 是 #000 的百分比

  - @function tint($color, $alpha: 5%)将$color 和#fff 混合，$alpha 是#fff 的百分比

  - @function changeOpacity($color, $opacity)改变颜色的透明度，$opacity 是透明度

### 4.将开发好的组件 export 出去

在 src/index.js 中导出新组件

- 1.import 对应的组件，ps：import CbButton from './components/button';

- 2.加入 const components = []数组中， ps：const components = [CbButton]

- 3.export 出去 ,ps: export {CbButton}
