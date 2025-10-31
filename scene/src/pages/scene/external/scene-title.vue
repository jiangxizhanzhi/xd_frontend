<template>
  <div class="info-name ft16">
    <div class="g-title cursor">
      <cb-tooltip effect="dark" :content="title" placement="bottom-start">
        <span>{{ title }}</span>
      </cb-tooltip>
    </div>
    <i></i>
  </div>
</template>
<script>
export default {
  name: 'SceneTitle',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@mixin name-position {
  position: absolute;
  top: 0;
  right: -40px;
  width: 40px;
  height: 40px;
}

.info-name {
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-block;
  min-width: 310px;
  padding-left: 19px;
  font-weight: bold;
  color: #131416;
  background-color: var(--primary-color);
  height: 40px;
  line-height: 40px;
  z-index: 1;
  .g-title {
    display: inline-block;
    max-width: 600px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-right: 15px;
    font-weight: bold;
  }

  &::after {
    content: '';
    @include name-position;
    top: 0px;
    height: 40px;
    box-sizing: border-box;
  }

  i {
    @include name-position;
    border-width: 20px;
    border-style: solid;
    border-color: transparent transparent var(--primary-color) var(--primary-color);
    transform: rotate(90deg);
    box-sizing: border-box;
  }
}
</style>
