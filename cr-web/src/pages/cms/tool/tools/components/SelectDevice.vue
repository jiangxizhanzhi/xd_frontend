<template>
  <cb-dialog
    :title="$t('tools.selectImage')"
    :visible.sync="dialog.visible"
    width="50%"
  >
    <div style="height: 500px">
      <cb-scrollbar>
        <cb-search-table
          ref="toolsBaseTableRef"
          :url="url"
          :baseURL="baseURL"
          :cols="columns"
          :data="query"
          :selector="tableSelector"
          :selection.sync="selection"
          row-key="uuid"
        >
          <template v-slot:searchRightArea>
            <cb-input
              v-model="query.search"
              :placeholder="$t('common.search')"
            />
          </template>
        </cb-search-table>
      </cb-scrollbar>
    </div>
    <span slot="footer" class="dialog-footer">
      <cb-button button-type="confirm" @click="dialogConfirm" mr>
        {{ $t('common.confirm') }}
      </cb-button>
      <cb-button button-type="cancel" @click="dialogCancel">{{
        $t('common.cancel')
      }}</cb-button>
    </span>
  </cb-dialog>
</template>

<script>
export default {
  data() {
    return {
      url: '/devops/cluster/images/page/',
      baseURL: '/api/mp',
      dialog: {
        visible: false,
      },
      selectedRows: [],
      query: {
        search: '',
        role: this.$CONSTANT.Device.Role.TERMINAL.value,
        _fields: ['id', 'resource_id', 'name'],
      },
      selection: [],
      columns: [
        {
          label: this.$t('tools.deviceName'),
          prop: 'name',
        },
      ],
    };
  },
  created() {
    this.tableSelector = {
      maxSelect: 1,
    };
  },
  methods: {
    show() {
      this.dialog.visible = true;
    },
    hide() {
      this.dialog.visible = false;
    },
    dialogCancel() {
      this.hide();
    },
    dialogConfirm() {
      if (!this.beforeDialogConfirm()) {
        return;
      }
      this.hide();
      this.$emit('confirm', this.selection);
    },
    beforeDialogConfirm() {
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-container {
  &::after {
    display: block;
    clear: both;
    content: '';
  }

  .filter-group {
    &.right {
      float: right;
    }
  }
}
.pagination-container {
  padding: 0 16px;
}
::v-deep .el-select .el-input {
  width: 100px !important;
}
</style>
