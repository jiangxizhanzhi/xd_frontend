<template>
  <div class="cb-auth-access">
    <div class="select-div">
      <div class="all">
        <Radio v-model="share_mode" :label="1" @change="raduioChange">{{
          $t('g.authorizeAll')
        }}</Radio>
      </div>
      <div class="private">
        <div class="radio-box fl">
          <Radio v-model="share_mode" :label="2" @change="raduioChange">{{
            $t('g.custom')
          }}</Radio>
        </div>
        <div
          class="chooseDiv"
          :class="{
            'disbaled-style': share_mode === 1,
          }"
        >
          <div class="search-wrapper-box" v-if="authData.auth_mode === 2">
            <!--            <Input-->
            <!--              class="search-input elc-list-input"-->
            <!--              v-model="filterText"-->
            <!--              :disabled="checkboxStatus"-->
            <!--              size="mini"-->
            <!--              :placeholder="$t('g.plzInputKeyword')"-->
            <!--            />-->
            <cb-search-input
              style="width: 100%"
              class="search-input elc-list-input"
              v-model="filterText"
              :disabled="checkboxStatus"
              :placeholder="$t('g.plzInputKeyword')"
            ></cb-search-input>
          </div>
          <div class="scrollbar-height">
            <cb-scrollbar v-if="authData.auth_mode === 2">
              <Tree
                class="filter-tree"
                :data="orgData"
                show-checkbox
                node-key="value"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                :default-checked-keys="cids"
                @check="handleCheckChange"
                ref="tree"
                :check-strictly="true"
              ></Tree>
            </cb-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Radio, Input, Tree } from 'element-ui';
/**
 * @displayName cb-auth-access 授权访问
 * @classify Business/业务
 */
export default {
  name: 'CbAuthAccess',
  components: { Radio, Input, Tree },
  props: {
    authData: {
      type: Object,
      default: () => {},
    },
    orgData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      filterStatus: false,
      share_mode: '',
      filterText: '',
      checkboxStatus: true,
      cids: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: this.disabledFn,
      },
    };
  },
  watch: {
    authData: {
      handler() {
        this.getAuthData();
      },
      immediate: true,
      deep: true,
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {},
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

    getAuthData() {
      if (this.authData && this.authData.auth_mode) {
        this.share_mode = this.authData.auth_mode;
        this.checkboxStatus = this.share_mode === 1;
        this.cids = this.authData.auth_organization;
      }
    },
    raduioChange(val) {
      if (val === 1) {
        this.checkboxStatus = true;
        this.authData.auth_mode = 1;
      } else {
        this.checkboxStatus = false;
        this.authData.auth_mode = 2;
      }
    },
  },
};
</script>
