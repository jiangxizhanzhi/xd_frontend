<template>
  <div class="timing-wrapper">
    <cb-tooltip
      class="item"
      effect="dark"
      :content="$t('director.timing')"
      placement="left-start"
    >
      <div class="timing-box" @click="showDocument">
        <cb-iconfont type="icon-yijianshoushi" size="28" />
      </div>
    </cb-tooltip>
    <cb-dialog
      :title="$t('director.timing')"
      center
      :visible.sync="timingDialog"
      width="490px"
    >
      <template>
        <cb-form
          :label-width="getI18Nn().locale == 'en-US' ? '140px' : '80px'"
          label-position="right"
          :model.sync="model"
          :rules="rules"
          ref="formRef"
        >
          <cb-form-item
            :label="$t('director.astronomicalTime')"
            prop="astronomicalTime"
          >
            <cb-date-picker
              v-model="model.astronomicalTime"
              type="datetime"
              default-time="12:00:00"
              style="width: 100%"
            />
          </cb-form-item>
          <hr
            :style="{
              height: '1px',
              background: $themed('neutral0'),
              margin: '30px 0 30px 0',
            }"
          />
          <cb-form-item
            :label="$t('director.operationTime')"
            prop="operationTime"
          >
            <cb-date-picker
              v-model="model.operationTime"
              type="datetime"
              default-time="12:00:00"
              style="width: 100%"
            />
          </cb-form-item>
          <cb-form-item :label="$t('director.rate')">
            <cb-select
              v-model="model.rate"
              :options="rateOptions"
              style="width: 100%"
            >
            </cb-select>
          </cb-form-item>
        </cb-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <cb-button button-type="confirm" @click="submit" mr />
        <cb-button button-type="cancel" @click="cancel" />
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import { postTimeApi } from '@/api/common';
import { getI18N } from '@cyber/helper';
export default {
  components: {},
  props: {
    resourceId: {
      type: [String, Number],
      default: '',
    },
    astronomicalTime: {
      type: [String, Number, Date],
      default: '',
    },
    operationTime: {
      type: [String, Number, Date],
      default: '',
    },
    rateSubmitValue: {
      type: [String, Number],
      default: 1,
    },
  },
  data() {
    return {
      timingDialog: false,
      model: {
        astronomicalTime: '',
        operationTime: '',
        rate: '',
      },
      rateOptions: [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
        { label: 5, value: 5 },
      ],
      rules: {
        astronomicalTime: [
          {
            required: true,
            message: this.$t('director.plzInputAstronomicalTime'),
            trigger: ['blur', 'change'],
          },
        ],
        operationTime: [
          {
            required: true,
            message: this.$t('director.plzInputOperationTime'),
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  watch: {
    astronomicalTime: {
      handler(nv) {
        this.model.astronomicalTime = nv;
      },
      immediate: true,
      deep: true,
    },
    operationTime: {
      handler(nv) {
        this.model.operationTime = nv;
      },
      immediate: true,
      deep: true,
    },
    rateSubmitValue: {
      handler(nv) {
        this.model.rate = nv;
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  created() {
    this.room_id = this.$route.params && this.$route.params.resource_id;
  },
  mounted() {},
  methods: {
    getI18Nn() {
      return getI18N();
    },
    showDocument() {
      this.timingDialog = true;
    },
    submit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          postTimeApi({
            astronomical_time: moment(this.model.astronomicalTime).format(
              'YYYY-MM-DD HH:mm:ss',
            ),
            combat_time: moment(this.model.operationTime).format(
              'YYYY-MM-DD HH:mm:ss',
            ),
            rate: this.model.rate,
            room_id: this.room_id,
          }).then((res) => {});
          this.$emit('sure', this.model.astronomicalTime);
          this.$emit('sure2', this.model.operationTime, this.model.rate);
          this.timingDialog = false;
          this.$message({
            type: 'success',
            message: this.$t('m.SuccessfullyModified'),
          });
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.timingDialog = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.timing-wrapper {
  .timing-box {
    position: fixed;
    right: 16px;
    bottom: 210px;
    width: 40px;
    height: 40px;
    background: var(--bg-color-3);
    border-radius: 50%;
    box-shadow: 8px 8px 30px 0px var(--box-shadow-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      background: var(--primary-color-2);
    }
  }
}
</style>
