<template>
  <div class="vuln-detail" ref="vulnDetail">
    <div class="content-message">
      <!-- 漏洞描述 -->
      <div class="vuln-item" ref="descRef">
        <title-head :name="$t('common.vulDescription')"></title-head>
        <div
          v-if="detailInfo.desc"
          class="content wrap-content"
          v-text="detailInfo.desc"
        ></div>
        <empty v-else class="empty-bg" :iconSize="60" fontSize="14px"></empty>
      </div>
      <div class="vuln-item" ref="resourceRef">
        <title-head :name="$t('vulnDetail.vulnSource')"></title-head>
        <div v-if="detailInfo.source" class="content">
          {{ detailInfo.source }}
        </div>
        <empty v-else class="empty-bg" :iconSize="60" fontSize="14px"></empty>
      </div>
      <div class="vuln-item" ref="repairRef">
        <title-head :name="$t('common.repairMethod')"></title-head>
        <div
          v-if="detailInfo.patch_title"
          class="content wrap-content"
          v-text="detailInfo.patch_title"
        ></div>
        <empty v-else class="empty-bg" :iconSize="60" fontSize="14px"></empty>
      </div>
    </div>
  </div>
</template>

<script>
import Empty from '@/components/empty';
import Verify from '@/components/verify';
import TitleHead from '@/components/title/index.vue';
import { gsap } from 'gsap';
import _ from 'lodash';
export default {
  name: 'VulnDetail',
  props: {
    detailInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    Empty,
    Verify,
    TitleHead,
  },
  data() {
    return {
      wpShow: true,
      sceneData: {},
      resourceId: '',
      wp: '',
      scene_type: '',
      currentIndex: 0,
      pocColumns: [
        {
          label: this.$t('common.vulName'),
          prop: 'name',
        },
        {
          label: this.$t('common.issueTime'),
          prop: 'create_time',
        },
        {
          label: this.$t('common.operation'),
          slot: 'oper',
          width: 100,
        },
      ],
      expColumns: [
        {
          label: this.$t('common.vulName'),
          prop: 'name',
        },
        {
          label: this.$t('vulnDetail.verify'),
          slot: 'is_verify',
        },
        {
          label: this.$t('vulnDetail.author'),
          prop: 'creator',
        },
        {
          label: this.$t('common.issueTime'),
          prop: 'create_time',
        },
        {
          label: this.$t('common.operation'),
          slot: 'oper',
          width: 100,
        },
      ],
    };
  },
  created() {
    this.resourceId = this.$route.params.resource_id;
    // this.getSceneInfo();
  },
  mounted() {},
  beforeDestroy() {
    if (window.document.querySelector('.vuln-detail')) {
      window.document
        .querySelector('.vuln-detail')
        .removeEventListener('scroll', this.__resizeHandler);
    }
  },
  methods: {
    wpToggle() {
      const width = this.wpShow ? '20px' : '820px';
      gsap.to(this.$refs.drawWpRef, {
        duration: 0.35,
        width,
        ease: 'power1.inOut',
      });
      this.wpShow = !this.wpShow;
    },
    downLoadPoc(data) {
      this.$request.filePathDownload(data.download_url);
    },
    downLoadExp(data) {
      this.$request.filePathDownload(data.download_url);
    },
    //处理左侧步骤条样式
    handleFixedDom() {
      let scrollTop = window.document.querySelector('.vuln-detail').scrollTop;
      let height = window.document.querySelector('.detail-top').offsetHeight;
      let domHeight =
        window.document.querySelector('.cb-inner-page').offsetHeight;
      let scrollDom = window.document.querySelector('.vuln-scroll-tool');
      if (scrollTop >= height + 64) {
        scrollDom.style.position = 'fixed';
        scrollDom.style.top = '108px';
        scrollDom.style.height = domHeight - 15 + 'px';
      } else {
        scrollDom.style.position = 'absolute';
        scrollDom.style.top = '15px';
      }
    },
    // 滚动时左侧响应选中对应的模块
    getDomHeight(list, height) {
      let topDomHeight =
        window.document.querySelector('.detail-top').offsetHeight;
      let heightList = [];
      list.forEach((item) => {
        heightList.push(this.$refs[item.value].offsetTop + topDomHeight);
      });
      if (heightList.findIndex((item) => item == height) != -1) {
        this.currentIndex = heightList.findIndex((item) => item == height);
      } else if (heightList.findIndex((item) => item < height) == -1) {
        this.currentIndex = 0;
      } else if (heightList.findIndex((item) => item > height) != -1) {
        this.currentIndex = heightList.findIndex((item) => item > height) - 1;
      } else {
        this.currentIndex = heightList.length - 1;
      }
    },
    //点击左侧滚动到相应的模块
    scrollToAnchor(v, index) {
      this.$nextTick(() => {
        let topDomHeight =
          window.document.querySelector('.detail-top').offsetHeight;
        let ref = this.$refs[v];
        let top = 0;
        if (ref[0]) {
          top = ref[0].offsetTop;
        } else {
          top = ref.offsetTop;
        }
        window.document.querySelector('.vuln-detail').scrollTop =
          topDomHeight + top + 39;
        setTimeout(() => {
          this.currentIndex = index;
        }, 50);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content-message {
  .vuln-item {
    padding: 12px 16px;
    margin-bottom: 16px;
    .wrap-content {
      white-space: pre-wrap;
    }
    .content {
      margin-top: 14px;
      font-size: 14px;
      background: var(--bg-color-3);
      padding: 24px 12px;
      word-break: break-word;
      .environment-type {
        margin-bottom: 10px;
        .type-name {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          padding: 0 10px;
          background: var(--neutral3);
          margin-left: 10px;
        }
      }
      .scene-box {
        position: relative;
        height: 684px;
        .draw-wp {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          z-index: 999;
          display: flex;
          width: 820px;
          .draw-box {
            top: 0;
            right: 0;
            width: 800px;
            height: 100%;
            background-color: var(--bg-color-2);
            .wp-title {
              text-align: center;
              margin-top: 8px;
              font-size: 16px;
            }
          }
          .arrow {
            height: 50px;
            width: 20px;
            margin-top: 32px;
            background: var(--bg-color-2);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          }
        }
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .zoom-in-top-enter-active,
  .zoom-in-top-leave-active {
    opacity: 1;
    transition: all 0.3s;
  }
  .zoom-in-top-enter,
  .zoom-in-top-leave-active {
    opacity: 0;
  }
  .empty-bg {
    background: var(--bg-color-3);
    margin-top: 12px;
    padding: 16px 0;
  }
}
</style>
