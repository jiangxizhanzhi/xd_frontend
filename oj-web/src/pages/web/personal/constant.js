export const TYPE = {
  RATIONALE: 0, // 理论基础
  REAL_LOOPHOLES: 1, // 真实漏洞
  CAPTURE_FLAG: 2, // 夺旗解题
};
export const SUBMITSTATUS = {
  NOT_SUBMITTED: 0, // 未提交
  SUBMITTED_ERROR: 1, // 提交错误
  SUBMITTED_CORRECTLY: 2, // 提交正确
};

export const COLLECTION_TYPE = {
  //  0=理论题 1=漏洞题(暂时无用) 2=实操题 3=课程 4=课时
  RELATION: 0,
  CAPTURE_FLAG: 2,
  COURSE: 3,
  LESSON: 4,
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
