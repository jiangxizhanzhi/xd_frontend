<template>
  <div class="scroll-table">
    <div class="header">
      <div
        class="thead"
        v-for="(item, i) in cols"
        :style="{
          width: width[i],
          textAlign: item.align || 'left',
        }"
        :key="uniqueId()"
      >
        {{ item.label }}
      </div>
    </div>
    <swiper class="body" :options="option" ref="swiperRef">
      <swiper-slide v-for="(item, index) in data" :key="uniqueId()">
        <div class="tr" :class="lineClass">
          <div
            v-for="(col, i) in cols"
            :style="{
              width: width[i],
            }"
            :key="uniqueId()"
          >
            <slot v-if="col.slot" :name="col.slot" :row="item" :index="index">
              {{ item[col.prop] }}
            </slot>
            <template v-else>
              <div
                class="cell"
                :style="{
                  textAlign: col.align || 'left',
                  ...cellStyle,
                }"
              >
                {{ item[col.prop] }}
              </div>
            </template>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import { computed, defineComponent, ref } from '@vue/composition-api';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
export default defineComponent({
  name: 'ScrollTable',
  components: { Swiper, SwiperSlide },
  props: {
    cols: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    option: {
      type: Object,
      default: () => ({
        direction: 'vertical',
        // loop: true,
        autoplay: true,
        slidesPerView: 4,
      }),
    },
    lineClass: String,
    cellStyle: Object,
  },
  setup(prop) {
    const swiperRef = ref(null);
    const width = computed(() => {
      let total = prop.cols.reduce((p, c) => {
        return p + (c.width ? 0 : c.label.length);
      }, 0);
      return prop.cols.map((col) => {
        return col.width || ((col.label.length / total) * 100).toFixed(2) + '%';
      });
    });
    const uniqueId = () => {
      return +new Date() + (Math.random() * 9999).toString();
    };

    return {
      uniqueId,
      swiperRef,
      width,
    };
  },
});
</script>
<style lang="scss" scoped>
.scroll-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: calc(100vw / 120);
  padding: 0 15px;
  .header {
    display: flex;
    // background: rgba(85, 183, 255, 0.1);

    .thead {
      padding: 0.625em 0.5em;
      font-size: 0.75em;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .body {
    flex: 1;
    height: 0;
    overflow: hidden;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    .tr {
      display: flex;
      align-items: center;
    }
    .cell {
      height: 100%;
      padding: 0.625em 0.5em;
      font-size: 0.75em;
      color: #ffffff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
<style lang="scss">
.scroll-table {
  .swiper-slide {
    margin-bottom: 8px;
    height: 32px !important;
  }
}
</style>
