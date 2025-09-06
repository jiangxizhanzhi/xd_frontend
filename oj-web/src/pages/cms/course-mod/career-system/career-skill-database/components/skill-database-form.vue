<template>
  <cb-inner-page :background="false">
    <cb-form
      ref="formRef"
      label-position="right"
      label-width="120px"
      :model.sync="model"
      :rules="rules"
      :fetchPromise="fetchForm"
      :isBgColor="true"
    >
      <cb-form-item prop="resource_id" :label="$t('careerSystem.skillNumber')">
        <cb-input
          :disabled="id ? true : false"
          v-model="model.resource_id"
          :placeholder="$t('careerSystem.plzEnterSkillNumber')"
        ></cb-input>
      </cb-form-item>
      <cb-form-item prop="content" :label="$t('careerSystem.content')">
        <cb-input
          v-model="model.content"
          :placeholder="$t('careerSystem.plzEnterSkillContent')"
        ></cb-input>
      </cb-form-item>
      <cb-form-item prop="name" :label="$t('careerSystem.relatedTask')">
        <cb-search-table
          :scroll="{ y: 480 }"
          ref="relatedCoursesTableRef"
          :cols="relatedSkillCols"
          :selector="relatedSkillSelector"
          :selection.sync="relatedSkillSelection"
          :hidePaginOnDemand="true"
          :data-source="skill_list_backup"
          row-key="resource_id"
          :searchBarBg="false"
        >
          <template v-slot:search>
            <cb-button button-type="add" @click="addSkillDialog()"></cb-button>
            <cb-button
              button-type="delete"
              hollow
              @click="deleteSelected(relatedSkillSelection, $event)"
              :disabled="relatedSkillSelection.length === 0"
            ></cb-button>
          </template>
          <template v-slot:filter>
            <cb-select
              v-model="relatedSkillModel.scene_type"
              :options="sceneTypes"
              :placeholder="$t('careerSystem.allTypes')"
              titleField="name"
              valueField="code"
              clearable
            />
            <cb-select
              v-model="relatedSkillModel.scene_difficulty"
              :options="levelTypes"
              :placeholder="$t('careerSystem.allTheDifficulty')"
              titleField="name"
              valueField="code"
              clearable
            />
            <cb-search-input
              style="width: 200px"
              :placeholder="$t('m.inputName')"
              v-model="relatedSkillModel.name"
              clearable
            ></cb-search-input>
          </template>
          <template v-slot:type="scope">
            {{ getSceneType(scope.data.scene_type) }}
          </template>
          <template v-slot:difficulty="scope">
            <span>
              {{ getLevelType(scope.data.scene_difficulty) }}
            </span>
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
          <template v-slot:operation="scope">
            <cb-button
              button-type="delete"
              type="text"
              @click="deleteSingleItem(scope.data, $event)"
            ></cb-button>
          </template>
        </cb-search-table>
      </cb-form-item>
      <template slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button buttonType="confirm" @click="submitForm"></cb-button>
          <cb-button
            button-type="cancel"
            link-name="skill-database-list"
          ></cb-button>
        </cb-button-group>
      </template>
    </cb-form>
    <add-dialog
      ref="addDialog"
      :sceneType="sceneTypes"
      :levelType="levelTypes"
      @savevalue="getSelectedCourses"
    ></add-dialog>
  </cb-inner-page>
