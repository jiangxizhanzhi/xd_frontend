<template>
  <cb-inner-page :background="false">
    <div class="event-team-detail">
      <div class="body">
        <cb-form
          class="steps-form"
          ref="techfromRef"
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
              <CeSingleTrainBaseInfo
                ref="sceneInfo"
                :edit-id="editId"
                :question-type="questionType"
                :base-info="model.event_data"
                @sendVal="getChildComVal"
                @sendValOne="getChildComValOne"
                @sendFormat="getFormat"
                @sendFormatOne="getFormatOne"
                @sendRepeat="getRepeat"
                @sendRepeatOne="getRepeatOne"
              />
            </div>
            <!--    拓扑编排-->
            <div v-if="active === 2" style="height: 710px">
              <scene-editor
                ref="sceneEditor"
                :show-mask="false"
                :title="model.event_data.name"
                :topology-data="model.event_data.scene_config_data"
                :scene-config="sceneConfig"
                :open-layer="true"
                :sceneConfigId="sceneConfigId"
                :sync-processing.sync="syncProcessing"
              ></scene-editor>
            </div>
            <!--  任务编排 -->
            <div v-show="active === 3">
              <div class="app-container scene-config-detail fishbone-container">
                <SimpleFishBone
                  v-model="model.missions_scheme.scheme_data"
                  ref="fishbone"
                  :layout.sync="model.missions_scheme.template"
                  :theme.sync="model.missions_scheme.color"
                  :isPlan="true"
                  :moduleName="moduleName"
                  :businessType="BUSINESS_TYPE.CR_CMS_SINGLE"
                >
                </SimpleFishBone>
              </div>
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
                :isCheckOne="isCheckOne"
                :noRepeat="noRepeat"
                :noRepeatOne="noRepeatOne"
                :isSkillFormat="isSkillFormat"
                :isSkillFormatOne="isSkillFormatOne"
                :disabled="syncProcessing"
              >
                {{ $t('crEvent.next') }}
              </cb-button>
              <cb-button
                v-show="active === 3"
                @click="submitReady"
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
import CeSingleTrainBaseInfo from './components/base-info';
import util from '@/utils/util';
import { handlerImageLength } from '@/utils/validate-cms';
import SimpleFishBone from '@/components/SimpleFishBone';
import LayoutSelector from '@/components/SimpleFishBone/LayoutSelector';
import { SceneEditor } from '@cyber/scene';
import { BUSINESS_TYPE } from '@/pages/cms/cr-event/constants.js';
import IndexDB from '@/utils/indexDB.js';

