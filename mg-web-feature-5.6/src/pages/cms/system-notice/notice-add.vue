<template>
  <cb-inner-page class="notice-add-view" :background="false">
    <notice-form />
  </cb-inner-page>
</template>

<script lang="ts">
import NoticeForm from './components/notice-form.vue';
export default {
  components: {
    NoticeForm,
  },
};
</script>

<style lang="scss" scoped></style>
