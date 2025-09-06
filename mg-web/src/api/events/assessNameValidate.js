import { request as request1 } from '@cyber/helper';

// 创建测评名称重复校验
export function validateName(name, type) {
  return request1.patch(
    '/admin/ceBase/crEvents/validate_name_patch/',
    { name: name, type: type },
    { baseURL: '/api/ojj' },
  );
}

// 更新测评名称重复校验
export function validateNamePatch(name, type, id) {
  return request1.patch(
    '/admin/ceBase/crEvents/validate_name_patch/',
    { name: name, type: type, id: id },
    { baseURL: '/api/ojj' },
  );
}
