<template>
  <div class="config-content cyber-scroll-bar-small">
    <!-- 新增按钮 -->
    <cb-button
      button-type="add"
      hollow
      style="margin-bottom: 16px"
      @click="addFn"
    ></cb-button>
    <!-- 数据列表 -->
    <div class="hand-content cyber-scroll-bar-small">
      <div
        class="hand-list"
        :key="item.id"
        v-for="(item, index) in handList"
        @click="detailFn(item)"
      >
        <div class="hand-top">
          <!-- {{ item }} -->
          <div class="top-title one-overflow" :title="item.event_name">
            {{ item.event_name }}
          </div>
          <div class="icon-style">
            <span class="title-one" v-if="item.event_type == 1">
              {{ item.category_name }}
            </span>
            <span class="title" v-if="item.event_type == 2">
              {{ item.category_name }}
            </span>
            <span v-if="item.event_type == 3" class="title-two">
              {{ $t('rbt.interdiction') }}
            </span>
            <span v-if="item.event_type == 4" class="title-three">
              {{ $t('rbt.ascription') }}
            </span>
          </div>
        </div>
        <div class="hand-bottom">
          <div>
            <!-- ：源,目标 -->
            <!-- 攻击防御1.2 -->
            <span v-if="item.event_type == 1 || item.event_type == 2">
              {{ $t('rbt.source') }}{{ ' ：' }}{{ item.source_name }}</span
            >
            <!-- 阻断 3-->
            <span v-if="item.event_type == 3">
              {{ $t('rbt.attackSource') }}{{ ' ：' }}{{ item.source_name }}
            </span>
            <!-- 归属 4-->
            <span v-if="item.event_type == 4">
              {{ $t('rbt.node') }}{{ ' ：' }}{{ item.target_name }}
              <span style="margin-left: 16px">{{ item.role_name }}</span>
            </span>
            <span class="dot" v-if="item.event_type !== 4">
              · · · · · · · ·
            </span>
            <span class="arrow-box" v-if="item.event_type !== 4"></span>
            <span v-if="item.event_type == 1 || item.event_type == 2"
              >{{ $t('rbt.targets') }}{{ ' ：' }}{{ item.target_name }}</span
            >
            <span v-if="item.event_type == 3"
              >{{ $t('rbt.blockNode') }}{{ ' ：' }}{{ item.target_name }}</span
            >
          </div>

          <!-- 按钮组合 -->
          <div class="btn-style">
            <!-- 删除按钮 -->
            <span
              class="delete-btn"
              @click.stop="!item.noCarry ? deleteFn(item) : ''"
              :title="$t('rbt.delete')"
            >
              <cb-iconfont
                :style="{
                  cursor: item.noCarry ? 'not-allowed' : 'pointer',
                }"
                :class="item.noCarry ? 'dis-style' : 'edit-style'"
                :size="16"
                type="icon-shanchu"
              ></cb-iconfont>
            </span>
            <!-- 编辑按钮 -->
            <span
              class="edit-btn"
              @click.stop="!item.noCarry ? editFn(item) : ''"
              :title="$t('rbt.edit')"
            >
              <cb-iconfont
                :style="{
                  cursor: item.noCarry ? 'not-allowed' : 'pointer',
                }"
                :class="item.noCarry ? 'dis-style' : 'edit-style'"
                :size="16"
                type="icon-bianji"
              ></cb-iconfont>
            </span>
            <!-- 执行按钮 -->
            <span
              @click.stop="
                !item.is_executed
                  ? ''
                  : !item.noCarry
                  ? carryFn(item, index)
                  : ''
              "
              :title="$t('rbt.executions')"
            >
              <cb-iconfont
                :style="{
                  cursor: item.noCarry ? 'not-allowed' : 'pointer',
                }"
                :class="
                  !item.is_executed
                    ? 'dis-style'
                    : item.noCarry
                    ? 'dis-style'
                    : 'edit-style'
                "
                :size="16"
                type="icon-xiafa1"
              ></cb-iconfont>
            </span>
          </div>
        </div>
      </div>
      <!-- 暂无数据 -->
      <div
        v-if="handList.length < 1"
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
    <!-- 新增弹框 -->

    <cb-dialog
      class="dialog-style edit-dialog"
      :title="$t('rbt.pilotEventArrange')"
      :visible.sync="handEventVisible"
      center="center"
      width="600px"
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
              v-model="formData.attack_type"
              titleField="name"
              valueField="code"
              :options="attackTypeArr"
              style="width: 316px"
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
              v-model="formData.source_type"
              titleField="name"
              valueField="resource_id"
              :options="nodeTypeArr"
              style="width: 316px"
            ></cb-select>
          </cb-form-item>
          <!-- 防御类型 -->
          <cb-form-item
            :label="$t('rbt.defenseType')"
            prop="defense_type"
            v-if="formData.event_type == 2"
          >
            <cb-select
              v-model="formData.defense_type"
              titleField="name"
              valueField="code"
              :options="defenseTypeArr"
              style="width: 316px"
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
              v-model="formData.source_type"
              titleField="name"
              valueField="resource_id"
              :options="nodeTypeArr"
              style="width: 316px"
            ></cb-select>
          </cb-form-item>
          <!-- 阻断节点 -->
          <cb-form-item
            :label="$t('rbt.blockNode')"
            prop="blocking_node_type"
            v-if="formData.event_type == 3"
          >
            <cb-select
              v-model="formData.blocking_node_type"
              titleField="name"
              valueField="resource_id"
              :options="blockNodeArr"
              style="width: 316px"
            ></cb-select>
          </cb-form-item>
          <!-- 攻击目标 -->
          <cb-form-item
            :label="$t('rbt.attackTarget')"
            prop="target_type"
            v-if="formData.event_type == 1"
          >
            <cb-select
              v-model="formData.target_type"
              titleField="name"
              valueField="resource_id"
              :options="nodeTypeArr"
              style="width: 316px"
            ></cb-select>
          </cb-form-item>
          <!-- 攻击结果 -->
          <cb-form-item
            :label="$t('rbt.attackResult')"
            prop="result_type"
            v-if="formData.event_type == 1"
          >
            <cb-select
              v-model="formData.result_type"
              titleField="name"
              valueField="code"
              :options="resultTypeArr"
              style="width: 316px"
            ></cb-select>
          </cb-form-item>
          <!-- 防御目标 -->
          <cb-form-item
            :label="$t('rbt.defenseTarget')"
            prop="target_type"
            v-if="formData.event_type == 2"
          >
            <cb-select
              v-model="formData.target_type"
              titleField="name"
              valueField="resource_id"
              :options="nodeTypeArr"
              style="width: 316px"
            ></cb-select>
          </cb-form-item>
          <cb-form-item
            :label="$t('rbt.defenseResult')"
            prop="result_type"
            v-if="formData.event_type == 2"
          >
            <cb-select
              v-model="formData.result_type"
              titleField="name"
              valueField="code"
              :options="resultTypeArr"
              style="width: 316px"
            ></cb-select>
          </cb-form-item>
          <!-- 归属节点 -->
          <cb-form-item
            :label="$t('rbt.node')"
            prop="node_type"
            v-if="formData.event_type == 4"
          >
            <cb-select
              v-model="formData.node_type"
              titleField="name"
              valueField="resource_id"
              :options="nodeTypeArr"
              style="width: 316px"
            ></cb-select>
          </cb-form-item>
          <!-- 归属角色 -->
          <cb-form-item
            :label="$t('rbt.ownershipRole')"
            prop="role_type"
            v-if="formData.event_type == 4"
          >
            <cb-select
              v-model="formData.role_type"
              titleField="name"
              valueField="code"
              :options="roleTypeArr"
              style="width: 316px"
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

    <!-- 查看详情弹框 -->

    <cb-dialog
      class="dialog-style detail-dialog"
      :title="titles"
      :visible.sync="handDetailVisible"
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
          <empty-page ref="emptyComp" />
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
  carryTaskApi,
} from '@/api/web/team-training';

