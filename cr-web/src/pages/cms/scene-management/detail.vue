<template>
  <cb-inner-page
    class="event-team-bg"
    :background="false"
  >
    <div class="event-team-detail">
      <div class="body">
        <cb-form
          class="steps-form"
          ref="techfromRef"
          :model.sync="model"
          :id="id && { resource_id: id }"
          :url="url"
          json
          :baseURL="baseURL"
          :isBgColor="true"
        >
          <!--    步骤条-->
          <div class="header-steps">
            <cb-steps
              :space="150"
              :active="active"
              simple
              :data="stepDatas"
            >
            </cb-steps>
          </div>
          <div class="body-pane">
            <!--    基础信息-->
            <div v-show="active === 1">
              <CeTeamTrainBaseInfo
                ref="CeTeamTrainBaseInfo"
                :edit-id="editId"
                :question-type="questionType"
                :base-info="model.base_info"
                @sendVal="getChildComVal"
                @sendFormat="getFormat"
                @sendRepeat="getRepeat"
                @sendValOne="getChildComValOne"
                @sendFormatOne="getFormatOne"
                @sendRepeatOne="getRepeatOne"
              />
            </div>
            <!--    拓扑编排-->
            <div
              v-if="active === 2"
              style="height: 710px"
            >
              <scene-editor
                ref="topologyEditor"
                :showMask="false"
                :title="model.base_info.name"
                :topology-data="model.base_info.scene_config_data"
                :open-layer="true"
                :sceneConfigId="sceneConfigId"
                :role-show-config="roleShowConfig"
                :roles.sync="originRoles"
                :sync-processing.sync="syncProcessing"
              >
              </scene-editor>
            </div>
            <!--  任务编排 -->
            <div v-if="active === 3">
              <CeMissionSchedule
                :active="active"
                ref="CeMissionSchedule"
                :role-list="model.role_list"
                :max-time="maxTime"
                :base-time="baseTime"
              />
            </div>
          </div>
          <!--    底部按钮-->
          <div
            class="foot-button"
            slot="fixedBottom"
          >
            <cb-button-group space="middle">
              <cb-button
                v-show="active !== 1"
                @click="previous"
                :disabled="syncProcessing"
              >
                {{ $t('crEvent.previous') }}
              </cb-button>
              <cb-button
                v-show="active !== 3"
                @click="next"
                :isCheck="isCheck"
                :noRepeat="noRepeat"
                :isCheckOne="isCheckOne"
                :noRepeatOne="noRepeatOne"
                :isSkillFormat="isSkillFormat"
                :isSkillFormatOne="isSkillFormatOne"
                :disabled="syncProcessing"
              >
                {{ $t('crEvent.next') }}
              </cb-button>
              <cb-button
                v-show="active === 3"
                @click="submit"
                :disabled="syncProcessing"
              >
                {{ $t('crEvent.confirm') }}
              </cb-button>
              <cb-button
                button-type="cancel"
                @click="cancel"
                :disabled="syncProcessing"
              >{{ $t('crEvent.cancel') }}</cb-button>
            </cb-button-group>
          </div>
        </cb-form>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import CeMissionSchedule from './components/mission-schedule';
