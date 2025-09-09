<template>
  <!-- 新增动效阶段,编辑动效阶段弹框-->
  <cb-dialog
    :title="dialogTitle"
    :visible.sync="thisVisible"
    @close="close"
    width="480px"
  >
    <div class="simple-fish-bone--edit-node">
      <cb-form
        ref="form"
        :rules="rules"
        :model.sync="model"
        label-width="100px"
      >
        <cb-form-item :label="$t('dynamicControl.stageName')" prop="title">
          <cb-input
            v-model="model.title"
            :placeholder="$t('dynamicControl.enterStageName')"
          />
        </cb-form-item>
      </cb-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <cb-button button-type="confirm" @click="submit" mr />
      <cb-button button-type="cancel" @click="close" />
    </div>
  </cb-dialog>
</template>

<script>
import _ from 'lodash';
import { validateStageTitle } from '@/utils/team-control.js';
export default {
  props: ['visible'],
  data() {
    return {
      thisVisible: this.visible,
      model: {
        title: '',
      },
      dialogTitle: '',
      rules: {
        title: [
          {
            required: true,
            message: this.$t('dynamicControl.enterDynamicStageName'),
            trigger: 'blur',
          },
          { validator: validateStageTitle, trigger: 'blur' },
          { validator: this.validateTitleRepeat, trigger: 'blur' },
        ],
      },
    };
  },
  watch: {
    model(v) {
      if (v.title) {
        this.dialogTitle = this.$t('dynamicControl.editDynamicStage');
      } else {
        this.dialogTitle = this.$t('dynamicControl.addDynamicStage');
      }
    },
    visible(v) {
      this.thisVisible = v;
      const { nodeIndex = -1 } = this.$parent.selected;
      this.model = _.get(this.$parent.nodes, nodeIndex) || {};
    },
  },
  methods: {
    close() {
      this.$refs.form.resetFields();
      this.$emit('update:visible', false);
      if (!this.model.title) {
        const { nodeIndex = -1 } = this.$parent.selected;
        if (nodeIndex > -1) this.$parent.remove(nodeIndex);
      }
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$parent.updateData();
          this.$emit('update:visible', false);
        }
      });
    },
    // 判断阶段明是否重复
    validateTitleRepeat(rule, value, callback) {
      const { nodeIndex = -1 } = this.$parent.selected;
      const titles = _.map(this.$parent.nodes, 'title');
      titles.splice(nodeIndex, 1);
      if (titles.indexOf(value) > -1) {
        callback(new Error(this.$t('dynamicControl.noRepeat')));
      } else {
        callback();
      }
    },
  },
};
</script>
