<template>
  <div class="vuln-detail" ref="vulnDetail">
    <scroll-tool
      @scrollToAnchor="scrollToAnchor"
      :anchor-group="anchorGroup"
      :currentIndex="currentIndex"
    ></scroll-tool>
    <div class="content-message">
      <!-- 漏洞描述 -->
      <div class="vuln-item" ref="descRef">
        <title-head :name="$t('common.vulDescription')"></title-head>
        <div
          v-if="detailInfo.desc"
          class="content wrap-content"
          v-text="detailInfo.desc"
        ></div>
        <empty v-else :iconSize="60" fontSize="14px"></empty>
      </div>
      <div class="vuln-item" style="max-height: 241px" ref="POCRef">
        <title-head :name="$t('common.POC')"></title-head>
        <!-- POC -->
        <div class="content">
          <cb-search-table
            v-if="detailInfo.poc && detailInfo.poc.length"
            :cols="pocColumns"
            hidePaginOnDemand
            showIndex
            :dataSource="detailInfo.poc"
            :scroll="{ y: 145 }"
          >
            <template v-slot:search></template>
            <template v-slot:oper="scope">
              <cb-button type="text" @click="downLoadPoc(scope.data)">{{
                $t('vulnDetail.download')
              }}</cb-button>
            </template>
          </cb-search-table>
          <empty v-else :iconSize="60" fontSize="14px"></empty>
        </div>
      </div>
      <!-- EXP -->
      <div class="vuln-item" style="max-height: 241px" ref="EXPRef">
        <title-head :name="$t('common.EXP')"></title-head>
        <div class="content">
          <cb-search-table
            v-if="detailInfo.exp && detailInfo.exp.length"
            :cols="expColumns"
            hidePaginOnDemand
            showIndex
            :dataSource="detailInfo.exp"
            :scroll="{ y: 145 }"
          >
            <template v-slot:search></template>
            <template v-slot:is_verify="scope">
              <verify :is_verify="scope.data.is_verify"></verify>
            </template>
            <template v-slot:oper="scope">
              <cb-button type="text" @click="downLoadExp(scope.data)">{{
                $t('vulnDetail.download')
              }}</cb-button>
            </template>
          </cb-search-table>
          <empty v-else :iconSize="60" fontSize="14px"></empty>
        </div>
      </div>
      <!-- <div class="vuln-item" style="padding-bottom: 16px" ref="environmentRef">
        <title-head :name="$t('common.reproduceEnvironment')"></title-head>
        <div v-if="sceneData.scene_config" class="content">
          <div class="environment-type">
            <span
              >{{ $t('vulnDetail.environmentType')
              }}{{ $t('common.colon') }}</span
            >
            <span v-if="scene_type" class="type-name">{{ scene_type }}</span>
            <span v-else>-</span>
          </div>
          <div class="scene-box">
            <vuln-scene :sceneData="sceneData"></vuln-scene>
            <div class="draw-wp" ref="drawWpRef">
              <div @click="wpToggle" class="arrow">
                <cb-iconfont
                  :type="wpShow ? 'icon-xiangzuo' : 'icon-xiangyou'"
                  :size="18"
                ></cb-iconfont>
              </div>
              <transition name="zoom-in-top">
                <div v-if="wpShow" class="draw-box">
                  <div class="wp-title">{{ $t('vulnDetail.loophole') }}</div>
                  <cb-scrollbar
                    v-if="wp"
                    style="height: calc(100% - 39px); margin-top: 10px"
                  >
                    <cb-markdown
                      v-model="wp"
                      type="viewer"
                      style="height: calc(100% - 29px)"
                    ></cb-markdown>
                  </cb-scrollbar>
                  <empty
                    v-else
                    :iconSize="80"
                    fontSize="14px"
                    style="height: calc(100% - 29px)"
                  ></empty>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <empty v-else :iconSize="60" fontSize="14px"></empty>
      </div> -->
      <div class="vuln-item" ref="resourceRef">
        <title-head :name="$t('vulnDetail.vulnSource')"></title-head>
        <div v-if="detailInfo.source" class="content">
          {{ detailInfo.source }}
        </div>
        <empty v-else :iconSize="60" fontSize="14px"></empty>
      </div>
      <div class="vuln-item" ref="repairRef">
        <title-head :name="$t('common.repairMethod')"></title-head>
        <div
          v-if="detailInfo.patch_title"
          class="content wrap-content"
          v-text="detailInfo.patch_title"
        ></div>
        <empty v-else :iconSize="60" fontSize="14px"></empty>
      </div>
    </div>
  </div>
</template>

<script>
import ScrollTool from './scroll-tool';
import Empty from '@/components/empty';
import VulnScene from './vuln-scene.vue';
import Verify from '@/components/verify';
import TitleHead from '@/components/title/index.vue';
import { gsap } from 'gsap';
import _ from 'lodash';
import { getVulnScene } from '@/api/vuln';

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
    ScrollTool,
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
        // {
        //   value: 'environmentRef',
        //   name: this.$t('common.reproduceEnvironment'),
        // },
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
    this.__resizeHandler = _.debounce(() => {
      this.scrollHeight =
        window.document.querySelector('.vuln-detail').scrollTop;
      this.handleFixedDom();
      this.getDomHeight(this.anchorGroup, this.scrollHeight);
    }, 10);
    window.document
      .querySelector('.vuln-detail')
      .addEventListener('scroll', this.__resizeHandler);
  },
  beforeDestroy() {
    if (window.document.querySelector('.vuln-detail')) {
      window.document
        .querySelector('.vuln-detail')
        .removeEventListener('scroll', this.__resizeHandler);
    }
  },
  methods: {
    // wpToggle() {
    //   const width = this.wpShow ? '20px' : '820px';
    //   gsap.to(this.$refs.drawWpRef, {
    //     duration: 0.35,
    //     width,
    //     ease: 'power1.inOut',
    //   });
    //   this.wpShow = !this.wpShow;
    // },
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
  padding-left: 10px;
  width: calc(100% - 252px);
  margin-left: 252px;
  .vuln-item {
    padding: 8px 16px;
    margin-bottom: 16px;
    background: var(--neutral0);
    .wrap-content {
      white-space: pre-wrap;
    }
    .content {
      margin-top: 8px;
      font-size: 14px;
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
}
</style>
