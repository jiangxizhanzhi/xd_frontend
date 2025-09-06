<template>
  <div class="barrage-wrapper" ref="box"></div>
</template>
<script>
import { Barrage } from './barrage.js';
export default {
  components: {},
  props: {
    data: {
      type: Array,
      default: () => [
        '0000',
        '111111',
        '22222222',
        '3333333333',
        '44444444444',
        '55555555555555',
        '666666666666666',
        '77777777777777777',
        '888888888888888888888',
        '999999999999999999999999',
      ],
    },
  },
  data() {
    return {
      barrage: null,
    };
  },
  mounted() {
    this.init();
    this.__resizeHandler = _.debounce(() => {
      this.barrage.destroyed();
      this.init();
    }, 500);
    window.addEventListener('resize', this.__resizeHandler);
  },
  watch: {},
  methods: {
    init() {
      this.barrage = new Barrage(
        this.$refs.box,
        this.data.map((el) => `<span class="barrage-item-text">${el}</span>`),
        {
          className: 'barrage-item',
          loop: true,
          speed: 0.5,
          dislocate: false,
          interval: 50,
          lineCount: 4,
        },
      );
      this.barrage.init();
      this.barrage.start();
    },
    addNewItem(newItem) {
      this.barrage.addItem(`<span class="barrage-item-text">${newItem}</span>`);
    },
    setData(newData) {
      this.barrage.setData(
        newData.map((el) => `<span class="barrage-item-text">${el}</span>`),
      );
    },
  },
  destroyed() {
    this.barrage.destroyed();
  },
};
</script>
<style lang="scss" scoped>
.barrage-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
<style lang="scss">
.barrage-item {
  position: absolute;
  padding: 5px 20px 5px 10px;
  white-space: nowrap;

  &-text {
    position: relative;
    z-index: 2;
  }

  &::before {
    position: absolute;
    z-index: 1;
    content: '';
    display: block;
    inset: 0;
    transform: skew(30deg);
    background: var(--train-barrage-bg);
  }
}
</style>