export default {
  name: 'TrainSingleDetail',
  components: {
    SceneEditor,
    CeSingleTrainBaseInfo,
    SimpleFishBone,
    LayoutSelector,
  },
  props: {
    id: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      BUSINESS_TYPE,
      moduleName: 'single',
      isCheck: false,
      isCheckOne: false,
      noRepeat: false,
      noRepeatOne: false,
      isSkillFormatOne: false,
      isSkillFormat: false,
      // 场景菜单栏配置
      sceneConfig: {
        menubar: ['topology'],
        showMenu: true,
        toolbar: [],
        showToolbar: true,
      },

      fishLayout: '',
      stepDatas: [
        { title: this.$t('crEvent.baseInfo') },
        { title: this.$t('crEvent.topologyConfig') },
        { title: this.$t('crEvent.missionConfig') },
      ],
      // 单兵questionType211
      questionType: 1,
      active: 1, // 步骤条
      // url: '/admin/training_single/training_single_templates/',
      url: '/cr/admin/single_train/template',
      baseURL: '/api/ojj',
      model: {
        event_data: {
          logo: '',
          name: '',
          description: '',
          category: this.$CONSTANT.TrainCategory.PENETRATION_TEST.value,
          pre_skill: [],
          train_skill: [],
          difficult: this.$CONSTANT.TeamTrain.Difficult.LOW.value,
          duration_time: 1,
          scene_config_data: {
            scene_config: {},
            roles: [],
            id: '',
          },
          scene_config_data_indexdb: {
            scene_config: {},
            roles: [],
            id: '',
          },
        },
        missions_scheme: {
          scheme_data: [],
          template: 1,
          color: 1,
        },
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
      goTwo: false, // 用于判断是否进入了第二步，第二步--第一步，无操作时 不缓存
      sceneConfigId: '',
      intervalSetTopo: true, // 最后提交的时候，不再更新数据库缓存
      syncProcessing: false, // 监听编辑器内部的同步操作
    };
  },
  computed: {
    $form() {
      return this.$refs.sceneInfo.$form;
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
    error() {
      if (this.error) {
        this.$message({
          message: this.error,
          type: 'error',
        });
      }
    },
    active() {
      if (this.active === 2) {
        this.goTwo = true;
      }
      if (this.active !== 3) {
        this.intervalSetTopo = true;
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
              this.changeCount > 3) ||
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
    IndexDB.dbInit('single');
    this.timerGetTopo = setInterval(() => {
      if (this.active === 2 && this.$refs.sceneEditor) {
        const sceneData = this.$refs.sceneEditor.getData();
        _.set(
          this.model,
          'event_data.scene_config_data_indexdb.scene_config',
          _.cloneDeep(sceneData.scene_config),
        );
        _.set(
          this.model,
          'event_data.scene_config_data_indexdb.id',
          _.cloneDeep(sceneData.id),
        );
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
    this.cacheAllList = await IndexDB.dbOperation('single', 'getAll');
    // 如果有值，则去判断是否有本人的缓存
    this.myCacheList = _.filter(this.cacheAllList, (item) => {
      const idSplit = item.id.slice(0, 32); // 截取uesrId
      return idSplit === this.$store.state.user.id;
    });
    if (this.myCacheList && this.myCacheList[0]) {
      this.haveCache = true;
      this.idKey = this.myCacheList[0].id;
      this.model = this.myCacheList[0];
      this.model.event_data.scene_config_data = _.cloneDeep(
        this.model.event_data.scene_config_data_indexdb,
      );
      this.sceneConfigId = this.model.event_data.scene_config_data_indexdb.id;
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
    idInitData() {
      if (this.id != '') {
        this.$refs.techfromRef.getModelData().then((data) => {
          this.initData(data);
        });
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
        await IndexDB.dbOperation('single', 'add', data);
      } else {
        data = {
          id: this.idKey,
          ...this.model,
        };
        await IndexDB.dbOperation('single', 'put', data);
      }
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
      // 内容
      if (!this.isSkillFormat) {
        this.$message.error(this.$t('crEvent.contentError'));
        return false;
      }
      if (!this.isSkillFormatOne) {
        this.$message.error(this.$t('crEvent.contentError'));
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

      if (this.active === 1) {
        //  验证表单正确性
        this.validateForm();
      } else if (this.active === 2) {
        // 验证拓扑数据正确性
        this.validateTopology();
        this.setTopologyData();
        if (
          _.isEmpty(
            _.get(this.model, 'event_data.scene_config_data.scene_config', {}),
          )
        ) {
          this.$message.error(this.$t('crEvent.configureScenarioData'));
          return;
        }
        await this.$refs.sceneEditor?.saveTopologyData();
        this.active++;
        this.intervalSetTopo = false;
      } else {
        if (this.active++ > 2) this.active = 3;
      }
    },
    /**
     * 赋值场景数据
     */
    setTopologyData() {
      const sceneData = this.$refs.sceneEditor.getData();
      this.getImagePath();
      _.set(
        this.model,
        'event_data.scene_config_data.scene_config',
        _.cloneDeep(sceneData.scene_config),
      );
      _.set(
        this.model,
        'event_data.scene_config_data_indexdb.scene_config',
        _.cloneDeep(sceneData.scene_config),
      );
      _.set(
        this.model,
        'event_data.scene_config_data_indexdb.id',
        _.cloneDeep(sceneData.id),
      );
      _.set(
        this.model,
        'event_data.scene_config_data.id',
        _.cloneDeep(sceneData.id),
      );
    },
    /**
     * 获取模板截图
     */
    async getImagePath() {
      await this.$refs.sceneEditor.getScreenShot().then((res) => {
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
    },
    validateForm() {
      this.$form.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          if (!this.validate_skill_length()) {
            this.$message.error(this.$t('crEvent.labelError'));
          } else if (
            this.$_.isEmpty(this.model.event_data.pre_skill) ||
            this.$_.isEmpty(this.model.event_data.train_skill)
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
      if (this.active-- < 2) {
        this.active = 1;
      } else {
        if (this.$refs.sceneEditor) {
          let editorData = this.$refs.sceneEditor.getData();
          let { scene_config, id } = editorData;
          this.getImagePath();
          this.model.event_data.scene_config_data.scene_config =
            _.clone(scene_config);
          this.sceneConfigId = id;
        } else {
          this.sceneConfigId = this.model.event_data.scene_config_data.id;
        }
      }
    },
    validate_skill_length() {
      return !(
        this.$refs.sceneInfo.$refs.preTag.inputErrorType ||
        this.$refs.sceneInfo.$refs.trainTag.inputErrorType
      );
    },
    initData(data) {
      if (!_.isEmpty(data)) {
        this.model.event_data = data.event_data;
        this.$set(
          this.model.event_data,
          'scene_config_data_indexdb',
          _.cloneDeep(data.event_data.scene_config_data),
        );
        this.model.scene_config_data = data.scene_config_data;
        this.model.missions_scheme = data.missions_scheme;
        _.forEach(this.model.missions_scheme.scheme_data, (item) => {
          this.$set(item, 'templates', item.missions);
        });
        this.sceneConfigId = data.event_data.scene_config_data.id;
      }
    },
    beforeSubmit() {
      // delete this.model.event_data.scene_config_data
    },
    generateSubmitData(data) {
      const submitData = _.cloneDeep(data);
      const scene_config_data = submitData.scene_config_data;
      if (scene_config_data !== undefined) {
        submitData.scene_config_data = JSON.stringify(scene_config_data);
      }
      if (
        submitData.missions_scheme &&
        submitData.missions_scheme.scheme_data
      ) {
        _.forEach(submitData.missions_scheme.scheme_data, (item) => {
          this.$set(item, 'missions', item.templates);
        });
      }
      delete submitData.event_data.scene_config_data_indexdb;
      return submitData;
    },
    submitReady() {
      const missionData = this.$refs.fishbone.submitMissionArrange();
      // 校验任务方案数据
      if (missionData.status === false) {
        this.$message.error(missionData.data);
      } else {
        this.submit();
      }
    },
    submit() {
      this.submitOpt = true;
      this.model.event_data.scene_config_data.logo = this.sceneLogo;
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
        if (this.model.event_data.scene_config_data.scene_config.topology) {
          this.model.event_data.scene_config_data.scene_config.topology.scene =
            {
              ...this.model.event_data.scene_config_data.scene_config.topology
                .scene,
              name: this.model.event_data.name,
            };
        }
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

      // const submitData = this.generateSubmitData(data);
      // todo 待后端修改需要传个id
      const submitData = {
        ...this.generateSubmitData(data),
        resource_id: this.id,
      };
      this.$refs.techfromRef
        .submit(submitData)
        .then((res) => {
          this.goList();
        })
        .catch((err) => {
          this.submitError(err);
          this.model.event_data.scene_config_data_indexdb = _.cloneDeep(
            this.model.event_data.scene_config_data,
          );
        });
    },
    goList() {
      if (this.idKey) {
        IndexDB.dbOperation('single', 'delete', this.idKey).then((res) => {
          this.$router.push({ path: '/admin/event/list-train-single' });
        });
      } else {
        this.$router.push({ path: '/admin/event/list-train-single' });
      }
    },
    submitError(ex) {
      const inst = _.get(ex, 'response.data', {});
      for (const key in inst) {
        const field = inst[key];
        for (const key1 in field) {
          const field1 = field[key1];
          if (field1 && field1.message) {
            this.$message.error(field1.message);
          } else {
            for (const key2 in field1) {
              const field2 = field1[key2];
              if (field2 && field2.message) {
                this.$message.error(field2.message);
              }
            }
          }
        }
      }
    },
    getChildComVal(val) {
      this.isCheck = val;
    },
    getChildComValOne(val) {
      this.isCheckOne = val;
    },
    getRepeat(val) {
      this.noRepeat = val;
    },
    getRepeatOne(val) {
      this.noRepeatOne = val;
    },
    getFormat(val) {
      this.isSkillFormat = val;
    },
    getFormatOne(val) {
      this.isSkillFormatOne = val;
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
.fishbone-container {
  ::v-deep .simple-fish-bone .canvas .canvas-inner {
    padding-top: 100px;
  }
  .fishbone-header {
    position: absolute;
    z-index: 9;
    top: 15px;
    left: 15px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    .tips {
      color: var(--green-color);
      line-height: 35px;
      margin-right: 30px;
    }
  }
}
.app-container {
  overflow: auto;
  padding: 0;
}
.app-container .scene-config-detail {
  padding: 0;
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
  .config-card {
    & > .el-tabs__content {
      overflow: hidden;
    }
  }
}
</style>
