<template>
  <div class="main-content-bottom">
    <div class="attack-flow">
      <Block title="攻击流量">
        <AttackFlow :data="attack_flow" />
      </Block>
    </div>
    <div class="attack-log">
      <Block title="攻击日志">
        <ScrollTable :cols="log_cols" :data="attack_log" :option="log_option" />
      </Block>
    </div>
    <div class="attack-device">
      <Block title="受攻击设备统计">
        <ScrollTable
          :cols="device_col"
          :data="attack_device"
          :option="device_option"
        />
      </Block>
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
  computed,
} from '@vue/composition-api';
import Block from '../../components/block.vue';
import ScrollTable from '../../components/scroll-table.vue';
import AttackFlow from './attack-flow.vue';

import { queryAttackLog, queryAttackFlow, queryAttackDevice } from '../../api';
export default defineComponent({
  name: 'Center',
  components: { Block, ScrollTable, AttackFlow },
  props: {
    id: String,
  },
  setup(props) {
    const attack_log = ref([]);
    const attack_flow = ref([]);
    const attack_device = ref([]);
    const log_cols = [
      { label: '时间', prop: 'time', width: '20%' },
      { label: '战队名称', prop: 'name', width: '20%' },
      { label: '源IP', prop: 'source_ip', width: '20%' },
      { label: '目标设备', prop: 'target_eq', width: '20%' },
      { label: '目标IP', prop: 'target_ip', width: '20%' },
    ];

    const device_col = [
      { label: '设备名称', prop: 'node_name', width: '35%' },
      { label: '攻击次数', prop: 'times', align: 'left', width: '30%' },
      { label: 'IP', prop: 'ip', width: '35%', align: 'center' },
    ];

    const log_option = computed(() => {
      return {
        direction: 'vertical',
        loop: attack_log.value.length > 4,
        autoplay: true,
        slidesPerView: 4,
      };
    });

    const device_option = computed(() => {
      return {
        direction: 'vertical',
        loop: attack_device.value.length > 4,
        autoplay: true,
        slidesPerView: 4,
      };
    });

    let tick;

    const unit = (num) => {
      return (num / 1024).toFixed(2);
    };

    const getAttackLog = () => {
      queryAttackLog().then((res) => {
        attack_log.value = res.data.data.map((el) => ({
          time: el.attack_time,
          name: el.user_name,
          source_ip: el.source_ip,
          target_eq: el.target_node_name,
          target_ip: el.target_ip,
        }));
      });
    };

    const getAttackFlow = (id) => {
      if (!id) return;
      queryAttackFlow({
        sceneId: id,
      }).then((res) => {
        attack_flow.value = res.data.data.map((el) => ({
          name: el.time,
          value: unit(el.data_size),
        }));
      });
    };

    const getAttackDevice = (id) => {
      queryAttackDevice({
        sceneId: id,
      }).then((res) => {
        attack_device.value = res.data.data;
      });
    };

    watch(
      () => props.id,
      (v) => {
        getAttackLog();
        getAttackFlow(v);
        getAttackDevice(v);
      },
      { immediate: true },
    );

    onMounted(() => {
      tick = setInterval(() => {
        getAttackLog();
      }, 1000);
      setInterval(() => {
        getAttackFlow(props.id);
        getAttackDevice(props.id);
      }, 15 * 1000);
    });

    onUnmounted(() => {
      if (tick) {
        clearInterval(tick);
      }
    });

    return {
      log_cols,
      device_col,
      attack_flow,
      attack_log,
      attack_device,
      log_option,
      device_option,
    };
  },
});
</script>
<style lang="scss" scoped></style>
