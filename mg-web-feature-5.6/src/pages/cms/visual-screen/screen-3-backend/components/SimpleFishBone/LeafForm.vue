<template>
  <cb-dialog
    :title="
      isEdit
        ? $t('dynamicControl.editTemplate')
        : $t('dynamicControl.addTemplate')
    "
    :visible.sync="thisVisible"
    @close="close"
    :width="language === 'en-US' ? '612px' : '512px'"
  >
    <cb-image-preview
      :url-list="previewSrcList"
      v-model="previewVisible"
    ></cb-image-preview>

    <div class="preview-mp4" v-if="previewMp4Visible">
      <video controls autoplay :src="previewMp4Src"></video>
      <cb-iconfont
        @click="handleClosePreviewMp4"
        class="preview-mp4-close"
        type="icon-guanbi"
        themedColor="var(--neutral6)"
        :size="24"
      ></cb-iconfont>
      <div class="preview-close"></div>
    </div>

    <div class="simple-fish-bone--edit-leaf">
      <cb-form
        ref="form"
        :rules="rules"
        :model.sync="model"
        label-width="105px"
        json
      >
        <!-- 动效描述 -->
        <cb-form-item :label="$t('dynamicControl.dynamicDes')" prop="title">
          <cb-input
            type="textarea"
            v-model="model.title"
            style="width: 347px"
          />
        </cb-form-item>
        <!-- 动效类型-->
        <div :class="language === 'en-US' ? 'require-icon-en' : 'require-icon'">
          <cb-form-item
            :label="$t('dynamicControl.dynamic')"
            prop="type"
            :class="language === 'en-US' ? 'en-dynamic' : 'zh-dynamic'"
          >
            <cb-select
              width="248px"
              v-model="model.type"
              :popper-append-to-body="false"
            >
              <cb-option
                v-for="(item, index) in optionsType"
                :key="item.code"
                :label="item.msg"
                :value="item.code"
                :title="item.msg"
              >
              </cb-option>
            </cb-select>
          </cb-form-item>
        </div>

        <div v-if="model.type !== 'media-animation'">
          <!-- 非媒体源节点,非区域高亮普通节点-->
          <cb-form-item
            :label="$t('dynamicControl.sourceNode')"
            prop="source_id"
            v-if="
              model.type !== 'highlight-area' &&
              model.type !== 'highlight-element'
            "
          >
            <cb-select
              v-model="model.source_id"
              :placeholder="$t('dynamicControl.selectSourceNode')"
              width="248px"
              :disabled="judgeDisabled('source')"
            >
              <!-- 源节点是否可选根据 动效里面的source判断,-->
              <cb-option
                v-for="(item, index) in sourceList"
                :key="item.resource_id"
                :label="item.name"
                :value="item.resource_id"
                :title="item.name"
              >
              </cb-option>
            </cb-select>
          </cb-form-item>

          <!-- //区域高亮或者节点聚集源节点禁用且不校验源节点 -->
          <cb-form-item
            :label="$t('dynamicControl.sourceNode')"
            prop="source_ids"
            v-else
          >
            <cb-select
              v-model="model.source_ids"
              :placeholder="$t('dynamicControl.selectSourceNode')"
              width="248px"
              :disabled="judgeDisabled('source')"
            >
            </cb-select>
          </cb-form-item>
          <!-- 目标节点 -->
          <cb-form-item
            :label="$t('dynamicControl.targetNode')"
            prop="target_id"
          >
            <cb-select
              v-model="model.target_id"
              :placeholder="$t('dynamicControl.selectTargetNode')"
              width="248px"
            >
              <cb-option
                v-for="(item, index) in judgeNodeList()"
                :key="item.resource_id"
                :label="item.name"
                :value="item.resource_id"
                :title="item.name"
              >
              </cb-option>
              <!-- 3种情况todo-->
              <!--type为 element 时候的目标节点,只能选择节点-->
              <!-- type为compound的目标节点 ,支持节点和区域-->
              <!-- type为area的目标节点 ,只能选区域-->
            </cb-select>
          </cb-form-item>
          <!-- 是否聚焦 -->
          <cb-form-item
            :label="$t('dynamicControl.focusing')"
            prop="look_at_target"
          >
            <cb-switch
              v-model="model.look_at_target"
              active-color="#13ce66"
              inactive-color="#dcdfe6"
              :disabled="
                judgeAreaDisabled('area') ||
                judgeNode('highlight-element') ||
                linkOffline('link-poweroff')
              "
            >
            </cb-switch>
          </cb-form-item>
          <!-- 颜色 -->
          <cb-form-item :label="$t('dynamicControl.color')" prop="line_color">
            <cb-select
              width="248px"
              v-model="model.line_color"
              :disabled="
                judgeAreaDisabled('area') || judgeNode('highlight-element')
              "
            >
              <cb-option
                v-for="(item, index) in optionsColor"
                :key="item.code"
                :label="item.msg"
                :value="item.code"
                :title="item.msg"
              >
              </cb-option>
            </cb-select>
          </cb-form-item>
          <!-- 线形 -->
          <div
            style="display: flex"
            :class="language === 'en-US' ? 'require-line-en' : 'require-icon'"
          >
            <div>
              <cb-form-item
                :label="$t('dynamicControl.lineType')"
                prop="line_type"
              >
                <cb-select
                  width="160px"
                  v-model="model.line_type"
                  :disabled="
                    judgeAreaDisabled('area') ||
                    judgeNode('highlight-element') ||
                    linkOffline('link-poweroff')
                  "
                >
                  <cb-option
                    v-for="(item, index) in optionsLinear"
                    :key="item.code"
                    :label="item.msg"
                    :value="item.code"
                  >
                  </cb-option>
                </cb-select>
                <!-- px -->
              </cb-form-item>
            </div>
            <div style="margin-left: -75px">
              <cb-form-item prop="line_width">
                <cb-select
                  v-model="model.line_width"
                  :options="optionsSize"
                  style="width: 82px"
                  :disabled="
                    judgeAreaDisabled('area') || judgeNode('highlight-element')
                  "
                ></cb-select>
              </cb-form-item>
            </div>
          </div>
          <!-- 普通动效根据动效的duration_time字段判断是否可选-->
        </div>
        <!-- 动效方案为多媒体动效 -->

        <div v-if="model.type === 'media-animation'">
          <div
            v-for="(item, index) in model.media_animation_list"
            class="media_animation"
          >
            <div
              v-if="
                index === model.media_animation_list.length - 1 && index !== 3
              "
              @click="handleAddMedia()"
              class="add_animation"
            >
              <!-- 新增 -->
              <cb-button type="text" icon="icon-xinzeng"></cb-button>
            </div>
            <div
              v-if="model.media_animation_list.length !== 1"
              @click="handleDeleteMedia(item, index)"
              class="delete_animation"
            >
              <!-- 减少 -->
              <cb-button
                type="text"
                icon="icon-jianshao"
                class="add-btn"
              ></cb-button>
            </div>
            <!-- 位置 -->
            <cb-form-item
              :label="$t('dynamicControl.direction')"
              :prop="'media_animation_list.' + index + '.direction'"
              :rules="{
                required: true,
                message: $t('dynamicControl.selectDirection'),
                trigger: 'blur',
              }"
            >
              <cb-radio-group v-model="item.direction">
                <cb-radio :label="1">{{
                  $t('dynamicControl.upperLeft')
                }}</cb-radio>
                <cb-radio :label="2">{{
                  $t('dynamicControl.lowerLeft')
                }}</cb-radio>
                <cb-radio :label="3">{{
                  $t('dynamicControl.upperRight')
                }}</cb-radio>
                <cb-radio :label="4">{{
                  $t('dynamicControl.lowerRight')
                }}</cb-radio>
              </cb-radio-group>
            </cb-form-item>
            <!-- 媒体动效源节点单选 -->
            <cb-form-item
              :label="$t('dynamicControl.sourceNode')"
              :prop="'media_animation_list.' + index + '.source_id_media'"
              :rules="{
                required: true,
                message: $t('dynamicControl.selectSourceNode'),
                trigger: 'blur',
              }"
            >
              <cb-select
                v-model="item.source_id_media"
                :placeholder="$t('dynamicControl.selectSourceNode')"
                width="248px"
              >
                <cb-option
                  v-for="(item, index) in nodeListMedia"
                  :key="item.resource_id"
                  :label="item.name"
                  :value="item.resource_id"
                >
                </cb-option>
              </cb-select>
            </cb-form-item>
            <!-- 文件 -->
            <cb-form-item
              :label="$t('dynamicControl.file')"
              :prop="'media_animation_list.' + index + '.url'"
              :rules="{
                required: true,
                message: $t('dynamicControl.uploadFile'),
                trigger: 'blur',
              }"
            >
              <cb-input v-model="item.url" style="display: none" />
              <cb-form-item :prop="'media_animation_list.' + index + '.list'">
                <div @click="handleClickReqIndex(index)">
                  <cb-upload-file
                    v-model="item.list"
                    :isPreview="true"
                    :fetch-promise="uploadFunc"
                    accept=".png,.jpg,.jpeg,.gif,.mp4"
                    :tipText="$t('dynamicControl.fileUp')"
                    :fileSize="10 * 1024 * 1024"
                    @delete="removeLogo()"
                    @preview="previewLogo(item.list)"
                    type="file"
                  ></cb-upload-file>
                </div>
              </cb-form-item>
            </cb-form-item>
          </div>
        </div>
        <!-- <div v-if="model.type === 'media-animation'"> -->
        <cb-form-item
          :label="$t('dynamicControl.intervalTime')"
          prop="interval_time"
        >
          <cb-input v-model="model.interval_time" style="width: 55px" />
          <span>{{ $t('dynamicControl.seconds') }}</span>
        </cb-form-item>
        <!-- 新加媒体动效持续时间 -->
        <cb-form-item
          :label="$t('dynamicControl.durationTime')"
          prop="duration_time"
        >
          <cb-input v-model="model.duration_time" style="width: 55px" />
          <span>{{ $t('dynamicControl.seconds') }}</span>
        </cb-form-item>
        <!-- </div> -->
      </cb-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <cb-button @click="testEffect" mr hollow>
        {{ $t('dynamicControl.testDynamic') }}</cb-button
      >
      <cb-button button-type="confirm" @click="submit" mr />
      <cb-button button-type="cancel" @click="close" />
    </div>
  </cb-dialog>
