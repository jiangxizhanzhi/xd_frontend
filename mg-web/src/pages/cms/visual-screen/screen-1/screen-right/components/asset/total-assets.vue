<template>
  <div class="flex-column">
    <Header :level="3" title="资产统计" />
    <div class="asset">
      <total-assets-item :assetItem="assetItem"></total-assets-item>
      <total-assets-info :assetInfo="assetInfo"></total-assets-info>
    </div>
  </div>
</template>
<script>
import TotalAssetsItem from './total-assets-item.vue';
import TotalAssetsInfo from './total-assets-info.vue';
import Header from '../../../components/header';
import { trainingAsset } from '@/api/screen-center';
import { onMounted, ref, reactive } from '@vue/composition-api';
export default {
  components: {
    TotalAssetsItem,
    TotalAssetsInfo,
    Header,
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  setup() {
    const assetItem = ref([
      {
        name: '资产总数',
        num: 76,
      },
    ]);
    const assetInfo = ref([
      {
        name: '终端',
        key: 'server',
        num: 78,
      },
      {
        name: '防火墙',
        key: 'firewall',
        num: 79,
      },
      {
        name: '路由器',
        key: 'router',
        num: 78,
      },
      {
        name: '网络设备',
        key: 'network',
        num: 79,
      },
    ]);

    let url = ref('/red_vs_blue/s/asset_statistics/');
    let resourceId = '90d8f51db9b8563a435f18c5ccd0b6fe';
    if (window.location.href.indexOf('visual-screen2') != -1) {
      // 综合演训
      url = ref('/training_team/v/asset_statistics/');
      resourceId = 'b21a7d72756fa5b828edd4433194ff33';
    }
    onMounted(() => {
      trainingAsset(url.value, resourceId).then((res) => {
        assetItem.value[0].num = res.data.sum;
        const dataBackup = _.cloneDeep(res.data);
        assetInfo.value.forEach((item) => {
          for (let kex in dataBackup) {
            if (item.key == kex) {
              item.num = dataBackup[kex];
              break;
            }
          }
        });
      });
    });

    return {
      assetItem,
      assetInfo,
    };
  },
};
</script>
<style lang="scss" scoped>
.asset {
  margin-top: var(--header-3-content-space);
  flex: 1;
  height: 0;
  display: flex;
  flex-direction: column;
}
</style>
