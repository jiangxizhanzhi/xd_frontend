<template>
  <div class="main-wrap">
    <!-- 左上角标题 -->
    <header-decorate :title="header_title"></header-decorate>
    <!-- 搜索区域 -->
    <div class="search-wrap">
      <span class="label">搜索</span>
      <cb-search-input
        v-model="search"
        :trigger="'input'"
      ></cb-search-input>
      <cb-button
        class="search"
        @click="handlerSearch"
      >搜索</cb-button>
      <cb-button
        hollow
        class="reset"
        @click="handlerReset"
      >重置</cb-button>
      <div class="right-button">
        <cb-button @click="createSceneTemplate">新增</cb-button>
        <cb-button hollow>删除</cb-button>
      </div>
    </div>
    <!-- 列表展示 -->
    <div class="card-list">
      <card-item
        v-for="(item, index) in cardList"
        :key="index"
        :card-data="item"
        @edit="handlerEdit($event)"
        @delete="handlerDelete($event)"
      ></card-item>
    </div>
    <!-- 暂无数据 -->
    <div
      v-if="!cardList.length"
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
      v-if="cardList.length > 0"
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
import EmptyPage from '@/pages/web/Empty';
import { getSceneTemplateListApi } from '@/api/scene-management/index'
import { SCENE_MANAGEMENT_NAME } from './constants'
export default {
  components: {
    HeaderDecorate,
    CardItem,
    EmptyPage,
  },
  data() {
    return {
      SCENE_MANAGEMENT_NAME,
      header_title: "",
      cardList: [],
      search: '',
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
    this.header_title = SCENE_MANAGEMENT_NAME[this.$route.name] || '';
    this.getCardList();
  },
  methods: {
    // 获取卡片列表
    getCardList() {
      const data = {
        per_page: this.pagination.per_page,
        page: this.pagination.currentPage,
        search: this.search,
        type: 3, //团队训练type是3，后面根据不同菜单修改
      };
      getSceneTemplateListApi(data).then((res) => {
        const data = _.get(res, 'data.data.list', [])
        this.cardList = data
        this.pagination.total = res.data.data.total;
      });
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
    // 搜索
    handlerSearch() {
      this.getCardList();
    },
    // 重置
    handlerReset() {
      this.pagination.per_page = 8;
      this.pagination.currentPage = 1;
      this.search = '';
      this.getCardList();
    },
    // 编辑
    handlerEdit(data) {
      this.$router.push({
        name: this.$route.name + '-edit',
        params: { id: data.id },
      });
    },
    // 删除
    handlerDelete(data) {
      this.$confirm(this.$t('确定删除') + '?').then(() => {
        const ids = [data.resource_id];
        this.$request
          .delete(
            '/cr/team_train/template',
            {
              ids: ids,
            },
            { baseURL: '/api/ojj' },
          )
          .then(() => {
            this.getCardList();
          })
      });
    },
    createSceneTemplate() {
      this.$router.push({
        name: this.$route.name + '-add',
      });
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
