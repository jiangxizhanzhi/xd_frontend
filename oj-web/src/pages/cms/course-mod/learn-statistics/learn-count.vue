<template>
  <div class="learn-count">
    <!-- 点击查看 理论课,实验课-->
    <cb-search-table
      ref="sdlRefb"
      url="/oj/admin/statistic/lesson_statistics_detail"
      baseURL="/api/ojj"
      :cols="columns"
      :data="query"
      row-key="resource_id"
    >
      <template v-slot:search>
        <cb-cascader
          class="marright20"
          v-model="organizationValue"
          :options="options"
          :placeholder="$t('views.notice.validator.selectOrganization')"
          :clearable="true"
          @change="handleOrganizationChange"
          :props="optionProps"
        ></cb-cascader>
        <cb-search-input
          :placeholder="$t('user.pleaseInputSelectName')"
          v-model="query.search"
        ></cb-search-input>
      </template>
      <template v-slot:name_one="scope"
        ><span>{{ scope.data.user_info.name || '-' }}</span></template
      >
      <template v-slot:organization_data_one="scope"
        ><span
          class="overClass"
          :title="scope.data.user_info.organization_data"
          >{{ scope.data.user_info.organization_data || '-' }}</span
        ></template
      >
      <template v-slot:practice_count="scope"
        ><span>{{ scope.data.practice_count || '-' }}</span></template
      >
      <template v-slot:score="scope"
        ><span>{{ scope.data.score || '-' }}</span></template
      >
      <template v-slot:has_report="scope">
        <div>
          <div class="nullSubmit" v-if="!scope.data.is_report">
            {{ $t('m.unsubmitted') }}
          </div>
          <div v-else type="text">
            {{ $t('personStatistics.ReportsSubmitted') }}
          </div>
        </div>
      </template>
    </cb-search-table>
  </div>
</template>
<script>
import SearchInput from '@/components/search-condition/search-input.vue';
import _ from 'lodash';
import MavonRead from '@/components/markdown/mavon-read.vue';
import { getOrgData } from '@/api/organization.js';
import { TYPE } from './contant.js';

export default {
  components: {
    SearchInput,
    MavonRead,
  },
  props: {
    lessoningId: {
      type: String,
      default() {
        return null;
      },
    },
    lessonType: {
      type: Number,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      TYPE,
      detailVisible: false,
      mavonContent: '',
      tableData: [],
      columns: [],
      query: {
        lesson: '',
        search: '',
        // organization: '',
        orgId: 'all',
      },
      search: {
        departmentsValue: '',
        gradeValue: '',
        classValue: '',
      },
      departmentsOptions: [],
      gradeOptions: [],
      classOptions: [],

      organizationValue: [], // 保存级联选择器数据
      options: [], // cascader 数据源
      optionProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'children',
      },
    };
  },
  computed: {},
  created() {
    this.query.lessonId = this.lessoningId;
    const type = this.lessonType;
    if (type === TYPE.THEORY) {
      this.columnsTheory();
    } else if (type === TYPE.LABSTYPE) {
      this.columnsMain();
    }
    this.getOrganization();
  },

  methods: {
    detail(row) {
      this.mavonContent = row.content;
      this.detailVisible = true;
    },
    // 理论课
    columnsTheory() {
      this.columns = [
        {
          label: this.$t('user.username'),
          prop: 'create_user',
        },
        {
          label: this.$t('m.name'),
          prop: 'name',
        },
        {
          label: this.$t('m.organization'),
          prop: 'organization_name',
        },
        {
          label: this.$t('m.exerciseCompleted'),
          prop: 'practice_count',
          slot: 'practice_count',
        },
      ];
    },
    //实验课
    columnsMain() {
      this.columns = [
        {
          label: this.$t('user.username'),
          prop: 'create_user',
        },
        {
          label: this.$t('m.name'),
          prop: 'name',
        },
        {
          label: this.$t('m.organization'),
          prop: 'organization_name',
        },
        {
          label: this.$t('m.exerciseCompleted'),
          prop: 'practice_count',
          slot: 'practice_count',
        },
        {
          label: this.$t('m.experimentReport'),
          slot: 'has_report',
          prop: 'is_report',
        },
        {
          label: this.$t('m.experimentalScore'),
          slot: 'score',
          sorter: 'score',
        },
        {
          label: this.$t('m.reportUpdateTime'),
          prop: 'report_update_time',
          sorter: 'report_update_time',
          width: 145,
        },
        {
          label: this.$t('m.scoringTime'),
          prop: 'marking_time',
          sorter: 'marking_time',
        },
      ];
    },

    // 根据组织架构去查询数据
    handleOrganizationChange(val) {
      if (val && val.length > 0) {
        const { length } = val;
        // this.query.organization = val[length - 1];
        this.query.orgId = val[length - 1];
      } else {
        this.query.orgId = 'all';
      }
    },
    // 获取 组织架构 的 tree 结构，并做处理
    getOrganization() {
      // Api.getOrfanizations()
      //   .then((res) => {
      //     if (res.status !== 200) return;
      //     this.options = res.data;
      //   })
      //   .catch(() => {});
      getOrgData().then((res) => {
        this.options = _.get(res, 'data.data', []);
      });
    },
  },
};
</script>
<style scoped lang="scss">
.learn-count {
  .table-grid {
    margin-top: 20px;
    .overClass {
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.search-wrapper-box {
  width: 200px;
  display: inline-block;
}
</style>
