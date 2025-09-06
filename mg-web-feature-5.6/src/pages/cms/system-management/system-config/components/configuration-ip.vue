<template>
  <div v-loading="loadingScreen" class="configuration-ip">
    <div class="form-wrapper">
      <div class="top-wrapper">
        <div
          class="label-clear"
          :class="language == 'en-US' ? 'label-clear-en' : ''"
        >
          {{ $t('configuration.beforeClearResource') }}
        </div>
        <div class="top-right-wrapper">
          <div>
            <cb-button
              :loading="loadingClear"
              :disabled="disabledClear"
              @click="clearResourceConfirm"
            >
              {{ $t('configuration.clearStartedResource') }}
            </cb-button>
          </div>
          <div class="hint-label ml20">
            {{ $t('configuration.clearTip') }}
          </div>
        </div>
      </div>
      <div class="content-wrapper">
        <cb-form
          ref="elFormRef"
          label-position="right"
          :label-width="language == 'en-US' ? '180px' : '180px'"
          :model.sync="model"
          :rules="rules"
        >
          <!-- :fetchPromise="fetchForm" -->
          <cb-form-item
            :label="$t('configuration.webIpAddress')"
            prop="controller.ip"
          >
            <div class="form-item-wrapper">
              <div class="form-box">
                <div>
                  {{ $t('configuration.currentWebIpAddress') }}
                  {{ origin.controller && origin.controller.ip }}
                </div>
                <cb-input
                  v-model="model.controller.ip"
                  :placeholder="$t('configuration.currentWebIpAddressPlz')"
                />
              </div>
              <div class="hint-box form-hint-label ml10">
                {{ $t('configuration.webIpAddressTip') }}
              </div>
            </div>
          </cb-form-item>
          <cb-form-item
            :label="$t('configuration.maskCode')"
            prop="controller.netmask"
          >
            <div class="form-item-wrapper">
              <div class="form-box">
                <div>
                  {{ $t('configuration.currentMaskCode') }}
                  {{ origin.controller && origin.controller.netmask }}
                </div>
                <cb-input
                  v-model="model.controller.netmask"
                  :placeholder="$t('configuration.currentMaskCodePlz')"
                />
              </div>
            </div>
          </cb-form-item>
          <cb-form-item
            :label="$t('configuration.gateway')"
            prop="controller.gateway"
          >
            <div class="form-item-wrapper">
              <div class="form-box">
                <div>
                  {{ $t('configuration.currentGateway') }}
                  {{ origin.controller && origin.controller.gateway }}
                </div>
                <cb-input
                  v-model="model.controller.gateway"
                  :placeholder="$t('configuration.currentGatewayPlz')"
                />
              </div>
            </div>
          </cb-form-item>
          <cb-form-item
            :label="$t('configuration.networkRange')"
            class="network-address-item"
          >
            <div class="form-item-wrapper">
              <div class="form-box">
                <div>
                  {{ $t('configuration.currentNetworkRange') }}
                  {{ origin.controller && origin.controller.allocation_pools }}
                </div>
                <div
                  v-for="(item, index) in model.controller.allocation_pool"
                  :key="index"
                >
                  <cb-form-item
                    label=""
                    :prop="'controller.allocation_pool.' + index + '.address'"
                    :rules="rules.address"
                  >
                    <div class="address-box">
                      <div class="address-input-box">
                        <cb-input
                          v-model="item.address"
                          :placeholder="
                            $t('configuration.currentNetworkRangePlz')
                          "
                        />
                      </div>
                      <div class="address-icon-box">
                        <cb-iconfont
                          v-if="model.controller.allocation_pool.length > 1"
                          type="icon-jianshao"
                          :size="16"
                          class="cursor"
                          @click="deleteItem(index)"
                        />
                        <cb-iconfont
                          v-if="showAdd(index)"
                          type="icon-xinzeng"
                          :size="16"
                          class="xinzeng-icon cursor"
                          @click="addItem()"
                        />
                      </div>
                    </div>
                  </cb-form-item>
                </div>
              </div>
              <div class="hint-box form-hint-label ml10">
                <div>
                  {{ $t('configuration.networkRangeTip') }}
                </div>
              </div>
            </div>
          </cb-form-item>
          <cb-form-item
            :label="$t('configuration.nodeWebIp')"
            class="compute-ip-item"
            v-if="model.compute && model.compute.length > 0"
          >
            <div class="form-item-wrapper">
              <div class="form-box">
                <div v-for="(item, index) in model.compute" :key="index">
                  <cb-form-item
                    label=""
                    :prop="'compute.' + index + '.newIp'"
                    :rules="rules.newIp"
                  >
                    <div>
                      {{ $t('configuration.currentNodeWebIp') }}
                      {{ item.ip }}
                    </div>
                    <cb-input
                      v-model="item.newIp"
                      :placeholder="$t('configuration.currentNodeWebIpPlz')"
                    />
                  </cb-form-item>
                </div>
              </div>
              <div class="hint-box form-hint-label ml10">
                <div>
                  {{ $t('configuration.nodeWebIpTip') }}
                </div>
              </div>
            </div>
          </cb-form-item>
          <cb-form-item :label="$t('configuration.modelIp')" prop="office.ip">
            <div class="form-item-wrapper">
              <div class="form-box">
                <div>
                  {{ $t('configuration.currentModelIp') }}
                  {{ origin.office && origin.office.ip }}
                </div>
                <cb-input
                  v-model="model.office.ip"
                  :placeholder="$t('configuration.currentModelIpPlz')"
                />
              </div>
              <div class="hint-box form-hint-label ml10">
                {{ $t('configuration.modelIpTip') }}
              </div>
            </div>
          </cb-form-item>
          <div class="form-button-bar">
            <cb-button
              buttonType="confirm"
              :loading="loadingSave"
              :disabled="loadingSave"
              mr
              @click="submitForm"
            ></cb-button>
          </div>
        </cb-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  patternIp,
  networkAddressRangeValidate,
} from '@/utils/validate-configuration-ip.js';
import { getLanguage } from '@cyber/helper';

