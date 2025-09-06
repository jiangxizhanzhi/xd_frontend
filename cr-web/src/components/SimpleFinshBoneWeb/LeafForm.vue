<template>
  <cb-dialog
    :title="$t('修改任务模板')"
    :visible.sync="thisVisible"
    @close="close"
  >
    <div class="simple-fish-bone--edit-leaf">
      <cb-form
        ref="form"
        :rules="rules"
        :model.sync="model"
        label-width="120px"
      >
        <cb-form-item :label="$t('任务名称')" prop="title">
          <cb-input v-model="model.title" />
        </cb-form-item>
        <cb-form-item :label="$t('任务描述')" prop="description">
          <cb-input v-model="model.description" type="textarea" />
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
import { validateTitleLength, validateDescriptionLength } from '@/utils/rules';
export default {
  props: ['visible'],
  data() {
    return {
      thisVisible: this.visible,
      model: {
        title: '',
        description: '',
      },
      rules: {
        title: [
          {
            required: true,
            message: this.$t('请输入任务名称'),
            trigger: 'blur',
          },
          { validator: validateTitleLength, trigger: 'blur' },
          { validator: this.validateTitleRepeat, trigger: 'blur' },
        ],
        description: [
          {
            required: true,
            message: this.$t('请输入任务描述'),
            trigger: 'blur',
          },
          { validator: validateDescriptionLength, trigger: 'blur' },
        ],
      },
    };
  },
  watch: {
    visible(v) {
      this.thisVisible = v;
      const { nodeIndex = -1, leafIndex = -1 } = this.$parent.selected;
      this.model =
        _.get(this.$parent.nodes, `${nodeIndex}.templates.${leafIndex}`) || {};
    },
  },
  methods: {
    close() {
      this.$refs.form.resetFields();
      this.$emit('update:visible', false);
      if (!this.model.title) {
        const { nodeIndex = -1, leafIndex = -1 } = this.$parent.selected;
        if (leafIndex > -1) this.$parent.remove(nodeIndex, leafIndex);
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
      const { nodeIndex = -1, leafIndex = -1 } = this.$parent.selected;
      const templates =
        _.get(this.$parent.nodes, `${nodeIndex}.templates`) || [];
      const titles = _.map(templates, 'title');
      titles.splice(leafIndex, 1);
      if (titles.indexOf(value) > -1) {
        callback(new Error(this.$t('combatTech.targetNameUnrepeatable')));
      } else {
        callback();
      }
    },
  },
};
</script>
