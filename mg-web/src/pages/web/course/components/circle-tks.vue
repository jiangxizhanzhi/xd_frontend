<template>
  <div class="circle-tks cursor">
    <div
      class="left-box"
      :class="{ t: type === 'T', k: type === 'K', s: type === 'S' }"
    >
      <div class="overlay-box">
        {{ type }}
      </div>
    </div>
    <div class="right-box">
      <span class="num">{{ count }}</span
      ><br />
      <span class="desc">{{ desc }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: [String],
      default: '',
    },
    count: {
      type: [Number, String],
      default: null,
    },
    desc: {
      type: [String],
      default: '',
    },
  },
  setup(props) {},
};
</script>
<style lang="scss" scoped>
.circle-tks {
  display: flex;
  .t {
    color: var(--primary-color);
  }
  .k {
    color: var(--orange-color);
  }
  .s {
    color: var(--green-color);
  }
  .left-box {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--bg-color-3);
    margin-right: 15px;
    .overlay-box {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      font-size: 24px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background: var(--neutral0);
      }
    }
  }
  .right-box {
    text-align: left;
    padding-top: 9px;
    .num {
      font-size: 24px;
      font-family: HelveticaNeue-Bold, HelveticaNeue;
      font-weight: bold;
      color: var(--neutral8);
    }
    .desc {
      font-size: 12px;
      color: var(--neutral7);
    }
  }
}
</style>
