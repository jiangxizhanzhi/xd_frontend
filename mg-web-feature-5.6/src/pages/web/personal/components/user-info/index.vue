<template>
  <div class="user-info-box">
    <div class="left-box">
      <div class="info-box">
        <div class="avatar-box">
          <template v-if="loadingAvatar">
            <cb-progress
              class="progress-wrapper"
              type="circle"
              :percentage="percentage"
              :color="colors"
              :stroke-width="2"
            ></cb-progress>
            <div class="avatar-img">
              <cb-upload
                action=""
                :show-file-list="false"
                :http-request="upLoad"
                accept=".png,.jpg,.jpeg"
                :on-change="uploadChange"
              >
                <img
                  class="avatar-img-show"
                  :src="showModel.avatar || defaultAvatar"
                  :title="$t('personal.modifyAvatar')"
                  @mouseenter="handleEnterLeave"
                />
                <div
                  v-if="showImgMask"
                  @mouseleave="handleEnterLeave"
                  class="modify-avatar-box"
                >
                  {{ $t('personal.modifyAvatar') }}
                </div>
              </cb-upload>
            </div>
            <div class="matching-box">{{ positionPercent }}</div>
          </template>
        </div>
        <div class="desc-box">
          <div class="name-box one-overflow">
            <div
              class="name-wrap one-overflow pt5"
              :title="`${showModel.name}`"
            >
              {{ showModel.name }}
            </div>
            <div v-if="showCourseTrain" class="icon-class mr5 pt5">
              <cb-iconfont
                type="icon-jiaosezichan"
                :size="18"
                themedColor="neutral8"
              />
            </div>
            <div
              v-if="showCourseTrain"
              class="job-name one-overflow pt5"
              :title="positionData && positionData.name"
            >
              {{ positionData && positionData.name }}
            </div>
            <div
              v-if="showCourseTrain"
              class="change-job"
              :class="disabledProfession ? 'cursor-not-im' : ''"
              @click="handleClick"
            >
              <template v-if="isSelectButton">
                {{ $t('m.alterationJobs') }}
              </template>
              <template v-else>{{ $t('m.selectJobs') }}</template>
            </div>
            <div v-if="showCourseTrain" class="job-evaluation">
              <cb-button
                type="text"
                :disabled="disabledProfession"
                @click="goToEvaluate"
                >{{ $t('personal.jobEvaluation') }}</cb-button
              >
            </div>
            <div v-if="showCourseTrain" class="my-job">
              <cb-button
                type="text"
                :disabled="disabledProfession"
                @click="goToDescribe"
                >{{ $t('routes.my-profession') }}</cb-button
              >
            </div>
          </div>
          <div class="org-box one-overflow" :title="lastOrgPaths">
            {{ lastOrgPaths }}
          </div>
          <div
            class="description-box one-overflow"
            :title="showModel.description"
          >
            <span :title="$t('personal.modifyDesc')" @click="showDescDialog">
              <cb-iconfont
                style="cursor: pointer"
                type="icon-bianji"
                themedColor="neutral5"
                class="modify-desc-icon"
              />
            </span>
            {{ showModel.description || $t('course.noIntroduction') }}
          </div>
        </div>
      </div>
    </div>
    <div class="right-box">
      <div class="big-wrapper">
        <div class="icon-wrapper">
          <img :src="IconScene" />
        </div>
        <div class="right-wrapper">
          <div class="count-wrapper">{{ resourceData.scene_count || 0 }}</div>
          <div class="desc-wrap">{{ $t('personal.scene') }}</div>
        </div>
      </div>
      <div class="big-wrapper">
        <div class="icon-wrapper">
          <img :src="IconVm" />
        </div>
        <div class="right-wrapper">
          <div class="count-wrapper">{{ resourceData.vm_count || 0 }}</div>
          <div class="desc-wrap">{{ $t('personal.virtual') }}</div>
        </div>
      </div>
      <div class="big-wrapper">
        <div class="icon-wrapper">
          <img :src="IconContainer" />
        </div>
        <div class="right-wrapper">
          <div class="count-wrapper">
            {{ resourceData.container_count || 0 }}
          </div>
          <div class="desc-wrap">{{ $t('personal.container') }}</div>
        </div>
      </div>
      <div class="big-wrapper">
        <div class="icon-wrapper">
          <img :src="IconDynamips" />
        </div>
        <div class="right-wrapper">
          <div class="count-wrapper">{{ resourceData.dynamips || 0 }}</div>
          <div class="desc-wrap">Dynamips</div>
        </div>
      </div>
      <div class="big-wrapper">
        <div class="icon-wrapper">
          <img :src="IconPd" />
        </div>
        <div class="right-wrapper">
          <div class="count-wrapper">{{ resourceData.entity_count || 0 }}</div>
          <div class="desc-wrap">{{ $t('personal.equipment') }}</div>
        </div>
      </div>
    </div>
    <cb-dialog
      :title="$t('personal.individualResume')"
      center
      :visible.sync="descDialog"
      width="480px"
    >
      <cb-form
        ref="elFormRef"
        label-position="right"
        label-width="0"
        :model.sync="model"
        :rules="rules"
        :fetchPromise="fetchPromise"
        class="person-desc-form"
      >
        <cb-form-item label="" prop="description">
          <div>{{ $t('personal.individualResume') }}：</div>
          <cb-input
            v-model="model.description"
            type="textarea"
            :placeholder="$t('personal.plzEnterIndividualResume')"
          ></cb-input>
        </cb-form-item>
      </cb-form>
      <div slot="footer" class="dialog-footer">
        <cb-button-group>
          <cb-button buttonType="confirm" @click="submitForm" mr></cb-button>
          <cb-button button-type="cancel" @click="dialogCancel()"></cb-button>
        </cb-button-group>
      </div>
    </cb-dialog>
    <change-position ref="positionRef" @value="getPositionValue" />
  </div>
