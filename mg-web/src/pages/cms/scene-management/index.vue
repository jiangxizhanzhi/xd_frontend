<template>
  <div class="main-wrap">
    <!-- 左上角标题 -->
    <header-decorate :title="'云计算资源场景'"></header-decorate>
    <!-- 搜索区域 -->
    <div class="search-wrap">
      <span class="label">搜索</span>
      <cb-search-input></cb-search-input>
      <cb-button class="search">搜索</cb-button>
      <cb-button
        hollow
        class="reset"
      >重置</cb-button>
      <div class="right-button">
        <cb-button>新增</cb-button>
        <cb-button hollow>删除</cb-button>
      </div>
    </div>
    <!-- 列表展示 -->
    <div class="card-list">
      <card-item
        v-for="(item, index) in testLists"
        :key="index"
        :card-data="item"
      ></card-item>
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
      v-if="testLists.length > 0"
      :current-page="pagination.currentPage"
      :total="pagination.total"
      :page-size.sync="pagination.per_page"
      :page-sizes="['8', '16', '32', '64']"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current="pagination.current_page"
      style="text-align: right"
    >
    </cb-pagination>
  </div>
</template>

<script>
import HeaderDecorate from '@/components/header-decorate/index.vue';
import CardItem from '@/components/card-item/index.vue';
export default {
  components: {
    HeaderDecorate,
    CardItem
  },
  data() {
    return {
      testLists: [
        {
          name: '云计算资源使用与管理训练实验场景',
          desc: '场景描述：XXXXXXXXXXXXXX',
          distribute: true,
        },
        {
          name: '云计算资源使用与管理训练实验场景',
          desc: '场景描述：XXXXXXXXXXXXXX',
          distribute: true,
        },
        {
          name: '云计算资源使用与管理训练实验场景',
          desc: '场景描述：XXXXXXXXXXXXXX',
          distribute: true,
        },
        {
          name: '云计算资源使用与管理训练实验场景',
          desc: '场景描述：XXXXXXXXXXXXXX',
          distribute: true,
        },
        {
          name: '云计算资源使用与管理训练实验场景',
          desc: '场景描述：XXXXXXXXXXXXXX',
          distribute: false,
        },
        {
          name: '云计算资源使用与管理训练实验场景',
          desc: '场景描述：XXXXXXXXXXXXXX',
          distribute: false,
        },
        {
          name: '云计算资源使用与管理训练实验场景',
          desc: '场景描述：XXXXXXXXXXXXXX',
          distribute: false,
        },
        {
          name: '云计算资源使用与管理训练实验场景',
          desc: '场景描述：XXXXXXXXXXXXXX',
          distribute: false,
        },
      ],
      pattern: '',
      pagination: {
        currentPage: 1,
        per_page: 8,
        total: 0,
      },
    };
  },
  computed: {},
  created() {

  },
  mounted() {

  },
  methods: {
    // 获取卡片列表
    getCardList() {
      const data = {
        per_page: this.pagination.per_page,
        page: this.pagination.currentPage,
        pattern: this.pattern,
      };
      // getAllTest(data).then((res) => {
      //   this.testLists = res.data.data.list;
      //   this.pagination.total = res.data.data.total;
      // });
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getCardList();
    },
    handleSizeChange(val) {
      this.pagination.currentPage = 1;
      this.pagination.per_page = val;
      this.getCardList();
    },
  },
};
</script>

<style scoped lang="scss">
.main-wrap {
  width: 100%;
  background: var(--bg-color-2);
  padding: 16px;

  .search-wrap {
    height: 48px;
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    position: relative;

    .label {
      font-size: 14px;
      margin-right: 8px;
    }

    .cb-search-input {
      margin-right: 8px;
    }

    .search,
    .reset {
      margin: 0 8px;
    }

    .right-button {
      position: absolute;
      right: 0;
      top: 8px;

      .cb-button {
        margin-left: 8px;
      }
    }
  }

  .card-list {
    width: 100%;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
  }
}
</style>
