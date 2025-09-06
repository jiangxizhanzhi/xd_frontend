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
      <template v-slot:filter>
        <cb-select
          v-model="model.platform"
          :options="selectList"
          :placeholder="$t('exp.selectPlatform')"
          clearable
        ></cb-select>
        <cb-search-input
          v-model="model.author"
          :placeholder="$t('exp.enterAuthor')"
        ></cb-search-input>
        <cb-checkbox v-model="model.edb_verified" @change="changeVerify">
          {{ $t('exp.verified') }}
        </cb-checkbox>
      </template>
      <template v-slot:title="scope">
        <span
          class="name-field"
          style="cursor: pointer"
          @click="detailRow(scope.data)"
        >
          {{ scope.data.title }}
        </span>
      </template>
      <template v-slot:download="scope">
        <a :href="scope.data.download_url">
          <cb-iconfont class="down-link" type="icon-xiazai"></cb-iconfont>
        </a>
      </template>
      <template v-slot:verified="scope">
        <cb-iconfont
          class="green"
          type="icon-chenggong"
          v-if="scope.data.edb_verified"
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
      url: '/web/vuln/tools/shellcode/list',
      selectList: [],
      model: {
        platform: '',
        author: '',
        edb_verified: '',
      },
      cols: [
        {
          label: this.$t('exp.title'),
          slot: 'title',
        },
        {
          label: this.$t('exp.download'),
          slot: 'download',
          width: 200,
        },
        {
          label: this.$t('exp.verification'),
          slot: 'verified',
          width: 200,
        },
        {
          label: this.$t('exp.platform'),
          prop: 'platform',
          width: 200,
        },
        {
          label: this.$t('exp.author'),
          prop: 'author',
          width: 200,
        },
        {
          label: this.$t('exp.date'),
          prop: 'published',
          width: 200,
        },
      ],
      tableDate: [],
    };
  },
  computed: {},
  created() {
    this.selectList = this.selectOptionsFilter(categorylist.platform);
  },
  beforeDestroy() {},
  mounted() {},
  methods: {
    changeVerify(nv) {
      if (nv == false) {
        this.model.edb_verified = '';
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
          path: `/vuln/tool_shell_details/${row.id}/`,
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
