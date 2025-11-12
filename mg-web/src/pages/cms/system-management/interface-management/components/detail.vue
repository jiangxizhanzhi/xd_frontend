<template>
  <cb-inner-page
    :background="true"
    title="接口管理"
  >
    <div>
      <cb-form
        ref="formRef"
        label-position="right"
        label-width="120px"
        :model.sync="model"
        :rules="rules"
        :isBgColor="true"
      >
        <cb-form-item
          :label="$t('授权IP/域名')"
          prop="ip"
        >
          <cb-input
            v-model="model.ip"
            :placeholder="$t('请输入授权IP/域名')"
          />
        </cb-form-item>
        <cb-form-item
          :label="$t('授权接口')"
          prop="path"
        >
          <cb-input
            v-model="model.path"
            :placeholder="$t('请输入授权接口')"
          />
        </cb-form-item>
        <cb-form-item
          :label="$t('备注')"
          prop="desc"
        >
          <cb-input
            v-model="model.desc"
            :placeholder="$t('请输入备注')"
          />
        </cb-form-item>
        <div slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button
              buttonType="confirm"
              @click="confirm"
              mr
            ></cb-button>
            <cb-button
              buttonType="cancel"
              @click="cancel"
            ></cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </div>
  </cb-inner-page>
</template>

<script>
import {addInterfaceApi, editInterfaceApi, getInterfaceApiDetail} from "../../../../../api/interface-management";
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  components: {},
  data() {
    return {
      model: {
        ip: "",
        path: "",
        desc: "",
      },
      rules: {
        ip: [
          {
            required: true,
            message: this.$t('请输入授权IP/域名'),
            trigger: 'blur',
          },
        ],
        path: [
          {
            required: true,
            message: this.$t('请输入授权接口'),
            trigger: 'blur',
          },
        ],
        desc: [
          {
            required: true,
            message: this.$t('请输入备注'),
            trigger: 'blur',
          },
        ],
      },
      // 接入配置表格
      selector: {
        maxSelect: 0,
      },
      selection: [],
    };
  },
  computed: {
  },
  created() {
  },
  mounted() {
    if (this.id) {
      this.getBackData();
    }
  },
  methods: {
    getBackData() {
      getInterfaceApiDetail(this.id).then(res => {
        const data = _.get(res, 'data.data', {});
        this.model = {
          ...data,
        }
      })
    },
    confirm() {
      const params = {
        ...this.model,
      }
      this.$refs.formRef.validate(valid => {
        if (valid) {
          if (this.id) {
            // 编辑
            params.id = this.id;
            editInterfaceApi(params).then(res => {
              this.$router.push({
                name: 'interface-management'
              })
            })
          } else {
            // 新增
            addInterfaceApi(params).then(res => {
              this.$router.push({
                name: 'interface-management'
              })
            })
          }
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.push({
        name: 'interface-management'
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.params-item {
  margin-right: 16px;
}
</style>
