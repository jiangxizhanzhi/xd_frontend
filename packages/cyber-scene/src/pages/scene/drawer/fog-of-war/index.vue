<!--
* 战争迷雾
-->
<template>
  <div
    class="drawer-wrapper role-wrapper"
    :class="{
      collapse: team !== '' || teamItemId !== '',
      'en-layout': lang === 'en-US',
      'hide-title': !showTitle
    }"
  >
    <div class="title-box" v-if="teamAndId">
      <span class="title ft14">{{ $tt('menu.menu.warFlog') }}</span>
    </div>

    <div class="content">
      <transition-group name="team-group">
        <div v-for="(item, index) in roleAssets" :key="item.id + index">
          <!--红队-->
          <template v-if="item.type === 'red' && (!roleShowConfig.length || roleShowConfig.includes(item.type))">
            <div
              class="red-team"
              :key="'red' + item.id + index"
              v-if="team === '' || team === 'red'"
            >
              <div class="content-title">
                <span class="ft14">{{ $tt('menu.drawer.redTeam') }}</span>
                <div class="content-btn" v-if="!teamAndId">
                  <cb-button
                    class="close-btn"
                    button-type="cancel"
                    @click="handleClose"
                    >{{ $tt('menu.drawer.expand') }}
                  </cb-button>
                </div>
              </div>
              <div class="content-card">
                <div v-for="(child, index) in item.children" :key="child.id">
                  <template v-if="teamItemId === '' || teamItemId === index">
                    <role-card
                      :config="child"
                      :showBtn="teamAndId"
                      :param-name="'visible_nodes'"
                      :show-delete="false"
                      @assetAllocation="(e) => assetAllocation(e, 'red', index)"
                    ></role-card>
                  </template>
                </div>
              </div>
            </div>
          </template>
          <!--蓝队-->
          <template v-if="item.type === 'blue' && (!roleShowConfig.length || roleShowConfig.includes(item.type))">
            <div
              class="blue-team"
              :key="'blue' + item.id + index"
              v-if="team === '' || team === 'blue'"
            >
              <div class="content-title">
                <span class="ft14">{{ $tt('menu.drawer.blueTeam') }}</span>
                <div class="content-btn" v-if="!teamAndId">
                  <cb-button
                    class="close-btn"
                    button-type="cancel"
                    @click="handleClose"
                    >{{ $tt('menu.drawer.expand') }}
                  </cb-button>
                </div>
              </div>
              <div class="content-card">
                <div v-for="(child, index) in item.children" :key="child.id">
                  <template v-if="teamItemId === '' || teamItemId === index">
                    <role-card
                      :config="child"
                      :showBtn="teamAndId"
                      :param-name="'visible_nodes'"
                      :show-delete="false"
                      @assetAllocation="
                        (e) => assetAllocation(e, 'blue', index)
                      "
                    ></role-card>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import RoleCard from '../components/role-card';
import {computed, inject, ref} from '@vue/composition-api';
import t from '../../../../utils/i18n';
import sceneStore from '../../../../store/scene-store';
import {generateUUID} from "../../../../utils/common";
import _ from "lodash";

export default {
  name: 'DrawerWar',
  components: {
    RoleCard,
  },
  props: {
    // 展示红队还是蓝队
    roleShowConfig: {
      type: Array,
      default: () => {
        return [];
      },
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const lang = inject('lang');
    const roleAssets = computed({
      get: () => {
        return sceneStore.state.assets;
      },
    });
    const emptyAssets = [
      {
        asset_nodes: [],
        children: [],
        id: generateUUID(),
        key: '',
        name: '红队',
        type: 'red',
        users: null,
        visible_nodes: [],
      },
      {
        asset_nodes: [],
        children: [],
        id: generateUUID(),
        key: '',
        name: '蓝队',
        type: 'blue',
        users: null,
        visible_nodes: [],
      },
    ];
    // 若传入的角色是空的, 默认增加两个空队伍
    if (_.isEmpty(roleAssets.value)) {
      _.merge(roleAssets.value, emptyAssets);
    }
    return { roleAssets, lang };
  },
  data() {
    return {
      team: '',
      teamItemId: '',
    };
  },
  computed: {
    teamAndId() {
      return this.team === '' && this.teamItemId === '';
    },
  },
  created() {},
  mounted() {},
  watch: {
    'PageStatus.state.roleAssets': {
      handler(val) {
        if (!val) {
          this.team = '';
          this.teamItemId = '';
        }
      },
      deep: true,
    },
  },
  methods: {
    $tt: t,

    /**
     * 资产配置
     * @param roleId
     */
    assetAllocation(config, team, teamItemId) {
      this.$emit('assetAllocation', config, 'visible_nodes');
      sceneStore.setCurrentAssets({configType: 'visible_nodes', ...config});
      this.team !== team ? (this.team = team) : (this.team = '');
      this.teamItemId !== teamItemId
        ? (this.teamItemId = teamItemId)
        : (this.teamItemId = '');
    },

    /**
     * 缩小之后的关闭按钮
     */
    handleClose() {
      this.team = '';
      this.teamItemId = '';
      this.$emit('quitEditStatus', true);
    },
  },
};
</script>

<style lang="scss" scoped>
.role-wrapper {
  .title-box {
    margin-bottom: unset;
  }

  .white-team {
    background-color: rgba(121, 136, 166, 0.1);
    margin-bottom: 20px;
    transition: all 0.5s ease;
  }

  .red-team {
    background-color: rgba(121, 136, 166, 0.1);
    margin-bottom: 20px;
    transition: all 0.5s ease;
  }

  .blue-team {
    background-color: rgba(121, 136, 166, 0.1);
    margin-bottom: 20px;
    transition: all 0.5s ease;
  }

  .content-title {
    height: 30px;

    span {
      margin: 0 20px;
      line-height: 46px;
    }
  }

  .content-btn {
    width: fit-content;
    float: right;
    margin: 6px 16px 0 0;
  }

  .content-card {
    padding-bottom: 20px;
  }
  &.hide-title {
    top: 12px;
    height: calc(100% - 23px)
  }
}

.collapse {
  width: 220px;
  height: 240px;
  overflow: hidden;

  &.en-layout {
    height: 275px;
  }
}

.team-group-leave-active {
  position: absolute;
}

.team-group-enter-from,
.team-group-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
