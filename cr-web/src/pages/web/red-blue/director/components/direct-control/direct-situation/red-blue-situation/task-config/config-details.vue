<template>
  <div class="asset-details">
    <!-- 任务导调配置页面详情 -->
    <div class="task-plan cyber-scroll-bar-small">
      <div class="task-list">
        <div
          class="task-item"
          :key="index"
          v-for="(item, index) in assetData.stage_list"
        >
          <div class="title one-overflow" :title="item.stage_name">
            {{ item.stage_name }}
          </div>
          <div
            class="task"
            :key="item2.resource_id"
            v-for="item2 in item.mission_list"
            @click="detailFn(item2)"
          >
            <div>
              <!-- 一次未编辑 -->
              <cb-iconfont
                class="icons-style"
                :size="16"
                type="icon-renwufangan"
                style="color: var(--neutral5)"
                v-if="
                  item2.is_editable &&
                  item2.guide_id == null &&
                  !item2.event_type
                "
              ></cb-iconfont>
              <!-- 一次未编辑且下发 -->
              <cb-iconfont
                class="icons-style"
                :size="16"
                type="icon-renwufangan"
                style="color: var(--neutral5)"
                v-if="
                  !item2.is_editable &&
                  item2.guide_id == null &&
                  item2.event_type == null
                "
              ></cb-iconfont>
              <!-- 编辑为攻击类型 1 ->
              <!-- 编辑为防御类型 2 -->
              <!-- 编辑为阻断类型 3-->
              <!-- 编辑为归属类型 4-->
              <cb-iconfont
                :class="
                  !item2.is_editable && item2.guide_id
                    ? 'color-style'
                    : 'icons-style'
                "
                :size="16"
                type="icon-babiaoguanli"
                style="color: var(--red-color)"
                v-if="item2.event_type == 1"
              ></cb-iconfont>
              <cb-iconfont
                :class="
                  !item2.is_editable && item2.guide_id
                    ? 'color-style'
                    : 'icons-style'
                "
                :size="16"
                type="icon-anfangshebei"
                style="color: var(--primary-color)"
                v-if="item2.event_type == 2"
              ></cb-iconfont>
              <cb-iconfont
                :class="
                  !item2.is_editable && item2.guide_id
                    ? 'color-style'
                    : 'icons-style'
                "
                :size="16"
                type="icon-xuanzeceshiduixiang1"
                style="color: var(--orange-color)"
                v-if="item2.event_type == 3"
              ></cb-iconfont>

              <cb-iconfont
                :class="
                  !item2.is_editable && item2.guide_id
                    ? 'color-style'
                    : 'icons-style'
                "
                :size="16"
                type="icon-zonghexunlian"
                style="color: var(--green-color)"
                v-if="item2.event_type == 4"
              ></cb-iconfont>
              <!-- 已经执行 -->
              <!-- <cb-iconfont
                :size="16"
                type="icon-anfangshebei"
                themedColor="primary-color"
                v-if="!item2.is_editable && item2.guide_id"
              ></cb-iconfont> -->
              <!-- :class=" !item2.is_editable && item2.guide_id ? 'color-content' :    'title-content' " -->

              <span
                :title="item2.mission_title"
                :class="!item2.is_editable ? 'color-content' : 'title-content'"
                >{{ item2.mission_title }}</span
              >
            </div>
            <div class="btn-style">
              <!-- 删除按钮 -->
              <div
                v-if="item2.event_type"
                class="delete-btn"
                @click.stop="
                  item2.event_type && item2.is_editable ? deleteFn(item2) : ''
                "
                :title="$t('rbt.delete')"
              >
                <cb-iconfont
                  :style="{
                    cursor:
                      item2.event_type && item2.is_editable
                        ? 'pointer'
                        : 'not-allowed',
                  }"
                  :class="
                    item2.event_type && item2.is_editable
                      ? 'delete-style'
                      : 'dis-style'
                  "
                  :size="16"
                  type="icon-brush"
                ></cb-iconfont>
              </div>
              <!-- 鼠标悬浮展示编辑按钮 -->
              <div
                @click.stop="item2.is_editable ? editFn(item2) : ''"
                :title="$t('rbt.edit')"
              >
                <cb-iconfont
                  :style="{
                    cursor: !item2.is_editable ? 'not-allowed' : 'pointer',
                  }"
                  :class="item2.is_editable ? 'edit-style' : 'dis-style'"
                  :size="16"
                  type="icon-bianji"
                ></cb-iconfont>
              </div>
              <!-- is_triggered为true 场景启动了,设置了导调,已经下发并且完成,是触发成功) -->
              <div
                v-if="
                  !item2.is_editable && item2.guide_id && item2.is_triggered
                "
                style="margin-right: 16px"
              >
                <!-- 已经答题,已执行不能编辑测试删除只能查看 -->
                <cb-iconfont
                  class="confirm-style"
                  :size="16"
                  type="icon-danxuan"
                ></cb-iconfont>
              </div>
            </div>
          </div>
        </div>
        <!-- 暂无数据 -->
        <div
          v-if="!assetData.stage_list.length"
          class="empty-comp"
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        >
          <empty-page ref="emptyComp" />
        </div>
      </div>
    </div>
    <!-- 点击编辑出现弹框 -->
    <cb-dialog
      class="dialog-style edit-dialog"
      :title="$t('rbt.pilotEventArrange')"
      :visible.sync="eventVisible"
      center="center"
      width="560px"
      @close="cancelFn"
    >
      <div>
        <cb-form
          ref="eventForm"
          :model="formData"
          :rules="rules"
          :label-width="language === 'en-US' ? '130px' : '100px'"
        >
          <cb-form-item :label="$t('rbt.eventType')" prop="event_type">
            <!-- 默认攻击 -->
            <cb-select
              style="width: 316px"
              v-model="formData.event_type"
              titleField="name"
              valueField="code"
              :options="eventTypeArr"
              @change="handleEventType"
            ></cb-select>
          </cb-form-item>

          <cb-form-item :label="$t('rbt.eventName')" prop="event_name">
            <cb-input
              v-model="formData.event_name"
              style="width: 316px"
            ></cb-input>
          </cb-form-item>
          <!-- 攻击类型 -->
          <cb-form-item
            :label="$t('rbt.attackType')"
            prop="attack_type"
            v-if="formData.event_type == 1"
          >
            <cb-select
              style="width: 316px"
              v-model="formData.attack_type"
              titleField="name"
              valueField="code"
              :options="attackTypeArr"
            ></cb-select>
            <!-- 攻击类型的图片 -->
            <div
              class="img-box"
              v-if="formData.event_type == 1 && formData.attack_type"
            >
              <img
                :src="attackTypeArr[formData.attack_type - 1].success_url"
                alt=""
                class="img-style"
              />
            </div>
          </cb-form-item>
          <!-- 攻击源 -->
          <cb-form-item
            :label="$t('rbt.attackSource')"
            prop="source_type"
            v-if="formData.event_type == 1 || formData.event_type == 3"
          >
            <cb-select
              style="width: 316px"
              v-model="formData.source_type"
              titleField="name"
              valueField="resource_id"
              :options="nodeTypeArr"
            ></cb-select>
          </cb-form-item>
          <!-- 防御类型 -->
          <cb-form-item
            :label="$t('rbt.defenseType')"
            prop="defense_type"
            v-if="formData.event_type == 2"
          >
            <cb-select
              style="width: 316px"
              v-model="formData.defense_type"
              titleField="name"
              valueField="code"
              :options="defenseTypeArr"
            ></cb-select>
            <!--  防御类型的图片 -->
            <div
              class="img-box"
              v-if="formData.event_type == 2 && formData.defense_type"
            >
              <img
                alt=""
                class="img-style"
                :src="defenseTypeArr[formData.defense_type - 15].success_url"
              />
            </div>
          </cb-form-item>
          <!-- 防御源 -->
          <cb-form-item
            :label="$t('rbt.defenseSource')"
            prop="source_type"
            v-if="formData.event_type == 2"
          >
            <cb-select
              style="width: 316px"
              v-model="formData.source_type"
              titleField="name"
              valueField="resource_id"
              :options="nodeTypeArr"
            ></cb-select>
          </cb-form-item>
          <!-- 阻断节点 -->
          <cb-form-item
            :label="$t('rbt.blockNode')"
            prop="blocking_node_type"
            v-if="formData.event_type == 3"
          >
            <cb-select
              style="width: 316px"
              v-model="formData.blocking_node_type"
              titleField="name"
              valueField="resource_id"
              :options="blockNodeArr"
            ></cb-select>
          </cb-form-item>
          <!-- 攻击目标 -->
          <cb-form-item
            :label="$t('rbt.attackTarget')"
            prop="target_type"
            v-if="formData.event_type == 1"
          >
            <cb-select
              style="width: 316px"
              v-model="formData.target_type"
              titleField="name"
              valueField="resource_id"
              :options="nodeTypeArr"
            ></cb-select>
          </cb-form-item>
          <!-- 攻击结果 -->
          <cb-form-item
            :label="$t('rbt.attackResult')"
            prop="result_type"
            v-if="formData.event_type == 1"
          >
            <cb-select
              style="width: 316px"
              v-model="formData.result_type"
              titleField="name"
              valueField="code"
              :options="resultTypeArr"
            ></cb-select>
          </cb-form-item>
          <!-- 防御目标 -->
          <cb-form-item
            :label="$t('rbt.defenseTarget')"
            prop="target_type"
            v-if="formData.event_type == 2"
          >
            <cb-select
              style="width: 316px"
              v-model="formData.target_type"
              titleField="name"
              valueField="resource_id"
              :options="nodeTypeArr"
            ></cb-select>
          </cb-form-item>
          <cb-form-item
            :label="$t('rbt.defenseResult')"
            prop="result_type"
            v-if="formData.event_type == 2"
          >
            <cb-select
              style="width: 316px"
              v-model="formData.result_type"
              titleField="name"
              valueField="code"
              :options="resultTypeArr"
            ></cb-select>
          </cb-form-item>
          <!-- 归属节点 -->
          <cb-form-item
            :label="$t('rbt.node')"
            prop="node_type"
            v-if="formData.event_type == 4"
          >
            <cb-select
              style="width: 316px"
              v-model="formData.node_type"
              titleField="name"
              valueField="resource_id"
              :options="nodeTypeArr"
            ></cb-select>
          </cb-form-item>
          <!-- 归属角色 -->
          <cb-form-item
            :label="$t('rbt.ownershipRole')"
            prop="role_type"
            v-if="formData.event_type == 4"
          >
            <cb-select
              style="width: 316px"
              v-model="formData.role_type"
              titleField="name"
              valueField="code"
              :options="roleTypeArr"
            ></cb-select>
            <!-- 归属角色图片 -->
            <div
              class="img-box"
              v-if="formData.event_type == 4 && formData.role_type"
            >
              <img
                v-if="formData.role_type == 4"
                :src="this.belongArr.red_url"
                alt=""
                class="img-style"
              />
              <img
                v-if="formData.role_type == 5"
                :src="this.belongArr.blue_url"
                alt=""
                class="img-style"
              />
            </div>
          </cb-form-item>
          <cb-form-item :label="$t('rbt.taskCondition')" prop="condition_type">
            <cb-select
              style="width: 316px"
              v-model="formData.condition_type"
              titleField="name"
              valueField="code"
              :options="conditionTypeArr"
            ></cb-select>
          </cb-form-item>
        </cb-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <cb-button-group>
          <cb-button
            mr="mr"
            button-type="confirm"
            @click="confirmFn"
          ></cb-button>
          <cb-button button-type="cancel" @click="cancelFn"></cb-button>
          <cb-button button-type="cancel" @click="testFn">{{
            $t('rbt.test')
          }}</cb-button>
        </cb-button-group>
      </div>
    </cb-dialog>

    <!-- 点击查看详情弹框 -->
    <cb-dialog
      class="dialog-style detail-dialog"
      :title="titles"
      :visible.sync="detailVisible"
      center="center"
      width="500px"
      @close="cancelFn"
    >
      <div>
        <cb-form
          ref="eventForm"
          :model="formData"
          :rules="rules"
          :label-width="language === 'en-US' ? '130px' : '100px'"
          v-if="this.formData.event_name"
        >
          <!-- 事件类型 -->
          <cb-form-item :label="$t('rbt.eventType') + '：'" prop="event_type">
            {{ this.formData.event_type_name }}
          </cb-form-item>
          <!-- 事件名称 -->
          <cb-form-item :label="$t('rbt.eventName') + '：'" prop="event_name">
            {{ this.formData.event_name }}
          </cb-form-item>
          <!--攻击类型 -->
          <cb-form-item
            :label="$t('rbt.attackType') + '：'"
            prop="attack_type"
            v-if="formData.event_type == 1"
          >
            {{ this.formData.category_name }}
            <!-- 攻击图片 -->
            <div class="img-box" v-if="formData.event_type == 1">
              <img :src="formData.success_url_img" alt="" class="img-style" />
            </div>
          </cb-form-item>
          <!-- 攻击源 -->
          <cb-form-item
            :label="$t('rbt.attackSource') + '：'"
            prop="source_type"
            v-if="formData.event_type == 1 || formData.event_type == 3"
          >
            {{ this.formData.source_name }}
          </cb-form-item>
          <!--防御类型 -->
          <cb-form-item
            :label="$t('rbt.defenseType') + '：'"
            prop="defense_type"
            v-if="formData.event_type == 2"
          >
            {{ this.formData.category_name }}
            <!-- 防御图片 -->
            <div class="img-box" v-if="formData.event_type == 2">
              <img :src="formData.success_url_img" alt="" class="img-style" />
            </div>
          </cb-form-item>
          <!--防御源 -->
          <cb-form-item
            :label="$t('rbt.defenseSource') + '：'"
            prop="source_type"
            v-if="formData.event_type == 2"
          >
            {{ this.formData.source_name }}
          </cb-form-item>
          <!--阻断节点-->
          <cb-form-item
            :label="$t('rbt.blockNode') + '：'"
            prop="node_type"
            v-if="formData.event_type == 3"
          >
            {{ this.formData.target_name }}
          </cb-form-item>
          <!-- 攻击目标 -->
          <cb-form-item
            :label="$t('rbt.attackTarget') + '：'"
            prop="target_type"
            v-if="formData.event_type == 1"
          >
            {{ this.formData.target_name }}
          </cb-form-item>
          <!-- 攻击结果 -->
          <cb-form-item
            :label="$t('rbt.attackResult') + '：'"
            prop="result_type"
            v-if="formData.event_type == 1"
          >
            {{ this.formData.result_name }}
          </cb-form-item>
          <!-- 防御目标-->
          <cb-form-item
            :label="$t('rbt.defenseTarget') + '：'"
            prop="target_type"
            v-if="formData.event_type == 2"
          >
            {{ this.formData.target_name }}
          </cb-form-item>
          <!-- -->
          <cb-form-item
            :label="$t('rbt.defenseResult') + '：'"
            prop="result_type"
            v-if="formData.event_type == 2"
          >
            {{ this.formData.result_name }}
          </cb-form-item>
          <!-- 节点-->
          <cb-form-item
            :label="$t('rbt.node') + '：'"
            prop="node_type"
            v-if="formData.event_type == 4"
          >
            {{ this.formData.target_name }}
          </cb-form-item>
          <!-- 归属角色 -->
          <cb-form-item
            :label="$t('rbt.ownershipRole') + '：'"
            prop="role_type "
            v-if="formData.event_type == 4"
          >
            {{ this.formData.role_name }}
            <!-- 归属图片 -->
            <div class="img-box" v-if="formData.event_type == 4">
              <img
                v-if="formData.role_img == 5"
                :src="formData.blue_url"
                alt=""
                class="img-style"
              />
              <img
                v-if="formData.role_img == 4"
                :src="formData.red_url"
                alt=""
                class="img-style"
              />
            </div>
          </cb-form-item>
          <!-- 任务条件 -->
          <cb-form-item
            :label="$t('rbt.taskCondition') + '：'"
            prop="condition_type"
          >
            {{ this.formData.trigger_name || '-' }}
          </cb-form-item>
        </cb-form>

        <div
          v-else
          class="empty-comp"
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        >
          <empty-page :tip-text="$t('rbt.noPilotEvents')" ref="emptyComp" />
        </div>
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import {
  getAllTypeApi,
  getDetailApi,
  getConfirmApi,
  getConfirmEditApi,
  deleteTaskApi,
  testTaskApi,
} from '@/api/web/team-training';
import { getEditBack } from '@/api/web/red-blue';
import EmptyPage from '@/pages/web/Empty';
import { validateTitleLength255 } from '@/utils/rules';
import { getLanguage } from '@cyber/helper';
export default {
  components: {
    EmptyPage,
  },
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

    assetData: {
      type: [Array, Object],
      default: [],
    },
  },
  data() {
    return {
      language: getLanguage(),
      now_val: '',
      guide_id_new: '',
      titles: '',
      netDevice: 0,
      operateSystem: 0,
      secDevice: 0,
      appSystem: 0,
      eventVisible: false, //编辑弹框
      detailVisible: false, //详情弹框
      formData: {
        event_type: 1, //事件类型
        event_name: '', //事件名称
        attack_type: '', //攻击类型
        source_type: '', //攻击源
        target_type: '', //攻击目标,防御目标
        result_type: '', //攻击结果
        condition_type: 2, //任务条件
        defense_type: '', //防御类型
        node_type: '', //节点
        role_type: '',
        blocking_node_type: '', //阻断节点
      },
      rules: {
        event_type: [
          {
            required: true,
            message: this.$t('rbt.inputSelect'),
            trigger: 'change',
          },
        ],
        event_name: [
          {
            required: true,
            message: this.$t('rbt.inputRequire'),
            trigger: 'change',
          },
          { validator: validateTitleLength255, trigger: 'blur' },
        ],

        attack_type: [
          {
            required: true,
            message: this.$t('rbt.inputSelect'),
            trigger: 'change',
          },
        ],
        source_type: [
          {
            required: true,
            message: this.$t('rbt.inputSelect'),
            trigger: 'change',
          },
        ],
        node_type: [
          {
            required: true,
            message: this.$t('rbt.inputSelect'),
            trigger: 'change',
          },
        ],
        blocking_node_type: [
          {
            required: true,
            message: this.$t('rbt.inputSelect'),
            trigger: 'change',
          },
        ],
        target_type: [
          {
            required: true,
            message: this.$t('rbt.inputSelect'),
            trigger: 'change',
          },
        ],
        result_type: [
          {
            required: true,
            message: this.$t('rbt.inputSelect'),
            trigger: 'change',
          },
        ],
        role_type: [
          {
            required: true,
            message: this.$t('rbt.inputSelect'),
            trigger: 'change',
          },
        ],
        condition_type: [],
        defense_type: [
          {
            required: true,
            message: this.$t('rbt.inputSelect'),
            trigger: 'change',
          },
        ],
      },
      attackTypeArr: [],
      conditionTypeArr: [],
      defenseTypeArr: [],
      eventTypeArr: [],
      nodeTypeArr: [],
      resultTypeArr: [],
      roleTypeArr: [],
      sourceTypeArr: [],
      targetTypeArr: [],
      blockNodeArr: [],
      belongArr: {},
    };
  },
  watch: {},
  computed: {},
  created() {
    this.resource_id = this.$route.params.resource_id;
  },
  mounted() {},
  methods: {
    // 切换事件类型
    handleEventType() {
      this.formData.event_name = ''; //事件名称
      this.formData.attack_type = ''; //攻击类型
      this.formData.defense_type = ''; //防御类型
      this.formData.source_type = ''; //源类
      this.formData.target_type = ''; //攻击目标
      this.formData.result_type = ''; //攻击结果
      this.formData.condition_type = ''; //任务条件
      this.formData.node_type = ''; //节点
      this.formData.blocking_node_type = ''; //阻断节点
      this.formData.role_type = ''; //归属角色
      this.getAllType();
    },
    // 编辑任务名
    editFn(data) {
      this.guide_id_new = data.guide_id;
      // 获取训练名称
      if (this.resource_id) {
        getEditBack({ resource_id: this.resource_id }).then((res) => {
          this.screenName = res.data.data.name;
          if (data.guide_id) {
            this.getAllType();
            //查看编辑内容
            getDetailApi({ resource_id: data.guide_id }).then((res) => {
              this.formData.event_type = res.data.data.event_type;
              this.formData.attack_type = res.data.data.category; //攻击类型
              this.formData.result_type = res.data.data.result;
              this.formData.source_type = res.data.data.source;
              this.formData.condition_type = res.data.data.trigger_condition; //任务条件
              this.formData.event_name = res.data.data.event_name;
              this.formData.target_type = res.data.data.target;
              this.formData.node_type = res.data.data.target; //归属的节点
              this.formData.role_type = res.data.data.role; //会归属的角色
              this.formData.defense_type = res.data.data.category; //防御类型
              this.formData.success_url = res.data.data.success_url; //图片
              this.formData.blocking_node_type = res.data.data.target; //阻断节点
            });
          } else {
            //不可编辑获取
            this.getAllType();
          }
        });
      }

      this.eventVisible = true;
      this.mission_id = data.mission_id;
    },
    // 点击编辑获取所有类型数据
    getAllType() {
      getAllTypeApi({ room_id: this.resource_id, business_type: 4 }).then(
        (res) => {
          this.attackTypeArr = res.data.data.attack_type; //攻击
          this.conditionTypeArr = res.data.data.condition_type; //任务条件
          this.defenseTypeArr = res.data.data.defense_type; //防御
          this.eventTypeArr = res.data.data.event_type; //事件类型
          this.nodeTypeArr = res.data.data.node_type; //攻击防御目标
          this.resultTypeArr = res.data.data.result_type;
          this.roleTypeArr = res.data.data.role_type;
          this.sourceTypeArr = res.data.data.source_type;
          this.targetTypeArr = res.data.data.target_type;
          this.blockNodeArr = res.data.data.blocking_node_type; //阻断节点数据
          this.belongArr = res.data.data.belong_url; //归属角色图片
        },
      );
    },
    //点击取消
    cancelFn() {
      this.eventVisible = false;
      this.formData = {
        event_type: 1, //事件类型
        event_name: '', //事件名称
        attack_type: '', //攻击类型
        source_type: '', //攻击源
        target_type: '', //攻击目标
        result_type: '', //攻击结果
        condition_type: 2, //任务条件
        defense_type: '', //防御类型
        node_type: '', //节点
        role_type: '',
        blocking_node_type: '', //阻断节点
      };
    },
    // 点击确定
    confirmFn() {
      this.$refs['eventForm'].validate((valid) => {
        if (valid) {
          if (this.guide_id_new) {
            // 编辑之后新增
            getConfirmEditApi({
              resource_id: this.guide_id_new,
              business_type: 4, //红蓝
              room_id: this.resource_id,
              event_name: this.formData.event_name,
              event_type: this.formData.event_type,
              category:
                this.formData.event_type == 1
                  ? this.formData.attack_type
                  : this.formData.defense_type,

              mission_id: this.mission_id,
              result: this.formData.result_type,
              source: this.formData.source_type,
              // target: this.formData.target_type,
              // target:
              //   this.formData.event_type == 3
              //     ? this.formData.blocking_node_type
              //     : this.formData.target_type,

              target:
                this.formData.event_type == 4
                  ? this.formData.node_type
                  : this.formData.event_type == 3
                  ? this.formData.blocking_node_type
                  : this.formData.target_type,

              trigger_condition: this.formData.condition_type,
              role_type: this.formData.role_type,
              condition_type: this.formData.condition_type,
              type: 1, //任务导调
              role: this.formData.role_type,
            }).then((res) => {
              this.$message.success(this.$t('rbt.editSuccess'));
              this.eventVisible = false;
              // 更新列表数据
              this.$emit('refreshList', true);
              // 影响一个,更新类型占比
              this.$emit('taskType', true);
            });
          } else {
            //  第一次新增
            getConfirmApi({
              business_type: 4, //红蓝
              room_id: this.resource_id,
              event_name: this.formData.event_name,
              event_type: this.formData.event_type,
              category:
                this.formData.event_type == 1
                  ? this.formData.attack_type
                  : this.formData.defense_type,
              mission_id: this.mission_id,
              result: this.formData.result_type,
              source: this.formData.source_type,
              // target: this.formData.target_type,
              // target:
              //   this.formData.event_type == 3
              //     ? this.formData.blocking_node_type
              //     : this.formData.target_type,
              target:
                this.formData.event_type == 4
                  ? this.formData.node_type
                  : this.formData.event_type == 3
                  ? this.formData.blocking_node_type
                  : this.formData.target_type,
              trigger_condition: this.formData.condition_type,
              role_type: this.formData.role_type,
              condition_type: this.formData.condition_type,
              role: this.formData.role_type,
              type: 1, //任务导调
            }).then((res) => {
              this.$message.success(this.$t('rbt.editSuccess'));
              this.eventVisible = false;
              // 更新列表数据
              this.$emit('refreshList', true);
              // 影响一个,更新类型占比
              this.$emit('taskType', true);
            });
          }
          // 清空
          this.cancelFn();
        }
      });
    },
    // 点击测试
    testFn() {
      // todo待接口重写重新对
      this.$refs['eventForm'].validate((valid) => {
        if (valid) {
          testTaskApi({
            business_type: 4,
            category:
              this.formData.event_type == 1
                ? this.formData.attack_type
                : this.formData.defense_type,
            event_name: this.formData.event_name,
            event_type: this.formData.event_type,
            mission_id: this.mission_id,
            resource_id: this.guide_id_new,
            result: this.formData.result_type,
            role: this.formData.role_type,
            room_id: this.resource_id,
            source: this.formData.source_type,
            // target: this.formData.target_type,
            target:
              this.formData.event_type == 3
                ? this.formData.blocking_node_type
                : this.formData.target_type,
            trigger_condition: this.formData.condition_type,
            trigger_condition: this.formData.condition_type,
            type: 1, //任务导调
          }).then((res) => {
            this.$message.success(this.$t('rbt.hasIssued'));
          });
        }
      });
    },
    //查看详情
    detailFn(data) {
      // 有guide_id
      if (data.guide_id) {
        getDetailApi({ resource_id: data.guide_id }).then((res) => {
          this.titles = data.mission_title;
          this.formData.event_type = res.data.data.event_type; //类型
          this.formData.event_type_name = res.data.data.event_type_name; //事件类型
          this.detailVisible = true;
          this.formData.event_name = res.data.data.event_name; //事件名称
          this.formData.category_name = res.data.data.category_name; //攻击类型
          this.formData.result_name = res.data.data.result_name; //攻击结果
          this.formData.source = res.data.data.source;
          this.formData.trigger_name = res.data.data.trigger_name; //任务条件
          this.formData.target_type = res.data.data.target;
          this.formData.target_name = res.data.data.target_name;
          this.formData.source_name = res.data.data.source_name;
          this.formData.role_name = res.data.data.role_name;
          this.formData.category_name = res.data.data.category_name; //防御类型
          this.formData.success_url_img = res.data.data.success_url; //防御图片
          this.formData.role_img = res.data.data.role;
          this.formData.red_url = res.data.data.red_url; //归属角色图片
          this.formData.blue_url = res.data.data.blue_url; //归属角色图片
        });
      } else {
        //没有guide_id
        this.titles = data.mission_title;
        this.detailVisible = true;
      }
    },
    // 点击删除按钮清空配置
    deleteFn(data) {
      this.$confirm(this.$t('rbt.isDeleteConfig') + '?').then(() => {
        deleteTaskApi({ ids: [data.guide_id] }).then((res) => {
          this.$emit('refreshList', true);
          // done();
          // 影响三个,更新类型占比,top统计,时间分布
          this.$emit('taskType', true);
          this.$emit('TaskTop', true);
          this.$emit('TaskTime');
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.asset-details {
  .task-plan {
    height: 304px;
    overflow-y: scroll;
    .task-list {
      margin-left: 20px;
      min-height: 304px;
      position: relative;
      .task-item {
        border-radius: 2px;
        padding: 16px;
        margin-bottom: 16px;
        background: var(--bg-color-4);
        position: relative;
        .title {
          height: 24px;
          line-height: 24px;
          font-size: 16px;
          font-weight: 600;
          color: var(--neutral8);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .icons-style {
          margin-bottom: 10px;
          margin-right: 4px;
        }
        .color-style {
          margin-bottom: 10px;
          opacity: 0.5;
        }
        .title-content {
          display: inline-block;
          max-width: 412px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .color-content {
          display: inline-block;
          max-width: 412px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--neutral4);
        }

        .task {
          // padding: 0 8px;
          height: 32px;
          line-height: 32px;
          font-size: 14px;
          color: var(--neutral7);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
          width: 100%;
          .btn-style {
            display: flex;
          }
          .edit-style {
            display: none;
            margin-right: 16px;
          }
          .delete-style {
            display: none;
          }
          .dis-style {
            display: none;
          }
          &:hover {
            background: var(--neutral0);
            .dis-style {
              display: block;
              position: relative;
              top: 8px;
              color: var(--neutral4) !important;
              margin-right: 16px;
            }

            .edit-style {
              display: block;
              position: relative;
              top: 8px;
              color: var(--neutral8);
              &:hover {
                color: var(--primary-color) !important;
              }
            }
            .delete-style {
              display: block;
              position: relative;
              top: 8px;
              margin-right: 8px;
              color: var(--neutral8);
              &:hover {
                color: var(--primary-color) !important;
              }
            }
          }
          .confirm-style {
            color: var(--green-color);
          }
          cursor: pointer;
        }

        &::before {
          content: '';
          position: absolute;
          left: -16px;
          top: 34px;
          display: inline-block;
          width: 1px;
          height: 100%;
          border-left: 1px dashed var(--neutral5);
        }
        &:last-child::before {
          content: '';
          border: none;
        }
        &::after {
          content: '';
          position: absolute;
          left: -20px;
          top: 20px;
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 1px solid var(--neutral5);
          border-radius: 50%;
        }
      }
    }
  }
  .img-box {
    width: 316px;
    height: 142px;
    margin-top: 20px;
    .img-style {
      width: 100%;
      height: 100%;
    }
  }
  ::v-deep .detail-dialog {
    .el-dialog__wrapper {
      .el-dialog {
        .el-dialog__header {
          .el-dialog__title {
            word-break: break-all;
            display: inline-block;
            width: 90%;
          }
        }
        .el-dialog__body {
          min-height: 240px;
          .cb-dialog-body {
            .cb-form {
              .el-form {
                padding-top: 0 !important;
              }
              padding-top: 0 !important;
              .el-form-item {
                margin-bottom: 16px;
              }
            }
          }
        }
      }
    }
  }
  ::v-deep .edit-dialog {
    .el-dialog__wrapper {
      .el-dialog {
        .el-dialog__body {
          .cb-dialog-body {
            .cb-form {
              .el-form {
                padding-top: 0 !important;
              }
            }
          }
        }
      }
    }
  }
  ::v-deep .empty_page {
    .not-data {
      .cb-iconfont {
        font-size: 56px !important;
      }
    }
  }
}
</style>
