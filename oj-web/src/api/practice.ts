import { request } from '@cyber/helper';
// 获取练习实操题列表消息
export function getCaptureFlagListApi(data) {
  return request.get('/oj/practice/operation/list', data, {
    baseURL: '/api/ojj',
  });
}
// 获取练习理论列表消息
export function getRationaleListApi(data) {
  return request.get('/oj/practice/theory/list', data, {
    baseURL: '/api/ojj',
  });
}

// 获取 当前进度
export function getCurrentProgressApi(data) {
  return request.get('/oj/practice/theory/progress', data, {
    baseURL: '/api/ojj',
  });
}

// 获取习题集 进度统计
export function getCurrentProgressFlagApi(data) {
  return request.get('/oj/practice/operation/progress', data, {
    baseURL: '/api/ojj',
  });
}

// 获取题目 方向
export function getCategoryListsApi(data) {
  return request.get('/oj/practice/category/list', data, {
    baseURL: '/api/ojj',
  });
}

// 理论题 统计错题、收藏、笔记数量
export function getStaticsTheory(data) {
  return request.get('/oj/practice/theory/statistics', data, {
    baseURL: '/api/ojj',
  });
}

// 获取最近5条练习记录
export function getFivePracticeRecord(data) {
  return request.get('/oj/practice/theory/record', data, {
    baseURL: '/api/ojj',
  });
}

// 自由组卷统计所有方向的做题进度
export function getCategoryTopicProgress(data) {
  return request.get('/oj/web/paper/category/progress', data, {
    baseURL: '/api/ojj',
  });
}

// 组卷
export function volumeSubmit(data) {
  return request.post('/oj/web/paper/create', data, {
    baseURL: '/api/ojj',
  });
}

// 理论-自由组卷  获取知识技能Top6
export function getKnowSkillTop6(data) {
  return request.get('/oj/web/paper/category_top6', data, {
    baseURL: '/api/ojj',
  });
}

// 获取实操题 所有 题号
export function getFlagQuestionBank(data) {
  return request.get('/oj/practice/operation/list/ids', data, {
    baseURL: '/api/ojj',
  });
}

// 获取更多 题集
export function getMoreWorkBook(data) {
  return request.get('/oj/practice/set/more_set', data, {
    baseURL: '/api/ojj',
  });
}

// 获取习题集详情
export function getWorkBookDetail(data) {
  return request.get('/oj/practice/set/detail', data, {
    baseURL: '/api/ojj',
  });
}

// 获取 笔记详情
export function getNoteDetail(data) {
  return request.get('/oj/note', data, {
    baseURL: '/api/ojj',
  });
}
// 提交 笔记
export function postNoteSave(data) {
  return request.post('/oj/note', data, {
    baseURL: '/api/ojj',
  });
}

// 获取最近5条组卷记录
export function getVolumeFive(data) {
  return request.get('/oj/web/paper/record', data, {
    baseURL: '/api/ojj',
  });
}

// 组卷页面--试卷概要
export function getPaperSummary(data) {
  return request.get('/oj/web/paper/summary', data, {
    baseURL: '/api/ojj',
  });
} // 组卷页面--题目详情
export function getPaperTopicDetail(data) {
  return request.get('/oj/web/paper/practice_detail', data, {
    baseURL: '/api/ojj',
  });
}

// 组卷页面--提交单个题目答案
export function submitPaperTopicAnswer(data) {
  return request.post('/oj/web/paper/submit_answer', data, {
    baseURL: '/api/ojj',
  });
}

// 组卷页面 -- 收藏 取消收藏
export function collectionPaperTopic(data) {
  return request.post('/oj/web/paper/practice_collection', data, {
    baseURL: '/api/ojj',
  });
}

// 组卷页面 -- 交卷
export function submitPaper(data) {
  return request.get('/oj/web/paper/submit_paper', data, {
    baseURL: '/api/ojj',
  });
}

// 组卷记录列表页
export function getRecordList(data) {
  return request.get('/oj/web/paper/record_summary', data, {
    baseURL: '/api/ojj',
  });
}
// 组卷记录-- 再做一次
export function againVolume(data) {
  return request.get('/oj/web/paper/practice_again', data, {
    baseURL: '/api/ojj',
  });
}

// 组卷详情页面---获取组卷详情信息
export function getVolumeDetail(data) {
  return request.get('/oj/web/paper/record_detail', data, {
    baseURL: '/api/ojj',
  });
}

// 实操题 统计 收藏、笔记数量
export function getStaticsFlag(data) {
  return request.get('/oj/practice/operation/statistics', data, {
    baseURL: '/api/ojj',
  });
}

// 实操  获取知识技能Top6
export function getFlagKnowSkillTop6(data) {
  return request.get('/oj/practice/operation/category_top6', data, {
    baseURL: '/api/ojj',
  });
}

// 实操题 获取最近5条解出记录
export function getFlagResolvedFive(data) {
  return request.get('/oj/practice/operation/record', data, {
    baseURL: '/api/ojj',
  });
}

// 实操题 获取所有解出记录
export function getFlagResolvedAll(data) {
  return request.get('/oj/practice/operation/all_record', data, {
    baseURL: '/api/ojj',
  });
}
// 实操题 获取解题记录题目id列表
export function getFlagResolvedIdList(data) {
  return request.get('/oj/practice/operation/record_all_id', data, {
    baseURL: '/api/ojj',
  });
}

// 实操题 获取知识点列表数据
export function getKnowledgeList(data) {
  return request.get('/oj/practice/operation/knowledge/list', data, {
    baseURL: '/api/ojj',
  });
}

// cms 实操题 获取知识点列表数据
export function getKnowledgeListCms(data) {
  return request.get('/oj/admin/practice/operation/knowledge/list', data, {
    baseURL: '/api/ojj',
  });
}

// 理论题 获取相关好题记录top5
export function relevantTopics(data) {
  return request.get('/oj/practice/theory/listTop5', data, {
    baseURL: '/api/ojj',
  });
}

// 理论题 获取最近答题记录top5
export function tempRecentTopics(data) {
  return request.get('/oj/practice/theory/solved/top5', data, {
    baseURL: '/api/ojj',
  });
}
