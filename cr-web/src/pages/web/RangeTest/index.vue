<template>
  <cb-inner-page class="rangeTest" :background="false">
    <div class="condition-wrapper">
      <search-input
        :placeholder-name="$t('test.EnterTestName')"
        @sendSearchName="getSearchName"
      /><!-- 靶场测评类型 -->
      <div class="search-content mb10">
        <div class="classify-list">
          <cb-filter-condition
            class="filter-condition-width"
            :condition="$t('test.testCategory')"
            :filter-list="classifyLists"
            @change="getSearchType"
          ></cb-filter-condition>
        </div>
      </div>
      <!-- 新增测试按钮 -->
      <div class="range-test-task-content tabsCommon">
        <cb-button icon="icon-xinzeng" color-type="hollow" @click="addTest"
          >{{ $t('test.addTest') }}
        </cb-button>
      </div>
    </div>
    <div class="range-test">
      <!-- 列表展示 -->
      <div class="test-list">
        <div
          class="package-card"
          v-for="item in testLists"
          :key="item.resource_id"
          @mouseover="mouseover(item.resource_id)"
          @mouseleave="mouseleave"
          @click="toDetail(item)"
        >
          <div class="img-box">
            <img :src="item.logo_path" alt="" />
          </div>
          <div class="text-box">
            <div :title="item.name" class="test-name">{{ item.name }}</div>
            <div :title="computedType(item.category_code)" class="test-type">
              {{ computedType(item.category_code) }}
            </div>
          </div>

          <!-- 编辑 删除图标 -->
          <transition name="el-fade-in">
            <div class="edit-delete-btn" v-show="item.resource_id === activeId">
              <div @click.stop="editTest(item)">
                <cb-iconfont type="icon-bianji" size="17" />
              </div>
              <div @click.stop="deleteTest(item)">
                <cb-iconfont type="icon-shanchu" size="17" />
              </div>
            </div>
          </transition>
        </div>
      </div>
      <!-- 暂无数据 -->
      <div
        v-if="!testLists.length"
        class="empty-comp"
        style="
          width: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "
      >
        <empty-page ref="emptyComp" />
      </div>
      <!-- 分页 -->
      <cb-pagination
        v-if="pagination.total > 0"
        :current-page="pagination.currentPage"
        :total="pagination.total"
        :page-size.sync="pagination.per_page"
        :page-sizes="['10', '20', '30']"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current="pagination.current_page"
        style="text-align: right"
      >
      </cb-pagination>
    </div>
  </cb-inner-page>
</template>

