import theoryContest from './theory-contest';
import operationContest from './operation-contest';
import flagContest from './flag-contest';
import arena from './arena';
import attackDefenseContest from './attack-defense-contest';
import cfsContest from './cfs-contest';
import awdpContestMgr from './awdp-contest';
import aiContest from './ai-contest';
export default [
  {
    path: '',
    name: 'ct-contest-folder',
    title: 'routes.ct-contest-folder',
    children: [
      ...arena,
      ...theoryContest,
      ...flagContest,
      ...attackDefenseContest,
      ...operationContest,
      ...cfsContest,
      ...awdpContestMgr,
      ...aiContest,
    ],
  },
];
