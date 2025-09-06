<template>
  <div class="left">
    <div>
      <Block :title="$t('mgRoutes.attackTrick')">
        <AttackType :data="attack_type" />
      </Block>
    </div>
    <div>
      <Block :title="$t('mgRoutes.attackTraffic')">
        <AttackFlow :data="attack_flow" />
      </Block>
    </div>
    <div>
      <Block :title="$t('mgRoutes.attackTrend')">
        <AttackTrend :data="attack_trend" />
      </Block>
    </div>
    <div>
      <Block :title="$t('mgRoutes.attackLog')">
        <AttackLog :data="attack_log" />
      </Block>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  ref,
  watch,
  onUnmounted,
} from '@vue/composition-api';
import Block from '../components/block.vue';
import AttackType from './components/attack-type.vue';
import AttackFlow from './components/attack-flow.vue';
import AttackTrend from './components/attack-trend.vue';
import AttackLog from './components/attack-log.vue';
import { dateFormat } from '@/utils';

import { queryAttackType, queryAttackTrend, queryAttackLog } from '../api';

export default defineComponent({
  name: 'Left',
  components: { Block, AttackType, AttackFlow, AttackTrend, AttackLog },
  props: {
    id: String,
  },
  setup(props) {
    const attack_type = ref([]);
    const attack_flow = ref([]);
    const attack_trend = ref([]);
    const attack_log = ref([]);

    //攻击手法top5
    const getAttackType = () => {
      queryAttackType({ sceneId: props.id, topSize: 5 }).then((res) => {
        attack_type.value = res.data.data.map((el) => ({
          name: el.attack_type,
          value: el.times,
        }));
      });
    };

    const getAttackTrend = () => {
      queryAttackTrend({ sceneId: props.id }).then((res) => {
        attack_flow.value = res.data.data.map((el) => ({
          name: dateFormat(new Date(el.time), 'HH:mm:ss'),
          value: el.data_size / 1024,
        }));
      });
      queryAttackTrend({ sceneId: props.id, type: 1 }).then((res) => {
        attack_trend.value = res.data.data.map((el) => ({
          name: dateFormat(new Date(el.time), 'HH:mm:ss'),
          value: el.data_size,
        }));
      });
    };

    const getAttackLog = () => {
      queryAttackLog({ id: props.id }).then((res) => {
        attack_log.value = res.data.data.list.map((el) => ({
          ...el,
          time: dateFormat(new Date(el.time), 'HH:mm:ss'),
          attack_type: el.attack_info.attack_type,
        }));
      });
    };

    watch(
      () => props.id,
      (v) => {
        if (v) {
          getAttackType();
          getAttackTrend();
          getAttackLog();
        }
      },
      {
        immediate: true,
      },
    );

    onMounted(() => {});
    //五秒请求一次接口
    const timer = setInterval(() => {
      if (props.id) {
        getAttackType();
        getAttackTrend();
        getAttackLog();
      }
    }, 1000 * 5);

    onUnmounted(() => {
      clearInterval(timer);
    });

    return {
      attack_type,
      attack_flow,
      attack_trend,
      attack_log,
    };
  },
});
</script>
<style lang="scss" scoped></style>
