<template>
  <cb-form-item v-if="image_type == 'vm'" :label="'Cloud-init ：'" class="one-line">{{ init_support ? $tt('menu.drawer.open') : $tt('menu.drawer.close') }}</cb-form-item>
</template>

<script>
import t from '../../../../../utils/i18n';
export default {
  name: "cloud-init",
  props: {
    init_support: {
      type: Boolean,
      default: false,
    },
    /**
     * 镜像信息
     */
    image_type: {
      type: String,
      default: '',
    },
  },
  setup() {
    return {
      $tt: t,
    }
  }
}
</script>
