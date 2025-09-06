<template>
  <cb-inner-page class="oj-course" :background="false">
    <div class="overflow bg-inner">
      <div>
        <cb-search-input
          class="mb20"
          :placeholder-name="$t('m.plzEnter')"
          @change="getSearchName"
          @clear="getSearchName"
          clearable
        ></cb-search-input>
        <div class="search-content mb10">
          <div class="classify-list">
            <cb-filter-condition
              class="filter-condition-width"
              v-model="defalutValue"
              :condition="$t('m.category')"
              :filter-list="classifyLists"
              :props="{ label: 'name', value: 'resource_id' }"
              @change="getClassifyId"
            ></cb-filter-condition>
            <cb-filter-condition
              v-model="defalutValue"
              :condition="$t('m.difficulty')"
              :filter-list="difficultLists"
              :props="{ label: 'name', value: 'resource_id' }"
              @change="getStatus"
            ></cb-filter-condition>
          </div>
        </div>
        <transition name="course-fade" mode="out-in">
          <div class="course-thumb-list" v-if="pagination.total > 0">
            <div class="table-content">
              <div
                class="package-card"
                v-for="item in courseLists"
                :key="item.resource_id"
                @click="gotoDetail(item)"
              >
                <course-card :card-data="item"></course-card>
              </div>
            </div>
            <cb-pagination
              :total="pagination.total"
              :current-page="pagination.currentPage"
              :current="pagination.currentPage"
              :page-size.sync="pagination.per_page"
              @current-change="handleChange"
              @size-change="handleSizeChange"
            ></cb-pagination>
          </div>
          <div class="empty-div" v-else>
            <empty v-if="courseLoading === false"></empty>
          </div>
        </transition>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import Empty from '@/components/empty/index.vue';
import Block from '@/components/block';
import CourseCard from '@/components/course-card/index';
import U from '@/utils/utils.js';
import { getLanguage } from '@cyber/helper';
import _ from 'lodash';

let fetchRedHostReqId = null;

export default {
  components: { Empty, Block, CourseCard },
  data() {
    return {
      language: getLanguage(),
      courseLoading: null,
      defalutValue: null,
      ratio: 0,
      searchInfo: {
        classify: '',
        difficult: '',
        name: '',
      },
      classifyLists: [],
      // 难度分类数据
      difficultLists: [],
      courseLists: [],
      pagination: {
        currentPage: 1,
        per_page: 10,
        total: 0,
      },
    };
  },
  mounted() {
    this.getClassify();
    this.getStudy();
    this.getDifficult();
  },
  methods: {
    getClassifyId(data) {
      this.pagination.currentPage = 1;
      this.searchInfo.classify = data.resource_id;
      this.getStudy();
    },
    getStatus(data) {
      this.pagination.currentPage = 1;
      this.searchInfo.difficult = data.resource_id;
      this.getStudy();
    },
    getSearchName(val) {
      this.searchInfo.name = val;
      this.pagination.currentPage = 1;
      this.getStudy();
    },
    handleChange(val) {
      this.pagination.currentPage = val;
      this.getStudy();
    },
    handleSizeChange(val) {
      this.pagination.currentPage = 1;
      this.pagination.per_page = val;
      this.getStudy();
    },
    gotoDetail(item) {
      this.$router.push({ path: `/all-course/detail/${item.resource_id}/` });
    },
    formatCourseTime(minutes) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      let time = '';
      let hourFormat = '';
      if (hour > 1) {
        hourFormat = hour + (this.language === 'en-US' ? 'h ' : ' 小时 ');
      } else {
        hourFormat = hour + (this.language === 'en-US' ? 'h ' : ' 小时 ');
      }
      let minFormat = '';
      if (min > 1) {
        minFormat = min + (this.language === 'en-US' ? 'm' : ' 分 ');
      } else {
        minFormat = min + (this.language === 'en-US' ? 'm' : ' 分 ');
      }
      if (hour > 0 && min > 0) {
        time = hourFormat + minFormat;
      } else if (hour <= 0 && min > 0) {
        time = minFormat;
      } else if (hour > 0 && min <= 0) {
        time = hourFormat;
      }
      return time;
    },
    // 获取学习内容
    getStudy() {
      this.courseLoading = true;
      fetchRedHostReqId = U.guid();
      this.$request
        .get(
          '/oj/course/list',
          {
            pattern: this.searchInfo.name,
            direction: this.searchInfo.classify,
            difficulty: this.searchInfo.difficult,
            per_page: this.pagination.per_page,
            page: this.pagination.currentPage,
          },
          {
            headers: {
              'x-request-id': fetchRedHostReqId,
            },
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.pagination.total = res.data.data.total;
          const data = _.get(res, 'data.data.list');
          this.courseLists = data;
          window.scrollTo(0, 0);
        })
        .finally(() => {
          this.courseLoading = false;
        });
    },
    // 获取分类
    getClassify() {
      fetchRedHostReqId = U.guid();
      this.$request
        .get(
          '/oj/course/direction',
          {},
          {
            headers: {
              'x-request-id': fetchRedHostReqId,
            },
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.classifyLists = res.data.data;
          this.classifyLists.unshift({
            resource_id: null,
            name: this.$t('m.allTitle'),
          });
        });
    },
    // 获取难度
    getDifficult() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 9,
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
          this.difficultLists = arr;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.oj-course {
  .course-fade-enter-active,
  .course-fade-leave-active {
    transition: all 0.5s;
  }
  .course-fade-enter,
  .course-fade-leave-to {
    opacity: 0;
  }
  .course-pagination {
    .ant-pagination.mini {
      margin: 0 !important;
    }
  }
}
.oj-course {
  .cb-filter-condition-title {
    height: 40px;
  }
  .search-bottom {
    padding-top: 4px !important;
  }
  .search-content {
    min-height: 100px;
    .classify-list {
      position: relative;
      min-height: 84px;
      .filter-condition-width {
        width: 100%;
      }
    }
    .input-div {
      width: 306px;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .course-pagination {
    overflow: hidden;
    width: 100%;
  }
  .course-thumb-list {
    min-height: 300px;
  }
  .empty-div {
    width: 100%;
    height: 300px;
  }
  .table-content {
    // min-height: 325px;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
  }
  .overflow {
    overflow: hidden;
  }
  .package-card {
    position: relative;
    display: flex;
    flex-direction: column;
    width: calc(20% - 12px);
    margin-right: 15px;
    margin-bottom: 15px;
    background: var(--bg-color-2);
    border-radius: 4px;
    &:nth-child(5n + 5) {
      margin-right: 0;
    }
  }
  .prelative {
    position: relative;
  }
  .progress-bar {
    justify-content: center;
    display: flex;
    align-items: center;
    .count {
      margin-right: 10px;
    }
    .line {
      padding: 0 15px;
      color: var(--invalid-color);
    }
    .course-progress {
      width: 160px;
      ::v-deep.el-progress-bar {
        margin: 0 !important;
        padding: 0 !important;
        .el-progress-bar__inner {
          display: flex;
          align-items: center;
          justify-content: center;
          .el-progress-bar__innerText {
            margin: 1px 5px;
          }
        }
      }
    }
    .total {
      margin-left: 10px;
    }
  }
}
</style>
