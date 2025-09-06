import _ from 'lodash';
import { getI18N } from '@cyber/helper';
const i18n = getI18N();

const buildCascaderValue = (
  nodesPassed,
  value,
  iterKey = 'children',
  valueKey = 'resource_id',
) => {
  const found = getNodeInTree(nodesPassed, value, iterKey, valueKey);
  if (found) {
    let curr = found;
    const path = [curr[valueKey]];
    while (curr.parent) {
      path.push(curr.parent[valueKey]);
      curr = curr.parent;
    }
    return path.reverse();
  }
  return [];
};
const getNodeInTree = (
  nodesPassed,
  value,
  iterKey = 'children',
  valueKey = 'resource_id',
) => {
  const nodes = JSON.parse(JSON.stringify(nodesPassed));
  const mountParent = (ns, parent) => {
    if (ns && ns instanceof Array) {
      for (const node of ns) {
        node.parent = parent;
        mountParent(node[iterKey], node);
      }
    }
  };
  mountParent(nodes);

  const findNode = (collections) => {
    if (collections && collections instanceof Array) {
      for (const node of collections) {
        if (node[valueKey] === value) {
          return node;
        } else {
          const found = findNode(node[iterKey]);
          if (found) {
            return found;
          }
        }
      }
    }
  };
  const found = findNode(nodes);
  return found;
};

// 获取组织列表的最后一组组织
const getLastOrgList = (data) => {
  let arrTmp = [],
    orgList = data.orgpaths;
  if (orgList.length > 0) {
    arrTmp = orgList[orgList.length - 1];
  }
  return arrTmp;
};

// 设置组织层级的颜色
const setDifferentColor = (arr, index) => {
  if (index < arr.length) {
    return arr[index];
  }
};

export { buildCascaderValue, getNodeInTree, getLastOrgList, setDifferentColor };
