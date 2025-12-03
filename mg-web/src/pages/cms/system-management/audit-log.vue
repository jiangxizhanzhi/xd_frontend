<template>
  <cb-inner-page :background="false">
    <cb-search-table
      :cols="cols"
      :data.sync="model"
      ref="userListRef"
      :searchBarBg="true"
      :fetchPromise="fetchPromise"
      :show-search-btn="true"
    >
      <template v-slot:filter>
        <cb-select
          v-model="model.module"
          clearable
          :first="{
            code: '',
            name: $t('systemManagement.system.allModules'),
          }"
          :options="options"
          titleField="name"
          valueField="code"
        >
        </cb-select>
        <cb-select
          v-model="model.op_type"
          clearable
          :first="{
            code: '',
            name: $t('systemManagement.system.lowercaseAllType'),
          }"
          :options="typeOptions"
          titleField="name"
          valueField="code"
        >
        </cb-select>
        <cb-search-input
          v-model="model.userNameOrOpTarget"
          :placeholder="$t('systemManagement.system.plzUserandOperands')"
        ></cb-search-input>
      </template>
      <template v-slot:detail="scope">
        <cb-button
          v-if="scope.data.content"
          type="text"
          buttonType="view"
          @click="viewDetail(scope.data)"
          mr
          >{{ $t('systemManagement.system.catDetail') }}</cb-button
        >
      </template>
    </cb-search-table>
    <cb-dialog
      :title="$t('systemManagement.system.catDetail')"
      :visible.sync="visible"
      center
    >
      <div class="content-box">
        <cb-scrollbar>
          <cb-row type="flex" class="row-mb">
            <cb-col :span="4">
              <div class="label">
                {{ $t('systemManagement.system.userName') }}
              </div>
            </cb-col>
            <cb-col :span="20">
              <div class="value">{{ detail && detail.user_name }}</div>
            </cb-col>
          </cb-row>
          <cb-row type="flex" class="row-mb">
            <cb-col :span="4">
              <div class="label">
                {{ $t('systemManagement.system.models') }}
              </div>
            </cb-col>
            <cb-col :span="20">
              <div class="value">{{ detail && detail.op_module }}</div>
            </cb-col>
          </cb-row>
          <cb-row type="flex" class="row-mb">
            <cb-col :span="4">
              <div class="label">
                {{ $t('systemManagement.system.operationType') }}
              </div>
            </cb-col>
            <cb-col :span="20">
              <div class="value">
                {{ detail && detail.op_type }}
              </div>
            </cb-col>
          </cb-row>
          <cb-row type="flex" class="row-mb">
            <cb-col :span="4">
              <div class="label">
                {{ $t('systemManagement.system.operands') }}
              </div>
            </cb-col>
            <cb-col :span="20">
              <div class="value">
                {{ detail && detail.op_target }}
              </div>
            </cb-col>
          </cb-row>
          <cb-row type="flex" class="row-mb">
            <cb-col :span="4">
              <div class="label">
                {{ $t('systemManagement.system.createTime') }}
              </div>
            </cb-col>
            <cb-col :span="20">
              <div class="value">
                {{ detail && detail.op_time }}
              </div>
            </cb-col>
          </cb-row>
          <cb-row type="flex" class="row-mb">
            <cb-col :span="4">
              <div class="label">
                {{ $t('systemManagement.system.detail') }}
              </div>
            </cb-col>
            <cb-col :span="20">
              <pre class="json-viewer">
                <cb-json-viewer :data='contentCom'> </cb-json-viewer>
              </pre>
            </cb-col>
          </cb-row>
        </cb-scrollbar>
      </div>
    </cb-dialog>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import {
  getAudioLogModels,
  getAudioLogTypes,
  getAudioList,
  getAudioLogMessage,
} from '@/api/system-management.ts';
export default {
  data() {
    return {
      model: {
        module: '',
        op_type: '',
        userNameOrOpTarget: '',
      },
      options: [],
      typeOptions: [],
      cols: [
        {
          label: this.$t('systemManagement.system.userName'),
          prop: 'user_name',
        },
        {
          label: this.$t('systemManagement.system.audioName'),
          prop: 'name',
        },
        {
          label: this.$t('systemManagement.system.models'),
          prop: 'op_module',
        },
        {
          label: this.$t('systemManagement.system.operationType'),
          prop: 'op_type',
        },
        {
          label: this.$t('systemManagement.system.operands'),
          prop: 'op_target',
        },
        {
          label: this.$t('systemManagement.system.createTime'),
          prop: 'op_time',
        },
        {
          label: this.$t('systemManagement.system.catDetail'),
          slot: 'detail',
        },
      ],
      resource_id: '',
      visible: false,
      detail: {},
    };
  },
  mounted() {
    this.getModelList();
    this.getTypeList();
  },
  computed: {
    contentCom() {
      if (this.detail.content) {
        try {
          return JSON.parse(this.detail.content);
        } catch (e) {
          return this.detail.content;
        }
      }
      return '';
    },
  },
  methods: {
    // fetchPromise
    fetchPromise(queryData, option) {
      return new Promise((resolve) => {
        getAudioList(queryData).then((res) => {
          const dataIdList = res.data.data.list.map((item) => {
            return item.user_id;
          });
          getAudioLogMessage(dataIdList).then((resp) => {
            const tempdata = _.get(resp, 'data.data', []);
            const idNameMap = {};
            tempdata.map((item) => {
              idNameMap[item.id] = item.name;
            });
            res.data.data.list.map((item) => {
              this.$set(item, 'name', idNameMap[item.user_id]);
            });
            resolve(res);
          });
        });
      });
    },
    getOperationData(type) {
      const data = TypeList.find((item) => {
        return type === item.value;
      });
      return data && data.label;
    },
    viewDetail(data) {
      this.visible = true;
      this.detail = { ...data };
    },
    getModelList() {
      getAudioLogModels().then((res) => {
        this.options = _.get(res, 'data.data', []);
      });
    },
    getTypeList() {
      getAudioLogTypes().then((res) => {
        this.typeOptions = _.get(res, 'data.data', []);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.content-box {
  margin: 0 60px;
  height: 500px;
  .row-mb {
    margin-bottom: 40px;
  }
  .json-viewer {
    width: 100%;
    overflow-x: auto;
    border-radius: 16px;
    padding: 8px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>
