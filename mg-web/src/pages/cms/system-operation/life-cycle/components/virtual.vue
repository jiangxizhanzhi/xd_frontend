<template>
  <cb-search-table
    rowKey="id"
    ref="monitorListRef"
    :cols="cols"
    :data.sync="query"
    url="/devops/cluster/xd_source/vir_list"
    baseURL="/api/mp"
    :searchBarBg="true"
    :show-search-btn="false"
  >
    <template v-slot:operate="scope">
      <cb-button
        @click="powerOnOrOff(scope.data)"
        type="text"
        mr
      >{{ computedText(scope.data) }}</cb-button>
    </template>
  </cb-search-table>
</template>
<script>
import {
  postUpShut,
} from '@/api/system-op.ts';
export default {
  data() {
    return {
      query: {

      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('名称'),
          prop: 'name',
        },
        {
          label: this.$t('镜像名称'),
          prop: 'image_name',
        },
        {
          label: this.$t('ip'),
          prop: 'addr',
        },
        {
          label: this.$t('状态'),
          prop: 'status_display',
        },
        {
          label: this.$t('厂商名称'),
          prop: 'company_name',
        },
        {
          label: this.$t('操作'),
          slot: 'operate',
        },
      ],
    };
  },
  computed: {

  },
  watch: {},
  mounted() {
  },
  methods: {
    computedText(data) {
      if (data.status === 'ACTIVE') {
        return '关机';
      } else if (data.status === 'SHUTOFF') {
        return '开机';
      }
    },
    powerOnOrOff(data) {
      let text = '';
      let action = '';
      if (data.status === 'ACTIVE') {
        text = '确定关机？';
        action = 'power_off';
      } else if (data.status === 'SHUTOFF') {
        text = '确定开机？';
        action = 'power_on';
      }
      this.$confirm(this.$t(text)).then(() => {
        postUpShut({
          action: action,//开机时power_on  关机时power_off
          id: data.id,
          company: data.company
        }).then((res) => {
          this.$refs.monitorListRef.reload();
          this.$message({
            type: 'success',
            message: this.$t('操作成功'),
          });
        });
      });
    }
  },
};
</script>
<style lang="scss" scoped></style>
