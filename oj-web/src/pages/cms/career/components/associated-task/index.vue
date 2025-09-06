<template>
  <cb-inner-page :background="false">
    <div class="att-name-group">
      <div class="att-name-group-inner">
        <span style="margin-right: 30px"
          >{{ $t('attEngage.stage') }}：{{ category_name }}</span
        >
        <span style="margin-right: 30px"
          >{{ $t('attEngage.technology') }}：{{ sub_category_name }}</span
        >
        <span v-if="name">{{ $t('attEngage.subTechnology') }}：{{ name }}</span>
      </div>
    </div>
    <div style="margin-top: 28px">
      <cb-search-table
        :scroll="{ y: 480 }"
        :cols="columns"
        :selector="selector"
        :selection.sync="selection"
        :hidePaginOnDemand="true"
        row-key="resource_id"
        :data-source="tableData"
        :searchBarBg="true"
      >
        <template v-slot:search>
          <cb-button button-type="add" @click="openDialog"></cb-button>
          <cb-button
            button-type="delete"
            hollow
            @click="deleteSelected(selection, $event)"
            :disabled="selection.length === 0"
          ></cb-button>
        </template>
        <template v-slot:filter>
          <cb-select
            v-model="model.type"
            :options="typeList"
            clearable
            :placeholder="$t('attEngage.allType')"
          ></cb-select>
          <cb-select
            v-model="model.difficulty"
            :options="difficultyList"
            clearable
            :placeholder="$t('attEngage.allDifficulty')"
          ></cb-select>
          <cb-search-input
            style="width: 200px"
            v-model="model.name"
            clearable
            :placeholder="$t('attEngage.enterName')"
          ></cb-search-input>
        </template>
        <template v-slot:difficulty="scope">
          <div>
            <span v-if="scope.data.difficulty % 3 === 1">{{
              computedDifficulty(scope.data.difficulty)
            }}</span>
            <span v-if="scope.data.difficulty % 3 === 2">{{
              computedDifficulty(scope.data.difficulty)
            }}</span>
            <span v-if="scope.data.difficulty % 3 === 0">{{
              computedDifficulty(scope.data.difficulty)
            }}</span>
          </div>
        </template>
      </cb-search-table>
      <div class="form-button-bar" style="margin-top: 20px">
        <cb-button-group space="middle">
          <cb-button buttonType="confirm" @click="submitEvent"></cb-button>
          <cb-button button-type="cancel" @click="cancelEvent"></cb-button>
        </cb-button-group>
      </div>
    </div>
    <cb-dialog
      :title="$t('attEngage.sceneList')"
      :visible.sync="sceneDialogVisible"
      center="center"
      height="480px"
    >
      <cb-search-table
        :cols="sceneColumns"
        baseURL="/api/ojj"
        url="/admin/ceBase/crEvents/list/simple"
        :data="query"
        :selector="sceneTableSelector"
        :selection.sync="sceneSelection"
        row-key="resource_id"
        :searchBarBg="false"
      >
        <template v-slot:search>
          <cb-select
            v-model="query.type"
            :options="typeList"
            clearable
            :placeholder="$t('attEngage.allType')"
          ></cb-select>
          <cb-select
            v-model="query.difficulty"
            :options="difficultyList"
            clearable
            :placeholder="$t('attEngage.allDifficulty')"
          ></cb-select>
          <cb-search-input
            v-model="query.pattern"
            :placeholder="$t('attEngage.enterName')"
            clearable
          ></cb-search-input>
        </template>

        <template v-slot:difficulty="scope">
          <div>
            <span v-if="scope.data.difficulty % 3 === 1">{{
              computedDifficulty(scope.data.difficulty)
            }}</span>
            <span v-if="scope.data.difficulty % 3 === 2">{{
              computedDifficulty(scope.data.difficulty)
            }}</span>
            <span v-if="scope.data.difficulty % 3 === 0">{{
              computedDifficulty(scope.data.difficulty)
            }}</span>
          </div>
        </template>
      </cb-search-table>
      <template slot="footer">
        <cb-button
          button-type="confirm"
          mr="mr"
          @click="saveData()"
        ></cb-button>
        <cb-button button-type="cancel" @click="closeDialog()"></cb-button>
      </template>
    </cb-dialog>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import {
  getAttCkDetailList,
  getAttCkIcsDetailList,
  postAttCkDetailList,
  postAttCkIcsDetailList,
  getEngageDetailList,
  postEngageDetailList,
} from '@/api/career-att-engage';
import Utils from '@/utils/utils';
export default {
  name: 'associated-task',
  data() {
    return {
      type: this.$route.query.type,
      attckType: this.$route.query.attckType,
      resource_id: '',
      category_name: '',
      sub_category_name: '',
      name: '',
      type: '',
      selector: {
        maxSelect: 0,
      },
      selection: [],
      url: '',
      baseURL: '',
      model: {
        type: '',
        difficulty: '',
        name: '',
      },
      tableData: [],
      columns: [
        {
          label: this.$t('attEngage.sceneName'),
          prop: 'name',
        },
        {
          label: this.$t('attEngage.sceneType'),
          getData: (row) => {
            let type = row.type;
            if (type === 1) {
              return this.$t('attEngage.individual');
            } else if (type === 3) {
              return this.$t('attEngage.team');
            } else if (type === 4) {
              return this.$t('attEngage.cyberWargame');
            }
          },
        },
        {
          label: this.$t('attEngage.difficulty'),
          slot: 'difficulty',
        },
      ],
      typeList: [
        {
          label: this.$t('attEngage.allType'),
          value: '',
        },
        {
          label: this.$t('attEngage.individual'),
          value: 1,
        },
        {
          label: this.$t('attEngage.team'),
          value: 3,
        },
        {
          label: this.$t('attEngage.cyberWargame'),
          value: 4,
        },
      ],
      difficultyList: [],
      sceneDialogVisible: false,
      sceneColumns: [
        {
          label: this.$t('attEngage.sceneName'),
          prop: 'name',
        },
        {
          label: this.$t('attEngage.sceneType'),
          getData: (row) => {
            let type = row.type;
            if (type === 1) {
              return this.$t('attEngage.individual');
            } else if (type === 3) {
              return this.$t('attEngage.team');
            } else {
              return this.$t('attEngage.cyberWargame');
            }
          },
        },
        {
          label: this.$t('attEngage.difficulty'),
          slot: 'difficulty',
        },
      ],
      query: {
        type: '',
        difficulty: '',
        pattern: '',
      },
      sceneTableSelector: { maxSelect: 0 },
      sceneSelection: [],
    };
  },
  mounted() {
    this.type = this.$route.query.type;
    this.attckType = this.$route.query.attckType;
    this.resource_id = this.$route.query.resource_id;
    this.getDifficultyOptions();
    if (this.type === '1') {
      // att&ck
      if (this.attckType === 'enterprise') {
        this.getAttCkDetail(this.resource_id);
      }
      if (this.attckType === 'ics') {
        this.getAttCkIcsDetail(this.resource_id);
      }
    } else if (this.type === '2') {
      // engage
      this.getEngageDetail(this.resource_id);
    }
  },
  watch: {
    model: {
      handler(modelList) {
        const tableData = _.cloneDeep(this.tableDataCopy);
        this.tableData = Utils.conditionFilterData(modelList, tableData);
      },
      deep: true,
    },
  },
  methods: {
    // 获取att&ck子技术详情列表
    getAttCkDetail(id) {
      getAttCkDetailList({ resource_id: id }).then((res) => {
        const data = _.get(res, 'data.data', null) || null;
        if (data) {
          this.category_name = data.category_name;
          this.sub_category_name = data.name;
          this.name = '';
          this.tableData = data.templates;
          this.tableDataCopy = data.templates;
        }
      });
    },
    // 获取ics子技术详情
    getAttCkIcsDetail(id) {
      getAttCkIcsDetailList({ resource_id: id }).then((res) => {
        const data = _.get(res, 'data.data', null) || null;
        if (data) {
          this.category_name = data.category_name;
          this.sub_category_name = data.name;
          this.name = '';
          this.tableData = data.templates;
          this.tableDataCopy = data.templates;
        }
      });
    },
    // 获取engage子技术详情列表
    getEngageDetail(id) {
      getEngageDetailList({ resource_id: id }).then((res) => {
        const data = _.get(res, 'data.data', null) || null;
        if (data) {
          this.category_name = data.category_name;
          this.sub_category_name = data.sub_category_name;
          this.name = data.name;
          this.tableData = data.templates;
          this.tableDataCopy = data.templates;
        }
      });
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
    // 删除
    deleteSelected(selection, done) {
      this.tableData = this.deleteSubItem(
        selection,
        this.tableDataCopy,
        'resource_id',
      );
      done();
      this.selection = [];
      Object.keys(this.model).forEach((key) => {
        this.model[key] = '';
      });
    },
    // 打开弹框
    openDialog() {
      this.sceneDialogVisible = true;
      Object.keys(this.model).forEach((key) => {
        this.model[key] = '';
      });
    },
    // 点击弹框确定保存数据
    saveData() {
      let listNew = [];
      listNew = this.sceneSelection.map((item) => {
        return {
          resource_id: item.resource_id,
          difficulty: item.difficulty,
          name: item.name,
          type: item.type,
        };
      });
      let tableDataOrigin = this.tableData;

      tableDataOrigin = [...tableDataOrigin, ...listNew];
      // 去重
      tableDataOrigin = Utils.arrayRepeatItemFilter(
        tableDataOrigin,
        'resource_id',
      );
      this.tableData = _.cloneDeep(tableDataOrigin);
      this.tableDataCopy = _.cloneDeep(tableDataOrigin);
      this.closeDialog();
    },
    // 关闭弹框
    closeDialog() {
      this.sceneSelection = [];
      Object.keys(this.query).forEach((key) => (this.query[key] = ''));
      this.sceneDialogVisible = false;
    },
    // 关联场景
    submitEvent() {
      if (this.type === '1') {
        // att&ck
        const business_template_ids = [];
        this.tableDataCopy.forEach((item) => {
          business_template_ids.push(item.resource_id);
        });
        if (this.attckType === 'enterprise') {
          postAttCkDetailList({
            business_template_ids,
            resource_id: this.resource_id,
          }).then((res) => {
            this.$router.push({
              name: 'att-ck-frame',
            });
          });
        }
        if (this.attckType === 'ics') {
          postAttCkIcsDetailList({
            business_template_ids,
            resource_id: this.resource_id,
          }).then((res) => {
            this.$router.push({
              name: 'att-ck-frame',
            });
          });
        }
      } else if (this.type === '2') {
        // engage
        const business_template_ids = [];
        this.tableDataCopy.forEach((item) => {
          business_template_ids.push(item.resource_id);
        });
        postEngageDetailList({
          business_template_ids,
          resource_id: this.resource_id,
        }).then((res) => {
          this.$router.push({
            name: 'engage-frame',
          });
        });
      }
    },
    // 取消关联
    cancelEvent() {
      if (this.type === '1') {
        this.$router.push({
          name: 'att-ck-frame',
        });
      } else if (this.type === '2') {
        this.$router.push({
          name: 'engage-frame',
        });
      }
    },
    //获取难度列表
    getDifficultyOptions() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 23,
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
    //根据难度获取对应的标签
    computedDifficulty(difficulty) {
      const data = this.difficultyList.filter(
        (item) => item.value === difficulty,
      );
      if (data.length) {
        return data[0].label;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.att-name-group {
  position: relative;
  color: var(--primary-color);
  height: 20px;
  .att-name-group-inner {
    // position: absolute;
    height: 40px;
    background-color: var(--bg-color-2);
    // top: -20px;
    // left: 0;
    // right: 0;
    padding: 0 20px;
    display: flex;
    align-items: center;
  }
}
.difficulty-advanced {
  color: var(--red-color);
}
.difficulty-intermediate {
  color: var(--orange-color);
}
.difficulty-primary {
  color: var(--green-color);
}
</style>
