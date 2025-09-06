<template>
  <div>
    <course-card
      v-if="type === 'course'"
      :data="data"
      :index="index"
    ></course-card>
    <practice-card
      v-if="type === 'practice'"
      :data="data"
      :index="index"
    ></practice-card>
    <comprehensive-card
      v-if="type === 'comprehensive'"
      :data="data"
      :index="index"
    ></comprehensive-card>
    <job-card v-if="type === 'job'" :data="data" :index="index"></job-card>
    <summary-card
      v-if="type === 'summary'"
      :data="data"
      :index="index"
    ></summary-card>
  </div>
</template>

<script>
import CourseCard from './course/index';
import PracticeCard from './practice/index';
import ComprehensiveCard from './comprehensive/index';
import JobCard from './job/index';
import SummaryCard from './summary/index';

export default {
  name: 'card',
  components: {
    CourseCard,
    PracticeCard,
    ComprehensiveCard,
    JobCard,
    SummaryCard,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: {},
    },
    index: {
      type: Number,
      default: 0,
    },
  },
};
</script>
