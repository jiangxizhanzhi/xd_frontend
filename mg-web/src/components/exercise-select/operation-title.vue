<template>
  <!-- 练习实践操作习题详情title -->
  <div class="practice-operation-question-title">
    <div class="title">
      <span class="catagory-name one-overflow" v-if="catagoryName">{{
        catagoryName
      }}</span
      ><span class="difficutly-name one-overflow" v-if="difficutlyName">{{
        difficutlyName
      }}</span
      ><span class="title-num" v-if="num != null && num != ''"
        >{{ num }}、</span
      >
      <div class="content">
        <span>{{ content }}</span>
        <!-- <span class="title-score" v-if="score && score > 1"
          >({{
            $t('m.currentQuestion') + ' ' + score + ' ' + $t('m.points')
          }}
          )</span
        ><span class="title-score" v-if="score && score <= 1"
          >({{
            $t('m.currentQuestion') + ' ' + score + ' ' + $t('m.point')
          }}
          )</span
        > -->
      </div>
    </div>
    <div class="title-line" v-if="type === QUESTIONRESOURSETYPE.PRACTICE"></div>
    <div class="desc" v-if="desc">
      <span class="titleDescription">{{
        $t('m.exercise.titleDescription')
      }}</span
      ><span
        class="titleDescription"
        :class="$store.state.app.language === 'en' ? 'colon-en' : ''"
        >{{ $t('m.colon') }}</span
      >
      <div class="desc-content-markdown">
        <CbMarkdown v-model="desc" type="viewer"></CbMarkdown>
      </div>
    </div>
    <div class="enclosure ft14" v-if="enclosure">
      <a :href="enclosure" target="_blank">
        <cb-iconfont type="icon-xiazai"></cb-iconfont>
        <span>{{ $t('m.exercise.downloadAttachments') }}</span></a
      >
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
    num: {
      type: Number,
      default: null,
    },
    catagoryName: {
      type: String,
      default: '',
    },
    difficutlyName: {
      type: String,
      default: '',
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
  },
  data() {
    return { QUESTIONRESOURSETYPE };
  },
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
::v-deep .cb-markdown .markdown-body {
  padding: 5px 0 0 0;
}
.desc {
  display: flex;
  padding: 0px 30px;
  margin: 12px 0 16px;
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
  padding: 0px 30px;
  margin: 12px 0 12px;
  .cb-iconfont {
    margin-right: 5px;
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
  padding: 13px 30px;
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
</style>
<style lang="scss">
.cb-markdown {
  .markdown-body {
    padding: 3px 0 0 0;
  }
}
.enclosure a,
.title-num {
  color: var(--primary-color) !important;
}
.title-score {
  color: var(--orange-color) !important;
}
.desc-content-markdown {
  width: 100%;
  .copy-btn {
    display: none;
  }
}
</style>
