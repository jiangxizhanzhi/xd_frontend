<template>
  <div class="trks-point">
    <cb-dialog
      :visible.sync="dialogPoint"
      width="800px"
      :title="$t('course.viewDetails')"
    >
      <div class="wrapper-box cyber-scroll-bar-small">
        <div id="t" class="box">
          <div class="header t">
            <span class="mr10 span-tks">T</span>
            <span class="span-desc"
              >{{ $t('m.jobResponsibilities') }}({{ tData.length }})</span
            >
          </div>
          <div class="item-boxs">
            <div class="item-box" v-for="(item, index) in tData" :key="index">
              {{ item.resource_id }}:{{ item.content }}
            </div>
          </div>
        </div>
        <div id="k" class="box">
          <div class="header k">
            <span class="mr10 span-tks">K</span>
            <span class="span-desc">
              {{ $t('m.exercise.knowledgePoint') }}({{ kData.length }})
            </span>
          </div>
          <div class="item-boxs">
            <div class="item-box" v-for="(item, index) in kData" :key="index">
              {{ item.resource_id }}:{{ item.content }}
            </div>
          </div>
        </div>
        <div id="s" class="box">
          <div class="header s">
            <span class="mr10 span-tks">S</span>
            <span class="span-desc">
              {{ $t('m.skillPoint') }}({{ sData.length }})
            </span>
          </div>
          <div class="item-boxs">
            <div class="item-box" v-for="(item, index) in sData" :key="index">
              {{ item.resource_id }}:{{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </cb-dialog>
  </div>
</template>
<script>
import { reactive, toRefs } from '@vue/composition-api';
export default {
  props: {
    tData: {
      type: Array,
      default: () => [],
    },
    kData: {
      type: Array,
      default: () => [],
    },
    sData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const data = reactive({
      dialogPoint: false,
    });
    const refData = toRefs(data);
    return {
      ...refData,
    };
  },
};
</script>
<style lang="scss" scoped>
.trks-point {
  .t {
    color: var(--primary-color);
  }
  .k {
    color: var(--orange-color);
  }
  .s {
    color: var(--green-color);
  }
  .span-tks {
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    font-size: 16px;
  }
  .span-desc {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .wrapper-box {
    height: 540px;
    overflow: auto;
    .box {
      margin-bottom: 10px;
      .header {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
      }
      .item-boxs {
        .item-box {
          display: inline-block;
          padding: 2px 8px;
          margin: 0 8px 8px 0;
          position: relative;
          background: var(--neutral0);
        }
      }
    }
  }
}
</style>
