<template>
  <cb-inner-page :background="true" title="单兵训练">
    <div class="single-train-page page" style="height: 100%">
      <!-- 筛选区域 -->
      <div class="condition-wrap">
        <div class="search-wrap">
          <cb-select
            v-model="searchCondition.category"
            :options="categoryList"
            @change="categoryChange"
          ></cb-select>
          <cb-select
            class="search-item"
            v-model="searchCondition.difficult"
            :options="difficultList"
            @change="difficultChange"
          ></cb-select>
          <cb-search-input
            class="search-item"
            v-model="searchCondition.pattern"
            :placeholder="$t('list.enterTrainName')"
            @change="getSearchName"
          />
          <cb-button
            ml
            mr
            class="search"
            @click="handlerSearch"
          >搜索</cb-button>
          <cb-button
            hollow
            class="reset"
            @click="handlerReset"
          >重置</cb-button>
        </div>
      </div>
      <!-- 我的训练 -->
      <div v-loading="loading" class="train_lists train_list_tabs">
        <div
          :key="item.resource_id"
          v-for="item in trainList"
          @click="goSceneTopology(item)"
        >
          <my-train
            :item-data="item"
            :difficult-list="difficultList"
            :category-list="categoryList"
            @attEngageEvent="attEngageShow"
          ></my-train>
        </div>
        <!-- 暂无数据 -->
        <div
          v-if="!trainList.length && !loading"
          class="empty-comp"
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        >
          <empty-page ref="emptyComp" />
        </div>
      </div>
      <!-- 我的训练分页组件 -->
      <div v-if="trainList.length && !loading" class="train_page">
        <cb-pagination
          background
          class="elc-pagination"
          :current-page="pagination.current_page"
          layout="total,sizes, prev, pager, next,jumper"
          :total="pagination.total"
          :page-size.sync="pagination.per_page"
          :page-sizes="['10', '20', '30', '50', '100']"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current="pagination.current_page"
          style="text-align: right"
        >
          <span class="total_span"
            >{{ $t('m.totalPage')
            }}<span class="total-num">{{ pagination.total }}</span>
            <template v-if="pagination.total > 1">
              {{ $t('m.totalRecord') }}
            </template>
            <template v-else>
              {{ $t('m.totalRecordSingular') }}
            </template>
          </span>
        </cb-pagination>
      </div>
    </div>
    <!-- ATT&CK弹框 -->
    <cb-dialog
      width="1430px"
      height="calc(100vh - 220px)"
      class="att-engage-dialog"
      :title="$t('ATT&CK')"
      :visible.sync="attDialogVisible"
      center="center"
    >
      <att-ck-dialog :id="resource_id_related"></att-ck-dialog>
    </cb-dialog>
    <!-- Engage弹框 -->
    <cb-dialog
      width="1430px"
      height="calc(100vh - 220px)"
      class="att-engage-dialog"
      :title="$t('Engage')"
      :visible.sync="engageDialogVisible"
      center="center"
    >
      <engage-dialog :id="resource_id_related"></engage-dialog>
    </cb-dialog>
  </cb-inner-page>
</template>
<script>
import _ from 'lodash';
import emptyPage from '@/pages/web/Empty';
import SearchInput from '@/components/SearchCondition/SearchInput.vue';
import {
  getTrainingCategory,
  getDifficultLists,
  getTrainList,
} from '@/api/web/single-train';
import collapseTransition from '@/components/collapase/index';
import myTrain from '@/components/PublicList/my-train.vue';
import AttCkDialog from '@/components/att-engage/att-ck-dialog.vue';
import EngageDialog from '@/components/att-engage/engage-dialog.vue';

