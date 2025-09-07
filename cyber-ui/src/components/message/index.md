## 基本演示

```html
<template>
  <div>
    <cb-button @click="success">成功</cb-button>
    <cb-button @click="warn">警告</cb-button>
    <cb-button @click="error">失败</cb-button>
    <cb-button @click="info">info</cb-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: '',
      };
    },
    methods: {
      warn() {
        this.$message.warning({
          message: '恭喜你，这是一条成功消息!',
        });
      },
      info() {
        this.$message.info({
          message: '恭喜你，这是一条成功消息!',
        });
      },
      success() {
        this.$message.success({
          message: '恭喜你，这是一条成功消息!',
        });
        // this.$message({
        //   message: '恭喜你，这是一条成功消息',
        //   type: 'success',
        // });
      },
      error() {
        this.$message({
          message: '恭喜你，这是一条成功消息',
          type: 'error',
        });
      },
    },
  };
</script>
<style>
  .bg {
    background-color: #2a354b;
    padding: 20px;
  }
</style>
<!--cb-input.vue-->
```

## confirm

```html
<template>
  <div>
    <cb-button @click="sureFunc">确定</cb-button>
  </div>
</template>
<script>
  export default {
    methods: {
      sureFunc() {
        this.$confirm('信息提示')
          .then((res) => {
            console.log(res);
          })
          .catch(() => {
            console.log('取消');
          });
      },
    },
  };
</script>
<!-- live-confirm.vue -->
```
