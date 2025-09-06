<template>
  <cb-inner-page :background="false">
    <cb-search-table
      ref="sdlRef"
      baseURL="/api/ojj"
      url="/rtks/skill/list"
      :cols.sync="columns"
      :data.sync="query"
      :selector="tableSelector"
      :selection.sync="multipleSelection"
      row-key="resource_id"
      :searchBarBg="true"
    >
      <template v-slot:search>
        <cb-button-group>
          <cb-button button-type="add" @click="addCareer"></cb-button>
          <cb-button
            buttonType="delete"
            hollow
            :disabled="multipleSelection.length === 0"
            @click="deleteCareer(multipleSelection, $event)"
          ></cb-button>
        </cb-button-group>
      </template>
      <template v-slot:filter>
        <cb-search-input
          :placeholder="$t('careerSystem.enterNumberOrContent')"
          v-model="query.pattern"
        ></cb-search-input>
      </template>

      <template v-slot:content="scope"
        ><span :title="scope.data.content || '-'">{{
          scope.data.content || '-'
        }}</span></template
      >
      <template v-slot:task="scope">
        <div v-if="scope.data.show">
          <div
            class="spanover"
            :title="k.title + '/' + k.scene_name"
            v-for="(k, i) in scope.data.missions"
            :key="i"
          >
            {{ k.title }}/{{ k.scene_name }}
          </div>
        </div>
        <div v-else>
          <div
            class="spanover"
            :title="k.title + '/' + k.scene_name"
            v-for="(k, i) in getTask(scope.data)"
            :key="i"
          >
            {{ k.title }}/{{ k.scene_name }}
          </div>
        </div>
        <cb-button
          v-if="scope.data.missions.length > 20 && !scope.data.show"
          @click="getAllTask(scope.data)"
          type="text"
          >{{ $t('careerSystem.seeMore') }}</cb-button
        >
        <cb-button
          v-if="scope.data.missions.length > 20 && scope.data.show"
          @click="hideTask(scope.data)"
          type="text"
          >{{ $t('careerSystem.close') }}</cb-button
        >
      </template>
      <template v-slot:isOpeator="scope">
        <cb-button
          button-type="edit"
          type="text"
          @click="edit(scope.data)"
        ></cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>
<script>
import { deleSkill } from '@/api/career-skill';
import _ from 'lodash';
export default {
  components: {},
  data() {
    return {
      taskId: '',
      isShow: true,
      tableData: [],
      query: {
        pattern: '',
      },
      value: '',

      pagination: {
        current_page: 1,
        total: 1,
        per_page: 10,
      },
      multipleSelection: [],
      courseList: [
        { index: '1', name: this.$t('careerSystem.mobileSecurity') },
        { index: '2', name: this.$t('careerSystem.databaseSecurity') },
        { index: '3', name: this.$t('careerSystem.mathInfoSecurity') },
        { index: '4', name: this.$t('careerSystem.digitalCertificate') },
      ],
      columns: [],
    };
  },
  created() {
    this.tableSelector = {
      maxSelect: 0,
    };
    this.columns = [
      {
        label: this.$t('careerSystem.number'),
        prop: 'resource_id',
        width: 120,
      },
      {
        label: this.$t('careerSystem.content'),
        slot: 'content',
        width: 350,
        prop: 'content',
        resizable: true,
      },
      {
        label: this.$t('careerSystem.relatedTask'),
        slot: 'task',
        width: 600,
        prop: 'relatedTask',
        resizable: true,
      },
      {
        label: this.$t('m.operation'),
        slot: 'isOpeator',
        width: 120,
      },
    ];
  },
  mounted() {},
  methods: {
    getAllTask(data) {
      this.$set(data, 'show', true);
    },
    hideTask(data) {
      this.$set(data, 'show', false);
    },
    getTask(data) {
      if (data.missions.length <= 20) {
        return data.missions;
      } else {
        return data.missions.slice(0, 20);
      }
    },
    addCareer() {
      this.$router.push({
        name: 'skill-database-add',
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
      deleSkill(params)
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
        name: 'skill-database-edit',
        params: {
          libraryId: row.resource_id,
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.spanover {
  color: var(--neutral8);
  /* width: 500px; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
label {
  color: var(--font-color-regular);
  font-size: 13px;
}
</style>
