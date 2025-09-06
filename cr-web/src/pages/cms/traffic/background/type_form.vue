<template>
  <cb-inner-page :background="false">
    <div class="form-box">
      <cb-form
        ref="formRef"
        :model.sync="model"
        :rules="rules"
        label-width="120px"
        :isBgColor="true"
      >
        <cb-form-item :label="$t('traffic.name')" prop="name">
          <cb-input v-model="model.name"></cb-input>
        </cb-form-item>
        <div class="form-button-bar">
          <cb-button-group space="middle">
            <cb-button
              @click="addType"
              button-type="confirm"
              mr="mr"
            ></cb-button>
            <cb-button button-type="cancel" @click="back"></cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </div>
  </cb-inner-page>
</template>
<script>
import {
  addFlowCatagory,
  editFlowCatagory,
  getFlowCatagory,
} from '@/api/traffic/traffic';
export default {
  components: {},
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
      model: {
        name: '',
      },
      rules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('traffic.inputName'),
          },
        ],
      },
    };
  },
  computed: {},
  mounted() {
    if (this.id) {
      this.getData();
    }
  },
  methods: {
    //获取单独的分类信息
    getData() {
      const params = {
        id: this.id,
      };
      getFlowCatagory(params).then((res) => {
        const data = _.get(res, 'data.data', {}) || {};
        this.model = data;
      });
    },
    back() {
      this.$router.push({ name: 'static-traffic-type-list' });
    },
    addType() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          //编辑
          if (this.id) {
            const params = {
              id: this.id,
              name: this.model.name,
            };
            editFlowCatagory(params).then((res) => {
              this.$router.push({
                name: 'static-traffic-type-list',
              });
            });
          } else {
            //新增
            const params = {
              name: this.model.name,
            };
            addFlowCatagory(params).then((res) => {
              this.$router.push({
                name: 'static-traffic-type-list',
              });
            });
          }
        }
      });
    },
  },
};
</script>
<style scoped lang="scss"></style>
