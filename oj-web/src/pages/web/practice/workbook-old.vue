<template>
  <!-- 习题集详情 -->
  <div>
    <div class="practice-wrapper">
      <div class="practice-header">
        <!-- <breadcrumb :breadList="breadList"></breadcrumb> -->
      </div>
      <div class="practice-content">
        <div
          class="tabs-content"
          v-loading="loadingList"
          element-loading-background="rgba(35, 44, 59, .7)"
        >
          <cb-search-input
            :placeholderName="$t('m.searchPlaceholder')"
            v-model="list.pattern"
          ></cb-search-input>
          <div class="classify-list">
            <cb-filter-condition
              class="filter-condition-width"
              :condition="guid.title"
              v-model="defaultValue"
              :filter-list="guid.list"
              :props="{ label: 'name', value: 'resource_id' }"
              @change="getCategory"
              :showCount="0"
            ></cb-filter-condition>
            <cb-filter-condition
              v-if="type == TYPE.CaptureFlag"
              :condition="difficulty.title"
              v-model="defaultValue"
              :filter-list="difficultLists"
              :props="{ label: 'name', value: 'resource_id' }"
              @change="getDifficulty"
            ></cb-filter-condition>
            <cb-filter-condition
              :condition="status.title"
              v-model="defaultValue"
              :filter-list="statusLists"
              :props="{ label: 'name', value: 'resource_id' }"
              @change="getStatus"
            ></cb-filter-condition>
            <!-- <search-input
              :placeholderName="$t('m.searchPlaceholder')"
              :val="list.pattern"
              @sendSearchName="getSearchName"
              style="outline:1px solid red"
            ></search-input> -->
          </div>
          <!-- 表格 -->
          <cb-search-table
            :cols="columns"
            :fetchPromise="fetchPromise"
            :data="list"
            :searchBarBg="false"
          >
            <!-- 题目名称 -->
            <template v-slot:content="scope">
              <!-- <cb-button
                type="text"
                style="cursor: pointer"
                @click="toDetail(scope.data)"
                >{{ scope.data.content }}</cb-button
              > -->
              <div
                type="text"
                style="cursor: pointer"
                @click="toDetail(scope.data)"
                class="title-content"
              >
                {{ scope.data.content }}
              </div>
            </template>
            <!-- 题目名称 -->
            <template v-slot:title="scope">
              <!-- <cb-button
                type="text"
                style="cursor: pointer"
                @click="toDetail(scope.data)"
                >{{ scope.data.title }}</cb-button
              > -->
              <div
                type="text"
                style="cursor: pointer"
                @click="toDetail(scope.data)"
                class="title-content"
              >
                {{ scope.data.title }}
              </div>
            </template>

            <!-- 难度 -->
            <template v-slot:difficulty="scope">
              <div>
                <!-- <span
                  class="high"
                  v-if="scope.data.difficulty === 2"
                >{{
                  $t('m.highLevel')
                }}</span>
                <span
                  class="middle"
                  v-if="scope.data.difficulty === 1"
                >{{
                  $t('m.middleLevel')
                }}</span>
                <span
                  class="lower"
                  v-if="scope.data.difficulty === 0"
                >{{
                  $t('m.lowLevel')
                }}</span> -->
                <span class="lower" v-if="scope.data.difficulty % 3 === 0">{{
                  difficultComputed(scope.data.difficulty)
                }}</span>
                <span class="middle" v-if="scope.data.difficulty % 3 === 1">{{
                  difficultComputed(scope.data.difficulty)
                }}</span>
                <span class="high" v-if="scope.data.difficulty % 3 === 2">{{
                  difficultComputed(scope.data.difficulty)
                }}</span>
              </div>
            </template>
            <!-- 类型 -->
            <template v-slot:question_type="scope">
              <div>
                <span v-if="scope.data.theory_type === 0">
                  <cb-iconfont type="icon-danxuan"></cb-iconfont>
                  <span>{{ $t('subject.radio') }}</span>
                </span>
                <span v-if="scope.data.theory_type === 4">
                  <cb-iconfont type="icon-jianda"></cb-iconfont>
                  <span>{{ $t('subject.questionAnswer') }}</span>
                </span>
                <span v-if="scope.data.theory_type === 3">
                  <cb-iconfont type="icon-tiankong"></cb-iconfont>
                  <span>{{ $t('subject.fillPosition') }}</span>
                </span>
                <span v-if="scope.data.theory_type === 2">
                  <cb-iconfont type="icon-panduan"></cb-iconfont>
                  <span>{{ $t('subject.judge') }}</span>
                </span>
                <span v-if="scope.data.theory_type === 1">
                  <cb-iconfont type="icon-duoxuan"></cb-iconfont>
                  <span>{{ $t('subject.multipleSelection') }}</span>
                </span>
              </div>
            </template>
            <!-- 方向 -->
            <template v-slot:category="scope">
              <div>
                {{ tableDataComputed(scope.data.category_id) }}
              </div>
            </template>
            <!-- 状态 -->

            <template v-slot:statusTitle="scope">
              <div>
                <!-- <span
                  v-if="scope.data.solved"
                  class="is_solved"
                >{{
                  $t('m.solved')
                }}</span>
                <span
                  v-else
                  class="no-solved"
                >{{ $t('m.unresolved') }}</span> -->
                <span v-if="scope.data.solved % 2 === 1" class="is_solved">{{
                  statusComputed(scope.data.solved)
                }}</span>
                <span v-if="scope.data.solved % 2 === 0" class="no-solved">{{
                  statusComputed(scope.data.solved)
                }}</span>
              </div>
            </template>
          </cb-search-table>
        </div>
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

