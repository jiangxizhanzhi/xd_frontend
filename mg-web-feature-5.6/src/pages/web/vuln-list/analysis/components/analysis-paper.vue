<template>
  <div class="paper">
    <div v-if="contentList.length" class="paper-content">
      <div class="paper-left">
        <analysis-scroll-tool
          @scrollToAnchor="scrollToAnchor"
          :anchor-group="anchorGroup"
          :currentIndex="currentIndex"
        ></analysis-scroll-tool>
      </div>
      <div class="paper-right">
        <div
          class="content-box"
          v-for="(item, index) in contentList"
          :key="index"
          :class="'paper-title' + item.id"
          :ref="'ref' + item.id"
        >
          <div :title="item.name" class="vuln-content-title vuln-color-white">
            {{ item.name }}
          </div>
          <div class="vuln-time">
            <!--            <div class="vuln-analysis">
              {{ classifyOptions[item.category] }}
            </div>-->
            <div class="update-time">
              <span
                >{{ $t('vulnDetail.updateTime') }}{{ $t('common.colon') }}</span
              >
              <span>{{ item.update_time | formatDate }}</span>
            </div>
          </div>
          <cb-markdown v-model="item.content" type="viewer"></cb-markdown>
        </div>
      </div>
    </div>
    <empty v-else :iconSize="60" fontSize="14px"></empty>
  </div>
</template>

<script>
import Empty from '@/components/empty';
import { classifyOptions } from '@/constants/index.js';
import _ from 'lodash';
import AnalysisScrollTool from './analysis-scroll-tool.vue';
import { getVulnPaper, getVulnScene } from '@/api/vuln';
export default {
  name: 'AnalysisPaper',
  components: { AnalysisScrollTool, Empty },
  props: {
    resourceId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      contentList: [],
      currentIndex: 0,
      classifyOptions,
      // currentPaper: {},
    };
  },
  computed: {
    /*updateTime() {
      if (this.currentPaper.update_time) {
        return this.currentPaper.update_time.split(' ')[0];
      } else {
        return '-';
      }
    },*/

    anchorGroup() {
      return this.contentList.map((v) => {
        return {
          value: v.id,
          name: v.name,
        };
      });
    },
  },
  created() {
    this.getPaperInfo();
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
    titleClick(item, index) {
      this.currentPaper = item;
      this.currentIndex = index;
    },
    getPaperInfo() {
      getVulnPaper(this.resourceId).then((res) => {
        this.contentList = _.get(res, 'data.data') || [];
      });
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
        window.document.querySelector('.detail-top').offsetHeight - 360;
      let heightList = [];
      list.forEach((item) => {
        heightList.push(
          this.$refs['ref' + item.value][0].offsetTop + topDomHeight,
        );
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
        let ref = this.$refs['ref' + v];
        let top = 0;
        if (ref[0]) {
          top = ref[0].offsetTop - 260;
        } else {
          top = ref.offsetTop;
        }
        window.document.querySelector('.vuln-detail').scrollTop =
          topDomHeight + top + 39;
        setTimeout(() => {
          this.currentIndex = index;
        }, 50);
      });
      // this.currentPaper = this.contentList.find(item => item.id === v);
      // this.currentIndex = index;
    },
  },
  filters: {
    formatDate(v) {
      return v?.split(' ')[0];
    },
  },
};
</script>

<style lang="scss" scoped>
.paper {
  .paper-content {
    display: flex;
    justify-content: flex-end;
    .paper-left {
      width: 292px;
      border-radius: 4px;
      position: relative;
      min-height: calc(100vh - 360px);
      background: var(--bg-color-2);
      .paper-list {
        margin-top: 15px;
        list-style: none;
        display: flex;
        flex-direction: column;
        li {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--neutral8);
          font-size: 14px;
          margin-bottom: 30px;
          cursor: pointer;
          position: relative;
          .paper-test {
            max-width: 210px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--neutral8);
            font-size: 16px;
          }
        }
        .active-li {
          color: var(--primary-color);
          &::after {
            content: '';
            background: var(--primary-color);
          }
          .paper-test {
            color: var(--primary-color);
          }
        }
      }
    }
    .paper-right {
      width: calc(100% - 292px - 12px);
      min-height: calc(100vh - 360px);
      margin-left: 12px;
      border-radius: 4px;
      background: var(--bg-color-2);
      height: 100%;
      padding: 24px 20px;
      .content-box {
        margin-top: 30px;
        .vuln-content-title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 24px;
          font-weight: 600;
        }
        .vuln-time {
          display: flex;
          align-items: center;
          margin-top: 10px;
          font-size: 12px;
          .vuln-analysis {
            height: 28px;
            line-height: 28px;
            color: var(--primary-color);
            padding: 0 10px;
            margin-right: 20px;
            background-color: var(--primary-color-2);
          }
          .update-time {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: var(--neutral5);
            line-height: 22px;
          }
        }
        &:first-child {
          margin-top: 0;
        }
      }
    }
  }
  ::v-deep .cb-markdown .markdown-body {
    margin: 0 auto;
    padding: 16px 0;
  }
}
</style>
