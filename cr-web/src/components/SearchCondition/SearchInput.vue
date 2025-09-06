<template>
  <div class="search-wrapper-box">
    <cb-search-input
      v-model="sceneName"
      :placeholder="placeholderName"
      @change="searchCon"
    >
    </cb-search-input>
  </div>
</template>
<script>
export default {
  name: 'SearchInput',
  props: {
    placeholderName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      sceneName: '',
    };
  },
  methods: {
    searchCon() {
      this.$emit('sendSearchName', this.sceneName);
    },
  },
};
</script>
<style lang="scss" scoped>
.search-wrapper-box {
  margin-bottom: 24px;
}
</style>
