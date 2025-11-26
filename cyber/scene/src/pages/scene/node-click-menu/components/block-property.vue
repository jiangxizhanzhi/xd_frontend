<template>
  <div class="block-property-wrapper">
    <div class="split-box">{{$tt('colorful.blockBasic')}}</div>
    <div class="item">
      <span class="label" :title="$tt('colorful.blockColor')">{{$tt('colorful.blockColor')}}：</span>
      <cb-popover placement="bottom-start" trigger="click">
        <div><Sketch v-model="color.body.fill" @input="hidePopover('body', 'fill')"></Sketch></div>
        <div slot="reference" class="color-preview-box">
          <div class="color-box" :style="'background: ' + colorRGBABodyFill"></div>
        </div>
      </cb-popover>
    </div>
    <div class="item">
      <span class="label" :title="$tt('colorful.blockPic')">{{$tt('colorful.blockPic')}}：</span>
      <cb-upload-file
        :value="fillPic"
        accept=".jpg,.png,.jpeg,.gif,.svg"
        :fetchPromise="fetchPromise"
        :showFileList="true"
        :limit="1"
        class="upload-wrapper"
        @delete="handleDeleteFillPic"
        @input="handleImport"
      >
      </cb-upload-file>
    </div>
    <div class="item">
      <span class="label">{{$tt('colorful.textTransform')}}：</span>
      <cb-input-number
        v-model="transformRotate"
        controls-position="right"
        :step-strictly="true"
        size="small"
        @change="changeRotate"
      ></cb-input-number>{{$tt('colorful.degree')}}
    </div>
    <div class="item">
      <span class="label">{{$tt('colorful.zIndex')}}：</span>
      <cb-input-number
        v-model="layerZIndex"
        controls-position="right"
        :step-strictly="true"
        size="small"
        @change="changeLayerZIndex"
      ></cb-input-number>
    </div>
    <div class="split-box">{{$tt('colorful.blockBorderConfig')}}</div>
    <div class="item">
      <span class="label" :title="$tt('colorful.blockColor')">{{$tt('colorful.blockColor')}}：</span>
      <cb-popover placement="bottom-start" trigger="click">
        <div><Sketch v-model="color.body.stroke" @input="hidePopover('body', 'stroke')"></Sketch></div>
        <div slot="reference" class="color-preview-box">
          <div class="color-box" :style="'background: ' + colorRGBABodyStroke"></div>
        </div>
      </cb-popover>
    </div>
    <div class="item" >
      <span class="label">{{$tt('colorful.borderWidth')}}：</span>
      <cb-input-number
        v-model="strokeWidth"
        :min="0"
        controls-position="right"
        :step-strictly="true"
        size="small"
        @change="changeStrokeWidth"
      ></cb-input-number>px
    </div>
    <div class="item">
      <span class="label">{{$tt('colorful.labelBorderRadius')}}：</span>
      <cb-input-number
        v-model="borderRadius"
        :min="0"
        controls-position="right"
        :step-strictly="true"
        size="small"
        @change="changeBorderRadius"
      ></cb-input-number>px
    </div>
    <div class="item">
      <span class="label">{{$tt('colorful.borderType')}}：</span>
      <cb-radio-group v-model="strokeDasharray" @change="changeStrokeDasharray">
        <cb-radio :label="0">{{$tt('colorful.solid')}}</cb-radio>
        <cb-radio :label="'10, 5'">{{$tt('colorful.dash')}}</cb-radio>
        <cb-radio :label="'5, 5, 1, 5'">{{$tt('colorful.dotted')}}</cb-radio>
      </cb-radio-group>
    </div>
    <div class="item">
      <span class="label">{{$tt('colorful.edgeAnimation')}}：</span>
      <cb-radio-group v-model="animation" @change="changeAnimation">
        <cb-radio label="normal">{{$tt('colorful.none')}}</cb-radio>
        <cb-radio label="flow" v-if="strokeDasharray">{{$tt('colorful.flow')}}</cb-radio>
      </cb-radio-group>
    </div>
    <div class="split-box">{{$tt('colorful.textConfig')}}</div>
    <div class="item">
      <span class="label">{{$tt('colorful.textColor')}}：</span>
      <cb-popover placement="bottom-start" trigger="click">
        <div><Sketch v-model="color.label.fill" @input="hidePopover('label', 'fill')"></Sketch></div>
        <div slot="reference" class="color-preview-box">
          <div class="color-box" :style="'background: ' + colorRGBALabelFill"></div>
        </div>
      </cb-popover>
    </div>
    <div class="item">
      <span class="label">{{$tt('colorful.textSize')}}：</span>
      <cb-input-number
        v-model="fontSize"
        :min="0"
        :max="100"
        controls-position="right"
        :step-strictly="true"
        size="small"
        @change="changeFontSize"
      ></cb-input-number>px
    </div>
    <div class="item">
      <span class="label">{{$tt('colorful.textFontWeight')}}：</span>
      <cb-radio-group v-model="fontWeight" @change="changeFontWeight">
        <cb-radio :label="200">{{$tt('colorful.textFont200')}}</cb-radio>
        <cb-radio :label="400">{{$tt('colorful.textFont400')}}</cb-radio>
        <cb-radio :label="700">{{$tt('colorful.textFont700')}}</cb-radio>
      </cb-radio-group>
    </div>
    <div class="item">
      <span class="label">{{$tt('colorful.textRef')}}X：</span>
      <cb-input-number
        v-model="fontRef.X"
        controls-position="right"
        :step-strictly="true"
        size="small"
        @change="changeFontRef($event,'X')"
      ></cb-input-number>px
    </div>
    <div class="item">
      <span class="label">{{$tt('colorful.textRef')}}Y：</span>
      <cb-input-number
        v-model="fontRef.Y"
        controls-position="right"
        :step-strictly="true"
        size="small"
        @change="changeFontRef($event,'Y')"
      ></cb-input-number>px
    </div>
    <div class="item">
      <span class="label">{{$tt('colorful.textTransform')}}：</span>
      <cb-input-number
        v-model="transformRotateText"
        controls-position="right"
        :step-strictly="true"
        size="small"
        @change="changeRotateText"
      ></cb-input-number>{{$tt('colorful.degree')}}
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import {Sketch} from 'vue-color';
import t from "../../../../utils/i18n";
import {computed, ref, watch} from "@vue/composition-api";
import {initialThemeColorToRGBA, transferRGBA} from "../../../../utils/common/colorful";
import {uploadIcon} from "../../../../api";
import {updateBlockClassName} from "../../painter/block";

