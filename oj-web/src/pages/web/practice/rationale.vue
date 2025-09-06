<template>
  <!-- 理论基础 -->
  <cb-inner-page :background="false" style="padding-top: 0">
    <div class="practice-wrapper">
      <div class="practice-content">
        <div class="search-model">
          <div class="practice-tabs">
            <!-- 筛选条件 -->
            <cb-search-input
              v-if="activeName === 'practiceList'"
              :placeholder="$t('m.namePh')"
              v-model="list.pattern"
              @change="getSearchName"
            ></cb-search-input>
            <cb-search-input
              v-if="activeName === 'workbook'"
              :placeholder="$t('m.namePh')"
              v-model="wookbook.search"
              @change="getWookbookSearchName"
            ></cb-search-input>
            <!-- 右侧列表习题集 -->
            <div class="trainTabs">
              <cb-radio-group v-model="activeName" size="medium">
                <cb-radio-button label="practiceList">
                  <cb-iconfont type="icon-liebiao"></cb-iconfont>
                  <span> &nbsp;{{ $t('m.practiceList') }}&nbsp;&nbsp;</span>
                </cb-radio-button>
                <cb-radio-button label="workbook">
                  <cb-iconfont type="icon-xitiji"></cb-iconfont>
                  <span> {{ $t('m.workbook') }}</span>
                </cb-radio-button>
              </cb-radio-group>
            </div>
          </div>
          <div class="prac-search-box" v-if="activeName === 'practiceList'">
            <div class="classify-list">
              <cb-filter-condition
                class="filter-condition-width"
                v-model="defaultValue"
                :condition="guid.title"
                :filter-list="guid.list"
                :props="{ label: 'name', value: 'resource_id' }"
                @change="getCategory"
                :showCount="0"
              ></cb-filter-condition>
              <cb-filter-condition
                :condition="diff.title"
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
              <!-- 题目类型 -->
              <cb-filter-condition
                :condition="topicType.title"
                v-model="defaultValue"
                :filter-list="typeLists"
                :props="{ label: 'name', value: 'resource_id' }"
                @change="getTypes"
              ></cb-filter-condition>
            </div>
          </div>
        </div>
        <div class="practice-list" v-if="activeName === 'practiceList'">
          <!-- table表格 -->
          <!-- :fetchPromise="fetchPromise" -->
          <cb-search-table
            :cols="columns"
            url="/oj/practice/theory/list"
            baseURL="/api/ojj"
            :data="list"
            :searchBarBg="false"
          >
            <!-- 点击题目名称跳转 -->
            <template v-slot:content="scope">
              <!-- <cb-button
                type="text"
                style="cursor: pointer"
                :title="scope.data.content"
                @click="toDetail(scope.data)"
                >{{ scope.data.content }}</cb-button
              > -->
              <div
                type="text"
                style="cursor: pointer"
                :title="scope.data.content"
                @click="toDetail(scope.data)"
                class="title-content one-overflow"
              >
                {{ scope.data.content }}
              </div>
            </template>
            <!-- 题目类型 -->
            <template v-slot:question_type="scope">
              <div>
                <!-- 单选:0,简答4,填空3,判断:2,多选:1 -->
                <span v-if="scope.data.theory_type % 5 === 0">
                  <cb-iconfont type="icon-danxuan"></cb-iconfont>
                  {{ computedTopicType(scope.data.theory_type) }}
                </span>
                <span v-if="scope.data.theory_type % 5 === 4">
                  <cb-iconfont type="icon-jianda"></cb-iconfont>
                  {{ computedTopicType(scope.data.theory_type) }}
                </span>
                <span v-if="scope.data.theory_type % 5 === 3">
                  <cb-iconfont type="icon-tiankong"></cb-iconfont>
                  {{ computedTopicType(scope.data.theory_type) }}
                </span>
                <span v-if="scope.data.theory_type % 5 === 2">
                  <cb-iconfont type="icon-panduan"></cb-iconfont>
                  {{ computedTopicType(scope.data.theory_type) }}
                </span>
                <span v-if="scope.data.theory_type % 5 === 1">
                  <cb-iconfont type="icon-duoxuan"></cb-iconfont>
                  {{ computedTopicType(scope.data.theory_type) }}
                </span>
              </div>
            </template>
            <!-- 难度 -->
            <template v-slot:difficulty="scope">
              <div>
                <!-- <span class="high" v-if="scope.data.difficulty === 2">{{
                  $t('m.highLevel')
                }}</span>
                <span class="middle" v-if="scope.data.difficulty === 1">{{
                  $t('m.middleLevel')
                }}</span>
                <span class="lower" v-if="scope.data.difficulty === 0">{{
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
            <!-- 方向 -->
            <template v-slot:category="scope">
              <div
                class="category-content-com one-overflow"
                :title="
                  scope.data.category_id &&
                  tableDataComputed(scope.data.category_id)
                "
              >
                {{
                  scope.data.category_id &&
                  tableDataComputed(scope.data.category_id)
                }}
              </div>
            </template>
            <!-- 状态 -->
            <template v-slot:statusTitle="scope">
              <div>
                <span v-if="scope.data.solved % 2 === 1" class="is_solved">{{
                  statusComputed(scope.data.solved)
                }}</span>
                <span v-if="scope.data.solved % 2 === 0" class="no-solved">{{
                  statusComputed(scope.data.solved)
                }}</span>
              </div>
              <!-- <div>
                <span v-if="scope.data.solved" class="is_solved">{{
                  $t('m.solved')
                }}</span>
                <span v-else class="no-solved">
                  {{ $t('m.unresolved') }}
                </span>
              </div> -->
            </template>
          </cb-search-table>
        </div>
        <div class="practice-workbook" v-if="activeName === 'workbook'">
          <!-- 习题集 -->
          <div class="content">
            <div class="recommend-study" v-if="wookbook.total > 0">
              <div
                class="package-card"
                v-for="(item, index) in workbookList"
                :key="index"
                @click="toWorkbook(item)"
              >
                <course-card
                  :card-data="item"
                  :commentType="COMMENTYPE.Practice"
                ></course-card>
              </div>
            </div>
            <!-- 理论基础习题集分页 -->
            <div class="list" v-if="wookbook.total > 0">
              <cb-pagination
                class="practice-pagination"
                :total="wookbook.total"
                :page-sizes="['10', '20', '30']"
                :current-page="wookbook.currentPage"
                :page-size.sync="wookbook.currentSize"
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="wookbookPageChange"
                @size-change="wookbookSizeChange"
              ></cb-pagination>
            </div>
            <div
              class="empty-div"
              v-if="wookbook.total === 0"
              style="width: 100%; height: 420px"
            >
              <empty></empty>
            </div>
          </div>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import { getRationaleListApi } from '@/api/practice';
import empty from '@/components/empty/index.vue';
import courseCard from '@/components/course-card/index';
import { TYPE, COMMENTYPE } from './constant';
import _ from 'lodash';
export default {
  components: {
    empty,
    courseCard,
  },
  data() {
    return {
      TYPE,
      COMMENTYPE,
      // 难度分类数据
      difficultLists: [],
      // 状态数据
      statusLists: [],
      //题目类型数据
      typeLists: [],
      columns: [
        {
          label: this.$t('m.practiceTable.questionTitle'), // 题目名称
          // width: '40%',
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
          width: '100px',
          slot: 'statusTitle',
        },
      ],
      activeName: 'practiceList',
      type: TYPE.Rationale,
      defaultValue: null,
      list: {
        pattern: '', // 列表搜索的name
        practice_set_id: '', // 习题集的resource_id
        difficulty: null,
        category_id: '', // 列表方向（类型）resource_id
        solved: '', // 列表状态 (true: 解出, false:未解出)
        sort: '', // 列表排序
        theory_type: '', //题目类型
      },
      tableData: [], // 列表模式的table数据
      wookbook: {
        // 习题集模式
        search: '',
        total: 0,
        currentPage: 1, // 列表当前页码
        currentSize: 10, // 列表每页条数
      },
      workbookList: [],
      guidList: [],
      // 表格难度数据
      diffList: [],
      guid: {
        title: this.$t('m.category'), // 方向
        list: [],
      },
      status: {
        title: this.$t('m.statusTitle'), // 状态
      },
      diff: {
        title: this.$t('m.difficulty'), //难度
      },
      topicType: {
        title: this.$t('m.topicType'), //题目类型
      },
    };
  },
  computed: {},
  watch: {
    activeName(val) {
      this.list.pattern = '';
      this.wookbook.search = '';
      if (val === 'workbook') {
        this.getWookbookList();
      }
    },
  },
  created() {
    this.getGuidList();
    this.getWookbookList();
    this.getDifficultList();
    this.getStatusList();
    this.getTopicType();
  },
  methods: {
    // 方向
    tableDataComputed(id) {
      const { guidList = [] } = this;
      const data = guidList.filter((item) => item.resource_id === id);
      // console.log(data,33333);
      return data.length && data[0].name;
    },
    // 列表难度
    difficultComputed(id) {
      const { diffList = [] } = this;
      const data = diffList.filter((item) => item.resource_id === id);
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

    getWookbookSearchName(name) {
      this.wookbook.search = name;
      this.getWookbookList();
    },
    // 方向搜索
    getCategory(data) {
      this.list.category_id = data.resource_id;
      this.list.currentPage = 1;
    },
    getDifficulty(difficulty) {
      this.list.difficulty = difficulty.resource_id;
      this.list.currentPage = 1;
    },
    // 状态搜索
    getStatus(data) {
      this.list.solved = data.resource_id;
      this.list.currentPage = 1;
    },
    // 题目类型搜索
    getTypes(data) {
      this.list.theory_type = data.resource_id;
      this.list.currentPage = 1;
    },
    // 搜索
    getSearchName(name) {
      this.list.pattern = name;
      this.list.currentPage = 1;
    },
    // 习题集每页条数切换
    wookbookSizeChange(val) {
      this.wookbook.currentSize = val;
      this.getWookbookList();
    },
    // 习题集页数切换
    wookbookPageChange(val) {
      this.wookbook.currentPage = val;
      this.getWookbookList();
    },
    // 习题集模式
    getWookbookList() {
      const that = this;
      // 分类类型 0=理论基础 2=实践操作
      this.$request
        .get(
          '/oj/practice/set/list',
          {
            practice_type: this.type,
            page: this.wookbook.currentPage, // 当前页码
            per_page: this.wookbook.currentSize, // 每页条数
            pattern: this.wookbook.search, // 习题集的搜索的name
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          const data = _.get(resp, 'data.data');
          that.workbookList = _.get(data, 'list');
          that.wookbook.total = _.get(data, 'total');
        });
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
            name: this.$t('m.allTitle'),
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
    //获取题目类型 type:21
    getTopicType() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 21,
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
          this.typeLists = arr;
        });
    },
    // 题目类型label转换
    computedTopicType(theory_type) {
      const data = this.typeLists.filter(
        (item) => item.resource_id === theory_type,
      );

      if (data.length) {
        return data[0].name;
      }
    },
    // 习题集跳转
    toWorkbook(row) {
      sessionStorage.setItem('practice_set_name', JSON.stringify(row.name));
      this.$router.push({
        path: `/practice/rationale/list/${row.resource_id}`,
      });
    },
    toDetail(row) {
      this.$router.push({
        path: `/practice/rationale/exercise-details/${row.resource_id}`,
      });
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
.classify-list {
  position: relative;
  margin-top: 20px;
}

.filter-condition-width {
  width: 100%;
}
.category-content-com {
  text-overflow: ellipsis;
  display: -webkit-box;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
<style lang="scss">
.trainTabs {
  margin-left: auto;
}
.cb-search-table {
  .ant-table-row-cell-break-word {
    div {
      .is_solved {
        color: var(--orange-color);
      }
      .no-solved {
        color: var(--green-color);
      }
      .cb-iconfont {
        color: var(--font-color-primary);
      }
    }
  }
}
</style>
<style lang="scss">
.practice-wrapper {
  .practice-pagination {
    .ant-pagination.mini {
      margin: 0 !important;
    }
  }
}
.cb-search-table {
  .cb-a-table-container {
    .ant-table-row-cell-break-word {
      div {
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
      }
    }
  }
}
</style>
