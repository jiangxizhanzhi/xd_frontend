<template>
  <div class="page-container" v-loading="loading">
    <div class="main">
      <vue-pdf-app
        :pdf="pdfSrc"
        :config="config"
        @pages-rendered="afterCreated"
      ></vue-pdf-app>
    </div>
  </div>
</template>
<script>
import VuePdfApp from 'vue-pdf-app';
import 'vue-pdf-app/dist/icons/main.css';

export default {
  components: { VuePdfApp },
  props: {
    pdfSrc: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      numPages: undefined,
      loading: true,
      src: null,
      config: {
        toolbar: {
          toolbarViewerLeft: {
            findbar: false,
            previous: true,
            next: true,
            pageNumber: true,
          },
          toolbarViewerRight: false,
          toolbarViewerMiddle: false,
        },
        secondaryToolbar: false,
      },
    };
  },
  methods: {
    afterCreated() {
      this.loading = false;
      let num = document.getElementById('numPages')?.innerText;
      if (num && num?.match(/\d+/g)) {
        document.getElementById('numPages').innerText =
          ' / ' + num?.match(/\d+/g);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page-container {
  height: 100%;
  width: 100%;
  .main {
    height: 100%;
  }
}
::v-deep .pdf-app .toolbar {
  z-index: 3;
}
::v-deep .pdf-app #sidebarContainer {
  z-index: 2;
}
::v-deep .pdf-app #outlineView {
  margin-top: 32px;
}
::v-deep .pdf-app.light {
  --pdf-toolbar-color: rgb(50, 54, 57);
  --pdf-app-background-color: rgb(82, 86, 89);
}
::v-deep .pdf-app #thumbnailView {
  width: auto;
}
</style>
