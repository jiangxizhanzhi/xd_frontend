import _ from 'lodash';
import Vue from 'vue';
import { getI18N } from '@cyber/helper';
/**
 * websocket更新拓扑数据sceneData.scene_config中topology和plugins的部分数据
 * @param data      ws推送的数据
 * @param progress  原进度条
 * @param stageProgress 阶段进度
 * @param sceneData 原场景数据
 */
export function handleWsData(data, progress, stageProgress, sceneData) {
  const scene = data.data.scene; /* data.type是'scene'时，此变量才有值 */

  /* 更新原scene_config.topology中的scene */
  if (data.type === 'scene') {
    !_.isEmpty(sceneData) &&
      sceneData.hasOwnProperty('scene_config') &&
      Vue.set(sceneData.scene_config.topology, 'scene', scene);
    if (progress && progress.hasOwnProperty('progressRate')) {
      progress.progressRate = scene?.progress_percentage;
    }
    if (progress && progress.hasOwnProperty('progressInfo')) {
      progress.progressInfo = getEventMessage(scene.event, scene.event_status);
    }
    stageProgress.stageList = scene?.stage_list;
    stageProgress.stageName = scene?.stage_name;
    stageProgress.stagePercentage = scene?.stage_percentage;
  }

  /* data.type是'scene'时，此变量才有值 */
  if (scene) {
    if (scene.event === 9) {
      return;
    } else if (
      (scene.event === 2 && scene.event_status === 4) ||
      (scene.event === 7 && scene.event_status === 4) ||
      (scene.event === 13 && scene.event_status === 4) ||
      (scene.event === 10 && scene.event_status === 4)
    ) {
      /* ws推送的数据中的2、4；7、4；13、4；10、4；组合表示场景启动成功 */
      if (progress) {
        progress.status = 'success';
      }
      return {
        showMask: false,
        showMaskBtn: false,
        showBtn: true,
        showProgress: false,
      };
    } else if (scene.event_status === 5) {
      /* ws推送的数据中的5表示启动失败 */
      if (progress) {
        progress.status = 'exception';
      }
      return {
        showMask: true,
        showMaskBtn: false,
        showBtn: true,
        showProgress: true,
      };
    } else {
      if (progress) {
        progress.status = undefined;
      }
      return {
        showMask: true,
        showMaskBtn: false,
        showBtn: false,
        showProgress: true,
      };
    }
  }
}

/**
 * 场景状态组合
 */
export function getEventMessage(event, event_status) {
  const Event = [
    getI18N().t('sceneLoader.event.default'),
    getI18N().t('sceneLoader.event.init'),
    getI18N().t('sceneLoader.event.create'),
    getI18N().t('sceneLoader.event.start'),
    getI18N().t('sceneLoader.event.stop'),
    getI18N().t('sceneLoader.event.reboot'),
    getI18N().t('sceneLoader.event.pause'),
    getI18N().t('sceneLoader.event.recover'),
    getI18N().t('sceneLoader.event.snapshoot'),
    getI18N().t('sceneLoader.event.close'),
    getI18N().t('sceneLoader.event.modify'),
  ];
  const EventStatus = [
    getI18N().t('sceneLoader.status.init'),
    getI18N().t('sceneLoader.status.start'),
    getI18N().t('sceneLoader.status.ongoing'),
    getI18N().t('sceneLoader.status.paused'),
    getI18N().t('sceneLoader.status.complete'),
    getI18N().t('sceneLoader.status.failed'),
  ];
  return `${getI18N().t('sceneLoader.scene')}${
    Event[event] ? Event[event] : getI18N().t('sceneLoader.active')
  }${
    EventStatus[event_status]
      ? EventStatus[event_status]
      : getI18N().t('sceneLoader.state')
  }`;
}

/**
 * 判断当前场景状态及更新编辑器的拓扑数据sceneData的scene_config
 * @param res 获取场景数据的接口返回值
 */
export function getSceneStatus(res) {
  let sceneStatus = {
    showMask: true /* 遮罩是否显示 */,
    showMaskBtn: true /* 启动场景按钮是否显示 */,
    showProgress: false /* 进度条是否显示 */,
    showBtn: false /* 关闭场景等按钮是否显示 */,
    sceneData: {} /* 编辑器需要的拓扑数据 */,
    /* 进度条 */
    progress: {
      status: undefined,
      progressRate: 0,
      progressInfo: '',
    },
    /* 5.4.1新加的阶段进度 */
    stageProgress: {
      stageList: [],
      stageName: '',
      stagePercentage: 0,
    },
  };
  /* scene_data为null就是未启动:优先判断scene_data */
  /* 未启动 */
  if (_.isEmpty(res.data.data.scene_data)) {
    sceneStatus.showMask = true; /* 遮罩显示 */
    sceneStatus.showMaskBtn = true; /* 启动场景显示 */
    /* 未启动时，直接取topo_data */
    sceneStatus.sceneData = {
      scene_config: _.cloneDeep(res.data.data.topo_data),
    };
  } else {
    const scene = _.get(res, 'data.data.scene_data.topology.scene');
    if (
      (scene.event === 2 && scene.event_status === 4) ||
      (scene.event === 7 && scene.event_status === 4) ||
      (scene.event === 13 && scene.event_status === 4) ||
      (scene.event === 10 && scene.event_status === 4)
    ) {
      /*2、4；7、4；13、4；10、4；组合表示场景启动成功 */
      sceneStatus.showMask = false;
      sceneStatus.showBtn = true;
    } else if (scene.event_status === 5) {
      /* 5；表示启动失败 */
      sceneStatus.showMask = true;
      sceneStatus.showMaskBtn = false;
      sceneStatus.showProgress = true;
      sceneStatus.showBtn = true;
      sceneStatus.progress.status = 'exception';
      sceneStatus.progress.progressRate = scene.progress_percentage
        ? scene.progress_percentage
        : 0;
      sceneStatus.progress.progressInfo = getEventMessage(
        scene.event,
        scene.event_status,
      );
      sceneStatus.stageProgress = {
        stageList: scene.stage_list,
        stageName: scene.stage_name,
        stagePercentage: scene.stage_percentage,
      };
    } else {
      /* 其他状态 */
      sceneStatus.showMask = true;
      sceneStatus.showMaskBtn = false;
      sceneStatus.showProgress = true;
      sceneStatus.progress.progressRate = scene.progress_percentage
        ? scene.progress_percentage
        : 0;
      sceneStatus.progress.progressInfo = getEventMessage(
        scene.event,
        scene.event_status,
      );
      sceneStatus.stageProgress = {
        stageList: scene.stage_list,
        stageName: scene.stage_name,
        stagePercentage: scene.stage_percentage,
      };
    }
    /* 更新编辑器需要的拓扑数据 */
    sceneStatus.sceneData = {
      scene_config: _.cloneDeep(res.data.data.scene_data),
    };
  }
  return sceneStatus;
}
