<template>
  <cb-inner-page :background="false" class="vuln-cms-form-page">
    <div v-loading="loading">
      <cb-form
        class="vuln-cms-form"
        ref="cbFormRef"
        label-width="auto"
        labelPosition="left"
        :model.sync="model"
        :rules="rules"
        json
        :url="url"
        baseURL="/api/vuln"
        :id="resourceId"
      >
        <!-- 基本信息 -->
        <cb-form-block :title="$t('vulnList.basicInformation')">
          <cb-form-item
            :label="$t('common.vulnerabilityName') + $t('common.colon')"
            prop="name"
          >
            <cb-input
              :placeholder="$t('vulnList.inputVulnerabilityName')"
              v-input-trim
              v-model="model.name"
              maxlength="255"
            />
          </cb-form-item>
          <cb-form-item
            :label="$t('common.vulNumber') + $t('common.colon')"
            prop="code"
            :show-message="false"
          >
            <cb-form-tags
              class="code-tags"
              v-model="model.code"
              is-active
              :listMaxLen="10"
              maxlength="30"
              :checkRepeat="false"
              :customInputReg="customInputReg"
              :input-style="{ width: '160px' }"
            ></cb-form-tags>
          </cb-form-item>
          <cb-form-item
            :label="$t('common.weaknessList') + $t('common.colon')"
            prop="cwe_category_id"
          >
            <!-- 弱点枚举 -->
            <cb-input v-model="selectedTreedName" style="display: none" />
            <span v-if="selectedTreedName" class="mr16 vuln-color-white">{{
              selectedTreedName
            }}</span>
            <cb-button type="text" @click="showBoard()">
              {{
                selectedTreedName
                  ? $t('vulnList.change')
                  : $t('vulnList.clickSelect')
              }}
            </cb-button>
          </cb-form-item>
          <cb-form-item
            :label="$t('common.vulnerabilityImpact') + $t('common.colon')"
            prop="impact"
          >
            <!-- 漏洞影响 -->
            <vuln-impact
              ref="vulnImpactRef"
              :data.sync="model.impact"
              @updateValidate="showValidate"
              @updateRemoveValidate="showRemoveValidate"
            />
          </cb-form-item>
          <cb-form-item
            :label="$t('common.CVSS3') + $t('common.colon')"
            prop="cvss_v3"
          >
            <cb-input-number
              v-model="model.cvss_v3"
              controls-position="right"
              :precision="1"
              :step="0.1"
              :min="0"
              :max="10"
            ></cb-input-number>
            <cb-popover placement="right" trigger="hover">
              <div class="tip-popover">
                <div>
                  {{ $t('vulnList.CVSS3ScoreTips1') + $t('common.colon') }}
                </div>
                <div>{{ $t('vulnList.CVSS3ScoreTips2') }}</div>
                <div>{{ $t('vulnList.CVSS3ScoreTips3') }}</div>
              </div>
              <cb-iconfont
                slot="reference"
                type="icon-shuoming"
                themedColor="neutral8"
                :size="16"
                style="cursor: pointer"
              />
            </cb-popover> </cb-form-item
        ></cb-form-block>
        <cb-form-block :title="$t('common.basicScoreIndex')">
          <!-- 基本分数指标 -->
          <score-vector ref="scoreVectorRef" :data.sync="model.vector" />
        </cb-form-block>
        <cb-form-block>
          <form-collapse :title="$t('common.timeScoreIndex')">
            <!-- 时间得分指标 -->
            <time-vector ref="timeVectorRef" :data.sync="model.time_vector" />
          </form-collapse>
        </cb-form-block>
        <cb-form-block>
          <!--环境得分指标 -->
          <form-collapse :title="$t('common.environmentalScoringIndex')">
            <env-vector ref="envVectorRef" :data.sync="model.env_vector" />
          </form-collapse>
        </cb-form-block>
        <cb-form-block :title="$t('vulnList.otherInformation')">
          <!-- 其他信息 -->
          <cb-form-item
            :label="$t('common.useType') + $t('common.colon')"
            prop="utilize_category"
          >
            <cb-radio-group v-model="model.utilize_category">
              <cb-radio
                v-for="item in attackTypeOptions.list"
                :key="'category_' + item.value"
                :label="item.value"
                >{{ item.label }}</cb-radio
              >
            </cb-radio-group>
          </cb-form-item>
          <cb-form-item
            :label="$t('common.industry') + $t('common.colon')"
            prop="industry"
          >
            <cb-radio-group v-model="model.industry">
              <!-- 其他 选项 放到最后 -->
              <cb-radio
                v-for="item in businessOptions.list.filter((i) =>
                  Boolean(i.value),
                )"
                :key="'platform1_' + item.value"
                :label="item.value"
                >{{ item.label }}</cb-radio
              >
              <cb-radio :label="businessOptions.other">
                {{ businessOptions[businessOptions.other] }}
              </cb-radio>
            </cb-radio-group>
          </cb-form-item>
          <cb-form-item
            :label="$t('vulnList.belongingPlatform') + $t('common.colon')"
            prop="platform"
          >
            <cb-select
              v-loading="platformLoading"
              v-model="model.platform"
              :options="platformList"
            />
          </cb-form-item>
          <cb-form-item
            :label="$t('common.vulDescription') + $t('common.colon')"
            prop="desc"
          >
            <cb-input
              v-input-trim
              type="textarea"
              rows="3"
              :placeholder="$t('vulnList.inputVulDescription')"
              v-model="model.desc"
              maxlength="2048"
              show-word-limit
            />
          </cb-form-item>
          <cb-form-item
            :label="$t('common.sourceVulnerability') + $t('common.colon')"
            prop="source"
          >
            <cb-input
              v-input-trim
              v-model="model.source"
              maxlength="255"
              :placeholder="$t('vulnList.inputSource')"
            />
          </cb-form-item>
          <cb-form-item
            :label="$t('common.repairMethod') + $t('common.colon')"
            prop="patch_title"
          >
            <cb-input
              v-input-trim
              type="textarea"
              rows="3"
              maxlength="2048"
              :placeholder="$t('vulnList.inputRepairMethod')"
              v-model="model.patch_title"
              show-word-limit
            />
          </cb-form-item>
        </cb-form-block>
        <template slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button
              loading
              button-type="confirm"
              @click="submit"
            ></cb-button>
            <cb-button
              button-type="cancel"
              link-name="vulnerability"
            ></cb-button>
          </cb-button-group>
        </template>
      </cb-form>
      <tree-dialog
        ref="treeRefDialog"
        :treeData="cweCategory"
        @fill-input="fillInput"
      ></tree-dialog>
    </div>
  </cb-inner-page>
