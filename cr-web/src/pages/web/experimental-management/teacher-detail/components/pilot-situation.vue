<template>
  <div class="control-content">
    <div class="situation-content">
      <!-- 新增方案 -->
      <div class="control-top">
        <div style="display: flex">
          <cb-button type="primary" icon="icon-xinzeng" @click="addPlan">{{
            $t('dynamicControl.addPlan')
          }}</cb-button>
          <!-- 导入动效方案导出动效方案按钮 -->
          <cb-button
            button-type="import"
            @click="importFn"
            hollow
            style="margin: 0px 8px"
          >
            {{ $t('dynamicControl.importPlan') }}</cb-button
          >

          <cb-button button-type="export" loading hollow @click="exportFn">
            {{ $t('dynamicControl.exportPlan') }}
          </cb-button>

          <!-- 新增方案弹框 -->
          <cb-dialog
            :visible.sync="visibleValue"
            width="480px"
            @close="closeDialog()"
          >
            <template slot="title">
              <div>{{ $t('dynamicControl.addPlan') }}</div>
            </template>
            <div>
              <cb-form
                ref="fromRef"
                label-width="95px"
                label-position="right"
                :rules="rules"
                :model.sync="model"
              >
                <cb-form-item
                  :label="$t('dynamicControl.planName')"
                  prop="name"
                >
                  <cb-input
                    v-model="model.name"
                    :placeholder="$t('dynamicControl.enterPlanName')"
                  />
                </cb-form-item>
              </cb-form>
            </div>
            <template slot="footer">
              <div>
                <cb-button-group>
                  <cb-button button-type="confirm" @click="addName">
                  </cb-button>
                  <cb-button button-type="cancel" @click="cancelName">
                  </cb-button>
                </cb-button-group>
              </div>
            </template>
          </cb-dialog>
        </div>
        <!-- 采集分析按钮 -->
        <div>
          <cb-switch
            class="switch-button"
            v-model="flow_analysis"
            :inactive-text="$t('dynamicControl.flow')"
          >
          </cb-switch>
          <cb-switch
            class="switch-button"
            v-model="flow_auto_run"
            :inactive-text="$t('dynamicControl.flowRun')"
            style="margin-left: 16px"
          >
          </cb-switch>
        </div>
      </div>
      <!-- 方案内容 -->
      <div class="control-center">
        <div class="control-center-top">
          <cb-select
            width="264px"
            v-model="effectValue"
            class="plan-content"
            :popper-append-to-body="false"
          >
            <cb-option
              v-for="(item, index) in options"
              :key="item.resource_id"
              :label="item.name"
              :value="item.resource_id"
              :title="item.name"
            >
            </cb-option>
          </cb-select>
          <cb-button
            v-if="options.length > 0"
            button-type="delete"
            hollow
            @click="deleteHandler(true, $event)"
            >{{ $t('dynamicControl.deletePlan') }}
          </cb-button>
        </div>
        <div class="no-data" v-if="options.length <= 0">
          <div class="info">
            <cb-iconfont
              type="icon-zanwuziyuan"
              size="80"
              class="no-data-icon"
            ></cb-iconfont>
            <div>{{ $t('dynamicControl.noPlan') }}</div>
          </div>
        </div>
        <div v-else>
          <!-- 方案主要内容组件 -->
          <simple-fish-bone
            v-model="combatData"
            ref="fishbone"
            :controlSceneId="controlSceneId"
            :controlTopoId="controlTopoId"
          >
          </simple-fish-bone>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="control-foot">
      <cb-button-group space="middle" v-if="options.length <= 0">
        <cb-button button-type="confirm" @click="submitForm" disabled>{{
          $t('dynamicControl.savePlan')
        }}</cb-button>
      </cb-button-group>
      <cb-button-group space="middle" v-else>
        <cb-button @click="runForm" hollow>{{
          $t('dynamicControl.runPlan')
        }}</cb-button>
        <cb-button button-type="confirm" @click="submitForm">{{
          $t('dynamicControl.savePlan')
        }}</cb-button>
      </cb-button-group>
    </div>
  </div>
