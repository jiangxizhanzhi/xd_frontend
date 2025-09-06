<template>
  <div>
    <!--课程学习-->
    <div class="box course">
      <div class="title">
        {{ index }}. {{ $t('intelligence.report.job.title') }}
      </div>
      <span class="user-info">
        <img :src="data.avatar" alt="" />
        <span class="job">{{ data.role_name }}</span>
      </span>
      <div class="sub-box">
        <div class="first-title">
          {{ index }}.1 {{ $t('intelligence.report.job.titleList')[0] }}
        </div>
        <div class="card">
          <div>{{ data.level }}</div>
        </div>
      </div>
      <div class="sub-box">
        <div class="first-title">
          {{ index }}.2 {{ $t('intelligence.report.job.titleList')[1] }}
        </div>
        <div class="card table">
          <cb-search-table
            :cols="knowledgelCols"
            :data-source="data.knowledge_points"
            :hidePaginOnDemand="true"
            :searchBarBg="false"
          >
          </cb-search-table>
        </div>
      </div>
      <div class="sub-box">
        <div class="first-title">
          {{ index }}.3 {{ $t('intelligence.report.job.titleList')[2] }}
        </div>
        <div class="card table">
          <cb-search-table
            :cols="skillCols"
            :data-source="data.skill_points"
            :hidePaginOnDemand="true"
            :searchBarBg="false"
          >
          </cb-search-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card',
  components: {},
  props: {
    data: {
      type: Object,
      default: {},
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      jobCols: [
        { label: this.$t('intelligence.report.job.jobCols')[0], prop: '' },
        { label: this.$t('intelligence.report.job.jobCols')[1], prop: '' },
      ],
      knowledgelCols: [
        {
          label: this.$t('intelligence.report.job.knowledgelCols')[0],
          prop: 'content',
        },
        {
          label: this.$t('intelligence.report.job.knowledgelCols')[1],
          prop: 'mastery',
          getData: (data) => {
            return data.mastery + '%';
          },
          width: 150,
        },
      ],
      skillCols: [
        {
          label: this.$t('intelligence.report.job.skillCols')[0],
          prop: 'content',
        },
        {
          label: this.$t('intelligence.report.job.skillCols')[1],
          prop: 'mastery',
          getData: (data) => {
            return data.mastery + '%';
          },
          width: 150,
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.box {
  position: relative;
  font-size: 14px;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-color);
  }
  .user-info {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
    }
    .job {
      vertical-align: middle;
      margin-left: 4px;
    }
  }
  .sub-box {
    margin-bottom: 16px;
    .card {
      margin: 8px 0;
      padding: 8px 16px;
      line-height: 1.8;
      background-color: var(--neutral0);
      &.table {
        padding: 0;
      }
    }
    .first-title {
      margin: 8px 0;
      font-weight: 600;
    }
  }
}
</style>
