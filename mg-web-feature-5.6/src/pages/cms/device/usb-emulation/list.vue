<template>
  <cb-inner-page class="app-container" :background="false">
    <cb-search-table
      ref="usbTableRef"
      baseURL="/api/mp"
      :url="url"
      rowKey="resource_id"
      :cols.sync="columns"
      :data.sync="query"
      class="cb-search-table-li"
      :selection.sync="selection"
    >
      <template v-slot:filter>
        <cb-search-input
          v-model="query.name"
          :placeholder="$t('device.inputName')"
        />
      </template>
      <template v-slot:search>
        <cb-button
          button-type="add"
          link-name="usb-emulation-create"
        ></cb-button>
        <cb-button
          hollow
          button-type="delete"
          :disabled="selection.length === 0"
          @click="deleteRow(selection, $event)"
        ></cb-button>
      </template>
      <template v-slot:virtual_usb_type="scope">
        {{ VIRTUAL_USB_TYPE_ENUM[scope.data.virtual_usb_type] }}
      </template>
      <template v-slot:capacity="scope"> {{ scope.data.capacity }}G </template>
      <template v-slot:virtual_usb_status="scope">
        {{ VIRTUAL_USB_STATUS_ENUM[scope.data.virtual_usb_status] }}
      </template>
      <template v-slot:operation="scope">
        <cb-button
          :link-name="{
            name: 'usb-emulation-edit',
            params: { id: scope.data.uuid },
          }"
          type="text"
          button-type="edit"
          mr
        ></cb-button>
        <cb-button type="text" mr @click="openUSB(scope.data)"
          >{{ $t('device.open') }}
        </cb-button>
        <cb-button
          v-if="
            scope.data.virtual_usb_status &&
            scope.data.virtual_usb_status === 'succ'
          "
          type="text"
          @click="deleteAllUsbFiles(scope.data)"
          >{{ $t('device.format') }}
        </cb-button>
      </template>
    </cb-search-table>
    <!--    U盘云享文件列表-->
    <usb-file-list
      v-if="fileListVisible"
      :visible.sync="fileListVisible"
      :uuid="openUsbUUID"
      :name="openUsbName"
      @close="handleOpenClose"
    ></usb-file-list>
  </cb-inner-page>
</template>

<script>
import { deleteAllUsbFile, deleteVirtualUsb } from '../../../../api/device/usb';
import usbFileList from './components/usb-file-list';

export default {
  name: 'usbEmulation',
  components: {
    usbFileList,
  },
  data() {
    return {
      url: '/devops/cluster/virtual_usb/page',
      query: {
        name: '',
      },
      selection: [],
      fileListVisible: false,
      openUsbUUID: '',
      openUsbName: '',
      VIRTUAL_USB_TYPE_ENUM: {
        storage: this.$t('device.Storage'),
      },
      VIRTUAL_USB_STATUS_ENUM: {
        no: this.$t('device.notApply'),
        succ: this.$t('device.saved'),
      },
      columns: [
        {
          label: this.$t('device.name'),
          prop: 'name',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('device.description'),
          prop: 'description',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('device.type'),
          prop: 'virtual_usb_type',
          slot: 'virtual_usb_type',
        },
        {
          label: this.$t('device.capacity'),
          prop: 'capacity',
          slot: 'capacity',
        },
        {
          label: this.$t('device.imageStatus'),
          prop: 'virtual_usb_status',
          slot: 'virtual_usb_status',
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
        },
      ],
    };
  },
  computed: {},
  created() {},
  methods: {
    openUSB(row, done) {
      if (row.uuid) {
        this.fileListVisible = true;
        this.openUsbUUID = row.uuid;
        this.openUsbName = row.name;
      } else {
        this.$message.error({
          message: this.$t('device.error'),
        });
      }
    },
    deleteRow(row, done) {
      const ids = row.map((i) => {
        return i.uuid;
      });
      const params = {
        uuids: [...ids],
      };
      deleteVirtualUsb(params)
        .then(() => {
          done();
          this.$refs.usbTableRef.reload();
          this.selection = [];
        })
        .catch((error) => {
          done(false);
          this.$serverError(error);
        });
    },
    deleteAllUsbFiles(data) {
      this.$confirm(this.$t('device.confirmFormatting'))
        .then(() => {
          deleteAllUsbFile(data.uuid).then((res) => {
            this.$message.success(this.$t('common.operateSuccess'));
          });
        })
        .catch(() => {});
    },
    handleOpenClose() {
      this.$refs.usbTableRef.reload();
    },
  },
};
</script>
