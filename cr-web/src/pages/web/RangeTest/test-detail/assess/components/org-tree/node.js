const EVENTS = {
  CLICK: 'on-node-click',
  MOUSEOUT: 'on-node-mouseout',
  MOUSEOVER: 'on-node-mouseover',
  DRAGSTART: 'on-node-drag-start',
  DRAGOVER: 'on-node-drag-over',
  DROP: 'on-node-drop',
};
function createListener(handler, data) {
  const execute = (cb, e, ...args) => {
    if (typeof cb === 'function') {
      // fixed bug #48, #73
      const className = e.target && e.target.className;
      if (
        typeof className === 'string' &&
        className.indexOf('org-tree-node-btn') > -1
      )
        return;

      cb.apply(null, [e, ...args]);
    }
  };

  return function (e) {
    if (Array.isArray(handler)) {
      for (const cb of handler) {
        execute(cb, e, data);
      }
    } else {
      execute(handler, e, data);
    }
  };
}

// 判断是否叶子节点
const isLeaf = (data, prop) => {
  return !(Array.isArray(data[prop]) && data[prop].length > 0);
};
// 创建 node 节点
export const renderNode = (h, data, context) => {
  const { props } = context;
  const cls = ['org-tree-node'];
  const childNodes = [];
  const children = data[props.props.children];

  if (isLeaf(data, props.props.children)) {
    cls.push('is-leaf');
  } else if (props.collapsable && !data[props.props.expand]) {
    cls.push('collapsed');
  }

  childNodes.push(renderLabel(h, data, context));

  if (!props.collapsable || data[props.props.expand]) {
    childNodes.push(renderChildren(h, children, context));
  }

  return h(
    'div',
    {
      domProps: {
        className: cls.join(' '),
      },
    },
    childNodes,
  );
};

// 创建展开折叠按钮
export const renderBtn = (h, data, { props, listeners }) => {
  const expandHandler = listeners['on-expand'];

  let cls = ['org-tree-node-btn'];

  if (data[props.props.expand]) {
    cls.push('expanded');
  }

  return h('span', {
    domProps: {
      className: cls.join(' '),
    },
    on: {
      click: (e) => expandHandler && expandHandler(e, data),
    },
  });
};

// 创建 label 节点

function ChangeTheColor(e, judge, NodeClass) {
  if (
    judge !== '' &&
    judge !== undefined &&
    judge !== null &&
    judge.swtich !== false
  ) {
    for (var k in judge) {
      var a = eval('e.' + k);
      if (NodeClass) {
        for (let c = 0; c < NodeClass.length; c++) {
          if (a === NodeClass[c]) return NodeClass[c];
          else if (NodeClass.length - 1 == c) return '';
        }
      } else {
        return '';
      }
    }
  } else {
    return '';
  }
}
// 创建 node 子节点
export const renderChildren = (h, list, context) => {
  if (Array.isArray(list) && list.length) {
    const children = list.map((item) => {
      return renderNode(h, item, context);
    });

    return h(
      'div',
      {
        domProps: {
          className: 'org-tree-node-children',
        },
      },
      children,
    );
  }
  return '';
};

export const render = (h, context) => {
  const { props } = context;

  return renderNode(h, props.data, context);
};

//修改百分比颜色
export const renderLabel = (h, data, context) => {
  const { props, listeners } = context;
  const label = data[props.props.label];
  const score = data.score;
  const renderContent = props.renderContent;
  // event handlers
  const clickHandler = listeners['on-node-click'];
  const mouseOverHandler = listeners['on-node-mouseover'];
  const mouseOutHandler = listeners['on-node-mouseout'];

  const childNodes = [];
  if (typeof renderContent === 'function') {
    let vnode = renderContent(h, data);

    vnode && childNodes.push(vnode);
  } else {
    childNodes.push(label);
    childNodes.push(score);
  }

  if (props.collapsable && !isLeaf(data, props.props.children)) {
    childNodes.push(renderBtn(h, data, context));
  }

  const cls = ['org-tree-node-label-inner'];
  let {
    labelWidth,
    labelClassName,
    selectedClassName,
    selectedKey,
    judge,
    NodeClass,
  } = props;

  if (typeof labelWidth === 'number') {
    labelWidth += 'px';
  }

  if (typeof labelClassName === 'function') {
    labelClassName = labelClassName(data);
  }

  labelClassName && cls.push(labelClassName);

  // add selected class and key from props
  if (typeof selectedClassName === 'function') {
    selectedClassName = selectedClassName(data);
  }

  selectedClassName &&
    selectedKey &&
    data[selectedKey] &&
    cls.push(selectedClassName);

  // console.log('-----,childNodes', childNodes);
  return h(
    'div',
    {
      domProps: {
        className: 'org-tree-node-label',
      },
    },
    [
      h(
        'div',
        {
          domProps: {
            className:
              data.level % 2 === 0
                ? ChangeTheColor(data, judge, NodeClass) +
                  'org-tree-node-label-inner1'
                : ChangeTheColor(data, judge, NodeClass) +
                  'org-tree-node-label-inner',
          },
          on: {
            click: createListener(clickHandler, data),
            mouseout: createListener(mouseOutHandler, data),
            mouseover: createListener(mouseOverHandler, data),
          },
        },
        [
          h(
            'span',
            {
              domProps: {
                className: 'org-tree-node-label-inner-text one-overflow',
                title: childNodes[0],
              },
            },
            childNodes[0],
          ),
          data.level % 2 !== 0
            ? h(
                'span',
                {
                  domProps: {
                    className: 'org-tree-node-label-inner-span',
                  },
                },
                childNodes[1] === undefined || childNodes[1] === null
                  ? ''
                  : childNodes[1] + '%',
              )
            : '',
        ],
      ),
    ],
  );
};
export default render;
