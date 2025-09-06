<template>
  <div class="train-table oj-my-module" style="overflow: auto; height: 100%">
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
import { getTask } from '@/api/personal';
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
  created() {
    this.user_id = this.$store.state.user.id;
  },
  mounted() {},
  methods: {
    fetchPromise(queryData) {
      const that = this;
      queryData.user_id = this.user_id;
      queryData.sort = '-create_time';
      return new Promise((resolve) => {
        getTask(queryData).then((resp) => {
          _.forEach(resp.data.data.list, (item) => {
            that.$set(item, 'resource_desc', item.theme_name);
          });
          resolve(resp);
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
.oj-my-module {
  .cb-a-table-container-bg {
    padding: 0 0 16px;
  }
}
</style>