</template>

<script>
import _ from 'lodash';
import defaultAvatar from '@/assets/default-avatar.png';
import { getPersonalData } from '@/api/evaluation';
import {
  postRole,
  getPersonalDataInfo,
  postPersonalData,
  uploadImgage,
} from '@/api/personal';
import ChangePosition from '../change-position';
import { getMyResource } from '@/api/personal';
import Validate from '@/utils/validate';
import { getResponse, setUserInfo } from '@cyber/helper';
import IconScene from '@/assets/img/personal/icon_scene.png';
import IconVm from '@/assets/img/personal/icon_vm.png';
import IconContainer from '@/assets/img/personal/icon_container.png';
import IconDynamips from '@/assets/img/personal/icon_Dynamips.png';
import IconPd from '@/assets/img/personal/icon_pd.png';
export default {
  components: {
    ChangePosition,
  },
  props: {
    showCourseTrain: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      IconScene,
      IconVm,
      IconContainer,
      IconDynamips,
      IconPd,
      defaultAvatar: defaultAvatar,
      percentage: 0,
      colors: ['var(--green-color)'],
      positionData: {},
      isSelectButton: false,
      resourceData: {},
      lastOrgPaths: '',
      descDialog: false,
      showModel: {
        id: '',
        avatar: '',
        username: '',
        name: '',
        description: '',
      },
      model: {
        id: '',
        avatar: '',
        description: '',
      },
      rules: {
        description: [
          {
            min: 0,
            max: 1000,
            message: this.$t('systemManagement.userManage.signatureLength'),
            trigger: 'blur',
          },
        ],
      },
      showImgMask: false,
      loadingAvatar: false,
    };
  },
  computed: {
    positionPercent() {
      if (
        typeof this.positionData?.percent !== 'number' &&
        typeof this.positionData?.percent !== 'string'
      ) {
        return this.$t('personal.noPositionRoleDegree');
      } else {
        return (
          this.$t('personal.matchedDegree') + this.positionData.percent + '%'
        );
      }
    },
    disabledProfession() {
      if (_.indexOf(this.$store.state.user.user_permissions, 'oj-course') > 0) {
        return false;
      }
      return true;
    },
  },
  created() {
    this.loadingAvatar = false;
    getPersonalDataInfo().then((res) => {
      const data = _.get(res, 'data.data', '') || null;

      const { id, avatar, username, name, orgs, description } = data;
      this.showModel = {
        id,
        avatar,
        username,
        name,
        description,
      };
      this.model = {
        id,
        avatar,
        description,
        username,
        name,
      };
      this.lastOrgPaths = orgs[0].path;
      this.loadingAvatar = true;
    });
    this.getPositionInfo();
    this.getResource();
  },
  mounted() {},
  methods: {
    handleEnterLeave() {
      this.showImgMask = !this.showImgMask;
    },
    uploadChange() {},
    upLoad(file) {
      const size = file.file.size / (1024 * 1024);
      if (size <= 0 || size > 2) {
        this.$error(this.$t('personal.uploadImageSize'));
        return false;
      }
      const formData = new FormData();
      formData.append('file', file.file);
      uploadImgage(formData).then((res) => {
        this.showModel.avatar = _.get(res, 'data.data', '');
        this.model.avatar = _.get(res, 'data.data', '');
        postPersonalData(this.model).then((res) => {
          const userData = getResponse(res).data;
          setUserInfo(userData);
          this.$success(this.$t('personal.modifyInfoSuccess'));
        });
      });
    },
    showDescDialog() {
      this.descDialog = true;
    },
    dialogCancel() {
      this.descDialog = false;
      this.model.avatar = this.showModel.avatar;
      this.model.description = this.showModel.description;
    },
    fetchPromise() {
      return postPersonalData(this.model).then((res) => {
        const userData = getResponse(res).data;
        setUserInfo(userData);
        this.showModel.avatar = this.model.avatar;
        this.showModel.description = this.model.description;
        this.$success(this.$t('personal.modifyInfoSuccess'));
        this.descDialog = false;
      });
    },
    submitForm() {
      this.$refs.elFormRef.submit();
    },
    // 获取资源信息
    getResource() {
      getMyResource().then((resp) => {
        this.resourceData = _.get(resp, 'data.data');
      });
    },
    getPositionInfo() {
      getPersonalData().then((res) => {
        this.positionData = _.get(res, 'data.data');
        this.percentage =
          this.positionData && this.positionData.percent
            ? parseFloat(this.positionData.percent)
            : 0;
        // 判断是否已有岗位
        if (res?.data?.data?.name) {
          this.isSelectButton = true;
        }
      });
    },
    goToDescribe() {
      // 跳转至我的职业页面
      this.$router.push({
        path: `/course`,
      });
    },
    goToEvaluate() {
      this.$router.push({ path: '/personal/job-evaluation' });
    },
    handleClick() {
      if (!this.disabledProfession) {
        this.$refs.positionRef.dialogPosition = true;
        if (this.isSelectButton) {
          this.$refs.positionRef.isSelectButton = true;
        }
      }
    },
    getPositionValue(value) {
      this.postPosition(value);
    },
    postPosition(value) {
      const data = {
        role_id: value.resource_id,
      };
      postRole(data).then((res) => {
        this.$message.success(this.$t('personal.RoleChangeSuccess'));
        this.getPositionInfo();
        this.$emit('learnRecord');
      });
    },
  },
};
</script>
<style lang="scss">
.user-info-box {
  .progress-wrapper {
    .cb-progress-circle {
      width: 88px !important;
      height: 88px !important;
    }
    .cb-progress-circle__text {
      display: none;
    }
  }
  .person-desc-form {
    .el-form {
      padding: 0 !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.cursor-not-im {
  cursor: not-allowed !important;
}
.user-info-box {
  width: 100%;
  display: flex;
  align-items: center;
  .left-box {
    width: calc(100% - 624px);
    height: 92px;
    .info-box {
      width: 100%;
      height: 106px;
      display: flex;
      .avatar-box {
        width: 88px;
        height: 88px;
        position: relative;
        margin-right: 16px;
        .avatar-img {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--neutral0);
          .avatar-img-show {
            width: 68px;
            height: 68px;
            border-radius: 50%;
          }
          .modify-avatar-box {
            width: 68px;
            height: 68px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--mask-color);
            position: absolute;
            top: 0;
            left: 0;
            font-size: 14px;
            color: var(--neutral8);
          }
        }
        .matching-box {
          font-size: 12px;
          min-width: 75px;
          height: 20px;
          background: var(--green-color-2);
          color: var(--green-color);
          border-radius: 10px;
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .desc-box {
        width: calc(100% - 104px);
        .name-box {
          display: flex;
          width: 100%;
          font-size: 14px;
          color: var(--neutral8);
          line-height: 22px;
          margin-top: 8px;
        }
        .org-box {
          width: 100%;
          font-size: 12px;
          color: var(--neutral8);
          line-height: 20px;
          margin-top: 4px;
        }
        .description-box {
          width: 100%;
          font-size: 12px;
          color: var(--neutral5);
          margin-top: 8px;
          padding-right: 16px;
          .modify-desc-icon {
            &:hover {
              color: var(--primary-color) !important;
            }
          }
        }
      }
    }
  }
  .name-wrap {
    margin-right: 18px;
    max-width: 26%;
  }
  .icon-class {
    margin-top: 1px;
  }
  .job-name {
    font-size: 14px;
    color: var(--neutral8);
    line-height: 22px;
    margin-right: 8px;
    max-width: 32%;
  }
  .change-job {
    height: 24px;
    line-height: 24px;
    background: var(--neutral0);
    border-radius: 2px;
    text-align: center;
    font-size: 12px;
    color: var(--neutral7);
    padding: 0 8px;
    cursor: pointer;
    margin-top: 5px;
    margin-right: 16px;
    &:hover {
      color: var(--primary-color);
    }
  }
  .cursor-not-im {
    &:hover {
      color: var(--neutral7);
    }
  }
  .right-btn {
    display: flex;
  }
  .job-evaluation {
    margin-right: 8px;
  }
  .job-evaluation,
  .my-job {
    font-size: 14px;
    color: var(--primary-color);
    cursor: pointer;
  }
  .right-box {
    width: 624px;
    height: 64px;
    border-left: 1px solid var(--neutral1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 0 40px;
    .big-wrapper {
      display: flex;
      align-items: center;
      width: 136px;
      .icon-wrapper {
        width: 40px;
        height: 40px;
        background: var(--neutral0);
        margin-right: 10px;
        border-radius: 50%;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right-wrapper {
        .count-wrapper {
          font-size: 20px;
          font-family: HelveticaNeue-Bold, HelveticaNeue;
          font-weight: bold;
          color: var(--neutral9);
          line-height: 25px;
        }
        .desc-wrap {
          font-size: 12px;
          color: var(--neutral6);
          line-height: 16px;
        }
      }
    }
  }
}
</style>
