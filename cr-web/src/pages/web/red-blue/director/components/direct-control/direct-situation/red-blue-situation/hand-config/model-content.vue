<template>
  <div class="model-content">
    <!-- 攻防模型弹框 -->
    <cb-dialog
      class="dialog-style"
      :title="$t('rbt.attackDefenseDynamicModel')"
      :visible.sync="sonModelVisible"
      center="center"
      width="600px"
      @close="closeFn"
      height="600px"
    >
      <div>
        <!-- {{ this.modelVisible }} -->
        <!-- {{ this.modelData }} -->
        <cb-tabs v-model="activeName">
          <cb-tab-pane :label="$t('rbt.attackSituationModel')" name="attack">
            <div>
              <div
                v-for="item in this.modelData.attack_list"
                class="top-content"
              >
                <span class="name-style">{{ item.name }}</span
                ><span style="margin-left: 24px" class="desc-style">{{
                  item.desc
                }}</span>

                <div class="bottom-content">
                  <div class="img-box">
                    <img :src="item.success_url" class="img-style" />
                  </div>
                </div>
              </div>
            </div>
          </cb-tab-pane>
          <cb-tab-pane :label="$t('rbt.defenseSituationModel')" name="defense">
            <div>
              <div v-for="item in this.modelData.defense_list">
                <span class="name-style">{{ item.name }}</span
                ><span style="margin-left: 24px">{{ item.desc }}</span>
                <div class="bottom-content">
                  <div class="img-box">
                    <img :src="item.success_url" class="img-style" />
                  </div>
                </div>
              </div>
            </div>
          </cb-tab-pane>
        </cb-tabs>
      </div>
    </cb-dialog>
  </div>
</template>

<script>
export default {
  props: {
    modelVisible: {
      type: Boolean,
      default: false,
    },
    modelData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      activeName: 'attack',
      sonModelVisible: this.modelVisible,
    };
  },
  created() {},
  mounted() {},
  methods: {
    closeFn() {
      this.activeName = 'attack';
      this.$emit('modelVisibleChange', false);
    },
  },
  watch: {
    modelVisible: {
      handler(val) {
        this.sonModelVisible = val;
      },
    },
  },
};
</script>

<style scoped lang="scss">
.model-content {
  .dialog-style {
    .top-content {
      margin-bottom: 8px;
      .name-style {
        font-size: 14px;
        font-weight: 600;
      }
      .desc-style {
        font-size: 14px;
        color: var(--neutral7);
      }
    }
    .bottom-content {
      height: 119px;
      margin-bottom: 16px;
      margin-top: 8px;
      display: flex;
      .img-box {
        width: 266px;
        height: 119px;
        background: var(--bg-color-3);
        .img-style {
          width: 100%;
        }
      }
    }
    .name-style {
      font-size: 14px;
      font-weight: 600;
    }
  }
}
</style>
