<template>
  <div class="option-panel mt10" v-if="showOptionPanel">
    <div class="opt-bar mb10 ml10" v-for="opt of optionComputed">
      <div class="value">{{ opt[0] }}.</div>
      <mavon-read
        class="exercise-set-mavon-title label"
        :mavon-data.sync="opt[1]"
      ></mavon-read>
    </div>
  </div>
  <div class="option-panel-empty" v-else>&nbsp;</div>
</template>

<script>
import _ from 'lodash';
import MavonRead from '@/components/markdown/mavon-read.vue';
export default {
  components: {
    MavonRead,
  },
  props: {
    option: {
      type: String,
      default: '',
    },
  },
  computed: {
    showOptionPanel() {
      const { option } = this;
      return option && typeof option === 'string' && option.trim().length > 3; // option's value might be "{}",
    },
    optionComputed() {
      const { option } = this;
      const obj = JSON.parse(option);
      // 将数据格式化为字符串，防止为 Number 类型，导致出错
      Object.keys(obj).forEach((item) => {
        obj[item] = `${obj[item]}`;
      });
      return _.toPairs(obj);
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.option-panel-empty {
  height: 50px;
}
.option-panel {
  & > .opt-bar {
    display: flex;
    & > .value {
      width: 25px;
      line-height: 25px;
    }
  }
}
</style>
<style lang="scss" scoped>
.exercise-set-mavon-title {
  word-break: break-word;
}
</style>
