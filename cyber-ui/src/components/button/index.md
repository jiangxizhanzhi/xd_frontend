## 基本演示

## 预设 button-type 展示无功能代码

```html
<template>
  <div>
    <cb-button size="small">小按钮</cb-button>
    <cb-button size="large">大按钮</cb-button>
    <cb-button icon="icon-xinzeng">标准按钮</cb-button>
    <div class="btn-example-1">
      <cb-button button-type="delete" mr></cb-button>
      <cb-button button-type="add" mr></cb-button>
      <cb-button button-type="edit" mr></cb-button>
      <cb-button button-type="export" mr></cb-button>
      <cb-button button-type="import" mr></cb-button>
      <cb-button button-type="view" mr></cb-button>
      <cb-button button-type="recover" mr></cb-button>
      <cb-button button-type="disable" mr></cb-button>
      <cb-button button-type="confirm" mr></cb-button>
      <cb-button button-type="cancel" mr></cb-button>
      <cb-button button-type="search"></cb-button>
    </div>
    <div style="margin-top:24px">
      <cb-button button-type="delete" type="text"></cb-button>
      <cb-button button-type="add" type="text"></cb-button>
      <cb-button button-type="edit" type="text"></cb-button>
      <cb-button button-type="export" type="text"></cb-button>
      <cb-button button-type="import" type="text"></cb-button>
      <cb-button button-type="view" type="text"></cb-button>
      <cb-button button-type="recover" type="text"></cb-button>
      <cb-button button-type="disable" type="text"></cb-button>
      <cb-button button-type="search" type="text"></cb-button>
    </div>
    <div style="margin-top:24px">
      <cb-button button-type="delete" hollow></cb-button>
      <cb-button button-type="add" hollow></cb-button>
    </div>
    <div style="margin-top:24px">
      <cb-button icon="icon-xinzeng" circle></cb-button>
      <cb-button icon="icon-xinzeng" type="info" circle></cb-button>
    </div>
    <div style="margin-top:24px">
      <cb-button>按钮</cb-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    mounted() {
      console.log('我也获取');
    },
  };
</script>
<style lang="scss">
  .btn-example-1 {
    display: flex;
    margin-top: 24px;
    flex-wrap: wrap;

    .cb-button {
      margin-bottom: 10px;
    }
  }
  .parent {
    width: 200px;
    height: 200px;
    outline: 1px solid red;
    overflow: auto;
  }

  .children {
    width: 200px;
    height: 1000px;
  }
</style>
<!-- button-type.vue -->
```

## 置灰按钮完整示例

```html
<template>
  <div class="disabled-btn-group">
    <cb-button-group>
      <cb-button disabled button-type="delete"></cb-button>
      <cb-button disabled button-type="add"></cb-button>
      <cb-button disabled button-type="edit"></cb-button>
      <cb-button disabled button-type="export"></cb-button>
      <cb-button disabled button-type="import"></cb-button>
      <cb-button disabled button-type="view"></cb-button>
      <cb-button disabled button-type="recover"></cb-button>
      <cb-button disabled button-type="disable"></cb-button>
      <cb-button disabled button-type="confirm"></cb-button>
      <cb-button disabled button-type="cancel"></cb-button>
      <cb-button disabled button-type="search"></cb-button>
    </cb-button-group>
    <div style="margin-top:24px">
      <cb-button-group>
        <cb-button disabled button-type="delete" type="text"></cb-button>
        <cb-button disabled button-type="add" type="text"></cb-button>
        <cb-button disabled button-type="edit" type="text"></cb-button>
        <cb-button disabled button-type="export" type="text"></cb-button>
        <cb-button disabled button-type="import" type="text"></cb-button>
        <cb-button disabled button-type="view" type="text"></cb-button>
        <cb-button disabled button-type="recover" type="text"></cb-button>
        <cb-button disabled button-type="disable" type="text"></cb-button>
        <cb-button disabled button-type="search" type="text"></cb-button>
      </cb-button-group>
    </div>
    <div style="margin-top:24px">
      <cb-button-group>
        <cb-button disabled button-type="delete" hollow>删除</cb-button>
        <cb-button disabled icon="icon-xinzeng" hollow>新增</cb-button>
        <cb-button disabled color-type="hollow">默认幽灵按钮</cb-button>
        <cb-button disabled icon="icon-xinzeng" color-type="hollow"
          >默认幽灵按钮
        </cb-button>
        <cb-button disabled color-type="red hollow">红色幽灵按钮</cb-button>
      </cb-button-group>
    </div>
    <div style="margin-top:24px">
      <cb-button disabled icon="icon-xinzeng" circle></cb-button>
      <cb-button disabled icon="icon-xinzeng" type="info" circle></cb-button>
    </div>
  </div>
</template>
<style lang="scss">
  .disabled-btn-group {
    .cb-button {
      margin: 0 10px 10px 0 !important;
    }
  }
</style>
<!-- disabled-button.vue -->
```

