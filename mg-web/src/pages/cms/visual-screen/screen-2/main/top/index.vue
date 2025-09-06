<template>
  <div class="main-content-top">
    <div class="statistics" :class="{ hidden: hidden }">
      <Block title="科目得分分布">
        <Statictic :data="statictic" />
      </Block>
    </div>
    <div class="top-center"></div>
    <div class="top-right">
      <div class="attack-type" :class="{ hidden: hidden }">
        <Block title="攻击手法Top10">
          <AttackType :model="attack_type" />
        </Block>
      </div>
      <div class="attack-count" :class="{ hidden: hidden }">
        <Block title="攻击次数统计">
          <AttackCount :model="attack_count" />
        </Block>
      </div>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  ref,
  onMounted,
  watch,
  onUnmounted,
} from '@vue/composition-api';
import Statictic from './statictic.vue';
import Block from '../../components/block.vue';
import AttackType from './attack-type.vue';
import AttackCount from './attack-count.vue';
import {
  queryAttackKind,
  queryAttackCount,
  queryMissionComplete,
} from '../../api';
export default defineComponent({
  name: '',
  components: { Block, Statictic, AttackType, AttackCount },
  props: {
    id: String,
    hidden: Boolean,
  },
  setup(props) {
    const statictic = ref([]);
    const attack_type = ref([]);
    const attack_count = ref([]);
    let tick;

    const getMissionComplete = () => {
      queryMissionComplete().then((res) => {
        statictic.value = res.data.data.map((el) => ({
          name: el.user_name,
          data: el.subject_score,
        }));
      });
    };

    const getAttackCount = () => {
      queryAttackCount().then((res) => {
        attack_count.value = res.data.data?.map((el) => ({
          name: el.user_name,
          value: el.count,
        }));
      });
    };

    const getAttackKind = (id) => {
      queryAttackKind({
        sceneId: id,
      }).then((res) => {
        attack_type.value = res.data.data?.map((el) => ({
          name: el.attack_type,
          count: el.times,
        }));
      });
    };

    watch(
      () => props.id,
      (v) => {
        getMissionComplete();
        getAttackCount();
        getAttackKind(v);
      },
      {
        immediate: true,
      },
    );

    onMounted(() => {
      tick = setInterval(() => {
        getMissionComplete();
        getAttackCount();
        getAttackKind(props.id);
      }, 10 * 1000);
    });

    onUnmounted(() => {
      if (tick) {
        clearInterval(tick);
      }
    });

    return {
      statictic,
      attack_type,
      attack_count,
    };
  },
});
</script>
<style lang="scss" scoped></style>
