<template>
  <cb-inner-page :background="false">
    <div class="toolMagazine page" style="height: 100%">
      <div class="condition-wrapper">
        <search-input
          style="margin-bottom: 24px"
          :placeholder-name="$t('m.pleaseEnterTool')"
          @sendSearchName="getSearchName"
        />
        <search
          :type-condition="$t('m.classify')"
          :type-lists="classifyList"
          @sendSearchCondition="getSearchClass"
        />
        <search
          :type-condition="$t('m.platform')"
          :type-lists="platformList"
          @sendSearchCondition="getSearchPlatform"
        />
        <search
          :type-condition="$t('m.authorization')"
          :type-lists="authorizationList"
          @sendSearchCondition="getSearchAuthorization"
        />
      </div>
      <div class="content">
        <template v-if="cardList.length > 0">
          <div
            v-for="item in cardList"
            :key="item.id"
            class="box-card second-background"
            @click="details(item)"
          >
            <div class="imgbox">
              <img :src="item.cover_url || toolDivBg" alt />
            </div>
            <div class="bottom-info">
              <div class="magazineName word-title">
                <div class="one-overflow" :title="item.name">
                  {{ item.name }}
                </div>
              </div>
              <div class="text-box word-title">
                <div
                  class="text-box-common one-overflow"
                  :title="item.category_i18n_name"
                >
                  <span style="vertical-align: middle">{{
                    item.category_i18n_name
                  }}</span>
                </div>
                <div
                  class="text-box-common one-overflow"
                  :title="item.platforms && item.platforms.join()"
                >
                  <span style="vertical-align: middle">{{
                    item.platforms && item.platforms.join()
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination-footer">
            <cb-pagination
              :current-page="pagination.current_page"
              :page-sizes="['10', '20', '30', '40', '50']"
              :page-size="pagination.per_page"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              style="text-align: right"
            >
            </cb-pagination>
          </div>
        </template>
        <div v-else>
          <div class="empty_pages">
            <div class="not-datas">
              <cb-iconfont :size="'94'" type="icon-zanwuziyuan"></cb-iconfont>
              <div class="text-data">{{ $t('m.noData') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import Search from '@/components/SearchCondition/Search.vue';
import SearchInput from '@/components/SearchCondition/SearchInputNew.vue';
import emptyPage from '@/pages/web/Empty';

export default {
  components: {
    Search,
    SearchInput,
    emptyPage,
  },
  filters: {},
  props: {
    breadcrumbName: {
      type: String,
      default: '',
    },
    crEventData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: true,
      search: '',
      resource_id: null,
      toolDivBg: require('@/assets/img/toolHomePage/magazine_default.png')
        .default,
      toolMagazine: this.$t('m.toolMagazine'),
      toolName: this.$t('m.resourceCenter'),
      secondaryName: this.$t('m.toolMagazine'),
      toolRouter: '/tool_home_page',
      pagination: {
        current_page: 1,
        from: 0,
        to: 0,
        last_page: 1,
        next_page_url: null,
        per_page: 10,
        prev_page_url: null,
        total: 1,
      },
      pagination2: {
        current_page: 1,
        from: 0,
        to: 0,
        last_page: 1,
        next_page_url: null,
        per_page: 12,
        prev_page_url: null,
        total: 1,
      },
      previous: this.$t('m.previous'),
      next: this.$t('m.next'),
      cardList: [],
      classifyList: [],
      platformList: [
        {
          id: 0,
          name: this.$t('m.all'),
          clicked: true,
          label: this.$t('m.all'),
          value: '',
        },
        {
          id: 1,
          name: 'Windows',
          clicked: false,
          label: 'Windows',
          value: 'windows',
        },
        {
          id: 2,
          name: 'Linux',
          clicked: false,
          label: 'Linux',
          value: 'linux',
        },
        {
          id: 3,
          name: 'Mac',
          clicked: false,
          label: 'Mac',
          value: 'mac',
        },
        {
          id: 4,
          name: 'IOS',
          clicked: false,
          label: 'IOS',
          value: 'ios',
        },
        {
          id: 5,
          name: 'Android',
          clicked: false,
          label: 'Android',
          value: 'android',
        },
        {
          id: 6,
          name: 'Others',
          clicked: false,
          label: 'Others',
          value: 'others',
        },
      ],
      authorizationList: [
        {
          id: 0,
          name: this.$t('m.all'),
          clicked: true,
          label: this.$t('m.all'),
          value: '',
        },
        {
          id: 1,
          name: this.$t('m.free'),
          clicked: false,
          label: this.$t('m.free'),
          value: 'free',
        },
        {
          id: 2,
          name: this.$t('m.fee'),
          clicked: false,
          label: this.$t('m.fee'),
          value: 'non-free',
        },
      ],
      category: null,
      cracked: '',
      platforms: '',
      ToolName: this.$t('m.resourceCenter'),
      ToolRouter: '/tool_home_page',
    };
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {
    this.getDataList();
    this.getDataClassify();
  },
  methods: {
    handleCurrentChange(val) {
      this.pagination.current_page = val;
      this.getDataList();
    },
    handleSizeChange(val) {
      this.pagination.current_page = 1;
      this.pagination.per_page = val;
      this.getDataList();
    },
    getDataList() {
      this.$request
        .get(
          '/cr/tools/list',
          {
            per_page: this.pagination.per_page,
            page: this.pagination.current_page,
            category: this.category,
            cracked: this.cracked,
            platforms: this.platforms,
            pattern: this.search,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.loading = false;
          const data = _.get(res, 'data.data.list', []);
          _.forEach(data, (item) => {
            this.$set(item, 'update_time_formate', item.publish_time);
          });
          this.cardList = data;
          this.pagination.total = _.get(res, 'data.data.total', 0);
          this.pagination.last_page = _.get(res, 'data.data.last_page', 0);
          this.pagination.current_page = _.get(
            res,
            'data.data.current_page',
            1,
          );
        });
    },
    // 获取分类
    getDataClassify() {
      this.$request
        .get('/cr/tool/category/list', {}, { baseURL: '/api/ojj' })
        .then((res) => {
          _.forEach(res.data.data, (item) => {
            this.$set(item, 'label', item.category_i18n_name);
            this.$set(item, 'value', item.resource_id);
          });
          this.classifyList = res.data.data;
          this.classifyList.unshift({
            value: '',
            label: this.$t('m.all'),
            clicked: true,
          });
        });
    },
    getSearchClass(params) {
      this.category = params;
      this.initializationTable();
      this.getDataList();
    },
    getSearchPlatform(params) {
      this.platforms = params;
      this.initializationTable();
      this.getDataList();
    },
    getSearchAuthorization(params) {
      this.cracked = params;
      this.initializationTable();
      this.getDataList();
    },
    getSearchName(val) {
      this.search = val;
      this.initializationTable();
      this.getDataList();
    },
    // 关键字查询
    keyword() {
      this.initializationTable();
      this.getDataList();
    },
    // 初始化表格
    initializationTable() {
      this.pagination.current_page = 1;
      this.cardList = [];
      this.loading = true;
    },
    // 跳转详情页
    details(item) {
      this.$router.push({
        path: `/tool_magazine_details/${item.resource_id}/`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  min-height: 500px;
}
.one-overflow {
  span {
    line-height: 22px;
  }
}
.pagination-footer {
  width: 100%;
}
.empty_pages {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .not-datas {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .text-data {
    text-align: center;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>
