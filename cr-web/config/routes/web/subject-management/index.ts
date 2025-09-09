// 云计算资源场景
import cloudComputingResourceSubject from './cloud-computing-resource-subject';
// 云网络资源场景
import cloudNetworkResourceSubject from './cloud-network-resource-subject';
// 扫描探测攻击场景
import scanDetectAttackSubject from './scan-detect-attack-subject';
// 漏洞挖掘与利用场景
import vulnerabilityMiningExploitationSubject from './vulnerability-mining-exploitation-subject';
// 拒绝服务攻击场景
import denialServiceAttackSubject from './denial-service-attack-subject';
// 新型网络基础场景
import newNetworkBasicSubject from './new-network-basic-subject';
// 新型网络攻防场景
import newNetworkAttackDefenseSubject from './new-network-attack-defense-subject';
// 综合演训场景
import comprehensiveTrainingSubject from './comprehensive-training-subject';

// 场景管理
export const subjectManageRouter = {
  path: '',
  title: 'routes.subject-management',
  name: 'subject-management',
  meta: {
    auth: false,
  },
  children: [
    ...cloudComputingResourceSubject,
    ...cloudNetworkResourceSubject,
    ...scanDetectAttackSubject,
    ...vulnerabilityMiningExploitationSubject,
    ...denialServiceAttackSubject,
    ...newNetworkBasicSubject,
    ...newNetworkAttackDefenseSubject,
    ...comprehensiveTrainingSubject,
  ],
};
