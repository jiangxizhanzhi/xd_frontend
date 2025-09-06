<template>
  <div class="nodeConIn">
    <div class="imgDiv">
      <img :src="imgUrl" alt="" class="imgsize" />
    </div>
    <div class="text">
      <div>
        <div class="count button-shadow">{{ count }}</div>
        <div class="type">{{ type }}</div>
      </div>
    </div>
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
.button-shadow {
  text-shadow: 0 0 8px rgba(231, 239, 255, 0.2),
    0 0 8px rgba(231, 239, 255, 0.2), 0 0 8px rgba(231, 239, 255, 0.2),
    0 0 8px rgba(231, 239, 255, 0.2);
  background: linear-gradient(0deg, #bde1ff 0%, #ffffff 50%, #e7efff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}
.imgDiv {
  position: relative;
  width: 50%;
  height: 100%;
  img {
    height: 100%;
    width: 85%;
  }
}
.text {
  position: relative;
  width: 70px;
  & > div {
    position: absolute;
    top: 50%;
    transform: translateY(-70%);
  }
}
// .text > div {
//   position: absolute;
//   top: 50%;
//   transform: translateY(-70%);
// }
.count {
  font-size: 18px;
  font-weight: bold;
  padding-top: 8px;
}
.type {
  font-size: 12px;
}
</style>
