<template>
  <cb-inner-page :background="false">
    <cb-search-table
      class="content-bgc"
      :cols="cols"
      :url="url"
      baseURL="/api/vuln"
      :data="model"
      search-bar-bg
      ref="listRef"
    >
      <template v-slot:search>
        <cb-checkbox v-model="model.verified" @change="changeVerify">{{
          $t('exp.verified')
        }}</cb-checkbox>
        <cb-checkbox v-model="isHasApp">{{ $t('exp.hasApp') }}</cb-checkbox>
      </template>
      <template v-slot:filter>
        <cb-select
          v-model="model.type"
          :options="selectList_type"
          :placeholder="$t('exp.selectType')"
          clearable
        ></cb-select>
        <cb-select
          v-model="model.platform"
          :options="selectList_platform"
          :placeholder="$t('exp.selectPlatform')"
          clearable
        ></cb-select>
        <cb-search-input
          v-model="model.content"
          :placeholder="$t('exp.enterContent')"
        ></cb-search-input>
        <cb-search-input
          v-model="model.author"
          :placeholder="$t('exp.enterAuthor')"
        ></cb-search-input>
        <cb-search-input
          v-model="model.title"
          :placeholder="$t('exp.enterTitle')"
        ></cb-search-input>
        <cb-search-input
          v-model="model.cve"
          :placeholder="$t('exp.enterCve')"
        ></cb-search-input>
      </template>
      <template v-slot:title="scope">
        <span
          class="name-field"
          style="cursor: pointer"
          @click="detailRow(scope.data)"
          >{{ scope.data.title }}</span
        >
      </template>
      <template v-slot:download="scope">
        <a :href="scope.data.download_url">
          <cb-iconfont class="down-link" type="icon-xiazai"></cb-iconfont>
        </a>
      </template>
      <template v-slot:apply="scope">
        <cb-iconfont
          :class="['normal', { yellow: scope.data.application_url }]"
          type="icon-yingyongxitong"
        ></cb-iconfont>
      </template>
      <template v-slot:verified="scope">
        <cb-iconfont
          class="green"
          type="icon-chenggong"
          v-if="scope.data.verified"
        ></cb-iconfont>
        <cb-iconfont class="red" type="icon-cuowu" v-else></cb-iconfont>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import categorylist from '@/constants/model/explist';
export default {
  data() {
    return {
      url: '/web/vuln/tools/exploit/list',
      selectList_type: [],
      selectList_platform: [],
      model: {
        verified: '',
        has_app: '',
        type: '',
        platform: '',
        content: '',
        author: '',
        title: '',
        cve: '',
      },
      cols: [
        {
          label: this.$t('exp.title'),
          slot: 'title',
          width: 600,
        },
        {
          label: this.$t('exp.download'),
          slot: 'download',
        },
        {
          label: this.$t('exp.apply'),
          slot: 'apply',
        },
        {
          label: this.$t('exp.verification'),
          slot: 'verified',
        },
        {
          label: this.$t('exp.resType'),
          prop: 'type',
        },
        {
          label: this.$t('exp.platform'),
          prop: 'platform',
        },
        {
          label: this.$t('exp.author'),
          prop: 'author',
        },
        {
          label: this.$t('exp.date'),
          prop: 'date',
          width: 120,
        },
      ],
      tableData: [],
    };
  },
  computed: {
    isHasApp: {
      get() {
        let { has_app } = this.model;
        return has_app;
      },
      set(val) {
        this.model.has_app = val ? true : '';
      },
    },
  },
  created() {
    this.selectList_type = this.selectOptionsFilter(categorylist.type);
    this.selectList_platform = this.selectOptionsFilter(categorylist.platform);
  },
  beforeDestroy() {},
  mounted() {},
  methods: {
    changeVerify(nv) {
      if (nv == false) {
        this.model.verified = '';
      }
    },
    selectOptionsFilter(data) {
      return data.map((item) => {
        return {
          label: item.title,
          value: item.title,
        };
      });
    },
    detailRow(row) {
      if (row.label !== this.$t('exp.resDownload')) {
        this.$router.push({
          path: `/vuln/tool_exp_details/${row.id}/`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.name-field {
  cursor: pointer;
  color: var(--primary-color);
}
.down-link {
  cursor: pointer;
  color: var(--primary-color) !important;
}
.normal {
  color: var(--neutral4);
  opacity: 0.6;
}
.yellow {
  color: var(--orange-color);
  opacity: 1;
}
.red {
  color: var(--red-color);
}
.green {
  color: var(--green-color);
}
</style>
