<template>
  <cb-inner-page :background="false">
    <div class="theory-record-wrapper">
      <cb-search-table
        :cols="columns"
        url="/oj/practice/theory/record_page"
        baseURL="/api/ojj"
        :data="list"
        row-key="resource_id"
        :searchBarBg="false"
      >
        <template v-slot:search>
          <cb-select
            v-model="list.solved"
            :options="statusLists"
            clearable
            :placeholder="$t('practice.allStatus')"
            titleField="name"
            valueField="code"
            class="mr10"
            :first="{
              code: '',
              name: $t('practice.allStatus'),
            }"
          ></cb-select>
          <cb-date-picker
            v-model="timeQuantum"
            type="daterange"
            align="right"
            unlink-panels
            :range-separator="$t('scene.To')"
            :start-placeholder="$t('m.starttime')"
            :end-placeholder="$t('m.endtime')"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
          >
          </cb-date-picker>
        </template>
        <!-- 点击题目名称跳转 -->
        <template v-slot:content="scope">
          <div
            type="text"
            style="cursor: pointer"
            :title="scope.data.content"
            @click="toDetail(scope.data)"
            class="title-content one-overflow"
          >
            <span
              class="green-box ft12"
              :class="{
                'green-box': scope.data.solved === 1,
                'orange-box': scope.data.solved === 0,
                'gray-box': scope.data.solved === 2,
              }"
            >
              {{ statusComputed(statusLists, scope.data.solved) }}
            </span>
            <!-- 单选:0,简答4,填空3,判断:2,多选:1 -->
            【{{ getName(typeLists, scope.data.theory_type, 'code') }}】
            {{ scope.data.content }}
          </div>
        </template>
        <!-- 方向 -->
        <template v-slot:category="scope">
          <div
            class="category-content-com one-overflow"
            :title="
              scope.data.category_id &&
              getName(categoryLists, scope.data.category_id, 'resource_id')
            "
          >
            {{
              scope.data.category_id &&
              getName(categoryLists, scope.data.category_id, 'resource_id')
            }}
          </div>
        </template>
        <!-- 难度 -->
        <template v-slot:difficulty="scope">
          <span
            :class="{
              lower: scope.data.difficulty % 3 === 0,
              middle: scope.data.difficulty % 3 === 1,
              high: scope.data.difficulty % 3 === 2,
            }"
          >
            {{ getName(difficultLists, scope.data.difficulty, 'code') }}
          </span>
        </template>
      </cb-search-table>
    </div>
  </cb-inner-page>
</template>
<script>
import { getComConstantsConfig } from '@/api/common.js';
import { getCategoryListsApi } from '@/api/practice.ts';
import { TYPE } from '../constant';
export default {
  name: 'TheoryRecord',
  data() {
    return {
      TYPE,
      list: {
        solved: '',
        startTime: '',
        endTime: '',
      },
      categoryLists: [], // 方向数据
      difficultLists: [], // 难度分类数据
      statusLists: [], // 状态数据
      typeLists: [], //题目类型数据
      columns: [
        {
          label: this.$t('m.practiceTable.questionTitle'),
          slot: 'content',
        },

        {
          label: this.$t('m.category'),
          slot: 'category',
          width: 150,
        },

        {
          label: this.$t('m.practiceTable.practiceSet'),
          prop: 'practice_set_name',
          width: 150,
        },
        {
          label: this.$t('m.difficulty'),
          slot: 'difficulty',
          width: 100,
        },
        {
          label: this.$t('practice.time'),
          prop: 'update_time',
          sorter: 'updateTime',
          width: 155,
        },
      ],
      timeQuantum: '',
      pickerOptions: {
        disabledDate(time) {
          // 设置禁用状态，参数为当前日期，要求返回 Boolean
          return time.getTime() > Date.now();
        },
      },
    };
  },
  watch: {
    timeQuantum: {
      handler(nv, ov) {
        if (nv) {
          this.list.startTime = _.get(nv, '[0]', '');
          this.list.endTime = _.get(nv, '[1]', '');
        } else {
          this.list.startTime = '';
          this.list.endTime = '';
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getDifficultList();
    this.getStatusList();
    this.getTopicType();
    this.getCategoryLists();
  },
  mounted() {},
  methods: {
    toDetail(row) {
      this.$router.push({
        path: `/practice/rationale/exercise-details/${row.resource_id}`,
        query: {
          from: 'record',
        },
      });
    },
    getName(list, id, key) {
      const data = list.filter((item) => item[key] === id);
      return data.length && data[0].name;
    },
    // 列表状态计算
    statusComputed(list, id) {
      const data = list.filter((item) => item.code === Number(id));
      if (data.length) {
        return data[0].name;
      }
    },
    getCategoryLists() {
      // 分类类型 0=理论基础 2=实践操作
      getCategoryListsApi({
        practice_type: TYPE.Rationale,
      }).then((res) => {
        const newData = _.get(res, 'data.data');
        this.categoryLists = newData;
      });
    },
    getDifficultList() {
      getComConstantsConfig({ type: 10 }).then((res) => {
        let arr = res.data.data;
        this.difficultLists = arr;
      });
    },
    getStatusList() {
      getComConstantsConfig({ type: 39 }).then((res) => {
        let arr = res.data.data;
        this.statusLists = arr;
      });
    },
    getTopicType() {
      getComConstantsConfig({ type: 21 }).then((res) => {
        let arr = res.data.data;
        this.typeLists = arr;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.theory-record-wrapper {
  padding: 16px;
  background: var(--bg-color-2);
}
</style>
<style scoped></style>