export default {
  components: {},
  data() {
    return {
      language: getLanguage(),
      loadingScreen: false,
      loadingClear: false,
      disabledClear: false,
      loadingSave: false,
      addressLength: 99,
      origin: {
        compute: [],
        controller: {
          allocation_pools: '',
          gateway: '',
          ip: '',
          netmask: '',
        },
        office: {
          ip: '',
        },
      },
      model: {
        compute: [],
        controller: {
          allocation_pools: '',
          allocation_pool: [
            {
              address: '',
            },
          ],
          gateway: '',
          ip: '',
          netmask: '',
        },
        office: {
          ip: '',
        },
      },
      rules: {
        'controller.ip': [
          {
            pattern: patternIp,
            message: this.$t('configuration.webPortIpError'),
            trigger: 'blur',
          },
        ],
        'controller.netmask': [
          {
            pattern: patternIp,
            message: this.$t('configuration.maskError'),
            trigger: 'blur',
          },
        ],
        'controller.gateway': [
          {
            pattern: patternIp,
            message: this.$t('configuration.gatewayError'),
            trigger: 'blur',
          },
        ],
        address: [
          {
            validator: (rule, value, callback) => {
              networkAddressRangeValidate(
                rule,
                value,
                callback,
                this.model.controller.netmask ||
                  (this.origin.controller && this.origin.controller.netmask) ||
                  '',
              );
            },
            trigger: 'blur',
          },
        ],
        newIp: [
          {
            pattern: patternIp,
            message: this.$t('configuration.nodeWebIpError'),
            trigger: 'blur',
          },
        ],
        'office.ip': [
          {
            pattern: patternIp,
            message: this.$t('configuration.modelIpError'),
            trigger: 'blur',
          },
        ],
      },
      baseURL: '',
      url: '',
    };
  },
  created() {
    this.loadingScreen = true;
    this.getOriginData();
  },
  methods: {
    getOriginData() {
      this.$request
        .get('/agg/environment/get_origin_ip', null, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          const data = _.get(res, 'data.data', '');
          const cloneData = _.cloneDeep(data);
          _.forEach(cloneData.compute, (item) => {
            this.$set(item, 'newIp', '');
          });
          this.origin.controller = cloneData.controller;
          this.origin.compute = _.get(res, 'data.data.compute', []);
          this.origin.office = cloneData.office;
          this.model.compute = cloneData.compute;
          this.loadingScreen = false;
        });
    },
    clearResourceConfirm() {
      this.$confirm(this.$t('configuration.clearConfirm'), '', {
        confirmButtonText: this.$t('resource.confirm'),
        cancelButtonText: this.$t('resource.cancel'),
        type: 'warning',
      })
        .then(() => {
          //确认
          this.loadingClear = true;
          this.$request
            .delete('/agg/environment/clear_all', null, {
              baseURL: '/api/mp',
            })
            .then((res) => {
              this.loadingClear = false;
              this.disabledClear = true;
            });
        })
        .catch(() => {
          //取消
        });
    },
    showAdd(index) {
      const flagLen = this.model.controller.allocation_pool.length;
      if (flagLen === 1) {
        return true;
      } else if (flagLen === this.addressLength) {
        return false;
      } else if (flagLen > 1) {
        if (flagLen === index + 1) {
          return true;
        }
        return false;
      }
    },
    addItem() {
      this.model.controller.allocation_pool.push({
        address: '',
      });
    },
    deleteItem(index) {
      this.model.controller.allocation_pool.splice(index, 1);
    },
    submitForm() {
      // this.$refs.elFormRef.submit();
      this.$refs.elFormRef.submitValidate((valid) => {
        if (!valid) {
          return;
        } else {
          this.fetchForm();
        }
      });
    },
    fetchForm() {
      const formData = _.cloneDeep(this.model);
      if (!formData.controller.ip) {
        formData.controller.ip = this.origin.controller.ip;
      }
      if (!formData.controller.netmask) {
        formData.controller.netmask = this.origin.controller.netmask;
      }
      if (!formData.controller.gateway) {
        formData.controller.gateway = this.origin.controller.gateway;
      }

      let hoolsDataArr = [];
      _.forEach(formData.controller.allocation_pool, (item) => {
        if (item.address) {
          hoolsDataArr.push(item.address);
        }
      });
      if (hoolsDataArr.length > 0) {
        // 地址池有值
        formData.controller.allocation_pools = hoolsDataArr.join(',');
      } else {
        // 若地址池都没值，则用原始数据
        formData.controller.allocation_pools =
          this.origin.controller.allocation_pools;
      }
      // 删除克隆数据里的allocation_pool
      delete formData.controller.allocation_pool;

      // 计算节点Web口IP地址数据处理
      _.forEach(formData.compute, (item) => {
        if (item.newIp) {
          delete item.ip;
          this.$set(item, 'ip', item.newIp);
          delete item.newIp;
        } else {
          delete item.newIp;
        }
      });
      if (!formData.office.ip) {
        formData.office.ip = this.origin.office.ip;
      }
      if (_.isEqual(formData, this.origin)) {
        this.$message.error(this.$t('configuration.noChange'));
      } else {
        const computeStatusError = _.filter(formData.compute, (item) => {
          return item.status === false;
        });
        if (computeStatusError.length > 0) {
          // 计算节点有异常的 弹出异常二次确认
          this.$confirm(this.$t('configuration.nodeErrorConfirm'), '', {
            confirmButtonText: this.$t('configuration.stillContinue'),
            cancelButtonText: this.$t('resource.cancel'),
            type: 'warning',
          })
            .then(() => {
              //确认
              this.loadingSave = true;
              this.submitOpt(formData);
            })
            .catch(() => {
              //取消
            });
        } else {
          //正常弹出
          this.$confirm(this.$t('configuration.saveConfirm'), '', {
            confirmButtonText: this.$t('resource.confirm'),
            cancelButtonText: this.$t('resource.cancel'),
            type: 'warning',
          })
            .then(() => {
              //确认
              this.loadingSave = true;
              this.submitOpt(formData);
            })
            .catch(() => {
              //取消
            });
        }
      }
    },
    submitOpt(formData) {
      this.$request
        .post(
          '/agg/environment/reset_all_ip',
          { ...formData },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          this.loadingSave = false;
          let openUrl = this.$router.resolve({
            path: `/admin/deploy-await`,
            query: {
              ip: formData.controller.ip,
            },
          });
          window.open(openUrl.href, '_blank');
        })
        .catch((err) => {
          this.loadingSave = false;
        });
    },
  },
};
</script>
<style lang="scss">
.configuration-ip {
  .el-form {
    padding-right: 2%;
  }
  .network-address-item,
  .compute-ip-item {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss" scoped>
.hint-label {
  color: var(--yellow-color);
  font-size: 14px;
}
.form-hint-label {
  color: var(--yellow-color);
  font-size: 14px;
}
.hint-box {
  line-height: 19px;
  margin-top: 8px;
}
.configuration-ip {
  .top-wrapper {
    display: flex;
    align-items: center;
  }
  .label-clear {
    color: var(--neutral8);
    font-size: 14px;
  }
  .label-clear-en {
    width: 178px;
  }
  .top-right-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .form-item-wrapper {
    display: flex;
  }
  .form-box {
    width: 70%;
  }
  .hint-box {
    width: 30%;
  }

  .address-box {
    display: flex;
    justify-content: space-around;
    .address-input-box {
      width: calc(100% - 70px);
    }
    .address-icon-box {
      padding-left: 15px;
      width: 70px;
      flex: 1;
      .xinzeng-icon {
        margin-left: 19px;
      }
    }
  }
}
</style>
