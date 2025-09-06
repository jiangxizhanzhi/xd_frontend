<template>
  <div class="vuln-detail" ref="vulnDetail">
    <div class="content-message">
      <!-- 漏洞描述 -->
      <div class="vuln-item pb-0" ref="POCRef">
        <title-head class="mb-10" :name="$t('common.POC')"></title-head>
        <!-- POC -->
        <div class="content">
          <div
            v-if="detailInfo.poc && detailInfo.poc.length"
            style="display: flex; flex-wrap: wrap"
          >
            <div
              v-for="(item, index) in detailInfo.poc"
              :key="index"
              class="poc-list-item"
              @click="downLoadPoc(item)"
            >
              <cb-iconfont
                class="icon-download"
                :size="44"
                type="icon-xiazai"
              ></cb-iconfont>
              <div class="poc-card-right">
                <div class="poc-name">{{ item.name }}</div>
                <div class="poc-date">
                  {{ $t('common.issueTime') }}{{ $t('common.colon')
                  }}{{ item.create_time }}
                </div>
              </div>
            </div>
          </div>
          <empty
            v-else
            class="empty-p mb-8"
            :iconSize="60"
            fontSize="14px"
          ></empty>
        </div>
      </div>
      <div class="vuln-item" ref="environmentRef">
        <title-head
          class="mb-10"
          :name="$t('common.reproduceEnvironment')"
        ></title-head>
        <div v-if="sceneData.scene_config" class="content">
          <div class="environment-type vuln-color-white">
            <span
              >{{ $t('vulnDetail.environmentType')
              }}{{ $t('common.colon') }}</span
            >
            <span v-if="scene_type" class="type-name">{{ scene_type }}</span>
            <span v-else>-</span>
          </div>
          <div class="scene-box">
            <vuln-scene :sceneData="sceneData"></vuln-scene>
          </div>
        </div>
        <empty class="empty-p" v-else :iconSize="60" fontSize="14px"></empty>
      </div>
      <div class="vuln-item" ref="resourceRef">
        <transition name="zoom-in-top">
          <div v-if="wpShow" class="draw-box">
            <title-head
              class="mb-10"
              :name="$t('vulnDetail.loophole')"
            ></title-head>
            <cb-scrollbar v-if="wp" style="height: calc(100% - 39px)">
              <cb-markdown
                v-model="wp"
                type="viewer"
                style="height: calc(100% - 29px); background: var(--bg-color-3)"
              ></cb-markdown>
            </cb-scrollbar>
            <empty
              v-else
              class="empty-p"
              :iconSize="80"
              fontSize="14px"
              style="height: calc(100% - 29px)"
            ></empty>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Empty from '@/components/empty';
import VulnScene from '../../../vuln-detail/components/vuln-scene.vue';
import Verify from '@/components/verify';
import TitleHead from '@/components/title/index.vue';
import { gsap } from 'gsap';
import _ from 'lodash';
import { getVulnScene } from '@/api/vuln';

export default {
  name: 'ContentInfo',
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
    VulnScene,
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
      anchorGroup: [
        {
          value: 'descRef',
          name: this.$t('common.vulDescription'),
        },
        {
          value: 'POCRef',
          name: this.$t('common.POC'),
        },
        {
          value: 'EXPRef',
          name: this.$t('common.EXP'),
        },
        {
          value: 'environmentRef',
          name: this.$t('common.reproduceEnvironment'),
        },
        {
          value: 'resourceRef',
          name: this.$t('vulnDetail.vulnSource'),
        },
        {
          value: 'repairRef',
          name: this.$t('common.repairMethod'),
        },
      ],
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
    this.getSceneInfo();
  },
  mounted() {
    // this.__resizeHandler = _.debounce(() => {
    //   this.scrollHeight =
    //     window.document.querySelector('.vuln-detail').scrollTop;
    //   this.handleFixedDom();
    //   this.getDomHeight(this.anchorGroup, this.scrollHeight);
    // }, 10);
    // window.document
    //   .querySelector('.vuln-detail')
    //   .addEventListener('scroll', this.__resizeHandler);
  },
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
    getSceneInfo() {
      getVulnScene(this.resourceId).then((res) => {
        this.sceneData = _.get(res, 'data.data') || {};
        this.wp = _.get(res, 'data.data.scene_wp') || '';
        this.scene_type = _.get(res, 'data.data.scene_type') || '';
      });
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
  background: var(--bg-color-2);
  padding-bottom: 32px;
  .mt-8 {
    margin-top: -8px;
  }
  .mb-8 {
    margin-bottom: 8px;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .vuln-item {
    padding: 16px;
    .wrap-content {
      white-space: pre-wrap;
    }
    .content {
      font-size: 14px;
      word-break: break-word;
      .environment-type {
        margin-bottom: 10px;
        .type-name {
          display: inline-block;
          padding: 0 10px;
          //background: var(--neutral3);
          //margin-left: 10px;
        }
      }
      .scene-box {
        position: relative;
      }
      .markdown-bg {
        background: var(--bg-color-3);
      }
      .poc-list-item {
        width: 388px;
        padding: 24px;
        margin-right: 16px;
        margin-bottom: 16px;
        background: var(--bg-color-3);
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        &:hover {
          cursor: pointer;
          .icon-download {
            background: var(--primary-color-2) !important;
            color: var(--primary-color) !important;
          }
        }
        .poc-card-right {
          flex: 1;
        }
        .icon-download {
          background: var(--neutral1);
          padding: 10px;
          border-radius: 50%;
          margin-right: 12px;
          color: var(--neutral6);
        }
        .poc-name {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          line-height: 22px;
          margin-bottom: 6px;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          word-break: break-word;
          text-overflow: ellipsis;
          display: -webkit-box;
        }
        .poc-date {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.4);
          line-height: 22px;
        }
      }
    }
    &:last-child {
      padding-top: 8px;
      margin-bottom: 0;
    }
    &:first-child {
      padding-bottom: 0;
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
  .empty-p {
    padding: 20px;
    background: var(--bg-color-3);
  }
}
</style>
