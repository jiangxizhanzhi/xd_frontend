<template>
  <cb-inner-page :background="true" class="history-background">
    <div class="history-header">
      <Block :title="$t('assessment.historyScore')"></Block>
    </div>
    <cb-search-table
      :cols.sync="cols"
      :data-source="historyData"
      rowKey="resource_id"
      ref="tableListRef"
      :hidePaginOnDemand="true"
      :expandRowKey="expandRowKey"
    >
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import Block from '@/components/block';
import { recordHistory } from '@/api/web/range-test';

export default {
  components: {
    Block,
  },
  data() {
    return {
      expandRowKey: {},
      cols: [
        {
          label: this.$t('assessment.evaluationItem'),
          prop: 'name',
        },
        {
          label: this.$t('assessment.fifthScore'),
          prop: 'fifth_score',
        },
        {
          label: this.$t('assessment.fourthScore'),
          prop: 'fourth_score',
        },
        {
          label: this.$t('assessment.thirdScore'),
          prop: 'third_score',
        },
        {
          label: this.$t('assessment.secondScore'),
          prop: 'second_score',
        },
        {
          label: this.$t('assessment.firstScore'),
          prop: 'first_score',
        },
      ],
      historyData: [],
    };
  },
  mounted() {
    this.getRecordHistory();
  },
  methods: {
    getRecordHistory() {
      const data = {
        resource_id: this.$route.params.resource_id,
      };
      recordHistory(data).then((res) => {
        this.historyData = _.get(res, 'data.data');
        this.expandRowKey = {
          key: 'resource_id',
          status: true,
          resource_id: this.historyData[0].resource_id,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.history-background {
  background: var(--bg-color-2);
  .history-header {
    padding-left: 20px;
  }
}
</style>
