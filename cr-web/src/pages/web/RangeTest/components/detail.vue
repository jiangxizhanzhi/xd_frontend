<template>
  <cb-inner-page :background="false">
    <div class="add-test">
      <!-- 步骤条 -->
      <cb-steps
        class="step-position"
        :active="active"
        style="width: 80%"
        simple
        :data="stepDatas"
      >
      </cb-steps>
      <br />
      <!-- 基础信息 -->
      <cb-form
        class="basic-form"
        v-if="active === 1"
        ref="fromRef"
        width="80%"
        label-position="right"
        :label-width="getI18N().locale == 'en-US' ? '140px' : '80px'"
        background-color
        :model.sync="model"
        :rules="rules"
      >
        <cb-form-item :label="$t('test.TestName')" prop="name">
          <cb-input
            v-model="model.name"
            :placeholder="$t('test.EnterTestName')"
            type="text"
          ></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('test.TestDesc')" prop="desc">
          <cb-input
            type="textarea"
            :rows="2"
            v-model="model.desc"
            :placeholder="$t('test.EnterTestDesc')"
          ></cb-input>
        </cb-form-item>
        <!-- 上传logo -->
        <cb-form-item :label="$t('test.logo')" prop="logo">
          <cb-input v-model="model.logo" style="display: none" />
          <cb-upload-file
            v-model="list"
            :fetch-promise="uploadFunc"
            accept=".png,.jpg"
            :tipText="$t('test.AdviceSize')"
            :fileSize="10 * 1024 * 1024"
            @delete="removeLogo"
          ></cb-upload-file>
        </cb-form-item>

        <!-- ----------- -->
        <cb-form-item :label="$t('test.testCategory')" prop="category">
          <cb-radio-group v-model="model.category">
            <cb-radio
              :key="item.code"
              v-for="item in classifyLists"
              :label="item.code"
              >{{ item.name }}</cb-radio
            >
          </cb-radio-group>
        </cb-form-item>

        <!-- 选择测试参与人员 -->
        <cb-form-item :label="$t('test.participant')" prop="">
          <cb-button button-type="add" hollow @click="dialogVisible = true">{{
            $t('test.add')
          }}</cb-button>
          <div v-if="model.operation_auth_type == 1">
            <span>{{ $t('test.selectAll') }}</span>
          </div>
          <div v-else-if="model.operation_auth_type == 2">
            <span>
              {{ $t('test.haveSelected') }}
            </span>
            <span class="item-num">
              {{ model.auth_user_ids.length }}
            </span>
            <span>
              {{ $t('test.selectedParticipant') }}
            </span>
          </div>
        </cb-form-item>

        <cb-form-item :label="$t('test.IsRecord')">
          <cb-switch v-model="model.is_screen"></cb-switch>
        </cb-form-item>
      </cb-form>
      <!-- 场景编排 -->
      <div v-if="active === 2" style="height: 640px; padding: 0 16px">
        <scene-editor
          ref="sceneEditor"
          :title="model.name"
          :topology-data="model.scene_config_data"
          :scene-config="sceneConfig"
          :sceneConfigId="sceneConfigId"
        ></scene-editor>
      </div>
      <!-- 测试步骤 -->
      <div class="test-proc" v-if="active === 3">
        <div class="test-content">
          <!-- 列表数据 -->
          <div
            class="test-list"
            v-for="(item, index) in step_config"
            :key="item.stage"
            @mouseover="mouseover(index)"
            @mouseout="mouseout()"
          >
            <div class="left-content">
              <div class="stage-outline">
                <div class="stage">{{ item.stage }}</div>
              </div>
            </div>
            <div class="right-content">
              <div :title="item.title" class="title">{{ item.title }}</div>
              <div :title="item.process" class="process">
                {{ item.process }}
              </div>
              <!-- 编辑删除图标 -->
              <transition name="el-fade-in">
                <div class="edit-delete-btn" v-show="index === activeList">
                  <div @click="editProc(item, index)">
                    <cb-iconfont type="icon-bianji" size="16" />
                  </div>
                  <div @click="removeProc(item)">
                    <cb-iconfont type="icon-shanchu" size="16" />
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <!-- 新增步骤按钮 -->
          <cb-button
            :class="[step_config.length ? 'add-btn' : 'add-btn2']"
            icon="icon-xinzeng"
            color-type="hollow"
            @click="addProc"
            >{{ $t('test.AddStep') }}
          </cb-button>
          <!-- 新增编辑步骤对话框 -->
          <cb-dialog
            width="550px"
            :visible.sync="visibleValue"
            :append-to-body="true"
          >
            <template slot="title">
              <div>{{ $t('test.Step') }}</div>
            </template>

            <cb-form
              ref="procFromRef"
              width="100%"
              label-position="right"
              :label-width="getI18N().locale == 'en-US' ? '140px' : '80px'"
              background-color
              :model.sync="modelDialog"
              :rules="dialogRules"
            >
              <cb-form-item :label="$t('test.StepName')" prop="procName">
                <cb-input
                  v-model="modelDialog.procName"
                  :placeholder="$t('test.EnterStepName')"
                  type="text"
                ></cb-input>
              </cb-form-item>
              <cb-form-item :label="$t('test.OperationProc')" prop="operation">
                <cb-input
                  type="textarea"
                  :rows="4"
                  v-model="modelDialog.operation"
                  :placeholder="$t('test.EnterOperationProc')"
                ></cb-input>
              </cb-form-item>
            </cb-form>
            <div class="dialog-btns" slot="footer">
              <cb-button button-type="confirm" @click="dialogsubmit" mr
                >{{ $t('test.Confirm') }}
              </cb-button>
              <cb-button button-type="cancel" @click="dialogCancel"
                >{{ $t('test.Cancel') }}
              </cb-button>
            </div>
          </cb-dialog>
        </div>
      </div>

      <!-- 步骤一的授权弹窗 -->
      <auth-dialog
        v-if="dialogVisible"
        :dialogVisible.sync="dialogVisible"
        :auth-type.sync="model.operation_auth_type"
        :auth-users.sync="model.auth_user_ids"
      ></auth-dialog>

      <!-- 下方切换步骤按钮 -->
      <div class="btn">
        <cb-button button-type="cancel" @click="upStep" v-show="active > 1" mr
          >{{ $t('test.PreStep') }}
        </cb-button>
        <cb-button v-show="active === 3" @click="confirm" mr>
          {{ $t('test.Finish') }}
        </cb-button>
        <cb-button v-show="active < 3" @click="nextStep" mr>{{
          $t('test.NextStep')
        }}</cb-button>
        <cb-button button-type="cancel" @click="cancel">
          {{ $t('crEvent.cancel') }}
        </cb-button>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import { getI18N } from '@cyber/helper';
