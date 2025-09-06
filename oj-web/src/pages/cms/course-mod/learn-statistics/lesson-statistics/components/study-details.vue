<template>
  <cb-inner-page :background="false">
    <cb-dialog :visible.sync="visibleValue" height="500px" width="50%">
      <template slot="title">
        <div>{{ $t('learningStatistics.classLearningDetails') }}</div>
      </template>
      <div>
        <learn-count :lessoningId="lesson" :lessonType="type"></learn-count>
      </div>
      <template slot="footer">
        <cb-button
          button-type="confirm"
          mr="mr"
          @click="savedata()"
        ></cb-button>
      </template>
    </cb-dialog>
  </cb-inner-page>
</template>

<script>
import learnCount from '../../learn-count.vue';
export default {
  props: {
    lesson: {
      type: String,
      default() {
        return null;
      },
    },
    type: {
      type: Number,
      default() {
        return null;
      },
    },
  },
  components: {
    learnCount,
  },
  data() {
    return {
      visibleValue: false,
      query: {
        search: '',
      },
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
      },
      selector: {
        maxSelect: 0,
      },
      tableSelector: {},
      multipleSelection: [],
    };
  },
  methods: {
    savedata() {
      this.visibleValue = false;
    },
  },
};
</script>

<style></style>
