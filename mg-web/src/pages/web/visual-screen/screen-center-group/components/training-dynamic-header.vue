<template>
  <div class="state-bg" :class="className">{{ typeArr[type - 1] }}</div>
</template>

<script>
import Header from '../../components/header';
import { ref, reactive, computed } from '@vue/composition-api';

export default {
  name: 'AttackScore',
  components: {
    Header,
  },
  props: {
    /**
     *  1：下发
    2：待审核（上报）
    3：成功
    4：失败
    5：驳回
     */
    type: {
      type: Number,
      default: 1,
    },
  },
  computed: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {},
  setup(props) {
    const typeArr = reactive(['下发', '提交', '成功', '失败', '驳回']);
    const className = computed(() => `state-bg-${props.type}`);
    return {
      typeArr,
      className,
    };
  },
};
</script>

<style scoped lang="scss">
.state-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 20px;
  font-weight: bold;
  font-size: 12px;
  border-radius: 10px 0px 0px 10px;
}
.state-bg-1 {
  background: linear-gradient(90deg, #2769c9 0%, rgba(39, 105, 201, 0) 100%);
}
.state-bg-2 {
  background: linear-gradient(90deg, #6f64fb 0%, rgba(111, 100, 251, 0) 100%);
}
.state-bg-3 {
  background: linear-gradient(90deg, #62d0c1 0%, rgba(98, 208, 193, 0) 100%);
}
.state-bg-5 {
  background: linear-gradient(90deg, #f5a45b 0%, rgba(245, 164, 91, 0) 100%);
}
.state-bg-4 {
  background: linear-gradient(90deg, #f15e5f 0%, rgba(241, 94, 95, 0) 100%);
}
</style>
