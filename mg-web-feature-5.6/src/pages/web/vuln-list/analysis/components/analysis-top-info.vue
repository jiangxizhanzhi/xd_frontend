<template>
  <div class="top-base-info">
    <div class="top-left">
      <img :src="svgUrl" />
      <div class="level-h" :class="getClassName">{{ level }}</div>
    </div>
    <cb-button
      icon="icon-changjingguanli"
      :hollow="true"
      class="btn-right"
      @click="toIntelligenceDetail"
      >{{ $t('vulnDetail.intelligenceBtn') }}</cb-button
    >
    <div class="top-right">
      <div class="head">
        <div class="title-h">
          <div class="text-h" :title="itemData.name">{{ itemData.name }}</div>
        </div>
        <div class="new-time">
          <!--          <span>{{ $t('vulnDetail.updateTime') + $t('common.colon') }}</span>
          <span>{{ itemData.update_time }}</span>-->
        </div>
      </div>
      <div class="tag-info">
        <div class="industry block blue-block">
          {{ businessOptions[itemData.industry] }}
        </div>
        <div v-for="k in itemData.vuln_tag" :key="k" class="platform block">
          {{ k }}
        </div>
        <cb-button
          v-if="itemData.attachment"
          icon="icon-xiazai"
          size="small"
          hollow
          @click="attachmentUrl(itemData.attachment)"
          >{{ $t('vulnDetail.softwareDownload') }}</cb-button
        >
      </div>
      <div class="info-form">
        <div class="type-tip">
          <div class="use-type">
            <span class="use-type-tip banner-title">{{
              $t('common.useType') + $t('common.colon')
            }}</span>
            <span>{{ attackTypeOptions[itemData.utilize_category] }}</span>
          </div>
          <div class="platform mr-24">
            <span class="banner-title">{{
              $t('common.platform') + $t('common.colon')
            }}</span>
            <span>{{ itemData.platform || '-' }}</span>
          </div>
          <div class="mr-24">
            <span class="banner-title">{{
              $t('common.issueTime') + $t('common.colon')
            }}</span>
            <span>{{ itemData.publish_date || '-' }}</span>
          </div>
        </div>
        <div class="vul-number">
          <span class="form-name banner-title">{{
            $t('common.vulNumber') + $t('common.colon')
          }}</span>
          <div class="form-content">
            <span v-if="itemData.code">{{
              itemData.code.join($t('common.delimiter'))
            }}</span>
            <span v-else>{{ '-' }}</span>
          </div>
        </div>
        <div class="weakness-list">
          <span class="form-name banner-title">{{
            $t('common.weaknessList') + $t('common.colon')
          }}</span>
          <span class="form-content">{{ itemData.cwe_category || '-' }}</span>
        </div>
      </div>
    </div>
    <!--    <more-index
      v-if="showMoreIndexDialog"
      ref="moreIndexDialog"
      @closed="closeMoreIndexDialog"
      :timeVector="itemData.time_vector"
      :envVector="itemData.env_vector"
    />-->
  </div>
</template>

