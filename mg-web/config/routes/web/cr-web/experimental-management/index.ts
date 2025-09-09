// 云计算资源场景
import cloudComputingResourceExperimental from './cloud-computing-resource-experimental';
// 云网络资源场景
import cloudNetworkResourceExperimental from './cloud-network-resource-experimental';
// 扫描探测攻击场景
import scanDetectAttackExperimental from './scan-detect-attack-experimental';
// 漏洞挖掘与利用场景
import vulnerabilityMiningExploitationExperimental from './vulnerability-mining-exploitation-experimental';
// 拒绝服务攻击场景
import denialServiceAttackExperimental from './denial-service-attack-experimental';
// 新型网络基础场景
import newNetworkBasicExperimental from './new-network-basic-experimental';
// 新型网络攻防场景
import newNetworkAttackDefenseExperimental from './new-network-attack-defense-experimental';
// 综合演训场景
import comprehensiveTrainingExperimental from './comprehensive-training-experimental';

// 场景管理
export const experimentalManageRouter = {
  path: '',
  title: 'routes.experimental-management',
  name: 'experimental-management',
  children: [
    ...cloudComputingResourceExperimental,
    ...cloudNetworkResourceExperimental,
    ...scanDetectAttackExperimental,
    ...vulnerabilityMiningExploitationExperimental,
    ...denialServiceAttackExperimental,
    ...newNetworkBasicExperimental,
    ...newNetworkAttackDefenseExperimental,
    ...comprehensiveTrainingExperimental,
  ],
};
