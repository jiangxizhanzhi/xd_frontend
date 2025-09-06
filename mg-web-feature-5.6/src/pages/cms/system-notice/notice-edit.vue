<template>
  <cb-inner-page class="notice-edit-view" :background="false">
    <notice-form :id="$route.query.noticeId" />
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
