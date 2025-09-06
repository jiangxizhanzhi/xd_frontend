<template>
  <cb-inner-page :background="false">
    <tab-index :id="$route.query.id"></tab-index>
  </cb-inner-page>
</template>

<script>
import TabIndex from '../components/TabIndex';
export default {
  name: 'EditRole',
  components: {
    TabIndex,
  },
};
</script>

<style lang="scss" scoped></style>
