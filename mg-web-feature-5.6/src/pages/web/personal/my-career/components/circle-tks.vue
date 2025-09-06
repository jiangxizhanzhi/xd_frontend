<template>
  <div class="circle-tks cursor">
    <div
      class="top-box"
      :class="{ t: type === 'T', k: type === 'K', s: type === 'S' }"
    >
      {{ type }}
    </div>
    <div class="bottom-box">
      <span class="num">{{ count }}</span>
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
  flex-direction: column;
  .t {
    color: var(--primary-color);
  }
  .k {
    color: var(--orange-color);
  }
  .s {
    color: var(--green-color);
  }
  .top-box {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--neutral0);
    font-size: 24px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .top-box:hover {
    background: var(--neutral1);
  }
  .bottom-box {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .num {
      font-size: 24px;
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
