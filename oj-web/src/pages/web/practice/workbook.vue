<template>
  <!-- 习题集详情 -->
  <div class="workbook-wrapper">
    <div class="practice-wrapper">
      <div class="practice-header bg">
        <div class="img-box">
          <WorkBookCard
            :logo="(practiceSetInfo && practiceSetInfo.logo) || defaultLogo"
            :logo-is-built-in="
              practiceSetInfo && practiceSetInfo.logo_is_built_in
            "
            :name="practiceSetInfo && practiceSetInfo.name"
          />
        </div>
        <div class="info-wrapper">
          <div class="work-name">
            {{ practiceSetInfo && practiceSetInfo.name }}
          </div>
          <div class="count-creator">
            <div class="count-box">
              <cb-iconfont type="icon-jianda1" />
              <span class="label">{{ $t('practice.topicCountWork') }}：</span>
              <span class="value">
                {{ practiceSetInfo && practiceSetInfo.practice_count }}</span
              >
            </div>
            <div class="creator-box">
              <cb-iconfont type="icon-yonghu" />
              <span class="label">{{ $t('practice.topicCreator') }}：</span>
              <span class="value">
                {{
                  (practiceSetInfo && practiceSetInfo.create_user_name) || '-'
                }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="practice-content bg">
        <div class="tabs-content">
          <div class="category-filter">
            <cb-filter-condition
              class="filter-condition-width"
              v-model="defaultValue"
              :filter-list="guid.list"
              :props="{ label: 'name', value: 'resource_id' }"
              @change="getCategory"
              :height="32"
            ></cb-filter-condition>
          </div>

          <div class="classify-list">
            <!-- v-if="type == TYPE.CaptureFlag" -->
            <cb-select
              v-model="list.difficulty"
              :options="difficultLists"
              clearable
              :placeholder="$t('practice.allDifficult')"
              titleField="name"
              valueField="resource_id"
              class="mr10"
              @change="difficultyChange"
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
              :placeholderName="$t('practice.plzEnterTitle')"
              v-model="list.pattern"
              @change="nameChange"
            ></cb-search-input>
          </div>
          <!-- 表格 -->
          <cb-search-table
            v-if="type === TYPE.Rationale"
            :cols="columns"
            :fetchPromise="fetchPromise"
            :data="list"
            :searchBarBg="false"
          >
            <!-- 理论习题集题目名称 -->
            <template v-slot:content="scope">
              <div
                type="text"
                style="cursor: pointer"
                @click="toDetail(scope.data)"
                class="title-content"
                :title="scope.data.content"
              >
                <span
                  :class="{
                    'green-box': scope.data.solved === 1,
                    'orange-box': scope.data.solved === 0,
                    'gray-box': scope.data.solved === 2,
                  }"
                >
                  {{ statusComputed(scope.data.solved) }}
                </span>

                <span v-if="type === TYPE.Rationale">
                  【{{ getName(typeLists, scope.data.theory_type) }}】
                </span>
                {{ scope.data.content }}
              </div>
            </template>

            <!-- 方向 -->
            <template v-slot:category="scope">
              <div
                class="category-content-com one-overflow"
                :title="
                  scope.data.category_id &&
                  getName(guid.list, scope.data.category_id)
                "
              >
                {{
                  scope.data.category_id &&
                  getName(guid.list, scope.data.category_id)
                }}
              </div>
            </template>
            <!-- 难度 -->
            <template v-slot:difficulty="scope">
              <div>
                <span
                  :class="{
                    lower: scope.data.difficulty % 3 === 0,
                    middle: scope.data.difficulty % 3 === 1,
                    high: scope.data.difficulty % 3 === 2,
                  }"
                >
                  {{ getName(difficultLists, scope.data.difficulty) }}
                </span>
              </div>
            </template>
          </cb-search-table>
          <div v-else class="flag-boxs">
            <div v-if="dataLists.length > 0" class="item-wrapper">
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
            <div v-if="dataLists.length > 0" class="pagination-wrapper">
              <cb-pagination
                :total="pagination.total"
                :current-page="pagination.currentPage"
                :current="pagination.currentPage"
                :page-size.sync="pagination.per_page"
                :showSizeChanger="false"
                @current-change="handleChange"
              ></cb-pagination>
            </div>
            <div v-else class="empty-box" style="height: 240px">
              <Empty />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-wrapper">
      <div class="current-progress-wrapper bg">
        <Block :title="$t('practice.currentProgress')"></Block>
        <CurrentProgress
          v-loading="loadingProgress"
          :currentProgressInfo="currentProgressInfo"
        />
      </div>
      <div class="more-workbook bg">
        <Block :title="$t('practice.moreWorkSets')"></Block>
        <MoreWorkbook :type="type" :practiceSetId="list.practice_set_id" />
      </div>
    </div>
  </div>
