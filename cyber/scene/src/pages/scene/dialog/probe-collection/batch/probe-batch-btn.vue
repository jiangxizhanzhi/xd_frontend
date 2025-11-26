<template>
<div :class="{ 'probe-batch-btn-wrapper': true, 'hide-title': !showTitle }">
  <cb-button type="primary" hollow @click="handleClick">{{$tt('menu.menu.batchOrchestration')}}</cb-button>
</div>
</template>

<script>
import t from '../../../../../utils/i18n';
export default {
  name: "probe-batch-btn",
  props: {
    showTitle: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, {emit}) {
    const handleClick = () => {
      emit('click')
    }
    return {
      $tt: t,
      handleClick,
    }
  }
}
</script>
