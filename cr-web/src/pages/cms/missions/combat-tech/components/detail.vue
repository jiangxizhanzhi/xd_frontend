<template>
  <cb-inner-page :background="false">
    <cb-form
      ref="techfromRef"
      :model.sync="model"
      :rules="rules"
      :url="url"
      :baseURL="baseURL"
      :id="id && { resource_id: id }"
      label-width="60px"
      class="demo-model"
      :method="method"
      json
      :isBgColor="true"
    >
      <cb-form-item :label="$t('combatTech.name')" prop="title">
        <cb-input
          v-model="model.title"
          style="width: 100%"
          @blur="removeBlanktitle"
        />
      </cb-form-item>

      <cb-form-item :label="$t('combatTech.description')" prop="description">
        <cb-input
          v-model="model.description"
          type="textarea"
          style="width: 100%"
          @blur="removeBlank"
        />
      </cb-form-item>
      <cb-form-item :label="$t('combatTech.stage')">
        <div class="fishbone-container">
          <simple-fish-bone
            v-model="combatData"
            ref="fishbone"
            :layout.sync="model.template"
            :theme.sync="model.color"
          />
        </div>
      </cb-form-item>

      <div slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button button-type="confirm" @click="submitReady">
            {{ $t('common.submit') }}
          </cb-button>
          <cb-button button-type="cancel" @click="goBack">
            {{ $t('common.cancel') }}
          </cb-button>
        </cb-button-group>
      </div>
    </cb-form>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import SimpleFishBone from '@/components/SimpleFishBone';
import LayoutSelector from '@/components/SimpleFishBone/LayoutSelector';
import CommonUtils from '@/utils/utils.js';
import { validateStageName } from '@/utils/rules-cms';

export default {
  name: 'CombatDetail',
  components: {
    SimpleFishBone,
    LayoutSelector,
  },
  props: {
    id: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      method: 'post',
      // url: '/admin/mission/combat_techs/',
      //任务方案新增,编辑
      url: '/cr/admin/mission/combat_techs',
      baseURL: '/api/ojj',
      model: {
        title: '',
        description: '',
        // config: null,
        combat_config: [],
        template: 1,
        color: 1,
      },
      combatData: [],
      rules: {
        title: [
          {
            required: true,
            message: this.$t('combatTech.pleaseInputName'),
            trigger: 'blur',
          },
          // 校验任务名称长度1-255
          { validator: validateStageName, trigger: 'blur' },
        ],
        description: [
          {
            required: true,
            message: this.$t('combatTech.pleaseInputDescription'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  mounted() {
    if (this.id) {
      this.method = 'put';
    } else {
      this.method = 'post';
    }
    if (this.id) {
      this.$refs.techfromRef.getModelData().then((res) => {
        if (!_.isEmpty(res)) {
          this.model = res;
          this.model.template = this.model.template || 1;
          this.model.color = this.model.color || 1;
          this.combatData = res.combat_config || [];
          this.$nextTick(() => {
            this.$refs.fishbone.init();
          });
        }
      });
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'mission-arrange-management' });
    },
    submitReady() {
      this.$refs.techfromRef.validate((valid) => {
        if (valid) {
          if (this.combatData.length < 1) {
            return this.$message.error(
              this.$t('combatTech.emptyTemplatesCannotBeSubmitted'),
            );
          }
          if (_.find(this.combatData, ['stage', ''])) {
            return this.$message.error(
              this.$t('combatTech.pleaseInputStageName'),
            );
          }
          // if (_.uniqBy(this.combatData, 'stage').length < this.combatData.length) {
          //   return this.$message.error(
          //     this.$t('combatTech.stageNameUnrepeatable'),
          //   )
          // }
          for (let stage of this.combatData) {
            stage.templates = stage.templates || [];
            if (stage.templates.length < 1) {
              // return this.$message.error(`阶段 ${stage.stage} 内任务不可为空`);
              return this.$message.error(
                CommonUtils.formatString(
                  this.$t('combatTech.stageTaskIsEmpty'),
                  stage.stage,
                ),
              );
            }
            if (_.find(stage.templates, ['title', ''])) {
              return this.$message.error(
                this.$t('combatTech.pleaseInputTemplateName'),
              );
            }
            // if (_.uniqBy(stage.templates, 'title').length < stage.templates.length) {
            //   return this.$message.error(
            //     this.$t('combatTech.targetNameUnrepeatable'),
            //   )
            // }
          }
          // this.model.combat_config = JSON.stringify(this.combatData);
          this.model.combat_config = this.combatData;
          this.model.template = this.model.template || 1;
          this.model.color = this.model.color || 1;
          this.submitForm();
        }
      });
    },
    submitForm() {
      this.$refs.techfromRef.submit().then(() => {
        this.goBack();
      });
    },
    removeBlank() {
      this.model.description = this.model.description.trim();
    },
    removeBlanktitle() {
      this.model.title = this.model.title.trim();
    },
  },
};
</script>

<style lang="scss" scoped>
.form-button-bar {
  margin: 25px 0 50px 0;
}
</style>
