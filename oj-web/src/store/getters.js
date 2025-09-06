const getters = {
  token: (state) => state.user.token,
  jwt_token: (state) => state.user.jwt_token,
  avatar: (state) => state.user.user.logo,
  name: (state) => state.user.user.rep_name,
  is_admin: (state) => state.user.user.is_admin,
  user_id: (state) => state.user.user.resource_id,
  user_data: (state) => state.user.user,
  theme: (state) => state.app.theme,
  language: (state) => state.app.language,
};
export default getters;
