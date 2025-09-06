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
  const scene = data.data.scene;

  // 更新场景状态
  if (data.type === 'scene') {
    Vue.set(sceneData.scene_config.topology, 'scene', scene);
    progress.progressRate = scene.progress_percentage;
    progress.progressInfo = getEventMessage(scene.event, scene.event_status);
    stageProgress.stageList = scene?.stage_list;
    stageProgress.stageName = scene?.stage_name;
    stageProgress.stagePercentage = scene?.stage_percentage;
  }
  if (scene) {
    if (scene.event === 9) {
      // TODO 不可以return出去任何东西
      return;
    } else if (scene.event === 2 && scene.event_status === 4) {
      progress.status = 'success';
      return {
        showMask: false,
        showBtn: true,
        showMaskBtn: false,
        showProgress: false,
      };
    } else if (scene.event === 6) {
      if (scene.event_status === 5) {
        progress.status = 'exception';
      } else {
        progress.status = undefined;
      }
      return {
        showMask: true,
        showBtn: true,
        showMaskBtn: false,
        showProgress: true,
      };
    } else if (scene.event === 7) {
      if (scene.event_status === 5) {
        progress.status = 'exception';
      } else {
        progress.status = undefined;
      }
      if (scene.event_status === 4) {
        return {
          showMask: false,
          showBtn: true,
          showMaskBtn: false,
          showProgress: false,
        };
      } else {
        return {
          showMask: true,
          showBtn: true,
          showMaskBtn: false,
          showProgress: true,
        };
      }
    } else if (scene.event_status === 5) {
      progress.status = 'exception';
      return {
        showMask: true,
        showBtn: true,
        showMaskBtn: false,
        showProgress: true,
      };
    }
  }
}

/**
 * 获取场景启动状态
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
 * 判断当前场景状态
 * @param res 接口返回值
 */
export function getSceneStatus(res) {
  let sceneStatus = {
    showMask: true,
    showMaskBtn: true,
    showProgress: false,
    showBtn: false,
    sceneData: {},
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
  // scene data为空就是未启动 优先获取scene_data 其次获取scene_config_data
  // 未启动
  if (_.isEmpty(res.scene_data)) {
    sceneStatus.showMask = true;
    sceneStatus.showMaskBtn = true;

    sceneStatus.sceneData = _.cloneDeep(res.scene_config_data);
  } else {
    const scene = _.get(res, 'scene_data.scene.topology.scene');
    // 2 4 启动完成
    if (scene.event === 2 && scene.event_status === 4) {
      sceneStatus.showMask = false;
      sceneStatus.showBtn = true;
    } else if (scene.event_status === 5) {
      // 启动出错
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
    } else if (scene.event === 6) {
      // 暂停状态
      sceneStatus.showBtn = true;
      sceneStatus.showMask = true;
      sceneStatus.showMaskBtn = false;
      sceneStatus.showProgress = true;
      sceneStatus.progress.status = undefined;
      sceneStatus.progress.progressRate = scene.progress_percentage
        ? scene.progress_percentage
        : 0;
      sceneStatus.progress.progressInfo = getEventMessage(
        scene.event,
        scene.event_status,
      );
    } else if (scene.event === 7) {
      // 恢复状态
      if (scene.event_status === 4) {
        sceneStatus.showMask = false;
      } else {
        sceneStatus.showMask = true;
      }
      sceneStatus.showBtn = true;
      sceneStatus.showMaskBtn = false;
      sceneStatus.showProgress = true;
      sceneStatus.progress.status = undefined;
      sceneStatus.progress.progressRate = scene.progress_percentage
        ? scene.progress_percentage
        : 0;
      sceneStatus.progress.progressInfo = getEventMessage(
        scene.event,
        scene.event_status,
      );
    } else {
      // 其他状态
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
    sceneStatus.sceneData = _.cloneDeep(res.scene_data);
  }
  return sceneStatus;
}
