<template>
  <div class="mission-schedule">
    <div class="select-boxs">
      <cb-select
        v-model="selectRole"
        :options="roleListCom"
        titleField="name"
        valueField="_id"
        @change="changeRole"
      />
    </div>
    <div v-show="showMain" class="fishbone-container">
      <SimpleFishBone
        :key="selectRole"
        v-model="currentMissionSchemeData.scheme_data"
        ref="missionArrange"
        :layout.sync="currentMissionSchemeData.template"
        :theme.sync="currentMissionSchemeData.color"
        :isPlan="true"
        :moduleName="moduleName"
        :businessType="BUSINESS_TYPE.CR_CMS_TEAM"
      >
      </SimpleFishBone>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/base.css';
import moment from 'moment';
import SimpleFishBone from '@/components/SimpleFishBone';
import LayoutSelector from '@/components/SimpleFishBone/LayoutSelector';
import { BUSINESS_TYPE } from '@/pages/cms/cr-event/constants.js';

const missionModel = true;
const playModel = false;
export default {
  name: 'MissionSchedule',
  components: {
    SimpleFishBone,
    LayoutSelector,
  },
  props: {
    active: {
      type: [String, Number],
      default() {
        return '';
      },
    },
    roleList: {
      type: Array,
      default() {
        return [];
      },
    },
    maxTime: {
      type: String,
      default() {
        return '2014-04-16T04:00:00';
      },
    },
    baseTime: {
      type: String,
      default() {
        return '2014-04-16T00:00:00';
      },
    },
    nodes: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      BUSINESS_TYPE,
      moduleName: 'team',
      fishLayout: '',
      template: '',
      color: '',
      themes: [
        {
          key: 'black',
          label: this.$t('crEvent.black'),
          value: 1,
        },
        {
          key: 'green',
          label: this.$t('crEvent.green'),
          value: 2,
        },
        {
          key: 'blue',
          label: this.$t('crEvent.blue'),
          value: 3,
        },
        {
          key: 'brown',
          label: this.$t('crEvent.brown'),
          value: 4,
        },
      ],
      showMain: missionModel,
      // missionData: {}, // 保存不同角色中的任务
      // timeLineDataMapping: {},
      selectRole: null, // 当前选中的角色
      selectRoleOld: null, // 之前选中的角色
      defaultStartTime: 10, // 10分钟
      defaultRolesTime: {}, // role -> time
      roleAll: {
        name: this.$t('crEvent.all'),
        description: this.$t('crEvent.showRole'),
        _id: 'all',
      },
      currentMissionSchemeData: {},
    };
  },
  computed: {
    roleListCom() {
      let filterData = [];
      _.forEach(this.roleList, (item) => {
        if (item.role_group !== 1) {
          filterData.push(item);
        }
      });
      this.selectRole = filterData && filterData.length && filterData[0]._id;
      return filterData;
    },
    // currentMissionSchemeData() {
    //   // 当前角色方案信息
    //   for (const role of this.roleList) {
    //     if (role._id === this.selectRole) {
    //       _.forEach(role.missions_scheme, item=>{
    //         this.$set(item, 'templates', item.missions)
    //       })
    //       return role.missions_scheme
    //     }
    //   }
    //   return []
    // },
    getselectRoleGrop() {
      for (const role of this.roleList) {
        if (role._id === this.selectRole) {
          return role.role_group;
        }
      }
      return null;
    },
    currentMissionsData() {
      // 当前角色任务信息
      var mission_data = [];
      if (
        this.getselectRoleGrop ===
        this.$CONSTANT.TeamTrain.Permission.TEACHER.value
      ) {
        // 选中教员
        mission_data = this.teacherPlayFlowData();
      } else if (
        this.getselectRoleGrop ===
        this.$CONSTANT.TeamTrain.Permission.STUDENT.value
      ) {
        // 选中学员
        mission_data = this.studentPlayMissionData();
      } else {
        const mission_data_flow = this.teacherPlayFlowData();
        const mission_data2_mission = this.allstudentPlayMissionData();
        mission_data = this.$_.concat(mission_data_flow, mission_data2_mission);
      }
      delete this.defaultRolesTime[this.selectRole];
      return mission_data;
    },
    time_minutes() {
      return moment(this.maxTime).diff(moment(this.baseTime), 'minute');
    },
    not_more_than_minutes() {
      // 不能超过的数值
      return this.defaultStartTime < this.time_minutes - 5;
    },
    node_name_mapping() {
      const name_mapping = {};
      this.$_.forEach(this.nodes, (node) => {
        const data = node.data;
        name_mapping[data.id] = data.data.name;
      });
      return name_mapping;
    },
  },
  watch: {
    showMain(val) {
      if (val === missionModel) {
        // 切换为任务模式选择默认值
        this.selectDefaultRole();
      }
      if (val === playModel) {
        // 切换为剧本的时候需要同步最后一个提交的任务
        // this.syncCurrentRoleMissions()
      }
    },
    selectRole: {
      handler(nv, ov) {
        this.currentMissionSchemeData = this.getCurrentMissionSchemeData();
        this.selectRoleOld = ov;
        if (ov) {
          this.syncCurrentRoleMissions(ov);
        }
      },
    },
    active: {
      handler(nv, ov) {
        this.currentMissionSchemeData = this.getCurrentMissionSchemeData();
      },
    },
  },
  mounted() {
    this.selectDefaultRole();
    this.currentMissionSchemeData = this.getCurrentMissionSchemeData();
  },
  methods: {
    changeRole() {
      const filterData = _.filter(this.roleList, (item) => {
        return item._id === this.selectRole;
      });
      if (filterData.length > 0) {
        this.switchMissionTask(filterData[0]);
      }
    },
    // 当前角色方案信息
    getCurrentMissionSchemeData() {
      for (const role of this.roleList) {
        if (role._id === this.selectRole) {
          _.forEach(role.missions_scheme.scheme_data, (item) => {
            if (!item.templates) {
              this.$set(item, 'templates', item.missions);
            }
          });
          return role.missions_scheme;
        }
      }
      return {};
    },
    //  currentMissionSchemeData() {
    //   // 当前角色方案信息
    //   for (const role of this.roleList) {
    //     if (role._id === this.selectRole) {
    //       _.forEach(role.missions_scheme, item=>{
    //         this.$set(item, 'templates', item.missions)
    //       })
    //       return role.missions_scheme
    //     }
    //   }
    //   return []
    // },
    // 将任务组件的数据同步到父组件
    getRoleMission() {
      const data = this.$refs.missionArrange.submitMissionArrange();
      if (data.status === false) {
        this.$message.error(data.data);
        // return true;
      }
      delete this.defaultRolesTime[this.selectRole];

      return data.data;
    },
    // 同步任务数据到当前角色
    syncCurrentRoleMissions(val) {
      for (const role of this.roleList) {
        if (role._id === val) {
          //this.selectRole
          // role.missions_scheme.splice(0, ...this.getRoleMission())
          role.missions_scheme.scheme_data = this.getRoleMission();
        }
      }
    },
    missionModelEvent(role) {
      // 同步验证
      if (this.getRoleMission() === false) {
        this.compeleteMissionError();
        return false;
      }
      // 获取上个角色的数据并暂存
      this.syncCurrentRoleMissions();

      // 教员不能被选中
      // if (
      //   role.role_group === this.$CONSTANT.TeamTrain.Permission.TEACHER.value
      // ) {
      //   this.$message.error(this.$t('crEvent.teacherNoTasks'));
      //   return false;
      // }

      // 处理新的角色数据
      // this.selectRole = role._id
    },
    playModelEvent(role) {
      // 所有角色都可以被选中
      // const items = this.$refs.timeline.syncItemRange()
      // for (const item in items) {
      //   this.timeLineDataMapping[items[item].resource_id] = items[item].start
      // }
      this.selectRole = role._id;
    },
    moveItem(item) {
      // this.timeLineDataMapping[item.resource_id] = item.start;
    },
    // 切换显示不同角色所拥有的不同任务
    switchMissionTask(role) {
      // 任务模式
      // if (this.showMain === missionModel) {
      this.missionModelEvent(role);
      this.currentMissionSchemeData = this.getCurrentMissionSchemeData();
      // }
      // // 剧本模式
      // if (this.showMain === playModel) {
      //   this.playModelEvent(role)
      // }
    },
    // 选择默认的角色
    selectDefaultRole() {
      for (const role of this.roleList) {
        if (
          role.role_group === this.$CONSTANT.TeamTrain.Permission.STUDENT.value
        ) {
          this.selectRole = role._id;
          break;
        }
      }
    },
    // 任务组件切换为技法组件前需要进行的检查
    checkCanChangeToplayModel() {
      if (this.getRoleMission() === false) {
        this.compeleteMissionError();
        return false;
      }
      this.showMain = !this.showMain;
    },
    compeleteMissionError() {
      this.$message.error(this.$t('crEvent.pleaseCompleteMissionData'));
    },
    studentPlayMissionData() {
      // 普通角色的任务数据
      var mission_data = [];
      for (const role of this.roleList) {
        if (
          role._id === this.selectRole &&
          role.role_group === this.$CONSTANT.TeamTrain.Permission.STUDENT.value
        ) {
          for (const scheme of role.missions_scheme.scheme_data) {
            //role.missions_scheme
            if (scheme.templates && scheme.templates.length) {
              //scheme.missions
              mission_data = this.$_.concat(mission_data, scheme.templates); //scheme.missions
            }
          }
          return mission_data;
        }
      }
      return mission_data;
    },

    // setMissionStartTime1(mission_datas) { // 给任务添加时间属性
    //   var last_time = ''
    //   for (var mission of mission_datas) {
    //     if (this.timeLineDataMapping.hasOwnProperty(mission.resource_id)) {
    //       mission.start = this.timeLineDataMapping[mission.resource_id]
    //     } else {
    //       this.timeLineDataMapping[mission.resource_id] = this.getDefaultStartTime()
    //       mission.start = this.timeLineDataMapping[mission.resource_id]
    //     }
    //   }
    //   return mission_datas
    // },
    allstudentPlayMissionData() {
      // 全部学员
      var mission_data = [];
      for (const role of this.roleList) {
        if (role.missions_scheme.scheme_data === undefined) {
          //role.missions_scheme
          continue;
        }
        for (const scheme of role.missions_scheme.scheme_data) {
          if (scheme.templates && scheme.templates.length) {
            //role.missions
            mission_data = this.$_.concat(mission_data, scheme.templates); //role.missions
          }
        }
      }
      return mission_data;
    },
    teacherPlayFlowData() {
      // 教员的流量数据
      var flow_data = [];
      return flow_data;
    },
    getDefaultStartTime() {
      // 设置一个默认时间
      const random_num = Math.round(Math.random() * 50 + 5);
      if (random_num < 10) {
        return '2014-04-16T00:0' + random_num.toString() + ':00';
      } else {
        return '2014-04-16T00:' + random_num.toString() + ':00';
      }
    },
    getDefaultMissionStartTime(last_time) {
      // 设置角色默认时间
      if (!this.$_.has(this.defaultRolesTime, this.selectRole)) {
        this.defaultRolesTime[this.selectRole] = this.defaultStartTime;
      }
      const role_time = this.defaultRolesTime[this.selectRole];
      const new_time = role_time + 3;

      if (last_time) {
        return moment(last_time)
          .add('minutes', 1)
          .format('YYYY-MM-DDTHH:mm:ss');
      } else {
        const time = moment(this.baseTime)
          .add('minutes', role_time + 3)
          .format('YYYY-MM-DDTHH:mm:ss');
        if (this.not_more_than_minutes) {
          this.defaultRolesTime[this.selectRole] = new_time;
        }
        return time;
      }
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .fishbone-container {
  .simple-fish-bone .canvas .canvas-inner {
    padding-top: 100px;
  }
  .fishbone-header {
    position: absolute;
    z-index: 9;
    top: 15px;
    left: 15px;
    display: flex;
    justify-content: space-between;
    width: calc(100% - 15px);
    .tips {
      color: var(--green-color);
      line-height: 35px;
      margin-right: 30px;
    }
  }
}
.select-boxs {
  margin-bottom: 10px;
}
.mission-schedule {
  position: relative;
  min-height: 600px;
  margin-top: 15px;
  .whole-component {
    margin: 0;
  }
  .el-container {
    .el-aside {
      padding: 0 10px;
    }
    .el-main {
      border-left: 1px solid rgba(201, 201, 201, 1);
      min-height: 600px;
      padding: 0 10px;
    }
  }
}
</style>
