<template>
  <cb-inner-page class="personal-job" :background="false">
    <div class="personal-job-info">
      <div class="personal-job-info-left">
        <div class="position-info">
          <position-info :position-data="positionData" />
        </div>
        <div class="position-record">
          <position-menu :position-menu="positionData" />
        </div>
      </div>
      <div class="personal-job-info-right">
        <Block :title="$t('personal.talentCapabilityModel')" />
        <div class="echart-radar" v-loading="loading">
          <cb-echart-radar
            v-if="load"
            radarShape="sharp"
            :indicator="skillData"
            :radarData="skillValue"
            :radarRadius="radarRadius"
          />
        </div>
      </div>
    </div>
    <div class="personal-job-record">
      <div class="personal-job-record-knowledge">
        <Block :title="$t('personal.knowledgeSystemList')" />
        <knowledge-system-list v-loading="courseLoading" />
      </div>
      <div class="personal-job-record-learn">
        <Block :title="$t('personal.postCourseLearningRecord')" />
        <learning-record
          :position-list="positionList"
          ref="learningRecordRef"
        />
      </div>
    </div>
    <div class="personal-job-record">
      <div class="personal-job-record-knowledge">
        <Block :title="$t('personal.skillSystemList')" />
        <skill-system-list />
      </div>
      <div class="personal-job-record-learn">
        <Block :title="$t('personal.postSkillTrainingRecord')" />
        <skill-learning-record ref="learningRecordRef" />
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import Block from '@/components/block';
import PositionInfo from './components/position-info.vue';
import PositionMenu from './components/position-menu.vue';
import KnowledgeSystemList from './components/knowledge-system-list.vue';
import LearningRecord from './components/learning-record.vue';
import SkillSystemList from './components/skill-system-list.vue';
import SkillLearningRecord from './components/skill-learning-record.vue';
import _ from 'lodash';
import {
  getPersonalData,
  getKnowRadar,
  getPositionCourse,
} from '@/api/evaluation';
export default {
  components: {
    Block,
    PositionInfo,
    PositionMenu,
    KnowledgeSystemList,
    LearningRecord,
    SkillSystemList,
    SkillLearningRecord,
  },
  data() {
    return {
      load: false,
      loading: false,
      skillData: [],
      skillValue: [],
      radarRadius: ['0%', '60%'],
      courseLoading: false,
      positionList: [],
      positionData: {},
    };
  },
  mounted() {
    this.getPersonalInfo();
    this.getRaderEcharts();
    this.getPositionInfo();
  },
  methods: {
    // 获取个人岗位信息
    getPersonalInfo() {
      getPersonalData().then((res) => {
        this.positionData = _.get(res, 'data.data');
      });
    },
    // 获取雷达图数据
    getRaderEcharts() {
      getKnowRadar().then((res) => {
        const data = _.get(res, 'data.data') || [];
        data.map((item) => {
          this.skillData.push({
            max: 100,
            name: `${item.tree_name}`,
          });
          this.skillValue.push(parseInt(item.match_percent));
        });
        this.load = true;
        this.loading = false;
      });
    },

    // 获取岗位课程
    getPositionInfo() {
      this.$refs.learningRecordRef.positionLoading = true;
      getPositionCourse().then((res) => {
        this.positionList = _.get(res, 'data.data.knowledge_bos', []);
        this.$refs.learningRecordRef.positionLoading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.personal-job {
  &-info {
    display: flex;
    justify-content: space-between;
    height: 400px;
    &-left {
      width: 69%;
      display: flex;
      padding: 20px;
      justify-content: space-between;
      .position-info {
        width: 40%;
      }
      .position-record {
        width: 59%;
      }
    }
    &-right {
      width: 30%;
      padding: 20px;
      .echart-radar {
        height: 300px;
      }
    }
  }
  &-record {
    display: flex;
    margin-top: 16px;
    justify-content: space-between;
    &-knowledge,
    &-learn {
      width: 49.5%;
      padding: 20px;
    }
  }
}
</style>
<style lang="scss">
.personal-job {
  .cb-search-table .cb-table-no-data {
    padding: 60px 0 !important;
  }
}
</style>
<style lang="scss" scoped>
.personal-job-info {
  &-left,
  &-right {
    background: var(--bg-color-2);
  }
  .position-info {
    color: var(--neutral8);
    overflow: hidden;
  }
}
.personal-job-record {
  &-knowledge,
  &-learn {
    background: var(--bg-color-2);
  }
}
</style>
