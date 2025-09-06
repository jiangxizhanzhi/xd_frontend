import http from '@/utils/http.js';
import { request } from '@cyber/helper';

export const getOrganization = () => {
  return http.apiAxios(
    'get',
    '/admin/auth/organizations/get_organization/',
    {},
    {
      mock: {
        error() {
          return [
            {
              label: '赛宁',
              value: '1',
              children: [
                {
                  label: '研发',
                  value: 2,
                },
                {
                  label: '测试',
                  value: 3,
                },
              ],
            },
          ];
        },
      },
    },
  );
};

// 获取用户获取组织
export const getOrgData = () => {
  return request.get('/auth/orgs/tree', null, {
    baseURL: '/api/mp',
  });
};
