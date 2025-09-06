<template>
  <div class="right">
    <div>
      <Block :title="$t('mgRoutes.assetsStatistics')">
        <AssetsStatistics :data="assets" />
      </Block>
    </div>
    <div>
      <Block :title="$t('mgRoutes.hostState')">
        <HostStatus :data="host_status" />
      </Block>
    </div>
    <div>
      <Block :title="$t('mgRoutes.attackedHost')">
        <AttackDevice :data="attack_device" />
      </Block>
    </div>
    <div style="height: 269px">
      <Block :title="$t('mgRoutes.attackedPort')">
        <AttackPort :data="attack_port" />
      </Block>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  ref,
  inject,
  watch,
  onUnmounted,
} from '@vue/composition-api';
import Block from '../components/block.vue';
import AssetsStatistics from './components/assets-statistics.vue';
import AttackDevice from '../left/components/attack-type.vue';
import AttackPort from './components/attack_port.vue';
import HostStatus from './components/host-status.vue';

import {
  queryAttackHost,
  queryAttackPort,
  queryHostStatus,
  queryAssets,
} from '../api';
import { HOST_VALUE } from './components/constant.js';

export default defineComponent({
  name: 'Right',
  components: { Block, AssetsStatistics, AttackDevice, AttackPort, HostStatus },
  props: {
    id: String,
  },
  setup(props) {
    const attack_device = ref([]);
    const attack_port = ref([]);
    const host_status = ref([]);
    const assets = ref({});

    // 受攻击主机
    const getAttackHost = () => {
      queryAttackHost({ sceneId: props.id, ipType: 1 }).then((res) => {
        attack_device.value = res.data.data.map((el) => ({
          name: el.node_name,
          value: el.times,
        }));
      });
    };

    const getAttackPort = () => {
      queryAttackPort({ sceneId: props.id }).then((res) => {
        // 受攻击端口接口返回数据
        attack_port.value = res.data.data;
        attack_port.value = attack_port.value.map((item) => {
          return {
            ...item,
            traffic_size: parseInt(item.traffic_size / 1024),
          };
        });
      });
    };
    //0: 正常，1:高，2中， 3、4:低
    const getHostStatus = () => {
      queryHostStatus({ sceneId: props.id }).then((res) => {
        host_status.value = HOST_VALUE;
        res.data.data.forEach((el) => {
          switch (el.severity) {
            case 0:
              host_status.value[0].value = el.num;
              break;
            case 1:
              host_status.value[1].value = el.num;
              break;
            case 2:
              host_status.value[2].value = el.num;
              break;
            case 3:
              host_status.value[3].value = el.num;
              break;
            case 4:
              host_status.value[3].value = el.num;
              break;
          }
        });
      });
    };

    const getAssets = () => {
      queryAssets({ sceneIds: [props.id] }).then((res) => {
        assets.value = res.data.data[0];
      });
    };

    watch(
      () => props.id,
      (v) => {
        if (v) {
          getAttackPort();
          getAttackHost();
          getHostStatus();
          getAssets();
        }
      },
    );

    onMounted(() => {});

    //五秒请求一次接口
    const timer = setInterval(() => {
      if (props.id) {
        getAttackPort();
        getAttackHost();
        getHostStatus();
        getAssets();
      }
    }, 1000 * 5);

    onUnmounted(() => {
      clearInterval(timer);
    });

    return {
      attack_device,
      attack_port,
      host_status,
      assets,
    };
  },
});
</script>
<style lang="scss" scoped></style>
