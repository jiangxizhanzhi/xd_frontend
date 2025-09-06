<template>
  <ScrollTable
    :cols="cols"
    :data="data"
    :option="option"
    :cell-style="{ padding: '8px 8px' }"
    line-class="attack-log-line"
  ></ScrollTable>
</template>
<script>
import { defineComponent } from '@vue/composition-api';
import ScrollTable from '../../components/scroll-table.vue';
export default defineComponent({
  name: 'AttackLog',
  components: { ScrollTable },
  props: {
    data: Array,
  },
  data() {
    return {
      cols: [
        {
          label: this.$t('mgRoutes.attackType'),
          prop: 'attack_type',
          width: '25%',
        },
        { label: this.$t('mgRoutes.time'), prop: 'time', width: '20%' },
        {
          label: this.$t('mgRoutes.sourceIP'),
          prop: 'source_ip',
          width: '30%',
        },
        {
          label: this.$t('mgRoutes.targetIP'),
          prop: 'target_ip',
          width: '30%',
        },
      ],
    };
  },
  setup() {
    //     const cols = [
    //       // { label: '时间01', prop: 'time', width: '20%' },
    //       // { label: '源IP', prop: 'source_ip', width: '30%' },
    //       // { label: '目标IP', prop: 'target_ip', width: '30%' },
    //       // { label: '攻击类型', prop: 'attack_type', width: '25%' },
    // },
    //     ];
    const option = {
      direction: 'vertical',
      autoplay: true,
      slidesPerView: 4,
    };
    return {
      option,
    };
  },
});
</script>
<style lang="scss">
.attack-log-line {
  background: linear-gradient(
    270deg,
    rgba(2, 39, 77, 0) 0%,
    rgba(128, 191, 255, 0.6) 100%
  );
  .cell {
    padding: 8px 0 !important;
  }
  // margin-bottom: 4px;
}
</style>
