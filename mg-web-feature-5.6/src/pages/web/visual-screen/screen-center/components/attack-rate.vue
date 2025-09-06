<template>
  <div class="rate" ref="rateItemRef">
    <div
      v-for="(item, index) in attakRateData"
      :key="item.type"
      class="rate-item"
    >
      <div class="icon">
        <cb-iconfont
          :type="teamType == 'red' ? redIcon[index] : blueIcon[index]"
          :size="iconSize"
        ></cb-iconfont>
      </div>
      <div class="rate-text">
        <div class="rate-text-count-info">{{ item.text }}</div>
        <div class="rate-text-count">
          {{ item.count }}
          <span v-if="teamType == 'red' && item.type == 3">min</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, watch, ref, onBeforeUnmount } from '@vue/composition-api';
export default {
  name: 'AttackRate',
  props: {
    attakRateData: {
      type: Array,
      default: () => {},
    },
    teamType: {
      type: String,
      default: 'red',
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {},
  setup() {
    const rateItemRef = ref(null);
    const redIcon = ref([
      'icon-red_attacks',
      'icon-red_success_rate',
      'icon-red_time',
      'icon-red_control_machine',
    ]);
    const blueIcon = [
      'icon-blue_attacks',
      'icon-blue_success_rate',
      'icon-blue_time',
      'icon-blue_control_machine',
    ];
    function getIconSize() {
      iconSize.value = parseInt(rateItemRef.value.offsetHeight * 0.25);
    }
    let iconSize = ref(24);
    onMounted(() => {
      getIconSize();
    });
    return {
      rateItemRef,
      iconSize,
      redIcon,
      blueIcon,
    };
  },
};
</script>

<style scoped lang="scss">
.rate {
  margin-left: var(--header-left-20);
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  overflow: hidden;
  &-item {
    display: flex;
    width: 50%;
    height: 50%;
    .rate-text {
      color: #fff;
      font-size: var(--font-size-14);
      margin-left: 10px;
      flex: 1;
      .rate-text-count {
        margin-top: 9px;
        color: #efcc50;

        font-size: 24px;
        span {
          color: #fff;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
