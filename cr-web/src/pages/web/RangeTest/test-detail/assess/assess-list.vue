<template>
  <!-- <cb-inner-page :background="false"> -->
  <div style="height: 100%; padding: 16px">
    <cb-scrollbar>
      <cb-search-table
        :cols="cols"
        :selector="selector"
        :selection.sync="selection"
        :url="url"
        row-key="resource_id"
        :data="model"
        ref="tableListRef"
        baseURL="/api/ojj"
        @data-loaded="handleDataLoaded"
        :searchBarBg="false"
      >
        <template v-slot:search>
          <!-- <cb-button button-type="add" link-name="assess-add"></cb-button> -->
          <cb-button button-type="add" @click="addAccess"></cb-button>
          <cb-button
            hollow
            button-type="delete"
            @click="deleteSelectedRow(selection, $event)"
            :disabled="selection.length === 0"
          ></cb-button>
        </template>

        <template v-slot:filter>
          <!-- 状态筛选 -->
          <cb-select
            v-model="model.status"
            :options="algorithmList"
            :first="{ label: $t('assessment.allState'), value: '' }"
            clearable
          />
          <cb-search-input
            v-model="model.pattern"
            :placeholder="$t('assessment.requireName')"
          ></cb-search-input>
        </template>
        <!-- 描述 -->
        <template v-slot:description="scope">
          <span v-if="scope.data.description" :title="scope.data.description">{{
            scope.data.description
          }}</span>
          <span v-else>-</span>
        </template>
        <!-- 评估时间 -->
        <template v-slot:eval_time="scope">
          <span v-if="scope.data.eval_time">{{ scope.data.eval_time }}</span>
          <span v-else>-</span>
        </template>
        <!-- 评估状态 -->
        <template v-slot:status="scope">
          <span class="icon icon-one" v-if="scope.data.status % 4 === 1"
            >&nbsp&nbsp</span
          >
          <span class="icon icon-two" v-if="scope.data.status % 4 === 2"
            >&nbsp&nbsp</span
          >
          <span class="icon icon-three" v-if="scope.data.status % 4 === 3"
            >&nbsp&nbsp</span
          >
          <span class="icon icon-four" v-if="scope.data.status % 4 === 0"
            >&nbsp&nbsp</span
          >
          <span>{{ optionsStatusLabels[scope.data.status] }}</span>
        </template>
        <!-- 评估结果 -->
        <template v-slot:score="scope">
          <span v-if="scope.data.score">{{ scope.data.score }}%</span>
          <span v-else-if="scope.data.score === 0"
            >{{ scope.data.score }}%</span
          >
          <span v-else="!scope.data.score">-</span>
        </template>
        <!-- 编辑 ,查看按钮-->
        <template v-slot:operate="scope">
          <cb-button
            type="text"
            @click="editRow(scope.data)"
            button-type="edit"
            mr
            :disabled="
              scope.data.status !== 1 || isShowIndex.includes(scope.index)
            "
          ></cb-button>
          <!-- 查看 -->
          <!-- <cb-button
            type="text"
            @click="checkRow(scope.data)"
            mr
            v-if="scope.data.status === 3 || scope.data.status === 4"
            >{{ $t('assessment.view') }}</cb-button
          > -->

          <!-- 5.3.4查看详情页面改造 -->
          <cb-button type="text" @click="checkRowNew(scope.data)" mr>{{
            $t('assessment.assess')
          }}</cb-button>

          <!-- 评估 -->
          <!-- <cb-button
            type="text"
            @click="assessRow(scope.data, scope.index)"
            mr
            v-if="scope.data.status === 1"
            :disabled="isShowIndex.includes(scope.index)"
          >
            <cb-iconfont
              type="icon-jiazai"
              class="jia-zai"
              v-if="isShowIndex.includes(scope.index)"
            ></cb-iconfont>
            <span>{{ $t('assessment.assess') }}</span></cb-button
          >
          <cb-button
            type="text"
            @click="assessRow(scope.data)"
            mr
            v-if="scope.data.status == 2"
            :disabled="true"
            >{{ $t('assessment.assess') }}</cb-button
          > -->
        </template>
      </cb-search-table>
    </cb-scrollbar>
  </div>
  <!-- </cb-inner-page> -->
</template>

