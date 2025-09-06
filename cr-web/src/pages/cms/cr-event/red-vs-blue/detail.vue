<template>
  <cb-inner-page class="event-red-bg" :background="false">
    <div class="event-team-detail">
      <div class="body">
        <cb-form
          class="steps-form"
          ref="CeRedVsBlueFormRef"
          :model="model"
          :id="id && { resource_id: id }"
          :url="url"
          json
          :baseURL="baseURL"
          :isBgColor="true"
        >
          <!--    步骤条-->
          <div class="header-steps">
            <cb-steps :space="150" :active="active" simple :data="stepDatas">
            </cb-steps>
          </div>
          <div class="body-pane">
            <!--    基础信息-->
            <div v-show="active === 1">
              <CeRedVsBlueBaseInfo
                @sendVal="getChildComVal"
                @sendFormat="getFormat"
                ref="CeRedVsBlueBaseInfo"
                :edit-id="editId"
                :question-type="questionType"
                :role-list="model.role_list"
                :base-info="model.base_info"
                @sendRepeat="getRepeat"
                @sendValOne="getChildComValOne"
                @sendFormatOne="getFormatOne"
                @sendRepeatOne="getRepeatOne"
              />
            </div>
            <!--  拓扑编排-->
            <div v-if="active === 2" style="height: 710px">
              <scene-editor
                ref="sceneeditor"
                :title="model.base_info.name"
                :topology-data="model.base_info.scene_config_data"
                :openLayer="true"
                :sceneConfigId="sceneConfigId"
                :roles.sync="roleList"
                :sync-processing.sync="syncProcessing"
              ></scene-editor>
            </div>
            <!--  任务编排 -->
            <div v-if="active === 3">
              <RoleMission ref="RoleMission" :role-list="roleList" />
            </div>
          </div>
          <!--    底部按钮-->
          <div class="foot-button" slot="fixedBottom">
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
                >{{ $t('crEvent.cancel') }}</cb-button
              >
            </cb-button-group>
          </div>
        </cb-form>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import CeRedVsBlueBaseInfo from './components/base-info';
