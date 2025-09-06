<template>
  <detail :id="$route.params.id" />
</template>

<script>
import Detail from './detail';

export default {
  name: 'Edit',
  components: { Detail },
};
</script>
