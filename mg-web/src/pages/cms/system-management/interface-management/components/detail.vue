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
          prop="name"
        >
          <cb-input
            v-model="model.name"
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
          prop="note"
        >
          <cb-input
            v-model="model.note"
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
import {
  PROTOCOLLIST,
} from '../constant';
import { addPlatformApi, editPlatformApi, getPlatformApiDetail } from '@/api/business-service-monitoring.js'
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
        name: "",
        path: "",
        node: "",
        params: {
          cpu: 0,
          disk: 0,
          memory: 0,
        },
        system_type: "",
        in_position: true,
        access_protocol_list: [],
      },
      rules: {
        name: [
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
        note: [
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
      getPlatformApiDetail(this.id).then(res => {
        const data = _.get(res, 'data.data', {});
        this.model = {
          ...data,
          params: JSON.parse(data.params),
          in_position: data.in_position ? true : false,
          access_protocol_list: data.access_protocol_list ? data.access_protocol_list : [],
        }
      })
    },
    confirm() {
      const params = {
        ...this.model,
        params: JSON.stringify(this.model.params),
        in_position: this.model.in_position ? 1 : 0
      }
      this.$refs.formRef.validate(valid => {
        if (valid) {
          if (this.id) {
            // 编辑
            params.id = this.id;
            editPlatformApi(params).then(res => {
              this.$router.push({
                name: 'interface-management'
              })
            })
          } else {
            // 新增
            addPlatformApi(params).then(res => {
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
