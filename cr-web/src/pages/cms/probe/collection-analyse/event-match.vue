<template>
  <cb-inner-page :background="false">
    <cb-search-table
      :cols.sync="cols"
      row-key="resource_id"
      url="/wazuh/rules"
      baseURL="/api/mp"
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
      // options: [],
      // model: {
      //   category: '',
      //   search: '',
      // },
      cols: [
        {
          label: this.$t('traffic.description'),
          prop: 'description',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('probes.group'),
          prop: 'groups',
        },
        {
          label: this.$t('probes.compliance'),
          // prop: 'gdpr',
          getData(row) {
            return _.join(row.gdpr, '、');
          },
        },
        {
          label: this.$t('probes.level'),
          prop: 'level',
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
