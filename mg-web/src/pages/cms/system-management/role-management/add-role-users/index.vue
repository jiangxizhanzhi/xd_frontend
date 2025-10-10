<template>
  <cb-inner-page :background="true" title="添加用户">
    <div style="display: flex">
      <div class="left-content">
        <left-tree
          class="content-bg"
          :url="treeUrl"
          :left-tree-style="leftTreeStyle"
          :tree-style="treeStyle"
          :scrollbar-style="scrollbarStyle"
          :defaultProps="defaultProps"
          @getResourceId="getResourceId"
        >
        </left-tree>
        <cb-search-table
          :scroll="{ y: 500 }"
          class="content-bg"
          :cols="userCols"
          :selector="selector"
          :selection.sync="selection"
          :url="userUrl"
          :baseURL="baseURL"
          :data.sync="model"
          show-less-items
          ref="addRoleUsersListRef"
          :searchBarBg="false"
          :show-search-btn="true"
        >
          <template v-slot:searchRightArea>
            <cb-button
              hollow
              @click="addUser(selection, $event)"
              :disabled="selection.length === 0"
              >{{ $t('systemManagement.roleManage.add') }}</cb-button
            >
          </template>
          <template v-slot:filter>
            <cb-search-input
              v-model="model.username"
              :placeholder="
                $t('systemManagement.userManage.inputUserNameOrName')
              "
            ></cb-search-input>
          </template>
          <template v-slot:orgpaths="scope">
            <div
              class="span-content"
              :title="getLastList(scope.data).join('/')"
            >
              <span
                v-for="(item, index) in getLastList(scope.data)"
                :key="index + Math.random()"
              >
                <span v-show="index">/</span>
                <span :style="{ color: setColor(colorMap, index) }">{{
                  item
                }}</span>
              </span>
            </div>
          </template>
        </cb-search-table>
      </div>
      <div class="icon-jiantou" style="width: 80px; flex-shrink: 0">
        <cb-iconfont
          class="jiantou"
          style="font-size: 40px"
          type="icon-daorujiantou"
          themedColor="cy14"
        ></cb-iconfont>
      </div>
      <cb-search-table
        :scroll="{ y: 500 }"
        class="content-bg"
        style="width: 40%; flex-shrink: 0"
        :cols="selectedUsersCols"
        :url="selectedUrl"
        :baseURL="baseURL"
        :data="selectedModel"
        ref="selectedUserListRef"
        show-less-items
        :searchBarBg="false"
      >
        <template v-slot:search>
          <div class="without-item" style="margin-bottom: 17px">
            <span class="title">{{
              $t('systemManagement.roleManage.chosenUser')
            }}</span>
          </div>
        </template>
        <template v-slot:orgpaths="scope">
          <div class="span-content" :title="getLastList(scope.data).join('/')">
            <span
              v-for="(item, index) in getLastList(scope.data)"
              :key="index + Math.random()"
            >
              <span v-show="index">/</span>
              <span :style="{ color: setColor(colorMap, index) }">{{
                item
              }}</span>
            </span>
          </div>
        </template>
        <template v-slot:operate="scope">
          <cb-button
            type="text"
            button-type="delete"
            @click="deleteSelectedUsers(scope.data, $event, 'del')"
          ></cb-button>
        </template>
      </cb-search-table>
    </div>
    <div class="btn_group">
      <cb-button-group space="middle">
        <cb-button button-type="confirm" @click="cancel">{{
          $t('systemManagement.roleManage.back')
        }}</cb-button>
      </cb-button-group>
    </div>
  </cb-inner-page>
</template>

<script>
import LeftTree from '@/components/left-tree';
import Utils from '@/utils/utils';
import { roleAddUser, deleteRoleUser } from '@/api/role';

export default {
  name: 'AddRoleUsers',
  components: {
    LeftTree,
  },
  data() {
    return {
      treeUrl: '/auth/orgs/tree',
      userUrl: '/auth/org_users/page/byorg',
      baseURL: '/api/mp',
      leftTreeStyle: {},
      treeStyle: {
        width: '200px',
      },
      scrollbarStyle: {
        height: '550px',
      },
      defaultProps: {
        children: 'children',
        label: 'name',
      },

      model: {
        username: '',
        org: '',
      },
      selectedUrl: '',
      selectedModel: {
        roleId: '',
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      userCols: [
        {
          label: this.$t('systemManagement.userManage.userName'),
          prop: 'username',
        },
        {
          label: this.$t('systemManagement.userManage.name'),
          prop: 'name',
        },
        {
          label: this.$t('systemManagement.userManage.organization'),
          slot: 'orgpaths',
        },
        {
          label: this.$t('systemManagement.roleManage.role'),
          getData: (row) => {
            const { roles } = row;
            const list = [];
            roles.forEach((item) => {
              list.push(item.name);
            });
            return list.join('/');
          },
        },
      ],
      selectedUsersCols: [
        {
          label: this.$t('systemManagement.userManage.userName'),
          prop: 'username',
        },
        {
          label: this.$t('systemManagement.userManage.organization'),
          slot: 'orgpaths',
        },
        {
          label: this.$t('systemManagement.userManage.action'),
          slot: 'operate',
          width: '100px',
        },
      ],
      // colorMap: [this.$themed('cy9'), this.$themed('cy1')],
      colorMap: [this.$themed('orange-color'), this.$themed('primary-color')],
    };
  },
  created() {
    const id = this.$route.query.id;
    this.selectedModel.roleId = id;
    this.selectedUrl = '/auth/user_roles/users/page/byrole';
  },
  methods: {
    // 点击左侧树获取resource_id
    getResourceId(v) {
      this.model.org = v;
    },
    // 添加用户
    addUser(data, done) {
      const user_ids = [];
      if (data?.length) {
        data.forEach((item) => {
          user_ids.push(item.id);
        });
      }
      const params = {
        user_ids,
        role_id: this.selectedModel.roleId,
      };
      roleAddUser(params).then(() => {
        done();
        this.$refs.selectedUserListRef.reload();
      });
    },
    // 删除已选择用户
    deleteSelectedUsers(data, done) {
      const { id } = data;
      const params = {
        user_ids: [id],
        role_id: this.selectedModel.roleId,
      };
      deleteRoleUser(params)
        .then(() => {
          done();
          this.$refs.selectedUserListRef.reload();
        })
        .catch((_) => {
          done(false);
        });
    },
    cancel() {
      this.$router.push({ path: '/admin/system-management/role-management' });
    },
    getLastList(data) {
      return Utils.getLastOrgList(data);
    },
    setColor(arr, index) {
      return Utils.setDifferentColor(arr, index);
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-jiantou {
  display: flex;
  align-items: center;
  justify-content: center;
}
.treeTitle {
  margin: 6px 10px;
}
.without-item {
  margin-top: 10px;
}
.span-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.title {
  color: var(--primary-color);
  font-size: 14px;
}
.btn_group {
  display: flex;
  align-items: center;
  margin-top: 24px;
  justify-content: center;
}
.left-content {
  display: flex;
  flex-shrink: 0;
  position: relative;
  width: calc(60% - 80px);
}
.content-bg {
  position: relative;
  padding: 18px;
}

.left-content,
.content-bg {
  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
    background: var(--bg-color-3);
    opacity: 0.3;
    pointer-events: none;
  }
}
</style>
