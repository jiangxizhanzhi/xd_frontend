<!--
* 角色资产
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
      <span class="title ft14">{{ $tt('menu.menu.roleAssets') }}</span>
    </div>

    <!--白红蓝队内容-->
    <div class="content">
      <transition-group name="team-group">
        <!--白队-->
        <template v-if="showAddRole">
          <div
            class="white-team"
            key="white"
            v-if="team === '' || team === 'white'"
          >
            <div class="content-title">
              <span class="ft14">{{ $tt('menu.drawer.whiteTeam') }}</span>
            </div>
            <div class="content-card">
              <template>
                <role-card
                  :config="{ type: 'white' }"
                  :showBtn="false"
                ></role-card>
              </template>
            </div>
          </div>
        </template>
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
                <div class="content-btn" v-if="teamAndId">
                  <cb-button
                    v-if="showAddRole"
                    type="text"
                    icon="icon-xinzeng"
                    hollow
                    @click="addRole(item)"
                  >
                    {{ $tt('menu.drawer.addRole') }}
                  </cb-button>
                </div>
                <div class="content-btn" v-else>
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
                      :show-delete="showAddRole"
                      :param-name="'asset_nodes'"
                      @assetAllocation="(e) => assetAllocation(e, 'red', index)"
                      @deleteRole="(id) => deleteRole(id, item)"
                    ></role-card
                  ></template>
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
                <div class="content-btn" v-if="teamAndId">
                  <cb-button
                    v-if="showAddRole"
                    type="text"
                    icon="icon-xinzeng"
                    hollow
                    @click="addRole(item)"
                  >
                    {{ $tt('menu.drawer.addRole') }}
                  </cb-button>
                </div>
                <div class="content-btn" v-else>
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
                      :show-delete="showAddRole"
                      :param-name="'asset_nodes'"
                      @assetAllocation="
                        (e) => assetAllocation(e, 'blue', index)
                      "
                      @deleteRole="(id) => deleteRole(id, item)"
                    ></role-card
                  ></template>
                </div>
              </div>
            </div>
          </template>
        </div>
      </transition-group>
    </div>

    <!--新增角色弹窗-->
    <cb-dialog
      :visible.sync="visible"
      width="600px"
      :append-to-body="shareState.isFullScreen ? false : true"
      :modal-append-to-body="false"
    >
      <template slot="title">
        <span>{{ $tt('menu.drawer.addRole') }}</span>
      </template>
      <cb-form
        ref="addRole"
        :rules="rules"
        :model.sync="formData"
        label-width="120px"
      >
        <cb-form-item
          :label="$tt('menu.drawer.roleName') + ':'"
          prop="roleName"
        >
          <cb-input
            v-model="formData.roleName"
            ref="roleName"
            :placeholder="$tt('global.placeInputName')"
            style="width: 80%"
          ></cb-input>
        </cb-form-item>
      </cb-form>
      <template slot="footer">
        <div>
          <cb-button button-type="confirm" mr @click="confirm"></cb-button>
          <cb-button button-type="cancel" @click="visible = false"></cb-button>
        </div>
      </template>
    </cb-dialog>
  </div>
</template>

<script>
import RoleCard from '../components/role-card';
import {computed, inject, ref} from '@vue/composition-api';
import PageStatus from '../../../store/page-status';
import _ from 'lodash';
import t from '../../../../utils/i18n';
import sceneStore from '../../../../store/scene-store';
import { generateUUID } from '../../../../utils/common';

export default {
  name: 'DrawerRole',
  components: {
    RoleCard,
  },
  props: {
    /**
     * 是否显示"新增角色"按钮
     */
    showAddRole: {
      type: Boolean,
      default: true,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    // 展示红队还是蓝队
    roleShowConfig: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup() {
    const lang = inject('lang');
    const roleAssets = computed({
      get: () => {
        return sceneStore.state.assets;
      },
    });
    const shareState = computed({
      get: () => {
        return PageStatus.state;
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
    return { roleAssets, lang, shareState };
  },
  data() {
    return {
      autofocus: false,
      PageStatus: PageStatus,
      visible: false,
      isWho: '',
      team: '',
      teamItemId: '',
      teamData: {},
      formData: {
        roleName: '',
      },
      rules: {
        roleName: [
          {
            required: true,
            message: this.$tt('menu.dialog.validator.placeInputRoleName'),
            trigger: ['blur', 'change'],
          },
          {
            min: 2,
            max: 20,
            message: this.$tt('menu.dialog.validator.roleNameLen'),
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  computed: {
    // 未进行角色资产分配时，"角色资产"弹窗正常展示
    teamAndId() {
      return this.team === '' && this.teamItemId === '';
    },
  },
  created() {},
  mounted() {},
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.formData.roleName = '';
        }
      },
    },
    /* 监听roleAssets，判断是否是角色资产分配状态,
    角色资产分配状态就是点击队伍的编排按钮，角色资产缩小后的状态 */
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
     * 新增角色
     */
    addRole(data) {
      setTimeout(() => {
        this.$refs.roleName.focus();
      });
      this.visible = true;
      this.teamData = data;
      this.isWho = data.type;
    },
    /**
     * 弹窗确定
     */
    confirm() {
      this.$refs.addRole.validate((e) => {
        if (e) {
          if (
            this.teamData.children?.some(
              (child) => child.name == this.formData.roleName,
            )
          ) {
            this.$message.error(
              this.$tt('menu.dialog.validator.duplicateName'),
            );
          } else {
            if (!this.teamData.children) {
              this.teamData.children = [];
            }
            this.teamData.children?.push({
              asset_nodes: [],
              children: [],
              id: generateUUID(),
              key: '',
              name: this.formData.roleName,
              type: this.isWho,
              users: null,
              visible_nodes: [],
            });
            let whoIndex = this.isWho == 'red' ? 0 : 1;
            sceneStore.state.assets[whoIndex] = this.teamData;
            this.visible = false;
          }
        }
      });
    },

    /**
     * 资产配置
     * @param config
     * @param team
     * @param teamItemId
     */
    assetAllocation(config, team, teamItemId) {
      this.$emit('assetAllocation', config, 'asset_nodes');
      sceneStore.setCurrentAssets({configType: 'asset_nodes', ...config});
      this.team !== team ? (this.team = team) : (this.team = '');
      this.teamItemId !== teamItemId
        ? (this.teamItemId = teamItemId)
        : (this.teamItemId = '');
    },

    /**
     * 删除
     * @param id
     * @param data
     */
    deleteRole(id, data) {
      // 二次确认弹窗
      this.$confirm(
        this.$tt('menu.drawer.confirmDeleteRole'),
        '',
        {
          confirmButtonText: this.$tt('global.sure'),
          cancelButtonText: this.$tt('global.cancel'),
          type: 'warning',
        },
      )
        .then(() => {
          let whoIndex = data.type === 'red' ? 0 : 1;
          data.children?.splice(
            data.children?.findIndex((role) => {
              return role.id === id;
            }),
            1,
          );
          let cloneAssetsData = _.cloneDeep(sceneStore.state.assets)
          cloneAssetsData[whoIndex] = data;
          sceneStore.resetAssets(cloneAssetsData);
        })
        .catch(() => {});
    },

    /**
     * 缩小之后的"展开"按钮点击
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

  .title-box {
    margin-bottom: unset;
  }

  .content-btn {
    width: fit-content;
    float: right;
    margin: 6px 16px 0 0;

    .close-btn {
    }
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
  width: 200px;
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
