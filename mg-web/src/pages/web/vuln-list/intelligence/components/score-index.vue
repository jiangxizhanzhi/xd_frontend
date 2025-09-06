<template>
  <div class="score-index">
    <div class="av tip-index">
      <span class="key-tip">{{ $t('common.attackVector') }}</span>
      <span class="value-tip">{{ scoreIndex.AV }}</span>
    </div>
    <div class="line"></div>
    <div class="ac tip-index">
      <span class="key-tip">{{ $t('common.attackComplexity') }}</span>
      <span class="value-tip" :class="`status-${scoreIndex.AC}`">{{
        scoreIndex.AC
      }}</span>
    </div>
    <div class="line"></div>
    <div class="pr tip-index">
      <span class="key-tip">{{ $t('common.permissionRequirements') }}</span>
      <span class="value-tip" :class="`status-${scoreIndex.PR}`">{{
        scoreIndex.PR
      }}</span>
    </div>
    <div class="line"></div>
    <div class="ui tip-index">
      <span class="key-tip">{{ $t('common.userInteraction') }}</span>
      <span class="value-tip" :class="`status-${scoreIndex.UI}`">{{
        scoreIndex.UI
      }}</span>
    </div>
    <div class="line"></div>
    <div class="s tip-index">
      <span class="key-tip">{{ $t('common.scopeIndex') }}</span>
      <span class="value-tip">{{ scoreIndex.S }}</span>
    </div>
    <div class="line"></div>
    <div class="c tip-index">
      <span class="key-tip">{{ $t('common.confidentialityImpact') }}</span>
      <span class="value-tip" :class="`status-${scoreIndex.C}`">{{
        scoreIndex.C
      }}</span>
    </div>
    <div class="line"></div>
    <div class="i tip-index">
      <span class="key-tip">{{ $t('common.integrityImpact') }}</span>
      <span class="value-tip" :class="`status-${scoreIndex.I}`">{{
        scoreIndex.I
      }}</span>
    </div>
    <div class="line"></div>
    <div class="a tip-index">
      <span class="key-tip">{{ $t('common.abilityImpact') }}</span>
      <span class="value-tip" :class="`status-${scoreIndex.A}`">{{
        scoreIndex.A
      }}</span>
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
import _ from 'lodash';
export default {
  name: 'VulnWebScoreIndex',
  props: {
    vectorData: {
      type: Object,
      default: () => {
        return {};
      },
    },
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
    };
  },
  computed: {
    scoreIndex() {
      if (!_.isEmpty(this.vectorData)) {
        return this.vectorData;
      } else {
        return this.vector;
      }
    },
  },
  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.score-index {
  width: 100%;
  height: 100%;
  display: flex;
  .tip-index {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    font-size: 12px;
    color: var(--neutral8);
    margin: 0 20px;
    width: 100%;
    height: 100%;
    .key-tip {
      width: 100%;
      height: 50%;
      margin-bottom: 5px;
    }
    .value-tip {
      width: 100%;
      height: 50%;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-color);
      // text-align: center;
    }
    .status-HIGH {
      color: var(--red-color);
    }
    .status-MEDIUM {
      color: var(--primary-color);
    }
    .status-LOW {
      color: var(--green-color);
    }
    .status-NONE {
      color: var(--neutral4);
    }
  }
  .line {
    width: 1px;
    height: 40px;
    background: var(--neutral1);
  }
}
</style>
