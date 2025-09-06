<template>
  <div class="resource mb20 ml20 mr20">
    <div class="resource-pie mr20">
      <resource-progress
        :value="resourceInfo.cpu_percent"
        :title="$t('systemOperation.cloudPlatform.virtualCpu')"
      />
      <resource-progress
        :value="resourceInfo.ram_percent"
        :title="$t('systemOperation.cloudPlatform.virtualRam')"
      />
      <resource-progress
        :value="resourceInfo.disk_percent"
        :title="$t('systemOperation.cloudPlatform.virtualDisk')"
      />
    </div>
    <div class="resource-list mt10">
      <cb-row>
        <cb-col :span="span" class="resource-list-item">
          <resource-item
            :value="resourceInfo.total_npc"
            :title="$t('systemOperation.cloudPlatform.npc')"
          />
        </cb-col>
        <cb-col :span="span" class="resource-list-item">
          <resource-item
            :value="resourceInfo.total_real_equipments"
            :title="$t('systemOperation.cloudPlatform.realEquipment')"
          />
        </cb-col>
        <cb-col :span="span" class="resource-list-item">
          <resource-item
            :value="resourceInfo.total_containers"
            :title="$t('systemOperation.cloudPlatform.container')"
          />
        </cb-col>
        <cb-col :span="span" class="resource-list-item">
          <resource-item
            :value="resourceInfo.total_instances"
            :title="$t('systemOperation.cloudPlatform.vm')"
          />
        </cb-col>
        <cb-col :span="span" class="resource-list-item">
          <resource-item
            :value="resourceInfo.total_dynamips"
            title="Dynamips"
          />
        </cb-col>
        <div class="cb-button">
          <cb-button
            type="primary"
            hollow
            :warnMsg="warnMessage"
            :completeMsg="completeMessage"
            @click="releaseResources($event)"
            >{{
              $t('systemOperation.cloudPlatform.releaseResources')
            }}</cb-button
          >
        </div>
      </cb-row>
    </div>
  </div>
</template>

<script>
import ResourceProgress from './resource-progress.vue';
import ResourceItem from './resource-item.vue';
import { getResource, releaseInvalidResources } from '@/api/system-op';
export default {
  components: {
    ResourceProgress,
    ResourceItem,
  },
  data() {
    return {
      resourceInfo: {},
      span: 4,
    };
  },
  computed: {
    warnMessage() {
      return this.$t('systemOperation.cloudPlatform.releaseResourcesTip');
    },
    completeMessage() {
      return this.$t('systemOperation.cloudPlatform.releaseSuccess');
    },
  },
  created() {
    this.getResourceInfo();
  },
  methods: {
    // 资源统计
    getResourceInfo() {
      getResource().then((res) => {
        this.resourceInfo = _.get(res, 'data.data', {});
      });
    },
    releaseResources(done) {
      releaseInvalidResources()
        .then((res) => {
          done();
        })
        .catch((err) => {
          done(false);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.resource {
  display: flex;
  &-pie {
    flex: 4;
    display: flex;
    justify-content: space-between;
    &-item {
      text-align: center;
    }
  }
  &-list {
    flex: 6;
    position: relative;
    .cb-button {
      position: absolute;
      right: 0;
      top: -25px;
    }
    &-item {
      float: right;
      &:nth-child(-n + 4)::before {
        content: '';
        height: 70px;
        top: 21px;
        position: absolute;
        border-left: 1px solid var(--neutral1);
      }
    }
  }
}
</style>
<style lang="scss">
.resource {
  &-pie,
  .content,
  .el-progress__text {
    color: var(--neutral8);
  }
}
</style>
