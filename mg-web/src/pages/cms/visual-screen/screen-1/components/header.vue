<!--
 * @Author: wangzhongjie
 * @Date: 2021-09-17 15:59:38
 * @LastEditors: wangzhongjie
 * @LastEditTime: 2021-09-24 14:18:47
 * @Description: 头部组件
 * @Email: UvDream@163.com
-->
<template>
  <div class="visual-screen__header" :class="className">
    <!-- icon -->
    <div v-if="level === 1" class="visual-screen__header-icon">
      <cb-iconfont
        v-if="title === '攻击统计'"
        type="icon-gongjitongji"
        size="40"
      ></cb-iconfont>
      <cb-iconfont
        type="icon-zichanjiankong"
        v-if="title === '资产监控'"
        size="40"
      ></cb-iconfont>
      <cb-iconfont
        type="icon-zhujitongji"
        v-if="title === '主机统计'"
        size="40"
      ></cb-iconfont>
      <cb-iconfont
        type="icon-gongfangrizhi"
        v-if="title === '攻防日志'"
        size="40"
      ></cb-iconfont>
      <cb-iconfont
        type="icon-weixiefaxian"
        v-if="title === '威胁发现'"
        size="40"
      ></cb-iconfont>
    </div>
    <!-- 小蓝边 -->
    <div v-if="level === 3" class="visual-screen__header-block"></div>
    <div class="visual-screen__header-title">
      {{ title }}
    </div>
    <div class="visual-screen__header-bg" v-if="level === 1"></div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 1,2,3
     */
    level: {
      type: Number,
      default: 1,
    },
    /**
     * 图标
     */
    icon: {
      type: String,
      default: '',
    },
    /**
     * 文字
     */
    title: {
      type: String,
      default: '攻击统计',
    },
  },
  data() {
    return {};
  },
  computed: {
    className() {
      return 'visual-screen__header-' + this.level;
    },
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {},
};
</script>
