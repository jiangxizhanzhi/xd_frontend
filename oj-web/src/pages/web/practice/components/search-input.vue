<template>
  <div class="search-wrapper-box">
    <cb-search-input
      v-model="sceneName"
      size="mini"
      :placeholder="placeholderName"
      @keyup.native.enter="searchCon"
    >
      <!-- <i
      class="el-input__icon el-icon-search search-icon"
      slot="prefix"
      @click="searchCon"
    ></i
  > -->
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
    val: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      sceneName: '',
    };
  },
  watch: {
    val: {
      handler(data, oldval) {
        if (data.length > 0) {
          this.sceneName = this.val;
        }
      },
      immediate: true,
      deep: true,
    },
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
  position: absolute;
  right: 0;
  top: 0px;
  width: 300px;
  .search-input {
    ::v-deep .el-input__inner {
      // height: 40px;
      // line-height: 40px;
      // border-radius: 2px;
      // padding-left: 40px;
      // font-size: 14px;
    }

    ::v-deep .el-input__icon {
      height: 100%;
      width: 25px;
      text-align: center;
      transition: all 0.3s;
      line-height: 40px;
      font-size: 14px;
    }
  }
}
</style>
