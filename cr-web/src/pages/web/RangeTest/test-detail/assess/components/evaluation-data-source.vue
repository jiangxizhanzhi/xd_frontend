<template>
  <div class="evaluationWrap">
    <div class="evaluationWrapContent">
      <div class="evaluationWrapLeft">
        <cb-tree
          ref="my-tree"
          :data="data"
          node-key="resource_id"
          :props="treeDefaultProps"
          @node-click="handleNodeClick"
          :default-expanded-keys="expandedKeys"
          :default-expand-all="true"
        >
          <div
            style="display: flex; padding-right: 8px"
            slot-scope="{ node, data }"
          >
            <div class="custom-tree-node" :title="node.label">
              {{ node.label }}
            </div>
            <div v-if="data.required" style="margin-left: 30px">
              <cb-iconfont
                type="icon-xuanze1"
                color="var(--green-color)"
              ></cb-iconfont>
            </div>
          </div>
        </cb-tree>
      </div>

      <div class="evaluationWrapRight">
        <div>
          <div
            class="evaluationWrapRightTop"
            v-if="Object.keys(evaluation).length > 0"
          >
            <span class="ewrrTitle">{{ $t('assessment.scoreType') }}:</span>
            <cb-radio
              v-model="evaluation.type"
              :label="1"
              @change="handleeScoringMethod"
              style="position: relative; top: -4px"
              >{{ $t('assessment.systemType') }}</cb-radio
            >
            <cb-radio
              v-model="evaluation.type"
              :label="2"
              @change="handleeScoringMethod"
              style="position: relative; top: -4px"
              >{{ $t('assessment.specialistType') }}</cb-radio
            >
          </div>
          <div class="evaluationWrapRightBottom">
            <div v-if="evaluation.type === 1">
              <div v-if="evaluation.variables.length > 0">
                <ul class="ewrBottomTitle">
                  <li class="ewrBottomTitleLi">
                    {{ $t('assessment.assessVariable') }}
                  </li>
                  <li class="ewrBottomTitleLi2">
                    <span>*</span>{{ $t('assessment.sceneNode') }}
                  </li>
                  <li class="ewrBottomTitleLi2">
                    <span>*</span>{{ $t('assessment.collectProbe') }}
                  </li>
                </ul>
                <div class="ewrbContent">
                  <ul class="ewrbContentUl">
                    <!-- 评估变量项目 -->
                    <li
                      v-for="item in evaluation.variables"
                      :key="item.resource_id"
                      class="ewrbContentUlLi"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                  <ul class="ewrbContentUl2">
                    <li
                      v-for="item in evaluation.variables"
                      :key="item.resource_id"
                      class="ewrbContentUlLi2"
                    >
                      <!-- 场景节点 -->
                      <cb-select
                        v-model="item.device_id"
                        @change="handleSceneNodeDataChange(item)"
                        width="98%"
                        :popper-append-to-body="false"
                      >
                        <cb-option
                          v-for="ele in item.sceneNodeData"
                          :key="ele.id"
                          :label="ele.label"
                          :value="ele.id"
                        >
                        </cb-option>
                      </cb-select>
                    </li>
                  </ul>
                  <ul class="ewrbContentUl2">
                    <li
                      v-for="item in evaluation.variables"
                      :key="item.resource_id"
                      class="ewrbContentUlLi2"
                      @click.capture="handleCollectionProbeFocus(item)"
                    >
                      <!-- 采集探针 -->
                      <cb-select
                        v-model="item.probe_id"
                        @change="handleCollectionProbeChange(item)"
                        width="98%"
                        :popper-append-to-body="false"
                      >
                        <cb-option
                          v-for="ele in item.collectionProbeData"
                          :key="ele.id"
                          :label="ele.label"
                          :value="ele.id"
                        >
                        </cb-option>
                      </cb-select>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-else>暂无系统评分数据源</div>
            </div>

            <div v-if="evaluation.type === 2">
              <div
                v-if="evaluation.third_level_type === 2"
                style="display: flex"
              >
                <span style="width: 44px; font-size: 14px; line-height: 30px"
                  >{{ $t('assessment.cycle') }}:</span
                >

                <cb-radio v-model="evaluation.specialist.value" :label="1"
                  >24小时</cb-radio
                >
                <cb-radio v-model="evaluation.specialist.value" :label="2"
                  >4小时</cb-radio
                >
                <cb-radio v-model="evaluation.specialist.value" :label="3"
                  >5分钟</cb-radio
                >
              </div>
              <div
                v-if="evaluation.third_level_type === 3"
                style="display: flex"
              >
                <!-- 整数值 -->
                <div style="width: 60px; font-size: 14px; line-height: 30px">
                  {{ $t('assessment.integer') }}:
                </div>
                <cb-input-number
                  v-model="evaluation.specialist.value"
                  controls-position="right"
                  :min="0"
                  size="small"
                ></cb-input-number>
              </div>

              <div
                v-if="evaluation.third_level_type === 1"
                style="display: flex"
              >
                <!-- 百分比 -->
                <div
                  :class="
                    getI18Nn().locale === 'en-US'
                      ? 'percentage_en'
                      : 'percentage'
                  "
                >
                  {{ $t('assessment.percentage') }}:
                </div>
                <cb-input
                  v-model="evaluation.specialist.value"
                  :placeholder="$t('assessment.enterContent')"
                  style="width: 180px"
                  size="small"
                  @blur="handleValue"
                  ref="getValue"
                >
                  <template slot="append"> % </template></cb-input
                >
              </div>
              <div
                v-if="isShow"
                :class="
                  getI18Nn().locale === 'en-US'
                    ? 'check_value_en'
                    : 'check_value'
                "
              >
                {{ $t('assessment.enterInteger') }}
              </div>
              <div v-if="!evaluation.third_level_type">
                {{ $t('assessment.noData') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getI18N } from '@cyber/helper';
export default {
  name: 'evaluationDataArrSource',
  props: {
    treeData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    task_id: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isShow: false,
      number: 0,
      data: [], //树数据
      treeDefaultProps: {
        children: 'children',
        label: 'name',
      },
      //整个数据源数据结构
      evaluationDataArr: [],
      evaluation: {},
      expandedKeys: [], //默认展开的key
      oldNodeId: '',
      clickNode: '',
      leftClickCount: 0,
      changeSystemId: false,
    };
  },
  created() {},
  methods: {
    getI18Nn() {
      return getI18N();
    },
    //验证百分比
    handleValue() {
      if (this.evaluation.specialist.type === 1) {
        if (
          Number.isInteger(Number(this.evaluation.specialist.value)) &&
          this.evaluation.specialist.value <= 100 &&
          this.evaluation.specialist.value >= 0
        ) {
          this.isShow = false;
        } else {
          this.isShow = true;
          this.evaluation.specialist.value = '';
        }
      }
    },
    //更新树
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
    upDataNode(tree, curKey, keyField) {
      for (const node of tree) {
        if (
          Object.prototype.toString.call(node) === '[object Object]' &&
          node[keyField] === curKey
        ) {
          node.indexes = node.children;
          delete node.children;
        }
        if (node?.children && node.children.length) {
          this.upDataNode(node.children, curKey, keyField);
        }
      }
      return tree;
    },
    handleTreeData(data, limit = 3, count = 1) {
      return data?.map((x) => ({
        ...x,
        children:
          count < limit
            ? this.handleTreeData(x.children, limit, count + 1)
            : [],
      }));
    },
    //找出所有的三级子节点
    findThreeNode(tree, curKey, node) {
      tree.forEach((item) => {
        if (item[curKey] === 3) {
          node.push({
            ...item,
          });
        }
        if (item?.children && item.children.length) {
          this.findThreeNode(item.children, curKey, node);
        }
      });
      return node;
    },

    //更新树
    findCurNode(tree, curKey, keyField, isRquired) {
      for (const node of tree) {
        if (node[keyField] === curKey) {
          node.required = node.indexes.length > 0 ? isRquired : false;
        }
        if (node.children && node.children.length > 0) {
          this.findCurNode(node.children, curKey, keyField, isRquired);
        }
      }
      return tree;
    },

    //点击左侧树节点
    handleNodeClick(data, node) {
      if (node.level === 3) {
        //获取点击的三级节点数据
        this.clickNode = data.resource_id;
        this.leftClickCount = this.leftClickCount + 1;
        //更新右侧数据，并且不清除用户的填写信息
        this.evaluation = this.evaluationDataArr.find((item) => {
          return item.resource_id === data.resource_id;
        });
      }
    },
    judgeEvaluation(resource_id) {
      //选择系统评分检测数据是否都填了
      let judgeResult = false;
      const findEvaluationData = this.evaluationDataArr.find((item) => {
        return item.resource_id === resource_id;
      });
      if (findEvaluationData && Object.keys(findEvaluationData).length > 0) {
        if (findEvaluationData.type === 1) {
          findEvaluationData.variables.forEach((item) => {
            if (item.device_id === '' || item.probe_id === '') {
              judgeResult = true;
            }
          });
        } else {
          //选择专家评分检测数据是否都填了
          if (
            findEvaluationData.specialist.value === undefined ||
            findEvaluationData.specialist.value === null ||
            findEvaluationData.specialist.value === ''
          ) {
            judgeResult = true;
          }
        }
      }
      return judgeResult;
    },
    //选择评分方式
    handleeScoringMethod(data) {
      this.evaluation = {
        ...this.evaluation,
        type: data,
      };
      this.isShow = false;
      this.upSubmitData(this.evaluationDataArr, this.evaluation);
    },
    //修改提交数据
    upSubmitData(evaluationDataArr, obj) {
      this.evaluationDataArr = evaluationDataArr.map((item) => {
        if (item.resource_id === obj.resource_id) {
          return {
            ...obj,
          };
        } else {
          return {
            ...item,
          };
        }
      });
    },
    //采集探针获取焦点
    handleCollectionProbeFocus(data) {
      const node_id =
        this.evaluation.variables.filter((item) => {
          return item.resource_id === data.resource_id;
        })[0].device_id || '';
      this.$request
        .get(
          '/cr/eval/record/probes',
          {
            room_id: this.task_id,
            node_id: node_id,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const variables = this.evaluation.variables.map((item) => {
            if (item.resource_id === data.resource_id) {
              return {
                ...data,
                collectionProbeData: res.data.data,
              };
            } else {
              return {
                ...item,
              };
            }
          });
          this.evaluation = {
            ...this.evaluation,
            variables: variables,
          };
          this.upSubmitData(this.evaluationDataArr, this.evaluation);
        });
    },
    //采集探针下拉框改变
    handleCollectionProbeChange(data) {
      const variables = this.evaluation.variables.map((item) => {
        if (item.resource_id === data.resource_id) {
          return {
            ...data,
          };
        } else {
          return {
            ...item,
          };
        }
      });
      this.evaluation = {
        ...this.evaluation,
        variables: variables,
      };
      this.upSubmitData(this.evaluationDataArr, this.evaluation);
    },
    handleSceneNodeDataChange(data) {
      //调回去探针的接口根据节点id device_id
      const node_id = data.device_id;
      this.$request
        .get(
          '/cr/eval/record/probes',
          { room_id: this.task_id, node_id: node_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const variables = this.evaluation.variables.map((item) => {
            if (item.resource_id === data.resource_id) {
              return {
                ...data,
                collectionProbeData: this.collectionProbeData,
                probe_id: '',
              };
            } else {
              return {
                ...item,
              };
            }
          });
          this.evaluation = {
            ...this.evaluation,
            variables: variables,
          };
          this.upSubmitData(this.evaluationDataArr, this.evaluation);
        });
    },
    handleRefleshRight(resource_id) {
      this.evaluation = this.evaluationDataArr.find((item) => {
        return item.resource_id === resource_id;
      });
    },
    //数组对象去重
    uniqueFun(arr, type) {
      const res = new Map();
      return arr.filter((a) => !res.has(a[type]) && res.set(a[type], 1));
    },
  },
  watch: {
    treeData: {
      handler(newData, oldData) {
        // ===============编辑
        if (this.id && !this.changeSystemId) {
          let dataLevel = JSON.parse(
            JSON.stringify(this.arrayTreeAddLevel(newData)),
          );
          //生成左侧树
          const data = this.upDataNode(dataLevel, 3, 'level');
          this.data = data;
          //默认展开第一级
          this.expandedKeys = [
            data[0]?.resource_id,
            data[0]?.children[0]?.resource_id,
          ];
          const firstThreeID = data[0]?.children[0]?.children[0]?.resource_id;
          this.clickNode = firstThreeID;

          //处理右侧数据
          let submitData = [];
          submitData = this.findThreeNode(dataLevel, 'level', []);
          //请求场景节点信息并塞入对应的数据中
          this.$request
            .get(
              '/cr/eval/record/nodes',
              { room_id: this.task_id },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              this.sceneNodeData = res.data.data;
              let allCollectionProbeData = [];

              //获取全部探针数据
              this.$request
                .get(
                  '/cr/eval/record/probes/all',
                  {
                    room_id: this.task_id,
                    // node_id: item.id,
                  },
                  { baseURL: '/api/ojj' },
                )
                .then((res) => {
                  res.data.data.forEach((element) => {
                    allCollectionProbeData = allCollectionProbeData.concat(
                      element.data,
                    );
                  });
                  // //去重
                  allCollectionProbeData = this.uniqueFun(
                    allCollectionProbeData,
                    'id',
                  );
                  this.allCollectionProbeData = allCollectionProbeData;

                  submitData = submitData.map((item) => {
                    return {
                      ...item,
                      type: item.type ? item.type : '',
                      third_level_type: item?.specialist?.type || '',
                      variables:
                        item.indexes.length > 0
                          ? item.indexes.map((ele) => {
                              return {
                                ...ele,
                                device_id: ele.device_id, //场景节点
                                probe_id: ele.probe_id, //采集探针
                                variable_id: item.resource_id,
                                sceneNodeData: this.sceneNodeData,
                                collectionProbeData:
                                  this.allCollectionProbeData.filter((item) => {
                                    return item.id === ele.probe_id;
                                  }),
                              };
                            })
                          : [],
                    };
                  });
                  this.evaluation = submitData[0]; //默认打开第一级数据
                  this.evaluationDataArr = submitData;
                });
            });
          // });
        } else {
          //处理123级数据,因为服务端返回4级树,左侧理成三级upDataNode
          const data = this.upDataNode(newData, 3, 'level');

          this.data = data;
          //默认展开第一级
          this.expandedKeys = [
            data[0]?.resource_id,
            data[0]?.children[0]?.resource_id,
          ];
          //找出第一个三级节点的右侧内容
          const firstThreeID = data[0]?.children[0]?.children[0]?.resource_id;
          this.clickNode = firstThreeID;
          //找出4级节点,并生成生成要提交的数据
          let submitData = [];
          submitData = this.findThreeNode(newData, 'level', []);
          //请求场景节点信息并塞入对应的数据中
          this.$request
            .get(
              '/cr/eval/record/nodes',
              { room_id: this.task_id },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              this.sceneNodeData = res.data.data;
              submitData = submitData.map((item) => {
                return {
                  ...item,
                  specialist: {
                    //评分方式 2时的数据结构
                    type: item.third_level_type,
                    value: undefined,
                  },
                  type: item.type ? item.type : 1,
                  variables:
                    item.indexes.length > 0
                      ? item.indexes.map((ele) => {
                          return {
                            ...ele,
                            device_id: '', //场景节点
                            probe_id: '', //采集探针
                            sceneNodeData: this.sceneNodeData,
                            collectionProbeData: [],
                            variable_id: item.resource_id,
                          };
                        })
                      : [],
                };
              });
              this.evaluation = submitData[0]; //默认打开第一级数据
              this.evaluationDataArr = submitData;
            });
        }
      },
      // 开启深度监听
      deep: true,
    },

    // clickNode(newData, old) {
    //   //切换指标体系判断不提示
    //   const resource_id = this.leftClickCount === 0 ? this.clickNode : old;
    //   if (this.judgeEvaluation(old)) {
    //     this.$message.error(this.$t('assessment.requireInfo'));
    //   }
    // },
    evaluationDataArr: {
      // 数据变化时执行的逻辑代码
      handler(newData, oldData) {
        //添加小绿号
        newData.forEach((item) => {
          if (!this.judgeEvaluation(item.resource_id)) {
            this.data = JSON.parse(
              JSON.stringify(
                this.findCurNode(
                  this.data,
                  item.resource_id,
                  'resource_id',
                  true,
                ),
              ),
            );
            this.expandedKeys = [...this.expandedKeys, this.clickNode];
          } else {
            this.data = JSON.parse(
              JSON.stringify(
                this.findCurNode(
                  this.data,
                  item.resource_id,
                  'resource_id',
                  false,
                ),
              ),
            );
            this.expandedKeys = [...this.expandedKeys, this.clickNode];
          }
        });
      },
      // 开启深度监听
      deep: true,
    },
  },
};
</script>

