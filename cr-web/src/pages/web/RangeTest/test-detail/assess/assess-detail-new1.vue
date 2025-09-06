<template>
  <div class="assess-detail">
    <!-- 1.异常信息展示 -->
    <div class="assess-detail-errorInfo" v-if="status === '4' && isShow">
      <div class="close" @click="closeFn">
        <cb-iconfont
          type="icon-guanbi"
          color="var(--neutral-color-7)"
        ></cb-iconfont>
      </div>

      <div>
        <span>
          <cb-iconfont
            type="icon-jinggao1"
            color="var(--orange-color)"
          ></cb-iconfont
        ></span>
        <span class="abnormal_title">{{ $t('assessment.someAbnormal') }}</span>
        <div
          style="
            white-space: pre-wrap;
            font-size: 14px;
            margin-top: 8px;
            padding-left: 24px;
            color: var(--neutral9);
          "
          v-html="message_error"
        ></div>
      </div>
    </div>
    <!-- 2.评估名称描述时间等展示 -->
    <div class="assess-detail-scoreInfo">
      <!-- 分数占比图 -->
      <div class="score-div">
        <score :scoreData="scores"></score>
      </div>
      <div class="content-div">
        <div class="name" :title="this.name">{{ name }}</div>
        <div style="font-size: 14px">
          <p>
            {{ $t('assessment.assessStage') }}<span>:</span> &nbsp;<span>{{
              stage
            }}</span>
          </p>

          <p style="padding: 4px 0px">
            {{ $t('assessment.assessTime') }}<span>:</span>&nbsp;&nbsp;<span>{{
              eval_time
            }}</span>
          </p>
          <!-- 评估描述展开收起-->
          <div class="desc-content">
            <div class="desc-content">
              {{ $t('assessment.assessDesc') }}<span>:</span>
            </div>
            <div>
              <expand-text
                v-if="this.description"
                :text="this.description"
              ></expand-text>
              <span
                v-else
                :class="
                  getI18Nn().locale === 'en-US' ? 'no-content-en' : 'no-content'
                "
                >-</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="button-div">
        <cb-button
          button-type="export"
          hollow
          @click="exportReport"
        ></cb-button>
      </div>
    </div>

    <!-- 3.指标类内容展示 -->
    <div class="assess-detail-wap">
      <div
        class="adw-left cyber-scroll-bar"
        style="height: calc(100vh - 320px); overflow: auto"
      >
        <cb-tree
          ref="my-tree"
          :data="treeData"
          node-key="resource_id"
          @node-click="handleNodeClick"
          :props="treeDefaultProps"
          default-expand-all
          :expand-on-click-node="false"
          :highlight-current="true"
        >
          <div
            class="custom-tree-node"
            slot-scope="{ node, data }"
            :title="node.label"
          >
            <div class="node-data">{{ node.label }}</div>
            <div
              class="score"
              style="margin-left: 8px; margin-right: 8px; margin-top: 3px"
              v-if="data.score === undefined"
            ></div>
            <div
              class="score"
              style="margin-left: 8px; margin-right: 8px; margin-top: 3px"
              v-else
            >
              {{ data.score + '%' }}
            </div>
          </div>
        </cb-tree>
      </div>
      <div
        class="adw-right cyber-scroll-bar"
        style="height: calc(100vh - 320px); overflow: auto"
      >
        <div class="adw-right-top">
          <div v-if="treeLevel <= 4">
            <!-- 一级右侧title展示 -->
            <!-- 1234级展示 -->
            <div class="titles">
              <div>
                <span
                  :title="item.name"
                  v-for="(item, index) in breadcrumbTopData"
                  :key="index"
                  ><span
                    :class="
                      index !== breadcrumbTopData.length - 1
                        ? 'title-style'
                        : 'last-title-style'
                    "
                    >{{ item.name }}</span
                  ><span
                    class="symbol-style"
                    v-if="index !== breadcrumbTopData.length - 1"
                    >></span
                  ></span
                >
              </div>
            </div>

            <vue2-org-tree
              :data="orgTreeData"
              :horizontal="true"
              :props="{
                label: 'name',
                expand: 'expand',
                children: 'children',
              }"
            />
          </div>
          <div v-else>
            <div class="adw-right-top-title">
              <div class="logo-div">
                <!-- 右侧上方五级title展示 -->
                <div>
                  <span
                    :title="item.name"
                    v-for="(item, index) in breadcrumbTopData"
                    :key="index"
                    ><span
                      :class="
                        index !== breadcrumbTopData.length - 1
                          ? 'title-style'
                          : 'last-title-style'
                      "
                      >{{ item.name }}</span
                    ><span
                      class="symbol-style"
                      v-if="index !== breadcrumbTopData.length - 1"
                      >></span
                    ></span
                  >
                </div>
              </div>
            </div>
            <ul class="adw-right-five-data">
              <!-- //格式化算法 -->
              <li class="five-content">
                <div v-if="!!levelFiveData.format_algorithm">
                  <span class="five-title"
                    >{{ $t('assessment.formatAlgorithm') }}:
                    {{ levelFiveData.format_algorithm.name }}</span
                  >
                  <span class="go-detail" @click="goDetail(1)">{{
                    $t('assessment.checkDetail')
                  }}</span>
                </div>
                <div
                  style="margin-top: 8px"
                  v-if="!!levelFiveData.format_algorithm"
                >
                  <!-- params是个数组对象 -->
                  <span
                    class="title-content"
                    v-for="(item, key) in levelFiveData.format_algorithm.params"
                  >
                    <span
                      class="one-title"
                      :title="item.param_name + ':' + item.default_value"
                      >{{ item.param_name }}:{{ item.default_value }}
                    </span>
                    <br v-if="(key + 1) % 2 === 0" />
                  </span>
                </div>
              </li>
              <!-- 模型匹配算法 -->
              <li class="five-content two-li">
                <div v-if="!!levelFiveData.match_algorithm">
                  <span
                    >{{ $t('assessment.modelMatchAlgorithm') }}:
                    {{ levelFiveData.match_algorithm.name }}</span
                  >
                  <span class="go-detail" @click="goDetail(2)">{{
                    $t('assessment.checkDetail')
                  }}</span>
                </div>
                <div
                  style="margin-top: 8px"
                  v-if="!!levelFiveData.format_algorithm"
                >
                  <span
                    class="title-content"
                    v-for="(item, key) in levelFiveData.match_algorithm.params"
                  >
                    <span
                      class="one-title"
                      :title="item.param_name + ':' + item.default_value"
                      >{{ item.param_name }}:{{ item.default_value }}
                    </span>
                    <br v-if="(key + 1) % 2 === 0" />
                  </span>
                </div>
              </li>
              <!-- 评分算法 -->
              <li class="five-content">
                <div v-if="!!levelFiveData.mark_algorithm">
                  <span
                    >{{ $t('assessment.ScoringAlgorithm') }}:
                    {{ levelFiveData.mark_algorithm.name }}</span
                  >
                  <span class="go-detail" @click="goDetail(3)">{{
                    $t('assessment.checkDetail')
                  }}</span>
                </div>
                <div
                  style="margin-top: 8px"
                  v-if="!!levelFiveData.format_algorithm"
                >
                  <span
                    class="title-content"
                    v-for="(item, key) in levelFiveData.mark_algorithm.params"
                  >
                    <span
                      class="one-title"
                      :title="item.param_name + ':' + item.default_value"
                      >{{ item.param_name }}:{{ item.default_value }}
                    </span>
                    <br v-if="(key + 1) % 2 === 0" />
                  </span>
                </div>
              </li>
            </ul>
            <!-- // 点击查看详情的弹框-->
            <detail-dialog
              @closeDialog="handleCloseDetail"
              :levelFiveValue="levelFiveData"
              :visibleVal="visibleValue"
              :detailIndex="dataNumber"
            ></detail-dialog>
          </div>
        </div>
        <div class="adw-right-bottom">
          <div class="adw-right-bottom-title">
            <div class="logo-div">
              <!-- 右侧下方图表的title,1-5级展示 -->
              <div>
                <span
                  :title="item.name"
                  v-for="(item, index) in breadcrumbBottomData"
                  :key="index"
                  ><span
                    :class="
                      index !== breadcrumbTopData.length - 1
                        ? 'title-style'
                        : 'last-title-style'
                    "
                    >{{ item.name }}</span
                  ><span
                    class="symbol-style"
                    v-if="index !== breadcrumbTopData.length - 1"
                    >></span
                  ></span
                >
              </div>
            </div>
            <div class="adw-right-bottom-content">
              <!-- 图表内容区域 -->
              <div>
                <!-- 每一级ideveryId -->
                <assess-chart v-if="everyId" :index-id="everyId"></assess-chart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue2OrgTree from './components/org-tree/index.js';
