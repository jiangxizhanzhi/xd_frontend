import _ from 'lodash';

const sceneStore = {
  state: {
    // config: {
    //   edges: new Map(),
    //   nodes: new Map(),
    //   blocks: new Map(),
    //   labels: new Map(),
    // },
    assets: [] as any[],
    currentAssets: {}, // 当前正在配置的角色资产和战争迷雾类型（两种不单独处理，合并处理）,用于分层的处理
    outDisplayContext: '', // 外部传入的display_context，用于回存
    basicConfig: {
      active: 'background',
      enable_flow_collect: false,
      enable_flow_mirror: false,
      dns_nameservers: [], //dns域名设置
      showLineLabels: false, // 是否展示端口名称
      backgroundList: [
        { key: 'background', value: '' },
        { key: 'background2', value: '' },
        { key: 'background3', value: '' },
      ],
      /**
       * 连线模式
       * true 简易型连线模式
       * false 需要选择端口
       */
      simpleModeToEdge: true,
      graphTranslate: '', // 画布偏移量
      graphZoom: '', // 画布缩放比例
      // 右下方画布工具栏
      showGraphToolbar: true,
      // 右下方节点数量限制信息展示
      showNodeLimitTip: true,
      layoutType: 'none', // 布局类型
      backgroundType: 'background-image', // 背景类型 background-image || background-color
      backgroundColor: 'var(--bg-color-1)', // 背景色值
      showGrid: true, // 网格
    },
    targetNum: {
      nodes: 0, // 记录更新当前场景的节点数量
      switcher: 0,
    },
    graph: null as any,
    sceneStatus: '', // 当前编辑器是编辑状态还是展示状态 edit || display 是否允许弹窗
    commonProbes: null as any, // 通用探针数据
    dynamicsData: null as any, // dynamics 数据
    iconPool: new Map(), // 场景图片地址池
    iconPoolData: new Map(), // 缓存图片
    lastLayoutData: '', // 记录上次布局数据
    edgeCount: 0, // 记录连线的数量
    oldKey: new Map(), // 旧id和新id匹配关系
    importSceneId: '', // 新增时用于存储导入文件的场景的id
    jumpoverEdgeCount: 50, // 显示跳线时画布中的最大连线数量，如果连线数量大于50，则不使用跳线，跳线时间复杂度为O(n)
    crossLevelNodeConnection: [] as any[], // 跨层级的连线 node_connections
    crossLevelConnection: [] as any[], // 跨层级的连线 connections
  },
  setGraph(graph: any) {
    this.state.graph = graph;
  },
  setAssets(asset: any) {
    this.state.assets.push(asset);
  },
  resetAssets(asset: any) {
    this.state.assets = asset;
  },
  setBasicConfig(basicConfig: any) {
    this.state.basicConfig = _.merge(this.state.basicConfig, basicConfig);
  },
  setOutDisplayContext(outDisplayContext: any) {
    this.state.outDisplayContext = outDisplayContext;
  },
  setSceneStatus(status: any) {
    this.state.sceneStatus = status;
  },
  setIconPool(icon: any, iconBase64: any) {
    this.state.iconPool.set(icon, iconBase64);
  },
  setIconPoolData(icon: any, data: any) {
    this.state.iconPoolData?.set(icon, data);
  },
  setLastLayoutData(layoutData: any) {
    this.state.lastLayoutData = layoutData;
  },
  setEdgeCount(edgeCount: any) {
    this.state.edgeCount += edgeCount;
  },
  setCrossLevelNodeConnection(data: any) {
    this.state.crossLevelNodeConnection.push(data);
  },
  setOldKey(oldKey: any) {
    this.state.oldKey = oldKey;
  },
  setCurrentAssets(currentAssets: any) {
    this.state.currentAssets = currentAssets;
  },
};
export default sceneStore;