<script>
import _ from 'lodash';
import { setBreadcrumbTitle } from '@cyber/ui';
export default {
  name: 'AssessList',
  //接收的实例id
  props: {
    task_ids: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dataArr: [],
      optionsStatusLabels: {},
      // 评估列表url
      url: '/cr/eval/record/list',
      isShowIndex: [],
      timer: null,
      timerArr: [],
      timerRun: false,
      model: {
        status: '',
        pattern: '',
        taskId: this.task_ids,
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('assessment.assessName'),
          prop: 'name',
        },
        {
          label: this.$t('assessment.desc'),
          slot: 'description',
        },
        {
          label: this.$t('assessment.assessTime'),
          slot: 'eval_time',
        },

        {
          label: this.$t('assessment.assessIndicators'),
          prop: 'system_name',
        },
        {
          label: this.$t('assessment.assessState'),
          //   prop: 'state',
          slot: 'status',
        },

        {
          label: this.$t('assessment.assessResult'),
          // prop: 'score',
          slot: 'score',
        },
        {
          label: this.$t('assessment.operation'),
          slot: 'operate',
        },
      ],
    };
  },
  computed: {
    algorithmList() {
      let arr = [];
      _.forEach(this.dataArr, (item) => {
        // 列表状态label
        this.optionsStatusLabels[item.id] = item.label;
        arr.push({
          label: item.label.toString(),
          value: item.id,
        });
      });
      return arr;
    },
  },
  watch: {
    task_ids: {
      handler(newData, old) {
        this.model.taskId = newData;
        this.isShowIndex = [];
        this.timerArr.forEach((item) => {
          clearInterval(item);
        });
      },
    },
  },
  mounted() {
    // 获取储存的测评详情的title
    this.breadcrumbName = localStorage.getItem('rang-detail');
    setBreadcrumbTitle(this.breadcrumbName);
  },
  created() {
    this.detail_id = this.$route.params.templateId;
    // 获取评估状态
    this.$request
      .get('/cr/eval/record/status', null, { baseURL: '/api/ojj' })
      .then((res) => {
        this.dataArr = res.data.data;
      });
  },
  methods: {
    handleDataLoaded() {
      const result = this.$refs?.tableListRef?.tableData.some((item) => {
        return item.status === 2;
      });
      if (result) {
        this.refreshList();
      }
    },

    //定时获取列表
    refreshList() {
      this.timerArr.forEach((item) => {
        clearInterval(item);
      });
      const timer = setInterval(() => {
        if (this.$refs?.tableListRef?.reload) {
          this.$refs.tableListRef.reload();
        }
        const result = this.$refs?.tableListRef?.tableData.every((item) => {
          return item.status !== 2;
        });
        if (result) {
          this.timerArr.forEach((item) => {
            clearInterval(item);
          });
        }
      }, 5000);
      this.timerArr.push(timer);
    },
    //列表转化评估状态
    // exchangeStateType(status) {
    //   switch (status) {
    //     case 1: {
    //       return this.$t('assessment.noStart');
    //     }
    //     case 2: {
    //       return this.$t('assessment.running');
    //     }
    //     case 3: {
    //       return this.$t('assessment.end');
    //     }
    //     case 4: {
    //       return this.$t('assessment.abnormal');
    //     }
    //     default: {
    //       return '';
    //     }
    //   }
    // },
    /* 删除 */
    deleteSelectedRow(data, done) {
      const ids = [];
      if (data?.length) {
        data.forEach((item) => {
          ids.push(item.resource_id);
        });
      }
      this.$request
        .delete('/cr/eval/record', { ids }, { baseURL: '/api/ojj' })
        .then(() => {
          done();
          this.selection = [];
          if (this.$refs?.tableListRef?.reload) {
            this.$refs.tableListRef.reload();
          }
        })
        .catch((err) => {
          done(false);
        });
    },
    /* 编辑 */
    editRow(data) {
      const { resource_id } = data;
      this.$router.push({
        // path: `/assessment-algorithm/edit/${resource_id}`,
        path: `/range-test/assess-edit/${this.detail_id}/${resource_id}?task_id=${this.task_ids}`,
      });
    },
    //新增
    addAccess() {
      this.$router.push({
        // path: `/range-test/assess-add/${this.detail_id}`,
        path: `/range-test/assess-add/${this.detail_id}?task_id=${this.task_ids}`,
      });
    },
    //查看详情
    // checkRow(data) {
    //   this.status = data.status;
    //   this.message = data.message;
    //   const { resource_id } = data;
    //   this.$router.push({
    //     // path: `/range-test/assess-detail/${resource_id}`,
    //     path: `/range-test/assess-detail/${this.detail_id}/${resource_id}?status=${this.status}`,
    //   });
    // },

    //5.3.4查看详情
    checkRowNew(data) {
      this.status = data.status;
      this.message = data.message;
      this.task_id_new = data.task_id;
      const { resource_id } = data;
      this.$router.push({
        // path: `/range-test/assess-detail/${resource_id}`,
        path: `/range-test/assess-detail-new/${this.detail_id}/${resource_id}/${this.task_id_new}?status=${this.status}`,
      });
    },

    //点击评估 todo接口待调
    assessRow(data, index) {
      this.isShowIndex.push(index);
      const { resource_id } = data;
      this.$request
        .post(
          '/cr/eval/record/start',
          { resource_id: resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          if (this.$refs?.tableListRef?.reload) {
            this.$refs.tableListRef.reload();
          }
          this.handleDataLoaded();
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .ant-pagination {
  float: right;
}
.icon {
  display: inline-block;
  height: 8px;
  height: 8px;
  border-radius: 8px;
  position: relative;
  top: 6px;
  right: 2px;
}
.icon-one {
  background: var(--green-color);
}
.icon-two {
  background: var(--primary-color);
}
.icon-three {
  background: var(--neutral4);
}
.icon-four {
  background: var(--red-color);
}
::v-deep.cb-inner-page {
  padding: 16px !important;
}
.jia-zai {
  animation-name: loading;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>