import { getI18N } from '@cyber/helper';
import AssessChart from './components/assess-chart1.vue';
import backImg from './image/back.png';
import Score from './components/score.vue';
import DetailDialog from './components/detail-dialog.vue';
import ExpandText from './components/expand-text.vue';
export default {
  name: 'Home',
  components: {
    Vue2OrgTree,
    Score,
    AssessChart,
    DetailDialog,
    ExpandText,
  },
  data() {
    return {
      everyId: '',
      dataNumber: 0,
      visibleValue: false,
      levelFiveData: {},
      backImg,
      isShow: true,
      message_error: '',
      name: '',
      description: '',
      eval_time: '',
      stage: '', //时间阶段
      scores: '', //分数

      treeDefaultProps: {
        children: 'children',
        label: 'name',
      },
      treeLevel: 1,
      treeData: [],
      orgTreeData: {},
      breadcrumbTopData: [], //右侧思维导图面包屑
      breadcrumbBottomData: [], //右侧图标标题
      orgTreeTitle: '',
      thirdId: '',
    };
  },
  created() {
    // 评估详情请求
    this.status = this.$route.query.status;
    this.detail_id = this.$route.params.templateId; //detail_id /template_id
    this.task_id = this.$route.params.task_id_new; //task_id
    //请求详情接口数据
    this.$request
      .get(
        '/cr/eval/record/result',
        { resource_id: this.$route.params.resource_id },
        { baseURL: '/api/ojj' },
      )
      .then((res) => {
        //信息展示
        this.message_error = res.data.data.message;
        this.name = res.data.data.name;
        this.description = res.data.data.description;
        this.eval_time = res.data.data.eval_time;
        this.scores = String(res.data.data.score);
        //树结构
        // this.treeData = res.data.data.indexes;
        //请求请求左侧树数据
        const resData = res.data.data.indexes;
        let dataLevel = this.arrayTreeAddLevel(resData);
        //取第一个三级id
        this.thirdId = dataLevel[0]?.children[0]?.children[0]?.resource_id;

        //获取一级id,进入页面传给
        this.everyId = dataLevel[0].resource_id;
        //生成左侧树
        this.treeData = dataLevel;

        //默认导图一级的面包屑title
        this.breadcrumbTopData = [dataLevel[0]];
        //默认图表一级面包屑
        this.breadcrumbBottomData = [dataLevel[0]];

        //设置title
        // this.orgTreeTitle = dataLevel[0].name;
        //初始化获取思维导图数据一级数据

        this.getMindData(res.data.data.indexes[0].resource_id);

        const end_time = res.data.data.end_time;
        const start_time = res.data.data.start_time;
        this.$request
          .get(
            '/cr/eval/task/time_nodes',
            {
              template_id: this.detail_id,
              task_id: this.task_id,
            },
            { baseURL: '/api/ojj' },
          )
          .then((res) => {
            const timeData = res.data.data.data;
            const obj_start_time = this.arrFindObj(
              timeData,
              'end_time',
              start_time,
            );
            const obj_end_time = this.arrFindObj(
              timeData,
              'end_time',
              end_time,
            );
            this.stage = `${obj_start_time.title} ${start_time} 至 ${obj_end_time.title} ${end_time}`;
          });
      });

    //获取评估阶段数据
  },
  methods: {
    getI18Nn() {
      return getI18N();
    },
    exportReport() {
      this.$request
        .binaryDownload(
          'get',
          '/cr/eval/record/train2pdf',
          {
            resource_id: this.$route.params.resource_id,
            task_id: this.task_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {});
    },
    //handleClosedetail
    handleCloseDetail(data) {
      this.visibleValue = data;
    },
    //五级右侧查看详情
    goDetail(data) {
      this.dataNumber = data;
      this.visibleValue = true;
    },
    // 查找三级id方法
    findThridId(treeData, data, node) {
      const breadcrumbData = this.findParentNode(treeData, data.resource_id);
      let levelThridId = '';
      switch (node.level) {
        case 1:
        case 2:
          levelThridId = treeData[0]?.children[0]?.children[0]?.resource_id;
          break;
        case 3:
        case 4:
        case 5:
          levelThridId = breadcrumbData[2].resource_id;
          break;
        default:
          break;
      }
      return levelThridId;
    },
    //数组寻找某个对象
    arrFindObj(data, key, time) {
      return data.find((item) => {
        return item[key] === time;
      });
    },

    getI18Nn() {
      return getI18N();
    },
    //关闭异常信息
    closeFn() {
      this.isShow = false;
    },
    //点击左侧树,处理右侧思维导图数据
    convertData(origin, dest) {
      const keep = ['resource_id', 'name', 'score'];
      if (
        origin.algorithm_name &&
        origin.algorithm_id &&
        origin.children.length
      ) {
        keep.forEach((item) => {
          dest[item] = origin[item];
          dest.children = [
            {
              name: origin.algorithm_name,
              children: origin.children.map((item) => {
                return this.convertData(item, {});
              }),
            },
          ];
        });
        return dest;
      } else {
        keep.forEach((item) => {
          dest[item] = origin[item];
          dest.children = Array.isArray(origin.children)
            ? origin.children.map((item) => {
                return this.convertData(item, {});
              })
            : [];
        });
        return dest;
      }
    },
    //请求右侧思维导图接口封装
    getMindData(indexId) {
      //请求详情接口数据
      this.$request
        .get(
          '/cr/eval/record/result/index',
          { record_id: this.$route.params.resource_id, index_id: indexId },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.orgTreeData = this.arrayTreeAddLevel([
            this.convertData(res.data.data, {}),
          ])[0];
        });
    },

    //点击左侧树节点
    handleNodeClick(data, node) {
      // console.log(data,data.resource_id, 'data11111');
      //获取每一级id
      this.everyId = data.resource_id;
      this.treeLevel = node.level;
      if (node.level === 5) {
        // 请求右侧上方五级数据
        this.$request
          .get(
            '/cr/eval/record/result/variable',
            { variable_id: data.resource_id },
            { baseURL: '/api/ojj' },
          )
          .then((res) => {
            this.levelFiveData = res.data.data;
          });
      }

      //设置title
      this.breadcrumbTopData = this.findParentNode(
        this.treeData,
        data.resource_id,
      );
      //获取三级id
      this.thirdId = this.findThridId(this.treeData, data, node);

      this.breadcrumbBottomData = this.findParentNode(
        this.treeData,
        data.resource_id,
      );
      //请求5 级数据,id:data.resource_id
      // 等级不为5的时候,1234级请求
      if (node.level !== 5) {
        this.getMindData(data.resource_id);
      }
    },
    //查找当前节点的所有父级节点
    findParentNode(data, id) {
      // 初始化所需数据
      let firstParentObj = {}; // 记录直系父级的名称和id即接口要传的数据
      let parentObj = []; // 记录所有的父级ids
      let parentIdsQueue = []; // 记录排队的
      // 将树放到排队系列
      parentIdsQueue = JSON.parse(JSON.stringify(data));
      // 开始遍历排队的树
      while (parentIdsQueue.length) {
        //抽取第一个排队的数据
        let item = parentIdsQueue.shift();
        let { children } = item;
        if (item.resource_id === id) {
          // 第一层就找到了
          if (!item.parentArr) {
            firstParentObj = {
              resource_id: item.resource_id,
              name: item.name,
            };
            parentObj = [item];
          } else {
            // 获取当前节点的parentArr
            let len = item.parentArr.length;
            firstParentObj = item.parentArr[len - 1];
            item.parentArr.forEach((a) => {
              parentObj.push(a);
            });
            parentObj.push(item);
          }
          // 结束遍历
          parentIdsQueue = [];
          break;
        } else if (children && children.length) {
          let len = children.length;
          for (let i = len - 1; i >= 0; i--) {
            // 新建一个数组用于记录它的父亲节点
            children[i].parentArr = [];
            // 把它的历史父亲节点们先放入
            if (item.parentArr) {
              children[i].parentArr = children[i].parentArr.concat(
                item.parentArr,
              );
            }
            // 再放入当前的父亲节点
            children[i].parentArr.push({
              resource_id: item.resource_id,
              name: item.name,
            });
            // 加入到排队序列中
            parentIdsQueue.unshift(children[i]);
          }
        }
      }
      return parentObj;
    },
    //给树增加level
    arrayTreeAddLevel(array, levelName = 'level', childrenName = 'children') {
      if (!Array.isArray(array)) return [];
      const recursive = (array, level = 0) => {
        level++;
        return array.map((v) => {
          v[levelName] = level;
          const child = v[childrenName];
          if (child && child.length) recursive(child, level);
          return v;
        });
      };
      return recursive(array);
    },
    //更新树
    updataNode(tree, curKey, keyField) {
      for (const node of tree) {
        if (node[keyField] === curKey) {
          node.indexes = node.children;
          delete node.children;
        }
        if (node.children && node.children.length) {
          this.updataNode(node.children, curKey, keyField);
        }
      }
      return tree;
    },
  },
};
</script>
<style scoped lang="scss">
.assess-detail {
  width: 100%;
  .assess-detail-errorInfo {
    width: 100%;
    width: 100%;
    margin-bottom: 16px;
    background: var(--orange-color-2);
    padding: 16px 16px 24px 16px;
    position: relative;
    .abnormal_title {
      font-size: 14px;
      font-weight: 400;
      color: var(--orange-color);
    }
    .close {
      position: absolute;
      right: 12px;
      cursor: pointer;
    }

    .assess-titles {
      height: 180px;
      width: 100%;
      padding: 24px;
    }
  }
  .assess-detail-scoreInfo {
    width: 100%;
    min-height: 120px;
    padding: 24px;
    display: flex;
    position: relative;
    margin-bottom: 16px;
    background: var(--bg-color-2);
    .score-div {
      width: 100px;
      height: 100px;
    }
    .content-div {
      margin-left: 24px;
      margin-right: 26px;
      p {
        color: var(--neutral7);
      }

      width: 86%;
      .name {
        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: var(--neutral9);
        padding-bottom: 8px;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .button-div {
      position: absolute;
      right: 24px;
    }
  }

  .assess-detail-wap {
    width: 100%;
    display: flex;
    background: var(--bg-color-2);
    padding-top: 16px;
    .adw-left {
      height: 100%;
      width: 27%;
      margin-left: 8px;
      margin-right: 16px;
    }
    .adw-right {
      height: 100%;
      flex-grow: 1; /*铺满剩余空间*/
      width: 73%;
      padding-right: 16px;
      .adw-right-top {
        background: var(--neutral0);

        .titles {
          display: flex;
          font-size: 14px;
          padding-top: 16px;
          margin-left: 16px;
          color: var(--neutral7);

          ::v-deep.el-breadcrumb {
            i {
              color: var(--neutral5);
            }
          }
          ::v-deep .el-breadcrumb__item {
            .el-breadcrumb__inner {
              max-width: 200px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: inline-block;
              color: var(--neutral5);
            }
          }
          ::v-deep.el-breadcrumb:last-child {
            span:last-child {
              span:last-child {
                color: var(--neutral7);
              }
            }
          }
        }
        .titles::before {
          content: ' ';
          width: 6px;
          height: 8px;
          vertical-align: middle;
          background: var(--primary-color);
          display: inline-block;
          margin-right: 8px;
          margin-top: 3px;
        }
        .adw-right-title {
          width: 100%;
          height: 30px;
          line-height: 30px;
        }
        .adw-right-five-data {
          list-style: none;
          width: 100%;
          padding: 0px;

          li {
            font-size: 14px;
            min-height: 54px;
            margin-left: 32px;
            margin-right: 24px;
            padding-top: 16px;
          }
          .two-li {
            border-top: 1px solid var(--neutral1);
            border-bottom: 1px solid var(--neutral1);
          }
        }
      }
      .adw-right-bottom {
        margin-top: 16px;
        background: var(--neutral0);
        .adw-right-bottom-content {
          width: 100%;
          margin-bottom: 16px;
        }
      }
    }
  }
}

.text {
  font-size: 14px;
  /* 设置多行文本溢出省略 */
  display: -webkit-box;
  /* 默认最多显示行 */
  -webkit-line-clamp: 2;
  overflow: hidden;
  -webkit-box-orient: vertical;
}
.text::before {
  content: '';
  float: right;
  width: 0px;
  height: 100%;
  margin-bottom: -10px;
}
.custom-tree-node {
  font-size: 14px;
  color: var(--neutral7);
  display: flex;
  .node-data {
    width: 100%;
    display: -webkit-box;
    text-overflow: ellipsis;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
    line-height: 22px;
  }
}
.adw-right-top-title {
  display: flex;
}
.logo-div {
  display: flex;
  padding-left: 16px;
  padding-top: 16px;
  ::v-deep.el-breadcrumb {
    i {
      color: var(--neutral5);
    }
  }
  ::v-deep .el-breadcrumb__item {
    .el-breadcrumb__inner {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      color: var(--neutral5);
    }
  }
  ::v-deep.el-breadcrumb:last-child {
    span:last-child {
      span:last-child {
        color: var(--neutral7) !important;
      }
    }
  }
  &::before {
    content: ' ';
    width: 6px;
    height: 8px;
    vertical-align: middle;
    background: var(--primary-color);
    display: inline-block;
    margin-right: 8px;
    position: relative;
    top: 3px;
  }
}
.go-detail {
  color: var(--primary-color);
  cursor: pointer;
  margin-left: 16px;
}
.go-detail:hover {
  color: var(--primary-color-8);
  border-bottom: 1px solid var(--primary-color-8);
}
::v-deep.el-tree .is-current {
  // background-color: transparent; //点击左侧树节点出现区域背景色
}
::v-deep.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: var(--neutral0) !important;
}
.desc-content {
  position: relative;
}
.no-content {
  color: var(--neutral7);
  position: absolute;
  top: 2px;
  left: 70px;
}
.no-content-en {
  color: var(--neutral7);
  position: absolute;
  top: 0px;
  left: 90px;
}
.desc-content {
  width: 95%;
  color: var(--neutral7);
}
.five-title {
  color: var(--neutral8);
}
.title-content {
  color: var(--neutral7);
}
.one-title {
  display: inline-block;
  padding-bottom: 10px;
  width: 400px;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
  margin-right: 60px;
  cursor: pointer;
}
.score {
  color: var(--neutral8);
}
.title-style {
  color: var(--neutral5);
}
.last-title-style {
  color: var(--neutral7);
}

.title-style,
.last-title-style {
  font-size: 14px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
.symbol-style {
  margin: 0 8px;
  color: var(--neutral5);
  position: relative;
  top: -3px;
}
</style>
