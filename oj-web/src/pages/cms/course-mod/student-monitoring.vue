<template>
  <div class="student-monitor-wrapper"></div>
</template>

<script>
export default {
  name: "student-monitor",
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, {emit}) {
    return {}
  },
  data() {
    return {
      activeId: '',
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
</style>
