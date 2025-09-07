## 基本演示

```html
<template>
  <div>
    <cb-form
      ref="fromRef"
      :model.sync="form"
      :rules="rules"
      :url="url"
      :baseURL="baseURL"
      :id="{
        id:'11111'
      }"
      json="true"
      width="100%"
      label-position="right"
      label-width="80px"
      background-color
    >
      <cb-form-item label="姓名" prop="name">
        <cb-input
          v-model.trim="form.name"
          placeholder="请输入姓名"
          type="text"
        ></cb-input>
      </cb-form-item>

      <cb-form-item label="单选" prop="radio">
        <cb-radio-group v-model="form.radio">
          <cb-radio label="1">备选项</cb-radio>
          <cb-radio label="2">备选项</cb-radio>
          <cb-radio label="3">备选项</cb-radio>
        </cb-radio-group>
      </cb-form-item>

      <cb-form-item label="复选框" prop="checkList">
        <cb-checkbox-group v-model="form.checkList">
          <cb-checkbox label="复选框 A"></cb-checkbox>
          <cb-checkbox label="禁用" disabled></cb-checkbox>
          <cb-checkbox label="选中且禁用" disabled></cb-checkbox>
        </cb-checkbox-group>
      </cb-form-item>

      <cb-form-item label="标签" prop="switch">
        <cb-switch
          v-model="form.switch"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </cb-switch>
      </cb-form-item>

      <cb-form-item label="下拉框" prop="option">
        <cb-select
          placeholder="请选择"
          multiple
          v-model="form.option"
          :options="options"
        >
        </cb-select>
      </cb-form-item>

      <cb-form-item label="日期时间" prop="datetime">
        <cb-date-picker
          v-model="form.datetime"
          type="datetime"
          placeholder="选择日期时间"
        >
        </cb-date-picker>
      </cb-form-item>

      <cb-form-item label="文件上传">
        <cb-upload-file
          :limit="10"
          type="file"
          accept=".xls,.xlsx"
          v-model="form.fileList"
        >
        </cb-upload-file>
      </cb-form-item>

      <cb-form-item label="标签" prop="tag">
        <cb-form-tags :value="form.tag"></cb-form-tags>
      </cb-form-item>

      <cb-form-item label="数量" prop="num">
        <cb-input-number
          v-model="form.num"
          :min="1"
          :max="10"
          label="描述文字"
        ></cb-input-number>
      </cb-form-item>
    </cb-form>
    <div class="form-button-group">
      <cb-button-group space="middle">
        <cb-button
          loading
          button-type="confirm"
          @click="submitForm($event)"
        ></cb-button>
        <cb-button button-type="cancel" @click="handleCancel"></cb-button>
      </cb-button-group>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        baseURL: '',
        url: '/api/test',
        form: {
          name: '',
          tag: ['a', 'ab', 'cc', 'dd'],
          num: '',
          radio: '2',
          checkList: ['选中且禁用'],
          option: '',
          fileList: [
            {
              name: 'foodfoodfofoodfoodfoodfoodfoodfoodfoodfoodfoodfoododfoodfoodfoodfoodfoodfoodfood.jpeg',
              url: 'https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00576-1654.jpg',
              isPreview: true,
              isDownload: true,
            },
          ],
          datetime: '',
          switch: true,
        },
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
        rules: {
          name: [
            {
              required: true,
              message: '请输入姓名',
              trigger: ['blur', 'change'],
            },
          ],
        },
      };
    },
    mounted() {
      this.$refs.fromRef.getModelData();
    },
    methods: {
      submitForm(done) {
        this.$refs.fromRef
          .submit()
          .then((res) => {
            done();
          })
          .catch((err) => {
            this.$serverError(err);
            done();
          });
      },
      handleCancel() {
        this.$refs.fromRef.resetFields();
      },
    },
  };
</script>
<style lang="scss">
  .form-button-group {
    text-align: center;
  }
</style>
<!-- live-form.vue -->
```

## 自定义上传参数

```html
<template>
  <div>
    <cb-form
      ref="fromRef"
      :model.sync="form"
      :rules="rules"
      :url="url"
      :baseURL="baseURL"
      id="id"
      json="true"
      width="100%"
      label-position="right"
      label-width="80px"
    >
      <cb-form-item label="姓名" prop="name">
        <cb-input
          v-model.trim="form.name"
          placeholder="请输入姓名"
          type="text"
        ></cb-input>
      </cb-form-item>
    </cb-form>
    <div class="form-button-group">
      <cb-button-group space="middle">
        <cb-button
          loading
          button-type="confirm"
          @click="submitForm($event)"
        ></cb-button>
        <cb-button button-type="cancel" @click="handleCancel"></cb-button>
      </cb-button-group>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        baseURL: '',
        url: '',
        form: {
          name: 'name',
        },
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
        rules: {
          name: [
            {
              required: true,
              message: '请输入姓名',
              trigger: ['blur', 'change'],
            },
          ],
        },
      };
    },
    methods: {
      submitForm(done) {
        this.$refs.fromRef
          .submit({
            customName: 'customName',
          })
          .then((res) => {
            done();
          })
          .catch((err) => {
            this.$serverError(err);
            done();
          });
      },
      handleCancel() {
        this.$refs.fromRef.resetFields();
      },
    },
  };
</script>
<!-- custom-form.vue -->
```
