<template>
  <div class="vuln-list-cards">
    <div class="info-form">
      <div class="top-left">
        <img :src="svgUrl" />
        <div class="level-h" :class="getClassName">{{ level }}</div>
        <div class="article-text" :class="getArticleClassName">
          {{ $t('vulnDetail.article') + $t('common.colon')
          }}{{ itemData.paper_num }}
        </div>
      </div>
      <div class="right-info">
        <div class="head">
          <div class="title-h">
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
        <div class="vul-number">
          <span class="form-name">{{
            $t('common.vulNumber') + $t('common.colon')
          }}</span>
          <div class="form-content">
            <span
              v-if="itemData.code"
              class="code-delimiter"
              :title="itemData.code.join($t('common.delimiter'))"
              >{{ itemData.code.join($t('common.delimiter')) }}</span
            >
            <span v-else>{{ '-' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TipType from '@/components/tip-type/tips.vue';
import { attackTypeOptions, businessOptions } from '@/constants/index.js';
import DefaultPic from '@/assets//img/vuln/pic_default.png';
import high_risk from '@/assets//img/vuln/high_risk.svg';
import extreme_risk from '@/assets//img/vuln/extreme_risk.svg';
import low_risk from '@/assets//img/vuln/low_risk.svg';
import medium_risk from '@/assets//img/vuln/medium_risk.svg';
import unknown from '@/assets//img/vuln/unknown.svg';
import { dangerLevelOptions } from '../../../../../constants';

export default {
  name: 'AnalysisListCards',
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
  computed: {
    svgUrl() {
      const urlObj = {
        unknown: unknown,
        lowRisk: low_risk,
        crisis: medium_risk,
        highRisk: high_risk,
        critically: extreme_risk,
      };
      return urlObj[dangerLevelOptions.type[this.itemData.level]];
    },
    level() {
      return dangerLevelOptions[this.itemData.level];
    },
    getClassName() {
      const classNameObj = {
        lowRisk: 'middle-class',
        crisis: 'middle-class',
        highRisk: 'high-class',
      };
      return classNameObj[dangerLevelOptions.type[this.itemData.level]];
    },
    getArticleClassName() {
      const classNameObj = {
        0: 'unknown-risk-class',
        1: 'low-risk-class',
        2: 'moderate-risk-class',
        3: 'high-risk-class',
        4: 'extremely-risk-class',
      };
      return classNameObj[this.itemData.level];
    },
  },
};
</script>

<style lang="scss" scoped>
.vuln-list-cards {
  width: 100%;
  background: var(--bg-color-2);
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;
  &:hover {
    .right-info {
      background: var(--bg-color-3) !important;
    }
    .top-left {
      background: var(--bg-color-3);
    }
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
      .text-h {
        width: 100px;
        flex-grow: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        color: var(--neutral8);
        font-size: 18px;
        line-height: 32px;
        font-weight: 600;
      }
    }
    .new-time {
      display: flex;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: var(--neutral5);
      line-height: 22px;
    }
  }
  .tag-info {
    width: 100%;
    height: 24px;
    display: flex;
    align-items: center;
    margin: 12px 0 20px 0;
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
    }
  }
  .info-form {
    width: 100%;
    display: flex;
    height: 158px;

    .right-info {
      width: calc(100% - 168px);
      background: var(--bg-color-2);
      padding: 16px 24px;
      border-radius: 0 4px 4px 0;
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
        min-height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: var(--neutral7);
        line-height: 22px;
        .form-name {
          padding-right: 4px;
          //color: var(--neutral8);
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
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }
    }
    .left-info {
      margin-right: 30px;
      text-align: center;
    }
    .scene-img {
      border: 1px solid var(--bg-color-2);
      img {
        width: 88px;
        height: 77px;
      }
    }
  }
  .download-icon-box {
    height: 36px;
    line-height: 43px;
  }
  .top-left {
    position: relative;
    width: 168px;
    height: 100%;
    padding: 12px 24px;
    background: var(--bg-color-3);
    border-radius: 4px 0 0 4px;
    .level-h {
      position: absolute;
      max-width: 116px;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      color: var(--white-color);
    }
    .middle-class {
      color: #592700;
    }
    .high-class {
      color: #66031a;
    }
    .article-text {
      border-radius: 2px;
      font-size: 12px;
      padding: 4px;
      font-weight: 400;
      text-align: center;
      width: 70px;
      transform: translateX(36%);
    }

    .unknown-risk-class {
      background: var(--neutral1);
      color: var(--neutral7);
    }
    .low-risk-class {
      background: var(--yellow-color-2);
      color: var(--yellow-color);
    }
    .moderate-risk-class {
      background: var(--orange-color-2);
      color: var(--orange-color);
    }
    .high-risk-class {
      background: var(--red-color-2);
      color: var(--red-color);
    }
    .extremely-risk-class {
      background: var(--neutral0);
      color: var(--neutral3);
      border: 1px solid var(--neutral3);
    }
  }
}
</style>
