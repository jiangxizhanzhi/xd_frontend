<template>
  <!-- 实践操作 -->
  <cb-inner-page :background="false" style="padding-top: 0">
    <div class="practice-wrapper">
      <div class="top-wrapper">
        <div class="workbook-wrapper bg">
          <Block :title="$t('practice.workbookSet')"></Block>
          <WorkBook :type="type" @toWorkbook="toWorkbook" />
        </div>
        <div class="my-practice-wrapper bg">
          <Block :title="$t('practice.myPractice')"></Block>
          <MyPractice
            :type="type"
            :collectionCount="collectionCount"
            :noteCount="noteCount"
            @go-other="goPerson"
          />
        </div>
      </div>
      <div class="bottom-wrapper">
        <div class="left-wrapper bg">
          <div class="filter-category">
            <cb-filter-condition
              class="filter-condition-width"
              v-model="defaultValue"
              :filter-list="guid.list"
              :props="{ label: 'name', value: 'resource_id' }"
              @change="getCategory"
              :height="32"
            ></cb-filter-condition>
          </div>
          <div class="select-filter">
            <cb-select
              width="200px"
              v-model="knowledgeList"
              multiple
              collapse-tags
              popper-class="knowledge-point-multi-select"
              class="mr10 knowledge-select"
              :placeholder="$t('practice.knowledge')"
              @change="knowledgeChange"
              clearable
            >
              <div>
                <div class="search-area cyber-scroll-bar-small">
                  <div class="filter-area">
                    <cb-search-input
                      :placeholder="$t('practice.plzInputKnowledge')"
                      v-model="knowledgeFilter"
                      trigger="lazy"
                      clearable
                    ></cb-search-input>
                  </div>
                  <div class="options-content">
                    <template v-if="filterKnowledgeListOptions.length > 0">
                      <cb-option
                        class="options-content-item"
                        v-for="(item, index) in filterKnowledgeListOptions"
                        :key="index"
                        :label="
                          item.label.length > 6
                            ? item.label.slice(0, 6) + '...'
                            : item.label
                        "
                        :value="item.value"
                        :title="item.label"
                      ></cb-option>
                    </template>
                    <template v-else>
                      <div class="no-data">{{ $t('practice.noData') }}</div>
                    </template>
                  </div>
                </div>
                <div class="reset-area">
                  <cb-button
                    icon="icon-genghuan"
                    type="text"
                    id="reset"
                    @click="resetKnowledgeSelect"
                    >{{ $t('practice.reset') }}</cb-button
                  >
                </div>
              </div>
            </cb-select>
            <cb-select
              v-model="list.difficulty"
              :options="difficultLists"
              clearable
              :placeholder="$t('practice.allDifficult')"
              titleField="name"
              valueField="resource_id"
              class="mr10"
              @change="difficultChange"
              :first="{
                resource_id: '',
                name: $t('practice.allDifficult'),
              }"
            ></cb-select>
            <cb-select
              v-model="list.solved"
              :options="statusLists"
              clearable
              :placeholder="$t('practice.allStatus')"
              titleField="name"
              valueField="resource_id"
              class="mr10"
              @change="statusChange"
              :first="{
                resource_id: '',
                name: $t('practice.allStatus'),
              }"
            ></cb-select>
            <cb-search-input
              :placeholder="$t('m.namePh')"
              v-model="list.pattern"
              @change="getSearchName"
            ></cb-search-input>
          </div>
          <div
            v-if="dataLists.length > 0 && !loading"
            class="item-wrapper"
            v-loading="loading"
          >
            <div
              v-for="(item, index) in dataLists"
              :key="index"
              class="item-detail"
            >
              <FlagCard
                :statusLists="statusLists"
                :difficultLists="difficultLists"
                :categoryLists="guid.list"
                :tableData="item"
                @flag-click="toDetail"
              />
            </div>
          </div>
          <div
            v-if="dataLists.length > 0 && !loading"
            class="pagination-wrapper"
          >
            <cb-pagination
              :total="pagination.total"
              :current-page="pagination.currentPage"
              :current="pagination.currentPage"
              :page-size.sync="pagination.per_page"
              :showSizeChanger="false"
              @current-change="handleChange"
            ></cb-pagination>
          </div>
          <div
            v-if="dataLists.length === 0"
            class="empty-box"
            style="height: 240px"
          >
            <Empty />
          </div>
        </div>
        <div class="right-wrapper">
          <div class="my-progress-wrapper bg">
            <Block :title="$t('practice.knowledgeSkillsTop6')"></Block>
            <RadarTopSix :radar-data="radarData" />
          </div>
          <div class="practice-record-wrapper bg">
            <Block :title="$t('practice.solvedRecord')"></Block>
            <!-- 解出记录 此type指自由练习 自由组卷 实操 -->
            <StudyRecord
              type="flag"
              :statusLists="statusLists"
              :list="fiveRecordList"
              @seeMore="seeMore"
              @go-detail="goDetail"
            />
          </div>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import Block from '@/components/block';
