<template>
  <div>
    <cb-auth-access
      :auth-data="authData"
      :org-data="privateData.teachers"
    ></cb-auth-access>
  </div>
</template>
<script>
import Constant from './constant';
export default {
  components: {},
  props: {
    privateData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      authData: {
        auth_mode: 1,
      },
      share_mode: '',
      checkAll: false,
      checkedPerson: [],
      people: [],
      isIndeterminate: false,
      checkboxStatus: '',
      resource_id: '',
      teachersOPtions: [],
      ids: [],
    };
  },
  computed: {
    $CONSTANT() {
      return Constant;
    },
  },
  watch: {
    privateData: {
      handler(val, oldval) {
        this.getShares();
      },
      deep: true,
    },
  },
  created() {
    this.getShares();
  },
  methods: {
    // 查询授权
    getShares() {
      if (this.privateData.share_mode) {
        this.share_mode = this.privateData.share_mode;
        this.teachersOPtions = this.privateData.teachers;
        this.people = this.privateData.teachers;
        for (let i = 0; i < this.privateData.teachers.length; i++) {
          this.ids.push(this.privateData.teachers[i].resource_id);
          if (
            this.privateData.teachers[i].share ===
            this.$CONSTANT.COURSES.SHARE_TEACHER.ALL
          ) {
            this.checkedPerson.push(this.privateData.teachers[i].resource_id);
          }
        }
        this.checkboxStatus =
          this.share_mode === this.$CONSTANT.COURSES.AUTH.ALL;
        this.checkAll = this.checkedPerson.length === this.ids.length;
        this.isIndeterminate = !this.checkAll;
      }
    },
    raduioChange(val) {
      this.checkboxStatus = val === this.$CONSTANT.COURSES.AUTH.ALL;
    },
    handleCheckAllChange(val) {
      this.checkedPerson = val ? this.ids : [];
      this.isIndeterminate = false;
    },
    handleCheckedPersonChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.people.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.people.length;
    },
  },
};
</script>
<style scoped lang="scss">
.private-content {
  .select-div {
    width: calc(100% - 80px);
    ::v-deep.el-radio__label {
      font-weight: bold;
    }
    .private {
      margin-top: 50px;
      position: relative;
      .radio-box {
        position: absolute;
        top: -11px;
      }
      .checkbox {
        background: #fff;
        padding: 20px;
        -webkit-box-shadow: 0 2px 4px 0 rgba(51, 123, 247, 0.16);
        box-shadow: 0 2px 4px 0 rgba(51, 123, 247, 0.16);
        border-radius: 4px;
        margin-left: 130px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #555;
        .el-checkbox {
          margin-bottom: 15px;
        }
      }
      .private.disbaled-style {
        cursor: not-allowed;
      }
      .checkbox-group {
        margin: 20px 0 0 0;
        .el-checkbox.el-checkbox__input {
          vertical-align: top;
        }
        .box-info {
          width: 200px;
          height: 60px;
          background: rgba(58, 117, 239, 0.2);
          border-radius: 16px;
          padding: 10px 15px;
          box-sizing: border-box;
          .top {
            width: 170px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .botton {
            width: 170px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
