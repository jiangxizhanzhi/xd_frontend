export const STATUSTYPE = {
  Solved: true, // 已解出
  Unresolved: false, // 未解答
};
export const THEORYSTATUSTYPE = {
  Tried: 0, // 尝试过
  Solved: 1, // 已解决
  NotStart: 2, // 未开始
};
export const QUESTIONTYPE = {
  SingleChoice: 0, // 单选
  MultipleChoice: 1, // 多选
  JudgmentQustion: 2, // 判断
  Completion: 3, // 填空
  ShortAnswer: 4, // 简答
};
export const TYPE = {
  Rationale: 0, // 理论基础
  RealLoopholes: 1, // 真实漏洞
  CaptureFlag: 2, // 夺旗解题
};
export const COMMENTYPE = {
  // 评论资源类型
  Course: 1, // 课程
  Lesson: 2, // 课时
  Practice: 3, // 夺旗习题
};

export const DIFFICULTY = {
  Primary: 0, // 初级
  Medium: 1, // 中级
  Advanced: 2, // 高级
};
export const SUBMITSTATUS = {
  NotSubmitted: 0, // 未提交
  SubmittedError: 1, // 提交错误
  SubmittedCorrectly: 2, // 提交正确
};

export const NOTETYPE = {
  Note: 1, // 笔记
  Report: 2, // 报告
};
export const RESOURCETYPE = {
  Course: 1, // 课程
  Lesson: 2, // 课时
  Practice: 3, // 练习
  CoursePractice: 4, //课后练习
};

export const SCENE_STATUS = {
  DELETED: 0, //'删除'
  NORMAL: 1, //'正常'
  PAUSE: 2, //'暂停'
  RECOVERY: 3, //'恢复'
};

export const COLLECTION_TYPE = {
  //  0=理论题 1=漏洞题(暂时无用) 2=实操题 3=课程 4=课时
  RELATION: 0,
  CAPTURE_FLAG: 2,
  COURSE: 3,
  LESSON: 4,
};

export const VOLUME_STATUS = {
  // 理论组卷记录 是否完成
  Finish: true,
  NoFinish: false,
};
