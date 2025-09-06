import { V, N, Constant } from '@/constants/base';

Constant.add({
  Missions: {
    MissionsType: {
      JUDGE: V(0, N('missions.judge')),
      RADIO: V(1, N('missions.radio')),
      MULTIPLE: V(2, N('missions.multiple')),
      FILL_IN_THE_BLANK: V(3, N('missions.fillBlank')),
      QUESTION_ANSWER: V(4, N('missions.questionsAnswer')),
      ATTACK: V(5, N('missions.attack')),
      DEFENSE: V(6, N('missions.defense')),
      FILE: V(7, N('missions.file')),
    },
  },
});

export default Constant;
