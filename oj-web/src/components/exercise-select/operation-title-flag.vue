<template>
  <!-- 练习实践操作习题详情title -->
  <div class="practice-operation-question-title">
    <div class="top-wrapper">
      <div class="left-box">
        <div class="level-wrapper">
          <div
            class="level-box com-box"
            :class="{
              green: difficult === 0,
              orange: difficult === 1,
              red: difficult === 2,
            }"
          >
            {{ difficultName }}
          </div>
        </div>
        <div v-if="catagoryName" class="direction-wrapper">
          <div class="direction-box com-box one-overflow">
            {{ catagoryName }}
          </div>
        </div>
        <div class="knowledge-wrapper">
          <div
            v-for="(item, index) in knowledgeDatas"
            :class="index <= 2 ? 'knowledge-box com-box' : ''"
            class="one-overflow"
            :key="index"
          >
            <span v-if="index <= 1" :title="item">
              {{ item }}
            </span>
            <span v-else-if="index === 2" :title="knowledgeDatasJoin">...</span>
          </div>
        </div>
      </div>
      <div class="right-box">
        <div class="collection-wrapper" @click="collection()">
          <cb-iconfont
            :class="isCollection ? 'collection-icon' : 'no-collection-icon'"
            :type="isCollection ? 'icon-yishoucang' : 'icon-weishoucang'"
          />
          <span style="font-size: 14px">
            {{ isCollection ? $t('m.collected') : $t('m.collectTopic') }}
          </span>
        </div>
      </div>
      <div v-if="solved" class="status-wrapper green-box">
        <cb-iconfont type="icon-gou" size="18" themedColor="green-color" />
        <span>{{ $t('m.solved') }}</span>
      </div>
    </div>
    <div class="title">
      <span class="title-num" v-if="num != null && num != ''">{{ num }}、</span>
      <div class="content">
        <span>{{ content }}</span>
      </div>
    </div>
    <div class="desc" v-if="desc">
      <div class="desc-content-markdown">
        <CbMarkdown v-model="desc" type="viewer"></CbMarkdown>
      </div>
    </div>
    <div class="enclosure ft14" v-if="enclosure">
      <a :href="enclosure" target="_blank">
        <div class="a-wrap">
          <div class="enclosure-icon-wrap">
            <cb-iconfont
              type="icon-xiazai"
              themedColor="neutral9"
              size="19"
            ></cb-iconfont>
          </div>

          <span>{{ $t('m.exercise.downloadFiles') }}</span>
        </div>
      </a>
    </div>
  </div>
</template>
<script>
import { QUESTIONRESOURSETYPE } from './constant';
export default {
  props: {
    type: {
      type: Number,
      default: QUESTIONRESOURSETYPE.PRACTICE,
    },
    enclosure: {
      type: String,
      default: '',
    },
    knowledgeDatas: {
      type: Array,
      default: [],
    },
    num: {
      type: Number,
      default: null,
    },
    catagoryName: {
      type: String,
      default: '',
    },
    difficultName: {
      type: String,
      default: '',
    },
    difficult: {
      type: Number,
      default: null,
    },
    content: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      default: null,
    },
    solved: {
      type: Boolean,
      default: false,
    },
    isCollection: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { QUESTIONRESOURSETYPE };
  },
  computed: {
    knowledgeDatasJoin() {
      return this.knowledgeDatas.join('、');
    },
  },
  methods: {
    collection() {
      this.$emit('collection-change', this.isCollection);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .cb-markdown .markdown-body {
  padding: 5px 0 0 0;
}
.desc {
  display: flex;
  padding: 0px 30px;
  margin: 0 0 16px;
  // align-items: center;
  span {
    &.titleDescription {
      line-height: 30px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      white-space: nowrap;
    }
  }
}
.enclosure {
  padding: 0 30px;
  a {
    padding: 16px 48px 16px 16px;
    background: var(--bg-color-3);
    color: var(--neutral9);
    display: inline-block;
    border-radius: 4px;
    &:hover {
      .enclosure-icon-wrap {
        background: var(--primary-color-2);
      }
      .cb-iconfont {
        color: var(--primary-color) !important;
      }
    }
  }
  .a-wrap {
    display: flex;
    align-items: center;
  }
  .enclosure-icon-wrap {
    width: 40px;
    height: 40px;
    background: var(--neutral1);
    border-radius: 50%;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
  }
}
.title-line {
  height: 1px;
  background: var(--neutral1);
}
.title {
  display: flex;
  align-items: center;
  min-height: 24px;
  padding: 16px 30px 8px;
  .title-num {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }
}
.title .catagory-name,
.title .difficutly-name {
  min-width: 100px;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0 20px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 2px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  margin-right: 10px;
  border-radius: 100px;
}
::v-deep {
  .v-show-content {
    background-color: transparent !important;
  }
  .markdown-body {
    padding: 10px;
    p {
      margin: 0;
    }
  }
}
.title-score {
  min-width: 100px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  margin-left: 10px;
}
.practice-operation-question-title {
  .content,
  .desc {
    word-break: break-word;
  }
}
.com-box {
  background: var(--neutral0);
  border-radius: 2px;
  height: 32px;
  line-height: 32px;
  padding: 0 8px;
  color: var(--neutral8);
  font-size: 14px;
}
.top-wrapper {
  background: var(--neutral0);
  height: 48px;
  border-radius: 4px 4px 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  position: relative;
  .left-box,
  .right-box {
    display: flex;
  }
  .level-wrapper {
    .green {
      color: var(--green-color);
      background: var(--green-color-2);
    }
    .orange {
      color: var(--orange-color);
      background: var(--orange-color-2);
    }
    .red {
      color: var(--red-color);
      background: var(--red-color-2);
    }
  }
  .direction-wrapper {
    margin: 0 8px;
    .direction-box {
      max-width: 150px;
    }
  }
  .knowledge-wrapper {
    display: flex;
    .knowledge-box {
      margin-right: 8px;
      max-width: 150px;
    }
  }
  .collection-wrapper {
    cursor: pointer;
    color: var(--neutral7);
    .cb-iconfont {
      color: var(--neutral7);
    }
    span {
      margin-left: 6px;
    }
    .no-collection-icon {
      color: var(--neutral7);
    }
    &:hover {
      .cb-iconfont {
        color: var(--orange-color);
      }
    }
    .collection-icon {
      color: var(--orange-color);
    }
  }
  .status-wrapper {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    min-width: 20px;
    padding: 0 17px;
    height: 32px;
    line-height: 32px;
    border-radius: 0px 0px 4px 4px;
  }
}
</style>
<style lang="scss">
.practice-operation-question-title {
  .cb-markdown {
    .markdown-body {
      padding: 3px 0 0 0;
    }
  }
}
.title-num {
  color: var(--primary-color) !important;
}
.title-score {
  color: var(--orange-color) !important;
}
.desc-content-markdown {
  width: 100%;
  line-height: 24px;
  padding: 3px 0 0 0;
  .cb-markdown .markdown-body {
    padding: 0;
  }
  .copy-btn {
    display: none;
  }
}
</style>
