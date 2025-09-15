<template>
  <cb-inner-page :background="true" title="课程规划">
<!--    &lt;!&ndash; 授权访问 &ndash;&gt;-->
<!--    <div v-if="AuthAccess == 'access'">-->
<!--      <auth-access-->
<!--        :AuthAccessIds="AuthAccessIds"-->
<!--        @closeAuthBatch="closeAuthBatch"-->
<!--      ></auth-access>-->
<!--    </div>-->
<!--    &lt;!&ndash; 授权操作 &ndash;&gt;-->
<!--    <div v-else-if="AuthAccess == 'opreate'">-->
<!--      <auth-operate-->
<!--        :AuthOperateIds="AuthOperateIds"-->
<!--        @closeAuthBatch="closeAuthBatch"-->
<!--      ></auth-operate>-->
<!--    </div>-->
    <div>
      <cb-search-bar class="custom-search-bar">
        <cb-search-input
          slot="filter"
          class="search-container"
          v-model="query.pattern"
          placeholder="请输入你需要搜索的内容"
          @change="getCourseListData"
        ></cb-search-input>
        <cb-button-group slot="searchRightArea">
          <cb-button button-type="add" @click="addCourse"></cb-button>
          <cb-button
            buttonType="delete"
            hollow
            :disabled="selection.length === 0"
            @click="deleteCourse(selection, $event)"
          >{{ $t('m.delete') }}</cb-button>
          <cb-button
            button-type="export"
            hollow
            :disabled="selection.length === 0"
            @click="exportCourse(selection, $event)"
          ></cb-button>
        </cb-button-group>
      </cb-search-bar>

      <cb-tabs v-model="activeTabName" @tab-click="getCourseListData" v-loading="loading" class="publish-tabs-container">
        <cb-tab-pane label="已发布" name="1">
          <!-- 列表转卡片形式 -->
          <course-card
            v-if="!loading && courseListData.length"
            :courseListData="courseListData"
            :loading="loading"
            @detail="gotoDetail"
            @edit="edit"
            @delete="deleteCourse"
          ></course-card>
          <empty v-else class="empty-box">暂无数据</empty>
        </cb-tab-pane>
        <cb-tab-pane label="未发布" name="0">
          <!-- 列表转卡片形式 -->
          <course-card
            v-if="!loading && courseListData.length"
            :courseListData="courseListData"
            :loading="loading"
            @detail="gotoDetail"
            @edit="edit"
            @delete="deleteCourse"
          ></course-card>
          <empty v-else class="empty-box">暂无数据</empty>
        </cb-tab-pane>
      </cb-tabs>
      <cb-pagination
        :current.sync="pagination.current_page"
        :total="pagination.total"
        :page-size.sync="pagination.per_page"
        @current-change="currentPageChange"
      >
      </cb-pagination>
      <cb-dialog
        :title="$t('m.dialogTitle')"
        width="600px"
        center
        :visible.sync="importDialog"
      >
        <course-import-panel
          v-if="importDialog"
          @close="closeImporter"
        ></course-import-panel>
      </cb-dialog>
    </div>
  </cb-inner-page>
</template>
<script>
import Constant from './course-constant.js';
import CourseImportPanel from './course-import-panpel';
import msger from '@/utils/message.js';
import SearchInput from '@/components/search-condition/search-input.vue';
import CommonUtils from '@/utils/utils.js';
import AuthAccess from './manage-auth-batch.vue';
import AuthOperate from './private-course-batch.vue';
import {getCourseList} from "../../../api/course";
import Empty from "../../../components/empty";
import courseCard from "./course-card";

