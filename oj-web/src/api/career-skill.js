import { request } from '@cyber/helper';
const baseURL = '/api/ojj';
// 技能库-表单list
export function getSkill(id) {
  return request.get(`/rtks/skill/?resource_id=${id}`, null, {
    baseURL,
  });
}
// 技能库-表单put
export function putSkill(data) {
  return request.put(`/rtks/skill/`, data, {
    baseURL,
  });
}
// 技能库-表单add
export function addSkill(data) {
  return request.post(`/rtks/skill/`, data, {
    baseURL,
  });
}
// 技能库-del
export function deleSkill(data) {
  return request.delete('/rtks/skill/', data, {
    baseURL,
  });
}

//技能-体系管理表单getlist
export function getSkillSystemList() {
  return request.get(`/rtks/skill-system/list/?per_page=10000`, null, {
    baseURL,
  });
}
//技能-体系管理表单get
export function getSkillSystem(id) {
  return request.get(`/rtks/skill-system/?resource_id=${id}`, null, {
    baseURL,
  });
}
//技能-体系管理表单修改put
export function putSkillSystem(data) {
  return request.put(`/rtks/skill-system/`, data, {
    baseURL,
  });
}
//技能-体系管理del
export function deleSkillSystem(data) {
  return request.delete('/rtks/skill-system/', data, {
    baseURL,
  });
}

//技能-类别表单getlist
export function getSkillCategoryList() {
  return request.get(`/rtks/skill-category/list/?per_page=10000`, null, {
    baseURL,
  });
}
//技能-类别表单get
export function getSkillCategory(id) {
  return request.get(`/rtks/skill-category/?resource_id=${id}`, null, {
    baseURL,
  });
}
//技能-类别表单修改put
export function putSkillCategory(data) {
  return request.put(`/rtks/skill-category/`, data, {
    baseURL,
  });
}
// 技能-类别del
export function deleSkillCategory(data) {
  return request.delete('/rtks/skill-category/', data, {
    baseURL,
  });
}

//能力表单get
export function getAbility(id) {
  return request.get(`/rtks/ability/?resource_id=${id}`, null, {
    baseURL,
  });
}
//能力表单修改put
export function putAbility(data) {
  return request.put(`/rtks/ability/`, data, {
    baseURL,
  });
}
// 能力del
export function deleAbility(data) {
  return request.delete('/rtks/ability/', data, {
    baseURL,
  });
}

// 技能库 初级中级高级
export function getLevelList() {
  return request.get(
    '/cr/common/constants_config',
    {
      type: 2,
    },
    {
      baseURL: '/api/ojj',
    },
  );
}
// 技能库 类型帅选
export function getTypeList() {
  return request.get(
    '/cr/common/authorized_type',
    {},
    {
      baseURL: '/api/ojj',
    },
  );
}
