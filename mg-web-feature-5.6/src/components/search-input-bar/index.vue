<template>
  <div class="search-input-bar">
    <cb-input
      style="width: 600px"
      ref="searchInput"
      v-input-trim
      v-model="searchVal"
      :placeholder="$t('components.searchInputBar.placeHolder')"
      type="text"
      maxlength="50"
    ></cb-input>
    <cb-button style="height: 40px" class="btn-search" @click="toSearch">{{
      $t('components.searchInputBar.search')
    }}</cb-button>
    <cb-button
      v-if="!searchHide"
      style="margin-left: 16px; height: 40px"
      class="btn-advanced-search"
      hollow
      @click="showAdvancedSearch"
      >{{ $t('components.searchInputBar.advancedSearch') }}</cb-button
    >
    <!-- 高级搜索 -->
    <advanced-search-dialog
      ref="advancedSearchRef"
      :liveSearch="liveSearch"
      :advancedSearchParams="advancedSearchParams"
      @submitAdvancedSearch="submitAdvancedSearch"
      @close="closeAdvancedSearchDialog"
    ></advanced-search-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import AdvancedSearchDialog from './components/advanced-search-dialog.vue';
import { jsonSafeParse } from '@/utils/index';
export default {
  props: {
    searchHide: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    searchParams: {
      type: String,
      default: () => {
        return '';
      },
    },
    immediate: {
      type: Boolean,
      default: false,
    },
    storageKey: {
      type: String,
      default: 'vuln-search-params',
    },
    liveSearch: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    AdvancedSearchDialog,
  },
  data() {
    return {
      searchVal: '',
      advancedSearchParams: {},
    };
  },
  mounted() {
    document.onkeydown = this.handleKeyCode;

    if (this.immediate) {
      const lsData = localStorage.getItem(this.storageKey);
      const data = jsonSafeParse.parse(lsData) || {};
      if (this.liveSearch) {
        data.env = true;
      }
      let { search, ...advancedSearchParams } = data;
      this.searchVal = search || '';
      if (!search && !_.isEmpty(advancedSearchParams)) {
        // 高级搜索
        this.advancedSearchParams = advancedSearchParams;
        this.$refs.advancedSearchRef.search(data);
      } else {
        //普通搜索
        this.toSearchResult();
      }
    }
  },
  destroyed() {
    document.onkeydown = null;
  },
  methods: {
    // search btn
    toSearch() {
      this.$refs.searchInput.focus();
      this.toSearchResult();
    },
    showAdvancedSearch() {
      this.$refs.advancedSearchRef.show();
    },
    // 高级搜索dialog 关闭
    closeAdvancedSearchDialog() {
      this.$refs.advancedSearchRef.show(false);
    },
    // 高级搜索dialog 提交
    submitAdvancedSearch(data) {
      if (!_.isEmpty(data)) {
        this.toSearchResult('advanced', data);
      }
      this.$refs.advancedSearchRef.show(false);
    },
    // 获取搜索参数
    fetchSearchParams() {
      const lsData = localStorage.getItem(this.storageKey);
      const data = jsonSafeParse.parse(lsData) || {};
      // 输入框搜索
      let { search, ...advancedSearchParams } = data;
      this.searchVal = search || '';
      // 高级搜索
      this.advancedSearchParams = advancedSearchParams;
    },
    toSearchResult(type = '', advancedSearchData) {
      let data = {};
      if (type === 'advanced') {
        // 高级搜索
        if (!_.isEmpty(advancedSearchData)) {
          data = { ...data, ...advancedSearchData };
        }
      } else {
        // 输入框搜索
        data = {
          search: this.searchVal,
        };
      }
      if (this.liveSearch) {
        data.env = true;
      }
      localStorage.setItem(this.storageKey, jsonSafeParse.stringify(data));
      this.$emit('search', data);
      // 获取参数用于重置当前搜索条件
      this.fetchSearchParams();
    },
    // enter触发搜索
    handleKeyCode(e) {
      const keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
      if (keyCode && keyCode === 13) {
        this.toSearch();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search-input-bar {
  display: flex;
  align-items: center;
  ::v-deep .cb-input .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  ::v-deep .cb-button .el-button {
    height: 40px !important;
  }
  .btn-search {
    ::v-deep .el-button--medium {
      padding: 5px 27px !important;
    }
  }
  .btn-advanced-search {
    ::v-deep .el-button--medium {
      padding: 5px 13px !important;
    }
  }
}
</style>