export default {
  components: {
    CourseImportPanel,
    SearchInput, // 查询 input 公用组件
    // AuthAccess,
    // AuthOperate,
    Empty,
    courseCard,
  },
  data() {
    return {
      courseListData: [], // 课程列表数据
      url: '/oj/admin/course/list',
      activeTabName: '1',
      loading: false,
      query: {
        pattern: '',
        publish: 1,
      },
      selection: [],
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 5,
      },
      importDialog: false,
      columns: [],
    };
  },
  created() {
    this.getCourseListData();
  },
  mounted() {
    // this.getDirectionOptions();
    // this.getDifficultyOptions();
  },
  methods: {
    getCourseListData() {
      this.loading = true;
      let params = {
        pattern: this.query.pattern,
        page: this.pagination.current_page,
        per_page: this.pagination.per_page,
        publish: this.activeTabName,
      }
      getCourseList(params).then(res => {
        this.courseListData = res.data.data.list || [];
        this.pagination.total = res.data.data.total;
      }).finally(() => {
        this.loading = false;
      })
    },
    currentPageChange(current) {
      this.pagination.current_page = current;
      this.getCourseListData();
    },
    computedDiffculty(difficulty) {
      const data = this.difficultyOptions.filter(
        (item) => item.value === difficulty,
      );
      if (data.length) {
        return data[0].label;
      }
    },
    closeAuthBatch(aa) {
      this.AuthAccess = 'course';
      this.selection = [];
    },
    getStyle(data) {
      if (data === $CONSTANT.COURSES.DIFFICULTY.ADVANCED) {
        return $t('m.advanced');
      } else if (data === $CONSTANT.COURSES.DIFFICULTY.MEDIUM) {
        return $t('m.medium');
      } else {
        return $t('m.primary');
      }
    },
    closeImporter(
      { reload } = {
        reload: false,
      },
    ) {
      this.importDialog = false;
      if (reload) {
        this.$refs.sdlRef.reload({
          page: 1,
        });
      }
    },
    batchAuth(data, done) {
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      if (ids && ids.length > 0) {
        this.AuthOperateIds = ids;
        this.AuthAccess = 'opreate';
      } else {
        this.AuthOperateIds = [];
        msger.error(this.$t('views.course.batch.chooseCourseToProceed'), this);
      }
    },
    batchVisi(data, done) {
      const ids = [];
      const { multipleSelection } = this;
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      if (ids && ids.length > 0) {
        this.AuthAccessIds = ids;
        this.AuthAccess = 'access';
      } else {
        this.AuthAccessIds = [];
        msger.error(this.$t('views.course.batch.chooseCourseToProceed'), this);
      }
    },
    getId(val) {
      const arr = [];
      for (let i = 0; i < val.length; i++) {
        arr.push(val[i].resource_id);
      }
      return arr;
    },
    // 查询出所有的课程方向
    getDirectionOptions() {
      this.$request
        .get(
          '/oj/admin/course/direction/list',
          {
            children: false,
            page: 1,
            per_page: 9999,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          // let dataArr = res.data.data;
          let dataArr = _.get(res, 'data.data.list', []);
          this.directionOptions = dataArr.map((item) => {
            return {
              label: item.name,
              value: item.resource_id,
            };
          });
        });
    },
    // 获取难度类型
    getDifficultyOptions() {
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
              value: item.code,
              label: item.name,
            };
          });
          this.difficultyOptions = arr;
        });
    },
    // 新增
    addCourse() {
      this.$router.push({ name: 'courses-add' });
    },
    // 私有,共享
    privateAuth(row) {
      this.$router.push({
        name: 'courses-auth',
        params: {
          courseId: row.resource_id,
        },
      });
    },
    // 授权
    authorize(row) {
      this.$router.push({
        name: 'courses-visiblity',
        params: {
          courseId: row.resource_id,
        },
      });
    },
    // 编辑
    edit(row) {
      this.$router.push({
        name: 'courses-edit',
        params: {
          courseId: row.resource_id,
        },
      });
    },
    gotoDetail(row) {
      this.$router.push({
        name: 'courses-detail',
        params: {
          courseId: row.resource_id,
        },
      });
    },
    management(row) {
      this.$router.push({
        name: 'lessons-manage',
        params: { courseId: row.resource_id },
      });
    },
    // 删除
    deleteCourse(data) {
      this.$confirm('确认删除？')
        .then((_) => {
          const that = this;
          const ids = [];
          if (data && data.length) {
            data.map((item) => ids.push(item.resource_id));
          } else {
            ids.push(data.resource_id);
          }
          that.$request
            .delete(
              '/oj/admin/course/batch',
              {
                resource_ids: ids,
              },
              {
                baseURL: '/api/ojj',
              },
            )
            .then(() => {
              that.getCourseListData();
            })
            .catch(() => {
            });
        })
    },
    toPublic(data, done) {
      // this.$refs.sdlRef.batchOvert();
      const that = this;
      const recordCtg = that.$t('coursesBreadcrumbs.course');
      const ids = [];
      const validSelection = _.filter(data, (item) => !item.is_public);
      if (validSelection && validSelection.length > 0) {
        if (data && data.length) {
          data.map((item) => ids.push(item.resource_id));
        } else {
          ids.push(data.resource_id);
        }
        that.$request
          .patch(
            '/oj/admin/course/batch-public',
            {
              resource_ids: ids,
              is_public: true,
            },
            {
              baseURL: '/api/ojj',
            },
          )
          .then(() => {
            done();
            that.selection = [];
            that.$refs.sdlRef.reload();
          })
          .catch(() => {
            done(false);
          });
      } else {
        const msgTemplate = that.$t('common.selectRecordToOvert');
        const msg = CommonUtils.formatString(msgTemplate, recordCtg);
        msger.error(msg, that);
        done(false);
        // rej(msg);
      }
    },
    toHide(data, done) {
      const that = this;
      const recordCtg = that.$t('coursesBreadcrumbs.course');
      // this.$refs.sdlRef.batchConceal();
      const ids = [];
      const validSelection = _.filter(data, (item) => item.is_public);
      if (validSelection && validSelection.length > 0) {
        if (data && data.length) {
          data.map((item) => ids.push(item.resource_id));
        } else {
          ids.push(data.resource_id);
        }
        that.$request
          .patch(
            '/oj/admin/course/batch-public',
            {
              resource_ids: ids,
              is_public: false,
            },
            {
              baseURL: '/api/ojj',
            },
          )
          .then(() => {
            done();
            that.selection = [];
            that.$refs.sdlRef.reload();
          })
          .catch(() => {
            done(false);
          });
      } else {
        const msgTemplate = that.$t('common.selectRecordToConceal');
        const msg = CommonUtils.formatString(msgTemplate, recordCtg);
        msger.error(msg, that);
        done(false);
        // rej(msg);
      }
    },
    // 导出课程
    exportCourse(data, done) {
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      if (ids && ids.length > 0) {
        this.$request
          .get(
            '/oj/admin/course/batch_dumps',
            {
              ids: ids,
            },
            {
              responseType: 'arraybuffer',
              baseURL: '/api/ojj',
            },
          )
          .then((res) => {
            this.$request.download(
              res.data,
              data.length > 1 ? 'Course.zip' : `course_${data[0].name}.zip`,
            );
          });
      } else {
        done(false);
        msger.error(this.$t('views.course.batch.chooseCourseToProceed'), this);
      }
    },
    toType() {
      this.$router.push({ name: 'courses-aspect' });
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection.push(val[i].resource_id);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.custom-search-bar {
  padding: 8px 16px 0 0;
}
.publish-tabs-container {
  ::v-deep {
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
  padding: 0 16px 0 0;
}
.empty-box {
  min-height: 300px;
}
</style>
