<template>
  <cb-inner-page :background="false">
    <cb-form
      ref="formRef"
      :url="url"
      :baseURL="baseURL"
      :rules="rules"
      :model="model"
      :id="id"
      :label-width="labelWidthForm"
      json
    >
      <cb-form-item
        prop="resource_id"
        :label="$t('careerSystem.abilityNumber')"
      >
        <cb-input
          :disabled="id ? true : false"
          v-model="model.resource_id"
          :placeholder="$t('careerSystem.inputAbilityNumber')"
        ></cb-input>
      </cb-form-item>
      <cb-form-item prop="content" :label="$t('mess.content')">
        <cb-input
          v-model="model.content"
          :placeholder="$t('careerSystem.inputAbilityContent')"
        ></cb-input>
      </cb-form-item>
      <div class="form-button-bar">
        <cb-button-group space="middle">
          <cb-button
            v-if="id"
            class="mr"
            @click="putApply"
            button-type="confirm"
          ></cb-button>
          <cb-button
            v-else
            class="mr"
            @click="apply"
            button-type="confirm"
          ></cb-button>
          <cb-button
            link-name="ability-database-list"
            button-type="cancel"
          ></cb-button>
        </cb-button-group>
      </div>
    </cb-form>
  </cb-inner-page>
</template>
<script>
import { getAbility, putAbility } from '@/api/career-skill';
export default {
  props: {
    id: {
      type: String,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      baseURL: '/api/ojj',
      url: '/rtks/ability/',
      model: {
        content: '',
        resource_id: '',
      },
      rules: {
        content: [
          {
            required: true,
            message: this.$t('careerSystem.inputAbilityContent'),
            trigger: 'blur',
          },
        ],
        resource_id: [
          {
            required: true,
            message: this.$t('careerSystem.inputAbilityNumber'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    labelWidth() {
      return this.$store.state.app.labelWidth;
    },
    labelWidthForm() {
      return `${this.labelWidth}px`;
    },
  },
  mounted() {
    const that = this;
    if (that.id) {
      getAbility(that.id).then((res) => {
        const data = res.data.data;
        this.model.content = data.content;
        this.model.resource_id = data.resource_id;
      });
    }
  },
  methods: {
    putApply() {
      const that = this;
      that.model.resource_id = that.id;
      putAbility(that.model).then(() => {
        that.$router.push({
          name: 'ability-database-list',
        });
      });
    },
    apply() {
      const that = this;
      that.$refs.formRef.submit().then(() => {
        that.$router.push({
          name: 'ability-database-list',
        });
      });
    },
  },
};
</script>
