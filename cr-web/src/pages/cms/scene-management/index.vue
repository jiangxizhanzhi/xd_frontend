<template>
  <div class="main-wrap">
    <template v-if="isAuthActive">
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
          <cb-button
            button-type="add"
            @click="createSceneTemplate"
          >新增</cb-button>
          <!--          <cb-button hollow>删除</cb-button>-->
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
          @copy="copySceneTemplate($event)"
          @distribute="distributeSeneTemplate($event)"
          @createSingleTrain="createSingleTrain($event)"
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
    </template>
    <private-exercises-auth
      v-if="!isAuthActive"
      :authIds="authIds"
      @close="getAuthActive"
    ></private-exercises-auth>
  </div>
</template>

<script>
import HeaderDecorate from '@/components/header-decorate/index.vue';
import CardItem from '@/components/card-item/index.vue';
import EmptyPage from '@/pages/web/Empty';
import PrivateExercisesAuth from './private-exercises-batch.vue';
import { getSceneTemplateListApi, copySceneTemplateApi, copySingleTrainApi } from '@/api/scene-management/index'
import { SCENE_MANAGEMENT_NAME, SCENE_MANAGEMENT_TYPE } from './constants'
export default {
  components: {
    HeaderDecorate,
    CardItem,
    EmptyPage,
    PrivateExercisesAuth,
  },
  data() {
    return {
      SCENE_MANAGEMENT_NAME,
      SCENE_MANAGEMENT_TYPE,
      header_title: "",
      cardList: [],
      search: '',
      pagination: {
        currentPage: 1,
        per_page: 8,
        total: 0,
      },
      isAuthActive: true,
      authIds: [],
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
        xd_template_type: SCENE_MANAGEMENT_TYPE[this.$route.name], //不同菜单对应不同参数
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
            this.$message.success('操作成功');
          })
      });
    },
    // 复制
    copySceneTemplate(data) {
      copySceneTemplateApi({
        resource_id: data.resource_id
      }).then(res => {
        this.getCardList();
        this.$message.success('操作成功');
      })
    },
    // 创建单兵训练
    createSingleTrain(data) {
      copySingleTrainApi({
        resource_id: data.resource_id
      }).then(res => {
        this.$message.success('操作成功');
      })
    },
    // 授权操作(发布)
    distributeSeneTemplate(data) {
      this.authIds = [data.resource_id];
      this.isAuthActive = false;
    },
    getAuthActive(value) {
      this.isAuthActive = value;
      this.getCardList();
      this.$message.success('操作成功');
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
