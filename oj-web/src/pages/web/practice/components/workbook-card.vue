<template>
  <div class="imgbox">
    <img :src="logo" alt="img" />
    <div v-if="logoIsBuiltIn" class="workbook-name-box">
      <div class="workbook-name three-overflow" :title="name">{{ name }}</div>
    </div>
    <div v-if="showCount" class="count-box ft12">
      <span class="count">{{ count }}{{ $t('practice.topic') }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'WorkbookCard',
  components: {},
  props: {
    logo: {
      type: String,
      default: '',
    },
    // 是否后台随机生成的背景图
    logoIsBuiltIn: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    // 是否显示题号
    showCount: {
      type: Boolean,
      default: false,
    },
    count: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.imgbox {
  width: 100%;
  padding-bottom: 58%;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  img {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.5s ease;
    height: 100%;
    border-radius: 2px;
  }
  &:hover {
    img {
      transform: scale(1.1);
      transition: all 0.5s ease;
    }
  }
  .workbook-name-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .workbook-name {
    position: relative;
    width: 100%;
    font-size: 24px;
    font-family: YouSheBiaoTiHei !important;
    color: var(--neutral9);
    line-height: 28px;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
    text-align: center;
    padding: 0 24px;
  }
  .count-box {
    position: absolute;
    width: 100%;
    height: 40px;
    bottom: 0;
    right: 0;
    color: var(--white-color);
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
    .count {
      position: absolute;
      bottom: 6px;
      right: 8px;
    }
  }
}
</style>
