<template>
  <div class="node-property-wrapper">
    <div class="split-box">{{$tt('colorful.nodeBasic')}}</div>
    <div class="item">
      <span class="label">{{$tt('colorful.size')}}：</span>
      <cb-input-number
        v-model="nodeSize"
        controls-position="right"
        :step-strictly="true"
        size="small"
        :min="0"
        @change="changeNodeSize"
      ></cb-input-number>px
    </div>
    <div class="item">
      <span class="label">{{$tt('colorful.transformRotate')}}：</span>
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
    <div class="split-box">{{$tt('colorful.textConfig')}}</div>
    <div class="item">
      <span class="label">{{$tt('colorful.textColor')}}：</span>
      <cb-popover placement="bottom-start" trigger="click">
        <div><Sketch v-model="color.text.fill" @input="hidePopover('text', 'fill')"></Sketch></div>
        <div slot="reference" class="color-preview-box">
          <div class="color-box" :style="'background: ' + colorRGBATextFill"></div>
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
import {computed, ref, watch} from "@vue/composition-api";
import {Sketch} from 'vue-color'
import {initialThemeColorToRGBA, transferRGBA} from "../../../../utils/common/colorful";
import t from "../../../../utils/i18n";

export default {
  name: "node-property",
  components: {
    Sketch
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
    // 节点图标大小
    let nodeSize = ref(40);
    // 旋转角度
    let transformRotate = ref(0);
    // 层级
    let layerZIndex = ref();
    // 字体大小
    let fontSize = ref(14);
    // 字体粗细
    let fontWeight = ref(400);
    // 文本旋转角度
    let transformRotateText = ref(0);
    // 文本偏移
    let fontRef = ref({ X: 0, Y: 0 });

    let color = ref({
      text: {
        fill: {
          rgba: {r: 255, g: 255, b: 255, a: 1}
        }
      },
    })

    watch(() => props.nodeId, () => {
      if (!props.nodeId) return;
      nodeSize.value = props.nodeCls.size()?.width;
      transformRotate.value = props.nodeCls.getAngle();
      layerZIndex.value = props.nodeCls.getZIndex();
      fontSize.value = parseInt(props.nodeCls.attrs.text?.fontSize);
      fontWeight.value = props.nodeCls.attrs.text?.fontWeight;
      transformRotateText.value = props.nodeCls.attrs?.text?.transform?.replace(/[^\d|^\.|^\-]/g, '') || 0;
      fontRef.value = {
        X: Math.floor(props.nodeCls.attrs['text']?.refX),
        Y: Math.floor(props.nodeCls.attrs['text']?.refY),
      }
      color.value = {
        text: {
          fill: {
            rgba: initialThemeColorToRGBA(props.nodeCls.attrs.text.fill),
          }
        },
      }
    }, { immediate: true })
    // 修改节点图标大小
    const changeNodeSize = (value) => {
      props.nodeCls.resize(value, value);
      props.nodeCls.getPorts()?.forEach(port => {
        props.nodeCls.setPortProp(port.id, ['args'], {x: value/2, y: value/2})
      })
      props.nodeCls.setAttrs({
        circle: {
          refX: value / 2,
          refY: value / 2
        },
        text: {
          refY: value + 13,
        },
        edited: {
          refX: value / 2 - 11,
          refY: value + 20,
        },
        // cloudInit: {
        //   refX: value / 2,
        //   refY: ((value * 3) / 6).toFixed(0),
        // }
      })
    }
    const changeRotate = (value, type='total') => {
      props.nodeCls.rotate(value, { absolute: true }) // 整体旋转
      // emit('change', 'image', 'transform', props.nodeCls, `rotate(${value})`)
      // emit('change', 'text', 'transform', props.nodeCls, `rotate(${value})`) // 单个文本的旋转
    }

    const changeLayerZIndex = (value) => {
      props.nodeCls.setZIndex(value)
    }

    // 节点名称颜色
    const colorRGBATextFill = computed({
      get: () => {
        let originalLabelClass =
          props.nodeCls.getAttrs()?.text?.fill === 'var(--neutral9)' ? 'node-label original' : 'node-label';
        props.nodeCls.setAttrs({ text: { class: originalLabelClass }}, { ignoreHistory: true, silent: true });
        return transferRGBA(color.value.text.fill.rgba);
      },
    })

    const hidePopover = (category, type) => {
      emit('change', category, type, props.nodeCls, transferRGBA(color.value[category][type].rgba));
    }

    const changeFontSize = (value) => {
      emit('change', 'text', 'fontSize', props.nodeCls, `${value}px`);
    }

    const changeFontWeight = (value) => {
      emit('change', 'text', 'fontWeight', props.nodeCls, value);
    }

    const changeRotateText = (value, type='total') => {
      // props.nodeCls.rotate(value, { absolute: true }) // 整体旋转
      // emit('change', 'image', 'transform', props.nodeCls, `rotate(${value})`)
      emit('change', 'text', 'transform', props.nodeCls, `rotate(${value})`) // 单个文本的旋转
      emit('change', 'text', 'transformOrigin', props.nodeCls, `0 0`) // 单个文本的旋转
    }

    const changeFontRef = (value, type) => {
      emit('change', 'text', `ref${type}`, props.nodeCls, value)
    }

    return {
      $tt,
      color,
      nodeSize,
      transformRotate,
      layerZIndex,
      colorRGBATextFill,
      fontSize,
      fontWeight,
      transformRotateText,
      fontRef,
      changeNodeSize,
      changeRotate,
      changeLayerZIndex,
      hidePopover,
      changeFontSize,
      changeFontWeight,
      changeRotateText,
      changeFontRef,
    }
  }
}
</script>

<style scoped lang="scss">
.node-property-wrapper {
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
