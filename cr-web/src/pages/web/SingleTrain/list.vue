<template>
  <cb-inner-page :background="false">
    <!-- 单兵训练页面 -->
    <div class="individaul_page page" style="height: 100%">
      <div class="condition-wrapper">
        <!-- 搜索 -->
        <search-input
          :placeholder-name="$t('m.rangeNamePH')"
          @sendSearchName="getSearchName"
        />
        <!-- 训练类别 -->
        <cb-filter-condition
          :condition="typeConditionName"
          :filterList="typeListsArr"
          @change="getSearchType"
        ></cb-filter-condition>
        <!-- 训练难度 -->
        <cb-filter-condition
          :condition="difficultConditionName"
          :filterList="difficultLists"
          @change="getSearchDifficult"
        ></cb-filter-condition>
      </div>
      <!-- list列表 -->
      <div
        v-if="trainList.length"
        v-loading="loading"
        class="train_lists"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(35, 44, 59, .7)"
      >
        <div
          v-for="item in renderList"
          :key="item.id"
          class="trains_item"
          @click="goTo(item)"
        >
          <list-common
            :item-data="item"
            @attEngageEvent="attEngageShow"
            :difficultLists="difficultLists"
          >
            <!-- 折线图 -->
            <div class="score_echarts">
              <stu-train-num
                :x-data="item.last_seven_days"
                :y-data="item.template_use_count"
                :instance-data="item.room_info"
                :light="light"
              />
            </div>
          </list-common>
        </div>
      </div>
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
      <!-- 分页 -->
      <div v-if="trainList.length" class="train_page">
        <cb-pagination
          background
          class="elc-pagination"
          :current-page="pagination.current_page"
          layout="total,sizes,prev, pager, next,jumper"
          :total="pagination.total"
          :page-size="pagination.per_page"
          :page-sizes="['10', '20', '30', '40']"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          style="text-align: right"
        >
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
import { singleFormatTime } from '@/assets/js/tools.js';
import stuTrainNum from '@/components/MyChart/train_line';
import emptyPage from '@/pages/web/Empty';
import SearchInput from '@/components/SearchCondition/SearchInput.vue';
import ListCommon from '@/components/ListCommon/index.vue';
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
  name: 'SingTrainList',
  components: {
    stuTrainNum,
    emptyPage,
    SearchInput,
    ListCommon,
    AttCkDialog,
    EngageDialog,
  },
  data() {
    const difficultCondition = this.$CONSTANT.Condition.Difficult;
    return {
      arr: [],
      typeListsArr: [],
      difficultLists: [],
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
      choosedScene: '',
      diffcultInfo: {
        title: this.$t('m.difficult'),
        desc: difficultCondition,
      },
      searchCondition: {
        pattern: '',
        category: '',
        difficult: '',
      },
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
      },
      attDialogVisible: false,
      engageDialogVisible: false,
      resource_id_related: '',
    };
  },
  computed: {
    typeConditionName() {
      return this.$t('m.trainCate');
    },

    difficultConditionName() {
      return this.$t('m.trainLevel');
    },

    renderList() {
      const data = [];
      this.trainList.forEach((item) => {
        if (!item.room_info) {
          if (this.light === 'dark') {
            this.$set(item, 'running_bg_src', this.notStartImg);
          } else {
            this.$set(item, 'running_bg_src', this.notStartImgLight);
          }
          this.$set(item, 'img_content', this.$t('device.nostart'));
        } else if (item.room_info && item.room_info.end_time) {
          if (this.light === 'dark') {
            this.$set(item, 'running_bg_src', this.endImg);
          } else {
            this.$set(item, 'running_bg_src', this.endImgLight);
          }
          this.$set(item, 'img_content', this.$t('m.hasEnded'));
        } else {
          if (this.light === 'dark') {
            this.$set(item, 'running_bg_src', this.runningImg);
          } else {
            this.$set(item, 'running_bg_src', this.runningImgLight);
          }
          this.$set(item, 'img_content', this.$t('m.trainRunning'));
        }
        data.push(item);
      });
      return data;
    },
  },
  mounted() {
    this.getModelList();
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  created() {
    // 单兵训练类别请求
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
        this.typeListsArr = arr;
      });
    // 获取难度
    this.getDifficultLists();
  },
  methods: {
    getDifficultLists() {
      this.$request
        .get(
          '/cr/common/constants_config',
          { type: 22 },
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
    // 分页数据
    handleCurrentChange(val) {
      this.pagination.current_page = val;
      this.getModelList();
    },
    handleSizeChange(val) {
      this.pagination.current_page = 1;
      this.pagination.per_page = val;
      this.getModelList();
    },
    // 跳转详情页面
    goTo(item) {
      this.$router.push({
        path: `/single_train/${item.resource_id}/`,
      });
    },
    // 获取列表数据
    getModelList() {
      const searchParams = this.searchCondition;
      searchParams.page = this.pagination.current_page;
      searchParams.per_page = this.pagination.per_page;
      searchParams.pattern = this.searchCondition.pattern;
      searchParams.with_instance = 1;
      this.loading = true;
      // 获取单兵训练模板列表
      this.$request
        .get('/cr/single_train/room/list', searchParams, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          _.forEach(res.data.data.list, (item, index) => {
            if (item.room_info) {
              this.$set(
                item,
                'running_time_formate',
                singleFormatTime(item.room_info.running_time, this),
              );
            }
            if (!item.room_info) {
              this.$set(
                item,
                'running_status',
                this.$CONSTANT.Training.TrainingStatus.NoBegin.value,
              );
            } else if (item.room_info && item.room_info.end_time) {
              this.$set(
                item,
                'running_status',
                this.$CONSTANT.Training.TrainingStatus.HasEnded.value,
              );
            } else {
              this.$set(
                item,
                'running_status',
                this.$CONSTANT.Training.TrainingStatus.Already.value,
              );
            }
            this.$set(item, 'name', item.event_data.name);
            this.$set(item, 'difficult', item.event_data.difficult);
            this.$set(
              item,
              'duration_time_formate',
              item.event_data.duration_time,
            );
            this.$set(item, 'pre_skill', item.event_data.pre_skill);
            this.$set(item, 'train_skill', item.event_data.train_skill);
            this.$set(item, 'description', item.event_data.description);
            this.$set(item, 'nodes_count', item.nodes_count_data);
          });
          this.trainList = res.data.data.list;
          this.pagination.total = res.data.data.total;
          window.scrollTo(0, 0);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取搜索组件信息
    getSearchType(val) {
      this.searchCondition.category = val.value;
      this.pagination.current_page = 1;
      this.getModelList();
    },
    getSearchDifficult(val) {
      this.searchCondition.difficult = val.value;
      this.pagination.current_page = 1;
      this.getModelList();
    },
    getSearchName(val) {
      //  this.searchCondition.search = val;
      this.searchCondition.pattern = val;
      this.pagination.current_page = 1;
      this.getModelList();
    },
    // ATT&CK 、Engage点击
    attEngageShow(data, type) {
      this.resource_id_related = data.resource_id;
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
.individaul_page {
  .search-conditioin-comp {
    padding-bottom: 0 !important;
  }
  .train_bg {
    width: 190px;
    height: 140px;
    position: absolute;
    bottom: 0;
    right: 33.5%;
    z-index: 1;
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
</style>
