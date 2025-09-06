<template>
  <cb-dialog
    :visible="visibleVal"
    width="960px"
    @close="handleClose"
    custom-class="import-dialog"
    ref="algorithmDialog"
  >
    <template slot="title">
      <div>{{ $t('assessment.algorithmDetail') }}</div>
    </template>
    <div class="cyber-scroll-bar" style="max-height: 500px; overflow: auto">
      <div class="detail-form">
        <div>
          <div class="form-item">
            <span class="form-label">{{ $t('assessment.algorithmName') }}:</span
            ><span>{{ algorithmData.name || '-' }}</span>
          </div>
          <div class="form-item">
            <span class="form-label">{{ $t('assessment.algorithmDesc') }}:</span
            ><span>{{ algorithmData.description || '-' }}</span>
          </div>
          <!-- 算法类型 -->
          <div class="form-item">
            <span class="form-label"
              >{{ $t('assessment.algorithmType') }}:</span
            >
            <span v-if="algorithmData.type == 4">{{
              $t('assessment.aggregationAlgorithm')
            }}</span>
            <span v-if="algorithmData.type == 3">{{
              $t('assessment.modelMatchAlgorithm')
            }}</span>
            <span v-if="algorithmData.type == 2">{{
              $t('assessment.formatAlgorithm')
            }}</span>
            <span v-if="algorithmData.type == 1">{{
              $t('assessment.ScoringAlgorithm')
            }}</span>
          </div>
          <div class="form-item">
            <span class="form-label"
              >{{ $t('assessment.scriptLanguage') }}:</span
            ><span>{{ algorithmData.algorithm_language || 'python' }}</span>
          </div>
          <div class="form-item">
            <div class="form-label">{{ $t('assessment.scriptCode') }}:</div>
            <div class="code">
              <script-code :code.sync="algorithmData.code" />

              <!-- <pre>{{ algorithmData[requireIndexName()].code || '-' }}</pre> -->
            </div>
          </div>
          <div class="form-item">
            <div class="form-label" style="width: 110px">
              {{ $t('assessment.configParams') }}:
            </div>
            <div class="params-table">
              <cb-search-table
                :cols="cols"
                :data-source="algorithmData.params || []"
                :hidePaginOnDemand="true"
                :searchBarBg="false"
              >
                <template v-slot:desc="scope">
                  <span :title="scope.data.desc || '-'">{{
                    scope.data.desc || '-'
                  }}</span>
                </template>
                <template v-slot:param_type="scope">
                  <span v-if="scope.data.param_type == 0">Number</span>
                  <span v-if="scope.data.param_type == 1">String</span>
                  <span v-if="scope.data.param_type == 2">Bool</span>
                  <span v-if="scope.data.param_type == 3">IP</span>
                </template>
              </cb-search-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <cb-button-group>
        <cb-button
          button-type="confirm"
          :loading="loading"
          @click="dialogConfirm"
        ></cb-button>
        <cb-button button-type="cancel" @click="dialogCancel"></cb-button>
      </cb-button-group>
    </div>
  </cb-dialog>
</template>

<script>
import ScriptCode from './script-code';
import { editAlgorithm } from '@/api/web/range-test';
export default {
  components: {
    ScriptCode,
  },
  props: {
    algorithmData: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      visibleVal: false,
      loading: false,
      cols: [
        {
          label: this.$t('assessment.paramsName'),
          prop: 'param_name',
        },
        {
          label: this.$t('assessment.paramsDesc'),
          slot: 'desc',
        },
        {
          label: this.$t('assessment.type'),
          slot: 'param_type',
        },
        {
          label: this.$t('assessment.value'),
          prop: 'default_value',
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    dialogConfirm() {
      this.loading = true;
      const data = {
        resource_id: this.algorithmData.eval_algorithm_id,
        mode: 0,
        code: this.algorithmData.code,
      };
      editAlgorithm(data).then((res) => {
        this.loading = false;
        this.visibleVal = false;
      });
    },
    dialogCancel() {
      this.visibleVal = false;
    },
    handleClose() {
      this.visibleVal = false;
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.detail-form {
  font-size: 14px;

  .form-item {
    display: flex;
    margin: 10px 0px;
    .form-label {
      margin-right: 10px;
      display: inline-block;
      width: 110px;
      text-align: right;
    }
    .code {
      flex: 1;
      // background: var(--mask-color);
      // color: var(--neutral8);
      // pre {
      //   padding: 8px;
      // }
    }
  }
}
.params-table {
  width: 100%;
}
.params-table {
  width: 792px;
}
</style>