</template>

<script>
import TitleHead from '@/components/title/index.vue';
import VulnImpact from './vuln-impact.vue';
import ScoreVector from './score-vector.vue';
import TimeVector from './time-vector.vue';
import EnvVector from './env-vector.vue';
import FormCollapse from '@/components/form-collapse';
import TreeDialog from './tree-dialog.vue';
import { attackTypeOptions, businessOptions } from '@/constants/index.js';
import { getPlatform, getCweCategory } from '@/api/vuln-cms';
import _ from 'lodash';
import { pickDiff } from '@/utils/form';
export default {
  name: 'VulnWebHoleForm',
  components: {
    TitleHead,
    VulnImpact,
    ScoreVector,
    TimeVector,
    EnvVector,
    FormCollapse,
    TreeDialog,
  },
  props: {
    resourceId: String,
    url: String,
  },
  data() {
    return {
      loading: false,
      model: {
        name: '',
        code: [],
        cwe_category_id: '',
        impact: [],
        cvss_v3: 0,
        vector: {},
        time_vector: {},
        env_vector: {},
        utilize_category: 0,
        industry: 1,
        platform: '',
        desc: '',
        source: '',
        patch_title: '',
      },
      selectedTreedName: '',
      original: {},
      cweCategory: [],
      defaultProps: {
        label: 'name',
        value: 'id',
        emitPath: false,
        checkStrictly: true,
      },
      platformList: [],
      platformLoading: true,
      cweLoading: true,
      attackTypeOptions,
      businessOptions,
      rules: {
        name: [
          {
            required: true,
            message: this.$t('vulnList.inputVulnerabilityName'),
            trigger: ['blur', 'change'],
          },
          {
            max: 255,
            message: this.$t('common.lengthLimit255'),
            trigger: ['blur', 'change'],
          },
        ],
        code: [
          {
            required: true,
            trigger: [],
            validator: (rules, value, callback) => {
              if (value.length === 0) {
                const errMsg = this.$t('vulnList.PlzEnterVulnerabilityNumber');
                this.$message.error(errMsg);
                callback(new Error(errMsg));
              } else {
                callback();
              }
            },
          },
        ],
        cwe_category_id: [
          {
            required: true,
            message: this.$t('vulnList.inputWeaknessList'),
            trigger: ['change'],
          },
        ],
        impact: [
          {
            required: true,
            message: this.$t('vulnList.inputVulnerabilityImpact'),
            trigger: [],
          },
        ],
        cvss_v3: [
          {
            required: true,
            message: this.$t('vulnList.inputScore'),
            trigger: ['blur', 'change'],
          },
        ],
        desc: [
          {
            max: 2048,
            message: this.$t('common.lengthLimit2048'),
            trigger: ['blur', 'change'],
          },
        ],
        source: [
          {
            max: 255,
            message: this.$t('common.lengthLimit255'),
            trigger: ['blur', 'change'],
          },
        ],
        patch_title: [
          {
            max: 2048,
            message: this.$t('common.lengthLimit2048'),
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  mounted() {
    this.getPlatform();
    if (this.resourceId) {
      this.loading = true;
      const proms = [];
      proms.push(this.getCweCategory());
      proms.push(
        this.$refs.cbFormRef.getModelData({
          url: `/admin/vuln/detail/${this.resourceId}/`,
        }),
      );
      Promise.all(proms).then((res) => {
        const [cweCategory, model] = res;
        this.$refs.scoreVectorRef.setData(model.vector);
        this.$refs.envVectorRef.setData(model.env_vector);
        this.$refs.timeVectorRef.setData(model.time_vector);
        const current = this.findTree(cweCategory, {
          id: model.cwe_category_id,
        });
        this.selectedTreedName = current.name;
        this.original = _.cloneDeep(this.model);
        this.loading = false;
      });
    } else {
      this.getCweCategory();
    }
  },

  methods: {
    //添加漏洞影响后清除校验
    showValidate() {
      this.$refs.cbFormRef.clearValidate(['impact']);
    },
    //删除漏洞影响后判断数组是否为空添加校验
    showRemoveValidate(val) {
      if (val.length === 0) {
        this.$refs.cbFormRef.validateField('impact');
      }
    },
    //漏洞编号重复校验
    customInputReg(value) {
      const codeNum = _.findIndex(this.model.code, function (item) {
        return item.trim() === value.trim();
      });
      if (value.trim() === '') {
        this.$message.error(this.$t('vulnList.PlzEnterVulnerabilityNumber'));
        return false;
      }
      if (codeNum > -1) {
        this.$message.error(
          this.$t('vulnList.VulnerabilityNumberRepeated') +
            this.$t('vulnList.PlzReEnterVulnerabilityNumber'),
        );
        return false;
      }
      return true;
    },
    getCweCategory() {
      return new Promise((resolve) => {
        getCweCategory()
          .then((res) => {
            this.cweCategory = _.get(res, 'data.data');
            resolve(this.cweCategory);
          })
          .finally(() => {
            this.cweLoading = false;
          });
      });
    },
    forTree(treeData, callback, children = 'children', parent = null) {
      _.forEach(treeData, (o) => {
        callback(o, parent);
        if (o[children] && o[children].length > 0) {
          this.forTree(o.children, callback, children, o);
        }
      });
    },
    findTree(treeData, query, children = 'children') {
      let r = null;
      this.forTree(
        treeData,
        (o) => {
          if (_.isMatch(o, query)) {
            r = o;
          }
        },
        children,
      );
      return r;
    },
    getPlatform() {
      getPlatform()
        .then((res) => {
          this.platformList = _.get(res, 'data.data');
          this.model.platform = this.platformList[0];
        })
        .finally(() => {
          this.platformLoading = false;
        });
    },
    showBoard() {
      this.$refs.treeRefDialog.showTreeDialog = true;
    },
    fillInput(node, name) {
      this.model.cwe_category_id = node;
      this.selectedTreedName = name;
    },
    submit(done) {
      let postData = pickDiff(this.model, this.original);
      this.$refs.cbFormRef
        .submit(postData)
        .then(() => {
          const impactValidate = this.$refs.vulnImpactRef.validate();
          if (!impactValidate) {
            done();
            return;
          }
          this.$router.push({ name: 'vulnerability' });
        })
        .finally(() => {
          done();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.hidden-title {
  display: block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mr16 {
  margin-right: 16px;
}
.code-tags {
  min-height: var(--form-item-height);
}
</style>
<style lang="scss">
.cwe-category-option .el-cascader-node__label {
  z-index: 10;
}
</style>
