<template>
  <cb-inner-page
    :background="true"
    title="生命周期管理"
  >
    <cb-tabs v-model="activeName">
      <cb-tab-pane
        :label="$t('物理机列表')"
        :name="'physical'"
      >
        <physical v-if="activeName ==='physical'"></physical>
      </cb-tab-pane>
      <cb-tab-pane
        :label="$t('虚拟机列表')"
        :name="'virtual'"
      > 
        <virtual v-if="activeName === 'virtual'">
        </virtual>
      </cb-tab-pane>
    </cb-tabs>

  </cb-inner-page>
</template>
<script>
import physical from './components/physical.vue';
import virtual from './components/virtual.vue';
export default {
  components:{
    physical,
    virtual
  },
  data() {
    return {
      activeName: 'physical',
    };
  },
  mounted() {
  },
  methods: {}
};
</script>
<style lang="scss" scoped></style>