export default {
  name: "block-property",
  components: {
    Sketch,
  },
  props: {
    nodeId: {
      type: String,
      default: '',
    },
    nodeCls: {},
    sceneEid: {
      type: String,
      default: '',
    },
  },
  setup(props, {emit}) {
    const $tt = t;
    // 填充图片
    let fillPic = ref([]);
    // 旋转角度
    let transformRotate = ref(0);
    // 层级
    let layerZIndex = ref();
    // 边框宽度
    let strokeWidth = ref(1);
    // 边框圆角
    let borderRadius = ref(0);
    // 虚线
    let strokeDasharray = ref(0);
    // 动效
    let animation = ref();
    // 字体大小
    let fontSize = ref(14);
    // 字体粗细
    let fontWeight = ref(400);
    // 文本旋转角度
    let transformRotateText = ref(0);
    // 文本偏移
    let fontRef = ref({ X: 0, Y: 0 });

    let color = ref({
      body: {
        fill: {
          rgba: {r: 255, g: 255, b: 255, a: 0.05}
        },
        stroke: {
          rgba: {r: 255, g: 255, b: 255, a: 0.05}
        },
      },
      label: {
        fill: {
          rgba: {r: 255, g: 255, b: 255, a: 1}
        }
      },
    })

    watch(() => props.nodeId, () => {
      if (!props.nodeId) return;
      props.nodeCls.data.fillPic ? !fillPic.value.length ? fillPic.value.push({
        url: props.nodeCls.data.fillPic
      }) : '' : fillPic.value = [];
      transformRotate.value = props.nodeCls.getAngle();
      layerZIndex.value = props.nodeCls.getZIndex();
      strokeWidth.value = parseFloat(props.nodeCls.attrs.body?.strokeWidth);
      borderRadius.value = props.nodeCls.attrs.body?.rx;
      // animation.value = props.nodeCls.data.animation;
      fontSize.value = props.nodeCls.attrs.label?.fontSize;
      fontWeight.value = props.nodeCls.attrs.label?.fontWeight;
      fontRef.value = {
        X: Math.floor(props.nodeCls.attrs['label']?.refX),
        Y: Math.floor(props.nodeCls.attrs['label']?.refY),
      }
      strokeDasharray.value = props.nodeCls.attrs.body?.strokeDasharray;
      animation.value = props.nodeCls.data?.animation || 'normal';
      transformRotateText.value = props.nodeCls.attrs?.label?.transform?.replace(/[^\d|^\.|^\-]/g, '') || 0;

      color.value = {
        body: {
          fill: {
            rgba: initialThemeColorToRGBA(props.nodeCls.attrs.body.fill),
          },
          stroke: {
            rgba: initialThemeColorToRGBA(props.nodeCls.attrs.body.stroke),
          },
        },
        label: {
          fill: {
            rgba: initialThemeColorToRGBA(props.nodeCls.attrs.label.fill),
          }
        },
      }
    }, { immediate: true })

    // 区块填充色
    const colorRGBABodyFill = computed({
      get: () => {
        let originalClassName = updateBlockClassName(props.nodeCls.getAttrs());
        props.nodeCls.setAttrs({ body: { class: originalClassName }}, { ignoreHistory: true, silent: true });
        return transferRGBA(color.value.body.fill.rgba);
      },
    });

    // 区块边框颜色
    const colorRGBABodyStroke = computed({
      get: () => {
        let originalClassName = updateBlockClassName(props.nodeCls.getAttrs());
        props.nodeCls.setAttrs({ body: { class: originalClassName }}, { ignoreHistory: true, silent: true });
        return transferRGBA(color.value.body.stroke.rgba);
      },
    });

    // 群组区块文本名称颜色
    const colorRGBALabelFill = computed({
      get: () => {
        let originalLabelClass =
          props.nodeCls.getAttrs()?.label?.fill === 'var(--neutral9)' ? 'label-fill original' : 'label-fill';
        props.nodeCls.setAttrs({ label: { class: originalLabelClass }}, { ignoreHistory: true, silent: true });
        return transferRGBA(color.value.label.fill.rgba);
      },
    })

    const hidePopover = (category, type) => {
      emit('change', category, type, props.nodeCls, transferRGBA(color.value[category][type].rgba));
    }

    const handleDeleteFillPic = () => {
      props.nodeCls.html = () => {
        return document.createElement('div');
      };
      props.nodeCls.setData({fillPic: ''}, {silent: true})
    }

    const handleImport = (file, result) => {
      if (file && file.length && file[0].url) {
        let attrs = _.cloneDeep(props.nodeCls.attrs);
        props.nodeCls.html = () => {
          const wrap = document.createElement('div');
          wrap.className = "block-image";
          wrap.id = `block-image-${props.nodeCls.id}`;
          wrap.style.width = '100%';
          wrap.style.height = '100%';
          wrap.style.backgroundImage = `url(${file[0].url})`;
          wrap.style.backgroundSize = '100% 100%';
          wrap.style.borderRadius = attrs?.body?.rx + 'px';
          return wrap;
        };
        props.nodeCls.setAttrs(attrs);
      }
    }

    const changeRotate = (value, type='total') => {
      props.nodeCls.rotate(value, { absolute: true }) // 整体旋转
      // emit('change', 'image', 'transform', props.nodeCls, `rotate(${value})`)
      // emit('change', 'text', 'transform', props.nodeCls, `rotate(${value})`) // 单个文本的旋转
    }

    const changeLayerZIndex = (value) => {
      props.nodeCls.setZIndex(value)
    }

    const changeStrokeWidth = (value) => {
      emit('change', 'body', 'strokeWidth', props.nodeCls, value + 'px');
    }

    const changeBorderRadius = (value) => {
      if (props.nodeCls.data.fillPic) {
        // 通过唯一id获取，改变样式
        document.getElementById(`block-image-${props.nodeCls.id}`).style.borderRadius = value + 'px';
      }
      emit('change', 'body', 'rx', props.nodeCls, value)
    }

    const changeStrokeDasharray = (value) => {
      emit('change', 'body', 'strokeDasharray', props.nodeCls, value)
      // animation.value = 'normal'
    }

    const changeAnimation = (value) => {
      if (value === 'normal') {
        emit('change', 'body', 'style', props.nodeCls, { animation: ''})
        props.nodeCls.setData({animation: 'normal'}, {silent: true})
      }
      if (value === 'flow') {
        emit('change', 'body', 'style', props.nodeCls, { animation: 'running-line 30s infinite linear'})
        props.nodeCls.setData({animation: 'flow'}, {silent: true})
      }
    }

    const changeFontSize = (value) => {
      emit('change', 'label', 'fontSize', props.nodeCls, value)
    }

    const changeFontWeight = (value) => {
      emit('change', 'label', 'fontWeight', props.nodeCls, value)
    }

    const changeRotateText = (value, type='total') => {
      // props.nodeCls.rotate(value, { absolute: true }) // 整体旋转
      // emit('change', 'image', 'transform', props.nodeCls, `rotate(${value})`)
      emit('change', 'label', 'transform', props.nodeCls, `rotate(${value})`) // 单个文本的旋转
      emit('change', 'label', 'transformOrigin', props.nodeCls, `0 0`) // 单个文本的旋转
    }


    const changeFontRef = (value, type) => {
      emit('change', 'label', `ref${type}`, props.nodeCls, value)
    }

    // 上传附件
    const fetchPromise = (file) => {
      const formData = new FormData();
      formData.append('file', file);
      uploadIcon(formData)
        .then((res) => {
          props.nodeCls.setData({fillPic: _.get(res, 'data.data.http_url', '')}, {silent: true})
        })
    }

    return {
      $tt,
      color,
      colorRGBABodyFill,
      fillPic,
      transformRotate,
      layerZIndex,
      colorRGBABodyStroke,
      strokeWidth,
      borderRadius,
      strokeDasharray,
      animation,
      colorRGBALabelFill,
      fontSize,
      fontWeight,
      transformRotateText,
      fontRef,
      fetchPromise,
      handleDeleteFillPic,
      changeRotate,
      hidePopover,
      changeLayerZIndex,
      changeStrokeWidth,
      changeBorderRadius,
      changeStrokeDasharray,
      changeAnimation,
      changeFontSize,
      changeFontWeight,
      changeRotateText,
      changeFontRef,
      handleImport,
    }
  }
}
</script>

<style scoped lang="scss">
.block-property-wrapper {
  .item {
    display: flex;
    padding: 6px 10px;
    align-items: center;
    .label {
      display: inline-block;
      width: 80px;
      text-align: right;
      margin-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
  }
  .color-preview-box {
    cursor: pointer;
    width: 240px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--neutral1);
    .color-box {
      width: 225px;
      height: 12px;
    }
  }
  .border {
    height: 1px;
    background-color: var(--neutral1);
  }
  .upload-wrapper {
    position: relative;
    top: 7px;
  }
  .split-box {
    border-top: 1px solid var(--neutral1);
    padding: 10px 0 10px 20px;
    font-weight: bold;
  }
}
</style>
