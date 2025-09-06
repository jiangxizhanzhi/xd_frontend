<template>
  <cb-inner-page :background="false">
    <tab-index></tab-index>
  </cb-inner-page>
</template>

<script>
import TabIndex from '../components/TabIndex';
export default {
  name: 'Addrole',
  components: {
    TabIndex,
  },
};
</script>

<style lang="scss" scoped></style>