</template>

<script>
import _ from 'lodash';
import { validateStageName } from '@/utils/visual-screen/rules';
import { getLanguage } from '@cyber/helper';
export default {
  props: ['visible'],
  data() {
    return {
      old_media_animation_list: [],
      previewSrcList: [],
      previewMp4Visible: false,
      previewMp4Src: '',
      language: getLanguage(),
      uploadIndex: '',
      thisVisible: this.visible,
      isEdit: false,
      previewVisible: false,

      optionsType: [],
      nodeList: [],
      nodeListMedia: [],
      sourceList: [],
      areaList: [],
      elementList: [],

      // media-animation
      optionsColor: [],
      optionsLinear: [],
      optionsSize: [
        {
          label: '1px',
          value: 1,
        },
        {
          label: '2px',
          value: 2,
        },
        {
          label: '3px',
          value: 3,
        },
        {
          label: '4px',
          value: 4,
        },
        {
          label: '5px',
          value: 5,
        },
      ],
      model: {
        media_animation_list: [
          {
            area_id: '',
            direction: '',
            source_id_media: '',
            url: '',
            list: [],
          },
        ],
        title: '', //动效描述
        type: '', //动效
        source_id: '', //源节点
        target_id: '', //目标节点
        duration_time: '', //持续时间
        interval_time: '', //间隔时间
        look_at_target: false, //是否聚焦
        line_color: '', //颜色
        line_type: '', //线形
        line_width: '', //大小
      },

      rules: {
        //源节点
        source_id: [
          {
            required: true,
            message: this.$t('dynamicControl.selectSourceNode'),
            trigger: 'blur',
          },
        ],
        title: [
          {
            required: true,
            message: this.$t('dynamicControl.enterDynamicDes'),
            trigger: 'blur',
          },
          // 校验任务阶段名称长度1-255
          { validator: validateStageName, trigger: 'blur' },
        ],
        // 持续时间>=0
        duration_time: [
          {
            validator: (rule, value, callback) => {
              if (String(value)) {
                if (String(value).length >= 2 && String(value)[0] === '0') {
                  callback(new Error(this.$t('dynamicControl.timeRules')));
                }
                if (value > 3600) {
                  callback(new Error(this.$t('dynamicControl.maxTimeOne')));
                }
                if (/^(?:[0-9]\d*)$/.test(value) == false) {
                  callback(new Error(this.$t('dynamicControl.timeRules')));
                }
                if (this.model.look_at_target && value < 3) {
                  callback(new Error(this.$t('dynamicControl.requireTimeTwo')));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        // 间隔时间>=0
        interval_time: [
          {
            // required: true,
            validator: (rule, value, callback) => {
              if (String(value)) {
                if (String(value).length >= 2 && String(value)[0] === '0') {
                  callback(new Error(this.$t('dynamicControl.timeRules')));
                }
                if (value > 600) {
                  callback(new Error(this.$t('dynamicControl.maxTimeTwo')));
                }
                if (/^(?:[0-9]\d*)$/.test(value) == false) {
                  callback(new Error(this.$t('dynamicControl.timeRules')));
                }
                if (
                  this.model.look_at_target &&
                  this.model.interval_time - this.model.duration_time < 2
                ) {
                  callback(new Error(this.$t('dynamicControl.requireTimeOne')));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        line_color: [
          {
            required: true,
            message: this.$t('dynamicControl.selectColor'),
            trigger: 'blur',
          },
        ],
        target_id: [
          {
            required: true,
            message: this.$t('dynamicControl.selectTargetNode'),
            trigger: 'blur',
          },
        ],
        // 位置
        direction: [
          {
            required: true,
            message: this.$t('dynamicControl.selectDirection'),
            trigger: 'blur',
          },
        ],
        // 源节点
        source_id_media: [
          {
            required: true,
            message: this.$t('dynamicControl.selectSourceNode'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  watch: {
    model: {
      handler(value, old) {
        const obj =
          this.judgeNodeList().find((item) => {
            return item.resource_id === this.model.target_id;
          }) || {};
        if (!Object.keys(obj).length) {
          this.model.target_id = '';
        }
        // 区域高亮,链路断线,多媒体动效,节点聚焦时聚焦为fasle
        const typeObj =
          this.optionsType.find((item) => {
            return item.code === this.model.type;
          }) || {};
        if (
          typeObj?.type === 'area' ||
          value.type === 'media-animation' ||
          value.type === 'highlight-element' ||
          value.type === 'link-poweroff'
        ) {
          // 区域高亮聚焦为false
          this.model.look_at_target = false;
        }
      },
      deep: true,
    },

    visible(v) {
      this.thisVisible = v;
      const { nodeIndex = -1, leafIndex = -1 } = this.$parent.selected;
      this.model =
        _.get(
          this.$parent.nodes,
          `${nodeIndex}.attack_message_req_list.${leafIndex}`,
        ) || {};

      if (
        this.model.media_animation_list &&
        Array.isArray(this.model.media_animation_list)
      ) {
        const animationList = this.model.media_animation_list.map((item) => {
          return {
            ...item,
            url: item.url ? item.url : '',
            list: item.url ? item.list : [],
            isNew: false,
          };
        });
        this.old_media_animation_list = JSON.parse(
          JSON.stringify(animationList),
        );
        this.model.media_animation_list = animationList;
      }
      if (this.model.title) {
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    },
  },
  methods: {
    //判断type=area,聚焦颜色线形禁用
    judgeAreaDisabled(key) {
      const findObj =
        this.optionsType.find((item) => {
          return item.code === this.model.type;
        }) || {};
      if (findObj?.type === 'area') {
        return !findObj[key];
      }
    },
    //节点聚焦的时候,聚焦颜色线形px禁用
    judgeNode(key) {
      const findObj =
        this.optionsType.find((item) => {
          return item.code === this.model.type;
        }) || {};
      if (findObj.code === 'highlight-element') {
        return !findObj[key];
      }
    },
    //链路断线的时候,聚焦,线形禁用
    linkOffline(key) {
      const findObj =
        this.optionsType.find((item) => {
          return item.code === this.model.type;
        }) || {};
      if (findObj.code === 'link-poweroff') {
        return !findObj[key];
      }
    },

    //判断源节点是不是禁用
    judgeDisabled(key) {
      const findObj =
        this.optionsType.find((item) => {
          return item.code === this.model.type;
        }) || {};
      return !findObj[key];
    },
    //判断目标节点下拉框内容
    judgeNodeList() {
      const findObj =
        this.optionsType.find((item) => {
          return item.code === this.model.type;
        }) || {};

      if (findObj?.type === 'element') {
        return this.elementList;
      } else if (findObj?.type === 'area') {
        return this.areaList;
      } else {
        return this.nodeList;
      }
    },
    //测试动效
    testEffect() {
      //运行单个测试动效位置判断
      this.$refs.form.validate((valid) => {
        if (valid) {
          const directionArr = this.model.media_animation_list.map((item) => {
            return item.direction;
          });
          if (this.containsDuplicate(directionArr)) {
            //位置判断
            this.$message.error(this.$t('dynamicControl.noRepeats'));
            return;
          }
        }

        if (!valid) {
          return;
        }
        //参数转化
        const modelData = {
          ...this.model,
          media_animation_list: this.model.media_animation_list.map((item) => {
            return {
              ...item,
              direction: Number(item.direction),
              source_id: item.source_id_media,
            };
          }),
        };
        const params = {
          description: this.model.title,
          scene_id: this.scene_id,
          ...modelData,
          is_instance: this.is_instance,
        };
        // 点击单个测试动效
        this.$request
          .post(
            '/situation/control/run_attack_message',
            { ...params },
            { baseURL: '/api/ojj' },
          )
          .then((res) => {
            this.$message.success(this.$t('dynamicControl.testSuccess'));
          })
          .catch(() => {});
      });
    },
    //增加多媒体动效div
    handleAddMedia() {
      if (this.model.media_animation_list.length < 4) {
        this.model.media_animation_list.push({
          area_id: '',
          direction: '',
          source_id_media: '',
          url: '',
          list: [],
          isNew: true,
        });
      }
    },
    //删除多媒体动效div
    handleDeleteMedia(item, index) {
      this.model.media_animation_list.splice(index, 1);
    },

    handleClickReqIndex(index) {
      this.uploadIndex = index;
    },
    // 上传文件logo
    uploadFunc(file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 10);
      this.$request
        .post('/situation/control/upload_media', formData, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          this.model.media_animation_list[this.uploadIndex].url =
            res.data.data.file_path;
        })
        .catch((error) => {});
    },
    // 删除logo
    removeLogo() {
      // this.model.url = '';
      this.model.media_animation_list[this.uploadIndex].url = '';
    },
    previewLogo(data) {
      if (data[0]?.name.indexOf('.mp4') > -1) {
        this.previewMp4Visible = true;
        this.previewMp4Src = data[0].url;
      } else {
        this.previewVisible = true;
        this.previewSrcList = [data[0].url];
      }
    },

    handleClosePreviewMp4() {
      this.previewMp4Visible = false;
      this.previewMp4Src = '';
    },
    close() {
      //取消动效模板
      this.$refs.form.resetFields();
      this.model.media_animation_list = this.old_media_animation_list.filter(
        (item) => {
          return !item.isNew;
        },
      );
      this.$emit('update:visible', false);
      if (!this.model.title) {
        const { nodeIndex = -1, leafIndex = -1 } = this.$parent.selected;
        if (leafIndex > -1) this.$parent.remove(nodeIndex, leafIndex);
      }
    },
    //判读数组是否有相同项,用于判断方向
    containsDuplicate(nums) {
      const set = new Set();
      for (let k of nums) {
        if (set.has(k)) return true;
        set.add(k);
      }
      return false;
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const directionArr = this.model.media_animation_list.map((item) => {
            return item.direction;
          });
          if (this.containsDuplicate(directionArr)) {
            //位置判断
            this.$message.error(this.$t('dynamicControl.noRepeats'));
            return;
          }
          this.$parent.updateData();
          this.$emit('update:visible', false);
        } else {
          return false;
        }
      });
    },
    validateTitleRepeat(rule, value, callback) {
      const { nodeIndex = -1, leafIndex = -1 } = this.$parent.selected;
      const attack_message_req_list =
        _.get(this.$parent.nodes, `${nodeIndex}.attack_message_req_list`) || [];
      const titles = _.map(attack_message_req_list, 'title');
      titles.splice(leafIndex, 1);
      if (titles.indexOf(value) > -1) {
        callback(new Error(this.$t('同一阶段下任务目标名称不可重复')));
      } else {
        callback();
      }
    },
  },
  created() {
    this.scene_id = this.$route.query.scene_id
      ? this.$route.query.scene_id
      : this.$route.query.topo_id;
    if (this.scene_id === this.$route.query.topo_id) {
      this.is_instance = false;
    } else {
      this.is_instance = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.media_animation {
  background: var(--bg-color-3);
  position: relative;
  .add_animation {
    position: absolute;
    right: -28px;
    top: 90px;
  }
  .delete_animation {
    right: -28px;
    top: 70px;
    position: absolute;
  }
}
.require-icon {
  position: relative;
  &::before {
    content: '*';
    position: absolute;
    left: 55px;
    top: 12px;
    color: var(--red-color);
  }
}
.require-icon-en {
  position: relative;
  &::before {
    content: '*';
    position: absolute;
    left: 30px;
    top: 12px;
    color: var(--red-color);
  }
}
.require-line-en {
  position: relative;
  &::before {
    content: '*';
    position: absolute;
    left: 24px;
    top: 12px;
    color: var(--red-color);
  }
}

::v-deep.en-dynamic {
  .el-scrollbar {
    .el-select-dropdown__wrap {
      .el-scrollbar__view {
        width: 248px;
      }
    }
  }
}
::v-deep.cb-upload-file .prompt-msg {
  padding-right: 5px;
}
.preview-doalog {
  position: relative;
  z-index: 2009;
}
.preview-mp4 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 3000;
  video {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }
  .preview-mp4-close {
    position: absolute;
    top: 30px;
    right: 30px;
    z-index: 4;
  }
  .preview-close {
    position: absolute;
    top: 22px;
    right: 22px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #606266;
  }
}
</style>