</template>
<script>
import { getRationaleListApi, getCaptureFlagListApi } from '@/api/practice';
import Empty from '@/components/empty/index.vue';
import searchInput from './components/search-input.vue';
import { STATUSTYPE, TYPE, DIFFICULTY } from './constant';
import _ from 'lodash';
import Block from '@/components/block';
import WorkBookCard from './components/workbook-card.vue';
import Default from '@/assets/img/course/logo.jpg';
import CurrentProgress from './components/current-progress.vue';
import MoreWorkbook from './components/more-workbook.vue';
import FlagCard from './components/flag-card.vue';
import {
  getCurrentProgressApi,
  getCurrentProgressFlagApi,
  getCategoryListsApi,
  getWorkBookDetail,
} from '@/api/practice.ts';
import { getComConstantsConfig } from '@/api/common.js';

export default {
  components: {
    Empty,
    searchInput,
    Block,
    WorkBookCard,
    CurrentProgress,
    MoreWorkbook,
    FlagCard,
  },
  data() {
    return {
      logo: '',
      defaultLogo: Default,
      // 难度分类数据
      difficultLists: [],
      // 状态分类数据
      statusLists: [],
      typeLists: [], // 题目类型
      STATUSTYPE,
      TYPE,
      DIFFICULTY,
      columns: [],
      rationaleColumns: [
        {
          label: this.$t('m.practiceTable.questionTitle'), // 题目名称
          slot: 'content',
        },

        {
          label: this.$t('m.category'), // 方向
          width: '15%',
          slot: 'category',
        },

        {
          label: '难度', // 状态
          width: '8%',
          slot: 'difficulty',
        },
      ],
      type: '',
      defaultValue: null,
      // practiceSetName: '',
      list: {
        pattern: '', // 列表搜索的name
        practice_set_id: '', // 习题集的resource_id
        category_id: '', // 列表方向（类型）resource_id
        solved: '', // 列表状态 (1: 解出, 0:未解出)
        sort: '', // 列表排序
        difficulty: '',
      },
      tableData: [],
      guidList: [],

      guid: {
        title: this.$t('m.category'), // 方向
        list: [],
      },

      currentProgressInfo: {}, // 当前进度信息
      loadingProgress: false,
      dataLists: [], // 实操习题集
      pagination: {
        currentPage: 1,
        per_page: 30,
        total: 0,
      },
      practiceSetInfo: {}, // 习题集详情
    };
  },
  computed: {},

  created() {
    if (this.$router.history.current.name === 'rationale') {
      this.columns = this.rationaleColumns;
    }
  },
  mounted() {
    const pagename = {
      rationale: {
        id: TYPE.Rationale,
        name: this.$t('m.rationale'),
      },
      'capture-flag': {
        id: TYPE.CaptureFlag,
        name: this.$t('m.captureFlag'),
      },
    };
    this.type = pagename[this.$route.name].id;
    this.list.practice_set_id = this.$route.params.id;
    this.getGuidList(); // 方向(类型)页签data
    this.getDifficultList();
    this.getStatusList();
    this.getTopicType();
    this.getCurrentProgress();
    if (this.type === TYPE.CaptureFlag) {
      this.getDatas();
    }
    this.getWorkBookDetailTh();
  },
  methods: {
    // 获取习题集详情
    getWorkBookDetailTh() {
      getWorkBookDetail({
        resource_id: this.list.practice_set_id,
      }).then((res) => {
        const data = _.get(res, 'data.data', {});
        this.practiceSetInfo = data;
      });
    },

    // 获取实操题表格数据
    getDatas() {
      getCaptureFlagListApi({
        pattern: this.list.pattern,
        practice_set_id: this.list.practice_set_id,
        categoryId: this.list.category_id,
        solved: this.list.solved,
        difficulty: this.list.difficulty,
        per_page: this.pagination.per_page,
        page: this.pagination.currentPage,
      }).then((res) => {
        const data = _.get(res, 'data.data');
        this.pagination.total = data.total;
        this.dataLists = data.list;
      });
    },
    difficultyChange(val) {
      if (this.type === TYPE.CaptureFlag) {
        this.list.difficulty = val;
        this.pagination.currentPage = 1;
        this.getDatas();
      }
    },
    statusChange(val) {
      if (this.type === TYPE.CaptureFlag) {
        this.list.solved = val;
        this.pagination.currentPage = 1;
        this.getDatas();
      }
    },
    nameChange(val) {
      if (this.type === TYPE.CaptureFlag) {
        this.list.pattern = val;
        this.pagination.currentPage = 1;
        this.getDatas();
      }
    },
    handleChange(val) {
      this.pagination.currentPage = val;
      this.getDatas();
    },
    getCurrentProgress() {
      this.loadingProgress = true;
      if (this.type === TYPE.Rationale) {
        getCurrentProgressApi({
          practice_set_id: this.list.practice_set_id,
        }).then((res) => {
          this.currentProgressInfo = _.get(res, 'data.data', {});
          this.loadingProgress = false;
        });
      } else {
        getCurrentProgressFlagApi({
          practice_set_id: this.list.practice_set_id,
        }).then((res) => {
          this.currentProgressInfo = _.get(res, 'data.data', {});
          this.loadingProgress = false;
        });
      }
    },
    getName(list, id) {
      const data = list.filter((item) => item.resource_id === id);
      return data.length && data[0].name;
    },
    //获取题目类型 type:21
    getTopicType() {
      getComConstantsConfig({ type: 21 }).then((res) => {
        let arr = res.data.data;
        arr = arr.map((item) => {
          return {
            resource_id: item.code,
            name: item.name,
          };
        });
        this.typeLists = arr;
      });
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
        this.diffList = arr;
        this.difficultLists = arr;
      });
    },
    // 获取状态
    getStatusList() {
      getComConstantsConfig({
        type: this.type === TYPE.Rationale ? 39 : 11,
      }).then((res) => {
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
    //请求获取table表格列表
    fetchPromise(queryData) {
      return getRationaleListApi({ ...queryData })
        .then((res) => {
          return res;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getCategory(data) {
      this.list.category_id = data.resource_id;
      if (this.type === TYPE.CaptureFlag) {
        this.pagination.currentPage = 1;
        this.getDatas();
      }
    },
    getSearchName(name) {
      this.list.pattern = name;
    },
    getGuidList() {
      // 方向页签列表获取
      // 分类类型 0=理论基础 2=实践操作
      getCategoryListsApi({
        practice_type: this.type,
        practice_set_id: this.list.practice_set_id,
      }).then((res) => {
        const arr = {
          name: this.$t('practice.allCategory'),
          resource_id: null,
        };
        const newData = _.get(res, 'data.data');
        this.guid.list = newData;
        this.guidList = newData;
        this.guid.list.unshift(arr);
      });
    },
    toDetail(row) {
      if (this.type === TYPE.Rationale) {
        this.$router.push({
          path: `/practice/rationale/exercise-details/${row.resource_id}`,
          query: {
            practice_set_id: this.list.practice_set_id,
            from: 'practice_set',
          },
        });
      } else if (this.type === TYPE.CaptureFlag) {
        this.$router.push({
          path: `/practice/capture-flag/exercise-details/${row.resource_id}`,
          query: {
            practice_set_id: this.list.practice_set_id,
            from: 'practice_set',
          },
        });
      }
    },
  },
};
</script>
<style scoped lang="scss">
.workbook-wrapper {
  display: flex;
  .bg {
    background: var(--bg-color-2);
    border-radius: 4px;
  }
  .practice-wrapper {
    width: calc(100% - 280px);

    .practice-header {
      min-height: 136px;
      margin-bottom: 12px;
      padding: 16px;
      display: flex;
      .img-box {
        max-width: 183px;
        max-height: 104px;
        flex: 1;
      }
      .info-wrapper {
        margin-left: 16px;
        width: calc(100% - 214px);
        .work-name {
          font-size: 20px;
          font-weight: 600;
          color: var(--neutral8);
          line-height: 20px;
          margin-top: 14px;
        }

        .count-creator {
          margin-top: 42px;
          display: flex;
          font-size: 14px;
          line-height: 22px;
          .creator-box {
            margin-left: 24px;
          }
          .label {
            color: var(--neutral5);
          }
          .value {
            color: var(--neutral8);
          }
        }
      }
    }
    .practice-content {
      padding: 16px;
      .classify-list {
        margin: 8px 0 16px;
        display: flex;
        justify-content: flex-start;
      }
    }
  }
  .right-wrapper {
    width: 264px;
    margin-left: 16px;
    .current-progress-wrapper {
      height: 257px;
      margin-bottom: 12px;
      padding: 12px 16px;
    }
    .more-workbook {
      max-height: 593px;
      padding: 12px 0 12px 16px;
    }
  }
}
.title-content {
  text-overflow: ellipsis;
  display: -webkit-box;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.high {
  color: var(--red-color);
}
.middle {
  color: var(--orange-color);
}
.lower {
  color: var(--green-color);
}
.flag-boxs {
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
}
</style>
