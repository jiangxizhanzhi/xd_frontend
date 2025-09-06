<template>
  <cb-dialog
    class="annex-dialog"
    :title="$t('m.annexLists')"
    :visible.sync="dialogAnnex"
    :before-close="beforeClose"
  >
    <div class="annexs-box elc-table">
      <cb-scrollbar>
        <cb-search-table
          ref="multipleTable"
          :cols="columns"
          :selector="tableSelector"
          :selection.sync="multipleSelection"
          :hidePaginOnDemand="true"
          :data-source="annexLists"
          :searchBarBg="false"
        >
          <template v-slot:search>
            <status-btn
              :icon-name="'icon-xiazai'"
              :btn-name="$t('m.annexDown')"
              :status-class="'submit-btn'"
              @click.native="downLoadAll()"
            ></status-btn>
          </template>
          <template v-slot:operate="scope">
            <cb-button
              :loading="scope.data.loading"
              icon="icon-xiazai"
              hollow
              @click="downLoad(scope.data)"
              >{{ $t('m.annexDown') }}</cb-button
            >
          </template>
        </cb-search-table>
      </cb-scrollbar>
    </div>
  </cb-dialog>
</template>

<script>
import _ from 'lodash';
import StatusBtn from '@/components/button/status-btn';
import GradientRadius from '@/components/button/gradient-radius';
let timer = null;
export default {
  components: {
    StatusBtn,
    GradientRadius,
  },
  props: {
    annexList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogAnnex: false,
      checkAllStatus: false,
      checkList: null,
      tableSelector: {
        maxSelect: 0,
      },
      multipleSelection: [],
    };
  },
  computed: {
    annexLists() {
      _.forEach(this.annexList, (item) => {
        this.$set(item, 'loading', false);
        this.$set(
          item,
          'downLoadUrl',
          item.file_path + '?attname=' + encodeURIComponent(item.file_name),
        );
      });
      return this.annexList;
    },
  },
  created() {
    this.columns = [
      {
        label: this.$t('course.name'),
        prop: 'file_name',
      },
      {
        label: this.$t('course.operation'),
        slot: 'operate',
        width: 150,
      },
    ];
  },
  methods: {
    beforeClose() {
      this.$emit('before-close', 'annex');
      this.dialogAnnex = false;
    },
    downLoad(row) {
      const filterDataIndex = _.findIndex(this.annexLists, (item) => {
        return item.resource_id === row.resource_id;
      });
      if (filterDataIndex > -1) {
        if (!this.annexLists[filterDataIndex].loading) {
          this.annexLists.forEach((item) => {
            item.loading = false;
          });
          clearTimeout(timer);
          var a = document.createElement('a');
          a.href = row.downLoadUrl;
          a.download = row.file_name;
          a.click();
          this.annexLists[filterDataIndex].loading = true;
          timer = setTimeout(() => {
            this.annexLists[filterDataIndex].loading = false;
          }, 2000);
        }
      }
    },
    downLoadAll() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$message.error(this.$t('m.plzChoiceAnnex'));
        return;
      }
      this.multipleSelection.forEach((item) => {
        // const timer = setTimeout(() => {
        // this.$request.download(item.downLoadUrl, item.file_name);
        this.downloadFile(item.file_path, item.file_name);
        // }, 2000);

        // const iframeNode = document.createElement('iframe');
        // iframeNode.src = item.downLoadUrl;
        // document.body.appendChild(iframeNode);
        // const timer = setInterval(() => {
        //   const iframeDoc =
        //     iframeNode.contentDocument || iframeNode.contentWindow.document;
        //   if (
        //     iframeDoc.readyState === 'complete' ||
        //     iframeDoc.readyState === 'interactive' ||
        //     iframeDoc.readyState === 'loaded'
        //   ) {
        //     clearInterval(timer);
        //     document.body.removeChild(iframeNode);
        //   }
        // }, 500);
      });
    },
    // download下载方法
    downloadFile(filePath, fileName) {
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.style.display = 'none';
      link.download = fileName;
      link.href = filePath;
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style lang="scss" scoped>
.annex-dialog {
  ::v-deep .el-dialog {
    width: 600px;
    height: 65%;
    min-height: 612px;
    margin-right: 0;
    .cb-dialog-body {
      height: 100%;
    }
    .el-dialog__body {
      height: calc(100% - 100px);
    }
  }
  .btns-box {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
    .sub-bt {
      &:nth-child(1) {
        margin: 0 30px 0 10px;
      }
    }
  }
  .annexs-box {
    height: calc(100% - 56px);
    overflow: hidden;
    width: 100%;
    ::v-deep .el-scrollbar {
      height: 100%;
    }
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }
    ::v-deep .el-scrollbar__view {
      width: 100%;
    }
    .btn_once {
      min-width: 120px;
      height: 32px;
      line-height: 32px;
    }
  }
  ::v-deep .el-table td div {
    box-sizing: initial !important;
  }
  ::v-deep .el-table {
    border-radius: 0 !important;
    .has-gutter {
      display: none;
    }
    .el-table__row:nth-child(odd) {
      background-color: transparent !important;
    }
  }
  ::v-deep .el-loading-mask {
    border-radius: 18px;
    .el-loading-spinner {
      margin-top: -16px;
    }
  }
}
</style>