import {
  getCategory,
  addTest,
  getEditBackData,
  editTest,
} from '@/api/web/range-test.js';
import Validate from '@/utils/validate.js';
import { SceneEditor } from '@cyber/scene';
import IndexDB from '@/utils/indexDB.js';
import AuthDialog from './auth-dialog.vue';
export default {
  components: {
    SceneEditor,
    AuthDialog,
  },
  // 编辑id
  props: {
    editId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      stepDatas: [
        { title: this.$t('test.basicInformation') },
        { title: this.$t('test.TopoArrange') },
        { title: this.$t('test.EvalStep') },
      ],
      // logo上传list
      list: [],
      // 当前激活步骤条
      active: 1,
      // 测试类型
      classifyLists: [],
      // 场景菜单栏配置
      sceneConfig: {
        menubar: ['topology', 'probe', 'flow'],
        showMenu: true,
        toolbar: [],
        showToolbar: true,
      },
      model: {
        name: '',
        desc: '',
        logo: '',
        is_screen: false,
        category: 1,
        // 步骤对话框
        visibleValue: false,
        loading: true,
        scene_config_data: {
          scene_config: {},
          roles: [],
          logo: '',
          id: '',
        },
        scene_config_data_indexdb: {
          scene_config: {},
          roles: [],
          id: '',
          // logo: '',
        },
        logo_path: '', // 用于缓存logo
        step_config: [], //用于缓存评估步骤
        auth_user_ids: [], // 授权用户id列表
        operation_auth_type: 1, // 授权模式 1 全部授权 2 自定义授权
      },
      // 第三步骤对话框
      modelDialog: {
        procName: '',
        operation: '',
      },
      // 判断对话框是增加还是编辑
      add_edit: '',
      procIndex: '',
      rules: {
        name: [
          {
            required: true,
            validator: Validate.name255,
            trigger: ['blur', 'change'],
          },
        ],
        desc: [
          {
            validator: Validate.testDesc2048,
            trigger: ['blur', 'change'],
          },
        ],
        logo: [
          {
            required: true,
            message: this.$t('test.UploadImage'),
            trigger: ['blur', 'change'],
          },
        ],
        category: [
          {
            required: true,
            message: this.$t('test.SelectTestCategory'),
            trigger: 'change',
          },
        ],
      },
      dialogRules: {
        procName: [
          {
            required: true,
            message: this.$t('test.EnterStepName'),
            trigger: ['blur', 'change'],
          },
          {
            validator: Validate.name255,
            trigger: ['blur', 'change'],
          },
        ],
        operation: [
          {
            required: true,
            message: this.$t('test.EnterOperationProc'),
            trigger: ['blur', 'change'],
          },
          {
            validator: Validate.operationProc2048,
            trigger: ['blur', 'change'],
          },
        ],
      },
      file: null,
      // 步骤列表
      step_config: [],
      // 控制对话框显示隐藏
      visibleValue: false,
      // 当前激活列表
      activeList: '',
      // 判断第三步确认按钮是增加还是编辑操作
      add_edit_confirm: 'addConfirm',
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
      dialogVisible: false, // 授权弹窗显示隐藏
      sceneConfigId: '',
    };
  },
  computed: {
    cacheAdd() {
      return this.$store.state.user.id + '-add';
    },
    cacheEdit() {
      return this.$store.state.user.id + '-' + this.editId;
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
    },
    modelNew: {
      handler(val, oldval) {
        // 用于判断新增时 数据改变(&& 编辑已经回显后的model数据变化)
        if (JSON.stringify(val) !== JSON.stringify(oldval)) {
          this.changeCount++;

          if (
            (this.editId &&
              !this.haveCache &&
              this.active === 1 &&
              this.changeCount >= 2 &&
              !this.goTwo) ||
            (this.editId &&
              !this.haveCache &&
              this.active === 1 &&
              this.changeCount > 3 &&
              this.goTwo) ||
            (this.editId &&
              !this.haveCache &&
              this.active === 2 &&
              this.changeCount > 2) ||
            (this.editId &&
              !this.haveCache &&
              this.active === 3 &&
              this.changeCount > 3) ||
            (this.editId && this.haveCache && this.changeCount > 1) ||
            (!this.editId && this.changeCount >= 1)
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
    IndexDB.dbInit('range');
    this.timerGetTopo = setInterval(() => {
      if (this.active === 2 && this.$refs.sceneEditor) {
        const sceneData = this.$refs.sceneEditor.getData();
        _.set(
          this.model,
          'scene_config_data_indexdb.scene_config',
          _.cloneDeep(sceneData.scene_config),
        );
        _.set(
          this.model,
          'scene_config_data_indexdb.id',
          _.cloneDeep(sceneData.id),
        );
      } else if (this.active === 3) {
        this.model.step_config = this.step_config;
      }
    }, 2000);
    this.debounceCacheAdd = _.debounce(
      () => {
        this.addIndexDB();
      },
      1000,
      {
        leading: true,
      },
    );
  },
  async mounted() {
    this.getType();
    this.cacheAllList = await IndexDB.dbOperation('range', 'getAll');
    // 如果有值，则去判断是否有本人的缓存
    this.myCacheList = _.filter(this.cacheAllList, (item) => {
      const idSplit = item.id.slice(0, 32); // 截取uesrId
      return idSplit === this.$store.state.user.id;
    });
    if (this.myCacheList && this.myCacheList[0]) {
      this.haveCache = true;
      this.idKey = this.myCacheList[0].id;
      this.model = this.myCacheList[0];
      this.model.scene_config_data = _.cloneDeep(
        this.model.scene_config_data_indexdb,
      );
      this.sceneConfigId = this.model.scene_config_data_indexdb.id;
      if (this.model.logo_path) {
        this.list.push({ url: this.model.logo_path });
      }
      this.step_config = this.model.step_config || [];
    } else {
      if (this.editId) {
        this.editBack();
      }
    }
  },
  beforeDestroy() {
    this.debounceCacheAdd = undefined;

    if (this.timerGetTopo) {
      clearTimeout(this.timerGetTopo);
    }
  },
  methods: {
    async addIndexDB() {
      let data = {};
      if (!this.idKey) {
        this.idKey = this.editId ? this.cacheEdit : this.cacheAdd;
        data = {
          id: this.idKey,
          ...this.model,
        };
        await IndexDB.dbOperation('range', 'add', data);
      } else {
        data = {
          id: this.idKey,
          ...this.model,
        };
        await IndexDB.dbOperation('range', 'put', data);
      }
    },
    upStep() {
      this.active--;
      this.setTopologyData();
    },
    nextStep() {
      //  验证表单正确性
      if (this.active === 1) {
        this.validateForm();
      } else {
        this.setTopologyData();
        this.active++;
      }
    },
    cancel() {
      this.$confirm(this.$t('crEvent.confirmCancel'), this.$t('common.info'), {
        type: 'warning',
      })
        .then(() => {
          this.goList();
        })
        .catch(() => {});
    },
    // 第一步验证规则
    validateForm() {
      // 增加校验
      if (!this.editId) {
        this.$refs.fromRef.validate((valid) => {
          if (!valid) {
            return false;
          } else {
            this.$request
              .post(
                '/cr/eval/template/validate_info',
                {
                  category_code: this.model.category,
                  description: this.model.desc,
                  enable_recording: this.model.is_screen,
                  logo_id: this.model.logo,
                  name: this.model.name,
                  // resource_id: this.editId,
                },
                {
                  baseURL: '/api/ojj',
                },
              )
              .then((res) => {
                this.active++;
              });
          }
        });
      } else {
        // 编辑校验
        this.$refs.fromRef.validate((valid) => {
          if (!valid) {
            return false;
          } else {
            this.$request
              .post(
                '/cr/eval/template/validate_info',
                {
                  category_code: this.model.category,
                  description: this.model.desc,
                  enable_recording: this.model.is_screen,
                  logo_id: this.model.logo,
                  name: this.model.name,
                  resource_id: this.editId,
                },
                {
                  baseURL: '/api/ojj',
                },
              )
              .then((res) => {
                this.active++;
              });
          }
        });
      }
    },
    // 取消
    // cancel () {
    //   this.$router.push({ path: `/range-test` });
    // },
    // 确认
    confirm() {
      this.addTestTemplate();
    },
    // 获取测试类型
    getType() {
      getCategory({
        type: 4,
      }).then((res) => {
        this.classifyLists = res.data.data;
      });
    },
    // 处理logo上传拿到resource_id,作为添加模板的请求参数
    uploadFunc(file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 10);
      const config = {
        header: { 'Content-Type': 'multipart/form-data' },
        baseURL: '/api/ojj',
      };
      this.$request
        .post('/common/web/image_upload', formData, config)
        .then((res) => {
          this.model.logo = res.data.data.resource_id;
          this.model.logo_path = res.data.data.file_path;
        })
        .catch((error) => {
          this.$serverError(error);
        });
    },
    removeLogo() {
      this.model.logo = '';
      this.model.logo_path = '';
    },

    getImgUrl(data) {},
    // 对话框确认
    dialogsubmit() {
      this.$refs.procFromRef.validate((valid) => {
        if (!valid) return false;
        // 判断是增加还是编辑
        switch (this.add_edit) {
          case 'add':
            this.step_config.push({
              stage: this.step_config.length + 1,
              title: this.modelDialog.procName,
              process: this.modelDialog.operation,
            });
            break;
          case 'edit':
            this.step_config[this.procIndex].title = this.modelDialog.procName;
            this.step_config[this.procIndex].process =
              this.modelDialog.operation;
            break;
        }
        this.visibleValue = false;
        this.modelDialog.procName = '';
        this.modelDialog.operation = '';
        this.model.step_config = this.step_config;
      });
    },
    // 对话框取消
    dialogCancel() {
      this.visibleValue = false;
      this.modelDialog.procName = '';
      this.modelDialog.operation = '';
    },
    // 新增步骤
    addProc() {
      this.visibleValue = true;
      this.add_edit = 'add';
    },
    // 编辑当前步骤
    editProc(current, index) {
      this.add_edit = 'edit';
      this.visibleValue = true;
      this.modelDialog.procName = current.title;
      this.modelDialog.operation = current.process;
      this.procIndex = index;
    },
    // 删除当前步骤
    removeProc(current) {
      this.step_config = this.step_config.filter((item) => {
        return item !== current;
      });
      // 删除之后步骤重新排序
      this.step_config.forEach((item, index) => {
        item.stage = index + 1;
      });
      this.model.step_config = this.step_config;
    },
    // 鼠标移动到当前列表改变样式
    mouseover(index) {
      this.activeList = index;
    },
    mouseout() {
      this.activeList = '';
    },
    // 步骤3确认添加模板
    addTestTemplate() {
      this.submitOpt = true;
      this.model.scene_config_data.scene_config.topology.scene.name =
        this.model.name;
      this.model.scene_config_data.logo = this.sceneLogo;
      // 增加测试模板
      if (!this.editId) {
        const data = {
          category_code: this.model.category,
          description: this.model.desc,
          enable_recording: this.model.is_screen,
          logo_id: this.model.logo,
          name: this.model.name,
          // 场景编排参数
          scene_config_data: this.model.scene_config_data,
          step_config: this.step_config,
          operation_auth_type: this.model.operation_auth_type,
          auth_user_ids: this.model.auth_user_ids.map((item) => {
            return item.id;
          }),
        };
        addTest(data).then((res) => {
          this.goList();
        });
      } else {
        // 编辑测试模板
        const data = {
          category_code: this.model.category,
          description: this.model.desc,
          enable_recording: this.model.is_screen,
          logo_id: this.model.logo,
          name: this.model.name,
          resource_id: this.editId,
          scene_config_data: this.model.scene_config_data,
          step_config: this.step_config,
          operation_auth_type: this.model.operation_auth_type,
          auth_user_ids: this.model.auth_user_ids.map((item) => {
            return item.id;
          }),
        };
        editTest(data).then((res) => {
          this.goList();
        });
      }
    },
    goList() {
      if (this.idKey) {
        IndexDB.dbOperation('range', 'delete', this.idKey).then((res) => {
          this.$router.push({ path: '/range-test' });
        });
      } else {
        this.$router.push({ path: '/range-test' });
      }
    },
    // 编辑回显
    editBack() {
      this.add_edit_confirm = 'editConfirm';
      // 根据模板id查询
      getEditBackData({
        template_id: this.editId,
      }).then((res) => {
        const data = res.data.data;
        const {
          name,
          description,
          logo_path,
          category_code,
          enable_recording,
          scene_config_data,
          step_config,
          logo_id,
          operation_auth_type,
          operation_auth_ids,
        } = data;
        this.model.name = name;
        this.model.desc = description;
        this.model.category = category_code;
        this.model.is_screen = enable_recording;
        this.model.scene_config_data = scene_config_data;
        this.step_config = step_config;
        this.model.logo = logo_id;
        this.list.push({ url: logo_path });
        this.model.logo_path = logo_path;
        this.model.step_config = step_config;
        this.model.operation_auth_type = operation_auth_type;
        this.model.auth_user_ids = operation_auth_ids;
        this.$set(
          this.model,
          'scene_config_data_indexdb',
          _.cloneDeep(scene_config_data),
        );
        this.sceneConfigId = scene_config_data.id;
      });
    },
    /**
     * 赋值场景数据
     */
    setTopologyData() {
      if (this.$refs.sceneEditor) {
        const sceneData = this.$refs.sceneEditor.getData();
        this.getImagePath();
        _.set(
          this.model,
          'scene_config_data.scene_config',
          _.cloneDeep(sceneData.scene_config),
        );
        _.set(this.model, 'scene_config_data.id', _.cloneDeep(sceneData.id));
        _.set(
          this.model,
          'scene_config_data_indexdb.scene_config',
          _.cloneDeep(sceneData.scene_config),
        );
        _.set(
          this.model,
          'scene_config_data_indexdb.id',
          _.cloneDeep(sceneData.id),
        );
      }
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
    getI18N() {
      return getI18N();
    },
  },
};
</script>

<style lang="scss" scoped>
.item-num {
  color: var(--primary-color);
}
</style>
<style lang="scss">
.add-test {
  background: var(--bg-color-2);
  padding: 24px 0;
  .basic-form {
    margin: 0 auto;
  }

  .step-position {
    margin: 0 auto;
  }

  .btn {
    margin-top: 24px;
    text-align: center;
  }

  .test-content {
    width: calc(100% - 48px);
    min-height: 200px;
    background: var(--bg-color-3);
    margin: 0 auto;
    position: relative;

    .test-list {
      position: relative;
      height: 108px;
      display: flex;
      align-items: center;
      margin-top: 0;

      &:hover {
        background: var(--bg-color-4);
        &::before {
          content: '';
          width: 4px;
          height: 108px;
          position: absolute;
          left: 0;
          background-color: var(--primary-color);
        }
      }

      .left-content {
        height: 108px;
        .stage-outline {
          flex: 1;
          width: 40px;
          height: 40px;
          line-height: 40px;
          background-color: var(--primary-color-2);
          border-radius: 50%;
          text-align: center;
          margin: 38px 28px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .stage {
          width: 32px;
          height: 32px;
          background: var(--primary-color-4);
          text-align: center;
          line-height: 32px;
          border-radius: 50%;
        }
      }

      .right-content {
        height: 108px;
        padding-right: 20px;
        flex: 1;
        border-bottom: 1px solid var(--neutral0);
        .title {
          height: 16px;
          font-size: 16px;
          font-weight: 400;
          color: var(--primary-color);
          margin-top: 30px;
          padding-right: 40px;
          -webkit-line-clamp: 1;
          text-overflow: ellipsis; //溢出用省略号显示
          display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示
          -webkit-box-orient: vertical;
          overflow: hidden;
          // 数字换行
          word-break: break-all;
        }
        .process {
          height: 30px;
          font-size: 14px;
          margin-top: 8px;
          -webkit-line-clamp: 2;
          text-overflow: ellipsis; //溢出用省略号显示
          display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示
          -webkit-box-orient: vertical;
          overflow: hidden;
          // 数字换行
          word-break: break-all;
        }
      }

      .edit-delete-btn {
        display: flex;
        justify-content: space-between;
        width: 50px;
        position: absolute;
        top: 10px;
        right: 10px;
        &:hover {
          cursor: pointer;
        }
      }
    }

    .add-btn {
      margin-top: 10px;
      margin-left: 96px;
      margin-bottom: 12px;
    }
    .add-btn2 {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-55%, -50%);
    }
  }
}
</style>