</template>

<script>
import SimpleFishBone from './situation-control/index.vue';
import { validatePlanName } from '@/utils/team-control.js';
import { getSysSettings } from '@cyber/helper';
import { getToken } from '@cyber/helper';
import ws from '@/utils/control-ws';
export default {
  props: {
    // 接收场景启动场景id
    controlSceneId: {
      type: String,
      default: '',
    },
    // 接收场景未启动拓扑id
    controlTopoId: {
      type: String,
      default: '',
    },
  },
  components: {
    SimpleFishBone,
  },
  data() {
    return {
      flow_analysis: false,
      flow_auto_run: false,
      visibleValue: false,
      value: '',
      combatData: [],
      model: {
        name: '',
      },
      options: [],
      effectValue: '',
      rules: {
        name: [
          {
            required: true,
            message: this.$t('dynamicControl.enterPlanName'),
            trigger: 'blur',
          },
          { validator: validatePlanName, trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.scene_id = this.controlSceneId
      ? this.controlSceneId
      : this.controlTopoId;
    if (this.scene_id === this.controlTopoId) {
      this.is_instance = false;
    } else {
      this.is_instance = true;
    }

    //进去请求获取场景
    this.getSituation();
    // 设置动效控制台title
    getSysSettings().then((res) => {
      try {
        const titleData =
          res.data.data.find((item, index) => {
            return item.key_name === 'system_name';
          }) || {};
        document.title = titleData?.value || '';
      } catch (error) {
        // console.log(error);
      }
    });
  },
  mounted() {
    this.planUpdate('frist');
    //控制台调用ws
    if (this.$route.query.scene_id) {
      ws.cbind(
        `/ojj/ws/situation/scene?scene_id=${
          this.$route.query.scene_id
        }&token=${getToken()}`,
        (res) => {
          if (res.code === 'scene_config') {
            //更新修改接口值
            this.flow_analysis = res.data.flow_analysis; //流量采集分析
            this.flow_auto_run = res.data.flow_auto_run; //自动运行流
          }
        },
      );
    }
  },
  methods: {
    //导入动效方案
    importFn() {
      const that = this;
      const fileType = ['zip'];
      const inputFile = document.createElement('input');
      inputFile.type = 'file';
      inputFile.style.display = 'none';
      document.body.appendChild(inputFile);
      inputFile.click();
      inputFile.addEventListener('change', function () {
        const file = inputFile.files[0];
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
        if (!fileType.includes(testmsg)) {
          that.$message.warning(that.$t('dynamicControl.upFile'));
          document.body.removeChild(inputFile);
          return false;
        }
        const formData = new FormData();
        formData.append('file', file);

        formData.append('scene_id', that.scene_id);
        // 导入接口增加参数is_instance
        formData.append('is_instance', that.is_instance);
        that.$request
          .post('/situation/control/scheme/import', formData, {
            baseURL: '/api/ojj',
          })
          .then((res) => {
            // 导入成功展示中间数据
            that.effectValue = res.data.data;
            that.requireControl(that.effectValue);
          })
          .finally(() => {
            document.body.removeChild(inputFile);
          });
      });
    },

    //导出动效方案
    exportFn(done) {
      this.$request
        .binaryDownload(
          'get',
          '/situation/control/scheme/export',
          { resource_id: this.effectValue },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {})
        .finally(() => {
          done();
        });
    },
    //获取态势场景接口
    getSituation() {
      this.$request
        .get(
          '/situation/scene_config',
          { scene_id: this.scene_id, is_instance: this.is_instance },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.flow_analysis = res.data.data.flow_analysis; //流量采集分析
          this.flow_auto_run = res.data.data.flow_auto_run; //自动运行流量
          this.link_status = res.data.data.link_status; //链路状态
          this.refresh_rate = res.data.data.refresh_rate; //每隔几秒请求
        })
        .catch((error) => {});
    },
    //修改态势场景接口
    changeSituation(key) {
      const situationParams = {
        flow_analysis: this.flow_analysis,
        flow_auto_run: this.flow_auto_run,
        scene_id: this.scene_id,
        is_instance: this.is_instance,
      };
      this.$request
        .patch('/situation/scene_config', situationParams, {
          baseURL: '/api/ojj',
        })
        .then((res) => {})
        .catch((error) => {
          if (key === 'flow_analysis') {
            this.flow_analysis = false;
            // this.flow_analysis = !this.flow_analysis;
            return;
          }
          if (key === 'flow_auto_run') {
            this.flow_auto_run = false;
            // this.flow_auto_run = !this.flow_auto_run;
            return;
          }
        });
    },
    closeDialog() {
      this.model.name = '';
    },
    planUpdate(index) {
      // 选择动效方案下拉框接口
      this.$request
        .get(
          'situation/control/scheme_names',
          { scene_id: this.scene_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.options = res.data.data;
          //服务端需要排序,倒排res.data.data[0],重复校验
          if (index) {
            this.effectValue = res?.data?.data[0]?.resource_id;
          }
          // 请求中间数据
          if (res.data.data.length > 0) {
            this.requireControl();
          }
        });
    },
    //获取中间数据
    requireControl() {
      this.$request
        .get(
          'situation/control/scheme',
          { resource_id: this.effectValue },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const nodeData = res.data.data.scheme_data.map((item) => {
            return {
              ...item,
              attack_message_req_list: item.attack_message_req_list.map(
                (ele) => {
                  return {
                    ...ele,
                    title: ele.description,
                    media_animation_list: ele.media_animation_list.map((i) => {
                      return {
                        ...i,
                        direction: Number(i.direction),
                        source_id_media: i.source_id,
                        list: [{ name: i.name, url: i.url }],
                      };
                    }),
                  };
                },
              ),
            };
          });
          this.combatData = nodeData;
        });
    },
    // 新增方案
    addPlan() {
      this.visibleValue = true;
    },
    addName() {
      this.$refs.fromRef.validate((valid, index) => {
        if (valid) {
          this.visibleValue = false;
          // 新增动效方案接口
          this.$request
            .post(
              '/situation/control/scheme',
              { ...this.model, scene_id: this.scene_id },
              {
                baseURL: '/api/ojj',
              },
            )
            .then((res) => {
              this.model.name = '';
              this.planUpdate('frist');
            })
            .catch((res) => {
              this.model.name = '';
            });
        } else {
          return;
        }
      });
    },
    cancelName() {
      this.model.name = '';
      this.visibleValue = false;
    },
    // 保存动效方案
    submitForm() {
      if (this.combatData.length <= 0) {
        this.$message.warning(this.$t('dynamicControl.addNewPlan'));
        return;
      }
      const scheme_data = this.combatData.map((item) => {
        return {
          ...item,
          attack_message_req_list: item.attack_message_req_list.map((ele) => {
            return {
              ...ele,
              description: ele.title,
              media_animation_list: ele.media_animation_list.map((i) => {
                return {
                  ...i,
                  direction: Number(i.direction),
                  source_id: i.source_id_media,
                };
              }),
            };
          }),
        };
      });
      const params = {
        scene_id: this.scene_id,
        resource_id: this.effectValue,
        name: this.options.find((item) => item.resource_id === this.effectValue)
          .name,
        scheme_data: scheme_data,
      };
      this.$request
        .patch(
          '/situation/control/scheme',
          { ...params },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.$message.success(this.$t('dynamicControl.saveSuccess'));
        });
    },
    // 运行动效方案
    runForm() {
      if (this.combatData.length <= 0) {
        this.$message.warning(this.$t('dynamicControl.addNewPlan'));
        return;
      }
      const scheme_data = this.combatData.map((item) => {
        return {
          ...item,
          attack_message_req_list: item.attack_message_req_list.map((ele) => {
            return {
              ...ele,
              description: ele.title,
              media_animation_list: ele.media_animation_list.map((i) => {
                return {
                  ...i,
                  direction: Number(i.direction),
                  source_id: i.source_id_media,
                };
              }),
            };
          }),
        };
      });
      const params = {
        scene_id: this.scene_id,
        resource_id: this.effectValue,
        name: this.options.find((item) => item.resource_id === this.effectValue)
          .name,
        scheme_data: scheme_data,
        is_instance: this.is_instance,
      };

      //运行动效方案接口
      this.$request
        .post(
          '/situation/control/run_dynamic_scheme',
          { ...params },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.$message.success(this.$t('dynamicControl.runSuccess'));
        })
        .catch(() => {});
    },
    //删除动效方案
    deleteHandler(data, done) {
      this.$request
        .delete(
          `/situation/control/scheme`,
          { scheme_ids: [this.effectValue] },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          //下拉框请求
          this.$request
            .get(
              'situation/control/scheme_names',
              { scene_id: this.scene_id },
              { baseURL: '/api/ojj' },
            )
            .then((res) => {
              this.options = res.data.data;
              //服务端需要做个排序,倒排res.data.data[0],重复校验
              if (res.data.data.length > 0) {
                this.effectValue = res.data.data[0].resource_id;
              } else {
                this.effectValue = '';
                return;
              }

              // 中间数据请求
              this.requireControl();
            });

          done();
        })
        .catch((err) => {
          done(false);
        });
    },
  },
  watch: {
    effectValue: {
      handler(nv, ov) {
        if (nv !== ov) {
          this.effectValue = nv;
          this.planUpdate();
        }
      },
    },
    //流量采集与分析
    flow_analysis(newValue, oldValue) {
      //调用修改态势场景配置接口
      this.flow_analysis = newValue;
      this.changeSituation('flow_analysis');
    },
    //自动运行流量
    flow_auto_run(newValue, oldValue) {
      this.flow_auto_run = newValue;
      //调用修改态势场景配置接口
      this.changeSituation('flow_auto_run');
    },
  },
};
</script>

