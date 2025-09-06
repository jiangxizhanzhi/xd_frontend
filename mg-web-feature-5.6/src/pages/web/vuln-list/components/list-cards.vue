<template>
  <div class="vuln-list-cards">
    <div class="head">
      <div class="title-h">
        <tip-type :tipKey="itemData.level" />
        <div class="text-h" :title="itemData.name">{{ itemData.name }}</div>
      </div>
      <div class="new-time">
        <span>{{ $t('common.issueTime') + $t('common.colon') }}</span>
        <span>{{ itemData.publish_date }}</span>
      </div>
    </div>
    <div class="tag-info">
      <div class="industry block blue-block">
        {{ businessOptions[itemData.industry] }}
      </div>
      <div v-for="k in itemData.vuln_tag" :key="k" class="platform block">
        {{ k }}
      </div>
    </div>
    <div class="info-form">
      <div
        v-if="itemData.scene_img !== null || itemData.scene_config"
        class="scene-img left-info"
      >
        <img v-if="itemData.scene_img !== null" :src="itemData.scene_img" alt />
        <img v-else-if="itemData.scene_config" :src="DefaultPic" />
      </div>
      <div class="right-info">
        <div class="type-tip">
          <div class="use-type">
            <span class="use-type-tip">{{
              $t('common.useType') + $t('common.colon')
            }}</span>
            <span>{{ attackTypeOptions[itemData.utilize_category] }}</span>
          </div>
          <div class="platform">
            <span class="platform-type-tip">
              {{ $t('common.platform') + $t('common.colon') }}
            </span>
            <span>{{ itemData.platform || '-' }}</span>
          </div>
          <div class="poc-tip">
            <span class="poc-type-tip">
              {{ $t('vulnIndex.pocQuantity') + $t('common.colon') }}
            </span>
            <span>{{ itemData.poc_num || '0' }}</span>
          </div>
          <div class="exp-tip">
            <span class="exp-type-tip">
              {{ $t('vulnIndex.expQuantity') + $t('common.colon') }}
            </span>
            <span>{{ itemData.exp_num || '0' }}</span>
          </div>
        </div>
        <div class="vul-number">
          <span class="form-name">{{
            $t('common.vulNumber') + $t('common.colon')
          }}</span>
          <div class="form-content">
            <span v-if="itemData.code" class="code-delimiter">{{
              itemData.code.join($t('common.delimiter'))
            }}</span>
            <span v-else>{{ '-' }}</span>
          </div>
        </div>
        <div class="vul-number vul-impact">
          <span class="form-name">{{
            $t('common.vulnerabilityImpact') + $t('common.colon')
          }}</span>
          <div class="form-content">
            <div
              v-if="itemData.impact && itemData.impact.length > 0"
              class="number"
            >
              <div
                class="num-tip"
                v-for="(item, index) in itemData.impact[0]"
                :key="index"
              >
                <span v-if="impactTitle[index]">
                  {{ impactTitle[index] + $t('common.colon') }}
                </span>
                <span>{{ item }}</span>
              </div>
              <div
                v-if="itemData.impact && itemData.impact.length > 1"
                class="more-impact"
              >
                {{ $t('vulnIndex.totalPer', [itemData.impact.length]) }}
              </div>
            </div>
            <div v-if="itemData.impact && itemData.impact.length <= 0">
              {{ '-' }}
            </div>
          </div>
        </div>
        <div class="vul-number" v-if="itemData.attachment">
          <span class="form-name">{{
            $t('vulnDetail.softwareDownload') + $t('common.colon')
          }}</span>
          <div class="form-content">
            <cb-button
              icon="icon-xiazai"
              size="small"
              hollow
              @click.native.stop="attachmentUrl(itemData.attachment)"
              >{{ $t('vulnDetail.download') }}</cb-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TipType from '@/components/tip-type/tips.vue';
import { businessOptions, attackTypeOptions } from '@/constants/index.js';
import DefaultPic from '@/assets//img/vuln/pic_default.png';
export default {
  name: 'VulnWebListCards',
  components: {
    TipType,
  },
  props: {
    itemData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      //行业
      businessOptions,
      //利用类型
      attackTypeOptions,
      DefaultPic,
      impactTitle: [
        '',
        '',
        '',
        this.$t('vulnList.firm'),
        this.$t('vulnList.produce'),
        this.$t('vulnList.edition'),
        this.$t('vulnList.upgradeNumber'),
        this.$t('vulnList.version'),
        '',
        '',
        '',
        '',
        '',
      ],
    };
  },
  mounted() {},

  methods: {
    attachmentUrl(url) {
      this.$request.filePathDownload(url);
    },
  },
};
</script>

<style lang="scss" scoped>
.vuln-list-cards {
  width: 100%;
  min-height: 186px;
  background: var(--bg-color-2);
  padding: 16px 24px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--neutral1);
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background: var(--bg-color-3);
  }
  .head {
    width: 100%;
    height: 24px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .title-h {
      flex-grow: 1;
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      color: var(--neutral8);
      margin-right: 50px;
      padding-left: 1px;
      .text-h {
        margin-left: 8px;
        width: 100px;
        flex-grow: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .new-time {
      display: flex;
      color: var(--neutral8);
      font-size: 12px;
      font-weight: 400;
    }
  }
  .tag-info {
    width: 100%;
    height: 24px;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .block {
      padding: 0 8px;
      background: var(--neutral0);
      font-size: 12px;
      font-weight: 400;
      color: var(--neutral8);
      margin-right: 8px;
      height: 24px;
      line-height: 24px;
    }
    .blue-block {
      background: var(--primary-color-2);
      color: var(--primary-color);
    }
  }
  .info-form {
    width: 100%;
    min-height: 100px;
    display: flex;

    .right-info {
      width: 100%;
      .type-tip {
        width: 100%;
        display: flex;
        font-size: 14px;
        font-weight: 400;
        color: var(--neutral8);
        height: 22px;
        line-height: 22px;
        .use-type {
          margin-right: 24px;
        }
        .poc-tip {
          margin: 0 24px;
        }
        .use-type-tip,
        .platform-type-tip,
        .poc-type-tip,
        .exp-type-tip {
          color: var(--neutral8);
        }
      }
      .vul-number {
        display: flex;
        font-size: 14px;
        color: var(--neutral8);
        margin-top: 8px;
        min-height: 22px;
        line-height: 22px;
        .form-name {
          padding-right: 4px;
          color: var(--neutral8);
        }
        .form-content {
          flex: 1;
          .number {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            .num-tip {
              margin-right: 25px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
            .more-impact {
              color: var(--primary-color);
              cursor: pointer;
              line-height: 22px;
            }
          }
          .code-delimiter {
            word-break: break-word;
          }
        }
      }
    }
    .left-info {
      margin-right: 8px;
    }
    .scene-img {
      width: 135px;
      height: 90px;
      border: 1px solid var(--bg-color-3);
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .download-icon-box {
    height: 36px;
    line-height: 43px;
  }
}
</style>
