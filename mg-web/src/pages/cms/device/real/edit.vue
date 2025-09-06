<template>
  <step-index :id="$route.params.id"></step-index>
</template>

<script>
import StepIndex from './components/StepIndex';
export default {
  name: 'RealEdit',
  components: { StepIndex },
};
</script>
