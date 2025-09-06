<template>
  <div class="skill_div">
    <Header :level="1" title="训练技能" />
    <div class="skill flex-fill-col">
      <Barrage ref="BarrageRef" :data="data"></Barrage>
    </div>
  </div>
</template>

<script>
import Header from '../../components/header';
import TrainingDynamicHeader from './training-dynamic-header.vue';
import Barrage from '../../components/barrage.vue';
import { traniningSkill } from '@/api/screen-center-group';
import { onMounted, ref } from '@vue/composition-api';
export default {
  name: 'AttackScore',
  components: {
    Header,
    TrainingDynamicHeader,
    Barrage,
  },
  props: {},
  computed: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {},
  setup() {
    const BarrageRef = ref(null);

    const data = ref([]);
    onMounted(() => {
      traniningSkill(
        '/training_team/v/skill_statistics/',
        'b21a7d72756fa5b828edd4433194ff33',
      ).then((res) => {
        data.value = _.cloneDeep(res.data.skills);
        BarrageRef.value.setData(data.value);
      });
    });

    return {
      BarrageRef,
      data,
    };
  },
};
</script>

<style scoped lang="scss">
.skill_div {
  flex: 1.5;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .skill {
    height: calc(100% - var(--header-2-content-space) - 40px);
  }
}
</style>
