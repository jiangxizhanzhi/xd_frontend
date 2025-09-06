import { request } from '@cyber/helper';

// 获取三级指标项下全部变量项
const getVariableList = (data) => {
  return request.get('/cr/eval/record/variables', data, {
    baseURL: '/api/ojj',
  });
};

// 折线图
const getGraphData = (data) => {
  return request.get('/cr/eval/record/variables/graph', data, {
    baseURL: '/api/ojj',
  });
};

// 表格
const getTableData = (data) => {
  return request.get('/cr/eval/record/variables/data', data, {
    baseURL: '/api/ojj',
  });
};
export { getVariableList, getGraphData, getTableData };
