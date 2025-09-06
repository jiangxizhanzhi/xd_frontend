<template>
  <cb-dialog :title="dialogTitle" :visible.sync="thisVisible" @close="close">
    <div class="simple-fish-bone--edit-node">
      <cb-form
        ref="form"
        :rules="rules"
        :model.sync="model"
        label-width="120px"
      >
        <cb-form-item :label="$t('combatTech.stage')" prop="title">
          <cb-input v-model="model.title" />
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
import { validateStageTitle } from '@/utils/rules-cms';
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
            message: this.$t('combatTech.pleaseInputStageName'),
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
        this.dialogTitle = this.$t('fishBone.changeStage');
      } else {
        this.dialogTitle = this.$t('fishBone.addStage');
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
    validateTitleRepeat(rule, value, callback) {
      const { nodeIndex = -1 } = this.$parent.selected;
      const titles = _.map(this.$parent.nodes, 'title');
      titles.splice(nodeIndex, 1);
      if (titles.indexOf(value) > -1) {
        callback(new Error(this.$t('combatTech.stageNameUnrepeatable')));
      } else {
        callback();
      }
    },
  },
};
</script>
