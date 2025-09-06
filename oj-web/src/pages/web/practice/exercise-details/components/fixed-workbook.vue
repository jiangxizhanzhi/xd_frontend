<template>
  <div class="fixed-workbook">
    <div class="workbook-list-wrapper">
      <div class="workbook-name-wrapper one-overflow" :title="practiceSetName">
        {{ practiceSetName }}
      </div>
      <div class="workbook-search-wrapper">
        <cb-select
          v-model="list.category_id"
          :options="categoryLists"
          clearable
          :placeholder="$t('practice.allCategory')"
          titleField="name"
          valueField="resource_id"
          class="mr10"
          :first="{
            resource_id: '',
            name: $t('practice.allCategory'),
          }"
        ></cb-select>
        <cb-select
          v-model="list.difficulty"
          :options="difficultLists"
          clearable
          :placeholder="$t('practice.allDifficult')"
          titleField="name"
          valueField="code"
          class="mr10"
          :first="{
            code: '',
            name: $t('practice.allDifficult'),
          }"
        ></cb-select>
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
        <cb-select
          v-if="type === TYPE.Rationale"
          v-model="list.theory_type"
          :options="typeLists"
          clearable
          :placeholder="$t('practice.allQuestionType')"
          titleField="name"
          valueField="code"
          :first="{
            code: '',
            name: $t('practice.allQuestionType'),
          }"
        ></cb-select>
      </div>
      <div class="workbook-content-wrapper cyber-scroll-bar-small">
        <cb-search-table
          :cols="columns"
          :url="
            type === TYPE.Rationale
              ? '/oj/practice/theory/list'
              : '/oj/practice/operation/list'
          "
          baseURL="/api/ojj"
          :data="list"
          row-key="resource_id"
          :searchBarBg="false"
          :showLessItems="true"
          :showQuickJumper="false"
        >
          <!-- 点击题目名称跳转 -->
          <template v-slot:content="scope">
            <div
              type="text"
              style="cursor: pointer; padding-left: 8px"
              :title="scope.data.content"
              @click="toDetail(scope.data)"
              class="title-content one-overflow"
            >
              <cb-iconfont
                v-if="currentId === scope.data.resource_id"
                type="icon-gou"
                size="15"
                themedColor="green-color"
                style="position: absolute; left: 0"
              />
              <span
                v-if="type === TYPE.Rationale"
                class="green-box ft12"
                :class="{
                  'green-box': scope.data.solved === 1,
                  'orange-box': scope.data.solved === 0,
                  'gray-box': scope.data.solved === 2,
                }"
              >
                {{ statusComputed(statusLists, scope.data.solved) }}
              </span>
              <span
                v-else
                class="green-box ft12"
                :class="{
                  'green-box': scope.data.solved === true,
                  'gray-box': scope.data.solved === false,
                }"
              >
                {{ statusComputed(statusLists, scope.data.solved) }}
              </span>
              <!-- 单选:0,简答4,填空3,判断:2,多选:1 -->
              <template v-if="type === TYPE.Rationale">
                【{{ getName(typeLists, scope.data.theory_type, 'code') }}】
              </template>
              {{
                type === TYPE.Rationale ? scope.data.content : scope.data.title
              }}
            </div>
          </template>
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
    </div>
    <div ref="drawerRightAreaRef" class="drawer-right-area"></div>
  </div>
</template>
<script>
import { getComConstantsConfig } from '@/api/common.js';
import { getCategoryListsApi } from '@/api/practice.ts';
import { TYPE } from '../../constant';
export default {
  name: 'FixedWorkbook',
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    // 理论 or 实操
    type: {
      type: [String, Number],
      default: '',
    },
    // 习题集
    practiceSetName: {
      type: [String, Number],
      default: '',
    },
    // 习题集id
    practiceSetId: {
      type: [String, Number],
      default: '',
    },
    // 当前题号
    currentId: {
      type: [String, Number],
      default: '',
    },
    // 记录从哪来的
    recordFrom: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      TYPE,
      list: {
        category_id: '',
        difficulty: '',
        solved: '',
        theory_type: '',
        practice_set_id: this.practiceSetId,
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
          width: 120,
        },
        {
          label: this.$t('m.difficulty'),
          slot: 'difficulty',
          width: 80,
        },
      ],
    };
  },
  computed: {},

  mounted() {
    this.getDifficultList();
    this.getStatusList();
    if (this.type === TYPE.Rationale) {
      this.getTopicType();
    }
    this.getCategoryLists();
    window.addEventListener('mousedown', (e) => this.closeFixedWork(e));
  },
  beforeDestroy() {
    window.removeEventListener('mousedown', this.closeFixedWork());
  },
  methods: {
    closeFixedWork(e) {
      if (this.isShow && e && e.target) {
        const clickedEl = e.target;
        const el = this.$refs.drawerRightAreaRef;
        if (el && el.contains(clickedEl)) {
          this.$emit('hide');
        }
      }
    },
    toDetail(row) {
      if (this.type === TYPE.Rationale) {
        this.$router.push({
          path: `/practice/rationale/exercise-details/${row.resource_id}`,
          query: {
            practice_set_id: this.practiceSetId,
            from: this.recordFrom,
          },
        });
      } else {
        this.$router.push({
          path: `/practice/capture-flag/exercise-details/${row.resource_id}`,
          query: {
            practice_set_id: this.practiceSetId,
            from: this.recordFrom,
          },
        });
      }
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
        practice_type: this.type,
        practice_set_id: this.practiceSetId,
      }).then((res) => {
        const newData = _.get(res, 'data.data');
        this.categoryLists = newData;
      });
    },
    getDifficultList() {
      // 理论实操都传10
      getComConstantsConfig({ type: 10 }).then((res) => {
        let arr = res.data.data;
        this.difficultLists = arr;
      });
    },
    getStatusList() {
      getComConstantsConfig({
        type: this.type === TYPE.Rationale ? 39 : 11,
      }).then((res) => {
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
.fixed-workbook {
  width: 100%;
  height: 100%;
  background: var(--mask-color);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 222;
  display: flex;
  .workbook-list-wrapper {
    width: 640px;
    height: 100%;
    background: var(--bg-color-2);
    box-shadow: 6px 0px 20px 0px var(--box-shadow-color);
    padding: 16px;
  }
  .drawer-right-area {
    width: calc(100% - 640px);
    height: 100%;
  }
  .workbook-name-wrapper {
    font-size: 20px;
    font-weight: 600;
    color: var(--neutral8);
    line-height: 28px;
    margin: 16px 0 24px 0;
    text-align: center;
  }
  .workbook-search-wrapper {
    display: flex;
  }
  .workbook-content-wrapper {
    margin-top: 16px;
    height: calc(100% - 116px);
    overflow: auto;
  }
}
</style>
