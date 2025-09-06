<template>
  <div class="login-model">
    <div v-for="(item, index) in connections" :key="index">
      <cb-button class="btn mb30" @click="goto(item)">
        {{ item.protocol
        }}{{ $t('systemOperation.realEquipmentManagement.login') }}
      </cb-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    connections: {
      type: Array,
      default: () => [],
    },
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    goto(item) {
      if (item.url) {
        window.open(item.url, '_blank');
      }
    },
  },
};
</script>
<style lang="scss">
.login-model {
  .cb-button {
    width: 100%;
    .el-button {
      width: 52%;
      margin: 0 auto;
    }
  }
}
</style>
<style lang="scss" scoped></style>
