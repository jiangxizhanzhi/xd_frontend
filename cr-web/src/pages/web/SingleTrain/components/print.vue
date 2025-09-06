<template>
  <div id="recordPrint">
    <mavon-editor
      ref="allTaskRecordContent"
      v-model="taskRecord"
      :autofocus="false"
      :editable="false"
      :toolbars-flag="false"
      :subfield="false"
      default-open="preview"
    />
  </div>
</template>

<script>
export default {
  name: 'Print',
  data() {
    return {
      taskRecord: '',
    };
  },
  created() {
    this.taskRecord = sessionStorage.getItem('recordData');
    window.print();
  },
};
</script>

<style lang="scss">
#recordPrint {
  width: 80%;
  height: 100%;
  padding: 20px 10% 0;
  .v-note-wrapper {
    min-height: 105%;
  }
  .v-note-wrapper .v-note-op {
    min-height: 100% !important;
  }
  .markdown-body em {
    font-style: italic;
  }
  .markdown-body h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    border-bottom: 0 !important;
  }
  .v-note-wrapper .v-note-panel .v-note-show,
  .v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper {
    overflow-y: hidden !important;
  }
  .v-note-wrapper .v-note-panel .v-note-show .v-show-content,
  #components-train-record
    .task-detail
    .task-record
    .v-note-wrapper
    .v-note-panel
    .v-note-show
    .v-show-content-html {
    overflow-y: hidden !important;
    height: 100% !important;
  }
  .v-note-wrapper .v-note-panel .v-note-show .v-show-content,
  .v-note-wrapper .v-note-panel .v-note-show .v-show-content-html {
    width: 100%;
    height: 90%;
    padding: 8px 25px 15px 15px;
    overflow-y: auto;
    box-sizing: border-box;
    overflow-x: hidden;
  }
}
</style>
