const PageStatus = {
  state: {
    collapse: false,
    drawer: false,
    toolbarConfig: {
      eventConfig: {
        nodes: {
          id: '',
          interactive: { click: true, drag: true, dblclick: true },
        },
        blocks: { interactive: { add: false, drag: true } },
        edges: { interactive: { add: false, click: true } },
        scale: { interactive: true },
      },
      index: 0,
    },
    roleAssets: false, // 角色资产分配状态
    dialog: true, // 弹窗状态
    defaultIcon: {}, // 默认图标
    maxCount: 0, // 拓扑场景内最多支持节点个数
    anotherLayerNodeCount: 0, // 除当前层外，其他层的节点个数（注意：在计算节点数量的时候，需要将属于上一层的节点排除，再计算）
    systemType: {}, // 靶标 三级分类和二级分类的转换关系
    isFullScreen: false, // 是否全屏状态
    theme: 'dark', // 主题色，默认暗色主题
    menubar: [] as any[], // 菜单栏
    showMenu: true, // 是否显示左侧菜单栏
    allowStart: true, // 场景中节点启动按钮显示隐藏标识
    currentTreeLevelId: '', // 当前层级id
    topologyTreeData: [] as any[], // 多层树结构数据
    currentTreeLevelDisplayContext: '', // 当前层的偏移量
    openLayer: false, // 场景中是否开启层节点
    model3DData: '',
  },
  setDialog(dialog: boolean) {
    this.state.dialog = dialog;
  },
  setCollapse(collapse: boolean) {
    this.state.collapse = collapse;
  },
  setDrawer(drawer: boolean) {
    this.state.drawer = drawer;
  },
  setToolbar(config: object) {
    this.state.toolbarConfig = Object.assign(
      {},
      this.state.toolbarConfig,
      config,
    );
  },
  setRoleAssets(roleAssets: boolean) {
    this.state.roleAssets = roleAssets;
  },
  setDefaultIcon(defaultIcon: Array<string>) {
    this.state.defaultIcon = defaultIcon;
  },
  setMaxCount(maxCount: number) {
    this.state.maxCount = maxCount;
  },
  setAnotherLayerNodeCount(anotherLayerNodeCount: number) {
    this.state.anotherLayerNodeCount = anotherLayerNodeCount;
  },
  setSystemType(sysType: object) {
    this.state.systemType = sysType;
  },
  setFullScreen(isFullScreen: boolean) {
    this.state.isFullScreen = isFullScreen;
  },
  setTheme(theme: string) {
    this.state.theme = theme;
  },
  setMenubar(menubar: Array<string>) {
    this.state.menubar = menubar;
  },
  setShowMenu(showMenu: boolean) {
    this.state.showMenu = showMenu;
  },
  setAllowStart(allowStart: boolean) {
    this.state.allowStart = allowStart;
  },
  setOpenLayer(openLayer: boolean) {
    this.state.openLayer = openLayer;
  },
  setTopologyTreeData(topologyTreeData: any) {
    this.state.topologyTreeData = topologyTreeData;
  },
  setCurrentTreeLevelId(currentTreeLevelId: any) {
    this.state.currentTreeLevelId = currentTreeLevelId;
  },
  setCurrentTreeLevelDisplayContext(currentTreeLevelDisplayContext: any) {
    this.state.currentTreeLevelDisplayContext = currentTreeLevelDisplayContext;
  },
  setModel3DData(model3DData: any) {
    this.state.model3DData = model3DData;
  },
};
export default PageStatus;
