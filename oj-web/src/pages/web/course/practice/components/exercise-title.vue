<template>
  <div class="exercise-title">
    <span class="topic-type">{{ name }}</span>
    <!-- <span class="topic-subline"></span> -->
    <span class="total-span">
      ({{ $t('course.total') }}{{ topicLength }}{{ $t('course.topic') }})
      <!-- {{ $t('course.total') }}{{ score }}{{ $t('m.exercisePoints') }} -->
    </span>
  </div>
</template>

<script>
export default {
  name: 'Title',
  props: {
    name: {
      type: String,
      default: '',
    },
    topicLength: {
      type: Number,
      default: null,
    },
    score: {
      type: Number,
      default: null,
    },
  },
};
</script>

<style scoped lang="scss">
.exercise-title {
  width: 100%;
  height: 40px;
  line-height: 40px;

  .topic-type {
    margin-left: 30px;
    font-size: 16px;
  }
  .topic-subline {
    display: inline-block;
    width: 2px;
    height: 16px;
    margin: 0 20px;
    position: relative;
    top: 2px;
    background-image: linear-gradient(0deg, #1f2736 0%, #2e3951 100%);
  }
  .total-span {
    font-size: 14px;
  }
}
</style>
<style lang="scss">
.exercise-title {
  background: var(--bg-color-1);

  span {
    color: var(--neutral8);
  }
}
</style>
