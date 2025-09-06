<template>
  <cb-dialog
    class="guide-dialog"
    :modal="false"
    :visible.sync="dialogGuide"
    :before-close="beforeClose"
  >
    <template slot="title">
      <div class="min-height">{{ $t('notice.guide') }}</div>
    </template>
    <div class="box cyber-scroll-bar">
      <div v-if="crEventDatas.handout_type == 1" style="height: 100%">
        <cb-markdown
          v-model="crEventDatas.handout_url"
          type="viewer"
        ></cb-markdown>
      </div>
      <template v-else>
        <guide :is-single="true" :frame-url="crEventDatas.handout_url"></guide>
      </template>
    </div>
  </cb-dialog>
</template>

<script>
import Guide from './guide';
export default {
  name: 'GuideDialog',
  components: {
    Guide,
  },
  props: {
    crEventDatas: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialogGuide: false,
    };
  },
  computed: {},
  methods: {
    beforeClose() {
      this.$emit('before-close', 'guide');
      this.dialogGuide = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.guide-dialog {
  .box {
    height: 600px;
    overflow: auto;
  }
  ::v-deep .el-dialog {
    width: 940px;
    margin-right: 0;
  }
}
</style>
<style lang="scss">
.guide-dialog {
  .el-dialog__wrapper {
    pointer-events: none;
    .el-dialog {
      pointer-events: auto;
    }
  }
}
</style>
