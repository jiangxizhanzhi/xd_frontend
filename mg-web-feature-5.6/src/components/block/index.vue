<template>
  <div class="cb-block">
    <div
      class="cb-block-title-container"
      :style="{ marginBottom: mb ? '20px' : '' }"
    >
      <div class="cb-block-left-border"></div>
      <div v-if="title" class="cb-block-title">
        {{ title }}
        <span class="little-title">
          <slot name="little-title"></slot>
        </span>
      </div>
      <div class="cb-block-suffix-slot">
        <slot name="suffix"></slot>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    title: {
      type: String,
    },

    mb: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  .cb-block {
    &-left-border {
      background: var(--primary-color);
    }
    &-title {
      color: var(--neutral8);
    }
  }
}

.cb-block {
  &-title-container {
    display: flex;
    align-items: center;
  }
  &-left-border {
    width: 6px;
    height: 8px;
    background: var(--primary-color);
  }
  &-title {
    font-size: 16px;
    font-weight: bold;
    padding-left: 8px;
    color: var(--neutral8);
  }
  &-suffix-slot {
    margin-left: auto;
  }
  .little-title {
    font-size: 14px;
    color: var(--neutral5);
    font-weight: 400;
  }
}
</style>
