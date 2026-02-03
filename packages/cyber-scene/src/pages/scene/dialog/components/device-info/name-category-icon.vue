<template>
  <div class="basic-info-wrapper">
    <cb-form-item :label="$tt('target.nodeName') + ' ：'" class="one-line" prop="name"
                  :rules="FORM_RULES.basicInfo.name">
      <cb-input size="small" v-model="nameForm" type="text"></cb-input>
    </cb-form-item>
    <cb-form-item :label="$tt('target.deviceType') + ' ：'" class="one-line">{{
        CATEGORY[category] | formatText
      }}
    </cb-form-item>
    <cb-form-item prop="icon" :label="$tt('target.nodeIcon') + ' ：'" class="one-line">
      <cb-upload-file
        accept=".jpg,.png,.jpeg,.svg"
        :fetchPromise="fetchPromise"
        :showFileList="false"
        :limit="1"
      >
        <template v-slot:tip>{{ $tt('target.uploadTip') }}</template>
      </cb-upload-file>
      <div class="image-container">
        <img :src="iconForm" alt=""/>
      </div>
    </cb-form-item>
    <cb-form-item
      prop="icon"
      :label="$tt('target.nodeIcon3') + ' ：'"
      :class="{'disBlock': true, 'en': lang === 'en-US'}"
    >
      <default-image3
        :icon3.sync="icon3Form"
        @changeImage="changeImage3Handler"
      ></default-image3>
    </cb-form-item>
  </div>
</template>

<script>
import _ from 'lodash';
import t from '../../../../../utils/i18n';
import {ref, computed, watch} from '@vue/composition-api';
import {uploadIcon} from "../../../../../api";
import {CATEGORY} from "../constant/device-info"
import {FORM_RULES} from "../constant/form-rules";
import PageStatus from "../../../../store/page-status";
import defaultImage3 from "./default-image3";

export default {
  name: "index",
  components: {
    defaultImage3
  },
  props: {
    /**
     * 节点名称
     */
    Name: {
      type: String,
      default: '',
    },
    /**
     * 设备类型
     */
    category: {
      type: Number,
      default: null,
    },
    /**
     * 节点图标
     */
    Icon2: {
      type: String,
      default: '',
    },
    /**
     * 节点图标
     */
    Icon3: {
      type: String,
      default: '',
    },
    lang: {
      type: String,
      default: 'zh-CN',
    },
    nodeInfo: {
      type: Object,
      default: () => {
      },
    },
  },
  setup(props, {emit}) {
    // 获取默认图片
    let default_icon = ref(PageStatus.state.defaultIcon);
    // 回显名称
    const nameForm = computed({
      get: () => {
        if (props.Name) {
          return props.Name;
        }
      },
      set: (val) => {
        emit('update:name', val);
        return val;
      }
    });
    // 回显图片
    const iconForm = computed({
      get: () => {
        return props.Icon2;
      },
      set: (val) => {
        emit('update:icon2', val);
        return val;
      }
    });
    // 回显图片
    const icon3Form = computed({
      get: () => {
        return props.Icon3;
      },
      set: (val) => {
        emit('update:icon3', val);
        return val;
      }
    });
    const changeImage3Handler = (val) => {
      emit('update:icon3', val);
    }

    // 上传附件
    const fetchPromise = (file) => {
      const formData = new FormData();
      formData.append('file', file);
      uploadIcon(formData)
        .then((res) => {
          iconForm.value = _.get(res, 'data.data.http_url', '')
        })
    }
    return {
      $tt: t,
      FORM_RULES,
      CATEGORY,
      nameForm,
      iconForm,
      fetchPromise,
      icon3Form,
      changeImage3Handler,
    }
  },
  filters: {
    formatText(param) {
      if (param === null || param === undefined || param === '') {
        return '--';
      } else {
        return param;
      }
    },
  },
}
</script>