import RoleMission from './components/role-mission';
import { SceneEditor } from '@cyber/scene';
import { v4 as uuidv4 } from 'uuid';
import IndexDB from '@/utils/indexDB.js';
const red = uuidv4();
const blue = uuidv4();
export default {
  name: 'Edit',
  props: {
    id: {
      type: [String, Number],
      default: '',
    },
  },
  components: {
    CeRedVsBlueBaseInfo,
    RoleMission,
    SceneEditor,
  },
  data() {
    return {
      baseURL: '/api/ojj',

      isCheck: false,
      isSkillFormat: false,
      isSkillFormatOne: false,
      noRepeat: false,
      noRepeatOne: false,
      isCheckOne: false,
      stepDatas: [
        { title: this.$t('crEvent.baseInfo') },
        { title: this.$t('crEvent.topologyConfig') },
        { title: this.$t('crEvent.missionConfig') },
      ],
      // 红蓝questionType214
      questionType: 4,
      active: 1, // 步骤条
      // 新增//编辑
      // url: '/admin/red_vs_blue/red_vs_blue_templates/',
      url: '/cr/admin/red_vs_blue/red_vs_blue_templates/',
      roleList: [],
      originRole: [],
      model: {
        base_info: {
          type: '4',
          name: null,
          description: null,
          logo: '',
          category: this.$CONSTANT.CeBase.Category.PENETRATION_TEST.value,
          difficult: this.$CONSTANT.CeBase.Difficult.LOW.value,
          duration_time: 4,
          pre_skill: [],
          train_skill: [],
          scene_config_data: {
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
        red_roles: [],
        blue_roles: [],
      },
      sceneLogo: '', //
      timerGetTopo: null,
      cacheAllList: [], // 单兵所有缓存值
      myCacheList: [], // 本人的缓存
      idKey: '',
      debounceCacheAdd: undefined,
      // 记录触发监听的次数
      changeCount: 0,
      haveCache: false,
      submitOpt: false,
      goTwo: false,
      sceneConfigId: '',
      intervalSetTopo: true, // 最后提交的时候，不再更新数据库缓存
      syncProcessing: false, // 监听处理编辑器内部的同步操作
    };
  },

  computed: {
    $form() {
      return this.$refs.CeRedVsBlueBaseInfo.$form;
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
        // 用于判断新增时 数据改变(&& 编辑已经回显后的model数据变化)
        if (JSON.stringify(val) !== JSON.stringify(oldval)) {
          this.changeCount++;
          if (
            (this.id &&
              !this.haveCache &&
              this.active === 1 &&
              this.changeCount >= 2 &&
              !this.goTwo) ||
            (this.id &&
              !this.haveCache &&
              this.active === 1 &&
              this.changeCount > 3 &&
              this.goTwo) ||
            (this.id &&
              !this.haveCache &&
              this.active === 2 &&
              this.changeCount > 2) ||
            (this.id &&
              !this.haveCache &&
              this.active === 3 &&
              this.changeCount > 4) ||
            (this.id && this.haveCache && this.changeCount > 1) ||
            (!this.id && this.changeCount >= 1)
          ) {
            if (!this.submitOpt) {
              this.debounceCacheAdd && this.debounceCacheAdd();
            }
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    IndexDB.dbInit('red');
    this.timerGetTopo = setInterval(() => {
      if (this.active === 2 && this.$refs.sceneeditor) {
        // 定时获取拓扑数据
        this.getTopoTaskData('indexdb');
      } else if (this.active === 3) {
        let roles = this.$refs.RoleMission.syncCurrentRoleMissions();
        this.model.red_roles = roles[0]?.children || [];
        this.model.blue_roles = roles[1]?.children || [];
      }
    }, 1000);
    this.debounceCacheAdd = this.debounceCachFunction();
  },
  async mounted() {
    this.cacheAllList = await IndexDB.dbOperation('red', 'getAll');
    // 如果有值，则去判断是否有本人的缓存
    this.myCacheList = _.filter(this.cacheAllList, (item) => {
      const idSplit = item.id.slice(0, 32); // 截取uesrId
      return idSplit === this.$store.state.user.id;
    });
    if (this.myCacheList && this.myCacheList[0]) {
      this.haveCache = true;
      this.idKey = this.myCacheList[0].id;
      this.model = this.myCacheList[0];
      this.model.base_info.scene_config_data = _.cloneDeep(
        this.model.base_info.scene_config_data_indexdb,
      );
      this.sceneConfigId = this.model.base_info.scene_config_data_indexdb.id;

      const cacheSplit = this.myCacheList[0].id.split('-');
      if (cacheSplit[1] !== 'add' && this.id) {
        this.disposeIdRole();
      } else {
        this.roleList = [...this.model.red_roles, ...this.model.blue_roles];
      }
    } else {
      this.idInitData();
    }
  },
  beforeDestroy() {
    this.debounceCacheAdd = undefined;

    if (this.timerGetTopo) {
      clearTimeout(this.timerGetTopo);
    }
  },
  methods: {
    debounceCachFunction() {
      return _.debounce(
        () => {
          if (this.intervalSetTopo) {
            this.addIndexDB();
          }
        },
        500,
        {
          leading: true,
        },
      );
    },
    idInitData() {
      if (this.id != '') {
        this.$refs.CeRedVsBlueFormRef.getModelData().then((data) => {
          this.initData(data);
          if (this.id) {
            this.disposeIdRole();
          }
        });
      }
    },
    disposeIdRole() {
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

      this.model.red_roles.forEach((item) => {
        new_roles[0].children.push({
          asset_nodes: item.asset_nodes,
          id: uuidv4(),
          name: item.name,
          type: 'red',
          visible_nodes: item.visible_nodes,
          missions_scheme: item.missions_scheme,
        });
      });
      this.model.blue_roles.forEach((item) => {
        new_roles[1].children.push({
          asset_nodes: item.asset_nodes,
          id: uuidv4(),
          name: item.name,
          type: 'blue',
          visible_nodes: item.visible_nodes,
          missions_scheme: item.missions_scheme,
        });
      });
      this.roleList = new_roles;
      const topo_roles = _.cloneDeep(new_roles);
      topo_roles.forEach((item) => {
        if (item.children) {
          item.children.forEach((citem) => {
            delete citem.missions_scheme;
          });
        }
      });
      this.model.base_info.scene_config_data.roles = topo_roles;
      this.model.base_info.scene_config_data_indexdb.roles = topo_roles;
    },
    async addIndexDB() {
      if (!this.intervalSetTopo) return;
      let data = {};
      // 在这里cloneDeep model 然后再把roleList传给red_roles   blue_roles
      // 判断 是第二步
      const cloneModel = _.cloneDeep(this.model);
      if (this.active === 2 && this.id) {
        this.model.red_roles = this.roleList[0].children;
        this.model.blue_roles = this.roleList[1].children;
      }
      if (!this.idKey) {
        this.idKey = this.id ? this.cacheEdit : this.cacheAdd;
        data = {
          id: this.idKey,
          ...cloneModel,
        };
        await IndexDB.dbOperation('red', 'add', data);
      } else {
        data = {
          id: this.idKey,
          ...cloneModel,
        };
        await IndexDB.dbOperation('red', 'put', data);
      }
    },
    /* 取消 */
    cancel() {
      this.$confirm(this.$t('crEvent.confirmCancel'), this.$t('common.info'), {
        type: 'warning',
      })
        .then(() => {
          this.goList();
        })
        .catch(() => {});
    },
    initData(data) {
      _.forEach(this.model, (value, key) => {
        if (_.has(data, key)) {
          this.$set(this.model, key, this.dataToModel(data, key));
        }
      });

      this.$set(
        this.model.base_info,
        'scene_config_data_indexdb',
        _.cloneDeep(this.model.base_info.scene_config_data),
      );
      this.sceneConfigId = data.base_info.scene_config_data.id;
    },
    dataToModel(data, modelKey) {
      return data[modelKey];
    },
    getTopoTaskData(type) {
      let editorData = this.$refs.sceneeditor.getData();
      let { scene_config, roles, id } = editorData;
      // this.getImagePath();

      this.originRole = roles;
      if (type !== 'indexdb') {
        Object.assign(this.model.base_info.scene_config_data, {
          scene_config: _.clone(scene_config),
          roles: _.clone(roles),
          id: id,
        });
      }
      Object.assign(this.model.base_info.scene_config_data_indexdb, {
        scene_config: _.clone(scene_config),
        roles: _.clone(roles),
        id: id,
      });
      let copyRoles = _.cloneDeep(roles);
      this.setMission(copyRoles);
      Object.assign(this.roleList, copyRoles);
    },
    async next() {
      // 长度
      if (!this.isCheck) {
        this.$message.error(this.$t('crEvent.lengthLint255'));
        return false;
      }
      if (!this.isCheckOne) {
        this.$message.error(this.$t('crEvent.lengthLint255'));
        return false;
      }
      // 重复
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
        return this.$message.error(this.$t('crEvent.contentError'));
      }
      // 长度
      if (this.active === 1) {
        //  验证表单正确性
        this.validateForm();
      } else if (this.active === 2) {
        /**
         * 1. 保存编辑器拓扑数据到model.base_info.scene_config_data.scene_config里面
         * 2. 取出编辑器的角色数据，拿到页面中存入roleList
         */
        this.getTopoTaskData();
        // let editorData = this.$refs.sceneeditor.getData();
        // let { scene_config, roles } = editorData;
        this.getImagePath();

        // this.originRole = roles;
        // Object.assign(this.model.base_info.scene_config_data, {
        //   scene_config: _.clone(scene_config),
        //   roles: _.clone(roles),
        // });
        // let copyRoles = _.cloneDeep(roles);
        // this.setMission(copyRoles);
        // Object.assign(this.roleList, copyRoles);

        if (this.roleList.length <= 0) {
          this.$message.error(this.$t('crEvent.PlzAddRoles'));
          return;
        }
        let isRole = _.map(this.roleList, (item) => {
          return item.children;
        });
        if (!(isRole[0].length > 0 && isRole[1].length > 0)) {
          this.$message.error(this.$t('crEvent.bothTeamHaveLeastOne'));
          return;
        }
        await this.$refs.sceneeditor?.saveTopologyData();
        this.active++;
        this.intervalSetTopo = false;
      } else {
        if (this.active++ > 2) this.active = 3;
      }
    },

    setMission(roles) {
      roles?.forEach((role) => {
        const origin = this.handleRoleMisson(
          this.roleList,
          role.type + role.id,
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
        if (item.type + item.id === id) {
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
    /**
     * 获取模板截图
     */
    async getImagePath() {
      await this.$refs.sceneeditor.getScreenShot().then((res) => {
        const file = new File([res], 'file.png', { type: 'png' });
        const formData = new FormData();
        formData.append('file', file);
        this.$request
          .post(`/cscene/file/scene_template_screenshot_upload`, formData, {
            baseURL: '/api/mp',
          })
          .then((childRes) => {
            this.sceneLogo = childRes.data.data.http_url;
          });
      });
    },
    // 验证第一步表单的正确性
    validateForm() {
      this.$refs.CeRedVsBlueBaseInfo.$refs['base-info'].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          if (!this.validate_skill_length()) {
            this.$message.error(this.$t('crEvent.labelError'));
          } else if (
            this.$_.isEmpty(this.model.base_info.pre_skill) ||
            this.$_.isEmpty(this.model.base_info.train_skill)
          ) {
            // 验证技能标签个数
            this.$message.error(this.$t('crEvent.skillTagCanNotBeEmpty'));
            return false;
          } else {
            this.active++;
          }
        }
      });
    },
    previous() {
      if (this.active === 3) {
        // 需要把当前任务保存下
        this.$refs.RoleMission.syncCurrentRoleMissions(
          this.$refs.RoleMission.selectRole,
        );
      }
      if (this.active-- < 2) {
        this.active = 1;
      } else {
        if (this.$refs.sceneeditor) {
          let editorData = this.$refs.sceneeditor.getData();
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

        // this.model.base_info.scene_config_data.roles = this.originRole;
      }
    },
    validate_skill_length() {
      return !(
        this.$refs.CeRedVsBlueBaseInfo.$refs.preTag.inputErrorType ||
        this.$refs.CeRedVsBlueBaseInfo.$refs.trainTag.inputErrorType
      );
    },
    submit() {
      this.submitOpt = true;
      /**
       * 提交的时候，需要取出角色的数据组成 red_roles和blue_roles
       * ? 将任务列表的template-》missons
       */
      let roles = this.$refs.RoleMission.syncCurrentRoleMissions();
      this.model.red_roles = roles[0]?.children || [];
      this.model.blue_roles = roles[1]?.children || [];

      delete this.model.base_info.scene_config_data_indexdb;

      this.model.base_info.scene_config_data.logo = this.sceneLogo;

      this.model.base_info.scene_config_data.scene_config.topology.scene = {
        ...this.model.base_info.scene_config_data.scene_config.topology.scene,
        name: this.model.base_info.name,
      };

      if (this.editId) {
        this.$request
          .patch(
            this.url,
            { ...this.model, resource_id: this.editId },
            { baseURL: '/api/ojj' },
            {
              intercept: true,
            },
          )
          .then((res) => {
            this.goList();
          })
          .catch(() => {
            this.model.base_info.scene_config_data_indexdb = _.cloneDeep(
              this.model.base_info.scene_config_data,
            );
          });
      } else {
        this.$request
          .post(
            this.url,
            this.model,
            { baseURL: '/api/ojj' },
            {
              intercept: true,
            },
          )
          .then((res) => {
            this.goList();
          })
          .catch(() => {
            this.model.base_info.scene_config_data_indexdb = _.cloneDeep(
              this.model.base_info.scene_config_data,
            );
          });
      }
    },
    goList() {
      if (!this.idKey) {
        this.$router.push({ path: '/admin/event/list-red-blue' });
      } else {
        IndexDB.dbOperation('red', 'delete', this.idKey).then(() => {
          this.$router.push({ path: '/admin/event/list-red-blue' });
        });
      }
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
    submitError(ex) {
      const inst = _.get(ex, 'response.data.config', {});
      for (const key in inst) {
        const field = inst[key];
        if (field && field.message) {
          this.$message.error(field.message);
        }
      }
    },
    beforeSubmit() {},
    generateSubmitData(data) {
      const submitData = this.$_.cloneDeep(data);
      if (
        submitData.scene_config_data &&
        typeof submitData.scene_config_data.file === 'string'
      ) {
        this.$_.unset(submitData.scene_config_data, 'file');
      }
      this.$_.forEach(
        ['base_info', 'role_list', 'scene_config_data'],
        (attr) => {
          if (submitData[attr]) {
            submitData[attr] = JSON.stringify(submitData[attr]);
          }
        },
      );
      return submitData;
    },
    getChildComVal(val) {
      this.isCheck = val;
    },
    getFormat(val) {
      this.isSkillFormat = val;
    },
    getRepeat(val) {
      this.noRepeat = val;
    },
    getChildComValOne(val) {
      this.isCheckOne = val;
    },
    getFormatOne(val) {
      this.isSkillFormatOne = val;
    },
    getRepeatOne(val) {
      this.noRepeatOne = val;
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .steps-form > .el-form {
  padding: 0;
}
::v-deep .steps-form {
  padding: 7px 16px 32px 16px;
}
::v-deep .scene-all .global-mask {
  display: none;
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
.event-red-bg {
  position: relative;
}
</style>
<style lang="scss">
.event-team-detail {
  .el-tabs--border-card {
    background: transparent !important;
    box-shadow: none;
  }
}
</style>
