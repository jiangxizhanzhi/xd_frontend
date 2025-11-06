<template>
  <cb-inner-page :background="true" title="查看生命周期">
    <cb-tabs type="border-card" v-model="activeName" class="tab-wrap">
      <cb-tab-pane :label="$t('基本信息')" name="basic">
        <cb-form
          ref="elFormRef"
          label-position="right"
          label-width="150px"
          :model.sync="model.basic"
          json
        >
          <cb-form-item
            label="CPU："
            prop="cpu"
          >
            <div>{{model.basic.cpu}}</div>
          </cb-form-item>
          <cb-form-item
            label="内存："
            prop="cpu"
          >
            <div>{{model.basic.cpu}}</div>
          </cb-form-item>
          <cb-form-item
            label="硬盘总量："
            prop="cpu"
          >
            <div>{{model.basic.cpu}}</div>
          </cb-form-item>
          <cb-form-item
            label="虚拟机器分配数量："
            prop="cpu"
          >
            <div>{{model.basic.cpu}}</div>
          </cb-form-item>
          <cb-form-item
            label="容器数量："
            prop="cpu"
          >
            <div>{{model.basic.cpu}}</div>
          </cb-form-item>
        </cb-form>
      </cb-tab-pane>
      <cb-tab-pane :label="$t('物理资源')" name="physical">
        <physical-info></physical-info>
      </cb-tab-pane>
      <cb-tab-pane :label="$t('虚拟资源')" name="virtual">
        <cb-search-table
          ref="monitorListRef"
          url="/cscene/cscene_instances/list_stat"
          baseURL="/api/mp"
          :searchBarBg="true"
          :show-search-btn="false"
          :cols="virtualCols"
        >
          <template #operation="{row}">
            <cb-button type="text" size="small">分析</cb-button>
          </template>
        </cb-search-table>
      </cb-tab-pane>
    </cb-tabs>
  </cb-inner-page>
</template>

<script>
import physicalInfo from "./physical-info";

export default {
  name: "detail",
  components: {
    physicalInfo,
  },
  props: {},
  data() {
    return {
      activeName: 'basic',
      model: {
        basic: {
          cpu: '128',
          memory: '128',
          disk: '128',

        },
        physical: {},
        virtual: {},
      },
      virtualCols: [
        {
          title: 'CPU',
          prop: '',
        },
        {
          title: '内存',
          prop: '',
        },
        {
          title: '硬盘总量',
          prop: '',
        },
        {
          title: '虚拟机器分配数量',
          prop: '',
        },
        {
          title: '容器数量',
          prop: '',
        },
        {
          title: '操作',
          slot: 'operation',
        }
      ],
    }
  },
  setup(props, {emit}) {
    return {}
  }
}
</script>

<style scoped lang="scss">
.tab-wrap {
  padding-top: 16px;
}
</style>
