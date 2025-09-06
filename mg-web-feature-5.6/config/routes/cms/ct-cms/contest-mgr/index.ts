import ctExamMgr from './ct-exam-mgr';
import operationContestMgr from './operation-contest-mgr';
import flagContestMgr from './flag-contest-mgr';
import ctArenaMgr from './ct-arena-mgr';
import adContestMgr from './ad-contest-mgr';
import cfsContestMgr from './cfs-contest-mgr';
import awdpContestMgr from './awdp-contest-mgr';
import teamMgr from '../system-mgr/team-mgr';
import aiContestMgr from './ai-contest-mgr';
export default [
  {
    name: 'contest-mgr-folder',
    path: '',
    title: 'routes.contest-mgr-folder',
    meta: {
      iconfont: 'icon-paiming',
    },
    children: [
      ...ctArenaMgr,
      ...ctExamMgr,
      ...flagContestMgr,
      ...adContestMgr,
      ...operationContestMgr,
      ...cfsContestMgr,
      ...awdpContestMgr,
      ...aiContestMgr,
      // 战队
      ...teamMgr,
    ],
  },
];
