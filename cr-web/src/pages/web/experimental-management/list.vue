<template>
  <cb-inner-page :background="false">
    <div
      class="red-blue-page page"
      style="height: 100%"
    >
      <!-- 筛选区域 -->
      <div class="condition-wrap">
        <div
          class="search-wrap"
          v-if="activeName === 'myTrain'"
        >
          <cb-select
            v-model="searchCondition.category"
            :options="categoryList"
            @change="categoryChange"
          ></cb-select>
          <cb-select
            class="search-item"
            v-model="searchCondition.difficult"
            :options="difficultList"
            @change="difficultChange"
          ></cb-select>
          <cb-search-input
            class="search-item"
            v-model="searchCondition.search"
            :placeholder="$t('list.enterTrainName')"
            @change="getSearchName"
          />
        </div>
        <div
          class="search-wrap"
          v-if="activeName === 'trainTemplate'"
        >
          <cb-select
            v-model="templateSearchCondition.category"
            :options="categoryList"
            @change="templateCategoryChange"
          ></cb-select>
          <cb-select
            class="search-item"
            v-model="templateSearchCondition.difficult"
            :options="difficultList"
            @change="templateDifficultChange"
          ></cb-select>
          <cb-search-input
            class="search-item"
            v-model="templateSearchCondition.search"
            :placeholder="$t('list.enterTemplateName')"
            @change="getTemplateSearchName"
          />
        </div>
        <cb-tabs v-model="activeName">
          <cb-tab-pane
            :label="$t('list.myTrain')"
            name="myTrain"
          ></cb-tab-pane>
          <cb-tab-pane
            :label="$t('list.trainTemplate')"
            name="trainTemplate"
          ></cb-tab-pane>
        </cb-tabs>
      </div>
      <!-- 我的训练 -->
      <!-- element-loading-spinner="el-icon-loading" -->

      <div
        v-if="activeName === 'myTrain'"
        v-loading="loading"
        class="train_lists train_list_tabs"
      >
        <div
          :key="item.resource_id"
          v-for="item in trainList"
          @click="
            goSceneTopology(
              item.training_role_data.role_group,
              item.resource_id,
            )
            "
        >
          <my-train
            :item-data="item"
            :difficult-list="difficultList"
            :category-list="categoryList"
            :roles="item.training_role_data"
            @attEngageEvent="attEngageShow"
          ></my-train>
        </div>
        <!-- 暂无数据 -->
        <div
          v-if="!trainList.length && !loading"
          class="empty-comp"
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        >
          <empty-page ref="emptyComp" />
        </div>
      </div>
      <!-- 我的训练分页组件 -->
      <div
        v-if="trainList.length && !loading && activeName === 'myTrain'"
        class="train_page"
      >
        <cb-pagination
          background
          class="elc-pagination"
          :current-page="pagination.current_page"
          layout="total,sizes, prev, pager, next,jumper"
          :total="pagination.total"
          :page-size.sync="pagination.per_page"
          :page-sizes="['10', '20', '30', '50', '100']"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current="pagination.current_page"
          style="text-align: right"
        >
          <span class="total_span">{{ $t('m.totalPage')
          }}<span class="total-num">{{ pagination.total }}</span>
            <template v-if="pagination.total > 1">
              {{ $t('m.totalRecord') }}
            </template>
            <template v-else>
              {{ $t('m.totalRecordSingular') }}
            </template>
          </span>
        </cb-pagination>
      </div>
      <!-- 训练模板 -->
      <div
        v-if="activeName === 'trainTemplate'"
        v-loading="templateLoading"
        class="train_lists train_list_tabs"
      >
        <div
          :key="item.resource_id"
          v-for="item in templateList"
          @click="goTemplateDetail(item)"
        >
          <train-template
            :item-data="item"
            :difficult-list="difficultList"
            :category-list="categoryList"
            :roles="item"
            @attEngageEvent="attEngageShow"
          >
            <div @click.stop="
              createTrain(item.resource_id, item.business_template_id)
              ">
              <cb-button hollow>{{ $t('list.addTraining') }}</cb-button>
            </div>
          </train-template>
        </div>
        <!-- 暂无数据 -->
        <div
          v-if="!templateList.length && !templateLoading"
          class="empty-comp"
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        >
          <empty-page ref="emptyComp" />
        </div>
      </div>
      <!-- 训练模板分页组件 -->
      <div
        v-if="
          templateList.length &&
          !templateLoading &&
          activeName === 'trainTemplate'
        "
        class="train_page"
      >
        <cb-pagination
          background
          class="elc-pagination"
          :current-page="templatePagination.current_page"
          layout="total,sizes, prev, pager, next,jumper"
          :total="templatePagination.total"
          :page-size.sync="templatePagination.per_page"
          :page-sizes="['10', '20', '30', '50', '100']"
          @current-change="handleTemplateCurrentChange"
          @size-change="handleTemplateSizeChange"
          :current="templatePagination.current_page"
          style="text-align: right"
        >
          <span class="total_span">{{ $t('m.totalPage')
          }}<span class="total-num">{{ templatePagination.total }}</span>
            <template v-if="templatePagination.total > 1">
              {{ $t('m.totalRecord') }}
            </template>
            <template v-else>
              {{ $t('m.totalRecordSingular') }}
            </template>
          </span>
        </cb-pagination>
      </div>
    </div>
    <!-- ATT&CK弹框 -->
    <cb-dialog
      width="1430px"
      height="calc(100vh - 220px)"
      class="att-engage-dialog"
      :title="$t('ATT&CK')"
      :visible.sync="attDialogVisible"
      center="center"
    >
      <att-ck-dialog :id="resource_id_related"></att-ck-dialog>
    </cb-dialog>
    <!-- Engage弹框 -->
    <cb-dialog
      width="1430px"
      height="calc(100vh - 220px)"
      class="att-engage-dialog"
      :title="$t('Engage')"
      :visible.sync="engageDialogVisible"
      center="center"
    >
      <engage-dialog :id="resource_id_related"></engage-dialog>
    </cb-dialog>
  </cb-inner-page>
