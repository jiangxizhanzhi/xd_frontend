<template>
  <div class="class-learn-content">
    <!-- 已下发练习 -->
    <cb-search-table
      ref="sdlRefb"
      :fetchPromise="fetchPromise"
      :cols="columns"
      row-key="user_id"
      :data="query"
      v-show="isTrue && issue"
      :searchBarBg="false"
    >
      <template v-slot:search>
        <cb-select
          v-model="query.is_commit"
          :first="{
            value: null,
            label: $t('m.allSubmitStatus'),
          }"
          :options="submitOptions"
          :placeholder="$t('m.allSubmitStatus')"
        >
        </cb-select>
        <cb-select
          v-model="query.is_mark"
          :first="{
            value: null,
            label: $t('m.allCorrectStatus'),
          }"
          :options="markOptions"
          :placeholder="$t('m.allCorrectStatus')"
        >
        </cb-select>
        <cb-search-input
          v-model="query.name"
          :placeholder="$t('m.pleaseInputSelectName')"
        ></cb-search-input>
      </template>
      <template v-slot:submit_state="scope">
        <span>
          <cb-iconfont
            v-show="scope.data.submit_state"
            type="icon-zhuangtai"
            size="10"
            color="var(--green-color)"
          ></cb-iconfont>
          <cb-iconfont
            v-show="!scope.data.submit_state"
            type="icon-zhuangtai"
            size="10"
            color="var(--neutral7)"
          ></cb-iconfont>
          <span v-if="scope.data.submit_state">
            {{ $t('m.hasSubmitted') }}</span
          >
          <span v-else class="unsubmit">{{ $t('m.unsubmitted') }}</span>
        </span>
      </template>

      <template v-slot:accuracy="scope">
        <div v-if="scope.data.accuracy">
          <span class="green-color">{{
            getRightCount(scope.data.accuracy)
          }}</span>
          <span>/</span>
          <span>{{ getTotalCount(scope.data.accuracy) }}</span>
        </div>
        <div v-else>-</div>
      </template>
      <template v-slot:level="scope">
        <div v-if="scope.data.level">
          <span v-if="scope.data.level === 1" class="green-color">{{
            $t('m.good')
          }}</span>
          <span v-if="scope.data.level === 2" class="well-color">{{
            $t('m.well')
          }}</span>
          <span v-if="scope.data.level === 3" class="orange-color">{{
            $t('m.middle')
          }}</span>
          <span v-if="scope.data.level === 4" class="red-color">{{
            $t('m.bad')
          }}</span>
        </div>
        <div v-else>-</div>
      </template>
      <template v-slot:state="scope">
        <cb-button
          :disabled="!scope.data.submit_state"
          @click="goToDetail(scope.data)"
          type="text"
        >
          {{ $t('m.correctMark') }}
        </cb-button>
      </template>
    </cb-search-table>
    <!-- 暂无练习 -->
    <div class="no-data" v-if="!isTrue">
      <div class="no-data-content">
        <cb-iconfont type="icon-zanwuziyuan" size="60"></cb-iconfont>
        <div>{{ $t('m.noHomework') }}</div>
      </div>
    </div>
    <!-- 暂未下发 -->
    <div class="no-issue" v-if="isTrue && !issue">
      <div class="no-issue-content">
        <div class="text">{{ $t('m.noIssueHomework') }}</div>
        <cb-button type="primary" icon="icon-xiafa" @click="issueTask">{{
          $t('m.issueHomework')
        }}</cb-button>
      </div>
    </div>
    <cb-dialog
      :title="$t('m.correctHomework')"
      :visible.sync="dialogVisible"
      width="65%"
      height="660px"
    >
      <div>
        <correct-detail
          v-if="userId"
          :detail-data="detailData"
          :user-id="userId"
          @close="handleClose"
        />
      </div>
      <div>
        <div class="markdown-title">{{ $t('m.solvedIdea') }}</div>
        <div class="markdown-area">
          <cb-markdown v-model="markdownData" type="viewer"></cb-markdown>
        </div>
      </div>
    </cb-dialog>
  </div>
