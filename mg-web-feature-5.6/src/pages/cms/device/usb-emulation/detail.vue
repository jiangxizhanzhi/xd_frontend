<template>
  <cb-inner-page
    :background="false"
    v-loading="loading"
    element-loading-custom-class="custom-loading"
  >
    <div class="image-detail-content">
      <cb-form
        ref="usbFromRef"
        :model="model"
        :rules="rules"
        label-width="120px"
        :url="url"
        baseURL="/api/mp"
        :id="id"
        json
        :isBgColor="true"
      >
        <cb-form-item :label="$t('device.name')" prop="name">
          <cb-input v-model="model.name" />
          <div class="hint">
            {{ $t('device.usbNameChangeHint') }}
          </div>
        </cb-form-item>
        <cb-form-item :label="$t('device.description')" prop="description">
          <cb-input v-model="model.description" type="textarea" />
        </cb-form-item>
        <cb-form-item :label="$t('device.type')" prop="type">
          <cb-select
            class="form-item-width form-item-width-mr8"
            v-model="model.virtual_usb_type"
            :options="VIRTUAL_USB_TYPE_OPTION"
            clearable
          >
          </cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('device.capacity')" prop="capacity">
          <cb-input-number
            v-model="model.capacity"
            :min="1"
            :max="8"
            controls-position="right"
            :step-strictly="true"
            size="small"
            :disabled="model.virtual_usb_status === 'succ'"
          ></cb-input-number>
          <template><span class="capacity-unit">G</span></template>
        </cb-form-item>
        <div slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button
              :disabled="loading"
              buttonType="confirm"
              @click="submitForm"
              mr
            >
              {{ $t('common.submit') }}
            </cb-button>
            <cb-button buttonType="cancel" @click="goBack">
              {{ $t('common.cancel') }}
            </cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </div>
  </cb-inner-page>
</template>

<script>
import {
  validateTitleLength255,
  validateDescription255,
} from '@/utils/rules-cms';
import {
  getVirtualUsbDetail,
  updateVirtualUsb,
} from '../../../../api/device/usb';
export default {
  name: 'ImageDetail',
  components: {},
  props: {
    id: {
      type: [Number, String],
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      url: '/devops/cluster/virtual_usb/find_by_uuid/',
      model: {
        name: '',
        description: '',
        virtual_usb_type: 'storage',
        capacity: 1,
      },
      VIRTUAL_USB_TYPE_OPTION: [
        {
          label: this.$t('device.Storage'),
          value: 'storage',
        },
      ],
      rules: {
        name: [
          {
            required: true,
            message: this.$t('device.nameInput'),
            trigger: 'blur',
          },
          { validator: validateTitleLength255, trigger: 'blur' },
        ],
        description: [
          {
            required: true,
            message: this.$t('device.descInput'),
            trigger: 'blur',
          },
          { validator: validateDescription255, trigger: 'blur' },
        ],
        logo: [
          {
            required: true,
            message: this.$t('device.needLogo'),
            trigger: ['blur', 'change'],
          },
        ],
        categories: [
          {
            required: true,
            message: this.$t('device.pleaseInputCategorys'),
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  computed: {},
  created() {},
  mounted() {
    if (this.id) {
      getVirtualUsbDetail({ uuid: this.id }).then((res) => {
        this.model = res.data?.data;
      });
    } else {
      this.url = '/devops/cluster/virtual_usb/add/';
    }
  },
  methods: {
    submitForm() {
      if (this.id) {
        this.$refs.usbFromRef.validate((valid) => {
          if (!valid) {
            return false;
          } else {
            updateVirtualUsb(this.model).then((res) => {
              this.goBack();
            });
          }
        });
      } else {
        this.$refs.usbFromRef.submit(this.model).then((res) => {
          this.goBack();
        });
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.capacity-unit {
  color: var(--neutral8);
}
.hint {
  color: var(--red-color);
  font-size: 14px;
}
</style>
