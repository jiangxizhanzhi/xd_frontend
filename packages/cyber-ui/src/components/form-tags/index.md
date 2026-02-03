```html
<template>
  <div>
    <div class="mb10">
      <cb-form-tags
        :value="value"
        @click="tagClick"
        isActive
        :checkRepeat="false"
      ></cb-form-tags>
    </div>
    <div>
      <cb-form-tags
        :value="options"
        titleField="label"
        button-type="add"
        @click="tagClick"
      ></cb-form-tags>
    </div>
  </div>
</template>
<script>
  import { themed } from '../../utils/themes';
  export default {
    data() {
      return {
        value: ['a', 'ab', 'cc', 'dd'],
        options: [
          { label: '第一项', value: '1' },
          { label: '第二项第二项第二项第二项第二项第二项第二项', value: '2' },
        ],
      };
    },
    methods: {
      themed: themed,
      tagClick(item) {
        console.log(item);
      },
    },
  };
</script>
<style lang="scss">
  .mb10 {
    margin-bottom: 10px;
  }
</style>
<!-- live-form-tags.vue -->
```

```html
<template>
  <div>
    <cb-form-tags :value="value" :inputShow="false" @deleteTag="deleteTag">
      <template v-slot:button>
        <cb-button @click="btnClick">按钮</cb-button>
      </template>
    </cb-form-tags>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: ['a', 'ab', 'cc', 'dd'],
      };
    },
    methods: {
      themed: themed,
      deleteTag(tag) {
        console.log(tag);
      },
      btnClick() {
        alert('xxx');
        this.value = [];
      },
    },
  };
</script>
<!-- live-form-tags-btn.vue -->
```

## 有长度限制

```html
<template>
  <div>
    <cb-form-tags
      :value="value"
      :listMaxLen="5"
      :inputReg="rulesReg"
      :customError="true"
      @error="errorFunc"
      :customInputReg="customInputReg"
    ></cb-form-tags>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: ['a'],
        rulesReg: {
          reg: /^(a-z|A-Z|0-9)*[^$%^&*;:,<>?()\""\']{1,4}$/,
          errMSg: '只可以输入1-4长度的字符',
        },
        options: [
          { label: '第一项', value: '1' },
          { label: '第二项第二项第二项第二项第二项第二项第二项', value: '2' },
        ],
      };
    },
    methods: {
      themed: themed,
      errorFunc() {
        alert('长度超出限制');
      },
      customInputReg(value) {
        console.log('查看值', value);
        if (/^(a-z|A-Z|0-9)*[^$%^&*;:,<>?()\""\']{1,4}$/.test(value)) {
          return true;
        } else {
          this.$message.error('最大长度为4');
          return false;
        }
      },
    },
  };
</script>
<!-- live-form-tags-reg.vue -->
```