export default {
  components: {
    Empty,
    searchInput,
  },
  data() {
    return {
      // 难度分类数据
      difficultLists: [],
      // 状态分类数据
      statusLists: [],
      STATUSTYPE,
      TYPE,
      DIFFICULTY,
      columns: [],
      rationaleColumns: [
        {
          label: this.$t('m.practiceTable.questionTitle'), // 题目名称
          width: '50%',
          sorter: 'content',
          slot: 'content',
        },
        {
          label: this.$t('m.practiceTable.questionType'), // 题目类型
          width: '10%',
          slot: 'question_type',
          sorter: 'theory_type',
        },
        {
          label: this.$t('m.practiceTable.practiceSet'), // 所属习题集
          width: '15%',
          prop: 'practice_set_name',
        },
        {
          label: this.$t('m.category'), // 方向
          width: '15%',
          slot: 'category',
        },
        {
          label: this.$t('m.practiceTable.editTime'), // 上一次编辑时间
          width: '15%',
          prop: 'update_time',
          sorter: 'update_time',
        },
        {
          label: this.$t('m.statusTitle'), // 状态
          // width: '15%',
          width: '100px',
          slot: 'statusTitle',
        },
      ],
      caputerColumns: [
        {
          label: this.$t('m.practiceTable.questionTitle'), // 题目名称
          width: '50%',
          slot: 'title',
          sorter: 'title',
        },
        {
          label: this.$t('m.practiceTable.practiceSet'), // 所属习题集
          width: '10%',
          prop: 'practice_set_name',
        },
        {
          label: this.$t('m.category'), // 方向
          width: '10%',
          slot: 'category',
        },
        {
          label: this.$t('m.difficulty'), // 难度
          width: '8%',
          slot: 'difficulty',
        },
        {
          label: this.$t('m.practiceTable.editTime'), // 上一次编辑时间
          width: '15%',
          prop: 'update_time',
          sorter: 'update_time',
        },
        {
          label: this.$t('m.statusTitle'), // 状态
          width: '8%',
          slot: 'statusTitle',
        },
      ],
      type: Number,
      defaultValue: null,
      loadingList: false,
      practiceSetName: '',
      list: {
        // total: 0,
        // currentPage: 1,
        // currentSize: 10, // 列表每页条数
        pattern: '', // 列表搜索的name
        practice_set_id: '', // 习题集的resource_id
        category_id: '', // 列表方向（类型）resource_id
        solved: null, // 列表状态 (1: 解出, 0:未解出)
        sort: '', // 列表排序
        difficulty: null,
      },
      tableData: [],
      guidList: [],
      breadList: [
        {
          title: this.$t('layout.navi.practice'), // 练习
          path: '',
        },
      ],
      guid: {
        title: this.$t('m.category'), // 方向
        list: [
          // {
          //   name: this.$t('m.allTitle'),
          //   resource_id: null,
          // },
        ],
      },
      difficulty: {
        title: this.$t('m.difficulty'),
        // list: [
        //   {
        //     resource_id: null,
        //     name: this.$t('m.allTitle'),
        //   },
        //   {
        //     resource_id: DIFFICULTY.Primary,
        //     name: this.$t('m.lowLevel'),
        //   },
        //   {
        //     resource_id: DIFFICULTY.Medium,
        //     name: this.$t('m.middleLevel'),
        //   },
        //   {
        //     resource_id: DIFFICULTY.Advanced,
        //     name: this.$t('m.highLevel'),
        //   },
        // ],
      },
      status: {
        title: this.$t('m.statusTitle'), // 状态
        // list: [
        //   {
        //     resource_id: null,
        //     name: this.$t('m.allTitle'), // 全部
        //   },
        //   {
        //     resource_id: STATUSTYPE.Solved,
        //     name: this.$t('m.solved'),
        //   },
        //   {
        //     resource_id: STATUSTYPE.Unresolved,
        //     name: this.$t('m.unresolved'),
        //   },
        // ],
      },
    };
  },
  computed: {},

  created() {
    if (this.$router.history.current.name === 'rationale') {
      this.columns = this.rationaleColumns;
    } else {
      this.columns = this.caputerColumns;
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
    console.log(this.$route);
    const title = pagename[this.$route.name].name;
    this.type = pagename[this.$route.name].id;
    this.list.practice_set_id = this.$route.params.id;
    this.practiceSetName =
      JSON.parse(sessionStorage.getItem('practice_set_name')) || '';
    this.breadList.push(
      { path: `/practice/${this.$route.name}`, title: title },
      { path: this.$route.path, title: this.practiceSetName },
    );
    document.title = title;
    this.getGuidList(); // 方向(类型)页签data
    // this.getTableData(); // 列表data
    this.getDifficultList();
    this.getStatusList();
  },
  methods: {
    // 方向
    tableDataComputed(id) {
      const { guidList = [] } = this;
      const data = guidList.filter((item) => item.resource_id === id);
      // console.log(data, 33333);
      return data.length && data[0].name;
    },
    // 列表难度
    difficultComputed(id) {
      const data = this.difficultLists.filter(
        (item) => item.resource_id === id,
      );
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
    // 获取难度
    getDifficultList() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 10,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          let arr = res.data.data;
          arr = arr.map((item) => {
            return {
              resource_id: item.code,
              name: item.name,
            };
          });
          this.diffList = arr;
          arr.unshift({
            resource_id: null,
            name: this.$t('m.allTitle'),
          });
          this.difficultLists = arr;
        });
    },
    // 获取状态
    getStatusList() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 11,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          let arr = res.data.data;
          arr = arr.map((item) => {
            return {
              resource_id: item.code,
              name: item.name,
            };
          });
          arr.unshift({
            resource_id: null,
            name: this.$t('m.allTitle'),
          });
          this.statusLists = arr;
        });
    },
    //请求获取table表格列表
    fetchPromise(queryData) {
      if (this.$router.history.current.name === 'rationale') {
        return getRationaleListApi({ ...queryData })
          .then((res) => {
            return res;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        return getCaptureFlagListApi({ ...queryData })
          .then((res) => {
            return res;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    getCategory(data) {
      this.list.category_id = data.resource_id;
    },
    getStatus(status) {
      this.list.solved = status.resource_id;
    },
    getSearchName(name) {
      this.list.pattern = name;
    },
    getDifficulty(difficulty) {
      this.list.difficulty = difficulty.resource_id;
    },

    getGuidList() {
      // 方向页签列表获取
      if (this.type === TYPE.Rationale) {
        this.rationaleGuidData();
      } else if (this.type === TYPE.CaptureFlag) {
        this.flagGuidData();
      }
    },
    rationaleGuidData() {
      // 理论基础-方向
      const that = this;
      // 分类类型 0=理论基础 2=实践操作
      this.$request
        .get(
          '/oj/practice/category/list',
          {
            practice_type: TYPE.Rationale,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          const arr = {
            name: this.$t('m.allTitle'),
            resource_id: null,
          };
          const newData = _.get(resp, 'data.data');
          that.guid.list = newData;
          that.guidList = newData;
          that.guid.list.unshift(arr);
        });
    },
    flagGuidData() {
      // 夺旗解题-方向
      const that = this;
      // 分类类型 0=理论基础 2=实践操作
      this.$request
        .get(
          '/oj/practice/category/list',
          {
            practice_type: TYPE.CaptureFlag,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          const arr = {
            name: this.$t('m.allTitle'),
            resource_id: null,
          };
          const newData = _.get(resp, 'data.data');
          that.guid.list = newData;
          that.guidList = newData;
          that.guid.list.unshift(arr);
        });
    },
    toDetail(row) {
      if (this.type === TYPE.Rationale) {
        this.$router.push({
          path: `/practice/rationale/exercise-details/${row.resource_id}`,
        });
      } else if (this.type === TYPE.CaptureFlag) {
        this.$router.push({
          path: `/practice/capture-flag/exercise-details/${row.resource_id}`,
        });
      }
    },
  },
};
</script>
<style scoped lang="scss">
.title-content {
  color: var(--primary-color);
  text-overflow: ellipsis;
  display: -webkit-box;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.filter-condition-width {
  // width: calc(100% - 356px);
}
.cb-search-input {
  margin-bottom: 20px;
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
.no-solved {
  color: var(--green-color);
}
.is_solved {
  color: var(--orange-color);
}
</style>
