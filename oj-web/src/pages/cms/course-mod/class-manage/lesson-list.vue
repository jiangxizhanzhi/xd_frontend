<template>
  <cb-inner-page :background="false">
    <cb-search-table
      ref="sdlRef"
      :selector="selector"
      :selection.sync="selection"
      url="/oj/admin/lesson/list"
      :data="query"
      :cols.sync="columns"
      baseURL="/api/ojj"
    >
      <template v-slot:filter>
        <cb-select
          v-model="query.type"
          :first="{
            value: null,
            label: $t('m.allType'),
          }"
          :options="typeOptions"
          :placeholder="$t('m.allType')"
        >
        </cb-select>
        <cb-search-input
          v-model="query.pattern"
          :placeholder="$t('m.namePh')"
        ></cb-search-input>
      </template>
      <template v-slot:search>
        <cb-button-group>
          <cb-button button-type="add" @click="addCourse"></cb-button>
          <cb-button
            hollow
            buttonType="delete"
            :disabled="selection.length === 0"
            @click="deleteCourse(selection, $event)"
            >{{ $t('m.delete') }}</cb-button
          >

          <cb-button
            icon="icon-yulan"
            hollow
            :disabled="selection.length === 0"
            :warnMsg="publicMsg"
            :completeMsg="publicSuccessMsg"
            @click="toPublic(selection, $event)"
            >{{ $t('m.public') }}</cb-button
          >
          <cb-button
            icon="icon-yincang1"
            hollow
            :disabled="selection.length === 0"
            :warnMsg="hideMsg"
            :completeMsg="hideSuccessMsg"
            @click="toHide(selection, $event)"
            >{{ $t('m.hide') }}</cb-button
          >
          <cb-button
            button-type="import"
            hollow
            @click="importCourse"
          ></cb-button>

          <cb-button icon="icon-bianpai" hollow @click="arrangeCourse">{{
            $t('m.choreography')
          }}</cb-button>
        </cb-button-group>
      </template>
      <template v-slot:type="scope">
        <div />
        <span v-if="scope.data.type === $CONSTANT.COURSES.TYPE.THEORY">{{
          $t('m.theory')
        }}</span>
        <span v-if="scope.data.type === $CONSTANT.COURSES.TYPE.LABS_TYPE">{{
          $t('m.LABS')
        }}</span>
      </template>
      <template v-slot:lesson_file="scope">
        <div />
        <!-- 课程讲义 -->
        <span
          class="course-feature spandisable"
          v-if="scope.data.type === $CONSTANT.COURSES.TYPE.THEORY"
        >
          <span class="greenRound" v-if="scope.data.handout_url"></span>
          <span class="greenCircle spandisable" v-else></span>
          <span>{{ $t('m.courseHandout') }}</span>
        </span>
        <!-- 实验指导 -->
        <span
          class="course-feature spandisable"
          v-if="scope.data.type === $CONSTANT.COURSES.TYPE.LABS_TYPE"
        >
          <span class="greenRound" v-if="scope.data.handout_url"></span>
          <span class="greenCircle" v-else></span>
          <span>{{ $t('m.experimentalGuidance') }}</span>
        </span>

        <!-- 实验 -->
        <span
          style="cursor: pointer"
          class="course-feature spanover"
          v-if="scope.data.topo_id"
          @click="
            showExercise(scope.data.resource_id, scope.data.scene_share_mode)
          "
        >
          <span class="greenRound"></span>
          <span>{{ $t('m.experiment') }}</span>
        </span>
        <span
          class="course-feature spandisable"
          v-else-if="scope.data.type === $CONSTANT.COURSES.TYPE.LABS_TYPE"
        >
          <span class="greenCircle"></span>
          <span>{{ $t('m.experiment') }}</span>
        </span>
        <!-- 附件 -->
        <span
          style="cursor: pointer"
          class="course-feature spanover"
          v-if="
            scope.data.lesson_file !== null && scope.data.lesson_file.length > 0
          "
          @click.stop="showfile(scope.data)"
        >
          <span class="greenRound"></span>
          <span>{{ $t('m.enclosure') }}</span>
        </span>
        <span class="course-feature spandisable" v-else>
          <span class="greenCircle"></span>
          <span>{{ $t('m.enclosure') }}</span>
        </span>
        <!-- 视频 -->
        <span class="course-feature spandisable" v-if="scope.data.video_url">
          <span class="greenRound"></span>
          <span>{{ $t('m.video') }}</span>
        </span>
        <span class="course-feature spandisable" v-else>
          <span class="greenCircle"></span>
          <span>{{ $t('m.video') }}</span>
        </span>
        <!-- 练习 -->
        <span
          style="cursor: pointer"
          class="course-feature spanover"
          @click="gotoPractice(scope.data.resource_id)"
        >
          <span class="greenRound"></span>
          <span
            >{{ $t('practiseBreadcrumbs.practice') }}({{
              scope.data.practice_count
            }})</span
          >
        </span>
      </template>

      <template v-slot:difficulty="scope">
        <div />
        <span
          v-if="scope.data.difficulty === $CONSTANT.COURSES.DIFFICULTY.ADVANCED"
          >{{ $t('m.advanced') }}</span
        >
        <span
          v-if="scope.data.difficulty === $CONSTANT.COURSES.DIFFICULTY.MEDIUM"
          >{{ $t('m.medium') }}</span
        >
        <span
          v-if="scope.data.difficulty === $CONSTANT.COURSES.DIFFICULTY.PRIMARY"
          >{{ $t('m.primary') }}</span
        >
      </template>
      <template v-slot:lesson_type="scope">
        <div />
        <span
          v-if="scope.data.compulsory === $CONSTANT.COURSES.LEARNTYPE.NOSET"
          >{{ $t('m.noSet') }}</span
        >
        <span
          v-if="
            scope.data.compulsory === $CONSTANT.COURSES.LEARNTYPE.COMPULSORY
          "
          >{{ $t('m.compulsory') }}</span
        >
        <span
          v-if="scope.data.compulsory === $CONSTANT.COURSES.LEARNTYPE.ELECTIVE"
          >{{ $t('m.elective') }}</span
        >
      </template>
      <template v-slot:duration="scope">
        <span> {{ scope.data.duration }} {{ $t('m.min') }}</span>
      </template>

      <template v-slot:public="scope">
        <div />
        <span v-if="scope.data.is_public">{{ $t('m.public') }}</span>
        <span v-if="!scope.data.is_public">{{ $t('m.hide') }}</span>
      </template>

      <template v-slot:status="scope">
        <div />
        <span v-if="scope.data.paper_public">{{ $t('m.public') }}</span>
        <span v-if="!scope.data.paper_public">{{ $t('m.hide') }}</span>
      </template>
      <template v-slot:opeator="scope">
        <!-- <cb-button-group
          > -->
        <cb-button
          mr
          type="text"
          @click="edit(scope.data)"
          button-type="edit"
        ></cb-button>
        <cb-button
          mr
          type="text"
          v-if="scope.data.has_report"
          @click="experimentReport(scope.data)"
          >{{ $t('m.experimentReport') }}</cb-button
        >
        <cb-button
          mr
          type="text"
          v-if="scope.data.topo_id"
          @click="management(scope.data)"
          >{{ $t('m.learnMonitor') }}</cb-button
        >
        <!-- </cb-button-group -->
        <!-- > -->
      </template>
    </cb-search-table>
    <cb-dialog
      :title="$t('m.import')"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="beforeCloseImport"
    >
      <cb-scrollbar height="500px">
        <cb-search-table
          ref="sdlRefb"
          :selector="tableSelector"
          :selection.sync="multipleDialogSelection"
          url="/oj/admin/lesson/list"
          :data="queryDialog"
          :cols.sync="columnsDialog"
          baseURL="/api/ojj"
          row-key="resource_id"
        >
          <template v-slot:search>
            <cb-select
              clearable
              v-model="queryDialog.category_id"
              :options="directionOptions"
              @change="getAllCourse"
              :placeholder="$t('m.allDirection')"
            >
            </cb-select>
            <cb-select
              clearable
              v-model="queryDialog.course_id"
              :options="coursesOptions"
              :placeholder="$t('m.allCourses')"
            >
            </cb-select>
            <cb-search-input
              v-model="queryDialog.pattern"
              :placeholder="$t('m.namePh')"
            ></cb-search-input>
          </template>
          <template v-slot:type="scope">
            <div />
            <span v-if="scope.data.type === $CONSTANT.COURSES.TYPE.THEORY">{{
              $t('m.theory')
            }}</span>
            <span v-if="scope.data.type === $CONSTANT.COURSES.TYPE.LABS_TYPE">{{
              $t('m.LABS')
            }}</span>
          </template>
          <template v-slot:lesson_file="scope">
            <div />
            <span
              class="course-feature"
              v-if="
                scope.data.type === $CONSTANT.COURSES.TYPE.THEORY &&
                scope.data.handout_url != ''
              "
            >
              <span class="greenRound"></span>
              <span>{{ $t('m.courseHandout') }}</span>
            </span>
            <span
              class="course-feature"
              v-if="
                scope.data.type === $CONSTANT.COURSES.TYPE.LABS_TYPE &&
                scope.data.handout_url != ''
              "
            >
              <span class="greenRound"></span>
              <span>{{ $t('m.experimentalGuidance') }}</span>
            </span>
            <span class="course-feature" v-if="scope.data.topo_id">
              <span class="greenRound"></span>
              <span>{{ $t('m.experiment') }}</span>
            </span>

            <span
              class="course-feature"
              v-if="
                scope.data.lesson_file !== null &&
                scope.data.lesson_file.length > 0
              "
              @click.stop="showfile(scope.data)"
            >
              <span class="greenRound"></span>
              <span>{{ $t('m.enclosure') }}</span>
            </span>

            <span class="course-feature" v-if="scope.data.video_url">
              <span class="greenRound"></span>
              <span>{{ $t('m.video') }}</span>
            </span>

            <span class="course-feature">
              <span class="greenRound"></span>
              <span
                >{{ $t('practiseBreadcrumbs.practice') }}({{
                  scope.data.practice_count
                }})</span
              >
            </span>
          </template>

          <template v-slot:difficulty="scope">
            <!-- <div />
            <span
              class="high"
              v-if="
                scope.data.difficulty === $CONSTANT.COURSES.DIFFICULTY.ADVANCED
              "
              >{{ $t('m.advanced') }}</span
            >
            <span
              class="middle"
              v-if="
                scope.data.difficulty === $CONSTANT.COURSES.DIFFICULTY.MEDIUM
              "
              >{{ $t('m.medium') }}</span
            >
            <span
              class="lower"
              v-if="
                scope.data.difficulty === $CONSTANT.COURSES.DIFFICULTY.PRIMARY
              "
              >{{ $t('m.primary') }}</span
            > -->
            <div>
              <span v-if="scope.data.difficulty % 3 === 0">{{
                computedDiffculty(scope.data.difficulty)
              }}</span>
              <span v-if="scope.data.difficulty % 3 === 1">{{
                computedDiffculty(scope.data.difficulty)
              }}</span>
              <span v-if="scope.data.difficulty % 3 === 2">{{
                computedDiffculty(scope.data.difficulty)
              }}</span>
            </div>
          </template>
          <template v-slot:lesson_type="scope">
            <div />
            <span
              v-if="
                scope.data.lesson_type === $CONSTANT.COURSES.LEARNTYPE.NOSET
              "
              >{{ $t('m.noSet') }}</span
            >
            <span
              v-if="
                scope.data.lesson_type ===
                $CONSTANT.COURSES.LEARNTYPE.COMPULSORY
              "
              >{{ $t('m.compulsory') }}</span
            >
            <span
              v-if="
                scope.data.lesson_type === $CONSTANT.COURSES.LEARNTYPE.ELECTIVE
              "
              >{{ $t('m.elective') }}</span
            >
          </template>
          <template v-slot:duration="scope">
            <span> {{ scope.data.duration }} {{ $t('m.min') }}</span>
          </template>

          <template v-slot:public="scope">
            <div />
            <span class="public" v-if="scope.data.public">{{
              $t('m.public')
            }}</span>
            <span class="hide" v-if="!scope.data.public">{{
              $t('m.hide')
            }}</span>
          </template>

          <template v-slot:status="scope">
            <div />
            <span class="public" v-if="scope.data.test_paper_public">{{
              $t('m.public')
            }}</span>
            <span class="hide" v-if="!scope.data.test_paper_public">{{
              $t('m.hide')
            }}</span>
          </template>
          <template v-slot:opeator="scope">
            <cb-button-group>
              <cb-button
                type="text"
                @click="edit(scope.data)"
                button-type="edit"
              ></cb-button>
              <cb-button
                icon="icon-shiyanbaogao"
                type="text"
                v-if="scope.data.has_report"
                @click="experimentReport(scope.data)"
                >{{ $t('m.experimentReport') }}</cb-button
              >
              <cb-button
                icon="icon-xuexijiankong"
                type="text"
                v-if="scope.data.topo_id"
                @click="management(scope.data)"
                >{{ $t('m.learnMonitor') }}</cb-button
              >
            </cb-button-group>
          </template>
        </cb-search-table>
      </cb-scrollbar>
      <template class="center" slot="footer">
        <cb-button class="mr" @click="save" button-type="confirm"></cb-button>
        <cb-button button-type="cancel" @click="cancel"></cb-button>
      </template>
    </cb-dialog>
    <arrange-tree ref="arrangeTree" :query="query"></arrange-tree>
    <cb-dialog
      width="90%"
      :title="$t('m.experimentalScene')"
      :visible.sync="ScenesVisible"
      center
    >
      <exercise-dialog
        :queryScenes="queryScenes"
        v-if="ScenesVisible"
      ></exercise-dialog>
    </cb-dialog>

    <cb-dialog
      v-if="fileVisible"
      width="50%"
      :title="$t('m.annexManage')"
      :visible.sync="fileVisible"
      center
    >
      <annex-dialog :lesson-data="lesson_file"></annex-dialog>
    </cb-dialog>
  </cb-inner-page>
