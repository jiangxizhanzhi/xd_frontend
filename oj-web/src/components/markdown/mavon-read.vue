<template>
  <div class="sn-xxx-xxx-xxx">
    <cb-markdown
      ref="myQuillEditor"
      v-model="markComputed"
      type="viewer"
    ></cb-markdown>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    mavonData: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {
    markComputed: {
      get() {
        return this.mavonData || '';
      },
      set(val) {
        this.$emit('update:mavonData', val);
      },
    },
  },
  methods: {},
};
</script>