import CeTeamTrainBaseInfo from './components/base-info';
import util from '@/utils/util';
import moment from 'moment';
import { handlerImageLength } from '@/utils/validate-cms';
import _ from 'lodash';
import { SceneEditor } from '@cyber/scene';
import { v4 as uuidv4 } from 'uuid';
import IndexDB from '@/utils/indexDB.js';
import { SCENE_MANAGEMENT_NAME, SCENE_MANAGEMENT_TYPE } from './constants';
export default {
  name: 'Edit',
  components: {
    CeMissionSchedule,
    CeTeamTrainBaseInfo,
    SceneEditor,
  },
  props: {
    id: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      isCheck: false,
      noRepeat: false,
      isSkillFormat: false,
      isCheckOne: false,
      noRepeatOne: false,
      isSkillFormatOne: false,
      stepDatas: [
        { title: this.$t('crEvent.baseInfo') },
        { title: this.$t('crEvent.topologyConfig') },
        { title: this.$t('crEvent.missionConfig') },
      ],
      // 团队questionType213
      questionType: 3,
      active: 1, // 步骤条
      // 对抗演练新增接口
      baseURL: '/api/ojj',
      url: '/cr/team_train/template',
      baseTime: '2014-04-16T00:00:00', // 设计剧本组件基础时间
      model: {
        base_info: {
          type: '3',
          xd_template_category: 1,
          xd_template_type: SCENE_MANAGEMENT_TYPE[this.$route.meta?.breadcrumb?.parentName],
          name: '',
          description: '',
          logo: '',
          category: this.$CONSTANT.TrainCategory.PENETRATION_TEST.value, //渗透测试/安全运维等
          difficult: this.$CONSTANT.TeamTrain.Difficult.LOW.value,
          duration_time: 4,
          people_number: 4,
          pre_skill: [],
          train_skill: [],
          scene_config_data: {
            // 第二步topo
            scene_config: {
              topology: {
                area_id: '',
                scene: {},
                areas: [],
                connections: [],
                elements: [],
              },
              plugins: {},
            },
            roles: [],
            id: '',
          },
          scene_config_data_indexdb: {
            // 第二步topo缓存
            scene_config: {
              topology: {
                area_id: '',
                scene: {},
                areas: [],
                connections: [],
                elements: [],
              },
              plugins: {},
            },
            roles: [],
            id: '',
          },
        },
        people_number: 4,
        role_list: [],
        scene_config_data: {
          topology_config: {
            scene: {
              name: '',
              desc: '',
            },
            nodes: [],
            edges: [],
          },
        },
      },
      originRoles: [],
      timerGetTopo: null,
      cacheAllList: [], // 单兵所有缓存值
      myCacheList: [], // 本人的缓存
      idKey: '',
      debounceCacheAdd: undefined,
      changeCount: 0,
      haveCache: false,
      submitOpt: false,
      goTwo: false,
      goThree: false,
      sceneLogo: '', // 场景截图
      screenShotStatus: '', // 截图状态
      sceneConfigId: '',
      roleShowConfig: ['red'],
      intervalSetTopo: true, // 最后提交的时候，不再更新数据库缓存
      syncProcessing: false, // 是否监听编辑器内部的同步操作
    };
  },
  computed: {
    maxTime() {
      return moment(this.baseTime)
        .add('hours', this.model.base_info.duration_time)
        .format('YYYY-MM-DDTHH:mm:ss');
    },
    studentRoles() {
      // const roles = [];
      let roles = [];
      this.$_.forEach(this.model.role_list, (role) => {
        if (
          role.role_group !== this.$CONSTANT.TeamTrain.Permission.TEACHER.value
        ) {
          roles.push(role);
        }
      });
      return roles;
    },
    editId() {
      return this.id;
    },
    cacheAdd() {
      return this.$store.state.user.id + '-add';
    },
    cacheEdit() {
      return this.$store.state.user.id + '-' + this.id;
    },
    modelNew() {
      return JSON.parse(JSON.stringify(this.model));
    },
  },
  watch: {
    active() {
      if (this.active === 2) {
        this.goTwo = true;
      } else if (this.active === 3) {
        this.goThree = true;
        // 切换默认选择值
        this.$refs.CeMissionSchedule &&
          this.$refs.CeMissionSchedule.selectDefaultRole();
      }
      if (this.active !== 3) {
        this.intervalSetTopo = true;
      }
    },
    error() {
      if (this.error) {
        this.$message({
          message: this.error,
          type: 'error',
        });
      }
    },
    modelNew: {
      handler(val, oldval) {
        // 用于判断新增时 数据改
        if (JSON.stringify(val) !== JSON.stringify(oldval)) {
          this.changeCount++;
          // 为了判断编辑时，数据回显&topo getData取值和接口返回值不一样
          if (
            (this.id &&
              !this.haveCache &&
              this.active === 1 &&
              this.changeCount > 2 &&
              !this.goTwo) ||
            (this.id &&
              !this.haveCache &&
              this.active === 1 &&
              this.changeCount > 4 &&
              this.goTwo) ||
            (this.id &&
              !this.haveCache &&
              this.active === 2 &&
              this.changeCount > 3 &&
              !this.goThree) ||
            (this.id &&
              !this.haveCache &&
              this.active === 2 &&
              this.changeCount > 5 &&
              this.goThree) ||
            (this.id &&
              !this.haveCache &&
              this.active === 3 &&
              this.changeCount > 4) ||
            (this.id && this.haveCache && this.changeCount > 1) ||
            (!this.id && this.changeCount >= 1)
          ) {
            if (!this.submitOpt) {
              this.debounceCacheAdd();
            }
          }
        }
      },
      deep: true,
    },
  },
  created() {
    IndexDB.dbInit('team');
    this.timerGetTopo = setInterval(() => {
      if (this.active === 2 && this.$refs.topologyEditor) {
        // 定时获取拓扑数据
        this.comGetTopo('indexdb');
        this.comDisposeTask();
      } else if (this.active === 3) {
        this.$refs.CeMissionSchedule.getRoleMission();
      }
    }, 2000);
    this.debounceCacheAdd = _.debounce(
      () => {
        if (this.intervalSetTopo) {
          this.addIndexDB();
        }
      },
      1000,
      {
        leading: true,
      },
    );
  },
  async mounted() {
    // this.cacheAllList = await IndexDB.dbOperation('team', 'getAll');
    // // 如果有值，则去判断是否有本人的缓存
    // this.myCacheList = _.filter(this.cacheAllList, (item) => {
    //   const idSplit = item.id.slice(0, 32); // 截取uesrId
    //   return idSplit === this.$store.state.user.id;
    // });
    // if (this.myCacheList && this.myCacheList[0]) {
    //   this.haveCache = true;
    //   this.idKey = this.myCacheList[0].id;
    //   this.model = this.myCacheList[0];
    //   this.model.base_info.scene_config_data = _.cloneDeep(
    //     this.model.base_info.scene_config_data_indexdb,
    //   );

    //   this.originRoles = this.model.role_list;
    //   this.sceneConfigId = this.model.base_info.scene_config_data_indexdb.id;
    // } else {
    //   this.idInitData();
    // }
    this.idInitData();

  },
  beforeDestroy() {
    this.debounceCacheAdd = undefined;
    this.cacheAllList = null;

    if (this.timerGetTopo) {
      clearTimeout(this.timerGetTopo);
    }
  },
  methods: {
    idInitData() {
      if (this.id != '') {
        this.$refs.techfromRef.getModelData().then((data) => {
          this.initData(data);
          this.disposeIdRole();
        });
      }
    },
    disposeIdRole() {
      if (this.id) {
        const red = uuidv4();
        const blue = uuidv4();
        let new_roles = [
          {
            asset_nodes: [],
            children: [],
            id: red,
            name: '红队',
            type: 'red',
            visible_nodes: [],
          },
          {
            asset_nodes: [],
            children: [],
            id: blue,
            name: '蓝队',
            type: 'blue',
            visible_nodes: [],
          },
        ];
        let new_roles_origin = [
          {
            asset_nodes: [],
            children: [],
            id: red,
            name: '红队',
            type: 'red',
            visible_nodes: [],
          },
          {
            asset_nodes: [],
            children: [],
            id: blue,
            name: '蓝队',
            type: 'blue',
            visible_nodes: [],
          },
        ];
        this.model.role_list.forEach((item) => {
          new_roles[0].children.push({
            _id: item.id,
            asset_nodes: item.asset_nodes,
            id: item.id,
            name: item.name,
            type: 'red',
            visible_nodes: item.visible_nodes,
            // missions_scheme: item.missions_scheme,
          });
          new_roles_origin[0].children.push({
            _id: item.id,
            asset_nodes: item.asset_nodes,
            id: item.id,
            name: item.name,
            type: 'red',
            visible_nodes: item.visible_nodes,
            missions_scheme: item.missions_scheme,
          });
        });
        this.originRoles = new_roles_origin;
        // 编辑时，将编辑接口返回的角色数据经过处理放到场景数据的角色中
        this.model.base_info.scene_config_data.roles = new_roles;
        this.model.base_info.scene_config_data_indexdb.roles = new_roles;
      }
    },
    async addIndexDB() {
      if (!this.intervalSetTopo) return;
      let data = {};
      if (!this.idKey) {
        this.idKey = this.id ? this.cacheEdit : this.cacheAdd;
        data = {
          id: this.idKey,
          ...this.model,
        };
        await IndexDB.dbOperation('team', 'add', data);
      } else {
        data = {
          id: this.idKey,
          ...this.model,
        };
        await IndexDB.dbOperation('team', 'put', data);
      }
    },
    async next() {
      //重复
      if (!this.noRepeat) {
        this.$message.error(this.$t('crEvent.repeatMsg'));
        return false;
      }
      if (!this.noRepeatOne) {
        this.$message.error(this.$t('crEvent.repeatMsg'));
        return false;
      }
      // 内容
      if (!this.isSkillFormat) {
        return this.$message.error(this.$t('crEvent.contentError'));
      }
      if (!this.isSkillFormatOne) {
        this.$message.error(this.$t('crEvent.contentError'));
        return false;
      }
      //长度
      if (!this.isCheck) {
        this.$message.error(this.$t('crEvent.lengthLint255'));
        return false;
      }
      if (!this.isCheckOne) {
        this.$message.error(this.$t('crEvent.lengthLint255'));
        return false;
      }

      if (this.active === 1) {
        //  验证第一步表单正确性
        this.validateForm();
      } else if (this.active === 2) {
        // 验证第二步拓扑数据正确性
        // this.comGetTopo();
        let editorData = this.$refs.topologyEditor.getData();
        let { scene_config, roles, id } = editorData;
        this.getImagePath();

        let copyRoles = _.cloneDeep(roles);
        this.setMission(copyRoles);
        Object.assign(this.originRoles, copyRoles);
        Object.assign(this.model.base_info.scene_config_data, {
          scene_config: _.clone(scene_config),
          roles: _.clone(roles),
          id: id,
        });
        Object.assign(this.model.base_info.scene_config_data_indexdb, {
          scene_config: _.clone(scene_config),
          roles: _.clone(roles),
          id: id,
        });

        if (roles) {
          let concatRole = [];
          _.forEach(roles, (role) => {
            _.forEach(role.children, (child) => {
              concatRole.push(child);
            });
          });
          if (!concatRole.length) {
            this.$message.error(this.$t('crEvent.requiresAtLeastTwoRoles'));
            return;
          }
        }
        if (!roles.length) {
          this.$message.error(this.$t('crEvent.requiresAtLeastTwoRoles'));
          return;
        }
        this.comDisposeTask();
        await this.$refs.topologyEditor?.saveTopologyData();
        this.active++;
        this.intervalSetTopo = false;
      } else {
        if (this.active++ > 2) this.active = 3;
      }
    },
    comGetTopo(type) {
      let editorData = this.$refs.topologyEditor.getData();
      let { scene_config, roles, id } = editorData;
      if (roles.length > 0) {
        let copyRoles = _.cloneDeep(roles);
        this.setMission(copyRoles);
        Object.assign(this.originRoles, copyRoles);
        if (type !== 'indexdb') {
          // 点击下一步，正常给 scene_config_data 赋值
          Object.assign(this.model.base_info.scene_config_data, {
            roles: _.clone(roles),
            id: id,
          });
        }
        // 2秒循环 给scene_config_data_indexdb赋值
        Object.assign(this.model.base_info.scene_config_data_indexdb, {
          roles: _.clone(roles),
          id: id,
        });
      }
      if (type !== 'indexdb') {
        Object.assign(this.model.base_info.scene_config_data, {
          scene_config: _.clone(scene_config),
          id: id,
        });
      }
      Object.assign(this.model.base_info.scene_config_data_indexdb, {
        scene_config: _.clone(scene_config),
        id: id,
      });
    },
    comDisposeTask() {
      if (this.originRoles.length > 0) {
        const dataRed = this.originRoles[0]?.children?.map((item) => {
          if (!item.missions_scheme) {
            return {
              ...item,
              _id: item.id ? item.id : Math.random() + '_id',
              role_group: 2,
              missions_scheme: {
                color: 1,
                scheme_data: [],
                template: 1,
              },
            };
          } else {
            return {
              ...item,
              role_group: 2,
              _id: item.id ? item.id : Math.random() + '_id',
            };
          }
        });
        const dataBlue = this.originRoles[1]?.children?.map((item) => {
          if (!item.missions_scheme) {
            return {
              ...item,
              _id: item.id ? item.id : Math.random() + '_id',
              role_group: 2,
              missions_scheme: {
                color: 1,
                scheme_data: [],
                template: 1,
              },
            };
          } else {
            return {
              ...item,
              role_group: 2,
              _id: item.id ? item.id : Math.random() + '_id',
            };
          }
        });
        this.model.role_list = _.compact(_.clone(_.concat(dataRed, dataBlue)));
      }
    },
    // 设置任务
    setMission(roles) {
      roles?.forEach((role) => {
        const origin = this.handleRoleMisson(
          _.compact(this.originRoles),
          role.id,
        );
        if (origin && !_.isEmpty(origin.missions_scheme)) {
          role.missions_scheme = origin.missions_scheme;
        }

        if (!_.isEmpty(role.children)) {
          this.setMission(role.children);
        }
      });
    },

    handleRoleMisson(data, id) {
      for (const item of data) {
        if (item.id === id) {
          return item;
        } else if (!_.isEmpty(item.children)) {
          const res = this.handleRoleMisson(item.children, id);

          if (res) {
            return res;
          } else {
            continue;
          }
        } else {
          // return null;
          continue;
        }
      }
    },

    validateTopology() {
      const that = this;
      // 方案中存在数据进行验证
      const nodes = _.get(
        this,
        'model.scene_config_data.topology_config.nodes',
        [],
      );
      const networksNodes = _.filter(nodes, (item) => {
        const ctg = _.get(item, 'data.data._meta.category');
        return (
          ctg === 'network' ||
          ctg === 'router' ||
          ctg === 'firewall' ||
          ctg === 'server'
        );
      });
      const errMsg = (msg) => {
        this.$message.error(msg);
      };
      for (const netObj of networksNodes) {
        const name = _.get(netObj, 'data.data.name');
        if (!name) {
          errMsg(that.$t('device.nameNodeInput'));
          return false;
        } else {
          const sum = handlerImageLength(name);
          if (!sum) {
            errMsg(that.$t('common.imageErrorInput'));
            return false;
          } else if (sum < 1 || sum > 40) {
            errMsg(that.$t('settings.inputNodeNameLength'));
            return false;
          }
        }
      }
      this.active++;
    },

    // 验证第一步表单的正确性
    validateForm() {
      this.$refs.CeTeamTrainBaseInfo.$refs['base-info'].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          if (!this.validate_skill()) {
            this.$message.error(this.$t('crEvent.labelError'));
          } else if (
            this.$_.isEmpty(this.model.base_info.pre_skill) ||
            this.$_.isEmpty(this.model.base_info.train_skill)
          ) {
            // 验证技能标签个数
            this.$message.error(this.$t('crEvent.skillTagCanNotBeEmpty'));
            return false;
          }
          // else if (this.model.role_list.length < 2) {
          //   // 验证角色数量
          //   this.$message.error(this.$t('crEvent.requiresAtLeastTwoRoles'));
          //   return false;
          // }
          else {
            this.active++;
          }
        }
      });
    },

    previous() {
      if (this.active === 3) {
        // 需要把当前任务保存下
        this.$refs.CeMissionSchedule.syncCurrentRoleMissions(
          this.$refs.CeMissionSchedule.selectRole,
        );
      }
      if (this.active-- < 2) {
        this.active = 1;
      } else {
        if (this.$refs.topologyEditor) {
          let editorData = this.$refs.topologyEditor.getData();
          let { scene_config, roles, id } = editorData;
          this.getImagePath();

          this.model.base_info.scene_config_data.scene_config =
            _.clone(scene_config);
          this.model.base_info.scene_config_data.roles = _.clone(roles);

          this.model.base_info.scene_config_data_indexdb.scene_config =
            _.clone(scene_config);
          this.model.base_info.scene_config_data_indexdb.roles = _.clone(roles);
          this.sceneConfigId = id;
        } else {
          this.sceneConfigId = this.model.base_info.scene_config_data.id;
        }
        const reds = _.filter(this.model.role_list, (item) => {
          return item.type === 'red';
        });
        const blues = _.filter(this.model.role_list, (item) => {
          return item.type === 'blue';
        });
        this.originRoles.forEach((item) => {
          if (item.type === 'red') {
            item.children = reds;
          }
          if (item.type === 'blue') {
            item.children = blues;
          }
        });
        // this.model.base_info.scene_config_data.roles = _.clone(
        //   this.originRoles,
        // );
      }
    },

    // 验证前置技能和训练目标
    validate_skill() {
      return !(
        this.$refs.CeTeamTrainBaseInfo.$refs.preTag.inputErrorType ||
        this.$refs.CeTeamTrainBaseInfo.$refs.trainTag.inputErrorType
      );
    },

    // 初始化数据
    initData(data) {
      data.base_info.people_number = data.people_number;
      _.forEach(data.role_list, (role) => {
        if (role.role_group !== 1) {
          _.forEach(role.missions_scheme.scheme_data, (missions) => {
            this.$set(missions, 'templates', missions.missions);
          });
        }
      });
      this.$set(
        data.base_info,
        'scene_config_data_indexdb',
        _.cloneDeep(data.base_info.scene_config_data),
      );
      this.model = Object.assign({}, data);
      this.model.base_info.xd_template_type = SCENE_MANAGEMENT_TYPE[this.$route.meta?.breadcrumb?.parentName];
      this.sceneConfigId = data.base_info.scene_config_data.id;
    },

    submit() {
      this.submitOpt = true;
      // 提交
      this.percent = 0;
      this.error = '';
      if (this.beforeSubmit() === false) {
        return;
      }

      let data;
      let currentMd5Model;
      if (this.isDiffCheck) {
        currentMd5Model = util.getMd5Model(this.model);
        const diffFields = util.getDiffFields(
          this.auxiliary.initMd5Model,
          currentMd5Model,
        );
        data = this.$_.pick(
          this.model,
          this.$_.union(diffFields, this.noDiffCheckFields),
        );
      } else {
        if (this.model.base_info.scene_config_data.scene_config.topology) {
          this.model.base_info.scene_config_data.scene_config.topology.scene = {
            ...this.model.base_info.scene_config_data.scene_config.topology
              .scene,
            name: this.model.base_info.name,
          };
        }
        this.model.base_info.scene_config_data.logo = this.sceneLogo;
        data = this.model;
      }

      if (this.$_.isEmpty(data)) {
        if (this.emptySubmit) {
          this.percent = 100;
          this.submitSuccess({});
        }
        this.submitWithoutData();
        return;
      }

      const submitData = {
        ...this.generateSubmitData(data),
        resource_id: this.id,
      };
      // 未上传logo, 使用scene_config_data.logo
      if (!submitData.base_info.logo) {
        submitData.base_info.logo = submitData.base_info.scene_config_data.logo;
      }
      // 综合演训分类不需要该参数
      if (this.$route.name === 'comprehensive-training-scene-add' || this.$route.name === 'comprehensive-training-scene-edit') {
        delete submitData.base_info.xd_template_category
      }
      this.submitted = true;
      this.$refs.techfromRef
        .submit(submitData, {
          intercept: true,
        })
        .then((res) => {
          this.goList();
        })
        .catch((err) => {
          // this.$message.error(this.findKey(err.response.data, 'message'));
          this.$message.error(this.findKey(err.data, 'message'));
          this.model.base_info.scene_config_data_indexdb = _.cloneDeep(
            this.model.base_info.scene_config_data,
          );
        });
    },
    findKey(data, field) {
      let finding = '';
      for (const key in data) {
        if (key === field) {
          finding = data[key];
        }
        if (typeof data[key] === 'object') {
          finding = this.findKey(data[key], field);
        }
        if (finding) {
          return finding;
        }
      }
      return null;
    },
    beforeSubmit() {
      // this.model.scene_config_data.topology_config.scene.name =
      //   this.model.base_info.name;
      // this.model.scene_config_data.topology_config.scene.desc =
      //   this.model.base_info.description;
      this.model.people_number = this.model.base_info.people_number;
      // 验证任务正确性
      if (!this.$refs.CeMissionSchedule.getRoleMission()) {
        return false;
      }

      this.$refs.CeMissionSchedule.syncCurrentRoleMissions(
        this.$refs.CeMissionSchedule.selectRole,
      );
      if (this.$refs.CeMissionSchedule.showMain) {
        this.$refs.CeMissionSchedule.syncCurrentRoleMissions();
      }
    },
    generateSubmitData(data) {
      const submitData = this.$_.cloneDeep(data);
      const has_mission_hash = [];
      this.$_.forEach(submitData.role_list, (role) => {
        this.$_.forEach(role.missions_scheme.scheme_data, (mission_scheme) => {
          this.$set(mission_scheme, 'missions', mission_scheme.templates);
          this.$_.forEach(mission_scheme.missions, (mission) => {
            has_mission_hash.push(mission.resource_id);
          });
        });
      });

      if (
        submitData.scene_config_data &&
        typeof submitData.scene_config_data.file === 'string'
      ) {
        this.$_.unset(submitData.scene_config_data, 'file');
      }
      // this.$_.forEach(submitData.role_list, item => {
      //   this.$_.forEach(item.missions_scheme, scheme_item => {
      //     this.$_.forEach(scheme_item.missions, mission => {
      //       _.unset(mission, 'start')
      //     })
      //   })
      // })
      this.$_.forEach(['scene_config_data'], (attr) => {
        if (submitData[attr]) {
          submitData[attr] = JSON.stringify(submitData[attr]);
        }
      });
      // delete submitData.flow_schemes_data;
      // delete submitData.gather_schemes_data;
      // delete submitData.scene_config_data;
      delete submitData.base_info.scene_config_data_indexdb;
      return submitData;
    },
    getChildComVal(val) {
      this.isCheck = val;
    },
    getChildComValOne(val) {
      this.isCheckOne = val;
    },
    getFormat(val) {
      this.isSkillFormat = val;
    },
    getFormatOne(val) {
      this.isSkillFormatOne = val;
    },
    getRepeat(val) {
      this.noRepeat = val;
    },
    getRepeatOne(val) {
      this.noRepeatOne = val;
    },
    /* 取消 */
    cancel() {
      this.$confirm(this.$t('crEvent.confirmCancel'), this.$t('common.info'), {
        type: 'warning',
      })
        .then(() => {
          this.goList();
        })
        .catch(() => { });
    },
    goList() {
      if (this.idKey) {
        IndexDB.dbOperation('team', 'delete', this.idKey).then((res) => {
          setTimeout(() => {
            // this.$router.push({ name: '/admin/event/list-train-team' });
            this.$router.push({ name: this.$route.meta?.breadcrumb?.parentName });
          }, 100);
        });
      } else {
        // this.$router.push({ path: '/admin/event/list-train-team' });
        this.$router.push({ name: this.$route.meta?.breadcrumb?.parentName });
      }
    },
    /**
     * 获取模板截图
     */
    async getImagePath() {
      this.screenShotStatus = true;
      await this.$refs.topologyEditor.getScreenShot().then((res) => {
        const file = new File([res], 'file.png', { type: 'png' });
        const formData = new FormData();
        formData.append('file', file);
        this.$request
          .post(`/cscene/file/scene_template_screenshot_upload`, formData, {
            baseURL: '/api/mp',
          })
          .then((childRes) => {
            this.screenShotStatus = false;
            this.sceneLogo = childRes.data.data.http_url;
          });
      });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .steps-form>.el-form {
  padding: 0;
}

::v-deep .steps-form {
  padding: 7px 16px 32px 16px;
}

.event-team-detail {
  .body {
    .header-steps {
      padding: 0 30px;
    }

    /* margin: 10px 10px; */
    .body-pane {
      min-height: 600px;
      margin-top: 7px;
    }

    .foot-button {
      margin-top: 12px;
      text-align: center;
    }
  }

  .elc-cr-scene-topology-editor {
    height: 600px;
  }
}

.event-team-bg {
  position: relative;
}
</style>
