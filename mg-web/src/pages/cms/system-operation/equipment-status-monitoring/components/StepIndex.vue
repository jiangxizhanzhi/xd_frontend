<template>
  <cb-inner-page
    :background="true"
    title="设备状态管理"
  >
    <div class="steps">
      <cb-steps
        :active="active"
        :data="data"
      > </cb-steps>
    </div>
    <div>
      <keep-alive>
        <component
          :is="activeComponent"
          :id="id"
          :role-set="roleSet"
          :form-data="formData"
          :categoryData="categoryData"
          @change-role="changeRole"
        ></component>
      </keep-alive>
    </div>
  </cb-inner-page>
</template>

<script>
import { mapState } from 'vuex';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import {
  getDeviceCategory,
  getEditBackData,
} from '../../../../../api/device/real';
export default {
  name: 'TabIndex',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  components: { Step1, Step2, Step3 },
  data() {
    return {
      dataCommon: [
        {
          title: this.$t('device.baseSet'),
        },
        {
          title: this.$t('device.accessSet'),
        },
        {
          title: this.$t('device.collectionSet'),
        },
      ],
      data: [],
      roleSet: [], // 根据角色判断步骤条
      formData: undefined, // 实装设备表单数据
      categoryData: undefined, // 分类数据
    };
  },
  computed: {
    activeComponent: function () {
      return `Step${this.$store.state.real.active}`;
    },
    ...mapState({
      active: (state) => state.real.active,
    }),
  },
  created() {
    getDeviceCategory().then((res) => {
      this.categoryData = res;
      if (this.id) {
        getEditBackData(this.id).then((res) => {
          this.formData = res;
        });
      }
    });
  },
  mounted() {
    this.$store.commit({
      type: 'real/setActive',
      active: 1,
    });
  },
  methods: {
    changeRole(role) {
      if (!role) return;
      this.roleSet = role;
      if (role.includes(52)) {
        // 硬件外设
        this.data = [this.dataCommon[0], this.dataCommon[1]];
      } else {
        this.data = this.dataCommon;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.steps {
  padding: 16px 100px;
  background: var(--bg-color-2);
}
</style>
