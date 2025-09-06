<template>
  <div class="train-item">
    <!-- 标题 -->
    <div class="title-wrap" :title="itemData.name">
      <span class="title-name">{{ itemData.name }}</span>
      <span class="status no-start" v-if="itemData.training_status === 4">{{
        $t('list.nostart')
      }}</span>
      <span
        class="status running"
        v-if="
          itemData.training_status === 1 ||
          itemData.training_status === 2 ||
          itemData.training_status === 3
        "
        >{{ $t('list.ongoing') }}</span
      >
      <span class="status ended" v-if="itemData.training_status === 0">{{
        $t('list.hasEnded')
      }}</span>
      <!-- <span
        class="status paused"
      >{{$t('list.paused')}}</span> -->
    </div>
    <!-- 时长、节点、角色信息 -->
    <div class="train-info">
      <div class="basic-info">
        <!-- 时长 -->
        <div class="basic-item time">
          <cb-iconfont :size="16" type="icon-lishizuijinshijian"></cb-iconfont>
          <span class="info-name">{{ $t('list.duration') }}：</span>
          <span class="info-value">{{
            itemData.duration_time ? itemData.duration_time + 'h' : '-'
          }}</span>
        </div>
        <!-- 节点 -->
        <div class="basic-item node">
          <cb-iconfont :size="16" type="icon-tuopu"></cb-iconfont>
          <span class="info-name">{{ $t('list.node') }}：</span>
          <span class="info-value">{{ itemData.nodes_count }}</span>
        </div>
        <!-- 类别 -->
        <div class="basic-item type">
          <cb-iconfont :size="16" type="icon-yingyongxitong"></cb-iconfont>
          <span class="info-name">{{ $t('list.category') }}：</span>
          <span class="info-value">{{
            computedCategory(itemData.category)
          }}</span>
        </div>
        <!-- 难度 -->
        <div class="basic-item">
          <cb-iconfont :size="16" type="icon-dengji"></cb-iconfont>
          <span class="info-name">{{ $t('list.difficulty') }}：</span>
          <span class="info-value">{{
            computedDiffculty(itemData.difficult)
          }}</span>
        </div>
        <!-- 分割线 -->
        <div
          class="cut-line"
          v-if="itemData.is_attack_related || itemData.is_engage_related"
        ></div>
        <!-- engage、att&ck -->
        <div
          class="att-engage"
          v-show="itemData.is_attack_related"
          @click.stop="attClick(itemData)"
        >
          <cb-iconfont size="16" type="icon-babiaoguanli"></cb-iconfont>

          <cb-button class="att-engage-value" type="text" hollow
            >ATT&CK</cb-button
          >

          <div class="matrix-wrap">
            <div
              :key="index"
              v-for="(item, index) in itemData.attack_count"
              @mouseover="handleAttckOver(index)"
              @mouseleave="handleAttckLeave"
              class="matrix-wrap-content"
            >
              <div
                :class="[
                  'matrix',
                  index < 3
                    ? 'primary'
                    : index < 6
                    ? 'blue'
                    : index < 9
                    ? 'green'
                    : 'orange',
                ]"
                :style="{
                  height: item.count + 1 + 'px',
                }"
              >
                <transition name="el-fade-in">
                  <div class="tips" v-show="attckActive === index">
                    <div class="tip-name">{{ item.name }}</div>
                    <div class="tip-num-wrap">
                      <span class="tip-num-name"
                        >{{ $t('list.trainingSkillCount') }}:</span
                      >
                      <span class="tip-num">{{ item.count }}</span>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
        <div
          class="att-engage"
          v-show="itemData.is_engage_related"
          @click.stop="engageClick(itemData)"
        >
          <cb-iconfont size="16" type="icon-anfangshebei"></cb-iconfont>

          <cb-button class="att-engage-value" type="text" hollow
            >Engage</cb-button
          >

          <div class="matrix-wrap">
            <div
              :key="index"
              v-for="(item, index) in itemData.engage_count"
              @mouseover="handleEngageOver(index)"
              @mouseleave="handleEngageLeave"
              class="matrix-wrap-content"
            >
              <div
                :class="[
                  'matrix',
                  index < 2 ? 'primary' : index < 4 ? 'blue' : 'green',
                ]"
                :style="{
                  height: item.count + 1 + 'px',
                }"
              >
                <transition name="el-fade-in">
                  <div class="tips" v-show="engageActive === index">
                    <div class="tip-name">{{ item.name }}</div>
                    <div class="tip-num-wrap">
                      <span class="tip-num-name"
                        >{{ $t('list.trainingSkillCount') }}:</span
                      >
                      <span class="tip-num">{{ item.count }}</span>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>

        <!-- 我的角色 -->
        <div class="my-role" v-if="itemData.role_permission">
          <div class="img-wrap">
            <img :src="$store.state.user.avatar" />
          </div>
          <div class="role-info">
            <span class="role-name">{{ $t('list.myRole') }}：</span>
            <span class="role-value" :title="itemData.role_permission.name">{{
              itemData.role_permission.name
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 训练技能 -->
    <div class="train-skill">
      <div class="skill-name">{{ $t('list.trainingSkill') }}：</div>
      <div :class="[animationFold ? 'tag-wrap' : 'tag-wrap-fold']">
        <span
          class="skill-tag"
          :key="index"
          v-for="(item, index) in itemData.train_skill"
          :title="item"
          >{{ item }}</span
        >
      </div>
      <div class="triangle-wrap" @click.stop="animationFold = !animationFold">
        <cb-iconfont
          ref="xialaRef"
          type="icon-xiala1"
          size="16"
          class="triangle-color"
          :class="{
            arrowTransform: !animationFold,
            arrowTransformReturn: animationFold,
          }"
        ></cb-iconfont>
      </div>
    </div>
    <!-- 左侧装饰 -->
    <div class="left-side">
      <left-decorate></left-decorate>
    </div>
    <!-- 右侧装饰 -->
    <div class="right-side">
      <right-decorate></right-decorate>
    </div>
    <!-- 折叠区域 -->
    <collapse-transition>
      <div class="collapase-wrap" v-show="animationFold">
        <!-- 前置技能 -->
        <div class="pre-skill">
          <div class="skill-name">{{ $t('list.preSkill') }}：</div>
          <div class="tag-wrap">
            <div
              class="skill-tag"
              :key="index"
              v-for="(item, index) in itemData.pre_skill"
              :title="item"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <!-- 训练描述 -->
        <div class="train-description">
          <div class="desc-name">{{ $t('list.trainingDesc') }}：</div>
          <div
            :class="
              this.language === 'en-US' ? 'desc-content-en' : 'desc-content'
            "
            :title="itemData.description"
          >
            {{ itemData.description }}
          </div>
        </div>
        <!-- 角色信息 -->
        <div class="role-wrap" v-if="roles && roles.role_data_list">
          <div class="role-name">{{ $t('list.roleInfo') }}：</div>
          <div class="role-group">
            <div
              class="role-detail"
              v-for="(role, index) in roles.role_data_list"
              :key="index"
            >
              <div class="role-logo">
                <img :src="role.role_logo" />
              </div>
              <span class="user-name" :title="role.role_user">{{
                role.role_user
              }}</span>
              <span class="role-classify" :title="role.role_name">{{
                role.role_name
              }}</span>
              <div
                :class="[
                  'role-type',
                  role.role_group === 1 ||
                  role.role_group === 2 ||
                  role.role_group === 3
                    ? 'green'
                    : role.role_group === 4
                    ? 'red'
                    : 'blue',
                ]"
              >
                {{ computedGroup(role.role_group) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
import leftDecorate from './left-decorate.vue';
import rightDecorate from './right-decorate.vue';
import collapseTransition from '@/components/collapase/index';
import defaultLogo from '@/assets/img/userhead.png';
import { getLanguage } from '@cyber/helper';
export default {
  name: 'my-train',
  components: {
    collapseTransition,
    leftDecorate,
    rightDecorate,
  },
  props: {
    itemData: {
      type: Object,
      default: () => {},
    },
    categoryList: {
      type: Array,
      default: () => {},
    },
    difficultList: {
      type: Array,
      default: () => {},
    },
    roles: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      language: getLanguage(),
      defaultLogo,
      animationFold: false,
      attckActive: '',
      engageActive: '',
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    computedCategory(category) {
      const data = this.categoryList.filter((item) => {
        return item.value === category;
      });
      if (data.length) {
        return data[0].label;
      }
    },
    computedDiffculty(difficult) {
      const data = this.difficultList.filter((item) => {
        return item.value === difficult;
      });
      if (data.length) {
        return data[0].label;
      }
    },
    computedGroup(group) {
      if (group === 1 || group === 2 || group === 3) {
        return `${this.$t('list.white')}`;
      } else if (group === 4) {
        return `${this.$t('list.red')}`;
      } else if (group === 5) {
        return `${this.$t('list.blue')}`;
      }
    },
    // Engage点击
    engageClick(data) {
      this.$emit('attEngageEvent', data, 0);
    },
    // ATT&CK点击
    attClick(data) {
      this.$emit('attEngageEvent', data, 1);
    },
    handleAttckOver(index) {
      this.attckActive = index;
    },
    handleAttckLeave() {
      this.attckActive = '';
    },
    handleEngageOver(index) {
      this.engageActive = index;
    },
    handleEngageLeave() {
      this.engageActive = '';
    },
  },
};
</script>
<style lang="scss" scoped>
.arrowTransform {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}
// engage、attck弹窗样式
.arrowTransformReturn {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(180deg);
}
.train-item:hover {
  background: var(--bg-color-3);
}

.train-item {
  margin: 0 5px;
  background-color: var(--bg-color-2);
  min-height: 146px;
  margin-bottom: 16px;
  padding: 16px 48px;
  cursor: pointer;
  position: relative;
  .left-side {
    position: absolute;
    left: -5px;
    top: 0;
    bottom: 0;
    height: 100%;
  }
  .right-side {
    position: absolute;
    right: -5px;
    top: 0;
    bottom: 0;
    height: 100%;
  }
  .title-wrap {
    display: flex;
    align-items: center;
    height: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .title-name {
      font-size: 20px;
      color: var(--neutral8);
      margin-right: 8px;
    }
    .status {
      display: inline-block;
      min-width: 52px;
      height: 22px;
      line-height: 22px;
      background: var(--primary-color-2);
      border-radius: 2px;
      font-size: 12px;
      text-align: center;
      white-space: nowrap;
    }
    .running {
      background: var(--primary-color-2);
      color: var(--primary-color);
    }
    .no-start {
      background: var(--green-color-2);
      color: var(--green-color);
    }
    .ended {
      background: var(--neutral0);
      color: var(--neutral8);
    }
    .paused {
      background: var(--orange-color-2);
      color: var(--orange-color);
    }
  }

  .train-info {
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid var(--neutral1);
    .basic-info {
      display: flex;
      align-items: center;
      position: relative;
      .basic-item {
        display: flex;
        align-items: center;
        margin-right: 26px;
        // min-width: 80px;
        .info-name {
          margin-left: 5px;
          font-size: 14px;
          color: var(--neutral5);
        }
        .info-value {
          font-size: 14px;
          color: var(--neutral8);
        }
      }
      .time {
        // min-width: 90px;
      }
      .node {
        // min-width: 90px;
      }
      .type {
        // min-width: 120px;
      }
      .cut-line {
        width: 1px;
        height: 20px;
        background: var(--neutral1);
      }
      .att-engage {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: var(--primary-color);
        margin-left: 24px;
        cursor: pointer;
        .att-engage-value {
          margin-right: 4px;
          margin-left: 4px;
        }
        .matrix-wrap {
          margin-left: 5px;
          display: flex;
          align-items: flex-end;
          height: 24px;
          margin-bottom: 10px;
          .matrix-wrap-content {
            height: 24px;
            display: flex;
            align-items: flex-end;
          }
          .matrix {
            position: relative;
            .tips {
              background: var(--bg-color-3);
              position: absolute;
              // width: 98px;
              height: 62px;
              left: -46px;
              top: 30px;
              z-index: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding: 0 10px;
              .tip-name {
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                color: var(--neutral8);
                white-space: nowrap;
              }
              .tip-num-wrap {
                height: 30px;
                line-height: 30px;
                white-space: nowrap;
                .tip-num-name {
                  font-size: 12px;
                  color: var(--neutral5);
                }
                .tip-num {
                  font-size: 16px;
                  color: var(--neutral8);
                }
              }
            }
          }
          .primary,
          .blue,
          .green,
          .orange {
            width: 4px;
            border-radius: 3px;
            height: 24px;
            margin-right: 5px;
          }
          .primary {
            background: var(--primary-color);
          }
          .blue {
            background: var(--blue-color);
          }
          .green {
            background: var(--green-color);
          }
          .orange {
            background: var(--orange-color);
          }
        }
      }
      .my-role {
        position: absolute;
        display: flex;
        align-items: center;
        right: 0;
        width: 210px;
        .img-wrap {
          width: 40px;
          height: 40px;
          line-height: 40px;
          margin-right: 10px;
          border-radius: 50%;
          background: var(--bg-color-3);
          border: 1px solid var(--neutral1);
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            vertical-align: top;
          }
        }
        .role-info {
          width: 160px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .role-name {
            font-size: 14px;
            color: var(--neutral5);
          }
          .role-value {
            font-size: 14px;
            color: var(--neutral8);
          }
        }
      }
    }
  }
  .train-skill {
    margin-top: 16px;
    display: flex;
    position: relative;
    .skill-name {
      padding-top: 2px;
      font-size: 14px;
      color: var(--neutral7);
      margin-bottom: 10px;
      min-width: 70px;
    }
    .tag-wrap {
      padding-right: 34px;
      .skill-tag {
        display: inline-block;
        height: 22px;
        line-height: 22px;
        background-color: var(--neutral0);
        padding: 0 8px;
        margin-right: 4px;
        margin-bottom: 4px;
        font-size: 12px;
        color: var(--neutral8);
      }
    }
    .tag-wrap-fold {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 34px;
      .skill-tag {
        display: inline-block;
        height: 22px;
        line-height: 22px;
        background-color: var(--neutral0);
        padding: 0 8px;
        margin-right: 4px;
        margin-bottom: 4px;
        font-size: 12px;
        color: var(--neutral8);
      }
    }

    .triangle-wrap {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      position: absolute;
      right: 0;
      cursor: pointer;
      .triangle-color {
        color: var(--neutral3);
      }
    }
  }
  .collapase-wrap {
    .pre-skill {
      margin-top: 4px;
      display: flex;
      position: relative;
      .skill-name {
        padding-top: 2px;
        font-size: 14px;
        color: var(--neutral7);
        margin-bottom: 10px;
        min-width: 70px;
      }
      .tag-wrap {
        display: flex;
        flex-wrap: wrap;
        .skill-tag {
          height: 22px;
          line-height: 22px;
          background-color: var(--neutral0);
          padding: 0 8px;
          margin-right: 4px;
          margin-bottom: 4px;
          font-size: 12px;
          color: var(--neutral8);
        }
      }
    }
    .train-description {
      margin-top: 4px;
      display: flex;
      .desc-name {
        padding-top: 2px;
        font-size: 14px;
        color: var(--neutral7);
        min-width: 70px;
      }
      .desc-content {
        font-size: 14px;
        line-height: 20px;
        color: var(--neutral8);
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
      .desc-content-en {
        font-size: 14px;
        line-height: 20px;
        color: var(--neutral8);
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        margin-left: 8px;
        word-break: break-all;
      }
    }
    .role-wrap {
      margin-top: 12px;
      display: flex;
      .role-name {
        font-size: 14px;
        color: var(--neutral7);
        min-width: 70px;
      }
      .role-group {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .role-detail {
          margin-right: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 60px;
          .role-logo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--bg-color-3);
            border: 1px solid var(--neutral1);
            img {
              border-radius: 50%;
              width: 100%;
              height: 100%;
            }
          }
          .user-name {
            height: 22px;
            line-height: 22px;
            font-size: 14px;
            color: var(--neutral8);
            margin-top: 4px;
            width: 60px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
          }
          .role-classify {
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: var(--neutral5);
            width: 60px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
          }
          .role-type {
            width: 40px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            font-size: 12px;
            margin-top: 4px;
            border-radius: 2px;
          }
          .green {
            background: var(--green-color-2);
            color: var(--green-color);
          }
          .red {
            background: var(--red-color-2);
            color: var(--red-color);
          }
          .blue {
            background: var(--primary-color-2);
            color: var(--primary-color);
          }
        }
      }
    }
  }
}
</style>
