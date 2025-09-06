<template>
  <div class="probes-third">
    <cb-scrollbar :height="scrollHeight">
      <div class="probes-content">
        <div class="probes-right">
          <div class="search-content">
            <div class="common-search" v-if="type == 'referee'">
              <div class="common-search-text">
                <span class="mr20 spanWidth">{{ $t('m.time') }}</span>
                <cb-date-picker
                  v-model="startEndTime"
                  type="daterange"
                  :range-separator="$t('m.to')"
                  :start-placeholder="$t('m.startTime')"
                  :end-placeholder="$t('m.endTime')"
                  @change="timeChange"
                >
                </cb-date-picker>
                <cb-input
                  class="inputStyle ml20"
                  v-model="keyWords"
                  @clear="clearKey"
                  clearable
                  :placeholder="$t('m.pleaseEnterKeyWords')"
                />
              </div>
              <div class="common-search-text mt10">
                <span class="mr20 spanWidth">{{ $t('m.main') }}</span>
                <cb-select
                  v-model="hostValue"
                  :options="hostOptions"
                  :first="{
                    value: null,
                    label: $t('m.all'),
                  }"
                  @change="changeLevel"
                ></cb-select>
                <span class="ml20 mr20">{{ $t('m.collectionType') }}</span>
                <cb-select
                  v-model="categerValue"
                  :options="categerOptions"
                  @change="changeLevel"
                ></cb-select>
              </div>
              <div class="common-search-text mt10">
                <span class="mr20">{{ $t('m.ruleLevel') }}</span>
                <cb-select
                  v-model="levelValue"
                  :options="levelOptions"
                  :first="firstOption"
                  @change="changeLevel"
                ></cb-select>
                <cb-button-group class="ml20">
                  <cb-button class="ml20" @click="getDataListSearchRefree">{{
                    $t('common.search')
                  }}</cb-button>
                  <cb-button color-type="hollow" @click="clearDataReferee">{{
                    $t('m.resetCondition')
                  }}</cb-button>
                </cb-button-group>
              </div>
            </div>
            <div class="common-search" v-else>
              <div class="common-search-text">
                <span class="mr20">{{ $t('m.time') }}</span>
                <cb-date-picker
                  v-model="startEndTime"
                  type="daterange"
                  :range-separator="$t('m.to')"
                  :start-placeholder="$t('m.startTime')"
                  :end-placeholder="$t('m.endTime')"
                  @change="timeChange"
                >
                </cb-date-picker>
                <span class="ml20 mr20">{{ $t('m.ruleLevel') }}</span>

                <cb-select
                  v-model="levelValue"
                  :options="levelOptions"
                  :first="firstOption"
                  @change="changeLevel"
                ></cb-select>
                <cb-input
                  class="inputStyle ml20"
                  v-model="keyWords"
                  @clear="clearKey"
                  clearable
                  :placeholder="$t('m.pleaseEnterKeyWords')"
                />
                <cb-button-group class="ml20">
                  <cb-button class="ml20" @click="searchList">{{
                    $t('common.search')
                  }}</cb-button>
                  <cb-button color-type="hollow" @click="clearData">{{
                    $t('m.resetCondition')
                  }}</cb-button>
                </cb-button-group>
              </div>
            </div>
          </div>

          <div class="tableContain tableStyle">
            <cb-search-table
              ref="param-table"
              :cols="columns"
              :dataSource="dataList"
              border
              :hidePaginOnDemand="true"
              rowKey="resource_id"
              :scroll="{ y: tabelHeight }"
              :searchBarBg="false"
            >
              <template v-slot:level="scope">
                <span>{{ getLeval(scope.data.level) }} </span>
              </template>
              <template v-slot:operate="scope">
                <cb-button
                  type="text"
                  @click="openDetails(scope.data.content)"
                  >{{ $t('m.view') }}</cb-button
                >
              </template>
            </cb-search-table>
          </div>

          <cb-pagination
            v-if="pagination.total > 0"
            small
            :total="pagination.total"
            :current-page="pagination.page"
            :current="pagination.page"
            :page-size.sync="pagination.per_page"
            @current-change="handleChange"
            @size-change="handleSizeChange"
            layout="total,sizes,prev,pager, next, jumper"
          ></cb-pagination>
        </div>
      </div>
    </cb-scrollbar>
    <cb-dialog
      :title="$t('m.view')"
      :visible.sync="dialogView"
      width="50%"
      class="dialogView manual-dialog"
    >
      <template>
        <div style="height: 500px">
          <cb-scrollbar>
            <json-viewer :value="jsonData" :expand-depth="expandDepth" />
          </cb-scrollbar>
        </div>
      </template>
    </cb-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import emptyPage from '@/pages/web/Empty';
