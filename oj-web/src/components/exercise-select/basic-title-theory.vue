<template>
  <div class="practice-topic-title">
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
      <div v-if="name" class="direction-wrapper">
        <div class="direction-box com-box one-overflow" :title="name">
          {{ name }}
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
      <div v-if="showNote" class="note-wrapper" @click="note()">
        <cb-iconfont type="icon-jianda1" />
        <span style="font-size: 14px">{{ $t('m.notes') }}</span>
      </div>
    </div>
    <div
      v-if="showStatus"
      class="status-wrapper"
      :class="{
        'orange-box': solved === THEORYSTATUSTYPE.Tried,
        'green-box': solved === THEORYSTATUSTYPE.Solved,
        'gray-box': solved === THEORYSTATUSTYPE.NotStart,
      }"
    >
      <cb-iconfont
        v-if="solved === THEORYSTATUSTYPE.Tried"
        type="icon-guanbi"
        size="18"
      />
      <cb-iconfont
        v-else-if="solved === THEORYSTATUSTYPE.Solved"
        type="icon-gou"
        size="18"
      />
      <cb-iconfont
        v-else-if="solved === THEORYSTATUSTYPE.NotStart"
        type="icon-jianshao"
        size="18"
      />
      <span v-if="solved === THEORYSTATUSTYPE.Tried">
        {{ $t('practice.tried') }}
      </span>
      <span v-else-if="solved === THEORYSTATUSTYPE.Solved">
        {{ $t('m.solved') }}
      </span>
      <span v-else-if="solved === THEORYSTATUSTYPE.NotStart">
        {{ $t('m.toStart') }}
      </span>
    </div>
  </div>
</template>
<script>
import xss from 'xss';
import { THEORYSTATUSTYPE } from '@/pages/web/practice/constant.js';
export default {
  props: {
    // 用于组卷记录详情for循环里的收藏
    id: {
      type: [Number, String],
      default: '',
    },
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
    isCollection: {
      type: Boolean,
      default: false,
    },
    difficultName: {
      type: String,
      default: '',
    },
    difficult: {
      type: Number,
      default: null,
    },
    knowledgeDatas: {
      type: Array,
      default: [],
    },
    // 解题状态
    solved: {
      type: Number,
      default: null,
    },
    showNote: {
      type: Boolean,
      default: false,
    },
    showStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      THEORYSTATUSTYPE,
      currentQuestion: this.$t('m.currentQuestion'),
      point: this.$t('m.point'),
      points: this.$t('m.points'),
      xssOptions: {
        whiteList: {},
      },
    };
  },
  computed: {
    knowledgeDatasJoin() {
      return this.knowledgeDatas.join('、');
    },
  },
  methods: {
    collection() {
      this.$emit('collection-change', this.isCollection, this.id);
    },
    note() {
      this.$emit('show-note');
    },
  },
};
</script>
<style lang="scss" scoped>
.com-box {
  background: var(--neutral0);
  border-radius: 2px;
  height: 32px;
  line-height: 32px;
  padding: 0 8px;
  color: var(--neutral8);
  font-size: 14px;
}
.practice-topic-title {
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

  .collection-wrapper,
  .note-wrapper {
    cursor: pointer;
    color: var(--neutral7);
    .cb-iconfont {
      color: var(--neutral7);
    }
    span {
      margin-left: 4px;
    }
  }
  .note-wrapper {
    margin-left: 24px;
    &:hover {
      .cb-iconfont {
        color: var(--primary-color-8);
      }
      span {
        color: var(--primary-color-8);
        text-decoration: underline;
      }
    }
  }
  .collection-wrapper {
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
  .green-box {
  }
}
</style>
<style lang="scss">
.practice-topic-title {
  .orange-box {
    .cb-iconfont {
      color: var(--orange-color);
    }
  }
  .green-box {
    .cb-iconfont {
      color: var(--green-color);
    }
  }
  .gray-box {
    .cb-iconfont {
      color: var(--neutral8-color);
    }
  }
}
</style>
