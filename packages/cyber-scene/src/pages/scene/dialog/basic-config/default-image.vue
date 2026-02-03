<!--
* 自定义上传图标
-->
<template>
  <div class="default-image">
<!--    <cb-upload-file-->
<!--      accept=".jpg,.png,.jpeg,.gif,.svg"-->
<!--      :fetch-promise="fetchPromise"-->
<!--      :showFileList="false"-->
<!--      :limit="0"-->
<!--      :fileSize='10485760'-->
<!--    >-->
<!--      <template v-slot:tip>{{ $tt('menu.dialog.uploadTip') }}</template>-->
<!--    </cb-upload-file>-->
    <div class="imag-container">
    <div
      :class="{ 'icon-box cursor': true, active: active == item.key }"
      v-for="(item, index) in list"
      :key="index"
      @click="changeBackground(item.key)"
    >
      <cb-image :src="item.value" fit="contain" />
    </div>
    </div>
  </div>
</template>

<script>
import background_dark from '../../../../assets/images/dark/background.png';
import background2_dark from '../../../../assets/images/dark/background2.png';
import background3_dark from '../../../../assets/images/dark/background3.png';
import background_light from '../../../../assets/images/light/background.png';
import background2_light from '../../../../assets/images/light/background2.png';
import background3_light from '../../../../assets/images/light/background3.png';
import _ from 'lodash';
import t from '../../../../utils/i18n'
import PageStatus from "../../../store/page-status";

export default {
  name: 'DefaultImage',
  props: {
    backgroundList: {
      type: Array,
      default: () => [],
    },
    active: {
      type: String,
      default: 'background',
    },
  },
  model: {
    prop: 'backgroundList',
    event: 'update',
  },
  computed: {
    list:{
      get: () =>{
        if (PageStatus.state.theme === 'dark') {
          return [
            { key: 'background', value: background_dark },
            { key: 'background2', value: background2_dark },
            { key: 'background3', value: background3_dark },
          ]
        } else {
          return [
            { key: 'background', value: background_light },
            { key: 'background2', value: background2_light },
            { key: 'background3', value: background3_light },
          ]
        }
      }
    }
  },
  mounted() {
    this.backgroundList.forEach((item) => {
      if (!_.isEmpty(item.value)) {
        this.list.push(item);
      }
    });
  },
  watch: {},
  methods: {
    $tt: t,
    /**
     * 自定义上传
     */
    fetchPromise(file) {
      const formData = new FormData();
      formData.append('file', file);
      this.$request
        .post(`/base/file/upload`, formData, { baseURL: '/api/mp' })
        .then((res) => {
          const image = _.get(res, 'data.data.http_url', '');
          this.list.push({ key: image, value: image });
          const _list = _.cloneDeep(this.list).map((item) => {
            if (
              ['background', 'background2', 'background3'].includes(item.key)
            ) {
              item.value = '';
            }
            return item;
          });
          this.$emit('update:backgroundList', _list);
        });
    },
    changeBackground(key) {
      this.$emit('changeImage', key);
    },
  },
};
</script>

<style lang="scss" scoped>
.default-image {
  .icon-box {
    display: inline-block;
    margin-right: 7px;
    width: 120px;
    height: 68px;
    overflow: hidden;
    &.active {
      border: 1px solid var(--primary-color);
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .imag-container {
    //margin-top: 10px;
  }
}
</style>
