<template>
  <div>
    <cb-dialog :visible.sync="visible">
      <template slot="title">
        <div>{{ $t('device.viewFile') }}</div>
      </template>
      <div>
        <cb-search-table
          :scroll="{ y: 460 }"
          ref="table"
          hidePaginOnDemand
          :cols="columns"
          :data-source="tableData"
        >
          <!-- <template v-slot:operation="scope">
            <cb-button
              button-type="delete"
              type="text"
              mr
              @click="handleDelete(scope.data, $event)"
              >{{ $t('common.delete') }}</cb-button
            >
          </template> -->
          <template v-slot:status="scope">
            <span v-if="scope.data.status === '1'">{{
              $t('device.injectionHang')
            }}</span>
            <span v-if="scope.data.status === '2'">{{
              $t('device.injectionSucc')
            }}</span>
            <span v-if="scope.data.status === '3'">{{
              $t('device.injectionErr')
            }}</span>
          </template>
        </cb-search-table>
      </div>
      <div></div>
    </cb-dialog>
  </div>
</template>

<script>
import { getFileList, deleteInjectFile } from '@/api/device/image';
export default {
  name: 'FileView',
  props: {},
  data() {
    return {
      visible: false,
      device_uuid: '',
      tableData: [],
      columns: [
        {
          title: this.$t('device.fileName'),
          dataIndex: 'name',
          prop: 'name',
          width: 350,
        },
        {
          title: this.$t('device.path'),
          dataIndex: 'dest_path',
          prop: 'dest_path',
        },
        {
          title: this.$t('device.size'),
          dataIndex: 'size',
          getData: (row) => {
            let number = row.size ? (row.size / 1024).toFixed(2) + 'kb' : '';
            return number;
          },
        },
        {
          title: this.$t('device.injectionStatus'),
          dataIndex: 'status',
          slot: 'status',
        },
        /* {
          title: this.$t('device.operation'),
          dataIndex: 'operation',
          slot: 'operation',
        }, */
      ],
    };
  },
  methods: {
    open(row) {
      this.visible = true;
      this.device_uuid = row.uuid;
      this.fetchTableData();
    },
    fetchTableData() {
      this.tableData = [];
      let params = {};
      params.device_uuid = this.device_uuid;
      return getFileList(params).then((res) => {
        const data = _.get(res, 'data.data', []);
        if (data) {
          this.tableData = [...data];
        }
      });
    },
    // 删除
    handleDelete(row, done) {
      const params = {
        inject_uuid: row.inject_uuid,
        device_uuid: this.device_uuid,
      };
      deleteInjectFile(params)
        .then((res) => {
          this.$message.success(this.$t('organization.deleteSuccess'));
          done(true);
          this.fetchTableData();
        })
        .catch((err) => {
          done();
        });
    },
  },
};
</script>
