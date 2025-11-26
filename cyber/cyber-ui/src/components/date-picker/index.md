## 有禁用日期的

```html
<template>
  <div>
    <cb-date-picker
      v-model="release_time"
      type="datetime"
      placeholder="请选择日期时间"
      :picker-options="pickerOptions"
      prefix-icon="#"
    >
    </cb-date-picker>
    <cb-date-picker
      v-model="range_time"
      type="datetimerange"
      popper-class="submit_review"
      value-format="yyyy-MM-dd HH:mm:ss"
      range-separator="至"
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        release_time: '',
        range_time: '',
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 24 * 3600000;
          },
        },
      };
    },
  };
</script>
<!-- date-picker.vue -->
```

## 日期范围

```html
<template>
  <div style="display:flex">
    <div>
      <span class="demonstration">默认</span>
      <cb-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </cb-date-picker>
    </div>
    <div>
      <span class="demonstration">带快捷选项</span>
      <cb-date-picker
        v-model="value2"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      >
      </cb-date-picker>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              },
            },
          ],
        },
        value1: '',
        value2: '',
      };
    },
  };
</script>
<!-- date-pick-range.vue -->
```

## 测试 dialog 里的 date-picker

```html
<template>
  <div>
    <cb-button @click="btnClick">点击弹出</cb-button>
    <cb-button @click="btnClick2">点击弹出2</cb-button>
    <cb-dialog width="550px" height="300px" :visible.sync="visibleValue">
      <template slot="title">
        <div>头部</div>
      </template>
      <div style="height: 400px">内容</div>
      <template slot="footer">
        <div>底部</div>
      </template>
    </cb-dialog>
    <cb-dialog width="550px" height="300px" :visible.sync="visibleValue2">
      <template slot="title">
        <div>头部</div>
      </template>
      <div style="height: 400px">
        内容
        <cb-date-picker
          v-model="range_time"
          type="datetimerange"
          popper-class="submit_review"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
        />
      </div>
      <template slot="footer">
        <div>底部</div>
      </template>
    </cb-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        visibleValue: false,
        visibleValue2: false,
        range_time: '',
      };
    },
    watch: {},
    methods: {
      btnClick() {
        this.visibleValue = true;
      },
      btnClick2() {
        this.visibleValue2 = true;
      },
    },
  };
</script>
<!-- date-pick-range-dialog.vue -->
```
