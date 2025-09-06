<template>
  <cb-dialog :visible.sync="visibleValue" height="450px" @close="goback()">
    <template slot="title">
      <div>{{ $t('careerSystem.taskList') }}</div>
    </template>
    <div>
      <cb-search-table
        ref="sdlRef"
        :cols="columns"
        baseURL="/api/ojj"
        url="/cr/admin/mission/mission_templates"
        row-key="resource_id"
        :data="query"
        :selector="tableSelector"
        :selection.sync="multipleSelection"
        :searchBarBg="false"
      >
        <template v-slot:search>
          <cb-select
            class="mr10"
            v-model="query.type"
            :options="sceneType"
            titleField="name"
            valueField="code"
            clearable
            :placeholder="$t('careerSystem.allTypes')"
          ></cb-select>
          <cb-select
            v-model="query.difficulty"
            :options="levelType"
            titleField="name"
            valueField="code"
            clearable
            :placeholder="$t('m.allDifficulty')"
          ></cb-select>
          <cb-search-input
            :placeholder="$t('m.inputName')"
            v-model="query.pattern"
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
      </cb-search-table>
    </div>
    <template slot="footer">
      <cb-button button-type="confirm" mr="mr" @click="savedata()"></cb-button>
      <cb-button button-type="cancel" @click="goback()"></cb-button>
    </template>
  </cb-dialog>
</template>

<script>
import {
  sceneType,
  TASK_DIFFICULTY,
  TASK_DIFFICULTY_LIST,
} from '../../constant.js';
export default {
  props: {
    sceneType: {
      type: Array,
      default: () => [],
    },
    levelType: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      TASK_DIFFICULTY,
      TASK_DIFFICULTY_LIST,
      sceneTypes: [],
      visibleValue: false,
      query: {
        pattern: '',
        type: '',
        difficulty: '',
      },
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
      },
      selector: {
        maxSelect: 0,
      },
      tableSelector: {},
      multipleSelection: [],
      columns: [
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
          prop: 'scene_type',
        },
        {
          title: this.$t('careerSystem.difficulty'),
          slot: 'difficulty',
        },
      ],
    };
  },
  computed: {},
  mounted() {},
  methods: {
    getSceneType(val) {
      const filterData = _.filter(this.sceneType, (item) => {
        return item.code === val;
      });
      if (filterData.length > 0) {
        return filterData[0].name;
      }
      return '';
    },
    getLevelColor(val) {
      const filterData = _.filter(this.levelType, (item) => {
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
      const filterData = _.filter(this.levelType, (item) => {
        return item.code === val;
      });
      if (filterData.length > 0) {
        return filterData[0].name;
      }
      return '';
    },
    savedata() {
      this.$emit('savevalue', this.multipleSelection);
      this.multipleSelection = [];
    },
    goback() {
      this.visibleValue = false;
      this.multipleSelection = [];
    },
  },
};
</script>

<style scoped lang="scss">
.cb-select {
  width: 50% !important;
}
.cb-search-input {
  width: 60% !important;
}
</style>
