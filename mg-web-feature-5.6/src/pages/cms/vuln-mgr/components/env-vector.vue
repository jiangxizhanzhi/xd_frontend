<template>
  <div class="vuln-env-vector">
    <div class="availability-index">
      <div class="tip-head">{{ $t('common.modifiedAvailabilityIndex') }}</div>
      <div class="select-all">
        <div class="select-box">
          <span>
            {{ $t('common.modifiedAttackVector') + $t('common.colon')
            }}<span class="shadow-holder">
              {{ $t('common.modifiedUserInteraction') + $t('common.colon') }}
            </span>
          </span>
          <cb-select
            v-model="env_vector.MAV"
            :options="vulnIndex_AV.list"
          ></cb-select>
        </div>
        <div class="select-box">
          <span>
            {{ $t('common.modifiedAttackComplexity') + $t('common.colon') }}
            <span class="shadow-holder">
              {{
                $t('common.modifiedPermissionRequirements') + $t('common.colon')
              }}
            </span>
          </span>
          <cb-select
            v-model="env_vector.MAC"
            :options="vulnIndex_MAC.list"
          ></cb-select>
        </div>
        <div class="select-box">
          <span>
            {{ $t('common.modifiedScopeIndex') + $t('common.colon')
            }}<span class="shadow-holder">
              {{ $t('common.modifiedUserInteraction') + $t('common.colon') }}
            </span>
          </span>
          <cb-select
            v-model="env_vector.MS"
            :options="vulnIndex_MS.list"
          ></cb-select>
        </div>
      </div>
      <div class="select-all">
        <div class="select-box">
          <span>
            {{ $t('common.modifiedUserInteraction') + $t('common.colon') }}
            <span class="shadow-holder">
              {{ $t('common.modifiedAttackVector') + $t('common.colon') }}
            </span>
          </span>
          <cb-select
            v-model="env_vector.MUI"
            :options="vulnIndex_MUI.list"
          ></cb-select>
        </div>
        <div class="select-box">
          <span>
            {{
              $t('common.modifiedPermissionRequirements') + $t('common.colon')
            }}
            <span class="shadow-holder">
              {{ $t('common.modifiedAttackComplexity') + $t('common.colon') }}
            </span>
          </span>
          <cb-select
            v-model="env_vector.MPR"
            :options="vulnIndex_MPR.list"
          ></cb-select>
        </div>
      </div>
    </div>
    <div class="influence-index">
      <div class="tip-head">{{ $t('common.modifiedImpactIndicators') }}</div>
      <div class="select-all">
        <div class="select-box">
          <span>
            {{
              $t('common.modifiedConfidentialityImpact') + $t('common.colon')
            }}
          </span>
          <cb-select
            v-model="env_vector.MC"
            :options="vulnIndex_MPR.list"
          ></cb-select>
        </div>
        <div class="select-box">
          <span>
            {{ $t('common.modifiedIntegrityImpact') + $t('common.colon') }}
          </span>
          <cb-select
            v-model="env_vector.MI"
            :options="vulnIndex_MPR.list"
          ></cb-select>
        </div>
        <div class="select-box">
          <span>
            {{ $t('common.modifiedAbilityImpact') + $t('common.colon')
            }}<span class="shadow-holder">
              {{
                $t('common.modifiedConfidentialityImpact') + $t('common.colon')
              }}
            </span>
          </span>
          <cb-select
            v-model="env_vector.MA"
            :options="vulnIndex_MPR.list"
          ></cb-select>
        </div>
      </div>
    </div>
    <div class="safety-requirements">
      <div class="tip-head">{{ $t('common.safetyRequirements') }}</div>
      <div class="select-all">
        <div class="select-box">
          <span>
            {{ $t('common.confidentialityRequirements') + $t('common.colon') }}
          </span>
          <cb-select
            v-model="env_vector.CR"
            :options="vulnIndex_CR.list"
          ></cb-select>
        </div>
        <div class="select-box">
          <span>
            {{ $t('common.integrityRequirements') + $t('common.colon') }}
          </span>
          <cb-select
            v-model="env_vector.IR"
            :options="vulnIndex_CR.list"
          ></cb-select>
        </div>
        <div class="select-box">
          <span>
            {{ $t('common.availabilityRequirements') + $t('common.colon')
            }}<span class="shadow-holder">
              {{
                $t('common.confidentialityRequirements') + $t('common.colon')
              }}
            </span>
          </span>
          <cb-select
            v-model="env_vector.AR"
            :options="vulnIndex_CR.list"
          ></cb-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleHead from '@/components/title/index.vue';
import {
  vulnIndex_AV,
  vulnIndex_MAC,
  vulnIndex_MPR,
  vulnIndex_MUI,
  vulnIndex_MS,
  vulnIndex_CR,
} from '@/constants/index.js';
export default {
  name: 'VulnWebEnvIndex',
  components: {
    TitleHead,
  },
  data() {
    return {
      env_vector: {
        MAV: vulnIndex_AV.orig[0],
        MAC: vulnIndex_MAC.orig[0],
        MPR: vulnIndex_MPR.orig[0],
        MUI: vulnIndex_MUI.orig[0],
        MS: vulnIndex_MS.orig[0],
        MC: vulnIndex_MPR.orig[0],
        MI: vulnIndex_MPR.orig[0],
        MA: vulnIndex_MPR.orig[0],
        CR: vulnIndex_CR.orig[0],
        IR: vulnIndex_CR.orig[0],
        AR: vulnIndex_CR.orig[0],
      },
      vulnIndex_AV,
      vulnIndex_MAC,
      vulnIndex_MPR,
      vulnIndex_MUI,
      vulnIndex_MS,
      vulnIndex_CR,
    };
  },
  watch: {
    env_vector: {
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
      this.env_vector = Object.assign({}, this.env_vector, val);
    },
  },
};
</script>

<style lang="scss" scoped>
.vuln-env-vector {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  color: var(--neutral8);
  .availability-index,
  .influence-index,
  .safety-requirements {
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
      display: flex;
      flex-wrap: wrap;
      .select-box {
        font-size: 14px;
        display: flex;
        justify-content: flex-start;
        line-height: var(--form-item-height);
        margin-right: 48px;
        margin-bottom: var(--form-item-margin-bottom);
        span {
          display: block;
          min-width: 120px;
          text-align: right;
        }
      }
      .select-box:last-child {
        margin-right: 0px;
      }
    }
  }
  .shadow-holder {
    height: 0px;
    visibility: hidden;
  }
}
</style>
