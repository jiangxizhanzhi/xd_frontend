<template>
  <div class="clickMenuWrapper" :id="nodeClickMenuId">
    <template v-if="nodeId">
      <!--节点属性配置-->
      <node-property v-if="nodeCls.shape === 'rect'" v-bind="$props" v-on="$listeners"></node-property>
      <!--连线属性配置-->
      <edge-property v-if="nodeCls.shape === 'edge'" v-bind="$props" v-on="$listeners"></edge-property>
      <!--群组区块属性配置-->
      <block-property v-if="nodeCls.shape === 'html'" v-bind="$props" v-on="$listeners"></block-property>
    </template>
  </div>
</template>
<script>
import {Sketch} from 'vue-color'
import {computed} from '@vue/composition-api';
import nodeProperty from "./components/node-property";
import edgeProperty from "./components/edge-property";
import blockProperty from "./components/block-property";

export default {
  name: 'NodeClickMenu',
  components: {
    Sketch,
    nodeProperty,
    edgeProperty,
    blockProperty,
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
  setup(props, { emit }, context) {
    const nodeClickMenuId = computed({
      get: () => {
        return 'node-click-menu-' + props.sceneEid;
      },
    });
    return {
      nodeClickMenuId,
    };
  },
};
</script>

<style lang="scss" scoped>
.clickMenuWrapper {
  display: none;
  position: absolute;
  background: var(--bg-color-2);
  border: 1px solid var(--neutral3);
  color: var(--neutral8);
  overflow-y: auto;
  overflow-x: hidden;
  user-select: text;
  z-index: 1;
  top: 0;
  left: 0;
  font-size: 14px;
  padding-bottom: 10px;
  //padding: 6px 0;
  max-height: 400px;
}
</style>
