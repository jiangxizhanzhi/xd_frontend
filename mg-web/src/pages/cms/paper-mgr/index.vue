<template>
  <cb-inner-page class="paper-mgr-list" :background="false">
    <cb-search-table
      ref="searchTable"
      hidePaginOnDemand
      :cols="columns"
      row-key="resource_id"
      :url="url"
      baseURL="/api/vuln"
      :data.sync="query"
    >
      <template slot="search">
        <!-- 新增 -->
        <cb-button button-type="add" @click="toAdd"></cb-button>
      </template>
      <template v-slot:filter>
        <!-- 分类 -->
        <cb-select
          v-model="query.category"
          :options="classifyList"
          :first="{ label: $t('common.allClassify'), value: '' }"
        ></cb-select>
        <!-- 搜索 -->
        <cb-search-input
          v-model="query.search"
          :placeholder="$t('paperMgr.pleaseEnterPaperName')"
          maxlength="30"
        ></cb-search-input>
      </template>
      <template v-slot:operate="scope">
        <!-- 编辑 -->
        <cb-button
          type="text"
          button-type="edit"
          mr
          @click="toEdit(scope.data)"
        ></cb-button>
        <!-- 删除 -->
        <cb-button
          type="text"
          button-type="delete"
          @click="toDelete(scope.data, $event)"
        >
        </cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import { classifyOptions } from '@/constants/index.js';
import { setBreadcrumbTitle } from '@cyber/ui';
import { getVulnDetail, deleteVulnPaper } from '@/api/vuln-cms';

export default {
  data() {
    return {
      resourceId: '',
      columns: [
        // 名称
        {
          label: this.$t('common.vulName'),
          prop: 'name',
        },
        // 类型
        {
          label: this.$t('common.type'),
          width: 300,
          getData(row) {
            return classifyOptions[row.category];
          },
        },
        // 上传时间
        {
          label: this.$t('paperMgr.uploadTime'),
          prop: 'create_time',
          width: 300,
        },
        // 操作
        {
          label: this.$t('common.operation'),
          slot: 'operate',
          width: 240,
        },
      ],
      query: {
        category: '',
        search: '',
      },
      // 分类
      classifyOptions,
      classifyList: classifyOptions.list,
    };
  },
  computed: {
    url() {
      return `/admin/vuln/${this.resourceId}/paper/`;
    },
  },
  created() {
    this.resourceId = this.$route.params.resource_id;
    if (this.resourceId) {
      this.getVulnDetail();
    }
  },
  methods: {
    getVulnDetail() {
      getVulnDetail(this.resourceId).then((res) => {
        setBreadcrumbTitle(_.get(res, 'data.data.name', ''));
      });
    },
    // 新增
    toAdd() {
      this.$router.push({
        name: 'vuln-paper-add',
        params: {
          resource_id: this.resourceId,
        },
      });
    },
    // 编辑
    toEdit(item) {
      this.$router.push({
        name: 'vuln-paper-edit',
        params: {
          resource_id: this.resourceId,
          paper_id: item.id,
        },
      });
    },
    // 删除
    toDelete(item, done) {
      deleteVulnPaper(item.id, {
        paperId: item.id,
      })
        .then(() => {
          this.$refs.searchTable.reload();
          done(true);
        })
        .catch(() => {
          done(false);
        });
    },
  },
};
</script>

<style scoped lang="scss"></style>
