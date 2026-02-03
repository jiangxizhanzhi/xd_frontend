<!--
* 角色卡片
-->
<template>
  <div class="role-card" :class="{ 'en-layout': lang === 'en-US' }">
    <div class="card-name ft14 txt-white" v-if="config.type != 'white'">
      <span :title="config.name">{{ config.name }}</span>
      <div v-if="showBtn" class="card-btn">
        <cb-tooltip effect="dark" :content="$tt('menu.drawer.arrangement')">
          <cb-button
            icon="icon-wangluoyushezhi"
            type="text"
            class="btn"
            @click="assetAllocation"
          ></cb-button>
        </cb-tooltip>
        <cb-tooltip effect="dark" :content="$tt('menu.drawer.delete')">
          <cb-button
            v-if="showDelete"
            icon="icon-shanchu"
            type="text"
            class="btn"
            @click="deleteRole"
          ></cb-button>
        </cb-tooltip>
      </div>
    </div>
    <div class="card-content">
      <!--文字-->
      <template v-if="config.type === 'white'">
        <div class="content-block-text ft14 txt-white">
          <span>{{ $tt('menu.drawer.whiteTeamIntro') }} </span>
        </div>
      </template>
      <!--设备-->
      <template v-else>
        <!--网络设备-->
        <div class="content-block">
          <cb-iconfont type="icon-wangluoshebei" size="20"></cb-iconfont>
          <div class="block-txt">
            <div class="ft20 txt-white">{{ netDevice }}</div>
            <div class="ft12">{{ $tt('menu.menu.networkEquipment') }}</div>
          </div>
        </div>
        <!--终端设备-->
        <div class="content-block">
          <cb-iconfont type="icon-zhongduanshebei" size="20"></cb-iconfont>
          <div class="block-txt">
            <div class="ft20 txt-white">{{ serverDevice }}</div>
            <div class="ft12">{{ $tt('menu.menu.operateSystem') }}</div>
          </div>
        </div>
        <!--安防设备-->
        <div class="content-block">
          <cb-iconfont type="icon-anfangshebei" size="20"></cb-iconfont>
          <div class="block-txt">
            <div class="ft20 txt-white">{{ protectDevice }}</div>
            <div class="ft12">{{ $tt('menu.menu.securityEquipment') }}</div>
          </div>
        </div>
        <!--实体设备-->
        <div class="content-block">
          <cb-iconfont type="icon-shitishebei" size="20"></cb-iconfont>
          <div class="block-txt">
            <div class="ft20 txt-white">{{ entityDevice }}</div>
            <div class="ft12">{{ $tt('menu.menu.applicationSystem') }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import t from '../../../../utils/i18n';
import { inject } from '@vue/composition-api';

export default {
  name: 'RoleCard',
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    paramName: {
      type: 'asset_nodes' | 'visible_nodes',
      default: 'asset_nodes',
    },
    /**
     * 展示按钮组
     */
    showBtn: {
      type: Boolean,
      default: true,
    },
    /**
     * 展示删除按钮
     */
    showDelete: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    // 网络设备
    netDevice() {
      let num = 0;
      this.config[this.paramName]?.forEach((item) => {
        if (item.category === 3 || item.category === '3') {
          num++;
        }
      });
      return num;
    },
    // 操作系统
    serverDevice() {
      let num = 0;
      this.config[this.paramName]?.forEach((item) => {
        if (item.category === 1 || item.category === '1') {
          num++;
        }
      });
      return num;
    },
    // 安全设备
    protectDevice() {
      let num = 0;
      this.config[this.paramName]?.forEach((item) => {
        if (item.category === 4 || item.category === '4') {
          num++;
        }
      });
      return num;
    },
    // 应用系统
    entityDevice() {
      let num = 0;
      this.config[this.paramName]?.forEach((item) => {
        if (item.category === 2 || item.category === '2') {
          num++;
        }
      });
      return num;
    },
  },
  setup() {
    const lang = inject('lang');
    return {
      lang,
    };
  },
  methods: {
    $tt: t,
    /**
     * 资产配置按钮事件
     */
    assetAllocation() {
      document
        .querySelectorAll('.el-tooltip__popper.is-dark')
        ?.forEach((item) => item.remove());
      this.$emit('assetAllocation', this.config);
    },

    /**
     * 删除角色按钮事件
     */
    deleteRole() {
      document
        .querySelectorAll('.el-tooltip__popper.is-dark')
        ?.forEach((item) => item.remove());
      this.$emit('deleteRole', this.config.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.role-card {
  padding: 16px 16px 0 16px;
  // 通用文字颜色
  .txt-white {
    color: var(--neutral8);
  }

  // 标题
  .card-name {
    height: 30px;
    background: var(--bg-color-2);
    border-bottom: 1px solid var(--neutral0);

    display: flex;
    align-items: center;
    span {
      margin: 5px 20px;
      line-height: 30px;
      width: 100%;
      word-wrap: break-word;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1; /*超出2行显示省略号*/
      overflow: hidden;
    }

    .card-btn {
      width: fit-content;
      float: right;
      height: 30px;
      display: flex;

      .btn {
        margin: 0 5px;
      }
    }
  }

  // 内容
  .card-content {
    display: flex;
    background: var(--bg-color-2);
    flex-wrap: wrap;

    // 内容块
    .content-block {
      width: 25%;
      padding: 15px 5px;

      // 图标
      svg {
        vertical-align: -0.9em;
      }

      // 文字块
      .block-txt {
        width: fit-content;
        float: right;
      }
      .cb-iconfont {
        color: var(--neutral8) !important;
      }
    }

    .content-block-text {
      padding: 26px 12px;
      color: var(--neutral8);
      background: var(--bg-color-2);
      //border: 1px solid var(--neutral3);
    }
  }

  &.en-layout {
    .content-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }
}

.collapse {
  .content-block {
    width: 50% !important;
  }
}
</style>
