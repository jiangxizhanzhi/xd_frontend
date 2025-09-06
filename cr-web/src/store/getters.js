const getters = {
  language: (state) => state.user.language,
  theme: (state) => state.user.theme,
  token: (state) => state.user.token,
  avatar: (state) => state.user.user.logo,
  name: (state) => state.user.user.rep_name,
  is_admin: (state) => state.user.user.is_admin,
  user_id: (state) => state.user.user.id,
  user_hash: (state) => state.user.user.resource_id,
  status: (state) => state.user.status,
  roles: (state) => state.user.roles,
  setting: (state) => state.user.setting,
  user_data: function (state) {
    return {
      rep_name: state.user.user.rep_name,
      id: state.user.user.id,
      resource_id: state.user.user.resource_id,
      logo: state.user.user.logo,
      group: state.user.user.group,
      organization_data: state.user.user.organization_data,
    };
  },
  permission_role: (state) => state.user.permission_role,
};
export default getters;
