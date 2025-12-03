<template>
  <cb-inner-page
    :background="true"
    title="超融合设备管理"
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
          v-model="query.name"
          :placeholder="$t('请输入平台名称')"
        />
      </template>
      <template v-slot:search>
        <cb-button
          button-type="add"
          link-name="business-service-monitoring-add"
        ></cb-button>
        <!-- <cb-button
          hollow
          button-type="delete"
          :disabled="selection.length === 0"
          @click="deleteRow(selection, $event)"
        ></cb-button> -->
      </template>

      <template v-slot:params="scope">
        <div>{{
          `CPU:${JSON.parse(scope.data.params).cpu}核;磁盘:${JSON.parse(scope.data.params).disk}G;内存:${JSON.parse(scope.data.params).memory}G`
        }}</div>
      </template>
      <template v-slot:in_position="scope">
        <span :class="['circle', { active: scope.data.in_position === 1 }]">
          {{ scope.data.in_position === 1 ? '正常' : '异常' }}
        </span>
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
<!--        <cb-popover-->
<!--          placement="left"-->
<!--          width="280"-->
<!--          trigger="click"-->
<!--        >-->
<!--          <template>-->
<!--            <div-->
<!--              style="margin-bottom: 5px"-->
<!--              v-for="(item, index) in loginUrlData"-->
<!--              :key="index"-->
<!--            >-->
<!--              <div>-->
<!--                <span>{{ $t('device.acceEnv') }}：</span>-->
<!--                <span>{{ item.protocol }} </span><span>{{ item.hostname }} </span><span>{{ item.port }} </span>-->
<!--              </div>-->
<!--              <div style="white-space: nowrap;">-->
<!--                <span>{{ $t('device.username') }}：</span>-->
<!--                <span>{{ item.username }}</span>-->
<!--                <span>{{ $t('device.password') }}：</span>-->
<!--                <span>{{ item.password }}</span>-->
<!--              </div>-->
<!--              &lt;!&ndash; <div-->
<!--                v-if="item.protocol === 'console'"-->
<!--                style="margin-top: 5px"-->
<!--              >-->
<!--                <cb-button @click="openNewWindow(item.url)">{{ item.protocol }}{{ $t('device.login') }}</cb-button>-->
<!--              </div> &ndash;&gt;-->
<!--            </div>-->
<!--          </template>-->
          <cb-button
            :disabled="!(scope.data.url)"
            slot="reference"
            type="text"
            @click="openNewWindow(scope.data.url)"
          >{{
            $t('远程连接') }}</cb-button>
<!--        </cb-popover>-->
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import { deletePlatform } from '@/api/business-service-monitoring.js'
export default {
  data() {
    return {
      url: '/devops/cluster/platform/page',
      baseURL: '/api/mp',
      query: {
        name: '',
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('平台名称'),
          prop: 'name',
          width: 250,
        },
        {
          label: this.$t('所属厂商'),
          prop: 'company',
          width: 200,
        },
        {
          label: this.$t('参数'),
          slot: 'params',
          width: 250,
        },
        {
          label: this.$t('架构类型'),
          prop: 'system_type',
        },
        {
          label: this.$t('创建者'),
          prop: 'create_user',
        },
        {
          label: this.$t('设备状态'),
          slot: 'in_position',
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
        name: 'business-service-monitoring-edit',
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
        deletePlatform(data.id)
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