<style scoped lang="scss">
.control-content {
  width: 100%;
  // height: 100%;
  height: calc(100% - 50px);
  padding: 16px;
  background: var(--bg-color-2);
  position: relative;
  .situation-content {
    width: 100%;
    height: 100%;
  }
  .control-foot {
    position: absolute;
    bottom: 0;
    left: 0%;
    background: var(--bg-color-2);
    justify-content: end;
    width: 100%;
    height: 56px;
    line-height: 56px;
    box-shadow: 6px 0px 20px 0px var(--box-shadow-color);
    z-index: 99;
    padding-top: 12px;
    padding-right: 16px;
    // left: 136px;
    .cb-button-group {
      float: right;
    }
  }

  .title {
    font-size: 24px;
    font-weight: 600;
    color: var(--neutral9);
    text-align: center;
    margin-top: 40px;
    margin-bottom: 32px;
  }

  .control-top {
    display: flex;
    justify-content: space-between;
    background: var(--bg-color-2);
    .switch-button {
      height: 36px;
    }
  }
  .control-center {
    height: calc(100% - 100px);
    // height: 656px;
    background: var(--bg-color-2);
    padding-top: 16px;
    .control-center-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .no-data {
      width: 100%;
      min-height: 588px;
      text-align: center;
      position: relative;
      .no-data-icon {
        color: var(--neutral4);
      }

      .info {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        div {
          color: var(--neutral4);
        }
      }
    }
  }
}
::v-deep.plan-content {
  .el-scrollbar {
    .el-select-dropdown__wrap {
      .el-scrollbar__view {
        width: 264px;
      }
    }
  }
}
</style>
