import _ from 'lodash';

export function isChildrenActive(active, item, nameField, routes) {
  let result = false;
  const parentName = _.get(active, 'meta.breadcrumb.parentName');
  let top = parentName;
  const findTop = (name) => {
    routes.some((i) => {
      if (name === i.name) {
        const _par = _.get(i, 'meta.breadcrumb.parentName');
        if (_par) {
          findTop(_par);
        } else {
          top = name;
        }
        return true;
      } else {
        return false;
      }
    });
  };
  if (parentName) {
    findTop(parentName);
  }
  const value = top || active[nameField];
  if (item[nameField] === value) {
    return true;
  }
  const findRoute = (_routes) => {
    _routes.map((r) => {
      if (!r.disable) {
        if (r[nameField] === value) {
          result = true;
        } else if (r.children && r.children.length > 0) {
          findRoute(r.children);
        }
      }
    });
  };

  if (item.children && item.children.length > 0) {
    findRoute(item.children);
  }
  return result;
}

export function getItemTitle(item) {
  return _.get(item, 'meta.title', item.title);
}

export function isShowInMenu(item) {
  return (
    !_.get(item, 'meta.hideInMenu') &&
    !_.get(item, 'meta.breadcrumb.parentName') &&
    getItemTitle(item)
  );
}

function hasChildren(item) {
  const children = _.get(item, 'children', []);
  if (_.isEmpty(children)) {
    return false;
  }
  return children;
}

export function hasValidChildren(item) {
  const children = hasChildren(item);
  if (!children) {
    return false;
  }
  const showInMenu = children.some((i) => {
    return (
      !_.get(i, 'meta.hideInMenu') && !_.get(i, 'meta.breadcrumb.parentName')
    );
  });
  if (showInMenu) {
    return true;
  }
  return false;
}

export function getComputedItem(item) {
  const children = hasChildren(item);
  if (!children || hasValidChildren(item)) {
    return item;
  }
  const child = _.find(children, (i) => {
    return !_.get(i, 'meta.breadcrumb.parentName');
  });
  if (_.isPlainObject(child)) {
    const { path, name } = child;
    return Object.assign({}, item, {
      path,
      name,
      title: getItemTitle(child),
      children: [],
    });
  } else {
    return item;
  }
}

export function getAllPath(data) {
  const temps = [];
  const getChildrenPath = (arr, folderName) => {
    arr.map((i) => {
      const title = _.get(i, 'meta.title');
      title &&
        temps.push({
          title,
          name: i.name,
          path: i.path,
          meta: i.meta,
          _folderName: folderName,
        });
      if (_.isArray(i.children)) {
        getChildrenPath(i.children, i.name);
      }
    });
  };
  data.map((_item) => {
    const title = _.get(_item, 'meta.title');
    title &&
      temps.push({
        title,
        name: _item.name,
        path: _item.path,
        meta: _item.meta,
      });

    if (_.isArray(_item.children)) {
      getChildrenPath(_item.children, _item.name);
    }
  });
  return temps;
}

export function getTopMenu(active, allPath) {
  let item = active;
  let parent = _.get(item, 'meta.breadcrumb.parentName', false);

  while (parent) {
    item = _.find(allPath, { name: parent });
    parent = _.get(item, 'meta.breadcrumb.parentName', false);
  }

  return item;
}

// 获取字符长度
export function getNameLength(str) {
  let sum = 0;
  const value = str.trim();
  const cn_re = /[\u4e00-\u9fa5]/;
  for (let s = 0; s < value.length; s++) {
    if (cn_re.test(value[s])) {
      sum = sum + 2;
    } else {
      sum = sum + 1;
    }
  }
  return sum;
}
