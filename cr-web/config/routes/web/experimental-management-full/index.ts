// 云计算资源场景
import cloudComputingResourceExperimental from './cloud-computing-resource-experimental-full';
// 云网络资源场景
import cloudNetworkResourceExperimental from './cloud-network-resource-experimental-full';
// 扫描探测攻击场景
import scanDetectAttackExperimental from './scan-detect-attack-experimental-full';
// 漏洞挖掘与利用场景
import vulnerabilityMiningExploitationExperimental from './vulnerability-mining-exploitation-experimental-full';
// 拒绝服务攻击场景
import denialServiceAttackExperimental from './denial-service-attack-experimental-full';
// 新型网络基础场景
import newNetworkBasicExperimental from './new-network-basic-experimental-full';
// 新型网络攻防场景
import newNetworkAttackDefenseExperimental from './new-network-attack-defense-experimental-full';
// 综合演训场景
import comprehensiveTrainingExperimental from './comprehensive-training-experimental-full';

// 场景管理
export default [
  ...cloudComputingResourceExperimental,
  ...cloudNetworkResourceExperimental,
  ...scanDetectAttackExperimental,
  ...vulnerabilityMiningExploitationExperimental,
  ...denialServiceAttackExperimental,
  ...newNetworkBasicExperimental,
  ...newNetworkAttackDefenseExperimental,
  ...comprehensiveTrainingExperimental,
];
