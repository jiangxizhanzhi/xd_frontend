<template>
  <!-- 实践操作 -->
  <cb-inner-page :background="false" style="padding-top: 0">
    <div class="practice-wrapper">
      <div class="practice-content">
        <div class="search-model">
          <div class="practice-tabs">
            <!-- 右侧列表,习题集按钮 -->
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
            <div class="trainTabs">
              <cb-radio-group v-model="activeName" size="medium">
                <cb-radio-button label="practiceList">
                  <cb-iconfont type="icon-liebiao"></cb-iconfont>
                  <span> &nbsp;{{ $t('m.practiceList') }}&nbsp;&nbsp;</span>
                </cb-radio-button>
                <cb-radio-button label="workbook">
                  <cb-iconfont type="icon-xitiji"></cb-iconfont>
                  <span>{{ $t('m.workbook') }}</span>
                </cb-radio-button>
              </cb-radio-group>
            </div>
          </div>
          <div class="prac-search-box" v-if="activeName === 'practiceList'">
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
            </div>
          </div>
        </div>
        <div class="practice-list" v-if="activeName === 'practiceList'">
          <div class="content">
            <cb-search-table
              ref="sdlRef"
              :cols="columns"
              :url="url"
              baseURL="/api/ojj"
              :data="list"
              :searchBarBg="false"
            >
              <!-- 点击题目名称跳转 -->
              <template v-slot:title="scope">
                <!-- <cb-button
                  type="text"
                  style="cursor: pointer"
                  :title="scope.data.title"
                  @click="toDetail(scope.data)"
                  >{{ scope.data.title }}</cb-button
                > -->
                <div
                  type="text"
                  style="cursor: pointer"
                  :title="scope.data.title"
                  @click="toDetail(scope.data)"
                  class="title-content"
                >
                  {{ scope.data.title }}
                </div>
              </template>
              <!-- 难度 -->
              <template v-slot:difficulty="scope">
                <div>
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
              <!-- 状态-->
              <template v-slot:statusTitle="scope">
                <div>
                  <span v-if="scope.data.solved % 2 === 1" class="is_solved">{{
                    statusComputed(scope.data.solved)
                  }}</span>
                  <span v-if="scope.data.solved % 2 === 0" class="no-solved">{{
                    statusComputed(scope.data.solved)
                  }}</span>
                </div>
              </template>
              <!-- 方向 -->
              <template v-slot:category="scope">
                <div
                  class="category-content"
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
            </cb-search-table>
          </div>
        </div>
        <div class="practice-workbook" v-if="activeName === 'workbook'">
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
            <!-- 实践操作习题集分页 -->
            <div class="list" v-if="wookbook.total > 0">
              <cb-pagination
                :total="wookbook.total"
                :page-sizes="['10', '20', '30']"
                :current-page="wookbook.currentPage"
                :page-size.sync="wookbook.currentSize"
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
import Empty from '@/components/empty/index.vue';
import courseCard from '@/components/course-card/index';
import _ from 'lodash';
import { STATUSTYPE, DIFFICULTY, TYPE, COMMENTYPE } from './constant';
export default {
  components: {
    Empty,
    courseCard,
  },
  data() {
    return {
      STATUSTYPE,
      DIFFICULTY,
      TYPE,
      COMMENTYPE,
      // 难度分类数据
      difficultLists: [],
      statusLists: [],
      url: '/oj/practice/operation/list',
      captureFlagList: [],
      columns: [
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
      activeName: 'practiceList',
      defaultValue: null,
      type: TYPE.CaptureFlag,
      list: {
        // 列表模式
        total: 0,
        currentPage: 1,
        currentSize: 10, // 列表每页条数
        pattern: '', // 列表搜索的name
        practiceSetId: '', // 习题集的resource_id
        categoryId: '', // 列表方向（类型）resource_id
        solved: '', // 列表状态 (true: 解出, false:未解出)
        difficulty: null,
        sort: '', // 列表排序
      },
      tableData: [],
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
      difficulty: {
        title: this.$t('m.difficulty'), //难度
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
  },
  methods: {
    // 方向
    tableDataComputed(id) {
      const { guidList = [] } = this;
      const data = guidList.filter((item) => item.resource_id === id);
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
    getWookbookSearchName(name) {
      this.wookbook.search = name;
      this.getWookbookList();
    },
    // 方向搜索
    getCategory(data) {
      this.list.categoryId = data.resource_id;
      this.list.currentPage = 1;
    },
    getDifficulty(difficulty) {
      this.list.difficulty = difficulty.resource_id;
      this.list.currentPage = 1;
    },
    // 状态搜索
    getStatus(status) {
      this.list.solved = status.resource_id;
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
    toWorkbook(row) {
      sessionStorage.setItem('practice_set_name', JSON.stringify(row.name));
      this.$router.push({
        path: `/practice/capture-flag/list/${row.resource_id}`,
      });
    },
    toDetail(row) {
      this.$router.push({
        path: `/practice/capture-flag/exercise-details/${row.resource_id}`,
      });
    },
  },
};
</script>
<style scoped lang="scss">
.filter-condition-width {
  width: 100%;
}
.title-content {
  color: var(--primary-color);
  text-overflow: ellipsis;
  display: -webkit-box;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.category-content {
  text-overflow: ellipsis;
  display: -webkit-box;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
<style lang="scss">
.classify-list {
  position: relative;
  margin-top: 20px;
}
.trainTabs {
  margin-left: auto;
}
b-inner-page,
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
