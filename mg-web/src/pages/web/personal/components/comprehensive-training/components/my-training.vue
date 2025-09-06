<template>
  <div class="train-table cr-train-module" style="overflow: auto; height: 100%">
    <cb-search-table
      ref="tableRef"
      :fetchPromise="fetchPromise"
      :thumbCard="thumbCard"
    >
      <template v-slot:thumb="scope">
        <training-card :tableData="scope.data" />
      </template>
    </cb-search-table>
  </div>
</template>

<script>
import _ from 'lodash';
import TrainingCard from './training-card.vue';
import { getTraining } from '@/api/personal';
export default {
  components: {
    TrainingCard,
  },
  data() {
    return {
      thumbCard: {
        number: 1,
        width: '100%',
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    fetchPromise(queryData) {
      return new Promise((resolve) => {
        getTraining(queryData).then((resp) => {
          const finalData = _.cloneDeep(resp);
          delete finalData.data.data.completed;
          delete finalData.data.data.incomplete;
          finalData.data.data = { ...finalData.data.data.relation };
          resolve(finalData);
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.train-table {
  width: 100%;
}
</style>
<style lang="scss">
.cr-train-module {
  .cb-a-table-container-bg {
    padding: 0 0 16px;
  }
}
</style>
