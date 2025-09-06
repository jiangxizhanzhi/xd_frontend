<template>
  <div class="search-condition-comp">
    <cb-filter-condition
      :condition="typeCondition"
      :filterList="typeLists"
      @change="changeTypeCondition"
    ></cb-filter-condition>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    typeCondition: {
      type: String,
      default: '',
    },
    typeLists: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchCondition: '',
    };
  },
  computed: {
    isEn() {
      return this.$store.getters.language === 'en';
    },
  },
  methods: {
    changeTypeCondition(val) {
      this.searchCondition = val.value;
      this.sendParams(this.searchCondition);
    },
    sendParams(nv) {
      const params = JSON.parse(JSON.stringify(nv));
      this.$emit('sendSearchCondition', params);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-condition-comp {
  font-size: 14px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;

  .title {
    margin-right: 19px;
    white-space: nowrap;
    font-size: 14px;
  }

  .subcondition {
    text-align: left;
  }

  .search-type {
    width: 90px;
    height: 24px;
    line-height: 24px;
    border-radius: 2px;
    font-size: 14px;
    font-weight: 400;
    float: left;
    text-align: center;
    margin: 0 22px 0 0;
    cursor: pointer;
  }

  .en_width {
    min-width: 67px;
  }
}
</style>
