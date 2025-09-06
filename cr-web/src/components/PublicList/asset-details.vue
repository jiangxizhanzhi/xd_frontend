<template>
  <div class="asset-details">
    <div class="role-assets">
      <block :title="$t('list.roleAssets')"></block>
      <div class="assets-category">
        <div class="assets-item">
          <div class="outside-img-wrap">
            <div class="inside-img-wrap network">
              <cb-iconfont
                :size="16"
                type="icon-wangluoshebei"
                class="assets-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="assets-name">{{ $t('admin.netDevice') }}</div>
          <div class="assets-num">{{ assetData.assetMap.NETWORK }}</div>
        </div>
        <div class="assets-item">
          <div class="outside-img-wrap">
            <div class="inside-img-wrap operate">
              <cb-iconfont
                :size="16"
                type="icon-zhongduanshebei1"
                class="assets-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="assets-name">{{ $t('admin.OS') }}</div>
          <div class="assets-num">{{ assetData.assetMap.OPERATING }}</div>
        </div>
        <div class="assets-item">
          <div class="outside-img-wrap">
            <div class="inside-img-wrap security">
              <cb-iconfont
                :size="16"
                type="icon-anfangshebei"
                class="assets-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="assets-name">{{ $t('admin.secDevice') }}</div>
          <div class="assets-num">{{ assetData.assetMap.SECURITY }}</div>
        </div>
        <div class="assets-item">
          <div class="outside-img-wrap">
            <div class="inside-img-wrap apply">
              <cb-iconfont
                :size="16"
                type="icon-shitishebei"
                class="assets-icon"
              ></cb-iconfont>
            </div>
          </div>
          <div class="assets-name">{{ $t('admin.appSystem') }}</div>
          <div class="assets-num">{{ assetData.assetMap.APPLICATION }}</div>
        </div>
      </div>
    </div>
    <div class="task-plan">
      <block :title="$t('list.taskPlan')"></block>
      <div class="task-list">
        <div
          class="task-item"
          :key="index"
          v-for="(item, index) in assetData.missions_scheme.scheme_data"
        >
          <div class="title" :title="item.stage">{{ item.stage }}</div>
          <div></div>
          <div
            class="task"
            :key="item2.resource_id"
            v-for="item2 in item.missions"
          >
            <cb-iconfont
              :size="16"
              type="icon-shiyanbaogaoceshi"
              class="missions-icon"
            ></cb-iconfont>
            <span :title="item2.title">{{ item2.title }}</span>
          </div>
        </div>
        <!-- 暂无数据 -->
        <div
          v-if="!assetData.missions_scheme.scheme_data.length"
          class="empty-comp"
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        >
          <empty-page ref="emptyComp" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import block from '@/components/block';
import emptyPage from '@/pages/web/Empty';
export default {
  components: {
    block,
    emptyPage,
  },
  props: {
    assetData: {
      type: [Array, Object],
      default: [],
    },
  },
  data() {
    return {
      netDevice: 0,
      operateSystem: 0,
      secDevice: 0,
      appSystem: 0,
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.asset-details {
  margin-top: 10px;
  .role-assets {
    ::v-deep .cb-block {
      .cb-block-title-container {
        margin-bottom: 16px;
      }
    }

    .assets-category {
      display: flex;
      justify-content: space-between;
      .assets-item {
        border-radius: 2px;
        flex: 1;
        margin-right: 16px;
        background: var(--bg-color-3);
        height: 64px;
        display: flex;
        align-items: center;
        &:nth-child(4) {
          margin-right: 0;
        }
        .outside-img-wrap {
          width: 40px;
          height: 40px;
          background: var(--neutral0);
          margin-left: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          .inside-img-wrap {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            .assets-icon {
              color: var(--white-color);
            }
          }
          .network {
            background: var(--primary-color);
          }
          .operate {
            background: var(--blue-color);
          }
          .security {
            background: var(--green-color);
          }
          .apply {
            background: var(--orange-color);
          }
        }
        .assets-name {
          margin-left: 8px;
          font-size: 14px;
          color: var(--neutral7);
        }
        .assets-num {
          margin-left: 8px;
          color: var(--neutral8);
          font-size: 20px;
        }
      }
    }
  }
  .task-plan {
    margin-top: 24px;
    ::v-deep .cb-block {
      .cb-block-title-container {
        margin-bottom: 16px;
      }
    }

    .task-list {
      margin-left: 20px;
      min-height: 318px;
      position: relative;
      .task-item {
        border-radius: 2px;
        padding: 16px;
        margin-bottom: 16px;
        background: var(--bg-color-3);
        position: relative;
        .title {
          height: 24px;
          line-height: 24px;
          font-size: 16px;
          color: var(--neutral8);
          // margin-bottom: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .task {
          height: 22px;
          line-height: 23px;
          font-size: 14px;
          color: var(--neutral7);
          // margin-bottom: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 12px;
          .missions-icon {
            color: var(--neutral5);
          }
        }

        &::before {
          content: '';
          position: absolute;
          left: -14px;
          top: 34px;
          display: inline-block;
          width: 1px;
          height: 100%;
          border-left: 1px dashed var(--neutral5);
        }
        &:last-child::before {
          content: '';
          border: none;
        }
        &::after {
          content: '';
          position: absolute;
          left: -20px;
          top: 20px;
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 1px solid var(--neutral5);
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
