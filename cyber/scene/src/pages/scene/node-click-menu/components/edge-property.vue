<template>
  <div class="edge-property-wrapper">
    <div class="split-box">{{$tt('colorful.edgeBasic')}}</div>
    <div class="item">
      <span class="label">{{$tt('colorful.edgeColor')}}：</span>
      <cb-popover placement="bottom-start" trigger="click">
        <div><Sketch v-model="color.line.stroke" @input="hidePopover('line', 'stroke')"></Sketch></div>
        <div slot="reference" class="color-preview-box">
          <div class="color-box" :style="'background: ' + colorRGBALineStroke"></div>
        </div>
      </cb-popover>
    </div>
    <div class="item">
      <span class="label">{{$tt('colorful.edgeWidth')}}：</span>
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
      <span class="label">{{$tt('colorful.edgeType')}}：</span>
      <cb-radio-group v-model="strokeDasharray" @change="changeStrokeDasharray">
        <cb-radio :label="0">{{$tt('colorful.solid')}}</cb-radio>
        <cb-radio :label="'10, 5'">{{$tt('colorful.dash')}}</cb-radio>
        <cb-radio :label="'5, 5, 1, 5'">{{$tt('colorful.dotted')}}</cb-radio>
      </cb-radio-group>
    </div>
    <div class="item" >
      <span class="label">{{$tt('colorful.edgeAnimation')}}：</span>
      <cb-radio-group v-model="animation" @change="changeAnimation">
        <cb-radio label="normal">{{$tt('colorful.none')}}</cb-radio>
        <cb-radio label="flow" v-if="strokeDasharray">{{$tt('colorful.flow')}}</cb-radio>
        <cb-radio label="animateAlongPath">{{$tt('colorful.animate')}}</cb-radio>
      </cb-radio-group>
    </div>
    <div class="item" v-if="animation === 'animateAlongPath'">
      <span class="label">{{$tt('colorful.edgeDirection')}}：</span>
      <cb-radio-group v-model="animationDirections" @change="changeAnimationDirections">
        <cb-radio label="uniDirectional">{{$tt('colorful.uniDirectional')}}</cb-radio>
        <cb-radio label="biDirectional">{{$tt('colorful.biDirectional')}}</cb-radio>
      </cb-radio-group>
    </div>
    <div class="item" v-if="animation != 'normal'">
      <span class="label"></span>
      <cb-button  hollow @click="changeAnimationDirection" icon="icon-up">{{$tt('colorful.changeEdgeDirection')}}</cb-button>
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
    <div class="split-box">{{$tt('colorful.labelTextConfig')}}</div>
    <div class="item">
      <span class="label">{{$tt('colorful.textColor')}}：</span>
      <cb-popover placement="bottom-start" trigger="click">
        <div><Sketch v-model="color.labels.text.fill" @input="hidePopover('line', 'labels/text/fill')"></Sketch></div>
        <div slot="reference" class="color-preview-box">
          <div class="color-box" :style="'background: ' + colorRGBALineLabelsStroke"></div>
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
    <div class="split-box">{{$tt('colorful.labelConfig')}}</div>
    <div class="item">
      <span class="label" :title="$tt('colorful.labelBg')">{{$tt('colorful.labelBg')}}：</span>
      <cb-popover placement="bottom-start" trigger="click">
        <div><Sketch v-model="color.labels.body.fill" @input="hidePopover('line', 'labels/body/fill')"></Sketch></div>
        <div slot="reference" class="color-preview-box">
          <div class="color-box" :style="'background: ' + colorRGBALabelBodyFill"></div>
        </div>
      </cb-popover>
    </div>
    <div class="item">
      <span class="label">{{$tt('colorful.labelPadding')}}：</span>
      <cb-input-number
        v-model="labelBlockSize"
        controls-position="right"
        :step-strictly="false"
        size="small"
        :min="0"
        :max="10"
        @change="changeLabelSize"
      ></cb-input-number>{{$tt('colorful.double')}}
    </div>
    <div class="item">
      <span class="label" :title="$tt('colorful.labelBorderRadius')">{{$tt('colorful.labelBorderRadius')}}：</span>
      <cb-input-number
        v-model="labelBlockRadius"
        controls-position="right"
        :step-strictly="false"
        size="small"
        :min="0"
        @change="changeLabelBlockRadius"
      ></cb-input-number>px
    </div>
  </div>
</template>

<script>
import {computed, ref, watch} from "@vue/composition-api";
import _ from "lodash";
import {initialThemeColorToRGBA, transferRGBA} from "../../../../utils/common/colorful";
import {Sketch} from 'vue-color';
import sceneStore from "../../../../store/scene-store";
import t from "../../../../utils/i18n";

