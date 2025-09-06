<template>
  <!-- 新增三级指标页面 -->
  <cb-dialog
    v-if="dialogVisible"
    :title="edit ? $t('assessment.edit') : $t('assessment.add')"
    :visible.sync="dialogVisible"
    width="1000px"
    height="300px"
  >
    <div class="visibleWrap">
      <div class="title">{{ $t('assessment.selectRequire') }}</div>

      <cb-checkbox-group v-model="checkList" @change="handleChangeCheckbox">
        <cb-checkbox
          class="diagram-detail-item"
          v-for="item in thirdList"
          :id="item.index_id"
          :key="item.index_id"
          :label="item.index_id"
          :disabled="item.disabled"
          :title="item.name"
          >{{ item.name }}</cb-checkbox
        >
      </cb-checkbox-group>
    </div>

    <span slot="footer" class="dialog-footer">
      <div class="form-button-bar">
        <cb-button-group space="middle">
          <cb-button button-type="confirm" @click="submit"></cb-button>
          <cb-button button-type="cancel" @click="cancel"></cb-button>
        </cb-button-group>
      </div>
    </span>
  </cb-dialog>
</template>
<script>
import _, { forEach } from 'lodash';
import { getI18N } from '@cyber/helper';

export default {
  name: 'VariableDialog',
  props: {
    // 三级指标数据
    thirdList: {
      type: Array,
      default() {
        return [];
      },
    },
    third_indexes: {
      type: Array,
      default() {
        return [];
      },
    },
    schemeId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      connectedThreeIds: [],
      edit: false,
      dialogVisible: false,
      checkList: [],
      selectData: [],
    };
  },
  computed: {},
  watch: {
    thirdList: {
      deep: true, //true为进行深度监听,false为不进行深度监听
      handler(newVal) {
        const arr = this.third_indexes.map((item) => {
          return item.index_id;
        });

        this.checkList = arr;
        this.selectData = this.third_indexes;
      },
    },
  },

  mounted() {},
  created() {},
  methods: {
    getI18Nn() {
      return getI18N();
    },
    cancel() {
      this.dialogVisible = false;
    },
    handleChangeCheckbox(val) {
      let arr = [];
      val.forEach((ele) => {
        this.thirdList.forEach((item) => {
          if (ele === item.eval_indicator_id) {
            arr.push(item);
          }
        });
      });
      this.checkList = val;
      this.selectData = arr;
    },

    //数组取并集
    diffArrObj(arr) {
      const res = new Map();
      return arr.filter((a) => {
        return !res.has(a.index_id) && res.set(a.index_id, 1);
      });
    },
    submit() {
      this.$emit('variable-change', this.edit, this.selectData);
      this.selectData = [];
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.visibleWrap {
  width: 100%;
  height: 300px;
  .title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: var(--neutral8);
    line-height: 22px;
    margin-bottom: 10px;
  }

  .cb-checkbox-group {
    width: 100%;
    display: inline-block;
    .el-checkbox {
      float: left;
      width: 49%;
      height: 40px;
      font-size: 14px;
      align-items: normal;
      word-break: break-all !important;
      white-space: normal;
      margin: 5px 0px 5px 0;
      ::v-deep .el-checkbox__label {
        width: 100px;
        height: auto !important;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        word-break: break-all !important;
        text-overflow: ellipsis;
        line-height: 19px;
      }
    }
  }
}
</style>
