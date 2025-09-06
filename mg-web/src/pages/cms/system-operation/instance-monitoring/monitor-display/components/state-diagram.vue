<template>
  <div class="com-wrapper">
    <img :src="entityImg" />
    <div class="right-wrapper">
      <div class="number">{{ number }}</div>
      <div class="desc">
        {{ type }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StateDiagram',
  props: {
    entityImg: String,
    number: Number,
    type: String,
  },
};
</script>
<style lang="scss" scoped>
.com-wrapper {
  // width: 126px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding-right: 8px;
  img {
    width: 70px;
    height: 70px;
  }
  .number {
    font-size: 18px;
    font-weight: bold;
    // text-shadow: 0px 0px 20px #0b1e41;
    color: #bde1ff;
    text-shadow: 0 0 8px rgb(231 239 255 / 20%), 0 0 8px rgb(231 239 255 / 20%),
      0 0 8px rgb(231 239 255 / 20%), 0 0 8px rgb(231 239 255 / 20%);
    background: linear-gradient(0deg, #bde1ff 0%, #ffffff 50%, #e7efff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .desc {
    color: #fff;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }
}
</style>
