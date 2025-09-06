<template>
  <div
    class="lesson-wrapper"
    :class="{ 'lesson-wrapper-bg': noBackground }"
    @click="toLessonDetail(item)"
  >
    <div class="learn-progress" :style="{ '--percent': item.learn }">
      <div class="pie-left"></div>
      <div class="pie-right"></div>
    </div>
    <span
      class="lesson-type"
      :class="[
        item.type === 0 ? 'theory' : item.type === 1 ? 'experiment' : '',
      ]"
      >{{
        item.type === 0
          ? $t('m.theoryCourse')
          : item.type === 1
          ? $t('m.experimentCourse')
          : ''
      }}</span
    >
    <div class="name-wrapper" :title="`${item.type_index} ${item.name}`">
      {{ `${item.type_index} ${item.name}` }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'Lesson',
  props: {
    item: {
      type: Object,
      default: {},
    },
    noBackground: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    toLessonDetail(data) {
      this.$router.push({
        name: 'oj-course-lesson',
        params: {
          resource_id: data.course_id,
          lesson_id: data.lesson_id,
        },
      });
    },
  },
};
</script>
<style scoped lang="scss">
@mixin ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lesson-wrapper {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  margin-bottom: 4px;
  border-radius: 4px;
  background-color: var(--neutral0);
  cursor: pointer;
  .learn-progress {
    width: 14px;
    height: 14px;
    vertical-align: middle;
    text-align: left;
    border-radius: 50%;
    border: 1px solid var(--neutral4);
    overflow: hidden;
    display: inline-block;
    .pie-left,
    .pie-right {
      width: 50%;
      height: 100%;
      float: left;
      position: relative;
      overflow: hidden;
    }
    .pie-left::before,
    .pie-right::before,
    .pie-right::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100% !important;
      background-color: var(--green-color);
    }
    .pie-left::before {
      left: 100%;
      transform-origin: left;
      transform: rotate(calc(3.6deg * (var(--percent) - 50)));
      opacity: calc(99999 * (var(--percent) - 50));
    }
    .pie-right::before {
      right: 100%;
      transform-origin: right;
      transform: rotate(calc(3.6deg * var(--percent)));
    }
    .pie-right::after {
      opacity: calc(99999 * (var(--percent) - 50));
    }
  }
  .lesson-type {
    font-size: 12px;
    padding: 2px 4px;
    margin: 0 9px;
    border-radius: 2px;
  }
  .lesson-type.theory {
    background-color: var(--primary-color-2);
    color: var(--primary-color);
  }
  .lesson-type.experiment {
    background-color: var(--green-color-2);
    color: var(--green-color);
  }
  .name-wrapper {
    width: calc(100% - 100px);
    font-size: 14px;
    color: var(--neutral8);
    @include ellipsis;
  }
}
.lesson-wrapper-bg {
  background-color: transparent;
}
</style>
