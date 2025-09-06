# 基础单选-json

```html
<template>
  <cb-select
    v-model="value"
    :options="options"
    placeholder="请选择"
  ></cb-select>
</template>
<script>
  export default {
    data() {
      return {
        value: '',
        options: [
          {
            label: '选项1',
            value: 1,
          },
          {
            label: '选项2',
            value: 2,
          },
        ],
      };
    },
    mounted() {
      setTimeout(() => {
        this.value = this.options[0].value;
      }, 1000);
    },
    methods: {},
  };
</script>
<!--live-select.vue-->
```

# 基础单选-slot

```html
<template>
  <cb-select
    :first="{ label:'默认' ,value:'' }"
    v-model="value"
    placeholder="请选择"
  >
    <cb-option
      v-for="(item, i) in options"
      :label="item.label"
      :value="item.value"
    ></cb-option>
  </cb-select>
</template>
<script>
  export default {
    data() {
      return {
        value: '',
        options: [
          {
            label: '选项1',
            value: 1,
          },
          {
            label: '选项2',
            value: 2,
          },
        ],
      };
    },
    mounted() {},
    methods: {},
  };
</script>
<!--live-select-slot.vue-->
```

# 基础多选

```html
<template>
  <div>
    <cb-select
      multiple
      v-model="value"
      :options="options"
      placeholder="请选择"
    ></cb-select>
    <cb-select
      collapse-tags
      multiple
      v-model="value"
      :options="options"
      placeholder="请选择"
    ></cb-select>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: '',
        options: [
          {
            label: '选项1',
            value: 1,
          },
          {
            label: '选项2',
            value: 2,
          },
          {
            label: '选项3',
            value: 3,
          },
          {
            label: '选项4',
            value: 4,
          },
          {
            label: '选项5',
            value: 5,
          },
          {
            label: '选项6',
            value: 6,
          },
          {
            label: '选项7',
            value: 7,
          },
          {
            label: '选项8',
            value: 8,
          },
        ],
      };
    },
  };
</script>
<!--live-select-more.vue-->
```

# 基础多选-slot

```html
<template>
  <div>
    <cb-select multiple v-model="value" :options="options" placeholder="请选择">
      <cb-option
        v-for="(item, i) in options"
        :label="item.label"
        :value="item.value"
      ></cb-option>
    </cb-select>
    <cb-select
      collapse-tags
      multiple
      v-model="value"
      :options="options"
      placeholder="请选择"
    >
      <cb-option
        v-for="(item, i) in options"
        :label="item.label"
        :value="item.value"
      ></cb-option>
    </cb-select>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: '',
        options: [
          {
            label: '选项1',
            value: 1,
          },
          {
            label: '选项2',
            value: 2,
          },
          {
            label: '选项3',
            value: 3,
          },
          {
            label: '选项4',
            value: 4,
          },
          {
            label: '选项5',
            value: 5,
          },
          {
            label: '选项6',
            value: 6,
          },
          {
            label: '选项7',
            value: 7,
          },
          {
            label: '选项8',
            value: 8,
          },
        ],
      };
    },
  };
</script>
<!--live-select-more-slot.vue-->
```

# 有禁用选项

```html
<template>
  <cb-select
    multiple
    v-model="value"
    :options="options"
    placeholder="请选择"
  ></cb-select>
</template>
<script>
  export default {
    data() {
      return {
        value: '',
        options: [
          {
            label: '选项1',
            value: 1,
          },
          {
            label: '选项2',
            value: 2,
            disabled: true,
          },
          {
            label: '选项3',
            value: 3,
          },
          {
            label: '选项4',
            value: 4,
          },
        ],
      };
    },
  };
</script>
<!--live-select-disabled.vue-->
```

# 禁用状态

```html
<template>
  <cb-select
    disabled
    multiple
    v-model="value"
    :options="options"
    placeholder="请选择"
  ></cb-select>
</template>
<script>
  export default {
    data() {
      return {
        value: '',
        options: [
          {
            label: '选项1',
            value: 1,
          },
          {
            label: '选项2',
            value: 2,
          },
          {
            label: '选项3',
            value: 3,
          },
        ],
      };
    },
  };
</script>
<!--select-disabled.vue-->
```
