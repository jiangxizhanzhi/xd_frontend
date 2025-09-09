<template>
  <div class="detail-wrap">
    <!-- 模板详情头部 -->
    <div class="detail-header">
      <div class="left-wrap">
        <img v-show="base_info.logo" :src="base_info.logo" alt="" />
      </div>
      <div class="right-wrap">
        <!-- 标题 -->
        <div class="title-wrap">
          <span class="title-name" :title="base_info.name">{{
            base_info.name
          }}</span>
        </div>
        <!-- 时长、节点、角色信息 -->
        <div class="train-info">
          <div class="basic-info">
            <!-- 时长 -->
            <div class="basic-item time">
              <cb-iconfont
                :size="16"
                type="icon-lishizuijinshijian"
              ></cb-iconfont>
              <span class="info-name">{{ $t('list.duration') }}：</span>

              <span class="info-value">{{
                base_info.duration_time + 'h'
              }}</span>
            </div>
            <!-- 节点 -->
            <div class="basic-item node">
              <cb-iconfont :size="16" type="icon-tuopu"></cb-iconfont>
              <span class="info-name">{{ $t('list.node') }}：</span>

              <span class="info-value">{{ base_info.node }}</span>
            </div>
            <!-- 类别 -->
            <div class="basic-item type">
              <cb-iconfont :size="16" type="icon-yingyongxitong"></cb-iconfont>
              <span class="info-name">{{ $t('list.category') }}：</span>

              <span class="info-value">{{
                computedCategory(base_info.category)
              }}</span>
            </div>
            <!-- 难度 -->
            <div class="basic-item">
              <cb-iconfont :size="16" type="icon-dengji"></cb-iconfont>
              <span class="info-name">{{ $t('list.difficulty') }}：</span>

              <span class="info-value">{{
                computedDiffculty(base_info.difficult)
              }}</span>
            </div>
          </div>
        </div>
        <!-- 前置技能 -->
        <div class="pre-skill">
          <div class="skill-name">{{ $t('list.trainingSkill') }}：</div>
          <div class="tag-wrap">
            <span
              class="skill-tag"
              :key="index"
              v-for="(item, index) in base_info.pre_skill"
              :title="item"
              >{{ item }}</span
            >
          </div>
        </div>
        <!-- 训练技能 -->
        <div class="train-skill">
          <div class="skill-name">{{ $t('list.trainingSkill') }}：</div>
          <div class="tag-wrap">
            <span
              class="skill-tag"
              :key="index"
              v-for="(item, index) in base_info.train_skill"
              :title="item"
              >{{ item }}</span
            >
          </div>
        </div>
        <div class="add-btn">
          <slot></slot>
        </div>
      </div>
    </div>
    <!-- 模板详情底部 -->
    <div class="main-wrap">
      <div class="left-wrap">
        <div class="desc">
          <block :title="$t('list.trainingDesc')"></block>
          <div class="desc-cotent" :title="base_info.description">
            {{ base_info.description }}
          </div>
        </div>
        <div class="topo">
          <block :title="$t('list.topology')"></block>
          <div class="img-wrap">
            <div v-if="base_info.topoLogo">
              <img :src="base_info.topoLogo" />
              <div class="fangda-logo" @click="isShow = true">
                <cb-iconfont
                  :size="16"
                  type="icon-fangda"
                  class="fangda-icon"
                ></cb-iconfont>
              </div>
            </div>
            <!-- 暂无数据 -->
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
        </div>
      </div>
      <div class="right-wrap">
        <div class="team-info">
          <cb-tabs v-model="activeName">
            <cb-tab-pane
              :key="item.id"
              v-for="item in currentRoles"
              :label="item.name"
              :name="item.name"
            >
              <!-- 角色资产任务方案数据 -->
              <asset-details :assetData="item"></asset-details>
            </cb-tab-pane>
          </cb-tabs>
        </div>
      </div>
    </div>
    <cb-image-preview :url-list="imgList" v-model="isShow"></cb-image-preview>
  </div>
</template>

<script>
import emptyPage from '@/pages/web/Empty';
import block from '@/components/block';
import defaultLogo from '@/assets/img/team-default.png';
import assetDetails from './asset-details.vue';
import {
  getTrainingCategoryApi,
  getDifficultListsApi,
  getTemplateDetailApi,
} from '@/api/web/team-training';

