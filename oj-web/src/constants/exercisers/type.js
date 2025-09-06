import { V, N, Constant } from '../base';
Constant.add({
  ExerType: {
    EXAM: V(0, N('理论基础')),
    CTF: V(1, N('真实漏洞')),
    CHECK: V(2, N('实践操作')),
  },
  ThemeType: {
    COURSE: V(1, N('课程')),
    LESSON: V(2, N('课时')),
    CHECK: V(3, N('实践操作')),
  },
  Diff: {
    INTRODUCTION: V(0, N('初级')),
    INCREASE: V(1, N('中级')),
    EXPERT: V(2, N('高级')),
  },
  TaskType: {
    SINGLE: V(0, N('单选')),
    MULTIPLE: V(1, N('多选')),
    JUDGE: V(2, N('判断')),
    BLANK: V(3, N('填空')),
    SHORTQUES: V(4, N('简答')),
    OPERATE: V(5, N('操作')),
  },
  SceneShow: {
    PRIVATE: V(1, N('私有')),
    SHARED: V(2, N('共享')),
  },
  Statistical: {
    StatisticalState: {
      HIDE: V(0, N('隐藏')),
      SHOW: V(1, N('显示')),
    },
  },
  Difficulty: {
    // 难度级别
    Advanced: V(3, N('m.advanced')),
    Medium: V(2, N('m.medium')),
    Primary: V(1, N('m.primary')),
  },
  Courses: {
    Share: {
      All: V(1, N('m.private')), // 分享全部
      Part: V(2, N('m.sharedTeacher')), // 自定义分享
    },
    ShareTeacher: {
      All: V(1, N('m.private')), // 已分享
      Part: V(0, N('m.sharedTeacher')), // 未分享
    },
    Auth: {
      All: V(1, N('m.Unauthorized')), // 授权全部
      Part: V(2, N('m.authorized')), // 自定义授权
    },
    Type: {
      Theory: V(0, N('m.theory')),
      LABSType: V(1, N('m.LABS')),
    },
    LearnType: {
      NoSet: V(0, N('m.noSet')), // 未设置
      Compulsory: V(2, N('m.compulsory')), // 必修
      Elective: V(1, N('m.elective')), // 选秀
    },
    Difficulty: {
      // 难度级别
      Advanced: V(2, N('m.advanced')),
      Medium: V(1, N('m.medium')),
      Primary: V(0, N('m.primary')),
    },
    Stage: {
      // 难度级别
      Advanced: V(2, N('m.advanced')),
      Medium: V(1, N('m.medium')),
      Primary: V(0, N('m.primary')),
    },
    LearnTime: {
      Five: V(5, N('m.five')), // 未设置
      Ten: V(10, N('m.ten')), // 必修
      Fifteen: V(15, N('m.fifteen')), // 选秀
      Thirty: V(30, N('m.thirty')), // 未设置
      Sixty: V(60, N('m.sixty')), // 必修
      OneHundredTwenty: V(120, N('m.oneHundredTwenty')), // 选秀
    },
    // 课程编排 tree 类型
    TreeNode: {
      Class: V(2, N('class')),
      Chapter: V(1, N('chapter')),
      Course: V(0, N('course')),
    },
  },
  Career: {
    Difficulty: {
      // 难度级别
      Advanced: V(3, N('m.advanced')),
      Medium: V(2, N('m.medium')),
      Primary: V(1, N('m.primary')),
    },
    Stages: {
      // 难度级别
      Advanced: V(2, N('m.advanced')),
      Medium: V(1, N('m.medium')),
      Primary: V(0, N('m.primary')),
    },
  },
  Exam: {
    // 考试状态
    All: V(-1, N('m.examStatus')),
    Process: V(0, N('m.examProcess')),
    Start: V(1, N('m.examNostart')),
    End: V(2, N('m.examEnd')),
  },
  Auth: {
    // 授权
    Authorized: V(1, N('Authorized')),
    Unauthorized: V(0, N('Unauthorized')),
  },
  UserInfo: {
    MANAGER: V(1, N('管理员')),
    TEACHER: V(2, N('教员')),
    STUDENT: V(3, N('学员')),
  },
  SplitScreen: {
    // 分屏
    one: V(1, N('m.oneScreen')),
    four: V(4, N('m.fourScreen')),
    nine: V(9, N('m.nineScreen')),
    twelve: V(12, N('m.twelveScreens')),
  },
  Scene: {
    Status: {
      DELETED: V(0, N('已删除')),
      INITIAL: V(1, N('初始')),
      RUNNING: V(2, N('运行中')),
      ON_EVENT: V(3, N('事件中')),
    },
    Event: {
      WAIT: V(0, N('等待中')),
      INITIATE: V(1, N('初始化')),
      CREATE: V(2, N('已创建')),
      START: V(3, N('已启动')),
      STOP: V(4, N('已关闭')),
      RESTART: V(5, N('已重启')),
      PAUSE: V(6, N('已暂停')),
      UNPAUSE: V(7, N('暂停恢复')),
      SNAPSHOT: V(8, N('快照中')),
      DELETE: V(9, N('已删除')),
      MODIFY: V(10, N('已修改')),
    },
    EventStatus: {
      START: V(0, N('开始')),
      IN_PROGRESS: V(1, N('进行中')),
      OVER: V(2, N('完成')),
      ABNORMAL: V(3, N('异常')),
    },
  },
  // 审计日志
  ModuleType: {
    TEAM: V(1, N('用户')),
    COURSER: V(2, N('课程')),
    CAREER: V(3, N('职业体系')),
    // SYS: V(4, N('系统管理')),
    EXAM: V(4, N('考试')),
    SCENES: V(5, N('场景管理')),
    EXERCISE: V(6, N('习题集管理')),
    CTF: V(7, N('实践操作')),
    BASIS: V(8, N('理论基础')),
    // BULLETIN: V(10, N('系统公告')),
    TEST: V(9, N('试卷')),
    // COMMENT: V(12, N('评论')),
  },
  StatusType: {
    CREATE: V(0, N('创建')),
    UPDATE: V(1, N('更新')),
    DELE: V(2, N('删除')),
    LOGOUT: V(3, N('登录登出')),
  },
  Status: {
    SUCCESS: V(0, N('成功')),
    FAIL: V(1, N('失败')),
  },
  Upgrade: {
    WAIT: V(0, N('等待')),
    SUCCESS: V(1, N('成功')),
    FAIL: V(2, N('失败')),
  },
});

export default Constant;
