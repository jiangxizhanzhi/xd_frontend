<template>
  <div class="live-icon">
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
  </div>
</template>

<script>
export default {
  name: 'living-icon',
  components: {},
  props: {},
  setup(props, { emit }) {
    return {};
  },
};
</script>

<style scoped lang="scss">
.live-icon {
  display: inline-block;
  width: 15px;
  height: 15px;
  position: relative;
  overflow: hidden;
  margin-left: 5px;
  margin-right: 5px;
  .bar {
    width: 1.2px;
    background-color: var(--neutral8);
    position: absolute;
    bottom: 0;
  }

  .bar:nth-child(1) {
    left: 15%;
    height: 25%;
    animation: pulse 0.5s infinite alternate ease-in-out;
  }

  .bar:nth-child(2) {
    left: 38%;
    height: 70%;
    animation: pulse 0.7s infinite alternate ease-in-out;
  }

  .bar:nth-child(3) {
    left: 55%;
    height: 60%;
    animation: pulse 0.5s infinite alternate ease-in-out;
  }

  .bar:nth-child(4) {
    left: 72%;
    height: 30%;
    animation: pulse 0.7s infinite alternate ease-in-out;
  }

  .bar:nth-child(5) {
    left: 89%;
    height: 30%;
    animation: pulse 0.6s infinite alternate ease-in-out;
  }

  @keyframes pulse {
    0% {
      transform: scaleY(1);
    }
    100% {
      transform: scaleY(2);
    }
  }
}
</style>
