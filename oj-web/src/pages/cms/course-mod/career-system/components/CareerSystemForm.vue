<template>
  <cb-inner-page :background="false">
    <cb-form
      ref="formRef"
      label-position="right"
      label-width="100px"
      :model.sync="model"
      :rules="rules"
      :fetchPromise="fetchForm"
      :isBgColor="true"
    >
      <cb-form-item :label="$t('careerSystem.jobName')" prop="name">
        <cb-input
          v-model="model.name"
          :placeholder="$t('careerSystem.enterJobName')"
        ></cb-input>
      </cb-form-item>
      <cb-form-item
        :label="$t('careerSystem.jobDescription')"
        prop="description"
      >
        <cb-input v-model="model.description" type="textarea"></cb-input>
      </cb-form-item>
      <cb-form-item
        :label="$t('careerSystem.positionHierarchy')"
        prop="level_id"
      >
        <cb-cascader
          style="width: 400px"
          v-model="levelIdSet"
          :options="levelIdOptions"
          :props="levelIdOptionProps"
          @change="handleChange"
          clearable
        />
      </cb-form-item>
      <cb-form-item
        :label="$t('careerSystem.jobResponsibilitiesList')"
        prop="task_ids"
      >
        <inventory-table
          :data-source="taskTableData"
          type="1"
          @addInventory="addInventory"
          @afterDelete="getAfterDeleteData"
        >
        </inventory-table>
      </cb-form-item>
      <cb-form-item
        :label="$t('careerSystem.knowledgeList')"
        prop="knowledge_ids"
      >
        <span slot="label">
          {{ $t('careerSystem.knowledgeList') }}
          <br />
          <cb-select
            v-model="model.knowledge_weight"
            :options="optionKnow"
            size="mini"
            style="width: 80px"
          />
        </span>
        <inventory-table
          :data-source="knowledgeTableData"
          type="2"
          @addInventory="addInventory"
          @afterDelete="getAfterDeleteData"
        >
        </inventory-table>
      </cb-form-item>
      <cb-form-item :label="$t('careerSystem.skillList')" prop="skill_ids">
        <span slot="label">
          {{ $t('careerSystem.skillList') }}
          <br />
          <cb-select
            v-model="model.knowledge_weight"
            :options="optionSkill"
            size="mini"
            style="width: 80px"
          />
        </span>
        <inventory-table
          :data-source="skillTableData"
          type="3"
          @addInventory="addInventory"
          @afterDelete="getAfterDeleteData"
        >
        </inventory-table>
      </cb-form-item>
      <!-- <cb-form-item :label="$t('careerSystem.skillCategory')" prop="category">
        <cb-select
          style="width: 400px"
          v-model="model.category"
          :options="categoryList"
          clearable
        />
      </cb-form-item>
      <cb-form-item :label="$t('careerSystem.skillList')" prop="skill_ids">
        <inventory-table
          :data-source="skillTableData"
          type="3"
          @addInventory="addInventory"
          @afterDelete="getAfterDeleteData"
        >
        </inventory-table>
      </cb-form-item>
      <cb-form-item :label="$t('careerSystem.abilityList')" prop="ability_ids">
        <inventory-table
          :data-source="abilityTableData"
          type="4"
          @addInventory="addInventory"
          @afterDelete="getAfterDeleteData"
        >
        </inventory-table>
      </cb-form-item> -->
      <template slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button button-type="confirm" @click="submitForm"></cb-button>
          <cb-button button-type="cancel" @click="resetForm"></cb-button>
        </cb-button-group>
      </template>
    </cb-form>
    <inventory-dialog
      ref="inventoryDialog"
      :dialogURL="dialogURL"
      :dialogTitle="dialogTitle"
      :type="inventoryType"
      @selectedInventory="getSelectedInventory"
    >
    </inventory-dialog>
  </cb-inner-page>
</template>