</template>
<script>
import correctDetail from './correct-detail.vue';
import { getSolveIdea } from '@/api/class-schedule';
export default {
  components: {
    correctDetail,
  },
  data() {
    return {
      issue: true,
      isTrue: true,
      query: {
        is_commit: null,
        is_mark: null,
        name: '',
        classroomId: this.$route.params.lessonId,
        organization_id: this.$route.params.orgId,
        lesson_id: this.$route.params.courseId,
      },
      submitOptions: [
        {
          label: this.$t('m.hasSubmitted'),
          value: true,
        },
        {
          label: this.$t('m.unsubmitted'),
          value: false,
        },
      ],
      markOptions: [
        {
          label: this.$t('m.hasMark'),
          value: true,
        },
        {
          label: this.$t('m.unMark'),
          value: false,
        },
      ],
      dialogVisible: false,
      detailData: {},
      userId: '',
      markdownData: '',
    };
  },
  computed: {},
  created() {
    this.columns = [
      {
        label: this.$t('m.name') + '(' + this.$t('user.username') + ')',
        sorter: 'name',
        getData(row) {
          const { name = null, username = null } = row;
          return `${name}(${username})`;
        },
        width: 250,
      },
      {
        label: this.$t('m.unit'),
        prop: 'organization_name',
      },
      {
        label: this.$t('m.submitState'),
        slot: 'submit_state',
        prop: 'submit_state',
      },
      {
        label: this.$t('m.submitTime'),
        prop: 'submit_time',
        getData(row) {
          const { submit_time } = row;
          if (submit_time) {
            return `${submit_time}`;
          } else {
            return `-`;
          }
        },
      },
      {
        label: this.$t('m.oqCorrectRate'),
        slot: 'accuracy',
        prop: 'accuracy',
      },
      {
        label: this.$t('m.evaluation'),
        slot: 'level',
      },
      {
        label: this.$t('m.corrector'),
        prop: 'corrector',
        getData(row) {
          const { corrector } = row;
          if (corrector) {
            return `${corrector}`;
          } else {
            return `-`;
          }
        },
      },
      {
        label: this.$t('m.correctionTime'),
        prop: 'correct_time',
        getData(row) {
          const { correct_time } = row;
          if (correct_time) {
            return `${correct_time}`;
          } else {
            return `-`;
          }
        },
      },
      {
        label: this.$t('common.operation'),
        slot: 'state',
      },
    ];
  },
  mounted() {},
  methods: {
    getRightCount(str) {
      if (str) {
        let ipos = str.indexOf('/');
        let str1 = str.substring(0, ipos);
        return str1;
      }
    },
    getTotalCount(str) {
      if (str) {
        let ipos = str.indexOf('/');
        let str2 = str.substring(ipos + 1, str.length);
        return str2;
      }
    },
    // 获取详情接口
    studentDetail(data) {
      return this.$request.get(
        '/oj/admin/course/classroom/practice-detail/',
        data,
        {
          baseURL: '/api/ojj',
        },
      );
    },
    goToDetail(data) {
      this.userId = data.user_id;
      this.dialogVisible = true;
      const finalData = {
        lesson_id: this.$route.params.courseId,
        user_id: data.user_id,
        classroom_id: this.$route.params.lessonId,
      };
      this.studentDetail(finalData).then((res) => {
        this.detailData = _.get(res, 'data.data');
      });
      const params = {
        resource_id: this.$route.params.courseId,
        user_id: data.user_id,
        note_type: 1,
        resource_type: 4,
      };
      getSolveIdea(params).then((res) => {
        this.markdownData = _.get(res, 'data.data.content');
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.refresh();
    },
    // 获取列表接口
    practiceStatistic(data) {
      return this.$request.get(
        '/oj/admin/course/classroom/practice-statistic/',
        data,
        {
          baseURL: '/api/ojj',
        },
      );
    },
    fetchPromise(queryData, option) {
      return new Promise((resolve) => {
        this.practiceStatistic(queryData).then((resp) => {
          this.isTrue = resp.data.data.has_practice;
          this.issue = resp.data.data.released;
          resolve(resp.data);
        });
      });
    },
    // 下发接口
    issuePractice(data) {
      return this.$request.patch(
        '/oj/admin/course/classroom/practice/batch-auth',
        data,
        {
          baseURL: '/api/ojj',
        },
      );
    },
    issueTask() {
      this.$confirm(this.$t('m.confirmIssue'), '', {
        type: 'warning',
      })
        .then(() => {
          const data = {
            is_public: true,
            lesson_id: this.$route.params.courseId,
            organization_id: this.$route.params.orgId,
            classroom_id: this.$route.params.lessonId,
          };
          this.issuePractice(data).then((res) => {
            this.$message.success(this.$t('m.issueSuccess'));
            this.refresh();
          });
        })
        .catch(() => {});
    },
    refresh() {
      this.$refs.sdlRefb.reload();
    },
    monitor() {
      this.$router.push({ name: 'learn-monitor' });
    },
  },
};
</script>
<style scoped lang="scss">
.class-learn-content {
  .unsubmit {
    color: var(--neutral7);
  }
  .green-color {
    color: var(--green-color);
  }
  .well-color {
    color: var(--echart-item-color2);
  }
  .orange-color {
    color: var(--orange-color);
  }
  .red-color {
    color: var(--red-color);
  }
  .regular-color {
    color: var(--font-color-regular);
  }
  .search-wrapper-box {
    width: 200px;
    display: inline-block;
    margin-bottom: 20px;
  }
  .no-issue,
  .no-data {
    width: 100%;
    height: 650px;
    text-align: center;
    &-content {
      padding: 290px 0;
      .text {
        margin-bottom: 10px;
      }
    }
  }
  .markdown-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--neutral8);
    line-height: 20px;
  }
  .markdown-area {
    min-height: 200px;
    background: var(--bg-color-3);
    margin: 15px 0;
  }
}
</style>
