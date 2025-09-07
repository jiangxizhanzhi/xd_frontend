<template>
  <div class="cb-count-up" :style="{ color: fontColor, fontSize }">
    <span v-if="$slots.default" ref="num"></span>
    <span v-else ref="num"></span>
  </div>
</template>
<script>
import { CountUp } from 'countup.js';
import { themed } from '../../../utils/themes';
import ListenDomChange from '../../../utils/listen-dom';

/**
 * @displayName cb-count-up 数字动画
 * @classify Visualize/可视化
 */
export default {
  name: 'CbCountUp',
  props: {
    /**
     * 开始数字
     */
    start: {
      type: [Number, String],
      default: 0,
    },
    /**
     * 结束数字
     */
    end: {
      type: [Number, String],
      default: 0,
    },
    /**
     * 小数位数
     */
    decimals: {
      type: Number,
      default: 0,
    },
    /**
     * 是否开启延时动画
     */
    animate: {
      type: Boolean,
      default: true,
    },
    /**
     * 持续时间 秒
     */
    duration: {
      type: Number,
      default: 6,
    },
    /**
     * 分组分割
     */
    separator: {
      type: String,
      default: '',
    },
    /**
     * 自定义颜色
     */
    color: {
      type: String,
      default: 'neutral8',
    },
    /**
     * 自定义大小
     */
    size: {
      type: [Number, String],
      default: 16,
    },
  },
  data() {
    return {
      count: null,
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      fontColor:
        this.color.includes('#') || this.color.includes('rgb')
          ? this.color
          : themed(this.color),
    };
  },
  computed: {
    fontSize() {
      return this.size + 'px';
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  watch: {
    end() {
      this.update();
    },
  },
  methods: {
    init() {
      if (!this.count) {
        let num = _.get(this.$slots, 'default.0.text');
        this.count = new CountUp(this.$refs.num, num || this.end, {
          startVal: this.start,
          decimalPlaces: this.decimals,
          useEasing: this.animate,
          duration: this.duration,
          separator: this.separator,
        });
        this.count.pauseResume();
      }
    },
    update() {
      let num = _.get(this.$slots, 'default.0.text');
      this.count && this.count.update && this.count.update(num || this.end);
    },
    reset() {
      this.count && this.count.reset && this.count.reset();
    },
    pauseResume() {
      this.count && this.count.pauseResume && this.count.pauseResume();
    },
    listenFunc() {
      this.fontColor =
        this.color.includes('#') || this.color.includes('rgb')
          ? this.color
          : themed(this.color);
    },
  },
};
</script>
