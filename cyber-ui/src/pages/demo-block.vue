<template>
  <div class="block">
    <!-- <div class="block-component">
      <slot name="vComponent"></slot>
    </div> -->
    <div @click="showCodeFunc" class="block-btn">
      {{ !showCode ? '显示代码' : '隐藏代码' }}
    </div>
    <div class="block-code .cyber-scroll-bar" v-if="showCode">
      <slot name="vCode"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemoBlock',
  props: {},
  data() {
    return {
      showCode: false,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    showCodeFunc() {
      this.showCode = !this.showCode;
    },
  },
  components: {},
};
</script>

<style lang="scss">
.block {
  border-radius: 3px;
  //border: 1px solid themed(cy22);
  border-top: none;
}
.block-component {
  margin-top: 20px;
  padding: 10px;
  //border: 1px solid themed(cy22);
}
.block-btn {
  text-align: center;
  /* border-top: 1px solid #ebebeb; */
  height: 50px;
  line-height: 50px;
  /* margin-top: 10px; */
  color: var(--neutral8);
  cursor: pointer;
}
.block-code {
  width: 100%;
  overflow: auto;
  padding: 10px;
}
</style>
