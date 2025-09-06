<template>
  <cb-inner-page :background="false">
    <cb-search-table
      ref="sdlRef"
      baseURL="/api/ojj"
      url="/rtks/skill-category/list"
      :cols="columns"
      :data="query"
      :selector="tableSelector"
      :selection.sync="multipleSelection"
      row-key="resource_id"
    >
      <template v-slot:search>
        <cb-button-group>
          <cb-button button-type="add" @click="addCareer"></cb-button>
          <cb-button
            buttonType="delete"
            :disabled="multipleSelection.length === 0"
            @click="deleteCareer(multipleSelection, $event)"
          ></cb-button>
        </cb-button-group>
      </template>
      <template v-slot:filter>
        <cb-search-input
          :placeholder="$t('careerSystem.plzEnterKeywords')"
          v-model="query.pattern"
        ></cb-search-input>
      </template>
      <template v-slot:content="scope"
        ><span>{{ scope.data.content || '-' }}</span></template
      >
      <template v-slot:isOpeator="scope">
        <cb-button-group>
          <cb-button
            button-type="edit"
            type="text"
            @click="edit(scope.data)"
          ></cb-button>
        </cb-button-group>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>
<script>
import { deleSkillCategory } from '@/api/career-skill';
export default {
  components: {},
  data() {
    return {
      baseURL: '',
      tableData: [],
      query: {
        pattern: '',
      },
      pagination: {
        current_page: 1,
        total: 1,
        per_page: 10,
      },
      multipleSelection: [],
    };
  },
  created() {
    this.tableSelector = {
      maxSelect: 0,
    };
    this.columns = [
      {
        label: this.$t('m.name'),
        slot: 'content',
      },
      {
        label: this.$t('m.operation'),
        slot: 'isOpeator',
        width: 220,
      },
    ];
  },
  mounted() {},
  methods: {
    addCareer() {
      this.$router.push({
        name: 'skill-category-add',
      });
    },
    // 删除
    deleteCareer(data, done) {
      const that = this;
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      const params = {
        ids: [...ids],
      };
      deleSkillCategory(params)
        .then(() => {
          done();
          that.multipleSelection = [];
          that.$refs.sdlRef.reload();
        })
        .catch((error) => {
          this.$serverError(error);
          done(false);
        });
    },
    edit(row) {
      this.$router.push({
        name: 'skill-category-edit',
        params: {
          systemId: row.resource_id,
        },
      });
    },
  },
};
</script>
