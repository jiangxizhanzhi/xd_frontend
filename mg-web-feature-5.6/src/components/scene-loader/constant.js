import { constant } from '@/utils/constant';

export const eventConst = constant({
  0: 'components.sceneLoader.event.default', //'默认',
  1: 'components.sceneLoader.event.init', //'初始化',
  2: 'components.sceneLoader.event.create', //'创建',
  3: 'components.sceneLoader.event.start', //'启动',
  4: 'components.sceneLoader.event.stop', //'停止',
  5: 'components.sceneLoader.event.reboot', //'重启',
  6: 'components.sceneLoader.event.pause', //'暂停',
  7: 'components.sceneLoader.event.recover', //'恢复',
  8: 'components.sceneLoader.event.snapshot', //'快照',
  9: 'components.sceneLoader.event.close', //'关闭',
  10: 'components.sceneLoader.event.modify', //'修改',
  11: 'components.sceneLoader.event.recreate', //'重建',
  12: 'components.sceneLoader.event.suspend', //'挂起',
  13: 'components.sceneLoader.event.resume', //'从挂起恢复',
});

export const statusConst = constant({
  0: 'components.sceneLoader.status.init', //'初始化',
  1: 'components.sceneLoader.status.start', //'开始',
  2: 'components.sceneLoader.status.ongoing', //'进行中',
  3: 'components.sceneLoader.status.paused', //'暂停',
  4: 'components.sceneLoader.status.complete', //'完成',
  5: 'components.sceneLoader.status.failed', //'失败',
});
