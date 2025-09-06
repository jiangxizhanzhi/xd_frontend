<template>
  <image-form :id="$route.params.id" />
</template>

<script>
import ImageForm from '../components/image-form.vue';

export default {
  name: 'ImageFormDetail',
  components: { ImageForm },
};
</script>
