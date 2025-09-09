// 云计算资源场景
import cloudComputingResourceSubject from './cloud-computing-resource-subject-full';
// 云网络资源场景
import cloudNetworkResourceSubject from './cloud-network-resource-subject-full';
// 扫描探测攻击场景
import scanDetectAttackSubject from './scan-detect-attack-subject-full';
// 漏洞挖掘与利用场景
import vulnerabilityMiningExploitationSubject from './vulnerability-mining-exploitation-subject-full';
// 拒绝服务攻击场景
import denialServiceAttackSubject from './denial-service-attack-subject-full';
// 新型网络基础场景
import newNetworkBasicSubject from './new-network-basic-subject-full';
// 新型网络攻防场景
import newNetworkAttackDefenseSubject from './new-network-attack-defense-subject-full';
// 综合演训场景
import comprehensiveTrainingSubject from './comprehensive-training-subject-full';

// 场景管理
export default [
  ...cloudComputingResourceSubject,
  ...cloudNetworkResourceSubject,
  ...scanDetectAttackSubject,
  ...vulnerabilityMiningExploitationSubject,
  ...denialServiceAttackSubject,
  ...newNetworkBasicSubject,
  ...newNetworkAttackDefenseSubject,
  ...comprehensiveTrainingSubject,
];
