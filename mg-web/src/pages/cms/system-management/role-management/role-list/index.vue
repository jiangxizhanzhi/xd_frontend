<template>
  <cb-inner-page :background="true" title="权限管理">
    <cb-search-table
      :cols.sync="cols"
      :selector="selector"
      :selection.sync="selection"
      :url="roleUrl"
      :baseURL="baseURL"
      :data.sync="model"
      ref="roleListRef"
      :searchBarBg="true"
    >
      <template v-slot:search>
        <cb-button
          :disabled="notAdminDisabled"
          button-type="add"
          link-name="role-add"
        ></cb-button>
        <cb-button
          button-type="delete"
          hollow
          @click="deleteSelectedRoles(selection, $event)"
          :disabled="selection.length === 0 || notAdminDisabled"
        ></cb-button>
      </template>
      <template v-slot:filter>
        <cb-search-input
          v-model="model.name"
          :placeholder="$t('systemManagement.roleManage.enterRoleName')"
        ></cb-search-input>
      </template>
      <template v-slot:operate="scope">
        <cb-button
          type="text"
          @click="editRole(scope.data)"
          button-type="edit"
          :disabled="scope.data.identifier === 'ADMIN' || notAdminDisabled"
          mr
        ></cb-button>
        <cb-button
          :disabled="notAdminDisabled"
          type="text"
          @click="addUser(scope.data)"
        >
          {{ $t('systemManagement.roleManage.addUser') }}
        </cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import { deleteRole, permissonList } from '@/api/role';
import _ from 'lodash';
export default {
  name: 'RoleList',
  components: {},
  data() {
    return {
      roleUrl: '/auth/roles/page',
      baseURL: '/api/mp',
      model: {
        name: '',
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('systemManagement.roleManage.role'),
          prop: 'name',
          sorter: 'name',
          width: '66%',
        },
        {
          label: this.$t('systemManagement.roleManage.description'),
          prop: 'description',
          width: 240,
          resizable: true,
        },
        {
          label: this.$t('systemManagement.roleManage.permissions'),
          getData: (row) => {
            // 权限国际化展示
            const targets = _.get(row, 'targets', []) || [];
            let permissionAll = [];
            targets.forEach((item) => {
              let permissionItem = item.path ? item.path.split('/') : [];
              permissionItem.forEach((item2, i) => {
                if (item2 === '*') {
                  return '*';
                } else {
                  return (permissionItem[i] = this.$t(`routes.${item2}`));
                }
              });
              permissionAll.push(permissionItem.join('/'));
            });

            return permissionAll.join('；');
          },
          prop: 'permissions',
          width: 660,
          resizable: true,
        },
        {
          label: this.$t('systemManagement.roleManage.userNumber'),
          prop: 'user_cnt',
          width: '33%',
        },
        {
          label: this.$t('systemManagement.userManage.action'),
          slot: 'operate',
          width: 160,
        },
      ],
      notAdminDisabled: false,
    };
  },
  mounted() {
    // 普通用户没有新增、删除、编辑、添加用户等操作
    let is_admin = _.get(this.$store.state.user, 'is_admin', 1),
      is_super_user = _.get(this.$store.state.user, 'is_super_user', 1);
    if (is_admin === 0 && is_super_user === 0) {
      this.notAdminDisabled = true;
    }
  },
  methods: {
    /* 删除 */
    deleteSelectedRoles(data, done) {
      const ids = [];
      if (data?.length) {
        data.forEach((item) => {
          ids.push(item.id);
        });
      }
      deleteRole([...ids])
        .then(() => {
          done();
          this.$refs.roleListRef.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    /* 编辑 */
    editRole(data) {
      const { id } = data;
      this.$router.push({
        path: '/admin/role-management/role-edit/',
        query: {
          id,
        },
      });
    },
    /* 添加用户 */
    addUser(data) {
      const { id } = data;
      this.$router.push({
        path: '/admin/role-management/add-role-users/',
        query: {
          id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
