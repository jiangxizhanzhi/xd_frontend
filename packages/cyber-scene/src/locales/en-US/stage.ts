export default {
  staticRouterList: 'Static Router Table',
  networkConfig: 'Network Configuration',
  snmpCollection: 'SNMP Collection',
  info: 'Node Info',
  query: 'Query',
  oidValue: 'Value',
  oidType: 'Type',
  ipPort: 'IP Port',
  gateway: 'Gateway',
  intranetAddress: 'Intranet Address',
  externalNetworkAddress: 'Internet address',
  accessEnvironment: 'Access environment',
  noAccessInformation: 'No access information',
  restart: 'Restart',
  rebuild: 'Rebuild',
  shutdown: 'shutdown',
  shutup: 'shutup',
  saveSnapshot: 'Save Snapshot',
  snapshotHistory: 'History({count})',
  currentPageLogin: 'Current Page login',
  createSceneTemplate: 'Add Scene Template',
  templateName: 'Template name',
  placeInputTemplateName: 'Please enter a template name',
  templateDescribe: 'Template description',
  placeInputTemplateDescribe: 'Please enter a template description',
  chooseTemplate: 'Choose a template',
  closeScene: 'Shutdown',
  actualSize: 'Actual Size',
  pauseScene: 'Pause Scene',
  restoreScene: 'Recover Scene',
  noDataAvailable: 'No Data',
  nodeName: 'Node name',
  deviceType: 'Device Type',
  mirrorName: 'Mirror Name',
  addresses: 'Address Segment',
  ip: 'IP',
  routerList: 'Router Table',
  unSupportSystemToEdit:
    'The current node cannot be edited because it has no operating system type',
  unSupportCloudInitToEdit:
    'The current node does not support Cloud-init and cannot be edited',
  noAvailablePorts: 'The node has no available ports',
  supportNodeLimit:
    'The current topology supports {maxCount} nodes in maximum, and {currentCount} nodes already exist',
  supportTemplateNodeLimit:
    'The current topology supports {max} nodes in maximum. {current} nodes exist in the current topology, and {add} nodes exist in the template',
  supportFileNodeLimit:
    'The current topology supports {maxCount} nodes in maximum. {addCount} nodes exist in the file',
  connectionNotAllowed:
    'Sorry, direct connection is not supported between these two types of nodes.',
  connectionLayerNotAllowed:
    'Sorry, Neither of the two nodes belonging to the current layer support direct connectivity.',
  duplicateConnection:
    'Duplicate connections are not supported for the same node.',
  vmContainerConnectInternalNetwork:
    'Virtual machines and containers do not support connecting to multiple external networks.',
  entityRouterToSwitches: 'Physical routers can connect to switches',
  imageRouterToSwitchesOrExternalNetwork:
    'Mirror routers can connect switches to external networks',
  switchesToRouterOrFirewallOrTerminal:
    'Switches connect routers, firewalls, and terminal nodes',
  entityFirewallToSwitches: 'Physical firewalls can connect to switches',
  imageFirewallToSwitchesOrExternalNetwork:
    'Mirrored firewalls can connect switches and external networks',
  entityTerminalToSwitches: 'Physical devices can connect to switches',
  imageTerminalToSwitchesOrExternalNetwork:
    'Mirroring terminal devices can connect to switches and external networks',
  externalNetworkNotToEntity:
    'The external network cannot connect to the physical device',
  externalNetworkToDevices:
    'External networks can connect to mirrored routers, mirrored firewalls, and mirrored terminals',
  noNetworkCardAvailable: 'No available network card',
  noPortAvailable: 'has no available ports',
  deleteSuccess: 'Delete Succeed',
  operateSuccess: 'Operate Succeed',
  createSuccess: 'Create Succeed',
  createFailed: 'Create Failed',
  startScene: 'Start',
  sceneSupportNodesCount: 'A topology scene supports {count} nodes in maximum',
  prompt: 'Prompt',
  sureStartScene: 'Confirm to start scene?',
  labelIsOutRect: 'The text needs to be inside a rectangle',
  rectNameLen:
    'The length of the rectangular box name needs to be between 0-255',
  updateTopology: 'Edit scene',
  copyLimit: 'Sorry, the current device does not allow copying',
  deleteNodeLimit: 'Sorry, the current device does not allow deletion',
  deleteEdgeLimit: 'Sorry, the current edge does not allow deletion',
  assetsDeleteLimit:
    'Sorry, node deletion is not supported in the current mode',
  batchLimit: 'Sorry, batch operations are not allowed in the current mode',
  updateConnectionNotAllowed:
    'Sorry, direct connection is not supported between these two types of nodes in the current mode',
  updateNodeLimit: 'Sorry, the current device does not support dynamic editing',
  assetsEditLimit: 'Sorry, node editing is not supported in the current mode',
  confirmDeleteNode: 'Sure to delete the current device?',
  notStarted: 'Not yet started',
  // progressOptions: [
  //   'Planning resources',
  //   'Creating Networks',
  //   'Create gateway',
  //   'Create instance',
  //   'Deploy distributions',
  // ],
  search: 'search',
  exchange: 'exchange',
  exchangeAll: 'exchange all',
  firstLevel: 'First',
  unSupportLayer: 'Sorry, multilayer topology is not supported at this time',
  unSupportLayerTemplate:
    'Sorry, multilayer topology is not supported at this time',
  unSupportLayerImport:
    'Sorry, multilayer topology is not supported at this time',
  isNotEmptyLayerNode:
    'Sorry, the element within this layer is not empty and does not support the delete operation',
  deleteLayerEdgeLimit: 'Sorry, does not support the delete operation',
  updateDeleteNodeLimit:
    'Sorry, this node is associated with a layer node and does not support the delete operation',
};