import WorkBook from '../components/workbook.vue';
import MyPractice from '../components/my-practice.vue';
import RadarTopSix from '../components/radar-top-six.vue';
import StudyRecord from '../components/study-record.vue';
import FlagCard from '../components/flag-card.vue';
import Empty from '@/components/empty/index.vue';
import courseCard from '@/components/course-card/index';
import _ from 'lodash';
import { STATUSTYPE, DIFFICULTY, TYPE, COMMENTYPE } from '../constant';
import { getComConstantsConfig } from '@/api/common.js';
import {
  getCaptureFlagListApi,
  getStaticsFlag,
  getFlagResolvedFive,
  getFlagKnowSkillTop6,
  getKnowledgeList,
} from '@/api/practice.ts';
export default {
  components: {
    Empty,
    courseCard,
    Block,
    WorkBook,
    MyPractice,
    RadarTopSix,
    StudyRecord,
    FlagCard,
  },
  data() {
    return {
      loading: null,
      STATUSTYPE,
      DIFFICULTY,
      TYPE,
      COMMENTYPE,
      // 难度分类数据
      difficultLists: [],
      statusLists: [],
      defaultValue: null,
      type: TYPE.CaptureFlag,
      list: {
        pattern: '', // 列表搜索的name
        categoryId: '', // 列表方向（类型）resource_id
        solved: '', // 列表状态 (true: 解出, false:未解出)
        difficulty: '',
        sort: '', // 列表排序
        knowledge: '',
      },
      pagination: {
        currentPage: 1,
        per_page: 30,
        total: 0,
      },
      guidList: [],
      guid: {
        title: this.$t('m.category'), // 方向
        list: [],
      },
      status: {
        title: this.$t('m.statusTitle'), // 状态
      },
      difficulty: {
        title: this.$t('m.difficulty'), //难度
      },
      dataLists: [],
      fiveRecordList: [], // 最近5条解出记录
      radarData: [], //知识技能top6  数据
      collectionCount: 0,
      noteCount: 0,
      knowledgeList: [], // 选中的知识点数据
      knowledgeListOptions: [], // 知识点列表，用作select组件的options
      // filterKnowledgeListOptions: [], // 筛选之后的知识点列表数据
      knowledgeFilter: '',
    };
  },
  computed: {
    filterKnowledgeListOptions() {
      return this.knowledgeFilter
        ? this.knowledgeListOptions.filter((item) => {
            return item.label.indexOf(this.knowledgeFilter) > -1;
          })
        : this.knowledgeListOptions;
    },
  },
  created() {
    this.getGuidList();
    this.getDifficultList();
    this.getStatusList();
    this.getStatics();
    this.getFlagResolvedFiveTh();
    this.getFlagKnowSkillTop6Th();
    this.getLocalKnowledgeList(); // 知识点列表数据
  },
  mounted() {
    this.getDatas();
  },
  methods: {
    goPerson(val) {
      const path = `/page/mg/personal?to=${val}&type=flag`;
      window.open(`${path}`, '_self');
    },
    // 获取 我的练习 统计
    getStatics() {
      getStaticsFlag().then((res) => {
        const data = _.get(res, 'data.data');
        this.collectionCount = data?.collection;
        this.noteCount = data?.note;
      });
    },
    // 获取知识技能Top6
    getFlagKnowSkillTop6Th() {
      getFlagKnowSkillTop6().then((res) => {
        const data = _.get(res, 'data.data');
        this.radarData = data;
      });
    },
    // 获取实操题表格数据
    getDatas() {
      // this.dataLists=[]
      this.loading = true;
      getCaptureFlagListApi({
        pattern: this.list.pattern,
        categoryId: this.list.categoryId,
        solved: this.list.solved,
        difficulty: this.list.difficulty,
        knowledge: this.list.knowledge,
        per_page: this.pagination.per_page,
        page: this.pagination.currentPage,
      })
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.pagination.total = data.total;
          this.dataLists = data.list;
          this.loading = false;
        })
        .finally(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 方向
    tableDataComputed(id) {
      const { guidList = [] } = this;
      const data = guidList.filter((item) => item.resource_id === id);
      return data.length && data[0].name;
    },
    // 列表难度
    difficultComputed(id) {
      const { difficultLists = [] } = this;
      const data = difficultLists.filter((item) => item.resource_id === id);
      if (data.length) {
        return data[0].name;
      }
    },
    // 列表状态计算
    statusComputed(status) {
      const data = this.statusLists.filter(
        (item) => item.resource_id === Number(status),
      );
      if (data.length) {
        return data[0].name;
      }
    },
    // 知识点搜索
    knowledgeChange() {
      this.list.knowledge = this.knowledgeList.join();
      this.pagination.currentPage = 1;
      this.getDatas();
    },
    // 方向搜索
    getCategory(data) {
      this.list.categoryId = data.resource_id;
      this.pagination.currentPage = 1;
      this.getDatas();
    },
    // 搜索
    getSearchName(name) {
      this.list.pattern = name;
      this.pagination.currentPage = 1;
      this.getDatas();
    },
    difficultChange(val) {
      this.list.difficulty = val;
      this.pagination.currentPage = 1;
      this.getDatas();
    },
    statusChange(val) {
      this.list.solved = val;
      this.pagination.currentPage = 1;
      this.getDatas();
    },
    handleChange(val) {
      this.pagination.currentPage = val;
      this.getDatas();
    },
    // 方向(类型)页签列表获取
    getGuidList() {
      const that = this;
      // 分类类型 0=理论基础 2=实践操作
      this.$request
        .get(
          '/oj/practice/category/list',
          {
            practice_type: this.type,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          const arr = {
            name: this.$t('practice.allCategory'),
            resource_id: null,
          };
          const newData = _.get(resp, 'data.data');
          that.guid.list = newData;
          that.guidList = newData;
          that.guid.list.unshift(arr);
        });
    },

    // 获取难度
    getDifficultList() {
      getComConstantsConfig({ type: 10 }).then((res) => {
        let arr = res.data.data;
        arr = arr.map((item) => {
          return {
            resource_id: item.code,
            name: item.name,
          };
        });
        this.difficultLists = arr;
      });
    },
    // 获取状态
    getStatusList() {
      getComConstantsConfig({ type: 11 }).then((res) => {
        let arr = res.data.data;
        arr = arr.map((item) => {
          return {
            resource_id: item.code,
            name: item.name,
          };
        });
        this.statusLists = arr;
      });
    },
    toWorkbook(row) {
      // sessionStorage.setItem('practice_set_name', JSON.stringify(row.name));
      this.$router.push({
        path: `/practice/capture-flag/list/${row.resource_id}`,
      });
    },
    toDetail(row) {
      this.$router.push({
        path: `/practice/capture-flag/exercise-details/${row.resource_id}`,
        query: {
          from: 'normal',
        },
      });
    },
    // 解题记录-查看更多
    seeMore() {
      this.$router.push({
        path: `/capture-flag/record`,
      });
    },
    goDetail(row) {
      this.$router.push({
        path: `/practice/capture-flag/exercise-details/${row.practice_id}`,
        query: {
          from: 'record',
        },
      });
    },
    // 获取最近5条解出记录
    getFlagResolvedFiveTh() {
      getFlagResolvedFive().then((res) => {
        const data = _.get(res, 'data.data');
        this.fiveRecordList = data;
      });
    },
    // 获取知识点列表数据，用于select的options选项
    getLocalKnowledgeList() {
      getKnowledgeList().then((res) => {
        const tempData = _.get(res, 'data.data', []) || [];
        this.knowledgeListOptions = tempData.map((item) => {
          return {
            label: item,
            value: item,
          };
        });
      });
    },
    // 清空选中的知识点, 清空筛选条件
    resetKnowledgeSelect() {
      this.knowledgeFilter = '';
      this.knowledgeList = [];
      this.knowledgeChange();
    },
  },
};
</script>
<style scoped lang="scss">
.filter-condition-width {
  width: 100%;
}
</style>
<style lang="scss" scoped>
.bg {
  background: var(--bg-color-2);
  border-radius: 4px;
}
.practice-wrapper {
  overflow: hidden;
  .top-wrapper {
    display: flex;
    .workbook-wrapper {
      min-height: 210px;
      width: calc(100% - 280px);
      margin-right: 16px;
      padding: 12px 16px;
    }
    .my-practice-wrapper {
      min-height: 210px;
      width: 264px;
      padding: 12px 16px;
    }
  }
  .bottom-wrapper {
    display: flex;
  }
  .left-wrapper {
    margin-right: 16px;
    margin-top: 12px;
    padding: 16px;
    width: calc(100% - 280px);
    .select-filter {
      margin: 8px 0 16px;
      display: flex;
      justify-content: flex-start;
    }
  }
  .item-wrapper {
    display: flex;
    flex-flow: row wrap;
    // 1920屏幕
    .item-detail {
      width: calc(16.6% - 10px);
      margin-right: 12px;
      margin-bottom: 16px;
      &:nth-child(5n) {
        margin-right: 12px;
      }
      &:nth-child(6n) {
        margin-right: 0;
      }
    }
    // 1440屏幕
    @media screen and (max-width: 1440px) {
      .item-detail {
        width: calc(20% - 10px);
        margin-right: 12px;
        margin-bottom: 16px;
        &:nth-child(5n) {
          margin-right: 0;
        }
        &:nth-child(6n) {
          margin-right: 12px;
        }
      }
    }
  }
  .right-wrapper {
    width: 264px;
    .my-progress-wrapper {
      height: 257px;
      margin: 12px 0;
      padding: 12px 16px;
    }
    .practice-record-wrapper {
      padding: 12px 16px 0;
    }
  }
}
</style>
<style lang="scss">
.select-filter {
  .knowledge-select {
    .el-tag {
      height: 22px !important;
    }
  }
}
.knowledge-point-multi-select {
  padding: 16px 16px 0 16px;
  min-width: 232px !important;
  max-width: 238px !important;
  .el-select-dropdown__item {
    height: 22px;
    line-height: 22px;
  }
  .search-area {
    max-height: 165px;
    margin-bottom: 16px;
    overflow-y: auto;
    .filter-area {
      width: 200px;
      height: 32px;
      .cb-search-input {
        width: 200px !important;
      }
    }
    .options-content {
      margin-top: 12px;
      margin-left: -2px;
      display: flex;
      flex-wrap: wrap;
      .options-content-item {
        margin: 4px 2px;
        padding: 0 5px;
        font-size: 12px;
        font-weight: 400;
        background: var(--neutral0);
        border-radius: 2px;
      }
      .options-content-item::after {
        display: none;
      }
      .no-data {
        width: 100%;
        height: 40px;
        line-height: 40px;
        color: var(--neutral8);
        text-align: center;
      }
    }
  }
  .reset-area {
    padding-top: 5px;
    border-top: 1px solid var(--neutral0);
    color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 12px;
    height: 32px;
    .reset-area-icon {
      cursor: pointer;
    }
    .reset-area-info {
      margin-left: 4px;
      cursor: pointer;
    }
    .cb-button {
      position: absolute;
      right: 0;
    }
  }
  .el-scrollbar {
    display: block !important;
  }
  .el-select-dropdown__empty {
    display: none;
  }
}
</style>
