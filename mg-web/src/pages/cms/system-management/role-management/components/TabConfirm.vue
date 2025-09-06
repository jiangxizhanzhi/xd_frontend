<template>
  <div>
    <cb-search-table
      :cols="cols"
      :data-source="tableData"
      ref="authorityListRef"
      :hidePaginOnDemand="true"
      showIndex
      :searchBarBg="false"
    >
    </cb-search-table>
    <div class="form-button-bar mt20">
      <cb-button-group space="middle">
        <cb-button button-type="confirm" mr @click="back">{{
          $t('systemManagement.roleManage.backStep')
        }}</cb-button>
        <cb-button button-type="confirm" mr @click="confirm">{{
          $t('systemManagement.roleManage.save')
        }}</cb-button>
        <cb-button button-type="cancel" @click="cancel">{{
          $t('systemManagement.roleManage.cancel')
        }}</cb-button>
      </cb-button-group>
    </div>
  </div>
</template>

<script>
import { addEditRole } from '@/api/role';
export default {
  name: 'TabConfirm',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  components: {},
  data() {
    return {
      cols: [
        {
          label: this.$t('systemManagement.roleManage.action'),
          /* prop: 'action', */
          getData: (row) => {
            const id = _.get(row, 'id', '') || '';
            return this.$t(`routes.${id}`);
          },
        },
        {
          label: this.$t('systemManagement.roleManage.pathName'),
          getData: (row) => {
            // 权限国际化展示
            const targets = _.get(row, 'path_name', '') || '';
            if (targets) {
              let permissionItem = targets.split('/');
              permissionItem.forEach((item, i) => {
                if (item === '*') {
                  return '*';
                } else {
                  return (permissionItem[i] = this.$t(`routes.${item}`));
                }
              });
              return permissionItem.join('/');
            }
          },
        },
        {
          label: this.$t('systemManagement.roleManage.permissions'),
          prop: 'per_status',
        },
        {
          label: this.$t('systemManagement.roleManage.status'),
          prop: 'status',
        },
      ],
      tableData: [],
    };
  },
  activated() {
    const { permissonList } = this.$store.state.role;
    const listNew = permissonList.map((item) => {
      return {
        id: item.id,
        action: item.name,
        path_name: item.path,
        per_status: item.per_status,
        /* status:
          item.status === 1
            ? this.$t('userManage.normal')
            : this.$t('userManage.disable'), */
        status: this.$t('systemManagement.userManage.normal'),
      };
    });
    this.tableData = [...listNew];
  },
  methods: {
    /* 上一步 */
    back() {
      this.$store.commit({
        type: 'role/setCurrentTab',
        tabKey: 'permission',
      });
    },
    /* 保存 */
    confirm() {
      let {
        permissonList: permission_list,
        firstStepFormValue: { name, description },
      } = this.$store.state.role;
      const list = permission_list.map((item) => item.id);
      let params = {},
        url = '';
      params = {
        target_ids: list,
        name,
        description,
      };
      /* 编辑 */
      if (this.id) {
        url = '/auth/roles/modify';
        params.id = this.id;
      } else {
        url = '/auth/roles/add';
      }
      addEditRole(url, params).then((_) => {
        this.cancel();
      });
    },
    /* 取消 */
    cancel() {
      this.$router.push({ path: '/admin/system-management/role-management' });
    },
  },
};
</script>

<style lang="scss" scoped></style>
