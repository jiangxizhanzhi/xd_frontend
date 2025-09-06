<template>
  <div class="workbook-box">
    <div v-if="workbookList.length !== 0" class="all-workbook">
      <div
        v-for="(item, index) in workbookList"
        :key="index"
        class="single-box"
        @click="toWorkbook(item)"
      >
        <WorkBookCard
          :logo="item.logo || defaultLogo"
          :logo-is-built-in="item.logo_is_built_in"
          :name="item.name"
          :showCount="true"
          :count="item.practice_count"
        />
        <div class="bottom-info one-overflow">
          <span :title="item.name">{{ item.name }} </span>
        </div>
      </div>
    </div>
    <div v-else>
      <empty />
    </div>
    <div v-if="workbookList.length !== 0" class="pagination-box">
      <cb-pagination
        class="practice-pagination"
        :total="wookbook.total"
        :current-page="wookbook.currentPage"
        :page-size.sync="wookbook.currentSize"
        layout=" prev,  next"
        :showQuickJumper="false"
        :showTotalTag="false"
        @current-change="wookbookPageChange"
      ></cb-pagination>
    </div>
  </div>
</template>
<script>
import empty from '@/components/empty/index.vue';
import Default from '@/assets/img/course/logo.jpg';
import WorkBookCard from './workbook-card.vue';
export default {
  components: {
    empty,
    WorkBookCard,
  },
  props: {
    type: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      defaultLogo: Default,
      workbookList: [],
      wookbook: {
        // 习题集模式
        search: '',
        total: 0,
        currentPage: 1, // 列表当前页码
        currentSize: 6, // 列表每页条数
      },
      screenWidth: '',
    };
  },
  watch: {
    screenWidth() {
      if (this.screenWidth <= 1440 && this.wookbook.currentSize !== 5) {
        this.wookbook.currentSize = 5;
        this.wookbook.currentPage = 1;
        this.getWookbookList();
      } else if (this.screenWidth > 1440 && this.wookbook.currentSize !== 6) {
        this.wookbook.currentSize = 6;
        this.wookbook.currentPage = 1;
        this.getWookbookList();
      }
    },
  },
  created() {},
  mounted() {
    this.screenWidth = document.body.clientWidth;
    if (this.screenWidth <= 1440) {
      this.wookbook.currentSize = 5;
    }
    this.getWookbookList();
    window.rawWindow.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        this.screenWidth = window.screenWidth;
      })();
    };
  },
  methods: {
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
    // 习题集页数切换
    wookbookPageChange(val) {
      this.wookbook.currentPage = val;
      this.getWookbookList();
    },
    toWorkbook(item) {
      this.$emit('toWorkbook', item);
    },
  },
};
</script>
<style lang="scss" scoped>
.workbook-box {
  position: relative;
  .all-workbook {
    position: relative;
    display: flex;
    width: 100%;
  }
  .single-box {
    cursor: pointer;
    width: 100%;
    height: 100%;
    position: relative;
    width: calc(16.66% - 10px);
    margin-right: 12px;
    background: var(--neutral0);
    border-radius: 4px;
    color: var(--neutral8);
    &:hover {
      background: var(--neutral1);
      img {
        transform: scale(1.1);
        transition: all 0.5s ease;
      }
      .bottom-info {
        span {
          color: var(--primary-color);
        }
      }
    }

    .bottom-info {
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding: 0 12px;
      span {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 600;
      }
    }
    &:nth-child(5n) {
      margin-right: 12px;
    }
    &:nth-child(6n) {
      margin-right: 0;
    }
  }
  // 1440屏幕
  @media screen and (max-width: 1440px) {
    .single-box {
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
  .pagination-box {
    position: absolute;
    right: 0;
    top: -36px;
  }
}
</style>
<style lang="scss">
.workbook-box {
  .pagination-box {
    .ant-pagination-item,
    .ant-pagination-options {
      display: none;
    }
  }
}
</style>
