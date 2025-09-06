<template>
  <cb-inner-page :background="false">
    <div class="theory-wrapper">
      <div class="top-wrapper">
        <div class="workbook-wrapper bg">
          <Block :title="$t('practice.workbookSet')"></Block>
          <WorkBook :type="type" @toWorkbook="toWorkbook" />
        </div>
        <div class="my-practice-wrapper bg">
          <Block :title="$t('practice.myPractice')"></Block>
          <MyPractice
            :type="type"
            :errorCount="errorCount"
            :collectionCount="collectionCount"
            :noteCount="noteCount"
            @go-other="goPerson"
          />
        </div>
      </div>
      <div class="bottom-wrapper">
        <div class="left-wrapper">
          <div class="tabs-wrapper bg">
            <Tabs :currentTab.sync="currentTab" />
          </div>
          <div class="tab-content bg">
            <div class="practice-wrapp" v-if="currentTab === 'practice'">
              <div class="filter-category">
                <cb-filter-condition
                  class="filter-condition-width"
                  v-model="categoryValue"
                  :filter-list="guid.list"
                  :props="{ label: 'name', value: 'resource_id' }"
                  @change="getCategory"
                  :height="32"
                ></cb-filter-condition>
              </div>
              <div class="select-filter">
                <cb-select
                  v-model="list.difficulty"
                  :options="difficultLists"
                  clearable
                  :placeholder="$t('practice.allDifficult')"
                  titleField="name"
                  valueField="code"
                  class="mr10"
                  :first="{
                    code: '',
                    name: $t('practice.allDifficult'),
                  }"
                ></cb-select>
                <cb-select
                  v-model="list.solved"
                  :options="statusLists"
                  clearable
                  :placeholder="$t('practice.allStatus')"
                  titleField="name"
                  valueField="code"
                  class="mr10"
                  :first="{
                    code: '',
                    name: $t('practice.allStatus'),
                  }"
                ></cb-select>
                <cb-select
                  v-model="list.theory_type"
                  :options="typeLists"
                  clearable
                  :placeholder="$t('practice.allQuestionType')"
                  titleField="name"
                  valueField="code"
                  class="mr10"
                  :first="{
                    code: '',
                    name: $t('practice.allQuestionType'),
                  }"
                ></cb-select>
                <cb-search-input
                  :placeholder="$t('practice.plzEnterTitle')"
                  v-model="list.pattern"
                  @change="getSearchName"
                ></cb-search-input>
              </div>
              <div class="table-box">
                <cb-search-table
                  :cols="columns"
                  url="/oj/practice/theory/list"
                  baseURL="/api/ojj"
                  :data="list"
                  :searchBarBg="false"
                >
                  <!-- 点击题目名称跳转 -->
                  <template v-slot:content="scope">
                    <div
                      type="text"
                      style="cursor: pointer"
                      :title="scope.data.content"
                      @click="toDetail(scope.data)"
                      class="title-content one-overflow"
                    >
                      <span
                        v-if=""
                        class="green-box ft12"
                        :class="{
                          'green-box': scope.data.solved === 1,
                          'orange-box': scope.data.solved === 0,
                          'gray-box': scope.data.solved === 2,
                        }"
                      >
                        {{ statusComputed(statusLists, scope.data.solved) }}
                      </span>
                      <!-- 单选:0,简答4,填空3,判断:2,多选:1 -->
                      【{{
                        getName(typeLists, scope.data.theory_type, 'code')
                      }}】
                      {{ scope.data.content }}
                    </div>
                  </template>

                  <!-- 难度 -->
                  <template v-slot:difficulty="scope">
                    <span
                      :class="{
                        lower: scope.data.difficulty % 3 === 0,
                        middle: scope.data.difficulty % 3 === 1,
                        high: scope.data.difficulty % 3 === 2,
                      }"
                    >
                      {{
                        getName(difficultLists, scope.data.difficulty, 'code')
                      }}
                    </span>
                  </template>
                  <!-- 方向 -->
                  <template v-slot:category="scope">
                    <div
                      class="category-content-com one-overflow"
                      :title="
                        scope.data.category_id &&
                        getName(
                          guid.list,
                          scope.data.category_id,
                          'resource_id',
                        )
                      "
                    >
                      {{
                        scope.data.category_id &&
                        getName(
                          guid.list,
                          scope.data.category_id,
                          'resource_id',
                        )
                      }}
                    </div>
                  </template>
                </cb-search-table>
              </div>
            </div>
            <div v-show="currentTab !== 'practice'">
              <FreeVolume
                :difficultLists="difficultLists"
                :statusLists="statusLists"
                :typeLists="typeLists"
              />
            </div>
          </div>
        </div>
        <div class="right-wrapper">
          <div class="my-progress-wrapper bg">
            <Block
              :title="
                currentTab === 'practice'
                  ? $t('practice.currentProgress')
                  : $t('practice.knowledgeSkillsTop6')
              "
            ></Block>
            <CurrentProgress
              v-if="currentTab === 'practice'"
              v-loading="loadingProgress"
              :currentProgressInfo="currentProgressInfo"
            />
            <RadarTopSix v-else :radar-data="radarData" />
          </div>
          <div class="practice-record-wrapper bg">
            <Block
              :title="
                currentTab === 'practice'
                  ? $t('practice.practiceRecord')
                  : $t('practice.volumeGroupRecord')
              "
            ></Block>
            <StudyRecord
              :type="currentTab"
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
import Tabs from './components/tabs.vue';
import Block from '@/components/block';
import { TYPE, COMMENTYPE } from '../constant';
import WorkBook from '../components/workbook.vue';
import MyPractice from '../components/my-practice.vue';
import CurrentProgress from '../components/current-progress.vue';
import RadarTopSix from '../components/radar-top-six.vue';
import StudyRecord from '../components/study-record.vue';
import FreeVolume from './components/free-volume.vue';
import {
  getCurrentProgressApi,
  getStaticsTheory,
  getFivePracticeRecord,
  getKnowSkillTop6,
  getVolumeFive,
} from '@/api/practice.ts';
import { getComConstantsConfig } from '@/api/common.js';
export default {
  name: 'theoryIndex',
  components: {
    Tabs,
    Block,
    WorkBook,
    MyPractice,
    CurrentProgress,
    RadarTopSix,
    StudyRecord,
    FreeVolume,
  },
  data() {
    return {
      TYPE,
      type: TYPE.Rationale,
      currentTab: 'practice', // testPaper
      categoryValue: null,
      guid: {
        title: this.$t('m.category'), // 方向
        list: [],
      },
      diffList: [],
      difficultLists: [], // 难度分类数据
      statusLists: [], // 状态数据
      typeLists: [], //题目类型数据
      list: {
        pattern: '', // 列表搜索的name
        practice_set_id: '', // 习题集的resource_id
        difficulty: '',
        category_id: '', // 列表方向（类型）resource_id
        solved: '', // 列表状态 (true: 解出, false:未解出)
        sort: '', // 列表排序
        theory_type: '', //题目类型
      },
      columns: [
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
          label: this.$t('m.practiceTable.practiceSet'), // 所属习题集
          width: '15%',
          prop: 'practice_set_name',
        },
        {
          label: this.$t('m.difficulty'), // 难度
          width: '8%',
          slot: 'difficulty',
        },
      ],
      currentProgressInfo: {}, // 当前进度信息
      loadingProgress: false,
      errorCount: 0,
      collectionCount: 0,
      noteCount: 0,
      fiveRecordList: [], // 5条记录
      radarData: [], //知识技能top6  数据
    };
  },
  watch: {
    currentTab: {
      handler(nv, ov) {
        if (nv) {
          this.fiveRecordList = [];
          this.getFiveRecord();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getCurrentProgress();
    this.getGuidList();
    this.getDifficultList();
    this.getStatusList();
    this.getTopicType();
    this.getStatics();
    this.getFiveRecord();
    this.getKnowSkillTop6Th();
  },
  methods: {
    // 获取知识技能Top6
    getKnowSkillTop6Th() {
      getKnowSkillTop6().then((res) => {
        const data = _.get(res, 'data.data');
        this.radarData = data;
      });
    },
    // 统计错题、收藏、笔记数量
    getStatics() {
      getStaticsTheory().then((res) => {
        const data = _.get(res, 'data.data');
        this.errorCount = data?.mistake;
        this.collectionCount = data?.collection;
        this.noteCount = data?.note;
      });
    },
    //  获取最近5条记录
    getFiveRecord() {
      if (this.currentTab === 'practice') {
        getFivePracticeRecord().then((res) => {
          const data = _.get(res, 'data.data');
          this.fiveRecordList = data;
        });
      } else {
        getVolumeFive().then((res) => {
          const data = _.get(res, 'data.data');
          this.fiveRecordList = data;
        });
      }
    },
    goPerson(val) {
      const path = `/page/mg/personal?to=${val}&type=theory`;
      window.open(`${path}`, '_self');
    },
    getCurrentProgress() {
      this.loadingProgress = true;
      getCurrentProgressApi({}).then((res) => {
        this.currentProgressInfo = _.get(res, 'data.data', {});
        this.loadingProgress = false;
      });
    },
    toWorkbook(row) {
      // sessionStorage.setItem('practice_set_name', JSON.stringify(row.name));
      this.$router.push({
        path: `/practice/rationale/list/${row.resource_id}`,
      });
    },
    getName(list, id, key) {
      const data = list.filter((item) => item[key] === id);
      return data.length && data[0].name;
    },
    // 列表状态计算
    statusComputed(list, id) {
      const data = list.filter((item) => item.code === Number(id));
      if (data.length) {
        return data[0].name;
      }
    },
    // 方向搜索
    getCategory(data) {
      this.list.category_id = data.resource_id;
      this.list.currentPage = 1;
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
          that.guid.list.unshift(arr);
        });
    },

    // 获取难度
    getDifficultList() {
      getComConstantsConfig({ type: 10 }).then((res) => {
        let arr = res.data.data;
        this.diffList = arr;
        this.difficultLists = arr;
      });
    },

    // 获取状态
    getStatusList() {
      getComConstantsConfig({ type: 39 }).then((res) => {
        let arr = res.data.data;
        this.statusLists = arr;
      });
    },
    //获取题目类型 type:21
    getTopicType() {
      getComConstantsConfig({ type: 21 }).then((res) => {
        let arr = res.data.data;
        this.typeLists = arr;
      });
    },

    // 搜索
    getSearchName(name) {
      this.list.pattern = name;
      this.list.currentPage = 1;
    },
    toDetail(row) {
      this.$router.push({
        path: `/practice/rationale/exercise-details/${row.resource_id}`,
        query: {
          from: 'normal',
        },
      });
    },
    goDetail(val) {
      if (this.currentTab === 'practice') {
        this.$router.push({
          path: `/practice/rationale/exercise-details/${val.resource_id}`,
          query: {
            from: 'record',
          },
        });
      } else {
        if (val.is_finish) {
          this.$router.push({
            path: `/practice/volume-detail/${val.paper_id}`,
          });
        } else {
          this.$router.push({
            path: `/practice/volume-exam/${val.paper_id}`,
            query: {
              from: 'volume-normal',
            },
          });
        }
      }
    },
    // 练习记录-查看更多
    seeMore() {
      if (this.currentTab === 'practice') {
        this.$router.push({
          path: `/practice/record`,
        });
      } else {
        this.$router.push({
          path: `/practice/volume-record`,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.bg {
  background: var(--bg-color-2);
  border-radius: 4px;
}

.theory-wrapper {
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
    width: calc(100% - 280px);

    .tabs-wrapper {
      margin: 12px 0 0;
      height: 48px;
      border-bottom: 1px solid var(--bg-color-2);
      box-shadow: inset 0px -1px 0px 0px var(--neutral0);
      border-radius: 4px 4px 0px 0px;
    }
    .tab-content {
      min-height: 48px;
      border-radius: 0px 0px 4px 4px;
      .select-filter {
        margin: 8px 0 16px;
        display: flex;
        justify-content: flex-start;
      }
      .practice-wrapp {
        padding: 16px;
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
.practice-record-wrapper {
  .cb-block-title-container {
    margin-bottom: 8px;
  }
}
</style>
