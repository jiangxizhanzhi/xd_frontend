<template>
  <cb-inner-page
    :background="true"
    title="接口管理"
  >
    <cb-search-table
      rowKey="id"
      :cols="cols"
      :url="url"
      :baseURL="baseURL"
      :data.sync="query"
      ref="tableRef"
      :searchBarBg="true"
      :show-search-btn="true"
    >
      <!-- :selector="selector"
      :selection.sync="selection" -->
      <template v-slot:filter>
        <cb-search-input
          v-model="query.desc"
          :placeholder="$t('请输入备注')"
        />
      </template>
      <template v-slot:search>
        <cb-button
          button-type="add"
          link-name="interface-add"
        ></cb-button>
        <!-- <cb-button
          hollow
          button-type="delete"
          :disabled="selection.length === 0"
          @click="deleteRow(selection, $event)"
        ></cb-button> -->
      </template>
      <template v-slot:operate="scope">
        <cb-button
          type="text"
          @click="edit(scope.data)"
          mr
        >{{ $t('编辑') }}</cb-button>
        <cb-button
          type="text"
          @click="deleteRow(scope.data, $event)"
          mr
        >{{ $t('删除') }}</cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import {deleteInterface} from "../../../../api/interface-management";

export default {
  data() {
    return {
      url: '/devops/cluster/interface/page',
      baseURL: '/api/mp',
      query: {
        desc: '',
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('授权IP/域名'),
          prop: 'ip',
        },
        {
          label: this.$t('授权接口'),
          prop: 'path',
        },
        {
          label: this.$t('备注'),
          prop: 'desc',
        },
        {
          label: this.$t('systemOperation.monitorBusiness.operate'),
          slot: 'operate',
          width: 220,
        },
      ],
      loginUrlShow: false,
      loginUrlData: [],
    };
  },
  computed: {
  },
  created() { },
  mounted() {
  },
  beforeDestroy() {

  },
  methods: {
    edit(data) {
      this.$router.push({
        name: 'interface-edit',
        params: {
          id: data.id
        }
      })
    },
    // 登录
    login(data) {
      this.loginUrlData = data?.access_protocol_list || []
      this.loginUrlShow = true;
    },
    openNewWindow(url) {
      window.open(url, '_blank');
    },
    // 删除
    deleteRow(data, done) {
      // const ids = [];
      // if (data?.length) {
      //   data.forEach((item) => {
      //     ids.push(item.id);
      //   });
      // }
      this.$confirm(this.$t('确定删除') + '？').then(() => {
        deleteInterface(data.id)
          .then(() => {
            done();
            // this.selection = [];
            this.$refs.tableRef.reload();
          })
          .catch(() => {
            done(false);
          });
      });

    },
  },
};
</script>
<style lang="scss" scoped>
.icon {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  position: relative;
  top: -1px;
  right: 3px;
}

.icon-normal {
  background: var(--green-color);
}

.icon-abnormal {
  background: var(--red-color);
}

.circle {
  // background: var(--neutral1);
  font-size: 14px;
  height: 16px;
  width: 16px;
  display: inline-block;
  border-radius: 8px;
  color: var(--red-color);
}

.circle.active {
  // background: var(--green-color);
  color: var(--green-color);
}
</style>
