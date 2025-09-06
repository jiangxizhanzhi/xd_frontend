<template>
  <cb-dialog :title="$t('device.saveSnapshot')" :visible.sync="visible">
    <cb-form
      ref="formRef"
      :model.sync="model"
      :rules="image_type === 'container' ? containerRules : vmRules"
      label-width="100px"
      :fetchPromise="fetchForm"
    >
      <cb-form-item :label="$t('device.name')" prop="snapshot_name">
        <cb-input v-model="model.snapshot_name" autocomplete="off" />
      </cb-form-item>
      <cb-form-item :label="$t('device.description')" prop="description">
        <cb-input
          v-model="model.description"
          type="textarea"
          autocomplete="off"
        />
      </cb-form-item>
    </cb-form>
    <div slot="footer" class="dialog-footer">
      <cb-button button-type="confirm" @click="submitForm" mr>
        {{ $t('common.confirm') }}
      </cb-button>
      <cb-button button-type="cancel" @click="visible = false">
        {{ $t('common.cancel') }}
      </cb-button>
    </div>
  </cb-dialog>
</template>

<script>
import {
  getSnapshot,
  getAllSnapshot,
  saveSnapshot,
} from '@/api/scene/scene.js';
import { validateTitleLength219, validateDescription } from '@/utils/rules-cms';

export default {
  name: 'SnapshotFormModal',
  props: {
    sceneId: {
      type: String,
      default: '',
    },
    nodeId: {
      type: String,
      default: '',
    },
    image_type: {
      type: String,
      default: '',
    },
    image_uuid: {
      type: String,
      default: '',
    },
    saveSnapshotBtn: {
      type: Boolean,
      default: false,
    },
    // device: {
    //   type: Object,
    //   default: {},
    // },
  },
  data() {
    const validateName = (rule, value, callback) => {
      // // 仅可由英文小写字母、数字组成.
      // const valid = /^[a-z0-9]*$/g;
      // 仅可由英文字母、数字、特殊字符点、短横以及下划线组成, 不能以特殊字符开始或结束
      const valid = /^[a-z0-9]+(?:(?:(?:[._]|__|[-]*)[a-z0-9]+)+)?$/;
      if (valid.test(value)) {
        callback();
      } else {
        callback(new Error(this.$t('device.containNameRule')));
      }
    };
    const validateNameRepeat = (rule, value, callback) => {
      // 校验名称不能与已有的快照名称相同
      if (this.historySnapshots.includes(value)) {
        callback(new Error(this.$t('device.nameRepeat')));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      model: {
        snapshot_name: '',
        description: '',
      },
      historySnapshots: [], //所有历史快照名称信息
      validateName: {
        validator: validateName,
        trigger: 'blur',
        container: true,
      },
      containerRules: {
        snapshot_name: [
          {
            required: true,
            message: this.$t('device.nameInput'),
            trigger: 'blur',
          },
          { validator: validateTitleLength219, trigger: 'blur' },
          { validator: validateNameRepeat, trigger: 'blur' },
        ],
        description: [{ validator: validateDescription, trigger: 'blur' }],
      },
      vmRules: {
        snapshot_name: [
          {
            required: true,
            message: this.$t('device.nameInput'),
            trigger: 'blur',
          },
          { validator: validateTitleLength219, trigger: 'blur' },
          { validator: validateNameRepeat, trigger: 'blur' },
        ],
        description: [{ validator: validateDescription, trigger: 'blur' }],
      },
    };
  },
  mounted() {
    this.show();
    this.getHistorySnapshots();
  },
  watch: {
    visible: {
      handler(nv) {
        this.$emit('update:saveSnapshotBtn', nv);
      },
    },
  },
  methods: {
    //获取所有历史快照信息
    getHistorySnapshots() {
      getAllSnapshot({
        name: this.image_uuid,
      }).then((res) => {
        const tempdata = _.get(res, 'data.data', []);
        this.historySnapshots = tempdata.items.map((item) => {
          return item.user_snapshot_name;
        });
      });
    },

    show() {
      this.model.snapshot_name = '';
      this.model.description = '';
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.formRef.resetFields();
      });
    },

    fetchForm() {
      // 保存
      const model = _.cloneDeep(this.model);
      const params = {
        snapshot_name: model.snapshot_name,
        description: model.description,
        node_id: this.nodeId,
        scene_id: this.sceneId,
      };
      this.visible = false;
      this.model.snapshot_name = '';
      this.model.description = '';
      return saveSnapshot(params).then((res) => {});
    },
    submitForm() {
      let nameValidateList = this.containerRules.snapshot_name;
      if (this.image_type === 'container') {
        nameValidateList[1] = this.validateName;
      }
      this.$refs.formRef.submit();
    },
  },
};
</script>