export default {
  components: {
    emptyPage,
    block,
    assetDetails,
  },
  props: {},
  data() {
    return {
      defaultLogo,
      template_id: this.$route.params && this.$route.params.template_id,
      categoryList: [],
      difficultList: [],
      base_info: {
        logo: '',
        name: '',
        duration_time: '',
        node: '',
        category: '',
        difficult: '',
        pre_skill: [],
        train_skill: [],
        description: '',
        topoLogo: '',
      },
      activeName: '',

      currentRoles: [],
      red_roles: [],
      blue_roles: [],
      isShow: false,
    };
  },
  watch: {
    activeName: {
      handler(nv, ov) {
        this.activeName = nv;
      },
    },
  },
  computed: {
    imgList() {
      const arr = [];
      if (this.base_info.topoLogo) {
        arr.push(this.base_info.topoLogo);
      }
      return arr;
    },
  },
  created() {
    this.getTrainingCategory();
    this.getDifficultLists();
  },

  mounted() {
    this.getData();
  },
  methods: {
    getTrainingCategory() {
      getTrainingCategoryApi({ type: 3 }).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.categoryList = data.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
        this.categoryList.unshift({
          label: this.$t('list.allTraining'),
          value: '',
        });
      });
    },
    getDifficultLists() {
      getDifficultListsApi({ type: 24 }).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.difficultList = data.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
        this.difficultList.unshift({
          label: this.$t('list.allDifficulty'),
          value: '',
        });
      });
    },
    getData() {
      getTemplateDetailApi({
        resource_id: this.$route.params && this.$route.params.template_id,
      }).then((res) => {
        const data = _.get(res, 'data.data', '');
        this.base_info.logo = data.base_info.logo || this.defaultLogo;
        this.base_info.name = data.base_info.name;
        this.base_info.duration_time = data.base_info.duration_time;
        this.base_info.node =
          data.base_info.scene_config_data.scene_config.topology.elements.length;
        this.base_info.category = data.base_info.category;
        this.base_info.difficult = data.base_info.difficult;
        this.base_info.pre_skill = data.base_info.pre_skill;
        this.base_info.train_skill = data.base_info.train_skill;
        this.base_info.description = data.base_info.description;
        this.base_info.topoLogo = data.base_info.scene_config_data.logo;
        this.currentRoles = data.role_list;
        this.activeName = this.currentRoles[0].name;
      });
    },
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
  },
};
</script>
<style lang="scss" scoped>
.detail-wrap {
  .detail-header {
    border-radius: 4px;
    min-height: 200px;
    background: var(--bg-color-2);
    padding: 16px;
    display: flex;
    .left-wrap {
      width: 17%;
      height: 168px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right-wrap {
      width: 83%;
      margin-left: 16px;
      padding-top: 8px;
      position: relative;
      .title-wrap {
        align-items: center;
        height: 28px;
        line-height: 28px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-right: 90px;
        .title-name {
          font-size: 20px;
          color: var(--neutral8);
        }
      }
      .train-info {
        height: 44px;
        line-height: 44px;
        .basic-info {
          display: flex;
          align-items: center;
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
        }
      }
      .train-skill,
      .pre-skill {
        display: flex;
        position: relative;
        margin-top: 8px;
        .skill-name {
          padding-top: 2px;
          font-size: 14px;
          color: var(--neutral7);
          margin-bottom: 10px;
          min-width: 70px;
        }
        .tag-wrap {
          .skill-tag {
            display: inline-block;
            // height: 22px;
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
      .train-skill {
        margin-top: 4px !important;
      }
      .add-btn {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
  .main-wrap {
    margin-top: 16px;
    display: flex;
    width: 100%;
    height: 100%;
    .left-wrap {
      height: 100%;
      width: 440px;
      margin-right: 16px;
      .desc {
        border-radius: 4px;
        padding: 16px;
        height: 243px;
        background: var(--bg-color-2);
        .desc-cotent {
          height: 154px;
          line-height: 22px;
          font-size: 14px;
          color: var(--neutral7);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 7;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .topo {
        border-radius: 4px;
        margin-top: 16px;
        background: var(--bg-color-2);
        padding: 16px;
        .img-wrap {
          height: 230px;
          position: relative;
          img {
            width: 100%;
            height: 100%;
          }
          .fangda-logo {
            position: absolute;
            right: 0;
            bottom: 0;
            cursor: pointer;
            .fangda-icon {
              color: var(--white-color);
            }
          }
        }
      }
    }
    .right-wrap {
      width: calc(100% - 440px - 16px);
      height: 100%;
      background: var(--bg-color-2);
      padding: 0 16px 20px 0;
      ::v-deep .el-tabs--border-card > .el-tabs__content {
        padding: 5px;
      }
      .team-info {
        border-radius: 4px;
        padding-left: 16px;
        .role-assets {
          .assets-category {
            display: flex;
            justify-content: space-between;
            .assets-item {
              flex: 1;
              margin-right: 16px;
              background: var(--bg-color-3);
              height: 64px;
              display: flex;
              align-items: center;
              &:nth-child(4) {
                margin-right: 0;
              }
              .outside-img-wrap {
                width: 40px;
                height: 40px;
                background: var(--neutral0);
                margin-left: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                .inside-img-wrap {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  img {
                    border-radius: 50%;
                    width: 100%;
                    height: 100%;
                  }
                }
              }
              .assets-name {
                margin-left: 8px;
                font-size: 14px;
                color: var(--neutral7);
              }
              .assets-num {
                margin-left: 8px;
                color: var(--neutral8);
                font-size: 20px;
              }
            }
          }
        }
        .task-plan {
          margin-top: 24px;
          .task-list {
            margin-left: 20px;
            .task-item {
              padding: 16px;
              margin-bottom: 16px;
              background: var(--bg-color-3);
              position: relative;
              .title {
                height: 24px;
                line-height: 24px;
                font-size: 16px;
                color: var(--neutral8);
                margin-bottom: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .task {
                height: 22px;
                line-height: 23px;
                font-size: 14px;
                color: var(--neutral7);
                margin-bottom: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
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
                left: -22px;
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
      }
    }
  }
}
</style>
