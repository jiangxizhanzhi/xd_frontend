<template>
  <div class="train-new-list">
    <div class="header" @click="goBack">
      <cb-iconfont type="icon-xiangyou"></cb-iconfont>
      {{ $t('m.trainRecordList') }}
    </div>
    <div class="table-content">
      <cb-search-table
        ref="param-table"
        :cols="columns"
        :dataSource="trainList"
        :hidePaginOnDemand="true"
        border
        rowKey="resource_id"
        :scroll="{ y: 510 }"
        :searchBarBg="false"
      >
        <template v-slot:times="scope">
          <span>{{ $t('m.theTimes', { num: scope.data.train_times }) }} </span>
        </template>
        <template v-slot:operate="scope">
          <cb-button type="text" @click="handleClick(scope.data)">{{
            $t('m.view')
          }}</cb-button>
        </template>
      </cb-search-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    trainList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      columns: [
        {
          label: this.$t('m.trainTimes'),
          slot: 'times',
        },
        {
          label: this.$t('m.fraction'),
          prop: 'score',
        },
        {
          label: this.$t('m.time'),
          prop: 'train_time',
        },
        {
          label: this.$t('common.operation'),
          slot: 'operate',
        },
      ],
    };
  },
  methods: {
    handleClick(data) {
      this.$emit('historyId', data.room_id);
      this.$emit('showList', false);
      this.$emit('resource', 'list');
      this.$emit('showDetail', true);
    },
    goBack() {
      this.$emit('showList', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.train-new-list {
  background: var(--bg-color-3);
  height: 100%;
  position: absolute;
  right: 0;
  box-sizing: border-box;
  padding: 15px;
  z-index: 10;
  .header {
    padding: 10px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid var(--neutral1);
    color: var(--neutral8);
    .cb-iconfont {
      cursor: pointer;
    }
  }
}
</style>
