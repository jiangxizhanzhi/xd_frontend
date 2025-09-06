<template>
  <cb-dialog
    :title="$t('careerSystem.courseList')"
    center
    :visible.sync="visibleDialog"
    height="480px"
  >
    <cb-search-table
      ref="tableRef"
      url="/oj/admin/course/all/list"
      baseURL="/api/ojj"
      :cols="columns"
      :data="query"
      :selector="tableSelector"
      :selection.sync="multipleSelection"
      row-key="resource_id"
      :searchBarBg="false"
    >
      <template v-slot:search>
        <!-- <cb-select
          v-model="query.EBook"
          :options="ebookList"
          clearable
          :placeholder="$t('careerSystem.allTypes')"
        ></cb-select> -->
        <cb-select
          v-model="query.direction"
          :options="directionList"
          clearable
          :placeholder="$t('careerSystem.allTheDirection')"
        ></cb-select>
        <cb-select
          v-model="query.difficulty"
          :options="difficultyList"
          clearable
          :placeholder="$t('careerSystem.allTheDifficulty')"
        ></cb-select>
        <cb-search-input
          style="width: auto"
          v-model="query.pattern"
          :placeholder="$t('careerSystem.enterName')"
          clearable
        ></cb-search-input>
      </template>
      <template v-slot:difficulty="scope">
        <!-- <span
          v-if="scope.data.difficulty === 0"
          class="lower"
        >
          {{ $t('careerSystem.primary') }}
        </span>
        <span
          v-else-if="scope.data.difficulty === 1"
          class="middle"
        >
          {{ $t('careerSystem.middle') }}
        </span>
        <span
          v-else
          class="high"
        >
          {{ $t('careerSystem.advanced') }}
        </span> -->
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
    </cb-search-table>
    <div slot="footer" class="dialog-footer">
      <cb-button-group>
        <cb-button
          button-type="confirm"
          @click="dialogConfirm(multipleSelection)"
        ></cb-button>
        <cb-button button-type="cancel" @click="dialogCancel()"></cb-button>
      </cb-button-group>
    </div>
  </cb-dialog>
</template>

<script>
import { getDirectionList } from '@/api/career-framework';
export default {
  name: 'CoursesListDialog',
  data() {
    return {
      visibleDialog: false,
      query: {
        EBook: '',
        direction: '',
        difficulty: '',
        pattern: '',
      },
      tableSelector: {
        maxSelect: 0,
      },
      multipleSelection: [],
      // 难度分类数据
      difficultyList: [],
      columns: [
        {
          label: this.$t('careerSystem.name'),
          prop: 'name',
        },
        // {
        //   label: this.$t('careerSystem.type'),
        //   getData: (row) => {
        //     const { ebook } = row;
        //     if (ebook === 0) {
        //       return this.$t('careerSystem.basics');
        //     } else if (ebook === 2) {
        //       return this.$t('careerSystem.attack');
        //     } else if (ebook === 3) {
        //       return this.$t('careerSystem.defense');
        //     }
        //   },
        // },
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
      ],
      ebookList: [
        {
          label: this.$t('careerSystem.basics'),
          value: 0,
        },
        {
          label: this.$t('careerSystem.attack'),
          value: 2,
        },
        {
          label: this.$t('careerSystem.defense'),
          value: 3,
        },
      ],
      // difficultyList: [
      //   {
      //     label: this.$t('careerSystem.primary'),
      //     value: 0,
      //   },
      //   {
      //     label: this.$t('careerSystem.middle'),
      //     value: 1,
      //   },
      //   {
      //     label: this.$t('careerSystem.advanced'),
      //     value: 2,
      //   },
      // ],
      directionList: [],
    };
  },
  mounted() {
    this.getDirection();
    this.getDifficultyOptions();
  },
  methods: {
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
    // 表格难度列表数据计算
    computedDiffculty(difficulty) {
      const data = this.difficultyList.filter(
        (item) => item.value === difficulty,
      );
      if (data.length) {
        return data[0].label;
      }
    },
    closeDialog() {
      this.visibleDialog = false;
      this.multipleSelection = [];
      Object.keys(this.query).forEach((key) => (this.query[key] = ''));
    },
    dialogConfirm(data) {
      this.$emit('selectCourses', data);
      this.closeDialog();
    },
    dialogCancel() {
      this.closeDialog();
    },
  },
};
</script>

<style></style>
