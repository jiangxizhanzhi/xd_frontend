<template>
  <div class="info-form">
    <div
      v-if="itemData.scene_img !== null || itemData.scene_config"
      class="scene-img left-info"
    >
      <div class="tip-type-tag">
        <tip-type from-page="env" :tipKey="itemData.level" />
      </div>
      <div
        class="left-level-bg"
        :class="`type-${dangerLevelOptions.type[itemData.level]}`"
      ></div>
      <img v-if="itemData.scene_img !== null" :src="itemData.scene_img" alt />
      <img v-else-if="itemData.scene_config" :src="DefaultPic" />
    </div>
    <div class="right-info">
      <div class="text-h" :title="itemData.name">{{ itemData.name }}</div>
      <div class="tag-info">
        <div class="industry block blue-block">
          {{ businessOptions[itemData.industry] }}
        </div>
        <div v-for="k in itemData.vuln_tag" :key="k" class="platform block">
          {{ k }}
        </div>
      </div>
      <div class="type-tip">
        <div class="line-clamp-1 producer-name">
          <span class="platform-type-tip">
            {{ $t('vulnDetail.manufacturerName') + $t('common.colon') }}
          </span>
          <span :title="producerName">{{ producerName }}</span>
        </div>
        <div class="line-clamp-1 producer-list">
          <span class="platform-type-tip">
            {{ $t('vulnDetail.productName') + $t('common.colon') }}
          </span>
          <span :title="productList">{{ productList }}</span>
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
</template>

<script>
import TipType from '@/components/tip-type/tips.vue';
import { businessOptions, attackTypeOptions } from '@/constants/index.js';
import DefaultPic from '@/assets//img/vuln/pic_default.png';
import { dangerLevelOptions } from '../../../../../constants';
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
  computed: {
    producerName() {
      const listTmp = this.itemData?.impact?.filter(
        (v) => v && v[3] && v[3] !== '*',
      );
      return listTmp?.length > 0 ? listTmp[0][3] : '-';
    },
    productList() {
      const listTmp = this.itemData?.impact?.filter(
        (v) => v && v[4] && v[4] !== '*',
      );
      return listTmp?.map((v) => v[4]).join('；') || '-';
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
      dangerLevelOptions,
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
  //width: 100%;
  //min-height: 186px;
  background: var(--bg-color-2);
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
}
.info-form {
  width: 100%;
  height: 158px;
  display: flex;
  //background: var(--bg-color-3);
  border-radius: 4px;
  .right-info {
    border-radius: 0 4px 4px 0;
    width: calc(100% - 256px);
    padding: 10px;
    background: var(--bg-color-2);
    border: none;
    &:hover {
      background: var(--bg-color-3);
    }
    .text-h {
      margin-bottom: 10px;
      font-size: 18px;
      line-height: 32px;
      color: var(--neutral8);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-weight: 600;
    }
    .tag-info {
      height: 24px;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .block {
        border-radius: 2px;
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
    .type-tip {
      width: 100%;
      display: flex;
      color: var(--neutral7);
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      .line-clamp-1 {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .producer-name {
        max-width: 40%;
      }
      .producer-list {
        margin-left: 20px;
        max-width: 60%;
      }
      .use-type {
        margin-right: 24px;
      }
      .poc-tip {
        margin: 0 24px;
      }
    }
    .vul-number {
      display: flex;
      color: var(--neutral7);
      font-size: 14px;
      line-height: 22px;
      text-overflow: ellipsis;
      white-space: nowrap;
      .form-name {
        overflow: hidden;
      }
      .form-content {
        flex: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        .number {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          .num-tip {
            margin-right: 25px;
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
    position: relative;
    border-radius: 4px 0 0 4px;
    .tip-type-tag {
      position: absolute;
    }
    .left-level-bg {
      border-radius: 4px 0 0 4px;
      position: absolute;
      opacity: 0.1;
      width: 256px;
      height: 100%;
      z-index: 1;
    }
    .type-critically {
      background: var(--bg-color-3);
    }
    .type-highRisk {
      background: var(--red-color);
    }
    .type-crisis {
      background: var(--orange-color);
    }
    .type-lowRisk {
      background: var(--yellow-color);
    }
    .type-unknown {
      background: var(--neutral1);
    }
  }
  .scene-img {
    height: 100%;
    border: none;
    img {
      width: 256px;
      height: 100%;
    }
  }
}
.download-icon-box {
  height: 36px;
  line-height: 43px;
}
</style>
