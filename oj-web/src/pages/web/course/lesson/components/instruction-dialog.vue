<template>
  <cb-dialog
    class="instruction-dialog"
    :title="$t('course.oi')"
    :visible.sync="dialogInstruction"
    :before-close="beforeClose"
  >
    <!-- <cb-scrollbar> -->
    <div class="box">
      <cb-scrollbar>
        <div class="first">
          <block
            class="common-title"
            :title="$t('course.switchMethod')"
          ></block>
          <div class="common-content">
            <div>{{ $t('course.windows') }}</div>
            <div>{{ $t('course.windows1') }}</div>
            <div>{{ $t('course.windows2') }}</div>
            <div>{{ $t('course.windows3') }}</div>
            <div class="mt20">
              <div>{{ $t('course.other') }}</div>
              <div>
                <div>{{ $t('course.switchMethod1') }}</div>
                <div>{{ $t('course.switchMethod11') }}</div>
                <div>{{ $t('course.switchMethod12') }}</div>
                <div>{{ $t('course.switchMethod13') }}</div>
                <div>{{ $t('course.switchMethod14') }}</div>
                <div>
                  {{ $t('course.switchMethod15') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="second mt20">
          <block class="common-title" :title="$t('course.copyMethod')"></block>
          <div class="common-content">
            <div>{{ $t('course.copyMethod1') }}</div>
            <div>
              {{ $t('course.copyMethod2') }}
            </div>
            <div>{{ $t('course.copyMethod3') }}</div>
          </div>
        </div>
        <div class="third mt20">
          <block class="common-title" :title="$t('course.fileCopy')"></block>
          <div class="common-content">
            <div>
              {{ $t('course.fileCopy1') }}
            </div>
            <div>
              {{ $t('course.fileCopy11') }}
            </div>
            <div>
              {{ $t('course.fileCopy12') }}
            </div>
            <div>
              {{ $t('course.fileCopy13') }}
            </div>
            <div class="mt20">
              <div>
                {{ $t('course.fileCopy2') }}
              </div>
              <div>
                {{ $t('course.fileCopy21') }}
              </div>
            </div>
            <div>{{ $t('course.fileWarn') }}</div>
            <div>
              <div>{{ $t('course.fileWarn1') }}</div>
              <div>{{ $t('course.fileWarn2') }}</div>
            </div>
          </div>
        </div>
        <div class="fourth mt20">
          <block
            class="common-title"
            :title="$t('course.fileDownload')"
          ></block>
          <div class="common-content">
            <div>{{ $t('course.windows') }}</div>
            <div>
              {{ $t('course.fileDownload1') }}
            </div>
            <div class="mt20">
              <div>{{ $t('course.linux') }}</div>
              <div>
                {{ $t('course.fileDownload2') }}
              </div>
            </div>
            <div>
              <div>{{ $t('course.fileWarn') }}</div>
              <div>{{ $t('course.fileDownload4') }}</div>
            </div>
          </div>
        </div>
        <div class="last mt20">
          <block class="common-title" :title="$t('course.tool')"></block>

          <div>
            {{ $t('course.toolInfo') }}
          </div>
        </div>
      </cb-scrollbar>
    </div>
    <!-- </cb-scrollbar> -->
  </cb-dialog>
</template>

<script>
import Block from '@/components/block';

export default {
  name: 'InstructionDialog',
  components: { Block },
  data() {
    return {
      dialogInstruction: false,
    };
  },
  methods: {
    beforeClose() {
      this.$emit('before-close', 'desc');
      this.dialogInstruction = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.instruction-dialog {
  ::v-deep .el-dialog {
    width: 940px;
    height: 65%;
    min-height: 612px;
    margin-right: 0;
    .cb-dialog-body {
      height: 100%;
    }
    .el-dialog__body {
      height: calc(100% - 101px);
      ::v-deep .el-scrollbar {
        height: 100%;
        overflow-x: hidden;
        overflow: auto;
        .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }
      .box {
        height: 100%;
        line-height: 22px;
        .mt20 {
          margin: 20px 0;
        }
      }
    }
  }
}
</style>
