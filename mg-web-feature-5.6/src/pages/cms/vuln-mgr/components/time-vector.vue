<template>
  <div class="vuln-time-vector">
    <div class="select-box" style="margin-left: 16px">
      <span>{{ $t('common.exploitCodeMaturity') + $t('common.colon') }}</span>
      <cb-select
        v-model="time_vector.E"
        :options="vulnIndex_E.list"
      ></cb-select>
    </div>
    <div class="select-box">
      <span>{{ $t('common.repairLevel') + $t('common.colon') }}</span>
      <cb-select
        v-model="time_vector.RL"
        :options="vulnIndex_RL.list"
      ></cb-select>
    </div>
    <div class="select-box">
      <span>{{ $t('common.reportConfidence') + $t('common.colon') }}</span>
      <cb-select
        v-model="time_vector.RC"
        :options="vulnIndex_RC.list"
      ></cb-select>
    </div>
  </div>
</template>

<script>
import TitleHead from '@/components/title/index.vue';
import { vulnIndex_E, vulnIndex_RL, vulnIndex_RC } from '@/constants/index.js';
export default {
  name: 'VulnWebTimeIndex',
  components: {
    TitleHead,
  },
  data() {
    return {
      time_vector: {
        E: vulnIndex_E.orig[0],
        RL: vulnIndex_RL.orig[0],
        RC: vulnIndex_RC.orig[0],
      },
      vulnIndex_E,
      vulnIndex_RL,
      vulnIndex_RC,
    };
  },
  watch: {
    time_vector: {
      handler(val) {
        this.$emit('update:data', val);
      },
      immediate: true,
      deep: true,
    },
  },

  mounted() {},

  methods: {
    setData(val) {
      this.time_vector = Object.assign({}, this.time_vector, val);
    },
  },
};
</script>

<style lang="scss" scoped>
.vuln-time-vector {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  color: var(--neutral8);
  .select-box {
    font-size: 14px;
    margin-right: 64px;
    margin-bottom: 24px;
  }
  span {
    display: inline-block;
    min-width: 120px;
    text-align: right;
  }
  .select-box:last-child {
    margin-right: 0px;
  }
}
</style>
