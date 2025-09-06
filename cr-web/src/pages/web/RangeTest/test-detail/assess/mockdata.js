//返回的四级树结构
export const mocktreeData = [
  {
    name: '一级指标名称',
    id: '1',
    level: 1,
    children: [
      {
        name: '二级指标名称二级指标名称二级二级哈哈哈',
        id: '1-1',
        level: 2,
        children: [
          {
            name: '三级 1-1-1',
            id: '1-1-1',
            level: 3,
            type: '1', //评分方式
            threeIdtype: '1', //专家评估项下面的方式 周期，时延，百分比，对应1，2，3
            systemdMethod: [
              //评分方式 1时的数据结构
              {
                name: '四级名称四级名称四级名称四级名称四级名称四级名称8888',
                id: '11',
                level: 4,
                type: '1', //评分方式
                threeIdtype: '1', //专家评估项下面的方式 周期，时延，百分比，对应1，2，3
              },
              {
                name: 'cpu使用率',
                id: '122',
                type: '1', //评分方式
                threeIdtype: '1', //专家评估项下面的方式 周期，时延，百分比，对应1，2，3
              },
              {
                name: '内存使用率',
                id: '123',
                type: '1', //评分方式
                threeIdtype: '1', //专家评估项下面的方式 周期，时延，百分比，对应1，2，3
              },
            ],
          },
        ],
      },
      {
        name: '二级名称02二级名称02',
        id: '1-2',
        level: 2,
        children: [
          {
            name: '三级 1-2-1',
            id: '1-2-1',
            level: 3,
            type: '1', //评分方式
            threeIdtype: '2', //专家评估项下面的方式 周期，时延，百分比，对应1，2，3
            systemdMethod: [
              //评分方式 1时的数据结构
              {
                name: 'warn信息提示',
                id: '11',
                type: '1', //评分方式
                threeIdtype: '1', //专家评估项下面的方式 周期，时延，百分比，对应1，2，3
              },
            ],
          },
        ],
      },
      {
        name: '三级三级三级三级三级三级三级三级三级',
        id: '1-3',
        level: 2,
        children: [],
      },
    ],
  },
];
//tree 设置默认数据去掉节点名称
export const mocktreeDefaultProps = {
  children: 'children',
  label: 'name',
};

//场景节点数据
export const mockoptions1 = [
  {
    value: '1',
    label: 'win 10',
  },
  {
    value: '2',
    label: 'win 11',
  },
  {
    value: '3',
    label: 'win 12',
  },
  {
    value: '4',
    label: 'win 13',
  },
  {
    value: '5',
    label: 'win 14',
  },
];

//采集探针数据
export const mockoptions2 = [
  {
    value: '11',
    label: 'cpu使用率1',
  },
  {
    value: '22',
    label: '内存使用率0',
  },
  {
    value: '33',
    label: '内存使用率1',
  },
  {
    value: '44',
    label: '内存使用率2',
  },
  {
    value: '55',
    label: '内存使用率3',
  },
];
//点击三级菜单模拟数据

export const evaluation = {
  name: '三级 1-1-1',
  id: '1-1-1',
  data: [
    {
      name: '四级名称',
      id: '41',
      type: 1,
      radio: 1,
      sceneNode: '',
      collectionProbe: '',
    },
    {
      name: 'cpu使用率',
      id: '42',
      type: 2,
      radio: 1,
      sceneNode: '',
      collectionProbe: '',
    },
    {
      name: '内存使用率',
      id: '42',
      type: 3,
      radio: 1,
      sceneNode: '',
      collectionProbe: '',
    },
  ],
};

//新增数据
const mockaddData = [
  {
    name: '三级 1-1-1', //三级的name
    id: '1-1-1', //三级的id
    type: '2', //评分方式 1系统评分，2是专家评分 ，当type=1，取systemdMethod，当type=2，取specialistMethod
    threeIdtype: '1', //专家评分方式 1：周期，2：时延，3：百分比
    systemdMethod: [
      //系统评分
      {
        name: '四级名称',
        id: '11',
        sceneNode: '1',
        collectionProbe: '11',
      },
      {
        name: 'cpu使用率',
        id: '12',
        sceneNode: '2',
        collectionProbe: '22',
      },
      {
        name: '内存使用率',
        id: '12',
        sceneNode: '3',
        collectionProbe: '44',
      },
    ],
    specialistMethod: {
      //专家评分
      cycle: '3',
      timeDelay: '',
      percentage: '',
    },
  },
  {
    name: '三级 2-1-1',
    id: '2-1-1',
    type: '1',
    threeIdtype: '1',
    systemdMethod: [
      {
        name: 'warn信息提示2',
        id: '21',
        sceneNode: '5',
        collectionProbe: '22',
      },
    ],
    specialistMethod: {
      cycle: '',
      timeDelay: '',
      percentage: '',
    },
  },
  {
    name: '三级 2-2-1',
    id: '2-2-1',
    type: '2',
    threeIdtype: '2',
    systemdMethod: [
      {
        name: 'warn信息提示2-2',
        id: '212',
        sceneNode: '',
        collectionProbe: '',
      },
    ],
    specialistMethod: {
      cycle: '',
      timeDelay: '3',
      percentage: '',
    },
  },
  {
    name: '三级 3-1-1',
    id: '3-1-1',
    type: '2',
    threeIdtype: '3',
    specialistMethod: {
      cycle: '',
      timeDelay: '',
      percentage: '10',
    },
  },
];
