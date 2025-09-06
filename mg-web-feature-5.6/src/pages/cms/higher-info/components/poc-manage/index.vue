<template>
  <div class="poc-mgr">
    <cb-search-table
      ref="multipleTable"
      :url="`/admin/vuln/${resourceId}/poc/`"
      baseURL="/api/vuln"
      :cols="columns"
      hidePaginOnDemand
      :data.sync="query"
      row-key="resource_id"
      :searchBarBg="false"
    >
      <template v-slot:search>
        <cb-button button-type="add" @click="addPoc"></cb-button>
      </template>
      <template v-slot:oper="scope">
        <cb-button type="text" @click="downLoadFile(scope.data)" mr>{{
          $t('higherInfo.download')
        }}</cb-button>
        <cb-button
          button-type="delete"
          type="text"
          @click="deleteRow(scope.data, $event)"
        ></cb-button>
      </template>
    </cb-search-table>
    <cb-dialog
      :visible.sync="pocShow"
      :title="$t('higherInfo.add')"
      height="320px"
      width="720px"
    >
      <poc-form
        :resourceId="resourceId"
        @cancel="reload"
        ref="pocRef"
      ></poc-form>
      <template slot="footer">
        <cb-button
          button-type="confirm"
          loading
          mr
          @click="pocConfirm"
        ></cb-button>
        <cb-button button-type="cancel" @click="cancel"></cb-button>
      </template>
    </cb-dialog>
  </div>
</template>
<script>
import PocForm from './components/poc-form.vue';
import _ from 'lodash';
import { deleteVulnPoc } from '@/api/vuln-cms';

export default {
  components: { PocForm },
  data() {
    return {
      resourceId: '',
      query: {
        per_page: 100000,
        page: 1,
      },
      pocShow: false,
    };
  },
  created() {
    this.resourceId = this.$route.params.resource_id;
    this.columns = [
      {
        label: this.$t('common.vulName'),
        prop: 'name',
      },
      {
        label: this.$t('higherInfo.uploadTime'),
        prop: 'create_time',
      },
      {
        label: this.$t('common.operation'),
        slot: 'oper',
        width: 200,
      },
    ];
  },
  methods: {
    pocConfirm(done) {
      this.$refs.pocRef.pocConfirm(done);
    },
    cancel() {
      this.pocShow = false;
    },
    reload() {
      this.pocShow = false;
      this.$refs['multipleTable'].reload();
    },
    addPoc() {
      this.pocShow = true;
    },
    downLoadFile(row) {
      this.$request.filePathDownload(row.download_url);
    },
    deleteRow(row, done) {
      deleteVulnPoc(row.id)
        .then((res) => {
          this.$refs['multipleTable'].reload();
          done();
        })
        .catch(() => {
          done(false);
        });
    },
  },
};
</script>