</template>
<script>
import _ from 'lodash';
import emptyPage from '@/pages/web/Empty';
import SearchInput from '@/components/SearchCondition/SearchInput.vue';
import {
  getTrainingCategoryApi,
  getDifficultListsApi,
  getTrainListApi,
  getTemplateListApi,
} from '@/api/web/team-training';
import { getTemplatePermission } from '@/api/web/red-blue';
import collapseTransition from '@/components/collapase/index';
import defaultLogo from '@/assets/img/userhead.png';
import AttCkDialog from '@/components/att-engage/att-ck-dialog.vue';
import EngageDialog from '@/components/att-engage/engage-dialog.vue';
import myTrain from './components/my-train.vue';
import trainTemplate from './components/train-templates.vue';
import { EXPERIMENTAL_SUBJECT_MANAGEMENT_TYPE, EXPERIMENTAL_SUBJECT_TEMPLATE_TYPE } from './constants'

export default {
  name: 'redBlueList',
  components: {
    collapseTransition,
    myTrain,
    trainTemplate,
    emptyPage,
    SearchInput,
    AttCkDialog,
    EngageDialog,
  },
  data() {
    return {
      roleType: 2, // 1: 教员 2:学员
      defaultLogo,
      categoryList: [],
      difficultList: [],
      activeName: 'myTrain',
      searchCondition: {
        search: '',
        difficult: '',
        category: '',
      },
      templateSearchCondition: {
        search: '',
        difficult: '',
        category: '',
      },
      loading: true,
      templateLoading: true,
      trainList: [],
      templateList: [],
      // 我的训练分页
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
      },
      // 训练模板分页
      templatePagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
      },
      resource_id_related: '',
      attDialogVisible: false,
      engageDialogVisible: false,
      templateId:
        this.$route.params &&
        (this.$route.params.templateId || this.$route.params.template_id),
      preRouterName: this.$preRouter && this.$preRouter.name,
    };
  },
  computed: {},
  watch: {
    templateId: {
      handler(nv) {
        if (nv) {
          this.activeName = 'trainTemplate';
        }
      },
      immediate: true,
    },
    preRouterName: {
      handler(nv) {
        if (nv === 'team-train-template-detail') {
          this.activeName = 'trainTemplate';
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getTrainingCategory();
    this.getDifficultLists();
    this.getTrainList();
    this.getTemplateList();
  },
  mounted() { },
  beforeDestroy() { },
  methods: {
    // 我的训练跳转详情页面
    goSceneTopology(roleType, id) {
      localStorage.setItem('role_group', roleType);
      if (roleType === 2) {
        // this.$router.push(`/student_combat/${id}/`);
        const url = this.$router.resolve({
          // name: 'student_combat',
          name: this.$route.name + '-student-combat',
          params: {
            resource_id: id,
          },
          // path: `/student_combate/${id}`,
        });
        window.open(url.href, '_self');
      } else {
        // this.$router.push(`/team_train/${id}/`);
        const url = this.$router.resolve({
          // name: 'train-detail-home',
          name: this.$route.name + '-home',
          params: {
            resource_id: id,
          },
          // path: `/train-detail-home/${id}`,
        });
        window.open(url.href, '_self');
      }
    },
    getTrainingCategory() {
      getTrainingCategoryApi({ type: 3 }).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.categoryList = data.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
        this.categoryList.unshift({
          label: this.$t('list.allTraining'),
          value: '',
        });
      });
    },
    getDifficultLists() {
      getDifficultListsApi({ type: 24 }).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.difficultList = data.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
        this.difficultList.unshift({
          label: this.$t('list.allDifficulty'),
          value: '',
        });
      });
    },
    // 获取我的训练列表
    getTrainList() {
      const searchParams = this.searchCondition;
      searchParams.page = this.pagination.current_page;
      searchParams.per_page = this.pagination.per_page;
      searchParams.xd_type = EXPERIMENTAL_SUBJECT_MANAGEMENT_TYPE[this.$route.name]
      this.loading = true;
      getTrainListApi(searchParams).then((res) => {
        const data = _.get(res, 'data.data', []);
        data.list.forEach((item) => {
          const role_user = [];
          item.training_role_data.role_data_list.forEach((role) => {
            role.user_infos.forEach((user) => {
              role_user.push({
                role_name: role.role_name,
                role_group: role.role_group,
                role_user: user.rep_name,
                role_logo: user.logo,
              });
            });
          });
          this.$set(item, 'role_data_list', role_user);
        });
        this.trainList = data.list;
        this.pagination.total = data.total;
        this.loading = false;
      });
    },
    // 获取训练模板列表
    getTemplateList() {
      const searchParams = this.templateSearchCondition;
      searchParams.page = this.templatePagination.current_page;
      searchParams.per_page = this.templatePagination.per_page;
      searchParams.xd_template_type = EXPERIMENTAL_SUBJECT_TEMPLATE_TYPE[this.$route.name], //不同菜单对应不同参数
        this.templateLoading = true;
      getTemplateListApi(searchParams).then((res) => {
        const data = _.get(res, 'data.data', []);
        data.records.forEach((item) => {
          const role_detail = [];
          item.role_structure.forEach((role) => {
            role_detail.push({
              role_name: role.name,
              role_group: role.role_group,
            });
          });
          this.$set(item, 'role_detail', role_detail);
        });
        this.templateList = data.records;
        this.templatePagination.total = data.total;
        this.templateLoading = false;
      });
    },
    // 我的训练分类筛选
    categoryChange(val) {
      this.searchCondition.category = val;
      this.pagination.current_page = 1;
      this.getTrainList();
    },
    // 我的训练难度筛选
    difficultChange(val) {
      this.searchCondition.difficult = val;
      this.pagination.current_page = 1;
      this.getTrainList();
    },
    // 我的训练名称搜索
    getSearchName(val) {
      this.searchCondition.search = val;
      this.pagination.current_page = 1;
      this.getTrainList();
    },
    // 我的训练当前页
    handleCurrentChange(val) {
      this.pagination.current_page = val;
      this.getTrainList();
    },
    // 我的训练分页大小
    handleSizeChange(val) {
      this.pagination.current_page = 1;
      this.pagination.per_page = val;
      this.getTrainList();
    },
    // 训练模板分类筛选
    templateCategoryChange(val) {
      this.templateSearchCondition.category = val;
      this.templatePagination.current_page = 1;
      this.getTemplateList();
    },
    // 训练模板难度筛选
    templateDifficultChange(val) {
      this.templateSearchCondition.difficult = val;
      this.templatePagination.current_page = 1;
      this.getTemplateList();
    },
    // 训练模板名称搜索
    getTemplateSearchName(val) {
      this.templateSearchCondition.search = val;
      this.templatePagination.current_page = 1;
      this.getTemplateList();
    },
    // 训练模板当前页
    handleTemplateCurrentChange(val) {
      this.templatePagination.current_page = val;
      this.getTemplateList();
    },
    // 训练模板分页大小
    handleTemplateSizeChange(val) {
      this.templatePagination.current_page = 1;
      this.templatePagination.per_page = val;
      this.getTemplateList();
    },
    // ATT&CK 、Engage点击
    attEngageShow(data, type) {
      this.resource_id_related = data.business_template_id;
      if (type) {
        this.attDialogVisible = true;
      } else {
        this.engageDialogVisible = true;
      }
    },

    // 训练模板点击跳转详情
    goTemplateDetail(item) {
      this.$router.push({
        name: this.$route.name + '-template-detail',
        params: {
          resource_id: item.resource_id,
          template_id: item.business_template_id,
        },
      });
    },
    // 训练模板列表点击创建训练
    createTrain(id, business_template_id) {
      getTemplatePermission({ resource_id: business_template_id }).then(
        (res) => {
          this.$router.push({
            name: this.$route.name + '-create',
            params: {
              templateId: id,
              business_template_id: business_template_id,
            },
          });
        },
      );
    },
    getRoleName(role) {
      let name = '';
      if (role === this.$CONSTANT.Role.RedVsBlue.ADMIN.value) {
        name = this.$t('common.admin');
      } else if (role === this.$CONSTANT.Role.RedVsBlue.DIRECTOR.value) {
        name = this.$t('common.director');
      } else if (role === this.$CONSTANT.Role.RedVsBlue.REFEREE.value) {
        name = this.$t('common.referee');
      }
      return name;
    },
  },
};
</script>
<style lang="scss" scoped>
.arrowTransform {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}

// engage、attck弹窗样式
.arrowTransformReturn {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(180deg);
}

.att-engage-dialog {
  ::v-deep .el-dialog {
    margin-top: 8vh !important;
  }

  ::v-deep .cb-scrollbar.overflow-x-disable .el-scrollbar .el-scrollbar__wrap {
    overflow-x: auto !important;
  }

  ::v-deep .cb-scrollbar.overflow-x-disable .el-scrollbar .el-scrollbar__wrap::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::v-deep .cb-scrollbar.overflow-x-disable .el-scrollbar .el-scrollbar__wrap::-webkit-scrollbar-thumb {
    background: var(--scrollbar-color);
    border-radius: 6px;
  }
}

.red-blue-page {
  .condition-wrap {
    margin-bottom: 16px;
    background-color: var(--bg-color-2);
    padding: 16px 16px 0 16px;
    border-radius: 4px;

    .search-wrap {
      display: flex;

      .search-item {
        margin-left: 10px;
      }
    }

    .cb-tabs {
      margin-top: 16px;
    }

    ::v-deep .el-tabs__header {
      margin: 0;
    }

    ::v-deep .cb-tabs .el-tabs .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
  }

  .train_lists {
    position: relative;
    height: calc(100% - 210px);
  }
}
</style>
