<template>
  <div class="ml20">
    <cb-auth-access :auth-data="authData" :org-data="manages"></cb-auth-access>
  </div>
</template>
<script>
import Constant from './constant';
import { getOrgData } from '@/api/organization.js';
export default {
  props: {
    authData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      filterStatus: false,
      share_mode: '',
      filterText: '',
      checkboxStatus: true,
      manages: [],
      cids: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: this.disabledFn,
      },
    };
  },
  computed: {
    $CONSTANT() {
      return Constant;
    },
  },
  watch: {
    authData: {
      handler(val, oldval) {
        this.getAuthData();
      },
      immediate: true,
      deep: true,
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getAuthData();
    this.getOrganization();
  },
  methods: {
    // 查询授权
    disabledFn() {
      if (this.checkboxStatus === true) {
        return true;
      } else if (this.checkboxStatus === false) {
        return false;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleCheckChange(data, checked, indeterminate) {
      this.authData.auth_organization = checked.checkedKeys;
    },
    getOrganization() {
      let managesArray;
      getOrgData().then((res) => {
        managesArray = _.get(res, 'data.data', []);
        this.manages = managesArray;
        this.setOrganization(managesArray);
      });
    },
    setOrganization(managesArr) {
      managesArr.forEach((item) => {
        item.label = item.name;
        item.value = item.id;
        if (item.children && item.children.length > 0) {
          this.setOrganization(item.children);
        }
      });
    },
    getAuthData() {
      if (this.authData.auth_mode) {
        this.share_mode = this.authData.auth_mode;
        this.checkboxStatus =
          this.share_mode === this.$CONSTANT.COURSES.AUTH.ALL;
        this.cids = this.authData.auth_organization;
      }
    },
    raduioChange(val) {
      if (val === this.$CONSTANT.COURSES.AUTH.ALL) {
        this.checkboxStatus = true;
        this.authData.auth_mode = this.$CONSTANT.COURSES.AUTH.ALL;
      } else {
        this.checkboxStatus = false;
        this.authData.auth_mode = this.$CONSTANT.COURSES.AUTH.PART;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.mange-content {
  .select-div {
    width: calc(100% - 80px);
    ::v-deep.el-radio__label {
      font-weight: bold;
      .private {
        margin-top: 50px;
        .chooseDiv {
          position: relative;
          height: 600px;
          background: #fff;
          padding: 20px;
          box-shadow: 0px 2px 4px 0px rgba(51, 123, 247, 0.16);
          border-radius: 4px;
          margin-left: 130px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(85, 85, 85, 1);
          .divDisbaled {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            .el-scrollbar {
              height: calc(100% - 15px);
              .el-scrollbar__bar.is-horizontal {
                height: 0 !important;
              }
              .el-scrollbar__wrap {
                overflow-x: hidden;
              }
              .el-scrollbar__view {
                height: calc(100% - 15px);
              }
              .search-wrapper-box {
                .el-input {
                  width: 25%;
                  margin-bottom: 5px;
                }
                .el-switch {
                  margin: 0 5px 0 10px;
                }
              }
            }
          }
          .disbaled-style {
            z-index: 999;
            background: rgba(243, 243, 244, 0.5);
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style>
