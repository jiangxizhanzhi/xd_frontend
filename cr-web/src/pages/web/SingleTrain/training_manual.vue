<template>
  <!--训练手册-->
  <cb-dialog
    :title="$t('m.trainManual')"
    :visible.sync="dialogVisible"
    class="manual-dialog"
    width="70%"
  >
    <div class="main" style="height: 600px">
      <div
        style="height: 100%; overflow: auto"
        v-if="singleManual.length"
        class="cyber-scroll-bar markDownCommon markdownContent"
      >
        <CbMarkdown v-model="singleManual" type="viewer" />
      </div>
      <empty-page v-else ref="emptyComp" />
    </div>
  </cb-dialog>
</template>
<script>
import emptyPage from '@/pages/web/Empty';

export default {
  components: {
    emptyPage,
  },
  data() {
    return {
      dialogVisible: false,
      singleManual: '',
    };
  },
  created() {},
  mounted() {
    this.id = this.$route.params && this.$route.params.resource_id;
    // 点击右侧训练手册
    this.$request
      .get(
        '/cr/single_train/room/train_manual',
        { resource_id: this.id },
        { baseURL: '/api/ojj' },
      )
      .then((res) => {
        this.singleManual = res.data.data;
      })
      .catch(() => {});
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.mavon-editor-private {
  height: auto;
}
</style>

<style lang="scss">
.manual-dialog {
  .el-dialog__body {
    position: relative;
    width: calc(100% - 20px);
    padding: 10px !important;
    border-bottom: 0 !important;
    height: calc(100% - 74px) !important;
  }
}

.markdownContent {
  .el-scrollbar {
    height: 100%;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
    margin-right: -11px !important;
  }
  .el-scrollbar__view {
    height: 100%;
  }
  .markdown-body {
    font-size: 12px;
  }

  h2 {
    display: block;
    width: 93%;
    line-height: 30px !important;
    font-size: 12px !important;
    font-family: Microsoft YaHei !important;
    font-weight: 300 !important;
  }
  ol > li {
    list-style: decimal;
  }
  ul > li {
    list-style: disc;
  }
  sup {
    top: -0.5em;
  }
  sub {
    bottom: -0.25em;
  }
  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  .markdown-body hr {
    height: 0;
    margin: 0;
    background-color: transparent;
  }
}
</style>
