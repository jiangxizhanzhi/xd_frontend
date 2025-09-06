<template>
  <div class="vuln-list">
    <div class="top-search">
      <div class="search-box">
        <search-input-bar
          immediate
          storage-key="intelligence"
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
      <div v-if="cardList.length > 0">
        <div
          v-for="item in cardList"
          :key="item.id"
          class="vuln-card"
          @click="goDetail(item.resource_id)"
        >
          <list-cards :itemData="item"></list-cards>
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
      :page-size-options="['15', '30', '50', '100']"
    ></cb-pagination>
  </div>
</template>

<script>
import Empty from '@/components/empty/index.vue';

import SearchInputBar from '@/components/search-input-bar';
import ListCards from './components/intelligence-list-card.vue';

import _ from 'lodash';
import { getVulnSearch } from '@/api/vuln';

export default {
  name: 'IntelligenceList',
  components: {
    SearchInputBar,
    ListCards,
    Empty,
  },
  props: {
    storageKey: {
      type: String,
      default: 'vuln-search-params',
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
    getDataList(perPage = 15, currentPage = 1) {
      this.loadingList = true;
      this.pagination.per_page = perPage;
      this.pagination.currentPage = currentPage;
      const paramsData = {
        per_page: this.pagination.per_page,
        page: this.pagination.currentPage,
        env: true,
      };

      const queryData = this.searchParams;
      const allQueryData = {
        ...queryData,
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
    if (this.$route.name !== 'vuln-intelligence-detail') {
      localStorage.removeItem('intelligence');
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
    .vuln-card {
      margin: 16px 0;
      cursor: pointer;
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
