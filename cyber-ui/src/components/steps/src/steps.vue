<template>
  <div class="cb-steps">
    <div v-if="type === 'JSON'" class="cb-steps-json">
      <div
        v-for="(item, index) of data"
        :key="index"
        class="cb-steps-json-item"
      >
        <div class="cb-steps-json-content">
          <!--
          @slot 步骤条icon插槽
          @binding item 步骤条子项
          @binding index 步骤条序号
        -->
          <slot name="icon" :item="item" :index="index">
            <div
              class="cb-steps-icon"
              :class="[
                { 'step-active-icon': active == index + 1 },
                { 'step-actived-icon': active > index },
              ]"
            >
              {{ index + 1 }}
            </div>
          </slot>
          <!--
         @slot 步骤条title插槽
         @binding item 步骤条子项
         @binding index 步骤条序号
       -->
          <slot name="title" :item="item" :index="index">
            <div
              class="cb-steps-title"
              :class="[
                { 'step-active': active == index + 1 },
                { 'step-actived': active >= index + 1 },
              ]"
            >
              {{ item.title }}
            </div>
          </slot>
        </div>
        <div
          class="cb-steps-json-line"
          v-if="index !== data.length - 1"
          :class="{ 'step-line-active': index <= active - 2 }"
        ></div>
      </div>
    </div>
    <div v-else class="cb-steps-default">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**
 * @displayName cb-steps 步骤条
 * @classify Navigation/导航
 */
export default {
  name: 'CbSteps',
  props: {
    /**
     * 步骤条类型
     * @values json,default
     */
    type: {
      type: String,
      default: 'JSON',
    },
    /**
     * 激活
     */
    active: {
      type: String | Number,
      default: 1,
    },
    /**
     * json类型步骤条数据
     */
    data: {
      type: Array,
      default: () => [{}],
    },
  },
  provide() {
    return {
      active: this.active,
    };
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {
    this.updateSteps();
  },
  watch: {},
  methods: {
    updateSteps() {
      this.updateChildProps(true);
    },
    updateChildProps(isInit) {
      this.$children.forEach((child, index) => {
        child.stepNumber = index + 1;
      });
    },
  },
  components: {},
};
</script>
