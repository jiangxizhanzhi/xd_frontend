<template>
  <ScrollTable
    :cols="cols"
    :data="data"
    :option="option"
    :cell-style="{ padding: '4px 10px' }"
    line-class="attack-port-line"
  >
    <template #rank="{ index }">
      <div class="rank-icon">
        <span>{{ index + 1 }}</span>
      </div>
    </template>
  </ScrollTable>
</template>
<script>
import { defineComponent } from '@vue/composition-api';
import ScrollTable from '../../components/scroll-table.vue';
export default defineComponent({
  name: 'AttackPort',
  components: { ScrollTable },
  props: {
    data: Array,
  },
  data() {
    return {
      cols: [
        { label: this.$t('mgRoutes.port'), prop: 'port', width: '15%' },
        {
          label: this.$t('mgRoutes.agreement'),
          prop: 'protocol',
          width: '25%',
        },
        {
          label: this.$t('mgRoutes.attackedNum'),
          prop: 'attack_number',
          width: '25%',
        },
        { label: this.$t('mgRoutes.flow'), prop: 'traffic_size', width: '20%' },
      ],
    };
  },
  setup() {
    // const cols = [
    //   { label: '', width: '15%', slot: 'rank' },
    //   { label: '端口', prop: 'port', width: '15%' },
    //   { label: '协议', prop: 'protocol', width: '25%' },
    //   { label: '受攻击/次', prop: 'attack_number', width: '25%' },
    //   { label: '流量/KB', prop: 'traffic_size', width: '20%' },
    // ];
    const option = {
      direction: 'vertical',
      loop: false,
      autoplay: false,
      slidesPerView: 5,
    };
    return {
      option,
    };
  },
});
</script>
<style lang="scss" scoped>
.rank-icon {
  height: 32px;
  background: url(~@/assets/img/visual-screen/screen-3/rank.png) center center /
    auto 80% no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 16px;
    font-family: youshebiaotihei !important;
    color: #ffffff;
    text-shadow: 0px 2px 4px #0a2558;
    background: linear-gradient(180deg, #ffffff 0%, #ccfff8 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
<style>
.attack-port-line {
  background: linear-gradient(
    270deg,
    rgba(7, 230, 230, 0.4) 0%,
    rgba(2, 39, 77, 0) 100%
  );
  margin-bottom: 4px;
}
</style>
