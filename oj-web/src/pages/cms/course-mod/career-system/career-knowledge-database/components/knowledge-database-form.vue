<template>
  <cb-inner-page :background="false">
    <cb-form
      ref="formRef"
      label-position="right"
      label-width="120px"
      :model.sync="model"
      :rules="rules"
      :fetchPromise="fetchForm"
      :searchBarBg="false"
      :isBgColor="true"
    >
      <cb-form-item
        prop="resource_id"
        :label="$t('careerSystem.knowledgeNumber')"
      >
        <cb-input
          :disabled="id ? true : false"
          v-model="model.resource_id"
          :placeholder="$t('careerSystem.plzEnterKnowledgeNumber')"
        ></cb-input>
      </cb-form-item>
      <cb-form-item prop="content" :label="$t('careerSystem.content')">
        <cb-input
          v-model="model.content"
          :placeholder="$t('careerSystem.plzEnterKnowledgeContent')"
        ></cb-input>
      </cb-form-item>
      <cb-form-item
        prop="category_id"
        :label="$t('careerSystem.knowledgeCategory')"
      >
        <cb-select
          style="width: 300px"
          v-model="model.category_id"
          :options="categoryList"
          :placeholder="$t('careerSystem.selectknowledgeCategory')"
          clearable
        />
      </cb-form-item>
      <cb-form-item prop="name" :label="$t('careerSystem.relatedCourses')">
        <cb-search-table
          :scroll="{ y: 480 }"
          ref="relatedCoursesTableRef"
          :cols="relatedCoursesCols"
          :selector="relatedCoursesSelector"
          :selection.sync="relatedCoursesSelection"
          :hidePaginOnDemand="true"
          :data-source="course_list_backup"
          row-key="resource_id"
          :searchBarBg="false"
        >
          <template v-slot:search>
            <cb-button
              button-type="add"
              @click="addCoursesDialog()"
            ></cb-button>
            <cb-button
              button-type="delete"
              @click="deleteSelected(relatedCoursesSelection, $event)"
              :disabled="relatedCoursesSelection.length === 0"
              hollow
            ></cb-button>
          </template>
          <template v-slot:filter>
            <cb-select
              v-model="relatedCoursesModel.category_id"
              :options="directionList"
              :placeholder="$t('careerSystem.allTheDirection')"
              clearable
            />
            <cb-select
              v-model="relatedCoursesModel.difficulty"
              :options="difficultyList"
              :placeholder="$t('careerSystem.allTheDifficulty')"
              clearable
            />
            <cb-search-input
              style="width: 200px"
              :placeholder="$t('careerSystem.enterName')"
              v-model="relatedCoursesModel.name"
              clearable
            ></cb-search-input>
          </template>
          <template v-slot:difficulty="scope">
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
          <template v-slot:weight="scope">
            <cb-input-number
              v-model="scope.data.weight"
              :label="$t('careerSystem.careerSystemAdd')"
              @input.native="onInput"
              @change="
                weightChange(
                  scope.data.resource_id,
                  scope.data.weight,
                  scope.data,
                )
              "
            ></cb-input-number>
            <div class="warn" v-if="scope.data.weightWarnShow">
              {{ $t('careerSystem.weightWarn') }}
            </div>
          </template>
        </cb-search-table>
      </cb-form-item>
      <template slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button buttonType="confirm" @click="submitForm"></cb-button>
          <cb-button button-type="cancel" @click="resetForm"></cb-button>
        </cb-button-group>
      </template>
    </cb-form>
    <courses-list-dialog
      ref="coursesListDialog"
      @selectCourses="getSelectedCourses"
    ></courses-list-dialog>
  </cb-inner-page>
