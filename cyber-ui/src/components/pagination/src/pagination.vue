<template>
  <div class="cb-pagination">
    <cb-a-config-provider :locale="locale">
      <a-pagination
        size="small"
        :show-size-changer="showSizeChanger"
        :show-quick-jumper="showQuickJumper"
        :page-size-options="pageSizes || pageSizeOptions"
        :show-total="showTotal"
        :total="total"
        v-bind="$attrs"
        :page-size="internalPageSize"
        :current="internalCurrentPage"
        @change="currentChange"
        @showSizeChange="sizeChange"
        :style="{ float: align }"
      />
    </cb-a-config-provider>
  </div>
</template>

<script>
/**
 * @displayName cb-pagination 分页
 * @classify Data/数据
 */
export default {
  name: 'CbPagination',
  props: {
    /**
     * 是否可以改变 pageSize
     */
    showSizeChanger: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否可以快速跳转至某页
     */
    showQuickJumper: {
      type: Boolean,
      default: true,
    },
    showTotalTag: {
      type: Boolean,
      default: true,
    },
    /**
     * 当前页，需要.sync修饰符
     *
     */
    currentPage: {
      type: Number,
      default: 1,
    },
    /**
     * 每页条数，需要.sync修饰符
     */
    pageSize: {
      type: Number,
      default: 10,
    },
    /**
     * 总条数
     */
    total: {
      type: Number,
      default: 0,
    },
    /**
     * 分页条数自定义
     */
    pageSizeOptions: {
      type: Array,
      default: () => ['10', '20', '30', '50', '100'],
    },
    /**
     * 分页条数自定义,兼容
     */
    pageSizes: {
      type: null,
      default: null,
    },
    /**
     * 对齐方式
     * @values left,center,right
     */
    align: {
      type: String,
      default: 'right',
    },
  },
  data() {
    return {
      internalPageSize: 10,
      internalCurrentPage: this.currentPage,
    };
  },

  computed: {
    locale() {
      return this.$cbAntLocale[this.$i18n.locale];
    },
  },
  watch: {
    currentPage: {
      handler(val) {
        this.internalCurrentPage = val;
      },
      immediate: true,
    },

    pageSize: {
      handler(val) {
        this.internalPageSize = val;
      },
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    showTotal(total) {
      if (this.showTotalTag) {
        return this.$t('g.pageTotal', [total]);
      } else {
        return '';
      }
    },
    currentChange(page, pageSize) {
      this.internalCurrentPage = page;
      this.$emit('update:current', page);
      this.$emit('current-change', page);
    },
    sizeChange(current, size) {
      this.internalPageSize = size;
      this.$emit('update:pageSize', size);
      this.$emit('size-change', size);
    },
  },
};
</script>
