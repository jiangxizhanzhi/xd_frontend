<template>
  <div class="nodeConIn">
    <div class="imgDiv">
      <img :src="imgUrl" alt="" class="imgsize" />

      <div class="count">{{ count }}</div>
    </div>
    <div class="type">{{ type }}</div>
  </div>
</template>

<script>
import contain from '../../../assets/img/icon_ontain.png';
import device from '../../../assets/img/icon-device.png';
import viturl from '../../../assets/img/icon-viturl.png';
export default {
  props: {
    count: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: '虚拟机',
    },
    imgUrl: {
      type: String,
      default: contain,
    },
  },
  data() {
    return {
      contain,
      viturl,
      device,
    };
  },
};
</script>

<style lang="scss" scoped>
.imgDiv {
  position: relative;
  img {
    width: auto;
    height: 100%;
  }
  .count {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    font-weight: bold;
    text-shadow: 0 0 8px rgb(231 239 255 / 20%), 0 0 8px rgb(231 239 255 / 20%),
      0 0 8px rgb(231 239 255 / 20%), 0 0 8px rgb(231 239 255 / 20%);
    background: linear-gradient(
      0deg,
      #bde1ff 0%,
      #ffffff 50.4150390625%,
      #e7efff 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.type {
  font-size: 12px;
}
</style>
