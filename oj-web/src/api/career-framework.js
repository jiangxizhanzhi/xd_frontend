import { request } from '@cyber/helper';
const baseURL = '/api/ojj';
// 岗位职责库删除
const deleteJobResponsibility = (data) => {
  return request.delete('/rtks/task', data, {
    baseURL,
  });
};

// 岗位职责库新增
const addJobResponsibility = (data) => {
  return request.post('/rtks/task', data, {
    baseURL,
  });
};

// 岗位职责库编辑回显
const editBackData = (resource_id) => {
  return request.get(
    '/rtks/task',
    { resource_id },
    {
      baseURL,
    },
  );
};

// 岗位职责库编辑
const editJobResponsibility = (data) => {
  return request.put('/rtks/task', data, {
    baseURL,
  });
};

// 下拉框知识类别
const KnowledgeCategoryList = () => {
  return request.get(
    '/rtks/knowledge-category/list',
    { per_page: 10000 },
    {
      baseURL,
    },
  );
};

// 知识点库删除
const deleteKnowledge = (data) => {
  return request.delete('/rtks/knowledge', data, {
    baseURL,
  });
};

// 知识点库新增
const addKnowledge = (data) => {
  return request.post('/rtks/knowledge', data, {
    baseURL,
  });
};

// 知识点库回显
const editBackKnowledge = (resource_id) => {
  return request.get(
    '/rtks/knowledge',
    { resource_id },
    {
      baseURL,
    },
  );
};

// 知识点库编辑
const editKnowledge = (data) => {
  return request.put('/rtks/knowledge', data, {
    baseURL,
  });
};

// 知识类别新增
const addKnowledgeCategory = (data) => {
  return request.post('/rtks/knowledge-category', data, {
    baseURL,
  });
};

// 知识类别编辑
const editKnowledgeCategory = (data) => {
  return request.put('/rtks/knowledge-category', data, {
    baseURL,
  });
};

// 知识类别回显
const editBackCategory = (resource_id) => {
  return request.get(
    '/rtks/knowledge-category',
    { resource_id },
    {
      baseURL,
    },
  );
};

// 知识类别删除
const deleteKnowledgeCategory = (data) => {
  return request.delete('/rtks/knowledge-category', data, {
    baseURL,
  });
};

// 职业框架管理->框架列表
const frameworkList = () => {
  return request.get(
    '/rtks/frame/list',
    { per_page: 10000 },
    {
      baseURL,
    },
  );
};

// 职业框架管理->框架树形层级数据
const getTreeData = (url, resource_id) => {
  return request.get(
    url,
    { resource_id },
    {
      baseURL,
    },
  );
};

// 职业框架管理->新增框架树节点
const addTreeNode = (data) => {
  return request.post('/rtks/frame/level', data, {
    baseURL,
  });
};

// 职业框架管理->编辑框架树节点
const editTreeNode = (data) => {
  return request.put('/rtks/frame/level', data, {
    baseURL,
  });
};

// 职业框架管理->删除框架树节点
const deleteTreeNode = (data) => {
  return request.delete('/rtks/frame/level', data, {
    baseURL,
  });
};

// 职业框架管理->新增岗位
const addFrameworkStation = (data) => {
  return request.post('/rtks/role', data, {
    baseURL,
  });
};

const deleteCareerSystemData = (data) => {
  return request.delete('/rtks/role', data, {
    baseURL,
  });
};
// 职业框架管理->编辑岗位回显
const editStationBackData = (resource_id) => {
  return request.get(
    '/rtks/role',
    { resource_id },
    {
      baseURL,
    },
  );
};

// 职业框架管理->编辑岗位
const editFrameworkStation = (data) => {
  return request.put('/rtks/role', data, {
    baseURL,
  });
};

// 课程编排->获取课程列表
const getCourseList = (data) => {
  return request.get('/rtks/role/courses', data, {
    baseURL,
  });
};

// 课程编排->编排课程列表
const arrangeCourse = (data) => {
  return request.post('/rtks/role/courses', data, {
    baseURL,
  });
};

// 任务编排->获取任务列表
const getTaskList = (data) => {
  return request.get('/rtks/role/missions', data, {
    baseURL,
  });
};

// 任务编排->编任务列表
const arrangeTask = (data) => {
  return request.post('/rtks/role/missions', data, {
    baseURL,
  });
};

// 课程分类
const getDirectionList = () => {
  return request.get(
    '/oj/admin/course/direction/list',
    {
      children: false,
      page: 1,
      per_page: 9999,
    },
    {
      baseURL,
    },
  );
};

// 下拉框技能体系
const getSkillSystemList = () => {
  return request.get(
    '/rtks/skill-system/list',
    { per_page: 10000 },
    {
      baseURL,
    },
  );
};

//框架管理-表单get
const getFrame = (id) => {
  return request.get(`/rtks/frame/?resource_id=${id}`, null, {
    baseURL,
  });
};

//框架管理-表单修改put
const putFrame = (data) => {
  return request.put(`/rtks/frame`, data, {
    baseURL,
  });
};

// 框架管理-删除
const deleFrame = (data) => {
  return request.delete('/rtks/frame', data, {
    baseURL,
  });
};

// 重置框架
const resetFrame = () => {
  return request.post('/rtks/frame/reset', null, {
    baseURL,
  });
};

// 清空框架
const clearFrame = () => {
  return request.post('/rtks/frame/clear', null, {
    baseURL,
  });
};

export {
  deleteJobResponsibility,
  addJobResponsibility,
  editBackData,
  editJobResponsibility,
  KnowledgeCategoryList,
  deleteKnowledge,
  getDirectionList,
  getFrame,
  putFrame,
  deleFrame,
  addKnowledge,
  editBackKnowledge,
  editKnowledge,
  addKnowledgeCategory,
  editKnowledgeCategory,
  deleteKnowledgeCategory,
  editBackCategory,
  frameworkList,
  getTreeData,
  addTreeNode,
  editTreeNode,
  deleteTreeNode,
  getCourseList,
  arrangeCourse,
  getTaskList,
  arrangeTask,
  getSkillSystemList,
  addFrameworkStation,
  editStationBackData,
  editFrameworkStation,
  deleteCareerSystemData,
  resetFrame,
  clearFrame,
};
