<template>
  <div id="edge-tool-container" ref="toolContainerRef" @mousedown="handleMouseDown"  @mousemove="handleMouseMove" @mouseup="handleMouseUp">
    <div class="container">
      <div v-for="type in EDGE_TYPE" :key="type.value" :class="{ 'box': true, 'active': type.value === active }">
        <cb-tooltip
          effect="dark"
          :content="type.name"
          placement="top"
          :enterable="false"
        >
          <cb-iconfont :type="type.icon" class="icon" @click="handleChangeEdgeType(type)"></cb-iconfont>
        </cb-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, watch} from '@vue/composition-api';
import {EDGE_TYPE} from "./constant";
import {getEdgeType} from "../../../../utils/data-conversion/scene-to-external/x6-to-external";
import {setEdgeType} from "../../../../utils/connection/connection-rule";

export default {
  name: "index",
  props: {
    edgeCls: {}
  },
  components: {},
  setup(props, {emit}) {
    let active = ref('');
    let toolContainerRef = ref(null);

    watch(() => props.edgeCls, (val) => {
      if (val) {
        active.value = getEdgeType(props.edgeCls?.router, props.edgeCls?.connector);
      }
    })

    const handleMouseDown = (e) => {}

    const handleMouseMove = (e) => {}

    const handleMouseUp = (e) => {}

    const handleChangeEdgeType = (type) => {
      active.value = type.value;
      setEdgeType(type.value, props.edgeCls);
    }

    return {
      EDGE_TYPE,
      handleChangeEdgeType,
      active,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      toolContainerRef,
    }
  }
}
</script>

<style scoped lang="scss">
#edge-tool-container {
  display: none;
  position: absolute;
  border: 1px solid var(--neutral3);
  background-color: var(--bg-color-2);
  font-size: 14px;
  color: var(--neutral8);
  &:hover {
    //cursor: move;
  }
  .container {
    display: flex;

    .box {
      padding: 5px 10px;
    }

    .icon {
      cursor: pointer;
      color: var(--neutral8) !important;
    }

    .active {
      .icon {
        color: var(--primary-color) !important;
      }
    }
  }
}
</style>
