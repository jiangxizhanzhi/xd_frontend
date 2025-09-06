<template>
  <cb-inner-page :background="false">
    <div class="red_blue_page page" style="height: 100%">
      <!-- 搜索组件 -->
      <div class="condition-wrapper">
        <search-input
          class="search-input"
          :placeholder-name="$t('m.rangeNamePH')"
          @sendSearchName="getSearchName"
        />
        <!-- 训练类别 -->
        <cb-filter-condition
          :condition="this.$t('m.trainCate')"
          :filterList="typeSearch.typeLists"
          @change="getSearchType"
        ></cb-filter-condition>
        <cb-filter-condition
          :condition="difficultSearch.difficultConditionName"
          :filterList="difficultLists"
          @change="getSearchDifficult"
        ></cb-filter-condition>

        <div class="task-content tabsCommon">
          <cb-button
            icon="icon-xinzeng"
            color-type="hollow"
            @click="createTemplate"
            >{{ $t('m.openTraining') }}</cb-button
          >
        </div>
      </div>
      <!-- 训练列表展示 -->
      <ul
        v-if="trainList.length"
        v-loading="loading"
        class="train_lists train_list_tabs"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(35, 44, 59, .7)"
      >
        <li
          v-for="item in renderList"
          :key="item.resource_id"
          class="trains_item"
          @click="goSceneTopology(item)"
        >
          <list-common
            :item-data="item"
            @attEngageEvent="attEngageShow"
            :difficultLists="difficultLists"
          >
            <!--非普通用户列表训练-未开始 and 已运行 -->
            <list-roles :roles="item.role_permission" />
          </list-common>
        </li>
      </ul>
      <!-- 数据数据 -->
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
      <!-- 红蓝对抗列表分页组件 -->
      <div v-if="trainList.length && !loading" class="train_page">
        <cb-pagination
          background
          class="elc-pagination"
          :current-page="pagination.current_page"
          layout="total,sizes, prev, pager, next,jumper"
          :total="pagination.total"
          :page-size.sync="pagination.per_page"
          :page-sizes="['10', '20', '30']"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current="pagination.current_page"
          style="text-align: right"
        >
          <span class="total_span"
            >{{ $t('m.totalPage')
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
      <red-blue-add
        ref="addRedVsBlue"
        :create-form="createFormVal"
        @createSuccess="addCreate"
        @prevChange="emptyCreateForm"
        :isCheck="isCheck"
        :isCheckValue="isCheckValue"
        :isChecks="isChecks"
        :isChecksValue="isChecksValue"
      >
        <change-template
          slot="changeTemplate"
          :type-search-data="typeSearch"
          :difficult-search-data="difficultSearch"
          :template-list="templateList"
          :pagination-info="paginationTemplate"
          :difficultLists="difficultLists"
          @templateType="searchTemplateType"
          @templateDifficult="searchTemplateDifficult"
          @templateName="searchTemplateName"
          @templateCurrent="getTemplateCurrent"
          @templateSize="getTemplateSize"
          @choosedScence="getChoosed"
        />
        <write-content
          slot="writeContent"
          ref="writeContent"
          :form-info="createFormVal"
          @createFormSuccess="formValidateSuccess"
          @sendVal="getChildComVal"
          @sendVals="getChildComVals"
          @checkValue="getNewCheckValue"
          @checksValue="getNewChecksValue"
        />
      </red-blue-add>
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
import { mapGetters } from 'vuex';
import stuScore from '@/pages/web/team-train/components/stuscore';
import emptyPage from '@/pages/web/Empty';
import SearchInput from '@/components/SearchCondition/SearchInput.vue';
import Search from '@/components/SearchCondition/Search.vue';
import ListCommon from '@/components/ListCommon/index.vue';
import ListRoles from '@/components/ListCommon/ListRoles.vue';
import ChangeTemplate from '@/pages/web/RedVsBlue/Common/activitylist/components/change-template.vue';
import WriteContent from '@/pages/web/RedVsBlue/Common/activitylist/components/write-content.vue';
import { singleFormatTime } from '@/assets/js/tools.js';
import RedBlueAdd from './add_dialog.vue';
import notStartImg from '@/assets/img/singleTrain/not-start-icon.png';
import runningImg from '@/assets/img/singleTrain/running-icon.png';
import endImg from '@/assets/img/singleTrain/end-icon.png';
import notStartImgLight from '@/assets/img/singleTrain/not-start-icon-light.png';
import runningImgLight from '@/assets/img/singleTrain/running-icon-light.png';
import endImgLight from '@/assets/img/singleTrain/end-icon-light.png';
import AttCkDialog from '@/components/att-engage/att-ck-dialog.vue';
import EngageDialog from '@/components/att-engage/engage-dialog.vue';
import { getTheme } from '@cyber/helper';

export default {
  name: 'GroupTrainList',
  components: {
    emptyPage,
    SearchInput,
    Search,
    stuScore,
    // stuTrainNum,
    ListCommon,
    ListRoles,
    RedBlueAdd,
    ChangeTemplate,
    WriteContent,
    AttCkDialog,
    EngageDialog,
  },
  data() {
    return {
      typeSearch: {},
      arr: [],
      typeListsArr: [],
      difficultLists: [],
      isCheck: '',
      isCheckValue: '',
      isChecks: '',
      isChecksValue: '',
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      light: getTheme() ? getTheme().slice(6) : 'dark',
      notStartImg,
      runningImg,
      endImg,
      notStartImgLight,
      runningImgLight,
      endImgLight,
      loading: true,
      trainList: [],
      templateList: [],
      currentList: [],
      searchCondition: {
        name: '',
        difficult: '',
        category: '',
      },
      scene_name: '',
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
      },
      leftDis: false,
      rightDis: false,
      value2: '',
      rolenow: 2,
      notStartBg: require('@/assets/img/redVsBlue/not_start.png').default,
      paginationTemplate: {
        current_page: 1,
        total: 0,
        per_page: 10,
      },
      searchTemplate: {
        name: '',
        difficult: '',
        category: '',
      },
      createFormVal: {},
      attDialogVisible: false,
      engageDialogVisible: false,
      resource_id_related: '',
    };
  },
  computed: {
    ...mapGetters(['language']),

    difficultSearch() {
      const difficultCondition = this.$CONSTANT.Condition.Difficult;
      return {
        difficultConditionName: this.$t('m.trainLevel'),
      };
    },
    renderList() {
      const data = [];
      this.trainList.forEach((item) => {
        if (
          item.training_status ===
          this.$CONSTANT.Training.TrainingStatus.VsNoBegin.value
        ) {
          // this.$set(
          //   item,
          //   'training_status',
          //   this.$CONSTANT.Training.TrainingStatus.NoBegin.value,
          // );
          if (this.light === 'dark') {
            this.$set(item, 'running_bg_src', this.notStartImg);
          } else {
            this.$set(item, 'running_bg_src', this.notStartImgLight);
          }
          this.$set(item, 'img_content', this.$t('device.nostart'));
        } else if (
          item.training_status ===
            this.$CONSTANT.Training.TrainingStatus.Already.value ||
          item.training_status ===
            this.$CONSTANT.Training.TrainingStatus.Already2.value ||
          item.training_status ===
            this.$CONSTANT.Training.TrainingStatus.Already3.value
        ) {
          // this.$set(
          //   item,
          //   'training_status',
          //   this.$CONSTANT.Training.TrainingStatus.Already.value,
          // );
          if (this.light === 'dark') {
            this.$set(item, 'running_bg_src', this.runningImg);
          } else {
            this.$set(item, 'running_bg_src', this.runningImgLight);
          }
          this.$set(item, 'img_content', this.$t('m.trainRunning'));
        } else if (
          item.training_status ===
          this.$CONSTANT.Training.TrainingStatus.NoBegin.value
        ) {
          // this.$set(
          //   item,
          //   'training_status',
          //   this.$CONSTANT.Training.TrainingStatus.HasEnded.value,
          // );
          if (this.light === 'dark') {
            this.$set(item, 'running_bg_src', this.endImg);
          } else {
            this.$set(item, 'running_bg_src', this.endImgLight);
          }
          this.$set(item, 'img_content', this.$t('m.hasEnded'));
        }
        data.push(item);
      });
      return data;
    },
  },
  watch: {
    language: {
      handler(val, oldval) {
        this.getTrainList();
      },
    },
  },
  created() {
    // 红蓝训练类别请求
    this.$request
      .get('/cr/common/constants_config', { type: 3 }, { baseURL: '/api/ojj' })
      .then((res) => {
        let arr = res.data.data;
        arr = arr.map((item) => {
          return {
            label: item.name.toString(),
            value: item.code,
          };
        });

        arr.unshift({ label: this.$t('m.all'), value: '' });
        this.typeSearch = {
          typeConditionName: this.$t('m.trainCate'),
          typeLists: arr,
        };
      });
    this.getTrainList();
    this.getDifficultLists();
  },
  mounted() {
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    getDifficultLists() {
      this.$request
        .get(
          '/cr/common/constants_config',
          { type: 24 },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          let arr = res.data.data;
          arr = arr.map((item) => {
            return {
              label: item.name.toString(),
              value: item.code,
            };
          });
          arr.unshift({ label: this.$t('m.all'), value: '' });
          this.difficultLists = arr;
        });
    },
    // 监听换肤，动态reload ecahrts
    listenFunc() {
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.light = 'dark';
      } else {
        this.light = 'light';
      }
    },
    getChildComVal(val) {
      this.isCheck = val;
    },
    getChildComVals(val) {
      this.isChecks = val;
    },
    getNewCheckValue(val) {
      this.isCheckValue = val;
    },
    getNewChecksValue(val) {
      this.isChecksValue = val;
    },
    handleCurrentChange(val) {
      this.pagination.current_page = val;
      this.getTrainList();
    },
    handleSizeChange(val) {
      this.pagination.current_page = 1;
      this.pagination.per_page = val;
      this.pageSize = val;
      this.getTrainList();
    },
    // 跳转创建模板列表
    createTemplate() {
      const { searchTemplate } = this;
      // 搜索条件置空
      Object.keys(searchTemplate).forEach((key) => (searchTemplate[key] = ''));
      this.getTemplateList();
      this.$refs.addRedVsBlue.dialogAddVisible = true;
    },
    gotoCreate(index) {
      const paginationInfo = {};
      paginationInfo.indexNumber = index;
      paginationInfo.paginationInfo = this.pagination;
      localStorage.setItem('redPaginationInfo', JSON.stringify(paginationInfo));
      this.$router.push('/red_vs_blue/template');
    },
    // 获取搜索组件信息
    getSearchType(val) {
      this.searchCondition.category = val.value;
      this.pagination.current_page = 1;
      this.getTrainList();
    },
    getSearchDifficult(val) {
      this.searchCondition.difficult = val.value;
      this.pagination.current_page = 1;
      this.getTrainList();
    },
    getSearchName(val) {
      this.searchCondition.search = val;
      this.pagination.current_page = 1;
      this.getTrainList();
    },

    // 获取训练列表
    getTrainList() {
      const searchParams = this.searchCondition;
      searchParams.page = this.pagination.current_page;
      searchParams.per_page = this.pagination.per_page;
      this.loading = true;
      const _this = this;
      // 红蓝对抗列表
      this.$request
        .get('cr/red_vs_blue/red_vs_blue/list', searchParams, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          res.data.data.list.forEach((item, index) => {
            item.duration_time_formate = item.duration_time;
            if (item.runtime) {
              item.running_time_formate = singleFormatTime(item.runtime, _this);
            }

            const role_user = [];
            this.$set(
              item.role_permission,
              'role_color',
              _this.getRoleColor(item.role_permission.role_group),
            );
            this.$set(
              item.role_permission,
              'name',
              this.getRoleName(item.role_permission.role_group) ||
                item.role_permission.name,
            );
            _.forEach(
              item.role_permission.chart_info.role_data_list,
              (role) => {
                _.forEach(role.users, (user) => {
                  role_user.push({
                    role_name:
                      _this.getRoleName(role.role_group) || role.role_name,
                    role_group: role.role_group,
                    role_user: user,
                    role_color: _this.getRoleColor(role.role_group),
                  });
                });
              },
            );
            this.$set(item.role_permission, 'role_data_list', role_user);
          });
          this.trainList = res.data.data.list;
          this.pagination.total = res.data.data.total;
          window.scrollTo(0, 0);
          this.loading = false;
        })
        .catch(() => {
          // TODO
          this.loading = false;
        });
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
    getRoleColor(role) {
      let color = '';
      if (role === this.$CONSTANT.Role.RedVsBlue.ADMIN.value) {
        color = 'color-sky-blue';
        // 'linear-gradient(0deg,rgba(88,255,253,1) 0%, rgba(0,237,223,1) 100%)'
      } else if (role === this.$CONSTANT.Role.RedVsBlue.DIRECTOR.value) {
        color = 'color-green';
        // 'linear-gradient(180deg,rgba(0,255,126,1) 0%, rgba(12,243,168,1) 100%)'
      } else if (role === this.$CONSTANT.Role.RedVsBlue.REFEREE.value) {
        color = 'color-yellow';
        // 'linear-gradient(0deg,rgba(255,173,57,1) 0%, rgba(228,137,39,1) 100%)'
      } else if (role === this.$CONSTANT.Role.RedVsBlue.REDUSER.value) {
        color = 'color-red';
        // 'linear-gradient(180deg,rgba(255,88,49,1) 0%, rgba(255,22,22,1) 100%)'
      } else if (role === this.$CONSTANT.Role.RedVsBlue.BLUEUSER.value) {
        color = 'color-blue';
        // 'linear-gradient(180deg,rgba(57,239,255,1) 0%, rgba(58,165,255,1) 100%)'
      }
      return color;
    },
    crEventIsBegin(start_time) {
      if (start_time) {
        const parse_start_time = new Date(Date.parse(start_time));
        const current_time = new Date();
        return parse_start_time < current_time;
      } else {
        return true;
      }
    },
    // 跳转场景拓扑页面
    goSceneTopology(item) {
      const resource_id = item.resource_id;
      if (item.role_permission && !_.isEmpty(item.role_permission)) {
        localStorage.setItem('role_group', item.role_permission.role_group);
        if (
          item.role_permission.role_group ===
          this.$CONSTANT.Role.RedVsBlue.ADMIN.value
        ) {
          this.$router.push({ path: `/scenario_home/${resource_id}/` });
        } else if (
          item.role_permission.role_group ===
          this.$CONSTANT.Role.RedVsBlue.DIRECTOR.value
        ) {
          this.$store.commit(
            'user/SET_PERMISSON',
            item.role_permission.role_group,
          );

          this.$router.push({ path: `/director_home/${resource_id}/` });
        } else if (
          item.role_permission.role_group ===
          this.$CONSTANT.Role.RedVsBlue.REFEREE.value
        ) {
          this.$router.push({ path: `/referee_home/${resource_id}/` });
        } else if (
          item.role_permission.role_group ===
            this.$CONSTANT.Role.RedVsBlue.REDUSER.value ||
          item.role_permission.role_group ===
            this.$CONSTANT.Role.RedVsBlue.BLUEUSER.value
        ) {
          this.$request
            .get(
              '/cr/red_vs_blue/user/get_running_status',
              { resource_id: resource_id },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              // 学员登录点击列表
              if (res.data.data.time_management_status !== 4) {
                this.$router.push({
                  path: `/access_center_member/${resource_id}/`,
                });
              } else {
                this.$message.warning(this.$t('event.NotStartEvent'));
              }
            })
            .catch((error) => {
              if (error.response.data.length > 0) {
                this.$message.error(error.response.data[0].message);
              }
            });
        } else {
          this.$message.warning(this.$t('event.NotStart'));
          return false;
        }
      } else {
        this.$message.error(this.$t('event.NotBelongEvent'));
      }
    },
    // 点击新增获取模板列表
    getTemplateList() {
      const searchParams = this.searchTemplate;
      searchParams.page = this.paginationTemplate.current_page;
      searchParams.per_page = this.paginationTemplate.per_page;
      this.$request
        .get('/cr/red_vs_blue/red_vs_blue_templates/list', searchParams, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          res.data.data.list.forEach((item) => {
            this.$set(
              item,
              'training_status',
              this.$CONSTANT.Training.TrainingStatus.NoBegin.value,
            );
            this.$set(item, 'running_bg_src', this.notStartBg);
            this.$set(item, 'name', item.cr_event_info.name);
            this.$set(item, 'difficult', item.cr_event_info.difficult);
            this.$set(
              item,
              'duration_time_formate',
              item.cr_event_info.duration_time,
            );
            this.$set(item, 'pre_skill', item.cr_event_info.pre_skill);
            this.$set(item, 'train_skill', item.cr_event_info.train_skill);
            this.$set(item, 'description', item.cr_event_info.description);
          });
          this.templateList = res.data.data.list;
          this.paginationTemplate.total = res.data.data.total;
        })
        .catch(() => {});
    },
    getTemplateCurrent(val) {
      this.paginationTemplate.current_page = val;
      this.getTemplateList();
    },
    getTemplateSize(val) {
      this.paginationTemplate.per_page = val;
      this.paginationTemplate.current_page = 1;
      this.getTemplateList();
    },
    searchTemplateType(params) {
      this.searchTemplate.category = params;
      this.paginationTemplate.current_page = 1;
      this.getTemplateList();
    },
    searchTemplateDifficult(params) {
      this.searchTemplate.difficult = params;
      this.paginationTemplate.current_page = 1;
      this.getTemplateList();
    },
    searchTemplateName(params) {
      this.searchTemplate.search = params;
      this.paginationTemplate.current_page = 1;
      this.getTemplateList();
    },
    getChoosed(val) {
      this.createFormVal = val;
    },
    emptyCreateForm() {
      this.createFormVal = {};
    },
    addCreate() {
      this.$refs.writeContent.ensureCreate();
    },
    formValidateSuccess() {
      this.$refs.addRedVsBlue.dialogAddVisible = false;
      this.createFormVal = {};
      this.$refs.addRedVsBlue.choosedScene = '';
      this.$refs.addRedVsBlue.currentIndex = 0;
      this.getTrainList();
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
  },
};
</script>
<style lang="scss">
$mainColor: #1ea3fe;
.red_blue_page {
  min-height: 400px;
  .train_list_tabs {
    // margin: 0 0 20px 0;
  }
  .btn_start {
    min-width: 110px;
    height: 36px;
    line-height: 36px;
    box-sizing: border-box;
    // padding: 1px;
    border-radius: 2px;
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
    // background-image: linear-gradient(
    //   top,
    //   rgba(63, 228, 238, 1) 0%,
    //   rgba(44, 163, 238, 1) 100%
    // );
  }
  .btn_radius {
    width: calc(100% - 18px);
    padding: 0 9px;
    height: 100%;
    border-radius: 15px;
    background: #193346;
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
    font-family: Microsoft YaHei;
    img {
      margin: 8px 8px 0 0;
    }
    span {
      background: linear-gradient(
        180deg,
        rgba(57, 239, 255, 1) 0%,
        rgba(58, 165, 255, 1) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .roles_info {
    float: right;
    width: 30%;
    height: 200px;
    margin-top: -20px;
    color: #fff;
    font-size: 14px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 140px;
      padding-left: 20px;
      /*border-left: 1px solid #4057A7;*/
    }
    .level {
      display: flex;
      margin: 0 0 10px 0;
      white-space: nowrap;
    }
    .level-left {
      margin-right: 10px;
      white-space: nowrap;
    }
    .level-right {
      box-sizing: border-box;
      padding-right: 10px;
      .role-desc {
        width: 80%;
      }
    }
    .rolenmae {
      margin-left: 10px;
      color: #1ea3fe;
    }
    .role_list {
      margin-bottom: 5px;
      white-space: normal;
    }
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .task-content {
    border-radius: 4px;
    bottom: 5px;
    right: 5px;
    position: absolute;
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
}
</style>
<style lang="scss" scoped>
.att-engage-dialog {
  ::v-deep .el-dialog {
    margin-top: 8vh !important;
  }
  ::v-deep .cb-scrollbar.overflow-x-disable .el-scrollbar .el-scrollbar__wrap {
    overflow-x: auto !important;
  }
  ::v-deep
    .cb-scrollbar.overflow-x-disable
    .el-scrollbar
    .el-scrollbar__wrap::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::v-deep
    .cb-scrollbar.overflow-x-disable
    .el-scrollbar
    .el-scrollbar__wrap::-webkit-scrollbar-thumb {
    background: var(--scrollbar-color);
    border-radius: 6px;
  }
}
.train_list_tabs {
  padding-left: 0px;
}
</style>
