<template>
  <cb-inner-page :background="false">
    <cb-search-table
      :cols="cols"
      :selector="selector"
      :selection.sync="selection"
      :url="url"
      :data.sync="model"
      ref="tableListRef"
      row-key="id"
      baseURL="/api/mp"
    >
      <template v-slot:search>
        <cb-button button-type="import" @click="showFlowSelectModal()">
          {{ $t('common.import') }}
        </cb-button>
        <cb-button
          hollow
          button-type="delete"
          @click="deleteSelectedRow(selection, $event)"
          :disabled="selection.length === 0"
        ></cb-button>
        <!-- <cb-button
          @click="goBack"
        >
          {{ $t('traffic.returnSchemeList') }}
        </cb-button> -->
      </template>
    </cb-search-table>
    <traffic-select-modal
      ref="flowSelectModal"
      @refreshTraffic="refreshTraffic"
    />
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import { deleteSchemeTraffic } from '@/api/traffic/traffic';
import TrafficSelectModal from './traffic_select_modal';

export default {
  name: 'SchemeTrafficList',
  components: { TrafficSelectModal },
  data() {
    return {
      url: '/flow/collection/detail/page',
      flow_list: [],
      selected_row: {},
      model: {
        collection_id: this.$route.params.resource_id,
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('table.title'),
          prop: 'title',
        },
        {
          label: this.$t('event.desc'),
          prop: 'flow_desc',
        },
        {
          label: this.$t('table.type'),
          getData: (row) => {
            if (row?.interactive_type === 0) {
              return this.$CONSTANT.Traffic.TrafficType.BACKGROUND.name.toString();
            } else {
              return this.$CONSTANT.Traffic.TrafficType.INTELLIGENT.name.toString();
            }
          },
        },
        {
          label: this.$t('common.createTime'),
          prop: 'create_time',
        },
      ],
    };
  },
  methods: {
    showFlowSelectModal() {
      this.$refs.flowSelectModal.show();
    },
    refreshTraffic() {
      this.reload();
    },
    goBack() {
      this.$router.push({
        path: `/admin/traffic/scheme`,
      });
    },
    reload() {
      this.$refs.tableListRef.reload();
    },
    /* 删除 */
    deleteSelectedRow(data, done) {
      if (data?.length) {
        let list = [];
        data.forEach((item) => {
          list.push(item.id);
        });
        deleteSchemeTraffic(this.model.collection_id, list)
          .then(() => {
            done();
            this.selection = [];
            this.reload();
          })
          .catch((err) => {
            this.$serverError(err);
          });
      }
    },
  },
};
</script>

<style scoped></style>
