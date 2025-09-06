<template>
  <cb-inner-page :background="false">
    <cb-search-table
      :cols.sync="cols"
      row-key="resource_id"
      url="/wazuh/decoders"
      baseURL="/api/mp"
      :data.sync="model"
      ref="tableListRef"
      :searchBarBg="false"
    >
      <!-- <template v-slot:searchRightArea>
        <cb-button>{{ $t('probes.addFile') }}</cb-button>
      </template>
      <template v-slot:filter>
        <cb-select
          v-model="model.category"
          :placeholder="$t('probes.plzSelectType')"
          :first="{
            code: '',
            name: $t('probes.allTypes'),
          }"
          titleField="name"
          valueField="code"
          :options="options"
          clearable
        />
      </template> -->
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'TextParse',
  data() {
    return {
      options: [],
      tagNames: {},
      model: {
        category: '',
        search: '',
      },
      cols: [
        {
          label: this.$t('probes.name'),
          prop: 'name',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('probes.program'),
          getData(row) {
            return row?.details?.program_name?.pattern;
          },
        },
        {
          label: this.$t('probes.order'),
          getData(row) {
            return row?.details?.order;
          },
        },
        {
          label: this.$t('probes.file'),
          prop: 'filename',
        },
        {
          label: this.$t('probes.path'),
          prop: 'relative_dirname',
        },
      ],
    };
  },
  mounted() {},
  methods: {},
};
</script>
