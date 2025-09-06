<template>
  <div class="question-accessory-list">
    <cb-form ref="formRef" json :model.sync="formData">
      <div
        class="item"
        v-for="(item, index) in formData.questionAccessoryList"
        :key="item.resource_id"
      >
        <!-- 题目名称 -->
        <span class="fileName" :title="item.file_name">{{
          item.file_name
        }}</span>
        <cb-form-item
          class="flagVal-box"
          :label="$t('flags.flagValue')"
          :prop="'questionAccessoryList.' + index + '.flagVal'"
          :rules="rules.flagVal"
        >
          <cb-input
            v-model="item.flagVal"
            :placeholder="$t('flags.plzInputFlagValue')"
            @input="updateQsAccessaryFlag(item)"
          ></cb-input>
        </cb-form-item>
        <div class="btn-box">
          <cb-button
            mr
            button-type="import"
            type="text"
            @click="downloadItem(item)"
          >
            {{ $t('m.download') }}
          </cb-button>
          <cb-button
            button-type="delete"
            type="text"
            @click="deleteItem(item, $event)"
          ></cb-button>
        </div>
      </div>
    </cb-form>
  </div>
</template>

<script>
import Utils from '@/utils/util';
import { getSystemSettingAllConfig } from '@/api/common.js';
export default {
  props: {
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    var validValue = (rule, value, callback) => {
      const len = Utils.getByteLen(value);
      if (len < 1 || len > 255) {
        callback(new Error(this.$t('flags.flagLen255')));
      } else {
        // var regRule = /^[0-9a-zA-Z-\_{}]{1,}$/g;
        // var re = new RegExp(regRule);
        // if (re.test(value)) {
        // 校验是否有重复的
        const filterData = _.filter(
          this.formData.questionAccessoryList,
          (item) => {
            return item.flagVal === value;
          },
        );
        if (filterData.length >= 2) {
          callback(new Error(this.$t('m.entryCannotBeRepeated')));
        } else {
          callback();
        }
        // } else {
        //   callback(new Error(this.$t('views.exercise.form.flag.regexMsg')));
        // }
      }
    };
    return {
      formData: {
        questionAccessoryList: [],
      },
      flagLen: 8,
      rules: {
        flagVal: [
          {
            required: true,
            message: this.$t('flags.plzInputFlagValue'),
            trigger: 'blur',
          },
          {
            required: true,
            validator: validValue,
            trigger: 'blur',
          },
        ],
      },
    };
  },
  watch: {
    fileList: {
      handler(val) {
        this.formData.questionAccessoryList = _.cloneDeep(val);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.getFlagLen();
  },
  methods: {
    getFlagLen() {
      getSystemSettingAllConfig().then((res) => {
        const resultData = _.get(res, 'data.data', []);
        const filterData = _.filter(resultData, (item) => {
          return item.key_name === 'flag_length';
        });
        this.flagLen = filterData ? filterData[0].value : 8;
      });
    },
    // 更新falg值
    updateQsAccessaryFlag(item) {
      this.$emit('update:fileList', this.formData.questionAccessoryList);
    },
    // 删除
    deleteItem(file, done) {
      this.formData.questionAccessoryList =
        this.formData.questionAccessoryList.filter(
          (item) => item.resource_id !== file.resource_id,
        );
      this.$emit('update:fileList', this.formData.questionAccessoryList);
      done();
    },
    // 下载
    downloadItem(item) {
      this.$request.binaryDownload(
        'get',
        item.file_url || item.file_path,
        {},
        { filename: item.file_name, baseURL: '' },
      );
    },
  },
};
</script>

<style scoped lang="scss">
.question-accessory-list {
  margin-bottom: 24px;
  width: 100%;
  ::v-deep .el-form {
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 0;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
  .item {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 18px 16px;
    width: 100%;
    background: var(--bg-color-3);
    // 文件名
    .fileName {
      display: inline-block;
      margin-right: 16px;
      width: 28%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      color: var(--neutral8);
    }
    .flagVal-box {
      display: flex;
      align-items: center;
      width: 56%;
      ::v-deep .el-form-item__content {
        width: 78%;
      }
    }
    .btn-box {
      position: absolute;
      right: 16px;
    }
  }
}
</style>