<style scoped>
ul {
  padding: 0;
  margin: 0;
}
ul li {
  list-style: none;
}
.evaluationWrap {
  width: 100%;
  margin-left: 12px;
}
.evaluationWraptitle {
  font-size: 14px;
}
.evaluationWrapContent {
  width: 100%;

  display: flex;
  justify-content: flex-start;
}
.evaluationWrapLeft {
  border-right: 1px solid var(--neutral3);
  flex: 1;
}
.evaluationWrapRight {
  flex: 5;
  margin-left: 20px;
}
.evaluationWrapRightTop {
  width: 100%;
  height: 30px;
  display: flex;
}
.ewrrTitle {
  font-size: 14px;
  margin-right: 10px;
}
.evaluationWrapRightBottom {
  width: 100%;
  min-height: 340px;
  margin-top: 20px;
}
.ewrBottomTitle {
  width: 99%;
  height: 48px;
  display: flex;
  justify-content: flex-start;
  padding: 0;
  background-color: var(--bg-color-3);
}
.ewrBottomTitleLi {
  font-size: 14px;
  list-style: none;
  width: 26%;
  line-height: 48px;
  margin-left: 16px;
}
.ewrBottomTitleLi2 {
  font-size: 14px;
  list-style: none;
  width: 37%;
  line-height: 48px;
  margin-left: 16px;
  color: var(--neutral8);
}
.ewrBottomTitleLi2 > span {
  color: var(--red-color);
  margin-right: 2px;
}
.ewrbContent {
  width: 99%;
  display: flex;
  margin-top: 10px;
}
.ewrbContentUl {
  width: 26%;
}
.ewrbContentUl2 {
  width: 37%;
}
.ewrbContentUlLi {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-bottom: 8px;
  background-color: var(--bg-color-3);

  padding-left: 16px;
  font-size: 14px;

  display: -webkit-box;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}
.ewrbContentUlLi2 {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-bottom: 8px;
  margin-left: 12px;
}
.ewrbContentUlLi2 .el-select {
  width: 98%;
  height: 30px;
}

.custom-tree-node {
  width: 180px;
  font-size: 14px;
  display: -webkit-box;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}
.check_value {
  font-size: 12px;
  color: var(--red-color);
  position: relative;
  left: 65px;
}
.check_value_en {
  font-size: 12px;
  color: var(--red-color);
  position: relative;
  left: 85px;
}
.percentage_en {
  width: 82px;
  font-size: 14px;
  line-height: 30px;
}
.percentage {
  width: 60px;
  font-size: 14px;
  line-height: 30px;
}
</style>
