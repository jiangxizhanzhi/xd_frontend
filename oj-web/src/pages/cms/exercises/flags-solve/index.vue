<template>
  <cb-inner-page :background="false">
    <div class="theory-content">
      <cb-search-table
        ref="flagesListRef"
        :baseURL="baseURL"
        :url="url"
        :record-ctg="$t('m.captureTheFlag')"
        :cols.sync="columns"
        :data.sync="query"
        :selector="tableSelector"
        :selection.sync="multipleSelection"
        row-key="resource_id"
      >
        <template v-slot:search>
          <cb-button mr="mr" buttonType="add" @click="push"></cb-button>
          <cb-button
            mr="mr"
            hollow
            :disabled="multipleSelection.length === 0"
            buttonType="delete"
            @click="deleteSelectedFlags(multipleSelection, $event)"
          ></cb-button>
          <cb-button
            mr="mr"
            hollow
            :disabled="multipleSelection.length === 0"
            :warnMsg="publicWarnMsg"
            :completeMsg="publicCompleteMsg"
            icon="icon-yulan"
            @click="toggleSelection(multipleSelection, $event)"
            ><span>{{ $t('m.public') }}</span></cb-button
          >
          <cb-button
            mr="mr"
            hollow
            :disabled="multipleSelection.length === 0"
            :warnMsg="hideWarnMsg"
            :completeMsg="hideCompleteMsg"
            icon="icon-yincang1"
            @click="close(multipleSelection, $event)"
            ><span>{{ $t('m.hide') }}</span></cb-button
          >
          <cb-button
            mr="mr"
            hollow
            :disabled="multipleSelection.length === 0"
            :warnMsg="publicProblemWarnMsg"
            :completeMsg="publicProblemCompleteMsg"
            icon="icon-yulan"
            @click="toPublicPractice(multipleSelection, $event)"
            >{{ $t('m.openProblem') }}</cb-button
          >
          <cb-button
            :disabled="multipleSelection.length === 0"
            hollow
            :warnMsg="hideProblemWarnMsg"
            :completeMsg="hideProblemCompleteMsg"
            icon="icon-yincang1"
            @click="toHidePractice(multipleSelection, $event)"
            >{{ $t('m.hiddenProblem') }}</cb-button
          >
        </template>
        <template v-slot:filter>
          <cb-select
            width="200px"
            v-model="knowledgeList"
            multiple
            collapse-tags
            popper-class="back-knowledge-point-multi-select"
            class="mr10 back-knowledge-select"
            :placeholder="$t('practice.knowledge')"
            clearable
          >
            <div>
              <div class="search-area cyber-scroll-bar-small">
                <div class="filter-area">
                  <cb-search-input
                    :placeholder="$t('practice.plzInputKnowledge')"
                    v-model="knowledgeFilter"
                    trigger="lazy"
                    clearable
                  ></cb-search-input>
                </div>
                <div class="options-content">
                  <template v-if="filterKnowledgeListOptions.length > 0">
                    <cb-option
                      class="options-content-item"
                      v-for="(item, index) in filterKnowledgeListOptions"
                      :key="index"
                      :label="
                        item.label.length > 6
                          ? item.label.slice(0, 6) + '...'
                          : item.label
                      "
                      :value="item.value"
                      :title="item.label"
                    ></cb-option>
                  </template>
                  <template v-else>
                    <div class="no-data">{{ $t('practice.noData') }}</div>
                  </template>
                </div>
              </div>
              <div class="reset-area">
                <cb-button
                  icon="icon-genghuan"
                  type="text"
                  id="reset"
                  @click="resetKnowledgeSelect"
                  >{{ $t('practice.reset') }}</cb-button
                >
              </div>
            </div>
          </cb-select>
          <cb-select
            v-model="query.practice_set_id"
            :options="practice_set_id"
            :first="{ name: $t('m.allProblem'), resource_id: '' }"
            title-field="name"
            value-field="resource_id"
          ></cb-select>
          <cb-select
            v-model="query.category_id"
            :options="category_id"
            title-field="name"
            value-field="resource_id"
            :first="{ name: $t('m.allTypes'), resource_id: '' }"
          >
          </cb-select>
          <cb-search-input
            v-model="query.pattern"
            :placeholder="$t('m.namePh')"
          ></cb-search-input>
        </template>
        <template v-slot:searchRightArea>
          <cb-button @click="toType" icon="icon-fangxiangguanli" hollow>{{
            $t('m.typeManage')
          }}</cb-button>
        </template>
        <template v-slot:scene_share_mode="scope">
          <div>
            <div class="div" v-if="scope.data.topo_id === null">
              {{ $t('m.noENV') }}
            </div>
            <cb-switch
              v-model="scope.data.scene_share_mode"
              v-if="
                scope.data.scene_share_mode !== null &&
                scope.data.topo_id !== null
              "
              @change="changeStatus(scope.data)"
              :active-value="2"
              :inactive-value="1"
            ></cb-switch>
            <div
              class="span"
              v-if="
                scope.data.scene_share_mode === SCENE_SHOW.SHARED &&
                scope.data.topo_id !== null
              "
            >
              {{ $t('m.shareIolation') }}
            </div>
            <div
              class="hidee"
              v-if="
                scope.data.scene_share_mode === SCENE_SHOW.PRIVATE &&
                scope.data.topo_id !== null
              "
            >
              {{ $t('m.privateIolation') }}
            </div>
          </div>
        </template>
        <template v-slot:writeup_public="scope">
          <div v-if="scope.data.writeup_public === true">
            {{ $t('m.public') }}
          </div>
          <div v-else>{{ $t('m.hide') }}</div>
        </template>
        <template v-slot:is_public="scope">
          <div v-if="scope.data.is_public === true">
            {{ $t('m.public') }}
          </div>
          <div v-else>{{ $t('m.hide') }}</div>
        </template>
        <template v-slot:knowledge_list="scope">
          <template
            v-if="scope.data.knowledge && scope.data.knowledge.length > 0"
          >
            <div class="knowledge-list">
              <template v-if="scope.data.knowledge.length < 3">
                <span
                  class="knowledge-list-item"
                  v-for="(item, index) in scope.data.knowledge"
                  :key="'knowledge-item' + index"
                >
                  <span v-if="item.length > 6" :title="item">
                    {{ item.slice(0, 6) + '...' }}
                  </span>
                  <span v-else :title="item">{{ item }}</span>
                </span>
              </template>
              <template v-else>
                <span class="knowledge-list-item">
                  <span
                    v-if="scope.data.knowledge[0].length > 6"
                    :title="scope.data.knowledge[0]"
                  >
                    {{ scope.data.knowledge[0].slice(0, 6) + '...' }}
                  </span>
                  <span v-else :title="scope.data.knowledge[0]">
                    {{ scope.data.knowledge[0] }}
                  </span>
                </span>
                <span class="knowledge-list-item">
                  <span
                    v-if="scope.data.knowledge[1].length > 6"
                    :title="scope.data.knowledge[1]"
                  >
                    {{ scope.data.knowledge[1].slice(0, 6) + '...' }}
                  </span>
                  <span v-else :title="scope.data.knowledge[1]">
                    {{ scope.data.knowledge[1] }}
                  </span>
                </span>
                <span
                  class="knowledge-list-item"
                  :title="
                    scope.data.knowledge
                      .slice(2, scope.data.knowledge.length)
                      .join(' ')
                  "
                  >...</span
                >
              </template>
            </div>
          </template>
          <template v-else>-</template>
        </template>
        <template v-slot:btn="scope">
          <cb-button
            mr="mr"
            type="text"
            button-type="edit"
            @click="edit(scope.data.resource_id)"
            >{{ $t('button.edit') }}</cb-button
          >
          <cb-button
            mr="mr"
            type="text"
            v-if="
              scope.data.topo_id !== null && scope.data.has_scene_data === false
            "
            @click="testScenes(scope.data)"
            >{{ $t('m.test') }}</cb-button
          >
          <cb-button
            type="text"
            v-if="
              scope.data.topo_id !== null && scope.data.has_scene_data === true
            "
            @click="testScenes(scope.data)"
          >
            <div class="custom-icon">
              <cb-iconfont class="jia-zai" type="icon-jiazai"></cb-iconfont>
              <span style="margin-left: 2px">{{ $t('m.testing') }}</span>
            </div>
          </cb-button>
        </template>
      </cb-search-table>
    </div>
    <cb-dialog
      width="60%"
      :title="$t('m.sceneTest')"
      :visible.sync="ScenesVisible"
      @close="refresh()"
      center="center"
    >
      <test-scenes-dialog
        v-if="ScenesVisible"
        :task-resource-id="taskResourceId"
        :share-mode="shareMode"
      ></test-scenes-dialog>
    </cb-dialog>
  </cb-inner-page>