## 删除按钮完整示例

```html
<template>
  <div>
    <div>默认带确认框和成功提示</div>
    <cb-button button-type="delete" @click="deleteHandler(true,$event)"
      >删除成功
    </cb-button>
    <div style="margin-top:20px">删除失败,不要带成功提示</div>
    <cb-button button-type="delete" @click="deleteHandler(false,$event)"
      >删除失败
    </cb-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    mounted() {
      console.log('这是按钮');
    },
    methods: {
      requestData(bool) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (bool) {
              resolve();
            } else {
              reject();
            }
          }, 500);
        });
      },
      deleteHandler(bool, done) {
        this.requestData(bool)
          .then(() => {
            done();
          })
          .catch(() => {
            // 不弹出成功提示
            done(false);
          });
      },
    },
  };
</script>
<!-- delete-button.vue -->
```

## 按钮确认弹框及完成消息

```html
<template>
  <div>
    <cb-button warnMsg="确认框消息" completeMsg="完成消息" @click="clickHandler"
      >test
    </cb-button>
    <cb-button @click="promptMsgHandler">prompt</cb-button>
    <cb-button @click="messageHandler">test message</cb-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    methods: {
      requestData() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 500);
        });
      },
      clickHandler(done) {
        this.requestData().then(() => {
          done();
        });
      },
      promptMsgHandler() {
        this.$prompt('请输入测试结论', '提示', {
          inputPattern: /\S/,
          inputErrorMessage: '测试结论不能为空',
          inputType: 'textarea',
        })
          .then(() => {
            console.log('confirm');
          })
          .catch(() => {
            console.log('cancel');
          });
      },
      messageHandler() {
        this.$message({
          showClose: true,
          message: '警告哦，这是一条警告消息',
          type: 'warning',
        });
      },
    },
  };
</script>
<!-- warn-msg.vue -->
```

## color-type

```html
<template>
  <div>
    <cb-button>按钮</cb-button>
    <cb-button color-type="green">按钮</cb-button>
    <cb-button color-type="yellow">按钮</cb-button>
    <cb-button color-type="red">按钮</cb-button>
    <cb-button color-type="hollow">默认幽灵按钮</cb-button>
    <cb-button color-type="red hollow">红色幽灵按钮</cb-button>
  </div>
</template>
<!-- color-type.vue -->
```

## loading

```html
<template>
  <div>
    <cb-button loading @click="clickHandler">loading 1s</cb-button>
    <cb-button loading @click="clickHandler" type="text">loading 1s</cb-button>
    <cb-button fullscreenLoading @click="clickHandler"
      >全屏loading 1s
    </cb-button>
    <cb-button @click="customClick">点击触发旁边按钮loading</cb-button>
    <cb-button :loading="customLoading">非自身点击事件触发loading</cb-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        customLoading: false,
      };
    },
    methods: {
      customClick() {
        this.customLoading = true;
        setTimeout(() => {
          this.customLoading = false;
        }, 10000);
      },
      requestData() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      },
      clickHandler(done) {
        this.requestData().then(() => {
          // done();
        });
      },
    },
  };
</script>
<!-- loading.vue -->
```

## linkName

```html
<template>
  <cb-button :link-name="{path:'/breadcrumb'}">linkName</cb-button>
</template>
<!-- link-name.vue -->
```

## icon

```html
<template>
  <div>
    <cb-button icon="icon-shijian1">linkName</cb-button>
  </div>
</template>
<!-- icon-name.vue -->
```
