<template>
  <div class="cb-steps-item">
    <div class="cb-steps-item-content">
      <slot name="icon" :index="stepNumber" :current="currentStatus">
        <div
          class="cb-steps-icon"
          :class="{ 'step-active-icon': currentStatus >= stepNumber }"
        >
          {{ stepNumber }}
        </div>
      </slot>

      <slot name="title" :index="stepNumber" :current="currentStatus">
        <div
          class="cb-steps-item-content-title"
          :title="title"
          :class="{ 'step-active': stepNumber <= currentStatus }"
        >
          {{ title }}
        </div>
      </slot>
    </div>
    <div
      class="cb-steps-item-line"
      :class="{ 'step-line-active': currentStatus > stepNumber }"
    ></div>
  </div>
</template>

<script>
/**
 * @displayName cb-step
 * @ignore
 */
export default {
  name: 'CbStep',
  inject: ['active'],
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      stepNumber: 0,
      currentStatus: 1,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.$watch('$parent.active', (val) => this.updateStatus(val), {
      immediate: true,
    });
  },
  watch: {},
  methods: {
    updateStatus(val) {
      this.currentStatus = val;
    },
  },
  components: {},
};
</script>
