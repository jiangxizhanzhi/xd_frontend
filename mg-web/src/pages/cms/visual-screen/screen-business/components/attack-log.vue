<template>
  <div class="content-wrap">
    <ScrollTable
      :cols="cols"
      :data="data"
      :option="option"
      :cell-style="{ padding: '8px 8px' }"
      line-class="attack-log-line"
    ></ScrollTable>
  </div>
</template>
<script>
import ScrollTable from './scroll-table.vue';
export default {
  components: { ScrollTable },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      cols: [
        { label: this.$t('screenBusiness.time'), prop: 'time', width: '20%' },
        {
          label: this.$t('systemOperation.scene.resourceIp'),
          prop: 'source_ip',
          width: '30%',
        },
        {
          label: this.$t('screenBusiness.targetIp'),
          prop: 'target_ip',
          width: '30%',
        },
        {
          label: this.$t('screenBusiness.attackType'),
          prop: 'attack_type',
          width: '25%',
        },
      ],
      option: {
        direction: 'vertical',
        loop: true,
        autoplay: true,
        slidesPerView: 5,
      },
    };
  },
};
</script>
<style lang="scss">
.content-wrap {
  height: 100%;
  .attack-log-line {
    height: 32px;
    background: linear-gradient(
      270deg,
      rgba(45, 150, 255, 0.6) 0%,
      rgba(2, 39, 77, 0) 100%
    );
    .cell {
      padding: 8px 0 !important;
    }
    // margin-bottom: 4px;
  }
}
</style>