<script>
import InventoryTable from './InventoryTable.vue';
import InventoryDialog from './InventoryDialog.vue';
import {
  addFrameworkStation,
  editFrameworkStation,
  editStationBackData,
  getTreeData,
} from '@/api/career-framework';
import Utils from '@/utils/utils';
import { buildCascaderValue } from '@/utils/cascader-value';
import _ from 'lodash';
import Validate from '@/utils/validate.js';
import Util from '@/utils/util';
export default {
  name: 'CareerSystemForm',
  props: {
    id: {
      type: String,
      default: '',
    },
    frameId: {
      type: String,
      default: '',
    },
  },
  components: {
    InventoryTable,
    InventoryDialog,
    Validate,
  },
  data() {
    const description = (rule, value, callback) => {
      if (value) {
        const len = Util.getByteLen(value);
        if (len < 1 || len > 2048) {
          callback(new Error(this.$t('m.validDesc')));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      model: {
        name: '',
        description: '',
        level_id: '',
        category: '',
        ability_ids: [],
        knowledge_ids: [],
        // skill_ids: [],
        task_ids: [],
        knowledge_weight: 30,
        skill_id_weights: [],
      },
      levelIdSet: [],
      levelIdOptions: [],
      levelIdOptionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'resource_id',
        label: 'name',
        children: 'children',
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('careerSystem.enterJobName'),
            trigger: 'blur',
          },
          {
            validator: Validate.jobName,
            trigger: 'blur',
          },
        ],
        description: [{ validator: description, trigger: 'blur' }],
        level_id: [
          {
            required: true,
            message: this.$t('careerSystem.selectJobLevel'),
            trigger: 'blur',
          },
        ],
        category: [
          {
            required: true,
            message: this.$t('careerSystem.selectSkillCategory'),
            trigger: 'blur',
          },
        ],
      },
      inventoryType: '1',
      dialogURL: '',
      dialogTitle: '',
      taskTableData: [],
      knowledgeTableData: [],
      skillTableData: [],
      optionKnow: [
        // 知识点
        {
          value: 0,
          label: '0%',
        },
        {
          value: 10,
          label: '10%',
        },
        {
          value: 20,
          label: '20%',
        },
        {
          value: 30,
          label: '30%',
        },
        {
          value: 40,
          label: '40%',
        },
        {
          value: 50,
          label: '50%',
        },
        {
          value: 60,
          label: '60%',
        },
        {
          value: 70,
          label: '70%',
        },
        {
          value: 80,
          label: '80%',
        },
        {
          value: 90,
          label: '90%',
        },
        {
          value: 100,
          label: '100%',
        },
      ],
      optionSkill: [
        // 技能比例
        {
          value: 0,
          label: '100%',
        },
        {
          value: 10,
          label: '90%',
        },
        {
          value: 20,
          label: '80%',
        },
        {
          value: 30,
          label: '70%',
        },
        {
          value: 40,
          label: '60%',
        },
        {
          value: 50,
          label: '50%',
        },
        {
          value: 60,
          label: '40%',
        },
        {
          value: 70,
          label: '30%',
        },
        {
          value: 80,
          label: '20%',
        },
        {
          value: 90,
          label: '10%',
        },
        {
          value: 100,
          label: '0%',
        },
      ],
    };
  },
  watch: {
    levelIdSet(val) {
      if (val && val.length > 0) {
        this.model.level_id = val[val.length - 1];
      } else {
        this.model.level_id = '';
      }
    },
  },
  mounted() {
    // this.getSkillCategory();
    this.getTreeList();
  },
  methods: {
    // 回显时转化关联课程数
    JsonParseCourses(data, weightArr) {
      data.forEach((item) => {
        if (item.courses) {
          item.course_list = JSON.parse(item.courses);
        } else {
          item.course_list = [];
        }
        // c从knowledge_id_weights读取weight
        for (const item1 of weightArr) {
          if (item1.id === item.resource_id) {
            item.weight = item1.weight;
          }
        }
      });
      return data;
    },
    initModel() {
      if (this.id) {
        editStationBackData(this.id).then((res) => {
          let data = _.get(res, 'data.data', {});
          const {
            name,
            description,
            level_id,
            category,
            ability_ids,
            knowledge_ids,
            skill_ids,
            task_ids,
            task_data_list,
            knowledge_data_list,
            knowledge_id_weights,
            skill_data_list,
            knowledge_weight,
          } = data;
          this.taskTableData = task_data_list;
          (this.knowledgeTableData = this.JsonParseCourses(
            knowledge_data_list,
            knowledge_id_weights,
          )),
            (this.skillTableData = skill_data_list);
          this.model = {
            name,
            level_id,
            category,
            description,
            ability_ids,
            knowledge_ids,
            skill_ids,
            task_ids,
            knowledge_weight,
          };
          this.levelIdSet = buildCascaderValue(this.levelIdOptions, level_id);
        });
      }
    },
    getTreeList() {
      // let { framework_id: id } = this.$store.state.careerFramework;
      getTreeData('/rtks/frame/tree', this.frameId).then((res) => {
        if (res && res.data && res.data.data) {
          this.levelIdOptions = this.handlelevelIdOptions([res.data.data]);
          this.initModel();
        }
      });
    },
    handlelevelIdOptions(levelIdOptionsInit) {
      levelIdOptionsInit[0]['disabled'] = true;
      if (
        'children' in levelIdOptionsInit[0] &&
        levelIdOptionsInit[0]['children'] != null
      ) {
        levelIdOptionsInit[0].children.forEach((item) => {
          item['disabled'] = true;
        });
      }
      return levelIdOptionsInit;
    },
    handleChange(value) {
      if (value && value.length > 0) {
        this.model.level_id = value[value.length - 1];
      } else {
        this.model.level_id = '';
      }
    },

    // 新增清单
    addInventory(type) {
      this.inventoryType = type;
      if (type === '1') {
        this.dialogURL = '/rtks/task/list';
        this.dialogTitle = this.$t('careerSystem.addJobResponsibilities');
      } else if (type === '2') {
        this.dialogURL = '/rtks/knowledge/list';
        this.dialogTitle = this.$t('careerSystem.addKnowledge');
      } else if (type === '3') {
        this.dialogURL = '/rtks/skill/list';
        this.dialogTitle = this.$t('careerSystem.addSkill');
      } else if (type === '4') {
        this.dialogURL = '/rtks/ability/list';
        this.dialogTitle = this.$t('careerSystem.addAbility');
      }
      this.$refs.inventoryDialog.visibleDialog = true;
    },

    // 获取选择的清单
    getSelectedInventory(data) {
      let type = this.inventoryType;
      if (type === '1') {
        this.tableDataFilter('taskTableData', data);
      } else if (type === '2') {
        this.tableDataFilter('knowledgeTableData', data);
      } else if (type === '3') {
        this.tableDataFilter('skillTableData', data);
        _.forEach(this.skillTableData, (item) => {
          if (!item.weight) {
            this.$set(item, 'weight', 1);
          }
        });
      }
    },

    tableDataFilter(prop, data) {
      let list = this[prop];
      list = [...list, ...data];
      list = Utils.arrayRepeatItemFilter(list, 'resource_id');
      this[prop] = _.cloneDeep(list);
    },

    // 删除后的表格数据
    getAfterDeleteData(data, type) {
      if (type === '1') {
        this.taskTableData = _.cloneDeep(data);
      } else if (type === '2') {
        this.knowledgeTableData = _.cloneDeep(data);
      } else if (type === '3') {
        this.skillTableData = _.cloneDeep(data);
      }
    },

    getInventoryIds(data) {
      let ids = [];
      data.forEach((item) => {
        ids.push(item.resource_id);
      });
      return ids;
    },
    // 带权重的数据
    getInventoryIdWeights(data, keyId) {
      let idWeights = [];
      data.forEach((item) => {
        idWeights.push({
          [keyId]: item.resource_id,
          weight: item.weight,
        });
      });
      return idWeights;
    },
    fetchForm() {
      this.model.task_ids = this.getInventoryIds(this.taskTableData);
      this.model.knowledge_ids = this.getInventoryIds(this.knowledgeTableData);
      this.model.knowledge_id_weights = this.getInventoryIdWeights(
        this.knowledgeTableData,
        'id',
      );

      // this.model.knowledge_ids = this.getInventoryIds(this.knowledgeTableData);
      this.model.skill_id_weights = this.getInventoryIdWeights(
        this.skillTableData,
        'resource_id',
      );
      const model = _.cloneDeep(this.model);
      if (this.id) {
        const params = {
          ...model,
          resource_id: this.id,
        };
        return editFrameworkStation(params).then(() => {
          this.back();
        });
      } else {
        return addFrameworkStation(model).then(() => {
          this.back();
        });
      }
    },

    back() {
      this.$router.push({
        path: '/admin/course-mod/career-system/career-list',
      });
    },

    submitForm() {
      this.$refs.formRef.submit();
    },

    resetForm() {
      this.$router.push({
        path: '/admin/course-mod/career-system/career-list',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.form-item-row {
  display: flex;
  flex-direction: row;
}
</style>