export default {
  name: "edge-property",
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
    // 层级
    let layerZIndex = ref();
    // 连线宽度
    let strokeWidth = ref(1);
    // 虚线
    let strokeDasharray = ref(0);
    // 动效
    let animation = ref();
    // 字体大小
    let fontSize = ref(14);
    // 字体粗细
    let fontWeight = ref(400);
    // 连线标签块大小
    let labelBlockSize = ref(1);
    // 标签圆角大小
    let labelBlockRadius = ref(0);
    // 动效的单向和双向
    let animationDirections = ref('uniDirectional');

    let color = ref({
      line: {
        stroke: {
          rgba: {r: 255, g: 255, b: 255, a: 0.7}
        }
      },
      // 连线的标签
      labels: {
        text: {
          fill: {
            rgba: {r: 255, g: 255, b: 255, a: 1}
          }
        },
        body: {
          fill: {
            rgba: {r: 255, g: 255, b: 255, a: 1}
          }
        },
      }
    })

    watch(() => props.nodeId, () => {
      if (!props.nodeId) return;
      strokeWidth.value = parseFloat(props.nodeCls.data?.line?.strokeWidth);
      fontSize.value = props.nodeCls.data?.labels?.text.fontSize;
      fontWeight.value = props.nodeCls.data?.labels?.text.fontWeight;
      layerZIndex.value = props.nodeCls.getZIndex();
      strokeDasharray.value = props.nodeCls.data?.line?.strokeDasharray;
      animation.value = props.nodeCls.data?.animation || 'normal';
      labelBlockSize.value = parseFloat(props.nodeCls.data?.labels?.body.refWidth) / 100;
      labelBlockRadius.value = props.nodeCls.data?.labels?.body.rx;
      animationDirections.value = props.nodeCls.data?.animationDirections || 'uniDirectional';

      color.value = {
        line: {
          stroke: {
            rgba: initialThemeColorToRGBA(props.nodeCls.data?.line?.stroke),
          }
        },
        labels:{
          text: {
            fill: {
              rgba: initialThemeColorToRGBA(props.nodeCls.data?.labels?.text?.fill),
            }
          },
          body: {
            fill: {
              rgba: initialThemeColorToRGBA(props.nodeCls.data?.labels?.body?.fill),
            }
          }
        },
      }
    }, { immediate: true })
    // 连线颜色
    const colorRGBALineStroke = computed({
      get: () => {
        let rgbaVal = transferRGBA(color.value.line.stroke.rgba);
        let originalLineStrokeClass =
          props.nodeCls.getAttrs()?.text?.fill === 'var(--neutral7)' ? 'edge-line original' : 'edge-line';
        props.nodeCls.setAttrs({ line: { class: originalLineStrokeClass }}, { ignoreHistory: true, silent: true });
        props.nodeCls.setData({ line: props.nodeCls.getAttrs()?.line }, { silent: true });
        return rgbaVal;
      },
    })

    // 连线标签文本颜色
    const colorRGBALineLabelsStroke = computed({
      get: () => {
        let rgbaVal = transferRGBA(color.value.labels.text.fill.rgba);
        props.nodeCls.setData({ labels: props.nodeCls.labels[0]?.attrs }, { silent: true });
        return rgbaVal;
      },
    })

    // 连线标签背景颜色
    const colorRGBALabelBodyFill = computed({
      get: () => {
        let rgbaVal = transferRGBA(color.value.labels.body.fill.rgba);
        props.nodeCls.setData({ labels: props.nodeCls.labels[0]?.attrs }, { silent: true });
        return rgbaVal;
      },
    })

    const changeLayerZIndex = (value) => {
      props.nodeCls.setZIndex(value);
      props.nodeCls.setData({ line: props.nodeCls.getAttrs()?.line }, { silent: true });
    }

    const changeStrokeWidth = (value) => {
      emit('change', 'line', 'strokeWidth', props.nodeCls, value + 'px');
      props.nodeCls.setData({ line: props.nodeCls.getAttrs()?.line }, { silent: true });
    }

    const changeStrokeDasharray = (value) => {
      emit('change', 'line', 'strokeDasharray', props.nodeCls, value)
      props.nodeCls.setData({ line: props.nodeCls.getAttrs()?.line }, { silent: true });
    }

    const changeAnimation = (value) => {
      if (value === 'normal') {
        emit('change', 'line', 'style', props.nodeCls, { animation: ''})
        emit('change', 'removeAnimateAlongPath', '', props.nodeCls)
        props.nodeCls.setData({animation: 'normal'}, {silent: true})
      }
      if (value === 'flow') {
        emit('change', 'line', 'style', props.nodeCls, { animation: 'running-line 30s infinite linear'})
        emit('change', 'removeAnimateAlongPath', '', props.nodeCls)
        props.nodeCls.setData({animation: 'flow'}, {silent: true})
      }
      if (value === 'animateAlongPath') {
        props.nodeCls.setData({animation: 'animateAlongPath'}, {silent: true})
        emit('change', 'line', 'style', props.nodeCls, { animation: ''})
        emit('change', 'animateAlongPath', '', props.nodeCls)
      }
    }

    // 配置动效的单双向
    const changeAnimationDirections = (value) => {
      props.nodeCls.setData({animationDirections: value}, {silent: true})
      emit('change', 'animateAlongPath', '', props.nodeCls)
    }

    // 切换动画的运动方向
    const changeAnimationDirection = (value) => {
      emit('change', 'line', 'changePort', props.nodeCls)
    }

    const changeFontSize = (value) => {
      let originLabels = _.cloneDeep(props.nodeCls.labels);
      originLabels.forEach(label => {
        label.attrs.text.fontSize = value;
      })
      props.nodeCls.setLabels(originLabels, { ignoreHistory: true })
      props.nodeCls.setData({ labels: props.nodeCls.labels[0]?.attrs }, { silent: true });
    }

    const changeFontWeight = (value) => {
      let originLabels = _.cloneDeep(props.nodeCls.labels);
      originLabels.forEach(label => {
        label.attrs.text.fontWeight = value;
      })
      props.nodeCls.setLabels(originLabels, { ignoreHistory: true })
      props.nodeCls.setData({ labels: props.nodeCls.labels[0]?.attrs }, { silent: true });
    }

    // 修改标签块的背景大小
    const changeLabelSize = (value) => {
      let originLabels = _.cloneDeep(props.nodeCls.labels);
      originLabels.forEach(label => {
        label.attrs.body.refWidth = value * 100 + '%';
        label.attrs.body.refHeight = value * 100 + '%';
        label.attrs.body.refX = - (value * 100 - 100)/2 + '%';
        label.attrs.body.refY = - (value * 100 - 100)/2 + '%';
      })
      props.nodeCls.setLabels(originLabels, { ignoreHistory: true })
      props.nodeCls.setData({ labels: props.nodeCls.labels[0]?.attrs }, { silent: true });
    }

    const changeLabelBlockRadius = (value) => {
      let originLabels = _.cloneDeep(props.nodeCls.labels);
      originLabels.forEach(label => {
        label.attrs.body.rx = value;
        label.attrs.body.ry = value;
      })
      props.nodeCls.setLabels(originLabels, { ignoreHistory: true })
      props.nodeCls.setData({ labels: props.nodeCls.labels[0]?.attrs }, { silent: true });
    }

    const hidePopover = (category, type) => {
      if (type === 'labels/text/fill' || type === 'labels/body/fill') {
        let originLabels = _.cloneDeep(props.nodeCls.labels);
        originLabels.forEach(label => {
          if (type === 'labels/text/fill' && label?.attrs?.text?.fill) {
            label.attrs.text.fill = transferRGBA(color.value['labels']['text']['fill'].rgba)
          } else if (type === 'labels/body/fill' && label?.attrs?.body?.fill){
            label.attrs.body.fill = transferRGBA(color.value['labels']['body']['fill'].rgba)
          }
        })
        props.nodeCls.setLabels(originLabels, { ignoreHistory: true })
        props.nodeCls.setData({ labels: props.nodeCls.labels[0]?.attrs }, { silent: true });
        props.nodeCls.setData({ line: props.nodeCls.getAttrs()?.line }, { silent: true });
      } else {
        // props.nodeCls.setData({stroke: color.value[category][type].rgba}, {silent: true})
        emit('change', category, type, props.nodeCls, transferRGBA(color.value[category][type].rgba));
        props.nodeCls.setData({ line: props.nodeCls.getAttrs()?.line }, { silent: true });
      }
    }

    return {
      $tt,
      color,
      colorRGBALineStroke,
      layerZIndex,
      strokeWidth,
      strokeDasharray,
      animation,
      colorRGBALineLabelsStroke,
      fontSize,
      fontWeight,
      colorRGBALabelBodyFill,
      labelBlockSize,
      labelBlockRadius,
      animationDirections,
      hidePopover,
      changeLayerZIndex,
      changeStrokeWidth,
      changeStrokeDasharray,
      changeAnimation,
      changeAnimationDirection,
      changeFontSize,
      changeFontWeight,
      changeLabelSize,
      changeLabelBlockRadius,
      changeAnimationDirections,
      sceneStore,
    }
  }
}
</script>

<style scoped lang="scss">
.edge-property-wrapper {
  .item {
    display: flex;
    padding: 6px 10px;
    align-items: center;
    .label {
      display: inline-block;
      width: 70px;
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