</template>
<script>
import {
  getDirectionList,
  KnowledgeCategoryList,
  addKnowledge,
  editBackKnowledge,
  editKnowledge,
} from '@/api/career-framework';
import CoursesListDialog from './course-list-dialog.vue';
import _ from 'lodash';
import Utils from '@/utils/utils';
import {
  validateSkillNumberLength,
  validateSkillNumberRules,
  validateSkillTitleLength,
} from '@/utils/rules.js';
export default {
  components: {
    CoursesListDialog,
  },
  props: {
    id: {
      type: String,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      // 难度分类数据
      difficultyList: [],
      weightWarnShow: true,
      model: {
        resource_id: '',
        content: '',
        category_id: '',
        course_list: [],
      },
      // 点击确定时表格数据不变化
      course_list_backup: [],
      categoryList: [],
      rules: {
        resource_id: [
          {
            required: true,
            message: this.$t('careerSystem.enterNumber'),
            trigger: 'blur',
          },
          { validator: validateSkillNumberLength, trigger: ['blur', 'change'] },
          { validator: validateSkillNumberRules, trigger: ['blur', 'change'] },
        ],
        content: [
          {
            required: true,
            message: this.$t('careerSystem.enterContent'),
            trigger: 'blur',
          },
          { validator: validateSkillTitleLength, trigger: ['blur', 'change'] },
        ],
        category_id: [
          {
            required: true,
            message: this.$t('careerSystem.enterKnowledgeCategory'),
            trigger: 'blur',
          },
        ],
      },
      relatedCoursesSelector: {
        maxSelect: 0,
      },
      relatedCoursesModel: {
        category_id: '', //对应方向direction_name
        difficulty: '',
        name: '',
      },
      relatedCoursesSelection: [],
      relatedCoursesCols: [
        {
          label: this.$t('careerSystem.name'),
          prop: 'name',
        },
        {
          label: this.$t('careerSystem.direction'),
          prop: 'direction_name',
        },
        {
          label: this.$t('careerSystem.difficulty'),
          slot: 'difficulty',
        },
        {
          label: this.$t('careerSystem.classHour'),
          prop: 'lesson_count',
        },
        {
          label: this.$t('careerSystem.weight'),
          slot: 'weight',
        },
      ],
      relatedCoursesData: [],
      directionList: [],
    };
  },
  watch: {
    relatedCoursesModel: {
      handler(obj) {
        const tableData = _.cloneDeep(this.relatedCoursesData);
        this.model.course_list = Utils.conditionFilterData(obj, tableData);
        this.course_list_backup = _.cloneDeep(this.model.course_list);
      },
      deep: true,
    },
  },
  mounted() {
    this.getDifficultyOptions();
    this.getDirection();
    this.getCategory();
    if (this.id) {
      editBackKnowledge(this.id).then((res) => {
        const data = _.get(res, 'data.data', {});
        const { resource_id, content, category_id, course_list } = data;
        // 备份初始化的关联课程,通过此变量，进行过滤
        this.relatedCoursesData = _.cloneDeep(course_list);
        this.course_list_backup = _.cloneDeep(course_list);
        this.model = {
          resource_id,
          content,
          category_id,
          course_list,
        };
      });
    }
  },
  methods: {
    onInput(e) {
      e.target.value = e.target.value.replace(/[^\d.]/g, '');
    },
    weightChange(id, weight, scope) {
      if (weight > 9 || weight < 0) {
        scope.weightWarnShow = true;
      } else {
        scope.weightWarnShow = false;
      }
      // 修改权限
      this.relatedCoursesData.forEach((item) => {
        if (item.resource_id == id) {
          item.weight = weight;
        }
      });
      this.model.course_list = _.cloneDeep(this.relatedCoursesData);
    },
    // 获取知识类别
    getCategory() {
      KnowledgeCategoryList().then((res) => {
        const data = _.get(res, 'data.data.list', []);
        const list = data.map((item) => {
          return {
            label: item.content,
            value: item.resource_id,
          };
        });
        this.categoryList = [...list];
      });
    },
    // 获取方向
    getDirection() {
      getDirectionList().then((res) => {
        const data = _.get(res, 'data.data.list', []);
        const list = data.map((item) => {
          return {
            label: item.name,
            value: item.resource_id,
          };
        });
        this.directionList = [...list];
      });
    },
    // 获取难度分类
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
          this.difficultyList = arr;
        });
    },
    computedDiffculty(difficulty) {
      const data = this.difficultyList.filter(
        (item) => item.value === difficulty,
      );
      if (data.length) {
        return data[0].label;
      }
    },

    fetchForm() {
      const model = _.cloneDeep(this.model);
      if (this.id) {
        return editKnowledge(model).then(() => {
          this.back();
        });
      } else {
        return addKnowledge(model).then(() => {
          this.back();
        });
      }
    },

    // 新增、编辑的提交
    submitForm() {
      let flag = 1;
      this.model.course_list = _.cloneDeep(this.relatedCoursesData);
      for (let i = 0; i < this.model.course_list.length; i++) {
        if (
          this.model.course_list[i].weight > 9 ||
          this.model.course_list[i].weight < 0
        ) {
          flag = 0;
          break;
        }
      }
      if (flag == 1) {
        this.$refs.formRef.submit();
      }
    },

    back() {
      this.$router.push({
        path: '/admin/course-mod/career-system/career-knowledge-database/knowledge-database-list',
      });
    },

    resetForm() {
      this.back();
    },

    // 新增关联课程
    addCoursesDialog() {
      this.relatedCoursesSelection = [];
      Object.keys(this.relatedCoursesModel).forEach(
        (key) => (this.relatedCoursesModel[key] = ''),
      );
      this.$refs.coursesListDialog.visibleDialog = true;
    },

    // 获取课程弹框所选择的课程
    getSelectedCourses(data) {
      let courseList = this.model.course_list;
      let dataBackup = _.cloneDeep(data);
      // 如果没有weight，添加一个weight属性
      dataBackup.forEach((item) => {
        if (!('weight' in item)) {
          item.weight = 1;
        }
      });

      courseList = [...courseList, ...dataBackup];
      courseList = Utils.arrayRepeatItemFilter(courseList, 'resource_id');
      this.model.course_list = _.cloneDeep(courseList);
      this.course_list_backup = _.cloneDeep(courseList);
      this.relatedCoursesData = _.cloneDeep(courseList);
      this.$refs.coursesListDialog.visibleDialog = false;
    },

    // 无接口删除表格数据
    deleteSelected(selection, done) {
      this.model.course_list = this.deleteSubItem(
        selection,
        this.model.course_list,
        'resource_id',
      );
      this.relatedCoursesData = this.deleteSubItem(
        selection,
        this.relatedCoursesData,
        'resource_id',
      );
      this.course_list_backup = _.cloneDeep(this.model.course_list);
      // this.relatedCoursesData = _.cloneDeep(this.model.course_list);
      done();
      this.relatedCoursesSelection = [];
    },

    // 删除子项
    deleteSubItem(selection, list, prop) {
      for (let i = 0; i < selection.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (list[j][prop] === selection[i][prop]) {
            list.splice(j, 1);
            j = j - 1;
          }
        }
      }
      return list;
    },
  },
};
</script>
<style scoped lang="scss">
.w100 {
  width: 100%;
  margin-bottom: 10px;
  .mr10 {
    margin-right: 10px;
  }
}
.flex-list {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.warn {
  color: var(--red-color);
  font-size: 12px;
}
</style>
