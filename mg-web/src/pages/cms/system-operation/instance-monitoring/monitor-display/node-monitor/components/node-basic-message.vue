<template>
  <div class="node-basic-message">
    <ul>
      <li>
        <div class="basic-li">
          <div class="li-title one-overflow" :title="currentNode.name">
            {{ currentNode.name }}
          </div>
          <div class="li-desc">
            {{ $t('systemOperation.nodeMonitoring.serverName') }}
          </div>
        </div>
      </li>
      <li>
        <div class="basic-li">
          <div
            class="li-title one-overflow"
            :title="currentNode.system_type_name"
          >
            {{ currentNode.system_type_name }}
          </div>
          <div class="li-desc">
            {{ $t('systemOperation.eventAnalysis.operatSystem') }}
          </div>
        </div>
      </li>
      <li>
        <div class="basic-li">
          <div class="li-title one-overflow">
            <span v-if="ips[0]" :title="ips[0]">{{ ips[0] }}</span>
            <br v-if="ips[1]" />
            <span v-if="ips[1]" :title="ips[1]">{{ ips[1] }}</span>
          </div>
          <div class="li-desc">
            {{ $t('systemOperation.nodeMonitoring.ipAddress') }}
          </div>
        </div>
      </li>
      <li>
        <div class="basic-li">
          <div class="li-title one-overflow" :title="currentNode.host">
            {{ currentNode.host }}
          </div>
          <div class="li-desc">
            {{ $t('systemOperation.nodeMonitoring.physicalNode') }}
          </div>
        </div>
      </li>
      <li>
        <div class="basic-li">
          <div
            class="li-title one-overflow"
            :title="getvirtualType(currentNode.virtual_type)"
          >
            {{ getvirtualType(currentNode.virtual_type) }}
          </div>
          <div class="li-desc">
            {{ $t('systemOperation.nodeMonitoring.instanceType') }}
          </div>
        </div>
      </li>
      <li>
        <div class="basic-li">
          <div class="li-title one-overflow" :title="currentNode.image_name">
            {{ currentNode.image_name }}
          </div>
          <div class="li-desc">
            {{ $t('systemOperation.nodeMonitoring.imageName') }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { VIRTUAL_TYPE } from '@/pages/cms/system-operation/constant.js';
export default {
  name: 'BasicMessage',
  props: {
    currentNode: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    ips() {
      if (this.currentNode.ports) {
        const divArr = _.chunk(this.currentNode.ports, 2);
        const ipArr = _.map(divArr[0], (item) => {
          return item.ip;
        });
        return ipArr;
      }
      return [];
    },
  },
  methods: {
    getvirtualType(val) {
      if (val) {
        const types = _.filter(VIRTUAL_TYPE, (item) => {
          return item.value === val;
        });
        return types && types[0].label;
      }
    },
  },
};
</script>
<style scoped lang="scss" scoped>
.node-basic-message {
  display: flex;
  width: 100%;
  height: 100%;
  margin-top: 10px;
  padding: 0 16px;

  ul {
    width: 100%;
    height: calc(100% - 36px);
    display: flex;
    flex-wrap: wrap;
    padding: 0;

    justify-content: space-between;
    li {
      width: 33%;
      height: 37%;

      list-style: none;
      .basic-li {
        width: 60%;
        height: 100%;
        margin: auto;
        background: url('../../assets/img/node-basic.png') no-repeat;
        background-size: 100% 100%;
        // padding-top: 7%;
        position: relative;
      }
      .li-title {
        width: 143%;
        font-size: 18px;
        color: #fff;
        text-align: center;
        font-weight: bold;
        text-shadow: 0 0 8px rgb(231 239 255 / 20%),
          0 0 8px rgb(231 239 255 / 20%), 0 0 8px rgb(231 239 255 / 20%),
          0 0 8px rgb(231 239 255 / 20%);
        background: linear-gradient(
          0deg,
          #bde1ff 0%,
          #ffffff 50%,
          #e7efff 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        position: absolute;
        bottom: 43%;
        left: 50%;
        transform: translateX(-50%);
      }
      .li-desc {
        font-size: 12px;
        color: #fff;
        text-align: center;
        position: absolute;
        bottom: 18%;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
      }
    }
  }
}
</style>
