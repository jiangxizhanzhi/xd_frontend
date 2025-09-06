<template>
  <div
    class="role-info"
    :class="[
      role.type === 'blue'
        ? 'role-left-border-color-student'
        : 'role-left-border-color-teacher',
      role.type + role.id === selectRole ? 'select-background' : '',
    ]"
  >
    <div class="role-img">
      <i
        :style="
          role.type === 'blue'
            ? 'color: var(--link-color)'
            : 'color: var(--danger-color)'
        "
        class="fa fa-user fa-3x"
        style="min-width: 52px"
      />
    </div>
    <div class="role-body">
      <div class="role-title one-overflow" :title="role.name">
        {{ role.name }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RoleInfo',
  components: {},
  props: {
    role: {
      type: Object,
      default() {
        return {};
      },
    },
    slotVisible: {
      type: Boolean,
      default() {
        return false;
      },
    },
    roleKey: {
      type: Array,
      default() {
        return [];
      },
    },
    selectRole: {
      type: [String, Number],
      default() {
        return undefined;
      },
    },
    typeClass: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
};
</script>
<style scoped lang="scss">
.role-info {
  width: 100%;
  height: 64px;
  margin-bottom: 10px;
  padding: 10px 0 0 0;
  clear: both;
  overflow: hidden;
  zoom: 1;
  .one-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .role-img {
    float: left;
    margin-top: auto;
    margin-left: 3%;
  }

  .role-body {
    float: left;
    width: 60%;
    margin-left: 3%;
    .role-title {
      font-weight: bold;
      padding-bottom: 5px;
      cursor: pointer;
    }
    word-break: break-all;
    margin-bottom: 5%;
    min-height: 40px;
    line-height: 40px;
    padding: 0 5px 0 10px;
    box-sizing: border-box;
    overflow: hidden;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
}
.roleInfoEn {
  margin-left: 60px;
}
</style>
<style lang="scss" scoped>
.role-title {
  color: var(--neutral8);
}
.select-background {
  background-color: var(--neutral0);
}
.role-left-border-color-teacher {
  border-left: 2px solid var(--red-color);
}
.role-left-border-color-student {
  border-left: 2px solid var(--blue-color);
}
</style>