import { getEditBack } from '@/api/web/red-blue';
import { getHandListApi } from '@/api/web/team-training';
import EmptyPage from '@/pages/web/Empty';
import { validateTitleLength255 } from '@/utils/rules';
import { getLanguage } from '@cyber/helper';

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
    screenName: {
      type: String,
      default: '',
    },
  },
  components: {
    EmptyPage,
  },
  data() {
    return {
      language: getLanguage(),
      timer: null,
      titles: '',
      handList: [],
      handEventVisible: false, //新增弹框
      handDetailVisible: false, //详情弹框
      formData: {
        event_type: 1, //事件类型
        event_name: '', //事件名称
        attack_type: '', //攻击类型
        source_type: '', //攻击源
        target_type: '', //攻击目标,防御目标
        result_type: '', //攻击结果
        condition_type: '', //任务条件
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
  created() {
    this.resource_id = this.$route.params.resource_id;
    this.getData();
  },
  mounted() {},
  methods: {
    getData() {
      getHandListApi({ roomId: this.resource_id }).then((res) => {
        this.handList =
          res.data.data.list.map((item) => {
            return {
              ...item,
              noCarry: false,
            };
          }) || [];
      });
    },
    // 新增
    addFn() {
      this.getAllType();
      this.edit_id = '';
      this.handEventVisible = true;
    },
    cancelFn() {
      this.handEventVisible = false;
      this.formData = {
        event_type: 1, //事件类型
        event_name: '', //事件名称
        attack_type: '', //攻击类型
        source_type: '', //攻击源
        target_type: '', //攻击目标
        result_type: '', //攻击结果
        condition_type: '', //任务条件
        defense_type: '', //防御类型
        node_type: '', //节点
        role_type: '',
        blocking_node_type: '', //阻断节点
      };
    },
    // 点击测试
    testFn() {
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
            target:
              this.formData.event_type == 3
                ? this.formData.blocking_node_type
                : this.formData.target_type,
            trigger_condition: this.formData.condition_type,
            trigger_condition: this.formData.condition_type,
            type: 2, //手动导调
          }).then((res) => {
            this.$message.success(this.$t('rbt.hasIssued'));
          });
        }
      });
    },

    // 点击编辑获取所有类型数据
    getAllType() {
      getAllTypeApi({ room_id: this.resource_id, business_type: 4 }).then(
        (res) => {
          this.attackTypeArr = res.data.data.attack_type; //攻击
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

    confirmFn() {
      this.$refs['eventForm'].validate((valid) => {
        if (valid) {
          if (this.edit_id) {
            // 编辑后新增
            getConfirmEditApi({
              resource_id: this.edit_id,
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
              type: 2, //任务导调
              role: this.formData.role_type,
            }).then((res) => {
              this.$message.success(this.$t('rbt.editSuccess'));
              this.handEventVisible = false;
              // 更新列表数据
              this.getData();
              //影响一个,更新导调类型占比
              this.$emit('refreshType', true);
              //清空
              this.cancelFn();
            });
          } else {
            // 第一次新增
            getConfirmApi({
              resource_id: this.edit_id,
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
              target:
                this.formData.event_type == 4
                  ? this.formData.node_type
                  : this.formData.event_type == 3
                  ? this.formData.blocking_node_type
                  : this.formData.target_type,
              // target:
              //   this.formData.event_type == 3
              //     ? this.formData.blocking_node_type
              //     : this.formData.target_type,
              trigger_condition: this.formData.condition_type,
              role_type: this.formData.role_type,
              condition_type: this.formData.condition_type,
              type: 2, //任务导调
              role: this.formData.role_type,
            }).then((res) => {
              this.$message.success(this.$t('rbt.addSuccess'));
              this.handEventVisible = false;
              // 更新列表数据
              this.getData();
              //影响一个,更新导调类型占比
              this.$emit('refreshType', true);
              //清空
              this.cancelFn();
            });
          }
        }
      });
    },

    //查看详情
    detailFn(data) {
      this.titles = data.event_name;
      getDetailApi({ resource_id: data.resource_id, type: 2 }).then((res) => {
        this.formData.event_type = res.data.data.event_type; //类型
        this.formData.event_type_name = res.data.data.event_type_name; //事件类型
        this.handDetailVisible = true;
        this.formData.event_name = res.data.data.event_name; //事件名称
        this.formData.category_name = res.data.data.category_name; //攻击类型
        this.formData.result_name = res.data.data.result_name; //攻击结果
        this.formData.source = res.data.data.source;
        this.formData.target_type = res.data.data.target;
        this.formData.target_name = res.data.data.target_name;
        this.formData.source_name = res.data.data.source_name;
        this.formData.role_name = res.data.data.role_name;
        this.formData.category_name = res.data.data.category_name; //防御类型
        this.formData.success_url_img = res.data.data.success_url; //防御图片
        this.formData.role_img = res.data.data.role;
        this.formData.red_url = res.data.data.red_url; //归属角色图片
        this.formData.blue_url = res.data.data.blue_url; //归属角色图片
        this.handDetailVisible = true;
      });
    },
    // 删除列表数据
    deleteFn(data) {
      this.$confirm(this.$t('rbt.isDeleteTask') + '?').then(() => {
        deleteTaskApi({ ids: [data.resource_id] }).then((res) => {
          // 更新列表数据
          this.getData();
          // 影响三个,更新类型占比和态势导调占比top5和导调事件分布
          this.$emit('refreshType', true);
          this.$emit('refreshTop', true);
          this.$emit('refreshTime');
        });
      });
    },
    // 点击编辑
    editFn(data) {
      this.edit_id = data.resource_id;
      // 先获取训练名称
      getEditBack({ resource_id: this.resource_id }).then((res) => {
        // this.screenName = res.data.data.name;
        this.getAllType();
        //查看编辑内容
        getDetailApi({ resource_id: data.resource_id }).then((res) => {
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
        this.handEventVisible = true;
      });
    },
    // 点击执行
    carryFn(data, index) {
      carryTaskApi({ resource_id: data.resource_id }).then((res) => {
        this.$message.success(this.$t('rbt.hasIssued'));
        //  执行后三个按钮置灰禁用,5秒后恢复
        data.noCarry = true;
        setTimeout(() => {
          data.noCarry = false;
        }, 5000); // 5 秒
        // 影响两个,更新top5和导调事件分布
        this.$emit('refreshTop', true);
        this.$emit('refreshTime');
      });
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.config-content {
  height: 358px;
  overflow-y: scroll;
  .hand-content {
    min-height: 310px;
    position: relative;
    .hand-list :hover {
      cursor: pointer;
    }
    .hand-list {
      height: 74px;
      border-radius: 2px;
      padding: 12px 16px 16px 16px;
      margin-bottom: 16px;
      background: var(--bg-color-4);
      position: relative;
      .hand-top {
        display: flex;

        .top-title {
          font-size: 16px;
          font-weight: 600;
          max-width: 412px;
        }

        .icon-style {
          font-size: 12px !important;
          margin-left: 8px;
          // min-width: 40px;
          height: 22px;
          line-height: 22px;
          text-align: center;
          .title {
            padding: 0 6px;
            background: var(--primary-color-2);
            display: inline-block;
            // min-width: 40px;
            height: 22px;
            line-height: 22px;
            color: var(--primary-color);
            border-radius: 2px;
          }
          .title-one {
            padding: 0 6px;
            background: var(--red-color-2);
            display: inline-block;
            // min-width: 40px;
            height: 22px;
            line-height: 22px;
            color: var(--red-color);
            border-radius: 2px;
          }
          .title-two {
            padding: 0 6px;
            background: var(--orange-color-2);
            display: inline-block;
            // min-width: 40px;
            height: 22px;
            line-height: 22px;
            color: var(--orange-color);
            border-radius: 2px;
          }
          .title-three {
            padding: 0 6px;
            background: var(--green-color-2);
            display: inline-block;
            // min-width: 40px;
            height: 22px;
            line-height: 22px;
            color: var(--green-color);
            border-radius: 2px;
          }
        }
      }
      .hand-bottom {
        display: flex;
        font-size: 12px;
        margin-top: 8px;
        justify-content: space-between;
        color: var(--neutral7);
        .dot {
          color: var(--neutral4);
          margin-left: 4px;
        }
        .arrow-box {
          display: inline-block;
          width: 0;
          height: 0;
          border: 5px solid transparent;
          border-left-color: var(--neutral4);
          content: '';
        }
      }
      .btn-style {
        .edit-btn {
          margin: 0 4px;
        }
      }
      &:hover {
        background-color: var(--neutral0);
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

  .edit-style {
    color: var(--neutral8);
    margin-left: 8px;
    &:hover {
      color: var(--primary-color);
    }
  }
  .dis-style {
    color: var(--neutral4);
    margin-left: 8px;
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
