<template>
  <cb-select v-model="value" @change="handleSelectChange" placeholder="请选择">
    <cb-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </cb-option>
  </cb-select>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
    },
    scoreData: {
      type: Number,
    },
  },
  data() {
    return {
      value: this.scoreData,
    };
  },
  mounted() {},
  methods: {
    handleSelectChange(data) {
      this.$emit('selectChange', data);
    },
  },
  watch: {
    scoreData(newVal) {
      this.value = newVal;
    },
  },
};
</script>
<style>
.cb-select {
}
</style>
