<template>
  <div class="vuln-list">
    <div class="top-search">
      <div class="search-box">
        <search-input-bar
          :searchHide="true"
          immediate
          storage-key="analysis"
          :live-search="liveSearch"
          @search="search"
        ></search-input-bar>
      </div>
    </div>
    <div
      v-loading="loadingList"
      class="main-card"
      :style="
        cardList.length > 0
          ? {}
          : {
              'min-height': '600px',
            }
      "
    >
      <div class="vuln-list-card" v-if="cardList.length > 0">
        <div
          v-for="item in cardList"
          :key="item.id"
          class="vuln-card"
          @click="goDetail(item.resource_id)"
        >
          <analysis-list-cards :itemData="item"></analysis-list-cards>
        </div>
      </div>
      <div v-else-if="!loadingList" class="no-data">
        <empty :fontSize="'14'" :iconSize="94"></empty>
      </div>
    </div>
    <cb-pagination
      v-if="pagination.total > 0"
      :total="pagination.total"
      :current-page="pagination.currentPage"
      :page-size="pagination.per_page"
      @current-change="handleChange"
      @size-change="handleSizeChange"
      :page-size-options="['10', '20', '30', '50', '100']"
    ></cb-pagination>
  </div>
</template>

<script>
import Empty from '@/components/empty';

import SearchInputBar from '@/components/search-input-bar';

import _ from 'lodash';
import AnalysisListCards from './components/analysis-list-cards.vue';
import { getVulnSearch } from '@/api/vuln';

export default {
  name: 'AnalysisList',
  components: {
    AnalysisListCards,
    SearchInputBar,
    Empty,
  },
  props: {
    storageKey: {
      type: String,
      default: 'analysis',
    },
    liveSearch: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadingList: false,
      pagination: {
        total: 0,
        currentPage: 1,
        per_page: 15,
      },
      cardList: [],
      searchParams: '',
    };
  },

  methods: {
    search(searchParams) {
      this.searchParams = searchParams;
      this.getDataList();
    },
    goDetail(resource_id) {
      this.$emit('detail', resource_id);
    },
    getDataList(perPage = 10, currentPage = 1) {
      this.loadingList = true;
      this.pagination.per_page = perPage;
      this.pagination.currentPage = currentPage;
      const paramsData = {
        per_page: this.pagination.per_page,
        page: this.pagination.currentPage,
        analysis: true,
        env: true,
      };

      const { search } = this.searchParams;
      const allQueryData = {
        search,
        ...paramsData,
      };
      getVulnSearch(allQueryData)
        .then((res) => {
          this.cardList = _.get(res, 'data.data.list') || [];
          this.pagination.total = _.get(res, 'data.data.total') || 0;
        })
        .finally(() => {
          this.loadingList = false;
        });
    },
    handleChange(val) {
      this.pagination.currentPage = val;
      this.getDataList(this.pagination.per_page, val);
    },
    handleSizeChange(val) {
      this.pagination.currentPage = 1;
      this.pagination.per_page = val;
      this.getDataList(this.pagination.per_page, this.pagination.currentPage);
    },
  },

  beforeDestroy() {
    if (this.$route.name !== 'living-vuln-analysis-detail') {
      localStorage.removeItem('analysis');
    }
  },
};
</script>

<style lang="scss" scoped>
.vuln-list {
  width: 100%;
  padding-bottom: 20px;
  .top-search {
    width: 100%;
    height: 40px;
    margin-bottom: 16px;
    .search-box {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .main-card {
    position: relative;
    margin-bottom: 16px;
    .vuln-list-card {
      display: flex;
      flex-wrap: wrap;
    }
    .vuln-card {
      cursor: pointer;
      width: calc(50% - 10px);
      margin: 10px;
      &:nth-child(odd) {
        margin-left: 0;
      }
      &:nth-child(even) {
        margin-right: 0;
      }
    }
    .no-data {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 50px;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