</template>
<script>
import {
  getSkill,
  putSkill,
  addSkill,
  getLevelList,
  getTypeList,
} from '@/api/career-skill';
import AddDialog from './skill-form-dialog.vue';
import _ from 'lodash';
import Utils from '@/utils/utils';
import {
  validateSkillNumberLength,
  validateSkillNumberRules,
  validateSkillTitleLength,
} from '@/utils/rules.js';
export default {
  components: {
    AddDialog,
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
      sceneTypes: [],
      levelTypes: [],
      baseURL: '/api/ojj',
      url: '/rtks/skill',
      weightWarnShow: true,
      model: {
        resource_id: '',
        content: '',
        missions: [],
      },
      originAllData: [],
      // 点击确定时表格数据不变化
      skill_list_backup: [],
      rules: {
        resource_id: [
          {
            required: true,
            message: this.$t('careerSystem.enterNumber'),
            trigger: ['blur', 'change'],
          },
          { validator: validateSkillNumberLength, trigger: ['blur', 'change'] },
          { validator: validateSkillNumberRules, trigger: ['blur', 'change'] },
        ],
        content: [
          {
            required: true,
            message: this.$t('careerSystem.enterContent'),
            trigger: ['blur', 'change'],
          },
          { validator: validateSkillTitleLength, trigger: ['blur', 'change'] },
        ],
      },
      relatedSkillSelector: {
        maxSelect: 0,
      },
      relatedSkillModel: {
        scene_type: '',
        scene_difficulty: '',
        name: '',
      },
      relatedSkillSelection: [],
      relatedSkillCols: [
        {
          title: this.$t('careerSystem.taskName'),
          prop: 'title',
        },
        {
          title: this.$t('careerSystem.sceneName'),
          prop: 'scene_name',
        },
        {
          title: this.$t('careerSystem.sceneType'),
          slot: 'type',
        },
        {
          title: this.$t('careerSystem.difficulty'),
          slot: 'difficulty',
        },
        {
          title: this.$t('careerSystem.weight'),
          slot: 'weight',
          width: '260px',
        },
        {
          title: this.$t('careerSystem.operate'),
          slot: 'operation',
        },
      ],
      relatedSkillData: [],
    };
  },
  watch: {
    relatedSkillModel: {
      handler(obj) {
        let courseList = _.cloneDeep(this.relatedSkillData);
        const filterArr = []; //过滤得key值
        for (let item in obj) {
          if (obj[item].toString()) {
            filterArr.push(item);
          }
        }
        if (filterArr.length == 0) {
          this.model.missions = courseList;
          this.skill_list_backup = courseList;
        } else {
          this.model.missions = courseList.filter((data) => {
            let flag = true;
            for (let i = 0; i < filterArr.length; i++) {
              if (filterArr[i] == 'name') {
                if (
                  !(
                    data['title'].indexOf(obj[filterArr[i]]) > -1 ||
                    data.scene_name.indexOf(obj[filterArr[i]]) > -1
                  )
                ) {
                  flag = false;
                  break;
                }
              } else {
                if (data[filterArr[i]] !== obj[filterArr[i]]) {
                  flag = false;
                  break;
                }
              }
            }
            return flag;
          });
          this.skill_list_backup = _.cloneDeep(this.model.missions);
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getSceneTypes();
    this.getLevelTypes();
    if (this.id) {
      getSkill(this.id).then((res) => {
        const data = _.get(res, 'data.data', {});
        const { resource_id, content, missions } = data;
        // 备份初始化的关联课程,通过此变量，进行过滤
        this.relatedSkillData = _.cloneDeep(missions);
        this.skill_list_backup = _.cloneDeep(missions);
        this.model = {
          resource_id,
          content,
          missions,
        };
      });
    }
  },
  methods: {
    // 获取全部类型
    getSceneTypes() {
      getTypeList().then((res) => {
        this.sceneTypes = _.get(res, 'data.data', []);
      });
    },
    getLevelTypes() {
      getLevelList().then((res) => {
        this.levelTypes = _.get(res, 'data.data', []);
      });
    },
    getSceneType(val) {
      const filterData = _.filter(this.sceneTypes, (item) => {
        return item.code === val;
      });
      if (filterData.length > 0) {
        return filterData[0].name;
      }
      return '';
    },
    getLevelColor(val) {
      const filterData = _.filter(this.levelTypes, (item) => {
        return item.code === val;
      });
      if (filterData.length > 0) {
        if (filterData[0].code === 1) {
          //初级
          return 'lower';
        } else if (filterData[0].code === 2) {
          //中级
          return 'middle';
        } else if (filterData[0].code === 3) {
          //高级
          return 'high';
        }
      }
    },
    getLevelType(val) {
      const filterData = _.filter(this.levelTypes, (item) => {
        return item.code === val;
      });
      if (filterData.length > 0) {
        return filterData[0].name;
      }
      return '';
    },
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
      this.relatedSkillData.forEach((item) => {
        if (item.resource_id == id) {
          item.weight = weight;
        }
      });
      this.model.missions = _.cloneDeep(this.relatedSkillData);
    },

    fetchForm() {
      if (this.id) {
        return putSkill(this.model).then(() => {
          this.$router.push({
            name: 'skill-database-list',
          });
        });
      } else {
        return addSkill(this.model).then(() => {
          this.$router.push({
            name: 'skill-database-list',
          });
        });
      }
    },

    // 新增、编辑的提交
    submitForm() {
      let flag = 1;
      this.model.missions = _.cloneDeep(this.relatedSkillData);
      for (let i = 0; i < this.model.missions.length; i++) {
        if (
          this.model.missions[i].weight > 9 ||
          this.model.missions[i].weight < 0
        ) {
          flag = 0;
          break;
        }
      }
      if (flag == 1) {
        this.$refs.formRef.submit();
      }
    },

    // 新增关联renwu
    addSkillDialog() {
      this.relatedSkillSelection = [];
      Object.keys(this.relatedSkillModel).forEach(
        (key) => (this.relatedSkillModel[key] = ''),
      );
      this.$refs.addDialog.visibleValue = true;
    },

    // 获取renwu弹框所选择的renwu
    getSelectedCourses(data) {
      let courseList = this.model.missions;
      let dataBackup = _.cloneDeep(data);
      // 如果没有weight，添加一个weight属性
      dataBackup.forEach((item) => {
        if (!('weight' in item)) {
          item.weight = 1;
        }
      });

      courseList = [...courseList, ...dataBackup];
      courseList = Utils.arrayRepeatItemFilter(courseList, 'resource_id');
      this.model.missions = _.cloneDeep(courseList);
      this.skill_list_backup = _.cloneDeep(courseList);
      this.relatedSkillData = _.cloneDeep(courseList);
      this.$refs.addDialog.visibleValue = false;
    },
    deleteSingleItem(row, done) {
      this.relatedSkillData = _.filter(this.relatedSkillData, (item) => {
        return item.resource_id !== row.resource_id;
      });
      this.model.missions = _.filter(this.model.missions, (item) => {
        return item.resource_id !== row.resource_id;
      });
      this.skill_list_backup = _.cloneDeep(this.model.missions);
      // this.relatedSkillData = _.cloneDeep(this.model.missions);
      done();
    },
    // 无接口删除表格数据
    deleteSelected(selection, done) {
      this.relatedSkillData = this.deleteSubItem(
        selection,
        this.relatedSkillData,
        'resource_id',
      );
      this.model.missions = this.deleteSubItem(
        selection,
        this.model.missions,
        'resource_id',
      );
      this.skill_list_backup = _.cloneDeep(this.model.missions);
      // this.relatedSkillData = _.cloneDeep(this.model.missions);
      done();
      this.relatedSkillSelection = [];
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
