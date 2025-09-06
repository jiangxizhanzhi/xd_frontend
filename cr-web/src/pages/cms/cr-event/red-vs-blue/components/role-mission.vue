<template>
  <div class="mission-schedule">
    <div class="content">
      <template>
        <div class="left-content">
          <cb-row>
            <cb-col :span="24">
              <div class="role-infomation">
                <template v-for="(role, index) in roleList">
                  <div v-if="role.children.length > 0" :key="index">
                    <template v-for="(child, indexChild) in role.children">
                      <RoleInfo
                        :key="indexChild"
                        :role="child"
                        :type-class="index === 3"
                        :select-role="selectRole"
                        @click.native="handleChangeRole(child)"
                      />
                    </template>
                  </div>
                </template>
              </div>
            </cb-col>
          </cb-row>
        </div>
        <!--      右侧主体-->
        <div class="right-content">
          <!--        任务组件-->
          <transition name="el-zoom-in-bottom">
            <SimpleFishBone
              :key="selectRole"
              v-model="(schemes[selectRole] || {}).scheme_data"
              :layout.sync="(schemes[selectRole] || {}).template"
              :theme.sync="(schemes[selectRole] || {}).color"
              isPlan
              :moduleName="moduleName"
              :businessType="BUSINESS_TYPE.CR_CMS_RED"
            />
          </transition>
        </div>
      </template>
      <!--      左侧角色列表-->
      <!-- <div class="no-roles" v-else>
        <cb-iconfont size="90" type="icon-zanwuziyuan" />
        <div>{{ $t('crEvent.noRoleData') }}</div>
      </div> -->
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import 'element-ui/lib/theme-chalk/base.css';
import RoleInfo from './role-info';
import SimpleFishBone from '@/components/SimpleFishBone';
import { BUSINESS_TYPE } from '@/pages/cms/cr-event/constants.js';
export default {
  name: 'RoleMission',
  components: {
    RoleInfo,
    SimpleFishBone,
  },
  props: {
    roleList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      BUSINESS_TYPE,
      moduleName: 'redvsblue',
      schemes: {},
      selectRole: '', // 当前选中的角色
    };
  },
  watch: {
    // roleList: {
    //   handler(nv, ov) {
    //     this.$nextTick(() => {
    //       this.initData();
    //     });
    //   },
    //   immediate: true,
    //   deep: true,
    // },
    selectRole: {
      handler(nv, ov) {
        if (ov) {
          this.syncCurrentRoleMissions(ov);
        }
      },
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    handleChangeRole(data) {
      this.selectRole = data.type + data.id;
    },
    initData() {
      const schemes = {};
      _.forEach(this.roleList, (group) => {
        _.forEach((group || {}).children, (role) => {
          if (role && role.id) {
            if (role.missions_scheme && role.missions_scheme.scheme_data) {
              schemes[role.type + role.id] = {
                template: role.missions_scheme.template || 1,
                color: role.missions_scheme.color || 1,
                scheme_data: _.map(role.missions_scheme.scheme_data, (o) => {
                  return {
                    stage: o.stage,
                    templates: o.missions,
                  };
                }),
              };
            } else {
              schemes[role.type + role.id] = {
                scheme_data: [],
                template: 1,
                color: 1,
              };
            }
          }
        });
      });
      this.schemes = schemes;
      this.selectRole =
        this.selectRole || _.chain(schemes).keys().head().value();
    },
    // 同步任务数据到当前角色
    syncCurrentRoleMissions() {
      _.forEach(this.roleList, (group) => {
        _.forEach((group || {}).children, (role) => {
          if (role && role.id) {
            const config = _.get(this.schemes, role.type + role.id) || {};
            role.missions_scheme = {
              template: config.template,
              color: config.color,
              scheme_data: _.map(config.scheme_data, (o) => {
                return {
                  stage: o.stage,
                  missions: o.templates,
                };
              }),
            };
            _.forEach(config.scheme_data, (o) => {
              if (!o.templates || o.templates.length < 1) {
                // this.$message.error(
                //   `用户 ${role.name} 的阶段 ${o.stage} 下无任务`,
                // );
                // this.$message.error(
                //   CommonUtils.formatString(
                //     this.$t('crEvent.userStageTask'),
                //     role.name,
                //     o.stage,
                //   ),
                // );
                // throw new Error(
                //   CommonUtils.formatString(
                //     this.$t('crEvent.userStageTask'),
                //     role.name,
                //     o.stage,
                //   ),
                // );
              }
              const m = _.find(o.templates, (v) => !v.resource_id);
              if (m) {
                // this.$message.error(
                //   CommonUtils.formatString(
                //     this.$t('crEvent.userTemplateChange'),
                //     role.name,
                //     o.stage,
                //     m.title,
                //   ),
                // );
                // throw new Error(
                //   CommonUtils.formatString(
                //     this.$t('crEvent.userTemplateChange'),
                //     role.name,
                //     o.stage,
                //     m.title,
                //   ),
                // );
              }
            });
          }
        });
      });
      return this.roleList;
    },
  },
};
</script>

<style scoped lang="scss">
.mission-schedule {
  min-height: 650px;
  margin-top: 15px;
  .whole-component {
    margin: 0;
  }
  .content {
    display: flex;
    .left-content {
      width: 300px;
      padding: 0;
    }
    .right-content {
      width: calc(100% - 300px);
      min-height: 600px;
      padding: 0;
      border-left: 1px solid var(--neutral3);
    }
  }
}
.no-roles {
  width: 100%;
  color: var(--invalid-color);
  text-align: center;
  margin: 100px;
}
::v-deep .simple-fish-bone .fishbone-header .tips {
  flex: 1;
  margin-right: 0;
  padding-left: 10px;
}
</style>

<style lang="scss">
.mission-schedule {
  .el-main {
    border-left: 1px solid var(--neutral3);
  }
}
</style>