import 'vue-json-viewer/style.css';
import { getEventType } from '@/api/web/range-test';
export default {
  components: {
    emptyPage,
  },
  props: {
    type: {
      type: String,
      default: 'tanzhen',
    },
    tabelHeight: {
      type: Number,
      default: 540,
    },
    treeNodeId: {
      type: Array,
      default: () => {},
    },
    treeData: {
      type: Array,
      default: () => {},
    },
    scene_id: {
      type: String,
      default: '',
    },
    websocketData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 当前书选中的节点id
      nodeId: '',
      treeNode: null,
      pagination: {
        page: 1,
        per_page: 10,
        total: 0,
      },
      columns: [
        {
          label: this.$t('m.main'),
          prop: 'node_name',
        },
        {
          label: this.$t('m.ruleLevel'),
          slot: 'level',
        },
        {
          label: this.$t('m.time'),
          prop: 'time',
        },
        {
          label: this.$t('m.description'),
          prop: 'description',
        },
        {
          label: this.$t('m.content'),
          slot: 'operate',
        },
      ],
      dataList: [],
      keyword: '',
      levelValue: null,
      hostValue: null,
      categerValue: null,
      //存放操作系统日志，应用系统日志，安全系统日志全部code值
      cateCodes: [],
      firstOption: {
        label: this.$t('m.allLevels'),
        value: null,
      },
      hostOptions: [],
      categerOptions: [],
      levelOptions: [
        {
          label: this.$t('m.ruleLevel0'),
          value: 0,
        },
        {
          label: this.$t('m.ruleLevel2'),
          value: 2,
        },
        {
          label: this.$t('m.ruleLevel3'),
          value: 3,
        },
        {
          label: this.$t('m.ruleLevel4'),
          value: 4,
        },
        {
          label: this.$t('m.ruleLevel5'),
          value: 5,
        },
        {
          label: this.$t('m.ruleLevel6'),
          value: 6,
        },
        {
          label: this.$t('m.ruleLevel7'),
          value: 7,
        },
        {
          label: this.$t('m.ruleLevel8'),
          value: 8,
        },
        {
          label: this.$t('m.ruleLevel9'),
          value: 9,
        },
        {
          label: this.$t('m.ruleLevel10'),
          value: 10,
        },
        {
          label: this.$t('m.ruleLevel11'),
          value: 11,
        },
        {
          label: this.$t('m.ruleLevel12'),
          value: 12,
        },
        {
          label: this.$t('m.ruleLevel13'),
          value: 13,
        },
        {
          label: this.$t('m.ruleLevel14'),
          value: 14,
        },
        {
          label: this.$t('m.ruleLevel15'),
          value: 15,
        },
      ],
      expandDepth: 0,
      jsonData: {},
      dialogView: false,
      resource_id: null,
      startEndTime: null,
      startTime: null,
      endTime: null,
      keyWords: null,
      levels: null,
    };
  },
  computed: {
    scrollHeight() {
      return 'calc(100% - 40px)';
    },
  },
  watch: {
    scene_id(val, oldval) {
      if (this.type == 'referee' && val != '') {
        // 获取主机信息
        this.$request
          .get(
            `/cscene/monitor/scene/all_elements/${this.scene_id}`,
            {
              realTimeHostState: false,
            },
            {
              baseURL: '/api/mp',
            },
          )
          .then((res) => {
            const hostData = res.data.data && res.data.data;
            this.hostOptions = hostData.map((item) => {
              return {
                label: item.name,
                value: item.id,
              };
            });
          });
        //获取采集类别
        this.getAllEventType();
      }
    },
  },
  created() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {},
  methods: {
    //获取采集类别
    getAllEventType() {
      getEventType(this.scene_id).then((res) => {
        const data = res.data.data;
        //'02'为日志事件，包含操作系统日志，应用系统日志，安全系统日志
        const logEventType = data.find((item) => item.code == '02');
        logEventType.children.forEach((item) => {
          this.categerOptions.push({
            label: item.name,
            value: item.children
              .map((obj) => {
                this.cateCodes.push(obj.code);
                return obj.code;
              })
              .join(),
          });
        });
        //全部选项的value为操作系统日志，应用系统日志，安全系统日志code值的集合
        this.categerOptions.unshift({
          label: this.$t('m.all'),
          value: this.cateCodes.join(),
        });
        //默认选择全部
        this.categerValue = this.cateCodes.join();
        //获取表格数据
        this.getDataListRefree();
      });
    },
    getLeval(level) {
      let levalObj = this.levelOptions.find((item) => {
        if (item.value == level) {
          return true;
        }
      });
      return levalObj.label;
    },
    changeLevel() {
      if (this.levelValue == null) {
        this.levels = null;
      } else {
        this.levels = this.levelValue;
      }
    },
    clearKey() {
      this.keyWords = null;
    },
    getNodeId(i) {
      return this.treeNodeId[i].id;
    },
    handleChange(val) {
      this.pagination.page = val;
      if (this.type == 'referee') {
        this.getDataListRefree();
      } else {
        this.getDataList(this.treeNode);
      }
    },
    handleSizeChange(val) {
      this.pagination.page = 1;
      this.pagination.per_page = val;
      if (this.type == 'referee') {
        this.getDataListRefree();
      } else {
        this.getDataList(this.treeNode);
      }
    },
    getLeveClass(level) {
      if (level > 4 && level < 11) {
        return 'levelStyle-middle';
      } else if (level > 10 && level < 16) {
        return 'levelStyle-hight';
      } else {
        return '';
      }
    },
    getDataListSearchRefree() {
      this.pagination.page = 1;
      this.pagination.per_page = 10;
      this.getDataListRefree();
    },
    getDataListRefree() {
      const params = Object.assign({ id: this.scene_id }, this.pagination);
      // 关键字
      if (this.keyWords != null) {
        params.keyword = this.keyWords;
      }
      if (this.categerValue != null) {
        params.catagories = this.categerValue;
      }
      if (this.levels != null) {
        params.levels = this.levelValue;
      }
      if (this.hostValue != null) {
        params.nodeIds = [this.hostValue];
      }
      if (this.startTime != null && this.endTime != null) {
        params.startTime = this.startTime;
        params.endTime = this.endTime;
      }

      this.$request
        .get(`/cscene/cscene_instances/list_host_events`, params, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          this.pagination.total = _.get(res, 'data.data.total');
          this.dataList = _.get(res, 'data.data.list');
        });
    },
    getDataList(treeNode, flag, sceneId) {
      if (flag == 1 && treeNode.type == 3) {
      } else {
        const params = Object.assign(
          { id: this.scene_id == '' ? sceneId : this.scene_id },
          this.pagination,
        );
        // 关键字
        if (this.keyWords != null) {
          params.keyword = this.keyWords;
        }
        if (this.levels != null) {
          params.levels = this.levelValue;
        }
        if (this.startTime != null && this.endTime != null) {
          params.startTime = this.startTime;
          params.endTime = this.endTime;
        }

        if (treeNode && treeNode.type != 3) {
          // 备份树节点，
          this.treeNode = _.cloneDeep(treeNode);

          if (treeNode.type == 2) {
            //点击了主机
            params.nodeIds = [];
            params.nodeIds.push(treeNode.id);
            this.nodeId = treeNode.id;
          } else if (treeNode.type == 4) {
            params.nodeIds = [];
            let id = this.getNodeId(treeNode.indexVal);
            params.nodeIds.push(id);
            this.nodeId = id;
            params.catagories = [];
            params.catagories.push(treeNode.val);
          }
        }
        this.$request
          .get(`/cscene/cscene_instances/list_host_events`, params, {
            baseURL: '/api/mp',
          })
          .then((res) => {
            this.pagination.total = _.get(res, 'data.data.total');
            this.dataList = _.get(res, 'data.data.list');
          });
      }
    },
    clearData() {
      this.startTime = null;
      this.endTime = null;
      this.levelValue = null;
      this.levels = null;
      this.startEndTime = null;
      this.keyWords = null;
    },
    clearDataReferee() {
      this.startTime = null;
      this.endTime = null;
      this.levelValue = null;
      this.levels = null;
      this.startEndTime = null;
      this.keyWords = null;
      this.hostValue = null;
      //选择全部
      this.categerValue = this.cateCodes.join();
    },
    // 时间修改
    timeChange() {
      if (this.startEndTime) {
        this.startTime = moment(this.startEndTime[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        this.endTime = moment(this.startEndTime[1]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
      } else {
        this.startTime = null;
        this.endTime = null;
      }
    },
    // add 新增
    add() {},
    websocketSingleFilter(val) {},
    searchList() {
      this.getDataList(this.treeNode);
    },
    dateToMs(date) {
      // 时间格式化
      const result = new Date(date).getTime();
      return result;
    },
    openDetails(item) {
      this.dialogView = true;
      try {
        const obj = JSON.parse(item);
        if (typeof obj === 'object' && obj) {
          this.jsonData = JSON.parse(item);
          this.expandDepth = 10;
        } else {
          this.jsonData = item;
          this.expandDepth = 0;
        }
      } catch (error) {
        this.jsonData = item;
        this.expandDepth = 10;
      }
    },
    messageDialog(type, message) {
      this.$message({
        type: type,
        message: message,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.spanWidth {
  width: 50px;
}
.tableContain {
  height: calc(100% - 50px);
}
.tableStyle {
  padding: 10px;
}
.levelStyle-middle {
  color: var(--orange-color);
}
.levelStyle-hight {
  color: var(--red-color);
}
.common-search-text {
  display: flex;
  align-items: center;
}
.ml20 {
  margin-left: 20px;
}
.mt10 {
  margin-top: 10px;
}
.mr20 {
  margin-right: 10px;
}
.inputStyle {
  width: 200px;
}
.probes-third {
  height: 100%;
  font-size: 14px;
  .probes-head {
    width: 100%;
    font-size: 14px;
    height: 54px;
    line-height: 54px;
    padding-left: 46px;
    border-radius: 0 10px 0 0;
    box-sizing: border-box;
    .common-span {
      margin-left: 5px;
    }
    .node-ip {
      float: left;
      margin-right: 10px;
      width: 19%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      span {
        margin-right: 5px;
      }
      img {
        vertical-align: middle;
      }
      i {
        color: #3974f4;
        margin-right: 3px;
      }
    }
    .probes-state {
      margin-left: 10px;
      float: left;
      span {
        margin-right: 5px;
      }
      span:last-child {
        padding: 1px 5px;
        margin-left: 5px;
        border: 1px solid #02ffa4;
        color: #02ffa4;
      }
    }
  }
  .probes-content {
    height: calc(100% - 55px);
    .probes-right {
      float: left;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .right-name {
        margin-bottom: 15px;
        color: #038bee;
      }
      .table-left-div {
        width: 100%;
      }
      .table-right-div {
        img {
          vertical-align: middle;
        }
      }
      .table-view {
        margin-left: 8px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
      }
      .search-content {
        width: 100%;
        padding: 10px 0 10px 30px;
        box-sizing: border-box;
        overflow: hidden;
        flex-shrink: 0;
        .common-search {
          width: 100%;
          clear: both;
          min-height: 40px;
          line-height: 40px;
          margin-bottom: 10px;
          overflow: hidden;
          .left-span {
            display: inline-block;
            width: 50px;
            font-size: 14px;
          }
          .right-time {
            width: calc(100% - 50px);
          }
          .query-time {
            width: 60%;
            display: flex;
            align-items: center;
          }
        }
        .content-common {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          &:last-child {
            margin-bottom: 0;
          }
          .search-select {
            width: 15%;
          }
          .search-input {
            width: calc(30% - 65px);
          }
          .and {
            width: 30px;
            margin: 0 10px;
            color: #c0cce7;
          }
          .btn_start {
            margin: 6px 0 0 10px;
            width: 80px;
            height: 26px;
            box-sizing: border-box;
            padding: 1px;
            border-radius: 2px;
            line-height: 0;
            text-align: center;
            vertical-align: middle;
            font-size: 14px;
            font-family: Microsoft YaHei;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              margin: 8px 8px 0 0;
            }
          }
        }
        .search-btn {
          text-align: center;
          .shell-search-btn {
            position: relative;
            width: 118px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            border-radius: 2px;
            text-align: center;
            ::v-deep span {
              vertical-align: middle;
            }
          }
          .clear-search-btn {
            position: relative;
            padding: 12px 20px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            border-radius: 2px;
            text-align: center;
            ::v-deepspan {
              vertical-align: middle;
            }
          }
        }
      }
      .right-content {
        height: 100%;
        flex-grow: 1;
        overflow: hidden;
        ::v-deep .has-gutter {
          display: none;
          color: #fff;
          font-size: 14px;
        }
        .el-scrollbar {
          height: 100%;
          border-radius: 8px;
          .el-scrollbar__wrap {
            overflow-x: hidden;
          }
        }
        .time {
          margin-right: 8px;
          font-size: 14px;
        }
        .ip {
          color: #57ecc2;
          margin-right: 8px;
          font-size: 14px;
        }
        .message {
          color: rgba(237, 242, 255, 1);
        }
      }
    }
  }
  .dialogView {
    ::v-deep .jv-container.jv-light {
      background: transparent !important;
    }
    ::v-deep .jv-container .jv-code {
      padding: 0 !important;
    }
    ::v-deep .jv-container.jv-light .jv-key,
    ::v-deep .jv-container.jv-light .jv-item.jv-array,
    ::v-deep .jv-container.jv-light .jv-item.jv-object {
      color: #fff !important;
    }
    ::v-deep .jv-container.jv-light .jv-ellipsis {
      background-color: #252c46;
    }
  }
}
</style>
