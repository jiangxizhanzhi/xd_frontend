<template>
  <cb-dialog
    :title="$t('m.operatingInstructions')"
    :visible="visible"
    :before-close="beforeClose"
    class="instruction-dialog"
    :close-on-press-escape="false"
  >
    <div class="instruction-dialog-content cyber-scroll-bar-small">
      <div class="first">
        <block
          class="common-title"
          :title="$t('instruction.switchMethod')"
        ></block>
        <div class="common-content">
          <div>{{ $t('instruction.windows') }}</div>
          <div>{{ $t('instruction.windows1') }}</div>
          <div>{{ $t('instruction.windows2') }}</div>
          <div>{{ $t('instruction.windows3') }}</div>
          <div class="mt20">
            <div>{{ $t('instruction.other') }}</div>
            <div>
              <div>{{ $t('instruction.switchMethod1') }}</div>
              <div>{{ $t('instruction.switchMethod11') }}</div>
              <div>{{ $t('instruction.switchMethod12') }}</div>
              <div>{{ $t('instruction.switchMethod13') }}</div>
              <div>{{ $t('instruction.switchMethod14') }}</div>
              <div>
                {{ $t('instruction.switchMethod15') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="second mt20">
        <block
          class="common-title"
          :title="$t('instruction.copyMethod')"
        ></block>
        <div class="common-content">
          <div>{{ $t('instruction.copyMethod1') }}</div>
          <div>
            {{ $t('instruction.copyMethod2') }}
          </div>
          <div>{{ $t('instruction.copyMethod3') }}</div>
        </div>
      </div>
      <div class="third mt20">
        <block class="common-title" :title="$t('instruction.fileCopy')"></block>
        <div class="common-content">
          <div>
            {{ $t('instruction.fileCopy1') }}
          </div>
          <div>
            {{ $t('instruction.fileCopy11') }}
          </div>
          <div>
            {{ $t('instruction.fileCopy12') }}
          </div>
          <div>
            {{ $t('instruction.fileCopy13') }}
          </div>
          <div class="mt20">
            <div>
              {{ $t('instruction.fileCopy2') }}
            </div>
            <div>
              {{ $t('instruction.fileCopy21') }}
            </div>
          </div>
          <div>{{ $t('instruction.fileWarn') }}</div>
          <div>
            <div>{{ $t('instruction.fileWarn1') }}</div>
            <div>{{ $t('instruction.fileWarn2') }}</div>
          </div>
        </div>
      </div>
      <div class="fourth mt20">
        <block
          class="common-title"
          :title="$t('instruction.fileDownload')"
        ></block>
        <div class="common-content">
          <div>{{ $t('instruction.windows') }}</div>
          <div>
            {{ $t('instruction.fileDownload1') }}
          </div>
          <div class="mt20">
            <div>{{ $t('instruction.linux') }}</div>
            <div>
              {{ $t('instruction.fileDownload2') }}
            </div>
          </div>
          <div>
            <div>{{ $t('instruction.fileWarn') }}</div>
            <div>{{ $t('instruction.fileDownload4') }}</div>
          </div>
        </div>
      </div>
      <div class="last">
        <block class="common-title" :title="$t('instruction.tool')"></block>

        <div>
          {{ $t('instruction.toolInfo') }}
        </div>
      </div>
    </div>
  </cb-dialog>
</template>

<script>
import Block from '@/components/block';
export default {
  components: { Block },
  data() {
    return {
      visible: false,
      markdownData: 'wewewewe',
    };
  },
  methods: {
    beforeClose() {
      this.$emit('before-close', 'instruction');
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.instruction-dialog {
  ::v-deep .el-dialog {
    margin-right: 0;
  }
  &-content {
    min-height: 300px;
    height: 560px;
    overflow: auto;
    color: var(--neutral8);
    font-size: 14px;
    line-height: 22px;

    .mt20 {
      margin: 20px 0;
    }
  }
}
</style>
