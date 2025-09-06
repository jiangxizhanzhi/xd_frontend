<template>
  <div class="exp-mgr">
    <cb-search-table
      ref="multipleTable"
      :url="`/admin/vuln/${resourceId}/exp/`"
      baseURL="/api/vuln"
      :cols="columns"
      hidePaginOnDemand
      :data.sync="query"
      row-key="resource_id"
      :searchBarBg="false"
    >
      <template v-slot:search>
        <cb-button button-type="add" @click="addExp"></cb-button>
      </template>
      <template v-slot:is_verify="scope">
        <verify :is_verify="scope.data.is_verify"></verify>
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
      :visible.sync="expShow"
      :title="$t('higherInfo.add')"
      height="450px"
      width="820px"
    >
      <exp-form
        :resourceId="resourceId"
        @cancel="reload"
        ref="expRef"
      ></exp-form>
      <template slot="footer">
        <cb-button
          button-type="confirm"
          loading
          mr
          @click="expConfirm"
        ></cb-button>
        <cb-button button-type="cancel" @click="cancel"></cb-button>
      </template>
    </cb-dialog>
  </div>
</template>
<script>
import Verify from '@/components/verify';
import ExpForm from './components/exp-form.vue';
import _ from 'lodash';
import { deleteVulnExp } from '@/api/vuln-cms';

export default {
  components: { Verify, ExpForm },
  data() {
    return {
      resourceId: '',
      query: {
        per_page: 100000,
        page: 1,
      },
      expShow: false,
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
        label: this.$t('higherInfo.author'),
        prop: 'creator',
      },
      {
        label: this.$t('higherInfo.isVerify'),
        slot: 'is_verify',
      },
      {
        label: this.$t('higherInfo.uploadTime'),
        prop: 'create_time',
      },
      {
        label: this.$t('common.operation'),
        slot: 'oper',
        width: 180,
      },
    ];
  },
  methods: {
    expConfirm(done) {
      this.$refs.expRef.expConfirm(done);
    },
    cancel() {
      this.expShow = false;
    },
    addExp() {
      this.expShow = true;
    },
    downLoadFile(row) {
      this.$request.filePathDownload(row.download_url);
    },
    deleteRow(row, done) {
      deleteVulnExp(row.id)
        .then((res) => {
          this.$refs['multipleTable'].reload();
          done();
        })
        .catch(() => {
          done(false);
        });
    },
    cancel() {
      this.expShow = false;
    },
    reload() {
      this.expShow = false;
      this.$refs['multipleTable'].reload();
    },
  },
};
</script>
