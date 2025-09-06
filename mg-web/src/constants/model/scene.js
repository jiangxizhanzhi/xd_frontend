import _ from 'lodash';
import { V, N, Constant } from '@/constants/base';

Constant.add({
  SceneConfig: {
    Type: {
      TEMPLATE: V(0, N('模板')),
      NORMAL: V(1, N('通用')),
    },
  },
  Scene: {
    Status: {
      DELETED: V(0, N('已删除')),
      INITIAL: V(1, N('初始')),
      RUNNING: V(2, N('运行中')),
      ON_EVENT: V(3, N('事件中')),
    },
    Event: {
      WAIT: V(0, N('event_list.wait')),
      INITIATE: V(1, N('event_list.initiate')),
      CREATE: V(2, N('event_list.create')),
      START: V(3, N('event_list.start')),
      STOP: V(4, N('event_list.stop')),
      RESTART: V(5, N('event_list.restart')),
      PAUSE: V(6, N('event_list.pause')),
      UNPAUSE: V(7, N('event_list.unpause')),
      SNAPSHOT: V(8, N('event_list.snapshot')),
      DELETE: V(9, N('event_list.delete')),
      MODIFY: V(10, N('event_list.modify')),
    },
    EventStatus: {
      START: V(0, N('开始')),
      IN_PROGRESS: V(1, N('进行中')),
      OVER: V(2, N('完成')),
      ABNORMAL: V(3, N('异常')),
    },
  },
  SceneTerminal: {
    Status: {
      DELETED: V(0, N('已删除')),
      INITIAL: V(1, N('初始')),
      RUNNING: V(2, N('运行中')),
      ON_EVENT: V(3, N('事件中')),
    },
    Event: {
      WAIT: V(0, N('等待')),
      INITIATE: V(1, N('初始化')),
      CREATE: V(2, N('创建')),
      START: V(3, N('启动')),
      STOP: V(4, N('停止')),
      RESTART: V(5, N('重启')),
      PAUSE: V(6, N('暂停')),
      UNPAUSE: V(7, N('暂停恢复')),
      SNAPSHOT: V(8, N('快照')),
      DELETE: V(9, N('删除')),
    },
    EventStatus: {
      START: V(0, N('开始')),
      IN_PROGRESS: V(1, N('进行中')),
      OVER: V(2, N('完成')),
      ABNORMAL: V(3, N('异常')),
    },
    ReviewStatus: {
      WAIT: V(0, N('待评估')),
      ISSUED: V(11, N('已下发')),
      SUCCESS: V(1, N('成功')),
      FAIL: V(2, N('失败')),
      REJECT: V(3, N('驳回')),
    },
  },
  Flow: {
    Flow: {
      BackgroundFlow: V(0, N('traffic.staticTraffic')),
      AttackFlow: V(1, N('traffic.dynamicTraffic')),
      FlowScheme: V(2, N('traffic.scheme')),
    },
    RunType: {
      Serial: V(1, N('trafficSchemeMode.SERIAL')),
      Parallel: V(2, N('trafficSchemeMode.PARALLEL')),
    },
    Category: {
      AllCategory: V(1, N('traffic.allCategories')),
    },
  },
  Device: {
    Role: {
      NETWORK: V(1, N('device.network')),
      GATEWAY: V(2, N('device.gateway')),
      TERMINAL: V(3, N('device.terminal')),
    },
    ImageType: {
      VM: V('vm', N('device.vm')),
      CONTAINER: V('container', N('device.docker')),
      ENTITY: V('entity', N('device.real')),
    },

    SystemArchitecture: {
      BIT_32: V('32', N('device.BIT_32')),
      BIT_64: V('64', N('device.BIT_64')),
      OTHER: V('other', N('device.other')),
    },
    Language: {
      CN: V('cn', N('中文（简体）')),
      TC: V('tc', N('中文（繁體）')),
      EN: V('en', N('English')),
      FR: V('fr', N('Français')),
      RU: V('ru', N('русский')),
      JA: V('ja', N('日本語')),
      KO: V('ko', N('한국어')),
      VI: V('vi', N('Tiếng Việt')),
      AR: V('ar', N('العربية')),
      OTHER: V('other', N('Other')),
    },

    ImageStatus: {
      NOT_APPLY: V(0, N('device.notApply')),
      CREATING: V(1, N('device.saving')),
      CREATED: V(2, N('device.saved')),
      ERROR: V(3, N('device.error')),
    },
  },
  DeviceService: {
    Category: {
      ANALYTICS: V('a', N('device.Analytics')),
      APPLICATION_FRAMEWORKS: V('b', N('device.ApplicationFrameworks')),
      APPLICATION_INFRASTRUCTURE: V('c', N('device.ApplicationInfrastructure')),
      APPLICATION_SERVICES: V('d', N('device.ApplicationServices')),
      BASE_IMAGES: V('e', N('device.BaseImages')),
      DATABASES: V('f', N('device.Databases')),
      DEVOPS_TOOLS: V('g', N('device.DevOpsTools')),
      FEATURED_IMAGES: V('h', N('device.FeaturedImages')),
      MESSAGING_SERVICES: V('i', N('device.MessagingServices')),
      OPERATING_SYSTEMS: V('j', N('device.OperatingSystems')),
      PROGRAMMING_LANGUAGES: V('k', N('device.ProgrammingLanguages')),
      SECURITY: V('l', N('device.Security')),
      STORAGE: V('m', N('device.Storage')),
    },
    DockerParamType: {
      ENV: V('env', N('device.environmentVariable')),
      CMD: V('cmd', N('device.commandParam')),
      PORT: V('port', N('device.portMapping')),
    },
    Status: {
      NORMAL: V(1, N('service.normal')),
      UPLOADING: V(2, N('service.uploading')),
      ERROR: V(3, N('service.error')),
    },
    DeployType: {
      INSTALLER: V(1, N('device.windowsService')),
      DOCKER: V(2, N('device.dockerService')),
    },
  },
});

export default Constant;
