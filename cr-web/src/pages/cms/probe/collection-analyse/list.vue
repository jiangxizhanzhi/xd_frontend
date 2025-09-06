<template>
  <cb-inner-page :background="false">
    <!-- <cb-tabs type="border-card" v-model="activeName">
      <cb-tab-pane :label="$t('probes.textParse')" name="textParse">
        <text-parse v-if="activeName === 'textParse'"></text-parse>
      </cb-tab-pane>
      <cb-tab-pane :label="$t('probes.eventMatch')" name="eventMatch"> -->
    <event-match v-if="activeName === 'eventMatch'"></event-match>
    <!-- </cb-tab-pane>
    </cb-tabs> -->
  </cb-inner-page>
</template>

<script>
// import TextParse from './text-parse.vue';
import EventMatch from './event-match.vue';

export default {
  components: {
    // TextParse,
    EventMatch,
  },
  data() {
    return {
      activeName: 'eventMatch',
    };
  },
};
</script>
