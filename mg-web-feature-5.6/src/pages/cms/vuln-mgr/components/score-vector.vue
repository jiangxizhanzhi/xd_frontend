<template>
  <div class="vuln-score-vector">
    <div class="availability-index">
      <div class="tip-head">{{ $t('common.availabilityIndex') }}</div>
      <div class="select-all">
        <div class="select-box">
          <span
            >{{ $t('common.attackVector') + $t('common.colon') }}
            <span class="shadow-holder">{{
              $t('common.userInteraction') + $t('common.colon')
            }}</span></span
          >

          <cb-select
            v-model="vector.AV"
            :options="vulnIndex_AV.list"
          ></cb-select>
        </div>
        <div class="select-box margin-box">
          <span>{{ $t('common.attackComplexity') + $t('common.colon') }}</span>
          <cb-select
            v-model="vector.AC"
            :options="vulnIndex_AC.list"
          ></cb-select>
        </div>
        <div class="select-box">
          <span>{{
            $t('common.permissionRequirements') + $t('common.colon')
          }}</span>
          <cb-select
            v-model="vector.PR"
            :options="vulnIndex_PR.list"
          ></cb-select>
        </div>
      </div>
      <div class="select-all">
        <div class="select-box">
          <span>{{ $t('common.userInteraction') + $t('common.colon') }}</span>
          <cb-select
            v-model="vector.UI"
            :options="vulnIndex_UI.list"
          ></cb-select>
        </div>
        <div class="select-box margin-box">
          <span
            >{{ $t('common.scopeIndex') + $t('common.colon')
            }}<span class="shadow-holder">{{
              $t('common.attackComplexity') + $t('common.colon')
            }}</span></span
          >
          <cb-select v-model="vector.S" :options="vulnIndex_S.list"></cb-select>
        </div>
      </div>
    </div>
    <div class="influence-index">
      <div class="tip-head">{{ $t('common.influenceIndex') }}</div>
      <div class="select-all">
        <div class="select-box">
          <span>{{
            $t('common.confidentialityImpact') + $t('common.colon')
          }}</span>
          <cb-select
            v-model="vector.C"
            :options="vulnIndex_PR.list"
          ></cb-select>
        </div>
        <div class="select-box margin-box">
          <span>{{ $t('common.integrityImpact') + $t('common.colon') }}</span>
          <cb-select
            v-model="vector.I"
            :options="vulnIndex_PR.list"
          ></cb-select>
        </div>
        <div class="select-box">
          <span>{{ $t('common.abilityImpact') + $t('common.colon') }}</span>
          <cb-select
            v-model="vector.A"
            :options="vulnIndex_PR.list"
          ></cb-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  vulnIndex_AV,
  vulnIndex_AC,
  vulnIndex_PR,
  vulnIndex_UI,
  vulnIndex_S,
} from '@/constants/index.js';
export default {
  name: 'VulnWebBasicInfo',
  props: {
    data: Object,
  },
  data() {
    return {
      vector: {
        AV: vulnIndex_AV.orig[0],
        AC: vulnIndex_AC.orig[0],
        PR: vulnIndex_PR.orig[0],
        UI: vulnIndex_UI.orig[0],
        S: vulnIndex_S.orig[0],
        C: vulnIndex_PR.orig[0],
        I: vulnIndex_PR.orig[0],
        A: vulnIndex_PR.orig[0],
      },
      vulnIndex_AV,
      vulnIndex_AC,
      vulnIndex_PR,
      vulnIndex_UI,
      vulnIndex_S,
    };
  },
  watch: {
    vector: {
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
      this.vector = Object.assign({}, this.vector, val);
    },
  },
};
</script>

<style lang="scss" scoped>
.vuln-score-vector {
  color: var(--neutral8);
  .availability-index {
    width: 100%;
  }
  .availability-index,
  .influence-index {
    display: flex;
    flex-wrap: wrap;
    padding-left: 14px;
    .tip-head {
      width: 100%;
      font-size: 14px;
      font-weight: bold;
      color: var(--neutral8);
      margin: 4px 0 16px;
    }
    .select-all {
      width: 100%;
      display: flex;
      font-size: 14px;
      margin-bottom: 24px;
      .select-box {
        display: flex;
        justify-content: flex-start;
        line-height: var(--form-item-height);
        span {
          display: block;
          min-width: 130px;
          text-align: right;
        }
      }
      .margin-box {
        margin: 0 32px;
      }
    }
  }
  .shadow-holder {
    height: 0px;
    visibility: hidden;
  }
}
</style>