<script>
import _ from 'lodash';
import ScoreIndex from '../../../vuln-detail/components/score-index.vue';
import MoreIndex from '../../../vuln-detail/components/more-dialog.vue';
import TipType from '@/components/tip-type/tips.vue';
import { businessOptions, attackTypeOptions } from '@/constants/index.js';
import { dangerLevelOptions } from '@/constants/index.js';
import high_risk from '@/assets//img/vuln/high_risk.svg';
import extreme_risk from '@/assets//img/vuln/extreme_risk.svg';
import low_risk from '@/assets//img/vuln/low_risk.svg';
import medium_risk from '@/assets//img/vuln/medium_risk.svg';
import unknown from '@/assets//img/vuln/unknown.svg';
export default {
  name: 'AnalysisTopInfo',
  components: {
    ScoreIndex,
    MoreIndex,
    TipType,
  },
  props: {
    itemData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    resourceId: String,
  },
  data() {
    return {
      high_risk,
      extreme_risk,
      low_risk,
      medium_risk,
      unknown,
      dangerLevelOptions,
      businessOptions,
      attackTypeOptions,
      showMoreIndexDialog: false,
    };
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
    impactData() {
      const list = [
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
      ];
      return this.itemData.impact && this.itemData.impact.length
        ? this.itemData.impact
        : list;
    },
  },

  methods: {
    toIntelligenceDetail() {
      this.$router.push({
        name: 'vuln-intelligence-detail',
        params: {
          resource_id: this.resourceId,
        },
      });
    },
    attachmentUrl(url) {
      this.$request.filePathDownload(url);
    },
    showMoreIndex() {
      this.showMoreIndexDialog = true;
    },
    closeMoreIndexDialog() {
      this.showMoreIndexDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.top-base-info {
  width: 100%;
  height: 100%;
  padding: 18px 16px 13px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: relative;
  .btn-right {
    position: absolute;
    right: 16px;
    top: 16px;
  }
  .top-left {
    position: relative;
    width: 164px;
    height: 146px;
    .level-h {
      position: absolute;
      max-width: 116px;
      bottom: 29px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
      color: var(--white-color);
    }
    .middle-class {
      color: #592700;
    }
    .high-class {
      color: #66031a;
    }
  }
  .top-right {
    width: calc(100% - 164px);
    padding-left: 22px;
  }
  .head {
    width: 100%;
    height: 32px;
    line-height: 32px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .title-h {
      width: calc(100% - 350px);
      flex-grow: 1;
      font-size: 24px;
      font-weight: 400;
      color: var(--neutral8);
      margin-right: 50px;
      .text-h {
        float: left;
        max-width: calc(100% - 116px);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 24px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: var(--neutral8);
        line-height: 32px;
      }
    }
    .new-time {
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
      border-radius: 2px;
    }
    .blue-block {
      background: var(--primary-color-2);
      color: var(--primary-color);
    }
  }
  .info-form {
    width: 100%;
    .banner-title {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: var(--neutral5);
      line-height: 22px;
    }
    .mr-24 {
      margin-right: 24px;
    }
    .type-tip {
      width: 100%;
      display: flex;
      font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      color: var(--neutral8);
      margin-top: 8px;
      .use-type {
        margin-right: 24px;
      }
    }
    .vul-number,
    .weakness-list {
      display: flex;
      font-size: 14px;
      color: var(--neutral8);
      margin-top: 8px;
      .form-name {
        padding-right: 4px;
      }
      .form-content {
        flex: 1;
        font-size: 14px;
        font-weight: 400;
        color: var(--neutral8);
        line-height: 22px;
        span {
          word-break: break-word;
        }
      }
    }
  }
  .impact {
    width: 100%;
    font-size: 14px;
    color: var(--neutral8);
    background: var(--bg-color-3);
    margin-top: 8px;

    .more-table {
      padding-right: 10px;
    }
    .table-top,
    .table-body {
      padding-left: 14px;
      .body-content {
        height: 20px;
        line-height: 20px;
        margin-top: 8px;
        width: 100%;
      }
      .form-name {
        float: left;
        width: 19%;
        padding-right: 4px;
        div {
          float: right;
        }
      }
      .table-item,
      .table-item0,
      .table-item1,
      .table-item2 {
        float: left;
        width: 9.3%;
        padding-right: 6px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .table-item0 {
        width: 4.8%;
      }
      .table-item1,
      .table-item2 {
        width: 6.5%;
      }
    }
    .table-top {
      height: 32px;
      line-height: 32px;
      background: var(--neutral1);
      .form-name {
        color: var(--neutral8);
        font-weight: 600;
        .table-title {
          color: var(--neutral8);
          font-weight: 400;
        }
      }
    }
    .table-body {
      width: 100%;
      max-height: 92px;
      padding-bottom: 8px;
      overflow-y: auto;
    }
    .form-content {
      position: relative;
      .number {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        height: 30px;
        .num-tip {
          width: 60px;
          margin-right: 25px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      .more-impact {
        position: absolute;
        bottom: 13px;
        right: -20px;
        color: var(--primary-color);
        cursor: pointer;
      }
    }
  }
  .base-index {
    width: 100%;
    height: 110px;
    background: var(--bg-color-3);

    margin-top: 8px;
    .top-title {
      height: 32px;
      background: var(--neutral1);
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--neutral8);
      padding: 0 16px;
      .cvss3 {
        display: flex;
        align-items: center;
        height: 32px;
        span:last-child {
          font-size: 14px;
          font-weight: 600;
          color: var(--primary-color);
        }
      }
      .title-index {
        font-size: 14px;
        font-weight: 600;
        line-height: 32px;
      }
      .more-index {
        cursor: pointer;
        font-weight: 400;
        color: var(--primary-color);
        line-height: 32px;
      }
    }
    .bottom-index {
      padding: 16px;
      width: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
