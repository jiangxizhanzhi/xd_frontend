<template>
  <cb-search-table
    :scroll="{ y: 480 }"
    :cols="columns"
    :selector="selector"
    :selection.sync="selection"
    ref="jobTableRef"
    :hidePaginOnDemand="true"
    :data-source="dataSource"
    :searchBarBg="false"
  >
    <template v-slot:weight="scope">
      <cb-input-number
        v-model="scope.data.weight"
        :min="0"
        :max="9"
        :label="$t('careerSystem.careerSystemAdd')"
      ></cb-input-number>
    </template>
    <template v-slot:search>
      <cb-button button-type="add" @click="add"></cb-button>
      <cb-button
        button-type="delete"
        hollow
        @click="deleteSelected(selection, $event)"
        :disabled="selection.length === 0"
      ></cb-button>
    </template>
  </cb-search-table>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'InventoryTable',
  props: {
    dataSource: {
      type: Array,
      default() {
        return [];
      },
    },
    type: {
      type: String,
      default: '1',
    },
  },
  data() {
    return {
      selector: {
        maxSelect: 0,
      },
      selection: [],
      columns: [
        {
          label: this.$t('careerSystem.number'),
          prop: 'resource_id',
        },
        {
          label: this.$t('careerSystem.content'),
          prop: 'content',
        },
      ],
      dialogTitle: '',
      dialogURL: '',
    };
  },
  mounted() {
    if (this.type === '2' || this.type === '3') {
      let item = {
        label: this.$t('careerSystem.weight'),
        slot: 'weight',
      };
      this.columns.push(item);
    }
    if (this.type === '2') {
      let item = {
        label: this.$t('careerSystem.relevantCourses'),
        getData: (data) => {
          return data.course_list.length;
        },
      };
      this.columns.push(item);
    }
    if (this.type === '3') {
      let item = {
        label: this.$t('careerSystem.relevantTask'),
        getData: (data) => {
          return (data.missions && data.missions.length) || data.mission_count;
        },
      };
      this.columns.push(item);
    }
  },
  methods: {
    // 无接口删除表格数据
    deleteSelected(selection, done) {
      let list = _.cloneDeep(this.dataSource);
      list = this.deleteSubItem(selection, list, 'resource_id');
      this.$emit('afterDelete', list, this.type);
      done();
      this.selection = [];
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
    // 新增
    add() {
      this.$emit('addInventory', this.type);
    },
  },
};
</script>

<style></style>