</template>
<script>
import _ from 'lodash';
import Constant from '../course-constant.js';
import ArrangeTree from '@/pages/cms/course-mod/class-manage/components/arrange-tree.vue';
import exerciseDialog from '@/pages/cms/course-mod/class-manage/components/exercise-dialog.vue';
import annexDialog from '@/pages/cms/course-mod/class-manage/components/annex-manage.vue';
import CommonUtils from '@/utils/utils.js';
import { setBreadcrumbTitle } from '@cyber/ui';
export default {
  components: {
    ArrangeTree,
    exerciseDialog,
    annexDialog,
  },
  data() {
    return {
      selector: {
        maxSelect: 0,
      },
      selection: [],
      selectorb: {
        maxSelect: 0,
      },
      selectionb: [],
      query: {
        course: '',
        course_id: '',
        type: null,
        difficulty: '',
        pattern: '',
      },
      queryScenes: {
        lesson_id: '',
        course_id: '',
        share_mode: '',
      },
      queryDialog: {
        course_id: '',
        pattern: '',
        except_course: '',
        category_id: '',
      },
      directionOptions: [],
      coursesOptions: [
        {
          name: this.$t('m.allCourses'),
          resource_id: '',
        },
      ],
      directionDialogValue: '',
      difficultyDialogValue: '',
      searchName: '',
      dialogVisible: false,
      selection: [],
      multipleDialogSelection: [],
      ScenesVisible: false,
      fileVisible: false,
      lesson_file: [],
      columns: [],
      columnsDialog: [],
    };
  },
  computed: {
    publicPracticeMsg() {
      const that = this;
      const recordCtg = that.$t('mess.lesson');
      return CommonUtils.formatString(
        that.$t('common.confirmConcealMsg'),
        recordCtg,
      );
    },
    hideMsg() {
      const that = this;
      const recordCtg = that.$t('mess.lesson');
      return CommonUtils.formatString(
        that.$t('common.confirmConcealMsg'),
        recordCtg,
      );
    },
    hideSuccessMsg() {
      const that = this;
      const recordCtg = that.$t('mess.lesson');
      return CommonUtils.formatString(
        that.$t('common.concealSuccess'),
        recordCtg,
      );
    },
    hideCourseSuccessMsg() {
      const that = this;
      const recordCtg = that.$t('course.classInfo');
      return CommonUtils.formatString(
        that.$t('common.concealSuccess'),
        recordCtg,
      );
    },
    deleteMsg() {
      const that = this;
      const recordCtg = that.$t('mess.lesson');
      return CommonUtils.formatString(
        that.$t('common.confirmDeleteMsg'),
        recordCtg,
      );
    },
    publicMsg() {
      const that = this;
      const recordCtg = that.$t('mess.lesson');
      return CommonUtils.formatString(
        that.$t('common.confirmOvertMsg'),
        recordCtg,
      );
    },
    publicSuccessMsg() {
      const that = this;
      const recordCtg = that.$t('mess.lesson');
      return CommonUtils.formatString(
        that.$t('common.overtSuccess'),
        recordCtg,
      );
    },
    publicCourseSuccessMsg() {
      const that = this;
      const recordCtg = that.$t('course.classInfo');
      return CommonUtils.formatString(
        that.$t('common.overtSuccess'),
        recordCtg,
      );
    },
    $CONSTANT() {
      return Constant;
    },
    difficultyOptions() {
      return [
        {
          value: this.$CONSTANT.COURSES.DIFFICULTY.PRIMARY,
          label: this.$t('m.primary'),
        },
        {
          value: this.$CONSTANT.COURSES.DIFFICULTY.MEDIUM,
          label: this.$t('m.medium'),
        },
        {
          value: this.$CONSTANT.COURSES.DIFFICULTY.ADVANCED,
          label: this.$t('m.advanced'),
        },
      ];
    },
    typeOptions() {
      return [
        {
          value: this.$CONSTANT.COURSES.TYPE.THEORY,
          label: this.$t('m.theory'),
        },
        {
          value: this.$CONSTANT.COURSES.TYPE.LABS_TYPE,
          label: this.$t('m.LABS'),
        },
      ];
    },
    difficultyDialogOptions() {
      return [
        {
          value: this.$CONSTANT.COURSES.DIFFICULTY.PRIMARY,
          label: this.$t('m.primary'),
        },
        {
          value: this.$CONSTANT.COURSES.DIFFICULTY.MEDIUM,
          label: this.$t('m.medium'),
        },
        {
          value: this.$CONSTANT.COURSES.DIFFICULTY.ADVANCED,
          label: this.$t('m.advanced'),
        },
      ];
    },
    courseId() {
      return _.get(this, '$route.params.courseId');
    },
  },
  created() {
    this.query.course_id = decodeURI(this.$route.params.courseId);
    this.queryDialog.except_course = this.$route.params.courseId;
    this.queryScenes.course_id = this.$route.params.courseId;
    this.tableSelector = {
      maxSelect: 0,
    };
    this.columns = [
      {
        label: this.$t('m.courseName'),
        prop: 'name',
        sorter: 'name',
        width: 150,
        resizable: true,
      },
      {
        label: this.$t('m.type'),
        slot: 'type',
        sorter: 'type',
      },
      {
        label: this.$t('m.coursewareContent'),
        slot: 'lesson_file',
        width: 430,
      },
      {
        label: this.$t('m.difficulty'),
        slot: 'difficulty',
        sorter: 'difficulty',
      },
      {
        label: this.$t('m.learningType'),
        prop: 'lesson_type',
        slot: 'lesson_type',
        sorter: 'compulsory',
      },
      {
        label: this.$t('m.learningTime'),
        prop: 'duration',
        slot: 'duration',
      },
      {
        label: this.$t('m.status'),
        slot: 'public',
        sorter: 'public',
      },
      {
        label: this.$t('m.creator'),
        prop: 'create_user_name',
      },
      {
        label: this.$t('m.operation'),
        slot: 'opeator',
        width: 270,
      },
    ];
    this.columnsDialog = [
      {
        label: this.$t('m.courseName'),
        prop: 'name',
        width: 180,
        resizable: true,
      },
      {
        label: this.$t('m.course'),
        prop: 'course_name',
      },
      {
        label: this.$t('m.type'),
        slot: 'type',
        sorter: 'type',
        width: 100,
      },
      {
        label: this.$t('m.coursewareContent'),
        slot: 'lesson_file',
        width: 450,
      },
      {
        label: this.$t('m.difficulty'),
        slot: 'difficulty',
        sorter: 'difficulty',
        minWidth: 120,
      },
      {
        label: this.$t('m.learningTime'),
        prop: 'duration',
        minWidth: 120,
        slot: 'duration',
      },
    ];
    this.getDirectionOptions();
    this.getAllCourse();
  },
  methods: {
    computedDiffculty(difficulty) {
      const data = this.difficultyOptions.filter(
        (item) => item.value === difficulty,
      );
      if (data.length) {
        return data[0].label;
      }
    },
    showfile(val) {
      this.fileVisible = true;
      this.lesson_file = val.lesson_file;
    },
    gotoPractice(lessonId) {
      const { courseId } = this;
      this.dialogVisible = false;
      // 课时管理列表点击练习跳转
      this.$router.push({
        name: 'lessons-manage-practice-go',
        params: {
          courseId,
          lessonId,
        },
      });
    },
    showExercise(val, share_mode) {
      this.queryScenes.lesson_id = val;
      this.queryScenes.share_mode = share_mode;
      this.ScenesVisible = true;
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
    // 获取所有课程
    getAllCourse() {
      this.coursesOptions = [];
      this.queryDialog.course_id = '';
      this.$request
        .get(
          '/oj/admin/course/list',
          {
            direction: this.queryDialog.category_id,
            page: 1,
            per_page: 9999,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          if (!_.isEmpty(_.get(res, 'data.data', ''))) {
            res.data.data.list.forEach((item) => {
              if (item.resource_id === this.query.course_id) {
                setBreadcrumbTitle(item.name);
              }
            });
          }
          const coursesOptions = this.coursesOptions.concat(res.data.data.list);
          for (let item of coursesOptions) {
            item.label = item.name;
            item.value = item.resource_id;
          }
          this.coursesOptions = coursesOptions;
        });
    },
    // 新增
    addCourse() {
      this.$router.push({
        name: 'lessons-add',
        params: {
          courseId: this.query.course_id,
        },
      });
    },
    // 编辑
    edit(row) {
      this.$router.push({
        name: 'lessons-edit',
        params: {
          courseId: this.query.course_id,
          lessonId: row.resource_id,
          itemNum: row.practice_count,
        },
      });
    },
    getId(val) {
      const arr = [];
      for (let i = 0; i < val.length; i++) {
        arr.push(val[i].resource_id);
      }
      return arr;
    },
    // 删除
    deleteCourse(data, done) {
      const that = this;
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      that.$request
        .delete(
          '/oj/admin/lesson/batch',
          {
            resource_ids: ids,
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
    },
    toPublic(data, done) {
      // this.$refs.sdlRef.batchOvert();
      const that = this;
      const recordCtg = that.$t('common.record');
      const ids = [];
      const validSelection = _.filter(data, (item) => !item.is_public);
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      this.$request
        .patch(
          `/oj/admin/lesson/batch-public`,
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
    },
    toHide(data, done) {
      const that = this;
      const recordCtg = that.$t('common.record');
      const ids = [];
      const validSelection = _.filter(data, (item) => item.is_public);
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      this.$request
        .patch(
          `/oj/admin/lesson/batch-public`,
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
    },
    // 练习公开与隐藏
    toPublicPractice(data, done) {
      const arry = [];
      let num = '';
      if (data.length > 0) {
        const validSelection = _.filter(data, ['paper_public', false]);
        if (validSelection.length <= 0) {
          this.$message({
            type: 'error',
            message: this.$t('m.selectRecordToOvert'),
          });
          done(false);
          return;
        }
        data.forEach((item) => {
          if (item.paper_public !== true) {
            num = 1;
          }
          arry.push(item.resource_id);
        });
        this.$request
          .patch(
            `/oj/admin/lesson/practice/batch_public`,
            {
              resource_ids: arry,
              is_public: true,
            },
            {
              baseURL: '/api/ojj',
            },
          )
          .then(() => {
            this.$refs.sdlRef.reload();
            this.selection = [];
            done();
          })
          .catch(() => {
            done(false);
          });
      } else {
        this.$message({
          type: 'error',
          message: this.$t('m.selectRecordToOvert'),
        });
        done(false);
      }
    },
    toHidePractice(data, done) {
      const arry = [];
      let num = '';
      if (this.selection.length > 0) {
        const validSelection = _.filter(this.selection, ['paper_public', true]);
        if (validSelection.length <= 0) {
          this.$message({
            type: 'error',
            message: this.$t('m.selectRecordToConceal'),
          });
          done(false);
          return;
        }
        this.selection.forEach((item) => {
          if (item.paper_public !== false) {
            num = 0;
          }
          arry.push(item.resource_id);
        });

        this.$request
          .patch(
            `/oj/admin/lesson/practice/batch_public`,
            {
              resource_ids: arry,
              is_public: false,
            },
            {
              baseURL: '/api/ojj',
            },
          )
          .then(() => {
            this.$refs.sdlRef.reload();
            this.selection = [];
            // this.$message({
            //   type: 'success',
            //   message: this.$t('m.successful'),
            // });
            done();
          })
          .catch(() => {
            done(false);
          });
      } else {
        this.$message({
          type: 'error',
          message: this.$t('m.selectRecordToConceal'),
        });
        done(false);
      }
    },
    // 编排
    arrangeCourse() {
      this.$refs.arrangeTree.getLessonConfig();
      this.$refs.arrangeTree.courseVisible = true;
    },
    // 导入
    importCourse() {
      this.dialogVisible = true;
    },
    save() {
      this.$request
        .post(
          '/oj/admin/lesson/import',
          {
            lesson_ids: this.getId(this.multipleDialogSelection),
            course_id: this.query.course_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.$refs.sdlRef.reload();
          this.$refs.sdlRefb.reload();
          this.$message({ type: 'success', message: this.$t('m.successful') });
          this.beforeCloseImport();
        });
    },
    beforeCloseImport() {
      this.dialogVisible = false;
      this.queryDialog.course_id = '';
      this.queryDialog.pattern = '';
      this.queryDialog.category_id = '';
      this.multipleDialogSelection = [];
    },
    cancel() {
      this.beforeCloseImport();
    },
    // 学习监控
    management(row) {
      this.$router.push({
        name: 'learn-monitor',
        params: {
          courseId: this.query.course_id,
          lessonId: row.resource_id,
        },
      });
      // this.$router.push({ path: `/admin/learn-monitor/${row.resource_id}` })
    },
    // 实验报告
    experimentReport(row) {
      this.$router.push({
        name: 'experiment-report',
        params: {
          courseId: this.query.course_id,
          lessonId: row.resource_id,
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.course-feature {
  .greenRound {
    background-color: var(--green-color);
  }
  .greenCircle {
    border-color: var(--green-color);
  }
}
.spandisable {
  color: var(--primary-color-4);
}
.spanover {
  color: var(--primary-color);
}
.course-feature {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  padding-left: 5px;
  .greenRound {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 2px;
  }
  .greenCircle {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 2px;
    border-style: solid;
    border-width: 1px;
  }
}
.center {
  display: flex;
  justify-content: center;
}
</style>
