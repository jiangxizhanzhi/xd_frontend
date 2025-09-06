<template>
  <div class="practice-basic-title-topic">
    <div class="title">
      <span class="catagory-name" v-if="name">【{{ name }}】</span>
      <span class="title-num" v-if="num != null && num != ''">{{ num }}、</span>
      <div class="practice-mavon-title">
        <CbMarkdown
          v-model="scoreContent"
          :xssOptions="xssOptions"
          type="viewer"
        ></CbMarkdown>
      </div>
    </div>
  </div>
</template>
<script>
import xss from 'xss';
export default {
  props: {
    num: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      currentQuestion: this.$t('m.currentQuestion'),
      point: this.$t('m.point'),
      points: this.$t('m.points'),
      xssOptions: {
        whiteList: {},
      },
    };
  },
  computed: {
    scoreContent: {
      get() {
        if (this.score && this.score > 1) {
          const scoreContent = xss(this.content, this.xssOptions);
          //  +
          // '<span class="title-score">( ' +
          // this.currentQuestion +
          // ' ' +
          // this.score +
          // ' ' +
          // this.points +
          // ' )</span>';
          return scoreContent;
        } else if (this.score && this.score <= 1) {
          const scoreContent = xss(this.content, this.xssOptions);
          //  +
          // '<span class="title-score">( ' +
          // this.currentQuestion +
          // ' ' +
          // this.score +
          // ' ' +
          // this.point +
          // ' )</span>';
          return scoreContent;
        }
        return xss(this.content, this.xssOptions);
      },
      set() {},
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  align-items: baseline;

  .title-num {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 30px;
  }
}
.title .catagory-name,
.title .difficutly-name {
  margin-top: 3px;
  // min-width: 100px;
  box-sizing: border-box;
  // padding: 0 20px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  // border-radius: 2px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  margin-right: 10px;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  // border-radius: 100px;
  color: var(--neutral8);
}

.practice-mavon-title {
  word-wrap: break-word;
  word-break: break-all;
  flex: 1;
  width: 0;
  margin-left: -10px;

  ::v-deep {
    .v-show-content {
      background-color: transparent !important;
    }
    .title-score {
      min-width: 100px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 30px;
      margin-left: 10px;
    }
    .markdown-body {
      padding: 10px;
      p {
        margin: 0;
      }
    }
  }
}
.practice-basic-title-topic {
  .catagory-name {
    font-size: 16px;
    background: transparent;
  }
}
</style>
<style lang="scss">
.title-score {
  color: var(--orange-color);
}
.title-num {
  color: var(--primary-color);
}
</style>
