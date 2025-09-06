<template>
  <cb-inner-page class="app-container" :background="false">
    <cb-search-table
      ref="resourceTableRef"
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
          link-name="dynamic-effects-resources-create"
        ></cb-button>
        <cb-button
          hollow
          button-type="delete"
          :disabled="selection.length === 0"
          @click="deleteRow(selection, $event)"
        ></cb-button>
      </template>
      <template v-slot:operation="scope">
        <cb-button
          :link-name="{
            name: 'dynamic-effects-resources-detail',
            params: { id: scope.data.uuid },
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
export default {
  name: 'index',
  components: {},
  data() {
    return {
      url: '/devops/cluster/virtual_usb/page',
      query: {
        name: '',
      },
      selection: [],
      columns: [
        {
          label: this.$t('device.name'),
          prop: 'name',
          width: 300,
          resizable: true,
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
    deleteRow(row, done) {
      // const ids = row.map((i) => {
      //   return i.uuid;
      // });
      // const params = {
      //   uuids: [...ids],
      // };
    },
  },
};
</script>