export default {
  name: 'redBlueList',
  components: {
    collapseTransition,
    myTrain,
    emptyPage,
    SearchInput,
    AttCkDialog,
    EngageDialog,
  },
  data() {
    return {
      categoryList: [],
      difficultList: [],
      searchCondition: {
        pattern: '',
        difficult: '',
        category: '',
        with_instance: 1,
      },
      loading: true,
      trainList: [],
      // 我的训练分页
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
      },
      resource_id_related: '',
      attDialogVisible: false,
      engageDialogVisible: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getTrainingCategory();
    this.getDifficultLists();
    this.getTrainList();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    getTrainingCategory() {
      getTrainingCategory({ type: 3 }).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.categoryList = data.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
        this.categoryList.unshift({
          label: this.$t('list.allTraining'),
          value: '',
        });
      });
    },
    getDifficultLists() {
      getDifficultLists({ type: 22 }).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.difficultList = data.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
        this.difficultList.unshift({
          label: this.$t('list.allDifficulty'),
          value: '',
        });
      });
    },
    // 获取我的训练列表
    getTrainList() {
      const searchParams = this.searchCondition;
      searchParams.page = this.pagination.current_page;
      searchParams.per_page = this.pagination.per_page;
      searchParams.with_instance = 1;
      this.loading = true;
      getTrainList(searchParams).then((res) => {
        const data = _.get(res, 'data.data', []);
        _.forEach(data.list, (item, index) => {
          if (!item.room_info) {
            this.$set(item, 'training_status', 4);
          } else if (item.room_info && item.room_info.end_time) {
            this.$set(item, 'training_status', 2);
          } else {
            this.$set(item, 'training_status', 1);
          }
          this.$set(item, 'name', item.event_data.name);
          this.$set(item, 'difficult', item.event_data.difficult);
          this.$set(item, 'duration_time', item.event_data.duration_time);
          this.$set(item, 'category', item.event_data.category);
          this.$set(item, 'pre_skill', item.event_data.pre_skill);
          this.$set(item, 'train_skill', item.event_data.train_skill);
          this.$set(item, 'description', item.event_data.description);
          this.$set(item, 'nodes_count', item.nodes_count_data);
        });
        this.trainList = res.data.data.list;
        this.pagination.total = res.data.data.total;
        window.scrollTo(0, 0);
        this.loading = false;
      });
    },

    // 我的训练分类筛选
    categoryChange(val) {
      this.searchCondition.category = val;
      this.pagination.current_page = 1;
      this.getTrainList();
    },
    // 我的训练难度筛选
    difficultChange(val) {
      this.searchCondition.difficult = val;
      this.pagination.current_page = 1;
      this.getTrainList();
    },
    // 我的训练搜索
    handlerSearch() {
      this.getTrainList();
    },
    // 我的训练重置
    handlerReset() {
      this.searchCondition.pattern = '';
      this.searchCondition.difficult = '';
      this.searchCondition.category = '';
      this.searchCondition.with_instance = 1;
      this.pagination.current_page = 1;
      this.pagination.per_page = 10;
      this.getTrainList();
    },
    // 我的训练名称搜索
    getSearchName(val) {
      this.searchCondition.pattern = val;
      this.pagination.current_page = 1;
      this.getTrainList();
    },
    // 我的训练当前页
    handleCurrentChange(val) {
      this.pagination.current_page = val;
      this.getTrainList();
    },
    // 我的训练分页大小
    handleSizeChange(val) {
      this.pagination.current_page = 1;
      this.pagination.per_page = val;
      this.getTrainList();
    },

    // ATT&CK 、Engage点击
    attEngageShow(data, type) {
      this.resource_id_related = data.resource_id;
      if (type) {
        this.attDialogVisible = true;
      } else {
        this.engageDialogVisible = true;
      }
    },
    // 跳转详情页面
    goSceneTopology(item) {
      const url = this.$router.resolve({
        path: `/single_train/${item.resource_id}/`,
      });
      window.open(url.href, '_self');
      // this.$router.push({
      //   path: `/single_train/${item.resource_id}/`,
      // });
    },
  },
};
</script>
<style lang="scss" scoped>
.arrowTransform {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}
// engage、attck弹窗样式
.arrowTransformReturn {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(180deg);
}
.att-engage-dialog {
  ::v-deep .el-dialog {
    margin-top: 8vh !important;
  }
  ::v-deep .cb-scrollbar.overflow-x-disable .el-scrollbar .el-scrollbar__wrap {
    overflow-x: auto !important;
  }
  ::v-deep
    .cb-scrollbar.overflow-x-disable
    .el-scrollbar
    .el-scrollbar__wrap::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::v-deep
    .cb-scrollbar.overflow-x-disable
    .el-scrollbar
    .el-scrollbar__wrap::-webkit-scrollbar-thumb {
    background: var(--scrollbar-color);
    border-radius: 6px;
  }
}
.single-train-page {
  .condition-wrap {
    margin-bottom: 16px;
    background-color: var(--bg-color-2);
    padding: 16px;
    .search-wrap {
      display: flex;
      .search-item {
        margin-left: 10px;
      }
    }
  }
  .train_lists {
    position: relative;
    height: calc(100% - 180px);
  }
}
</style>
