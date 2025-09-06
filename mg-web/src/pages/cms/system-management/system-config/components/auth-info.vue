<template>
  <!-- 授权信息 -->
  <div class="product-activated">
    <!-- 头部标题 -->
    <div class="activated-head">
      <div class="head-text">
        {{ $t('systemManagement.system.activation.activated') }}
      </div>
      <div class="head-decorate">
        <span class="head-decorate__star">★★★</span
        ><span class="head-decorate__text">{{
          $t('systemManagement.system.activation.activatedSmall')
        }}</span
        ><span class="head-decorate__star">★★★</span>
      </div>
    </div>
    <!-- 内容 -->
    <div class="activated-content" v-loading="loading">
      <!-- 表格 -->
      <cb-form :model.sync="model" label-width="130px">
        <!-- 磁盘序列号 -->
        <cb-form-item
          :label="$t('systemManagement.system.activation.machineCode')"
        >
          <div class="machine-code">{{ model.machine_code }}</div>
        </cb-form-item>
        <!-- 授权期限 -->
        <cb-form-item
          :label="$t('systemManagement.system.activation.authorizationTerm')"
        >
          <div style="display: flex">
            <div class="expired-date">{{ model.expired_date }}</div>
            <cb-button ml buttonType="confirm" @click="delay" hollow>{{
              $t('systemManagement.system.activation.extension')
            }}</cb-button>
          </div>
        </cb-form-item>
        <!-- 授权版本 -->
        <cb-form-item
          :label="$t('systemManagement.system.activation.authorizedVersion')"
        >
          <div class="modules-mask"></div>
          <cb-row class="activated-row">
            <cb-radio-group v-model="model.edition" style="width: 80%">
              <cb-col :span="3">
                <cb-radio :label="0" :disabled="model.edition !== 0">{{
                  $t('systemManagement.system.activation.standardEdition')
                }}</cb-radio>
              </cb-col>
              <cb-col :span="3">
                <cb-radio :label="1" :disabled="model.edition !== 1">{{
                  $t('systemManagement.system.activation.professionalEdition')
                }}</cb-radio>
              </cb-col>
            </cb-radio-group>
          </cb-row>
        </cb-form-item>
        <!-- 授权功能 -->
        <cb-form-item
          :label="
            $t('systemManagement.system.activation.authorizationFunction')
          "
          class="modules-group"
        >
          <div class="modules-mask"></div>
          <div v-for="item in functionList" :key="item.key">
            <cb-checkbox
              :disabled="item.value === '0'"
              :label="item.name"
              v-model="item.value === '1' ? true : false"
            ></cb-checkbox>
          </div>
        </cb-form-item>
        <!-- 授权资源 -->
        <cb-form-item
          :label="$t('systemManagement.system.activation.authorizedResources')"
        >
          <cb-search-table
            ref="controlTabel"
            hidePaginOnDemand
            :cols="controlColumns"
            :data-source="rescourceItems"
            style="float: left"
            :searchBarBg="false"
          >
          </cb-search-table>
        </cb-form-item>
      </cb-form>
    </div>
    <!-- 底部 -->
    <div class="activated-foot">
      <div>{{ $t('systemManagement.system.activation.systemMsg') }}</div>
    </div>
    <cb-dialog
      :visible.sync="isShowActiveDialog"
      :title="$t('systemManagement.system.grantTerm')"
      width="800px"
      class="delay-dialog"
      @close="updateData"
    >
      <active-dialog
        :active-data="model"
        :function-data="functionList"
        :resource-data="rescourceItems"
        @updateData="updateData"
      ></active-dialog>
    </cb-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { activeModule } from '@/constants/active-module';
import ActiveDialog from './active-dialog.vue';
export default {
  components: {
    ActiveDialog,
  },
  data() {
    return {
      model: {
        edition: 1,
        machine_code: '',
        expired_date: '',
      },
      rescourceItems: [],
      resourceKeys: ['LCS-RES-CR-ACTIVENODES', 'LCS-RES-CR-EDITNODES'],
      deleteJinsai: [
        'LCS-FUNC-CR-JINGSAI',
        'LCS-FUNC-CR-HUOTILOUDONG',
        'LCS-FUNC-CR-SHENTOUSAI',
        'LCS-FUNC-CR-YUNWEISAI',
        'LCS-FUNC-CR-CEPING',
      ],
      // 授权功能
      functionList: [],
      // 授权资源
      controlColumns: [
        {
          title: this.$t('systemManagement.system.activation.productModule'),
          prop: 'module',
        },
        {
          title: this.$t('systemManagement.system.activation.controlItems'),
          prop: 'name',
        },
        {
          title: this.$t('systemManagement.system.activation.maxiMum'),
          prop: 'value',
          width: '25%',
        },
      ],
      loading: false,
      isShowActiveDialog: false,
    };
  },
  created() {
    this.getActivationInfo();
  },
  mounted() {},
  methods: {
    getActivationInfo() {
      this.loading = true;
      this.$request
        .get('/sys/activation/status', null, { baseURL: '/api/mp' })
        .then((res) => {
          this.model = _.get(res, 'data.data', {});
          this.rescourceItems = [];
          this.functionList = [];
          (this.model.items || []).map((i) => {
            if (this.resourceKeys.includes(i.key)) {
              i.module = this.$t('activation.seningCloudPlatformBJST');
              if (i.key === 'LCS-RES-CR-ACTIVENODES') {
                i.name = this.$t('activation.maxSceneNode');
              } else if (i.key === 'LCS-RES-CR-EDITNODES') {
                i.name = this.$t('activation.maxEditNode');
              }
              this.rescourceItems.push(i);
            } else {
              for (let j = 0; j < activeModule.length; j++) {
                if (i.key === activeModule[j].key) {
                  i.name = activeModule[j].name;
                  const isExclude = _.has(activeModule[j], 'exclude');
                  if (isExclude) {
                    this.$set(i, 'exclude', activeModule[j].exclude);
                  }
                  break;
                }
              }
              this.functionList.push(i);
            }
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    delay() {
      this.isShowActiveDialog = true;
    },
    updateData() {
      this.isShowActiveDialog = false;
      this.getActivationInfo();
    },
  },
};
</script>

<style lang="scss" scoped>
.product-activated {
  width: 1300px;
  padding: 56px 0 64px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
  .activated-head {
    margin-bottom: 40px;
    .head-text {
      text-align: center;
      font-size: 60px;
      font-family: youshebiaotihei !important;
      color: var(--neutral8);
    }
    .head-decorate {
      text-align: center;
      color: var(--neutral8);
      font-size: 16px;
      .head-decorate__text {
        font-family: youshebiaotihei !important;
        margin: 0px 12px;
      }
    }
  }
  .activated-content {
    .activated-row {
      .cb-radio-horizontal {
        display: flex;
        align-items: center;
        height: 36px;
      }
    }
    .modules-group {
      ::v-deep .el-form-item__content {
        position: relative;
        display: flex;
        align-items: center;
        .el-checkbox {
          margin: 8px 20px 8px 0;
        }
      }
    }
    .modules-mask {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2;
    }
    .cb-form {
      ::v-deep .el-form-item__label {
        color: var(--neutral8);
        font-size: 14px;
      }
      .underly-txt {
        color: var(--neutral8);
        font-size: 14px;
      }
    }
  }
  .activated-foot {
    font-size: 16px;
    color: var(--neutral5);
    margin-top: 100px;
  }
}
</style>
