<template>
  <div class="vuln-list-cards">
    <div class="head">
      <div class="title-h">
        <tip-type :tipKey="itemData.level" />
        <div class="text-h" :title="itemData.name">{{ itemData.name }}</div>
        <div class="industry block blue-block">
          {{ businessOptions[itemData.industry] }}
        </div>
      </div>
      <div class="new-time">
        <span>{{ $t('common.issueTime') + $t('common.colon') }}</span>
        <span>{{ itemData.publish_date }}</span>
      </div>
    </div>
    <div class="info-form">
      <div class="right-info">
        <div class="type-tip">
          <div class="use-type">
            <cb-iconfont class="green" type="icon-liuliangguanli"></cb-iconfont>
            <span class="use-type-tip">{{
              $t('common.useType') + $t('common.colon')
            }}</span>
            <span>{{ attackTypeOptions[itemData.utilize_category] }}</span>
          </div>
          <div class="platform">
            <cb-iconfont
              class="green"
              type="icon-changjingguanli"
            ></cb-iconfont>
            <span class="platform-type-tip">
              {{ $t('common.platform') + $t('common.colon') }}
            </span>
            <span>{{ itemData.platform || '-' }}</span>
          </div>
          <div class="poc-tip">
            <cb-iconfont class="green" type="icon-fangyu"></cb-iconfont>
            <span class="poc-type-tip">
              {{ $t('vulnIndex.pocQuantity') + $t('common.colon') }}
            </span>
            <span>{{ itemData.poc_num || '0' }}</span>
          </div>
          <div class="exp-tip">
            <cb-iconfont class="green" type="icon-baogaopingfen1"></cb-iconfont>
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
      </div>
    </div>
  </div>
</template>

<script>
import TipType from '@/components/tip-type/tips.vue';
import { businessOptions, attackTypeOptions } from '@/constants/index.js';
import DefaultPic from '@/assets//img/vuln/pic_default.png';
export default {
  name: 'IntelligenceListCard',
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
  background: var(--bg-color-2);
  padding: 16px 24px 24px 24px;
  box-sizing: border-box;
  //border-bottom: 1px solid var(--neutral1);
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;
  &:hover {
    background: var(--bg-color-3);
  }
  .head {
    width: 100%;
    height: 24px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    .title-h {
      flex-grow: 1;
      max-width: calc(100% - 200px);
      display: flex;
      align-items: center;
      //margin-right: 50px;
      padding-left: 1px;
      font-size: 18px;
      color: var(--neutral8);
      line-height: 28px;
      .text-h {
        margin: 0 8px;
        max-width: calc(100% - 200px);
        //width: 100px;
        //flex-grow: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-weight: 600;
      }
    }
    .new-time {
      display: flex;
      color: var(--neutral5);
      font-size: 12px;
      line-height: 20px;
    }
  }
  .block {
    padding: 0 8px;
    background: var(--neutral0);
    font-size: 12px;
    font-weight: 400;
    color: var(--neutral8);
    margin-right: 8px;
    height: 24px;
    line-height: 24px;
    border-radius: 2px;
  }
  .blue-block {
    background: var(--primary-color-2);
    color: var(--primary-color);
    border-radius: 2px;
  }
  .info-form {
    width: 100%;
    //min-height: 100px;
    display: flex;

    .right-info {
      width: 100%;
      .type-tip {
        width: 100%;
        display: flex;
        font-size: 14px;
        color: var(--neutral8);
        font-weight: 400;
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
          color: var(--neutral5);
        }
      }
      .vul-number {
        display: flex;
        font-size: 14px;
        color: var(--neutral5);
        margin-top: 8px;
        min-height: 22px;
        line-height: 22px;
        .form-name {
          padding-right: 4px;
          color: var(--neutral5);
        }
        .form-content {
          flex: 1;
          color: var(--neutral8);
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
