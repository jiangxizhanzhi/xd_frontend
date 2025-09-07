// 云计算资源场景
import cloudComputingResourceScene from './cloud-computing-resource-scene';
// 云网络资源场景
import cloudNetworkResourceScene from './cloud-network-resource-scene';
// 扫描探测攻击场景
import scanDetectAttackScene from './scan-detect-attack-scene';
// 漏洞挖掘与利用场景
import vulnerabilityMiningExploitationScene from './vulnerability-mining-exploitation-scene';
// 拒绝服务攻击场景
import denialServiceAttackScene from './denial-service-attack-scene';
// 新型网络基础场景
import newNetworkBasicScene from './new-network-basic-scene';
// 新型网络攻防场景
import newNetworkAttackDefenseScene from './new-network-attack-defense-scene';
// 综合演训场景
import comprehensiveTrainingScene from './comprehensive-training-scene'

// 场景管理
export const sceneManageRouter = {
  path: '',
  title: 'routes.scene-manage-folder',
  name: 'scene-manage-folder',
  meta: {
    iconfont: 'icon-tuopu',
  },
  children: [
    ...cloudComputingResourceScene,
    ...cloudNetworkResourceScene,
    ...scanDetectAttackScene,
    ...vulnerabilityMiningExploitationScene,
    ...denialServiceAttackScene,
    ...newNetworkBasicScene,
    ...newNetworkAttackDefenseScene,
    ...comprehensiveTrainingScene,
  ],
};
