<template>
  <div class="change-template-div">
    <div class="search-model">
      <div class="left-search fl">
        <cb-filter-condition
          :condition="typeSearchData.typeConditionName"
          :filterList="typeSearchData.typeLists"
          @change="getSearchType"
        ></cb-filter-condition>
        <cb-filter-condition
          :condition="difficultSearchData.difficultConditionName"
          :filterList="difficultLists"
          @change="getSearchDifficult"
        ></cb-filter-condition>
      </div>
      <div class="right-search fl">
        <cb-input
          v-model="searchInput"
          class="elc-input"
          :placeholder="$t('m.templateNamePh')"
          @keyup.native.enter="searchCon"
        >
        </cb-input>
      </div>
    </div>
    <div
      class="template-list"
      :class="language === 'en-US' ? 'template-list-en' : ''"
    >
      <div style="width: 100%; height: 100%">
        <div>
          <div
            v-for="(item, index) in templateList"
            :key="index"
            class="template_item"
            :class="{ template_item_current: index === choosedScene }"
            @click="chooseTemplate(item, index)"
          >
            <list-common :difficultLists="difficultLists" :item-data="item" />
          </div>
        </div>
        <div class="pagination-info">
          <cb-pagination
            v-if="paginationInfo.total !== 0"
            class="elc-pagination"
            background
            :current-page="paginationInfo.current_page"
            layout="total,sizes, prev, pager, next"
            :total="paginationInfo.total"
            :page-size="paginationInfo.per_page"
            :page-sizes="['10', '20', '30', '40']"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          >
          </cb-pagination>
        </div>
        <div v-if="paginationInfo.total === 0" style="padding: 100px">
          <empty-page ref="emptyComp" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from '@/components/SearchCondition/Search.vue';
import ListCommon from '@/components/ListCommon/index.vue';
import emptyPage from '@/pages/web/Empty';
import { getLanguage } from '@cyber/helper';
export default {
  name: 'ChangeTemplate',
  components: {
    Search,
    ListCommon,
    emptyPage,
  },
  props: {
    typeSearchData: {
      type: Object,
      default: () => {},
    },
    difficultSearchData: {
      type: Object,
      default: () => {},
    },
    templateList: {
      type: Array,
      default: () => [],
    },
    paginationInfo: {
      type: Object,
      default: () => {},
    },
    difficultLists: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      choosedScene: '',
      searchInput: '',
      language: getLanguage(),
    };
  },
  methods: {
    getSearchType(searchParams) {
      this.$emit('templateType', searchParams.value);
    },
    getSearchDifficult(searchParams) {
      this.$emit('templateDifficult', searchParams.value);
    },
    searchCon() {
      this.$emit('templateName', this.searchInput);
    },
    handleCurrentChange(val) {
      this.$emit('templateCurrent', val);
    },
    handleSizeChange(val) {
      this.$emit('templateSize', val);
    },
    chooseTemplate(val, index) {
      this.choosedScene = index;
      this.$emit('choosedScence', val);
    },
  },
};
</script>

<style lang="scss" scoped>
.change-template-div {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 0 0 0;
  ::v-deep .search-condition-comp {
    padding-left: 0;
    width: 100%;
  }

  .search-model {
    width: calc(100% - 120px);
    margin: 0 60px 0 60px;
    min-height: 80px;
  }
  .left-search {
    width: 78%;
  }
  .right-search {
    width: 22%;
    position: relative;
    ::v-deep .el-input__inner {
      border-radius: 2px;
    }
    /*.input-search{*/
    /*border-radius: 18px;*/
    /*}*/
  }
  .template_item_current {
    // box-shadow:0 6px 26px 3px rgba(29,124,197,0.6), 0 4px 10px 0 rgba(20,29,40,1), 0 10px 26px 4px rgba(16,24,33,1) !important;
  }
  .template-list-en {
    height: calc(100% - 150px) !important;
    margin-top: 10px;
  }
  .template-list {
    width: 100%;
    height: calc(100% - 110px);
    position: relative;
    clear: both;
    border-radius: 10px;
    .template_item {
      margin-left: 40px;
      margin-right: 40px;
      width: calc(100% - 80px);
      box-sizing: border-box;
      position: relative;
      padding: 0 15px 15px;
      height: 231px;
      cursor: pointer;
      &:nth-child(1) {
        border-radius: 2px 2px 0 0;
      }
    }
    ::v-deep .unstart {
      display: none !important;
    }
    ::v-deep .train_content {
      width: calc(100% - 166px);
      border-right: 0;
    }
    ::v-deep .single-diffult {
      right: 5.5%;
    }
  }
}
</style>
