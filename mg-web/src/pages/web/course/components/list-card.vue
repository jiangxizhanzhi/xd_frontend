<template>
  <div class="list-card-container">
    <slot></slot>
  </div>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.list-card-container {
  height: 300px;
  background: var(--bg-color-secondary);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
