<template>
  <div class="view">
    <div class="text more" ref="more">占位</div>
    <div class="content" v-for="(item, index) in curData" :key="index">
      <!-- <div class="text"> -->
      <div :class="getI18Nn().locale === 'en-US' ? 'text-en' : 'text'">
        <div
          :class="{ retract: item.status }"
          :style="{ 'max-height': item.status ? textHeight : '' }"
          ref="textContainer"
        >
          {{ item.desc }}
        </div>
        <div class="btn">
          <p v-if="item.status" @click="item.status = false">
            ...<span
              >{{ $t('assessment.onAll') }} <i class="el-icon-arrow-down"></i
            ></span>
          </p>
          <p v-if="item.status == false" @click="item.status = true">
            <span
              >{{ $t('assessment.packUp') }}<i class="el-icon-arrow-up"></i
            ></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getI18N } from '@cyber/helper';
export default {
  name: 'expandText',
  props: {
    text: {
      type: String,
      default() {
        return '';
      },
    },
  },

  data() {
    return {
      curData: [{ desc: this.text }],
      textHeight: null,
    };
  },
  created() {},
  mounted() {
    this.curData.forEach((ele, index) => {
      this.$set(this.curData, index, Object.assign({}, ele, { status: null }));
    });
    // DOM 加载完执行
    this.$nextTick(() => {
      this.calculateText();
    });

    window.onresize = () => {
      this.curData.forEach((ele, index) => {
        this.$set(
          this.curData,
          index,
          Object.assign({}, ele, { status: null }),
        );
      });
      setTimeout(() => {
        this.calculateText();
      }, 0);
    };
  },
  methods: {
    getI18Nn() {
      return getI18N();
    },
    // 计算文字 显示展开 收起
    calculateText() {
      // 获取一行文字的height 计算当前文字比较列表文字
      let oneHeight = this.$refs?.more?.scrollHeight;
      let twoHeight = oneHeight * 2 || 40;
      this.textHeight = `${twoHeight}px`;
      let txtDom = this.$refs.textContainer;
      for (let i = 0; i < txtDom.length; i++) {
        let curHeight = txtDom[i].offsetHeight;
        if (curHeight > twoHeight) {
          this.$set(
            this.curData,
            i,
            Object.assign({}, this.curData[i], { status: true }),
          );
        } else {
          this.$set(
            this.curData,
            i,
            Object.assign({}, this.curData[i], { status: null }),
          );
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
.content {
  display: flex;
}

.text {
  position: relative;
  top: -18px;
  left: 66px;
  font-size: 14px;
  word-break: break-all;
}
.text-en {
  position: relative;
  top: -18px;
  left: 90px;
  font-size: 14px;
  word-break: break-all;
}

.retract {
  position: relative;
  overflow: hidden;
  line-height: 17px;
}

.btn {
  height: 20px;
  position: absolute;
  right: 0;
  bottom: -2px;
  font-size: 14px;
  cursor: pointer;
  background: var(--bg-color-2);
  p {
    margin: 0;
    span {
      margin-left: 5px;
      color: var(--primary-color);
    }
  }
}

.more {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 14px;
  visibility: hidden;
}
</style>