</template>
<script>
import Http from '@/utils/http.js';
import CommonUtils from '@/utils/utils.js';
import { SCENE_SHOW } from '../exercise-constants.js';

import TestScenesDialog from '@/pages/cms/exercises/flags-solve/components/testScenes-dialog.vue';
import _ from 'lodash';
import { getLanguage } from '@cyber/helper';
import { getKnowledgeListCms } from '@/api/practice.ts';
export default {
  components: {
    TestScenesDialog,
  },
  data() {
    return {
      language: getLanguage(),
      SCENE_SHOW,
      baseURL: '/api/ojj',
      url: '/oj/admin/practice/operation/list/',
      taskResourceId: '',
      query: {
        knowledge: '',
        pattern: '',
        category_id: '',
        practice_set_id: '',
      },
      value: true,
      multipleSelection: [],
      tableData: [],
      pagination: {
        current_page: 1,
        per_page: 15,
        total: 0,
      },
      category_id: [],
      practice_set_id: [],
      addForm: {
        name: '',
        type: 0,
      },
      addFormRules: {},
      ScenesVisible: false,
      shareMode: 0,
      columns: [],
      knowledgeList: [], // 选中的知识点
      knowledgeFilter: '', // 知识点列表筛选条件
      knowledgeListOptions: [], // 所有知识点列表数据
    };
  },
  computed: {
    // 经过筛选的知识点列表数据
    filterKnowledgeListOptions() {
      return this.knowledgeFilter
        ? this.knowledgeListOptions.filter((item) => {
            return item.label.indexOf(this.knowledgeFilter) > -1;
          })
        : this.knowledgeListOptions;
    },
    publicWarnMsg() {
      const that = this;
      const recordCtg = that.$t('m.captureTheFlag');
      return CommonUtils.formatString(
        that.$t('common.confirmOvertMsg'),
        recordCtg,
      );
    },
    publicCompleteMsg() {
      const that = this;
      const recordCtg = that.$t('m.captureTheFlag');
      return CommonUtils.formatString(
        that.$t('common.overtSuccess'),
        recordCtg,
      );
    },
    hideWarnMsg() {
      const that = this;
      const recordCtg = that.$t('m.captureTheFlag');
      return CommonUtils.formatString(
        that.$t('common.confirmConcealMsg'),
        recordCtg,
      );
    },
    hideCompleteMsg() {
      const that = this;
      const recordCtg = that.$t('m.captureTheFlag');
      return CommonUtils.formatString(
        that.$t('common.concealSuccess'),
        recordCtg,
      );
    },
    publicProblemWarnMsg() {
      const that = this;
      return CommonUtils.formatString(that.$t('m.confirmTheSolution'));
    },
    publicProblemCompleteMsg() {
      const that = this;
      const recordCtg = that.$t('m.gameProblemSolution');
      return CommonUtils.formatString(
        that.$t('common.overtSuccess'),
        recordCtg,
      );
    },
    hideProblemWarnMsg() {
      const that = this;
      return CommonUtils.formatString(
        that.$t('m.confirmHiddenGameProblemSolutions'),
      );
    },
    hideProblemCompleteMsg() {
      const that = this;
      const recordCtg = that.$t('m.gameProblemSolution');
      return CommonUtils.formatString(
        that.$t('common.concealSuccess'),
        recordCtg,
      );
    },
  },
  watch: {
    knowledgeList: {
      handler(nv, ov) {
        this.query.knowledge = nv.join();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    const that = this;
    this.rationaleGuidData();
    this.exercisesGuidData();
    this.getLocalKnowledgeList(); // 获取知识点列表选项
    this.tableSelector = {
      maxSelect: 0,
    };
    this.columns = [
      {
        label: this.$t('m.practiceName'),
        prop: 'title',
        sorter: 'title',
        width: 150,
        resizable: true,
      },
      {
        label: this.$t('m.problemSet'),
        getData(row) {
          let practice_set_id = '';
          that.practice_set_id.forEach((item) => {
            if (item.resource_id === row.practice_set_id) {
              practice_set_id = item.name;
            }
          });
          return practice_set_id;
        },
        prop: 'problemSet',
        width: 100,
        resizable: true,
      },
      {
        label: this.$t('m.direction'),
        width: 100,
        getData(row) {
          let category_id = '';
          that.category_id.forEach((item) => {
            if (item.resource_id === row.category_id) {
              category_id = item.name;
            }
          });
          return category_id;
        },
      },
      {
        label: this.$t('m.iolationmode'),
        slot: 'scene_share_mode',
        width: this.language === 'en-US' ? 180 : 130,
      },
      {
        label: this.$t('m.gameProblemSolution'),
        slot: 'writeup_public',
        width: 100,
      },
      {
        label: this.$t('m.status'),
        slot: 'is_public',
        sorter: 'public',
        width: 80,
      },
      {
        label: this.$t('practice.knowledge'),
        slot: 'knowledge_list',
        width: 200,
      },
      {
        label: this.$t('m.creator'),
        prop: 'create_user_name',
        width: 80,
        resizable: true,
      },
      {
        label: this.$t('m.updateTime'),
        prop: 'update_time',
        sorter: 'update_time',
        width: 150,
        resizable: true,
      },
      {
        label: this.$t('m.operation'),
        slot: 'btn',
        width: 150,
      },
    ];
  },
  mounted() {
    if (this.query.knowledge) {
      this.knowledgeList = this.query.knowledge.split(',');
    }
  },
  methods: {
    // 动态环境选择接口
    changeStatus(row) {
      const that = this;
      that.$request
        .patch(
          '/oj/admin/practice/operation/scene_share_mode',
          {
            resource_id: row.resource_id,
            scene_share_mode: row.scene_share_mode,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          this.$refs.flagesListRef.reload({
            showLoading: false,
          });
        })
        .catch((e) => {
          this.$refs.flagesListRef.reload();
        });
    },
    testScenes(row) {
      this.taskResourceId = row.resource_id;
      this.shareMode = row.scene_share_mode;
      this.ScenesVisible = true;
    },
    refresh() {
      this.ScenesVisible = false;
      this.$refs.flagesListRef.reload();
    },
    // 方向管理跳转
    toType() {
      this.$router.push({ name: 'flags-to-type' });
    },
    // 新增夺旗解题
    push() {
      this.$router.push({ name: 'add-flags' });
    },
    // 修改夺旗解题
    edit(resource_id) {
      this.$router.push({
        name: 'edit-flags',
        params: {
          flagsId: resource_id,
        },
      });
    },
    // 理论基础-方向
    rationaleGuidData() {
      const that = this;
      that.$request
        .get(
          '/oj/admin/practice/category/list/?page=1&per_page=999&practice_type=2',
          {},
          { baseURL: '/api/ojj' },
        )
        .then((resp) => {
          const newData = _.get(resp, 'data.data.list');
          that.category_id = newData;
        });
    },
    // 理论基础-习题集类型
    exercisesGuidData() {
      const that = this;
      that.$request
        .get(
          '/oj/admin/practice/set/list/?page=1&per_page=999&practice_type=2',
          {},
          { baseURL: '/api/ojj' },
        )
        .then((resp) => {
          const newData = _.get(resp, 'data.data.list');
          that.practice_set_id = newData;
        });
    },
    // 公开提示
    toggleSelection(data, done) {
      const that = this;
      const resource_ids = [];
      if (data && data.length) {
        data.map((item) => resource_ids.push(item.resource_id));
      } else {
        resource_ids.push(data.resource_id);
      }
      that.$request
        .patch(
          '/oj/admin/practice/operation/batch-public',
          {
            resource_ids,
            is_public: 1,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          done();
          that.multipleSelection = [];
          that.$refs.flagesListRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    // 隐藏提示
    close(data, done) {
      const that = this;
      const resource_ids = [];
      if (data && data.length) {
        data.map((item) => resource_ids.push(item.resource_id));
      } else {
        resource_ids.push(data.resource_id);
      }
      that.$request
        .patch(
          '/oj/admin/practice/operation/batch-public',
          {
            resource_ids,
            is_public: 0,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          done();
          that.multipleSelection = [];
          that.$refs.flagesListRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    // 赛题公开操作
    toPublicPractice(data, done) {
      const that = this;
      const resource_ids = [];
      let num = 1;
      if (data.length > 0) {
        const validSelection = _.filter(data, ['writeup_public', false]);
        data.forEach((item) => {
          if (item.writeup_public !== true) {
            num = 1;
          }
          resource_ids.push(item.resource_id);
        });
        that.$request
          .patch(
            '/oj/admin/practice/operation/writeup_public',
            {
              resource_ids,
              is_public: 1,
            },
            {
              baseURL: '/api/ojj',
            },
          )
          .then(() => {
            this.$refs.flagesListRef.reload();
            this.multipleSelection = [];
            done();
          })
          .catch((err) => {
            this.$serverError(err);
            done(false);
          });
      }
    },
    // 赛题隐藏操作
    toHidePractice(data, done) {
      const that = this;
      const resource_ids = [];
      let num = 0;
      if (data.length > 0) {
        data.forEach((item) => {
          if (item.writeup_public !== false) {
            num = 0;
          }
          resource_ids.push(item.resource_id);
        });
        that.$request
          .patch(
            '/oj/admin/practice/operation/writeup_public',
            {
              resource_ids,
              is_public: 0,
            },
            {
              baseURL: '/api/ojj',
            },
          )
          .then(() => {
            this.$refs.flagesListRef.reload();
            this.multipleSelection = [];
            done();
          })
          .catch(() => {
            done(false);
          });
      }
    },
    // 删除操作
    deleteSelectedFlags(data, done) {
      const that = this;
      const resource_ids = [];
      if (data && data.length) {
        data.map((item) => resource_ids.push(item.resource_id));
      } else {
        resource_ids.push(data.resource_id);
      }
      that.$request
        .delete(
          '/oj/admin/practice/operation',
          { resource_ids },
          { baseURL: '/api/ojj' },
        )
        .then(() => {
          done();
          that.multipleSelection = [];
          that.$refs.flagesListRef.reload();
        })
        .catch((err) => {
          that.$serverError(err);
          done(false);
        });
    },
    // 获取知识点列表数据，用于select的options选项
    getLocalKnowledgeList() {
      getKnowledgeListCms().then((res) => {
        const tempData = _.get(res, 'data.data', []) || [];
        this.knowledgeListOptions = tempData.map((item) => {
          return {
            label: item,
            value: item,
          };
        });
      });
    },
    // 清空选中的知识点, 清空筛选条件
    resetKnowledgeSelect() {
      this.knowledgeFilter = '';
      this.knowledgeList = [];
    },
  },
};
</script>
<style scoped lang="scss">
.mr20 {
  margin-right: 20px;
  .header-box {
    height: 90px;
    margin-bottom: 20px;
    .one-flow {
      height: 30px;
      margin-bottom: 25px;
    }
    .tow-flow {
      clear: both;
      margin-top: 20px;
    }
  }
}
.show {
  margin-left: 5px;
  display: inline-block;
}
.span {
  margin-left: 5px;
  display: inline-block;
}

.hidee {
  margin-left: 5px;
  display: inline-block;
}
.jia-zai {
  animation-name: loading;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes loading {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.knowledge-list {
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  .knowledge-list-item {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    margin-right: 4px;
    padding: 0 5px;
    font-size: 12px;
    font-weight: 400;
    background: var(--neutral0);
    border-radius: 2px;
  }
}
</style>
<style lang="scss">
.show,
.open {
  color: var(--green-color);
}
.back-knowledge-select {
  .el-tag {
    height: 22px !important;
  }
}

.back-knowledge-point-multi-select {
  padding: 16px 16px 0 16px;
  min-width: 232px !important;
  max-width: 238px !important;
  .el-select-dropdown__item {
    height: 22px;
    line-height: 22px;
  }
  .search-area {
    max-height: 165px;
    margin-bottom: 16px;
    overflow-y: auto;
    .filter-area {
      width: 200px;
      height: 32px;
      .cb-search-input {
        width: 200px !important;
      }
    }
    .options-content {
      margin-top: 12px;
      margin-left: -2px;
      display: flex;
      flex-wrap: wrap;
      .options-content-item {
        margin: 4px 2px;
        padding: 0 5px;
        font-size: 12px;
        font-weight: 400;
        background: var(--neutral0);
        border-radius: 2px;
      }
      .options-content-item::after {
        display: none;
      }
      .no-data {
        width: 100%;
        height: 40px;
        line-height: 40px;
        color: var(--neutral8);
        text-align: center;
      }
    }
  }
  .reset-area {
    padding-top: 5px;
    border-top: 1px solid var(--neutral0);
    color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 12px;
    height: 32px;
    .reset-area-icon {
      cursor: pointer;
    }
    .reset-area-info {
      margin-left: 4px;
      cursor: pointer;
    }
    .cb-button {
      position: absolute;
      right: 0;
    }
  }
  .el-scrollbar {
    display: block !important;
  }
  .el-select-dropdown__empty {
    display: none;
  }
}
</style>
