<template>
  <div class="guide" oncontextmenu="javascript: return false;">
    <div class="pdfcontainer cyber-scroll-bar" :style="paddingData">
      <pdf-preview
        v-if="pdfType"
        :style="singleStyle"
        :pdfSrc="frameUrl"
      ></pdf-preview>
      <iframe
        v-else
        id="bdIframe"
        ref="iframeRef"
        :src="frameUrl"
        scrolling="auto"
      ></iframe>
    </div>
  </div>
</template>

<script>
import pdfPreview from '@/components/vue-pdf/pdf.vue';
export default {
  components: {
    pdfPreview,
  },
  props: {
    isSingle: {
      type: Boolean,
      default: null,
    },
    frameUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      toolShow: true,
      paddingData: '',
      singleStyle: {
        width: '',
        height: '',
      },
      pdfType: false,
    };
  },
  watch: {
    frameUrl: {
      handler(val, oldval) {
        let pdfReg = /^.+(\.pdf)$/;
        this.pdfType = pdfReg.test(val);
      },
      immediate: true,
      deep: true,
    },
    isSingle: {
      handler(val, oldval) {
        if (val) {
          /**
           * iframe-宽高自适应显示
           */
          // if (this.isSingle) {
          this.$nextTick(() => {
            let dom = document.querySelector('.single-box');
            const singleBoxHeight = dom?.clientHeight;
            const singleBoxWidth = dom?.clientWidth;
            this.singleStyle = {
              width: Number(singleBoxWidth - 60) + 'px',
              height: Number(singleBoxHeight - 60) + 'px',
            };
            const iframeHeight = Number(singleBoxHeight - 60);
            const oIframe = this.$refs.iframeRef;
            oIframe.style.height = iframeHeight + 'px';
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.guide {
  width: 100%;
  height: 100%;
  iframe {
    width: 100%;
    height: 100%;
    background: var(--font-color-primary);
  }
  .pdfcontainer {
    width: 100%;
    height: 100%;
  }
}
</style>