<script>
import {
  getAllTest,
  getCategory,
  deleteCurrentTest,
} from '@/api/web/range-test.js';
import emptyPage from '@/pages/web/Empty';
import SearchInput from '@/components/SearchCondition/SearchInput.vue';
import IndexDB from '@/utils/indexDB.js';
export default {
  components: {
    emptyPage,
    SearchInput,
  },
  data() {
    return {
      classifyLists: [],
      testLists: [],
      category_code: null,
      // 模糊查询搜索条件
      pattern: '',
      // 查询根据创建时间排序
      sort: '-create_time',
      pagination: {
        currentPage: 1,
        per_page: 10,
        total: 0,
      },
      // 当前激活卡片
      activeId: '',
      cacheAllList: [], // 单兵所有缓存值
      myCacheList: [], // 本人的缓存
    };
  },
  created() {
    IndexDB.dbInit('range');
    this.getTestList();
    this.getType();
  },
  async mounted() {
    this.cacheAllList = await IndexDB.dbOperation('range', 'getAll');
    if (this.cacheAllList && this.cacheAllList[0]) {
      // 如果有值，则去判断是否有本人的缓存
      this.myCacheList = _.filter(this.cacheAllList, (item) => {
        const idSplit = item.id.slice(0, 32); // 截取uesrId
        return idSplit === this.$store.state.user.id;
      });
    }
  },
  methods: {
    getSearchType(val) {
      this.category_code = val.value;
      this.pagination.currentPage = 1;
      this.getTestList();
    },
    // 获取测试类型
    getType() {
      getCategory({
        type: 4,
      }).then((res) => {
        let arr = res.data.data;
        arr = arr.map((item) => {
          return {
            label: item.name.toString(),
            value: item.code,
          };
        });
        arr.unshift({ label: this.$t('m.all'), value: '' });
        this.classifyLists = arr;
      });
    },
    // 获取测试列表
    getTestList() {
      const data = {
        category_code: this.category_code,
        per_page: this.pagination.per_page,
        page: this.pagination.currentPage,
        pattern: this.pattern,
        sort: this.sort,
      };
      getAllTest(data).then((res) => {
        this.testLists = res.data.data.list;
        this.pagination.total = res.data.data.total;
      });
    },
    computedType(typeId) {
      const data = this.classifyLists.filter((item) => item.value === typeId);
      if (data.length) {
        return data[0].label;
      }
    },
    getSearchName(val) {
      this.pattern = val;
      this.pagination.currentPage = 1;
      this.getTestList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getTestList();
    },
    handleSizeChange(val) {
      this.pagination.currentPage = 1;
      this.pagination.per_page = val;
      this.getTestList();
    },
    mouseover(id) {
      this.activeId = id;
    },
    mouseleave() {
      this.activeId = '';
    },
    // 新增测试
    addTest() {
      if (this.myCacheList && this.myCacheList[0]) {
        this.comGo('add');
      } else {
        this.$router.push({ path: `/range-test/create` });
      }
    },
    comGo(type, item) {
      this.$confirm(
        this.$t('crEvent.isRecoverTopoScene'),
        this.$t('common.info'),
        {
          type: 'warning',
        },
      )
        .then(() => {
          const cacheSplit = this.myCacheList[0].id.split('-');
          // 切割id，判断是新增还是编辑
          if (cacheSplit[1] === 'add') {
            this.$router.push({ path: `/range-test/create` });
          } else {
            this.$router.push({
              name: 'edit-test',
              params: { id: cacheSplit[1] },
            });
          }
        })
        .catch(() => {
          IndexDB.dbOperation('range', 'delete', this.myCacheList[0].id).then(
            (res) => {
              this.myCacheList = [];
              if (type === 'add') {
                this.$router.push({ path: `/range-test/create` });
              } else {
                this.$router.push({
                  name: 'edit-test',
                  params: { id: item.resource_id },
                });
              }
            },
          );
        });
    },
    // 删除测试
    deleteTest(item) {
      this.$confirm(this.$t('common.confirmDelete') + '?').then(() => {
        deleteCurrentTest({
          template_ids: [item.resource_id],
        }).then((res) => {
          this.getTestList();
          this.$message({
            type: 'success',
            message: this.$t('common.deleteSuccessful'),
          });
        });
      });
    },
    // 编辑测试
    editTest(item) {
      if (this.myCacheList && this.myCacheList[0]) {
        this.comGo('edit', item);
      } else {
        this.$router.push({
          name: 'edit-test',
          params: { id: item.resource_id },
        });
      }
    },
    // 跳转详情
    toDetail(item) {
      this.$router.push({
        name: 'test-detail',
        params: { templateId: item.resource_id },
      });
    },
  },
};
</script>

<style lang="scss">
.range-test-task-content {
  border-radius: 4px;
  position: absolute;
  right: 5px;
  bottom: 5px;
  z-index: 888;
  .configurations {
    height: 25px;
    margin-left: 10px;
  }
  .el-button--small,
  .el-button--small.is-round {
    padding: 6px 15px !important;
  }
  .el-tabs__item {
    height: 26px !important;
    line-height: 25px;
    padding: 0 17px !important;
  }
  .tabsCommon .el-tabs__nav {
    height: 26px !important;
  }
}

.test-list {
  width: 100%;
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  .package-card {
    position: relative;
    display: flex;
    flex-direction: column;
    width: calc(20% - 12px);
    margin-right: 15px;
    margin-bottom: 15px;
    background: var(--bg-color-2);
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      img {
        transform: scale(1.1);
        transition: all 0.5s ease;
      }
      .text-box {
        background: var(--neutral0);
        .test-name {
          color: var(--primary-color);
        }
      }
    }
    &:nth-child(5n) {
      margin-right: 0;
    }

    .img-box {
      width: 100%;
      padding-bottom: 56%;
      position: relative;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 4px 4px 0 0;
        transition: all 0.5s ease;
      }
    }

    .text-box {
      width: 100%;
      height: 66px;
      padding-top: 14px;
      padding-left: 16px;
      .test-name {
        font-size: 14px;
        height: 22px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: var(--neutral8);
        line-height: 22px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        padding-right: 10px;
      }
      .test-type {
        font-size: 12px;
        height: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: var(--neutral5);
        line-height: 20px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        padding-right: 60px;
      }
    }

    .edit-delete-btn {
      position: absolute;
      bottom: 10px;
      right: 10px;
      width: 50px;
      display: flex;
      justify-content: space-between;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.condition-wrapper {
  position: relative;
  left: 0;
  top: 0;
  margin-bottom: 16px;
  background-color: var(--bg-color-2);
  padding: 16px;
}
</style>
