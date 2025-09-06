import { V, N, Constant } from '../base';
Constant.add({
  User: {
    SuperAdmin: V(0, N('user.superAdmin')),
    Admin: V(1, N('user.admin')),
    Teacher: V(2, N('user.teacher')),
    GeneralUser: V(3, N('user.generalUser')),
  },
  NoticeType: {
    SystemNotice: V(1, N('notice.systemNotification')),
    other: V(0, N('notice.other')),
  },
  QuestionResourseType: {
    Exam: V(0, N('layout.navi.exam')), // 考试
    Practice: V(1, N('layout.navi.practice')), // 练习
  },
  Practice: {
    StatusType: {
      Solved: V(true, N('m.solved')), // 已解出
      Unresolved: V(false, N('m.unresolved')), // 未解出
    },
    QuestionType: {
      SingleChoice: V(0, N('m.singleChoice')), // 单选
      MultipleChoice: V(1, N('m.multipleChoice')), // 多选
      JudgmentQustion: V(2, N('m.judgmentQustion')), // 判断
      Completion: V(3, N('m.completion')), // 填空
      ShortAnswer: V(4, N('m.shortAnswer')), // 简答
    },
    Type: {
      Rationale: V(0, N('m.rationale')), // 理论基础
      RealLoopholes: V(1, N('m.realLoopholes')), // 真实漏洞
      CaptureFlag: V(2, N('m.captureFlag')), // 夺旗解题
    },
    SubmitStatus: {
      NotSubmitted: V(0, N('m.notSubmitted')), // 未提交
      SubmittedError: V(1, N('m.submittedError')), // 提交错误
      SubmittedCorrectly: V(2, N('m.submittedCorrectly')), // 提交正确
    },
  },
});

export default Constant;
