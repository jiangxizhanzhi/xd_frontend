<template>
  <div class="more-index-dialog">
    <cb-dialog
      :visible.sync="visible"
      @close="closed"
      width="fit-content"
      :title="$t('vulnDetail.moreIndicators')"
    >
      <div class="content">
        <div class="time-index">
          <title-head :name="$t('common.timeScoreIndex')" />
          <div class="time-index-content">
            <div class="e">
              <span>{{
                $t('common.exploitCodeMaturity') + $t('common.colon')
              }}</span>
              <span>{{ timeIndex.E }}</span>
            </div>
            <div class="rl">
              <span>{{ $t('common.repairLevel') + $t('common.colon') }}</span>
              <span>{{ timeIndex.RL }}</span>
            </div>
            <div class="rc">
              <span>{{
                $t('common.reportConfidence') + $t('common.colon')
              }}</span>
              <span>{{ timeIndex.RC }}</span>
            </div>
          </div>
        </div>
        <div class="env-index">
          <title-head :name="$t('common.environmentalScoringIndex')" />
          <div class="env-index-content">
            <div class="top">
              <div class="title-tip">
                {{ $t('common.modifiedAvailabilityIndex') }}
              </div>
              <div class="mav">
                <div>
                  <span>{{
                    $t('common.modifiedAttackVector') + $t('common.colon')
                  }}</span>
                  <span>{{ envIndex.MAV }}</span>
                  <div class="shadow-holder">
                    <span>
                      {{
                        $t('common.modifiedUserInteraction') +
                        $t('common.colon')
                      }}
                    </span>
                    <span>{{ envIndex.MUI }}</span>
                  </div>
                </div>
                <div>
                  <span>
                    {{
                      $t('common.modifiedAttackComplexity') + $t('common.colon')
                    }}
                  </span>
                  <span>{{ envIndex.MAC }}</span>
                </div>
                <div>
                  <span>
                    {{
                      $t('common.modifiedPermissionRequirements') +
                      $t('common.colon')
                    }}
                  </span>
                  <span>{{ envIndex.MPR }}</span>
                </div>
              </div>
              <div class="mui">
                <div>
                  <span>
                    {{
                      $t('common.modifiedUserInteraction') + $t('common.colon')
                    }}
                  </span>
                  <span>{{ envIndex.MUI }}</span>
                  <div class="shadow-holder">
                    <span>{{
                      $t('common.modifiedAttackVector') + $t('common.colon')
                    }}</span>
                    <span>{{ envIndex.MAV }}</span>
                  </div>
                </div>
                <div>
                  <span>{{
                    $t('common.modifiedScopeIndex') + $t('common.colon')
                  }}</span>
                  <span>{{ envIndex.MS }}</span>
                </div>
              </div>
            </div>
            <div class="medium">
              <div class="title-tip">
                {{ $t('common.modifiedImpactIndicators') }}
              </div>
              <div class="mav">
                <div>
                  <span>
                    {{
                      $t('common.modifiedConfidentialityImpact') +
                      $t('common.colon')
                    }}
                  </span>
                  <span>{{ envIndex.MC }}</span>
                </div>
                <div>
                  <span>
                    {{
                      $t('common.modifiedIntegrityImpact') + $t('common.colon')
                    }}
                  </span>
                  <span>{{ envIndex.MI }}</span>
                </div>
                <div>
                  <span>
                    {{
                      $t('common.modifiedAbilityImpact') + $t('common.colon')
                    }}
                  </span>
                  <span>{{ envIndex.MA }}</span>
                </div>
              </div>
            </div>
            <div class="low">
              <div class="title-tip">{{ $t('common.safetyRequirements') }}</div>
              <div class="mav">
                <div>
                  <span>
                    {{
                      $t('common.confidentialityRequirements') +
                      $t('common.colon')
                    }}
                  </span>
                  <span>{{ envIndex.CR }}</span>
                </div>
                <div>
                  <span>
                    {{
                      $t('common.integrityRequirements') + $t('common.colon')
                    }}
                  </span>
                  <span>{{ envIndex.IR }}</span>
                </div>
                <div>
                  <span>
                    {{
                      $t('common.availabilityRequirements') + $t('common.colon')
                    }}
                  </span>
                  <span>{{ envIndex.AR }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </cb-dialog>
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
  vulnIndex_E,
  vulnIndex_RL,
  vulnIndex_RC,
} from '@/constants/index.js';
import _ from 'lodash';
export default {
  name: 'VulnWebMoreDialog',
  components: {
    TitleHead,
  },
  props: {
    timeVector: {
      type: Object,
      default: () => {
        return {};
      },
    },
    envVector: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      visible: true,
      time_vector: {
        E: vulnIndex_E.orig[0],
        RL: vulnIndex_RL.orig[0],
        RC: vulnIndex_RC.orig[0],
      },
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
    };
  },
  computed: {
    timeIndex() {
      if (this.timeVector && !_.isEmpty(this.timeVector)) {
        return this.timeVector;
      } else {
        return this.time_vector;
      }
    },
    envIndex() {
      if (this.envVector && !_.isEmpty(this.envVector)) {
        return this.envVector;
      } else {
        return this.env_vector;
      }
    },
  },
  mounted() {},

  methods: {
    closed() {
      this.$emit('closed');
    },
  },
};
</script>

<style lang="scss" scoped>
.more-index-dialog {
  .content {
    width: max-content;
    height: 100%;
    display: flex;
    flex-direction: column;
    .time-index {
      width: fit-content;
      min-width: 100%;
      height: 88px;
      margin-bottom: 16px;
      font-size: 14px;
      color: var(--neutral8);
      .time-index-content {
        width: 100%;
        max-width: 1200px;
        background: var(--bg-color-3);
        padding: 16px 16px;
        margin-top: 8px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        div {
          margin-right: 40px;
        }
      }
    }
    .env-index {
      width: fit-content;
      height: calc(100% - 116px);
      font-size: 14px;
      color: var(--neutral8);
      .env-index-content {
        width: fit-content;
        max-width: 1200px;
        height: 100%;
        display: flex;
        flex-direction: column;
        .top,
        .medium,
        .low {
          width: fit-content;
          min-width: 100%;
          background: var(--bg-color-3);
          margin-top: 8px;
          padding: 16px 16px 0px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .top,
        .medium,
        .low {
          .title-tip {
            font-weight: bold;
            color: var(--neutral8);
          }
          .title-tip,
          .mav,
          .mui {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            div:not(.shadow-holder) {
              margin-right: 40px;
            }
          }
          .mav,
          .mui {
            justify-content: flex-start;
          }
          .shadow-holder {
            height: 0px;
            visibility: hidden;
            margin-right: 0px;
          }
        }
      }
    }
  }
}
</style>
