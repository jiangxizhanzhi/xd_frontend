import { request } from '@cyber/helper';

// 主机信息
const getMainInfoList = (id) => {
  return request.get(
    `/cscene/monitor/scene/all_elements/${id}/?realTimeHostState=false`,
    null,
    {
      baseURL: '/api/mp',
    },
  );
};

// 查询节点漏洞服务Top10
const getVulTop10Data = (data) => {
  return request.get(
    `/cscene/monitor/scene/element/get_service_vulnerability`,
    data,
    {
      baseURL: '/api/mp',
    },
  );
};

// 查询节点服务漏洞饼状图
const getCVSSData = (data) => {
  return request.get(
    `/cscene/monitor/scene/element/get_vulnerability_pie_chart`,
    data,
    {
      baseURL: '/api/mp',
    },
  );
};

export { getMainInfoList, getVulTop10Data, getCVSSData };
