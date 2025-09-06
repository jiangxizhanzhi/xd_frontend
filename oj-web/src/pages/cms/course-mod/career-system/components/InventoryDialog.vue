<template>
  <cb-dialog :title="dialogTitle" center :visible.sync="visibleDialog">
    <cb-search-table
      :scroll="{ y: 400 }"
      ref="tableRef"
      :url="dialogURL"
      :baseURL="baseURL"
      :cols="columns"
      :data="model"
      :selector="selector"
      :selection.sync="selection"
      row-key="resource_id"
      :searchBarBg="false"
    >
      <template v-slot:search>
        <cb-search-input
          v-model="model.pattern"
          :placeholder="$t('careerSystem.plzEnterKeywords')"
        ></cb-search-input>
      </template>
    </cb-search-table>
    <div slot="footer" class="dialog-footer">
      <cb-button-group>
        <cb-button
          button-type="confirm"
          @click="dialogConfirm(selection)"
        ></cb-button>
        <cb-button button-type="cancel" @click="dialogCancel()"></cb-button>
      </cb-button-group>
    </div>
  </cb-dialog>
</template>

<script>
import {} from '@/api/career-framework';
export default {
  name: 'CoursesListDialog',
  props: {
    dialogTitle: {
      type: String,
      default: '',
    },
    dialogURL: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '1',
    },
  },
  data() {
    return {
      visibleDialog: false,
      baseURL: '/api/ojj',
      model: {
        pattern: '',
      },
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
    };
  },
  watch: {
    type: function (n, o) {
      if (n === '2') {
        this.columns = [
          {
            label: this.$t('careerSystem.number'),
            prop: 'resource_id',
          },
          {
            label: this.$t('careerSystem.content'),
            prop: 'content',
          },
          {
            label: this.$t('careerSystem.relevantCourses'),
            getData: (data) => {
              return data.course_list ? data.course_list.length : 0;
            },
          },
        ];
      } else if (n === '3') {
        this.columns = [
          {
            label: this.$t('careerSystem.number'),
            prop: 'resource_id',
          },
          {
            label: this.$t('careerSystem.content'),
            prop: 'content',
          },
          {
            label: this.$t('careerSystem.relevantTask'),
            getData: (data) => {
              return data.missions ? data.missions.length : 0;
            },
          },
        ];
      } else {
        this.columns = [
          {
            label: this.$t('careerSystem.number'),
            prop: 'resource_id',
          },
          {
            label: this.$t('careerSystem.content'),
            prop: 'content',
          },
        ];
      }
    },
  },
  methods: {
    closeDialog() {
      this.visibleDialog = false;
      this.selection = [];
      Object.keys(this.model).forEach((key) => (this.model[key] = ''));
    },
    dialogConfirm(data) {
      this.$emit('selectedInventory', data);
      this.closeDialog();
    },
    dialogCancel() {
      this.closeDialog();
    },
  },
};
</script>

<style></style>
