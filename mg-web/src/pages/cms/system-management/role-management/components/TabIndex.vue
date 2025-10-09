<template>
  <div>
    <div class="tab-content">
      <div
        :class="['tab-item', { active: currentTab === tab.key }]"
        v-for="(tab, index) in tabList"
        :key="tab.key"
      >
        <span>{{ index + 1 }}</span>
        <span>{{ tab.name }}</span>
        <span v-if="index !== 2"></span>
      </div>
    </div>
    <div>
      <keep-alive>
        <component :is="currentTabComponent" :id="id"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TabMessage from '../components/TabMessage';
import TabPermission from '../components/TabPermisson';
import TabConfirm from '../components/TabConfirm';
export default {
  name: 'Permission',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  components: {
    TabMessage,
    TabPermission,
    TabConfirm,
  },
  data() {
    return {
      tabList: [
        {
          name: this.$t('systemManagement.roleManage.basicMessage'),
          key: 'message',
        },
        {
          name: this.$t('systemManagement.roleManage.addPermissions'),
          key: 'permission',
        },
        {
          name: this.$t('systemManagement.roleManage.resultConfirm'),
          key: 'confirm',
        },
      ],
    };
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.$store.state.role.currentTab;
    },
    ...mapState({
      currentTab: (state) => state.role.currentTab,
    }),
  },
  mounted() {
    this.$store.commit({
      type: 'role/setCurrentTab',
      tabKey: 'message',
    });
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.tab-content {
  display: flex;
  justify-content: center;
  padding: 16px;
  background: var(--bg-color-2);
  .tab-item {
    color: var(--neutral8);
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      display: block;
      font-size: 14px;
    }
    span:first-child {
      height: 30px;
      width: 30px;
      font-size: 16px;
      border-radius: 15px;
      text-align: center;
      line-height: 28px;
      margin-right: 9px;
      overflow: hidden;
      position: relative;
      color: var(--neutral7);
      border: solid 1px var(--neutral3);
      font-weight: bold;
    }
    span:nth-child(3) {
      width: 300px;
      height: 1px;
      margin: 0 20px;
      border-top: 1px dashed var(--neutral1);
    }
    &.active {
      span:first-child {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: var(--white-color);
      }
    }
  }
}
</style>
