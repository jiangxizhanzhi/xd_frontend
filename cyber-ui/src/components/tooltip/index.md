```html
<template>
  <div class="box">
    <div class="top">
      <cb-tooltip
        class="item"
        effect="dark"
        content="Top Left 提示文字"
        placement="top-start"
      >
        <cb-button hollow>上左</cb-button>
      </cb-tooltip>
      <cb-tooltip
        class="item"
        effect="dark"
        content="Top Center 提示文字"
        placement="top"
      >
        <cb-button hollow>上边</cb-button>
      </cb-tooltip>
      <cb-tooltip
        class="item"
        effect="dark"
        content="Top Right 提示文字"
        placement="top-end"
      >
        <cb-button hollow>上右</cb-button>
      </cb-tooltip>
    </div>
    <div class="left">
      <cb-tooltip
        class="item"
        effect="dark"
        content="Left Top 提示文字"
        placement="left-start"
      >
        <cb-button hollow>左上</cb-button>
      </cb-tooltip>
      <cb-tooltip
        class="item"
        effect="dark"
        content="Left Center 提示文字"
        placement="left"
      >
        <cb-button hollow>左边</cb-button>
      </cb-tooltip>
      <cb-tooltip
        class="item"
        effect="dark"
        content="Left Bottom 提示文字"
        placement="left-end"
      >
        <cb-button hollow>左下</cb-button>
      </cb-tooltip>
    </div>

    <div class="right">
      <cb-tooltip
        class="item"
        effect="dark"
        content="Right Top 提示文字"
        placement="right-start"
      >
        <cb-button hollow>右上</cb-button>
      </cb-tooltip>
      <cb-tooltip
        class="item"
        effect="dark"
        content="Right Center 提示文字"
        placement="right"
      >
        <cb-button hollow>右边</cb-button>
      </cb-tooltip>
      <cb-tooltip
        class="item"
        effect="dark"
        content="Right Bottom 提示文字"
        placement="right-end"
      >
        <cb-button hollow>右下</cb-button>
      </cb-tooltip>
    </div>
    <div class="bottom">
      <cb-tooltip
        class="item"
        effect="dark"
        content="Bottom Left 提示文字"
        placement="bottom-start"
      >
        <cb-button hollow>下左</cb-button>
      </cb-tooltip>
      <cb-tooltip
        class="item"
        effect="dark"
        content="Bottom Center 提示文字"
        placement="bottom"
      >
        <cb-button hollow>下边</cb-button>
      </cb-tooltip>
      <cb-tooltip
        class="item"
        effect="dark"
        content="Bottom Right 提示文字"
        placement="bottom-end"
      >
        <cb-button hollow>下右</cb-button>
      </cb-tooltip>
    </div>
  </div>
</template>

<style>
  .box {
    width: 400px;

    .top {
      text-align: center;
    }

    .left {
      float: left;
      width: 60px;
    }

    .right {
      float: right;
      width: 60px;
    }

    .bottom {
      clear: both;
      text-align: center;
    }

    .item {
      margin: 4px;
    }

    .left .cb-tooltip__popper,
    .right .cb-tooltip__popper {
      padding: 8px 10px;
    }
  }
</style>
<!-- live-tooltip.vue -->
```
