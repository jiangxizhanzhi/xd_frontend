
<template>
  <div class="select">
    <slot name="rightSearch">
      <div class="select-user">{{ $t('g.selectUser') }}</div>
    </slot>

    <cb-search-table
      :scroll="scroll"
      class="select-table"
      :cols="columnsData"
      childrenColumnName="course_lessons"
      showLessItems
      hidePaginOnDemand
      :showQuickJumper="false"
      :showIndex="showIndex"
      :dataSource="data"
      :rowKey="rowKey"
      :searchBarBg="false"
    >
      <template v-slot:operate="scope">
        <cb-button type="text" colorType="red" @click="deleteFunc(scope)">{{
          $t('g.delete')
        }}</cb-button>
      </template>
      <template v-for="(item, index) in columns" v-slot:[item.slot]="{ data }">
        <span :key="index" v-if="item.slot">
          <slot :name="item.slot" :data="data"></slot>
        </span>
      </template>
    </cb-search-table>
  </div>
</template>

<script>
export default {
  props: {
    query: {
      type: Object,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    rowKey: {
      type: String,
      default: '',
    },
    showIndex: {
      type: Boolean,
      default: true,
    },
    scroll: {
      type: Object,
      default: () => ({ y: 500 }),
    },
  },
  data() {
    return {};
  },
  computed: {
    columnsData() {
      const arr = this.columns.filter((item) => {
        return (
          (!item.none && !item.position) ||
          (item.position &&
            (item.position === 'right' || item.position === 'all'))
        );
      });

      const obj = {
        label: this.$t('g.operation'),
        slot: 'operate',
        width: '90px',
      };
      arr.push(obj);
      return arr;
    },
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    deleteFunc(val) {
      this.$emit('delete', val.data);
      this.data.forEach((element, index) => {
        if (element[this.rowKey] === val.data[this.rowKey]) {
          this.data.splice(index, 1);
        }
      });
    },
  },
};
</script>
