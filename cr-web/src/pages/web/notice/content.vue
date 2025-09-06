<template>
  <div ref="contentWrap" class="content-wrap">
    <div
      :class="['content', expande ? 'expande' : 'close three-overflow']"
      ref="content"
    >
      <span v-if="top" class="to-top">{{ $t('notice.top') }}</span>
      <span class="text-span" style="line-height: 22px">
        {{ text }}
      </span>
    </div>
    <div v-if="needShowExpande" class="expande-button-wrap">
      <div v-if="!expande" class="expande-button show-all">
        <span @click="expandeClick"> {{ $t('notice.showAll') }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Content',
  props: {
    text: {
      type: String,
      default: '',
    },
    top: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      expande: true,
      needShowExpande: false,
    };
  },
  watch: {
    text: {
      handler(nv, ov) {
        if (nv) {
          this.$nextTick(() => {
            let lineHeight = 23;
            if (this.$refs.content.offsetHeight > lineHeight * 3) {
              this.expande = false;
              this.needShowExpande = true;
            } else {
              this.expande = true;
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {
    expandeClick() {
      this.expande = !this.expande;
    },
  },
};
</script>

<style lang="scss" scoped>
.to-top {
  font-size: 12px;
  line-height: 22px;
  background: var(--orange-color-2);
  border-radius: 2px;
  padding: 3px 8px;
  color: var(--orange-color);
  margin-right: 5px;
}
.show-all {
  font-size: 14px;
  color: var(--primary-color);
  line-height: 22px;
  margin-top: 4px;
  cursor: pointer;
}

.expande {
  height: auto;
}
.close {
  height: 64px;
  overflow: hidden;
}
.text-span {
  color: var(--neutral8);
}
</style>
