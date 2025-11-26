<template>
  <div
    class="cb-progress"
    :class="[
      'cb-progress--' + type,
      status ? 'is-' + status : '',
      {
        'el-progress--without-text': !showText,
        'el-progress--text-inside': textInside,
      },
      active ? 'cb-progress-active' : '',
      textInsideClassName,
    ]"
    :style="{
      display:
        type === 'circle' || type === 'dashboard' ? 'inline-block' : 'block',
    }"
    role="progressbar"
    :aria-valuenow="percentage"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div v-if="type === 'line'" class="cb-progress-line">
      <div class="cb-progress-line-slot-left">
        <slot name="line-left"> </slot>
      </div>
      <div class="cb-progress-bar">
        <div class="cb-progress-bar__outer" :style="barOuterStyle">
          <div class="cb-progress-bar__inner" :style="barStyle">
            <div
              class="cb-progress-bar__innerText"
              v-if="showText && textInside"
            >
              <!-- @slot 进度条内部百分比插槽 -->
              <slot name="line-inside-text">
                {{ content }}
              </slot>
            </div>
          </div>
        </div>
      </div>
      <div class="cb-progress-line-slot-right">
        <slot name="line-right">
          <div
            class="cb-progress__text"
            v-if="showText && !textInside"
            :style="{ fontSize: progressTextSize + 'px' }"
          >
            <template v-if="!status">{{ content }}</template>
            <i v-else :class="iconClass"></i>
          </div>
        </slot>
      </div>
    </div>

    <!-- 环形进度条 -->
    <div
      class="cb-progress-circle"
      :style="{ height: width + 'px', width: width + 'px' }"
      v-else
    >
      <svg viewBox="0 0 100 100">
        <path
          class="cb-progress-circle__track"
          :d="trackPath"
          :stroke="strokeColor"
          :stroke-width="relativeStrokeWidth"
          fill="none"
          :style="trailPathStyle"
        ></path>
        <path
          class="cb-progress-circle__path"
          :d="trackPath"
          :stroke="stroke"
          fill="none"
          :stroke-linecap="strokeLinecap"
          :stroke-width="percentage ? relativeStrokeWidth : 0"
          :style="circlePathStyle"
        ></path>
      </svg>
      <div
        class="cb-progress-circle__text"
        v-if="showText"
        :style="{ fontSize: progressTextSize + 'px' }"
      >
        <!-- @slot 环形进度条内部百分比插槽 -->
        <slot name="circle-text">
          <template v-if="!status">{{ content }}</template>
          <i v-else :class="iconClass"></i>
        </slot>
      </div>
      <div
        class="cb-progress-circle__title"
        :style="{ bottom: titleTop + 'px' }"
      >
        <!-- @slot 环形进度条title插槽 -->
        <slot name="circle-title" v-if="showText">
          <span :title="circleTitle">{{ circleTitle }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
import { getTheme } from '@cyber/helper';
import ListenDomChange from '../../../utils/listen-dom';

/**
 * @displayName cb-progress 进度条
 * @classify Form/表单
 */
export default {
  name: 'CbProgress',
  props: {
    /**
     * 是否激活
     */
    active: {
      type: Boolean,
      default: false,
    },
    /**
     * circle/dashboard title 顶部负距离
     */
    titleTop: {
      type: String | Number,
      default: 30,
    },
    /**
     * circle/dashboard 的title
     */
    circleTitle: {
      type: String,
      default: '',
    },
    /**
     * 进度条类型
     * @value line/circle/dashboard
     */
    type: {
      type: String,
      default: 'line',
      validator: (val) => ['line', 'circle', 'dashboard'].indexOf(val) > -1,
    },
    /**
     * 百分比（必填）
     */
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: (val) => val >= 0 && val <= 100,
    },
    /**
     * 进度条当前状态
     * @value success/exception/warning
     */
    status: {
      type: String,
      // default: 'deafult',
      validator: (val) =>
        ['deafult', 'success', 'exception', 'warning'].indexOf(val) > -1,
    },
    /**
     * 进度条的宽度，单位 px
     */
    strokeWidth: {
      type: Number,
      default: 6,
    },
    /**
     * circle/dashboard 类型路径两端的形状
     * @values butt/round/square
     */
    strokeLinecap: {
      type: String,
      default: 'butt',
    },
    /**
     * 进度条显示文字内置在进度条内（只在 type=line 时可用）
     */
    textInside: {
      type: Boolean,
      default: false,
    },
    /**
     * 环形进度条画布宽度（只在 type 为 circle 或 dashboard 时可用）
     */
    width: {
      type: Number,
      default: 126,
    },
    /**
     * 	是否显示进度条文字内容
     */
    showText: {
      type: Boolean,
      default: true,
    },
    /**
     * 有进度部分背景色（会覆盖 status 状态颜色）
     */
    color: {
      type: [String, Array, Function],
      default: '',
    },
    /**
     * 进度条背景色
     */
    bgColor: {
      type: String,
    },
    /**
     * 指定进度条文字内容
     */
    format: Function,
  },
  data() {
    return {
      strokeColor: this.$themed('neutral0'),
      theme: getTheme(),
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
    };
  },
  computed: {
    textInsideClassName() {
      return this.textInside ? 'cb-progress-text-inside' : '';
    },
    barOuterStyle() {
      const style = {};
      style.height = this.strokeWidth + 'px';
      this.bgColor ? (style.backgroundColor = this.bgColor) : '';
      if (this.strokeLinecap == 'round') {
        style.borderRadius = this.strokeWidth + 'px';
      }
      return style;
    },
    barStyle() {
      const style = {};
      style.width = this.percentage + '%';
      style.backgroundColor = this.getCurrentColor(this.percentage);
      if (this.strokeLinecap == 'round') {
        style.borderRadius = this.strokeWidth + 'px';
      }
      if (this.textInside && this.percentage <= 25) {
        style.justifyContent = 'unset';
      }
      return style;
    },
    relativeStrokeWidth() {
      return ((this.strokeWidth / this.width) * 100).toFixed(1);
    },
    radius() {
      if (this.type === 'circle' || this.type === 'dashboard') {
        return parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10);
      } else {
        return 0;
      }
    },
    trackPath() {
      const radius = this.radius;
      const isDashboard = this.type === 'dashboard';
      return `
          M 50 50
          m 0 ${isDashboard ? '' : '-'}${radius}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '-' : ''}${radius * 2}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '' : '-'}${radius * 2}
          `;
    },
    perimeter() {
      return 2 * Math.PI * this.radius;
    },
    rate() {
      return this.type === 'dashboard' ? 0.75 : 1;
    },
    strokeDashoffset() {
      const offset = (-1 * this.perimeter * (1 - this.rate)) / 2;
      return `${offset}px`;
    },
    trailPathStyle() {
      return {
        strokeDasharray: `${this.perimeter * this.rate}px, ${this.perimeter}px`,
        strokeDashoffset: this.strokeDashoffset,
      };
    },
    circlePathStyle() {
      return {
        strokeDasharray: `${
          this.perimeter * this.rate * (this.percentage / 100)
        }px, ${this.perimeter}px`,
        strokeDashoffset: this.strokeDashoffset,
        transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease',
      };
    },
    stroke() {
      let ret;
      if (this.theme) {
        if (this.color) {
          ret = this.getCurrentColor(this.percentage);
        } else {
          switch (this.status) {
            case 'success':
              ret = this.$themed('green-color');
              break;
            case 'exception':
              ret = this.$themed('red-color');
              break;
            case 'warning':
              ret = this.$themed('orange-color');
              break;
            default:
              ret = this.$themed('primary-color');
          }
        }
      }
      return ret;
    },
    iconClass() {
      if (this.status === 'warning') {
        return 'el-icon-warning';
      }
      if (this.type === 'line') {
        return this.status === 'success'
          ? 'el-icon-circle-check'
          : 'el-icon-circle-close';
      } else {
        return this.status === 'success' ? 'el-icon-check' : 'el-icon-close';
      }
    },
    progressTextSize() {
      return this.type === 'line'
        ? 12 + this.strokeWidth * 0.4
        : this.width * 0.111111 + 2;
    },
    content() {
      if (typeof this.format === 'function') {
        return this.format(this.percentage) || '';
      } else {
        return `${this.percentage}%`;
      }
    },
  },
  mounted() {
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    listenFunc() {
      this.strokeColor = this.$themed('neutral0');
      const className = document.body.className.split(' ');
      if (className.indexOf('theme-dark') != -1) {
        this.theme = 'theme-dark';
      } else {
        this.theme = 'theme-light';
      }
    },
    getCurrentColor(percentage) {
      if (typeof this.color === 'function') {
        return this.color(percentage);
      } else if (typeof this.color === 'string') {
        return this.color;
      } else {
        return this.getLevelColor(percentage);
      }
    },
    getLevelColor(percentage) {
      const colorArray = this.getColorArray().sort(
        (a, b) => a.percentage - b.percentage,
      );

      for (let i = 0; i < colorArray.length; i++) {
        if (colorArray[i].percentage > percentage) {
          return colorArray[i].color;
        }
      }
      return colorArray[colorArray.length - 1].color;
    },
    getColorArray() {
      const color = this.color;
      const span = 100 / color.length;
      return color.map((seriesColor, index) => {
        if (typeof seriesColor === 'string') {
          return {
            color: seriesColor,
            percentage: (index + 1) * span,
          };
        }
        return seriesColor;
      });
    },
  },
};
</script>
