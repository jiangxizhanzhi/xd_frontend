<template>
  <div class="tabs-wrapper" :class="{ 'over-three': tabs.length > 3 }">
    <span
      v-for="(item, index) in tabs"
      :key="JSON.stringify(item.name + index)"
      @click="tabClick(index)"
      :class="['item ft14', { active: current == index }]"
      :title="item.name"
      >{{ item.name }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      current: 0,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    tabClick(index) {
      this.current = index;
      this.$emit('tabClick', index);
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.item {
  color: #fefeff;
  &.active {
    background-color: var(--primary-color);
    color: #242c3b;
  }
}

.tabs-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 70%;
  max-width: 90%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  height: 100%;
  &.over-three {
    width: 90%;
  }
  .item {
    flex: 1;
    text-align: center;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 40px;
  }
}
</style>
