<template>
  <cb-inner-page :background="false">
    <cb-search-table
      rowKey="resource_id"
      :cols.sync="cols"
      :selection.sync="selection"
      :url="url"
      :baseURL="baseURL"
      :data.sync="query"
      ref="tableRef"
      :searchBarBg="true"
    >
      <template v-slot:search>
        <cb-button
          button-type="add"
          link-name="collection-template-create"
        ></cb-button>
        <cb-button
          button-type="delete"
          hollow
          @click="deleteSelected(selection, $event)"
          :disabled="selection.length === 0"
        ></cb-button>
      </template>
      <template v-slot:filter>
        <cb-select
          v-model="query.os_types"
          :placeholder="$t('common.pleaseChoose')"
          :options="applicableSystems"
          :first="{ label: $t('probes.allOs'), value: '' }"
        />
        <cb-search-input
          v-model="query.name"
          :placeholder="$t('device.inputName')"
        ></cb-search-input>
      </template>
      <template v-slot:osType="scope">
        <span v-if="scope.data.os_type == '0'">Windows</span>
        <span v-else-if="scope.data.os_type == '1'">Unix</span>
        <span v-else-if="scope.data.os_type == '2'">Linux</span>
        <span v-else-if="scope.data.os_type == '3'">BSD</span>
        <span v-else>Other</span>
      </template>
      <template v-slot:operation="scope">
        <cb-button
          :link-name="{
            name: 'collection-template-edit',
            params: { id: scope.data.id },
          }"
          type="text"
          button-type="edit"
          mr
        ></cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import { PROBESTYPES, APPLICABLESYSTEMS, SCRIPTTYPELISTS } from '../constant';
export default {
  data() {
    return {
      url: '/collection/template/page',
      baseURL: '/api/mp',
      probesTypes: PROBESTYPES,
      applicableSystems: APPLICABLESYSTEMS,
      scriptTypes: SCRIPTTYPELISTS,
      selection: [],
      system: [],
      query: {
        os_types: '',
        name: '',
      },
      cols: [
        {
          label: this.$t('probes.name'),
          prop: 'name',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('probes.describe'),
          prop: 'description',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('probes.applicableSystem'),
          slot: 'osType',
        },
        {
          label: this.$t('common.creator'),
          prop: 'creator_name',
        },
        {
          label: this.$t('probes.probeNum'),
          prop: 'probe_counts',
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    deleteSelected(selection, done) {
      let ids = [];
      if (selection?.length) {
        selection.forEach((item) => {
          ids.push(item.id);
        });
      }
      this.$request
        .delete(`/collection/template/?ids=${ids}`, null, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          done();
          this.$refs.tableRef.reload();
          this.selection = [];
        })
        .catch(() => {});
    },
  },
};
</script>
<style scoped></style>
