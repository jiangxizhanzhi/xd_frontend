<template>
  <div class="course-outline">
    <CbMarkdown v-model="outlineData" type="viewer"></CbMarkdown>
  </div>
</template>

<script>
export default {
  props: {
    outlineData: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.course-outline {
  width: 100%;
  min-height: 100%;
}
</style>
