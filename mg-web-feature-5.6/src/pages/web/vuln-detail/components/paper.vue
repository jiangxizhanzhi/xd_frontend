<template>
  <div class="paper">
    <div v-if="contentList.length" class="paper-content">
      <div class="paper-left">
        <ul class="paper-list" style="padding-left: 20px">
          <li
            v-for="(item, index) in contentList"
            :key="item.id"
            :class="{ 'active-li': currentIndex === index }"
            @click="titleClick(item, index)"
          >
            <div :title="item.name" class="paper-test">
              {{ item.name }}
            </div>
          </li>
        </ul>
      </div>
      <div class="paper-right">
        <div class="content-box" :class="'paper-title' + currentPaper.id">
          <div :title="currentPaper.name" class="vuln-content-title">
            {{ currentPaper.name }}
          </div>
          <div class="vuln-time">
            <div class="vuln-analysis">
              {{ classifyOptions[currentPaper.category] }}
            </div>
            <div class="update-time">
              <span
                >{{ $t('vulnDetail.updateTime') }}{{ $t('common.colon') }}</span
              >
              <span>{{ updateTime }}</span>
            </div>
          </div>
          <cb-markdown
            v-model="currentPaper.content"
            type="viewer"
          ></cb-markdown>
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
import { getVulnPaper } from '@/api/vuln';
export default {
  components: { Empty },
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
      currentPaper: {},
    };
  },
  computed: {
    updateTime() {
      if (this.currentPaper.update_time) {
        return this.currentPaper.update_time.split(' ')[0];
      } else {
        return '-';
      }
    },
  },
  created() {
    this.getPaperInfo();
  },
  methods: {
    titleClick(item, index) {
      this.currentPaper = item;
      this.currentIndex = index;
    },
    getPaperInfo() {
      getVulnPaper(this.resourceId).then((res) => {
        this.contentList = _.get(res, 'data.data') || [];
        if (this.contentList.length) {
          this.currentPaper = this.contentList[0];
        }
      });
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
      width: 252px;
      background: var(--neutral0);
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
      width: calc(100% - 252px);
      height: 100%;
      padding: 0 20px;
      .content-box {
        margin-top: 30px;
        .vuln-content-title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 24px;
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
        }
        &:first-child {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
