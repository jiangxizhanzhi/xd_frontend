// TODO:常量定义及使用：分模块、声明、获取 具体规范还待统一确定

// 用户状态
export const USER_STATUS = {
  DISABLE: 2, // 禁用状态&&操作类型
  NORMAL: 3, // 正常状态
  RESTORE: 1, // 恢复--操作类型
};

// 用户角色列表
export const USER_ROLE_LIST = [
  {
    label: '制作人',
    value: 2,
  },
  {
    label: '审核',
    value: 3,
  },
  {
    label: '管理员',
    value: 1,
  },
  {
    label: '技术支持',
    value: 4,
  },
];
