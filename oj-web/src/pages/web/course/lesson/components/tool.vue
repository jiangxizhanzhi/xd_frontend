<template>
  <div class="lesson-tool">
    <div class="favorite-star fl cursor" @click="lessonCollect">
      <cb-iconfont
        :type="
          lessonData.is_collection ? 'icon-yishoucang' : 'icon-weishoucang'
        "
        themedColor="orange-color"
        size="16"
      />
      <span>
        <template v-if="lessonData.is_collection">{{
          $t('m.collected')
        }}</template>
        <template v-else>{{ $t('m.collect') }}</template></span
      >
    </div>
    <div class="line fl">
      <cb-button
        v-if="lessonData.pre"
        hollow="hollow"
        icon="icon-arrow_left"
        mr="mr"
        @click="prev()"
      >
        {{ $t('m.previousSection') }}
      </cb-button>
      <cb-button
        v-if="lessonData.next"
        hollow="hollow"
        icon="icon-arrow_right"
        ml="ml"
        @click="next()"
      >
        {{ $t('m.nextSection') }}
      </cb-button>
    </div>
    <!-- <div class="line fl" v-if="lessonData.prev || lessonData.next"></div> -->
    <div class="single-double-tabs fl">
      <div class="trainTabs">
        <cb-radio-group v-model="activeName" size="medium">
          <cb-radio-button label="single">
            <cb-iconfont type="icon-danping"></cb-iconfont>
            <span> &nbsp;{{ $t('m.singleScreen') }}&nbsp;&nbsp;</span>
          </cb-radio-button>
          <cb-radio-button label="double">
            <cb-iconfont type="icon-shuangping"></cb-iconfont>
            <span> {{ $t('m.dualScreen') }}</span>
          </cb-radio-button>
        </cb-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
import GradientRadius from '@/components/button/gradient-radius';
export default {
  name: 'Tool',
  components: {
    GradientRadius,
  },
  props: {
    lessonData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isCollect: false,
      activeName: 'double', // single double
      resourceId: '',
      lessonId: '',
    };
  },
  watch: {
    activeName: {
      handler(val, oldval) {
        this.$emit('tab-change', val);
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.resourceId = this.$route.params && this.$route.params.resource_id;
    this.lessonId = this.$route.params && this.$route.params.lesson_id;
  },
  methods: {
    lessonCollect() {
      this.$request
        .post(
          '/oj/collection',
          {
            business_id: this.lessonId,
            business_type: 4,
            is_collection: !this.lessonData.is_collection,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.lessonData.is_collection = !this.lessonData.is_collection;
        });
    },
    prev() {
      const lessonId = this.lessonData.pre;
      if (this.$route.path.indexOf('all-course') != -1) {
        this.$router.push({
          path: `/all-course/lesson/${this.resourceId}/${lessonId}/`,
        });
      } else if (this.$route.path.indexOf('knowledge-course') != -1) {
        this.$router.push({
          path: `/knowledge-course/lesson/${this.resourceId}/${lessonId}/`,
        });
      } else {
        this.$router.push({
          path: `/course/lesson/${this.resourceId}/${lessonId}/`,
        });
      }
      // this.$router.go(0)
    },
    next() {
      const lessonId = this.lessonData.next;
      if (this.$route.path.indexOf('all-course') != -1) {
        this.$router.push({
          path: `/all-course/lesson/${this.resourceId}/${lessonId}/`,
        });
      } else if (this.$route.path.indexOf('knowledge-course') != -1) {
        this.$router.push({
          path: `/knowledge-course/lesson/${this.resourceId}/${lessonId}/`,
        });
      } else {
        this.$router.push({
          path: `/course/lesson/${this.resourceId}/${lessonId}/`,
        });
      }
      // this.$router.go(0)
    },
  },
};
</script>

<style scoped lang="scss">
.lesson-tool {
  height: 36px;
  line-height: 35px;
  display: flex;
  align-items: center;
  .favorite-star {
    margin-right: 10px;
    .cb-iconfont {
      margin-right: 10px;
    }
    span {
      font-size: 14px;
    }
  }
  .line {
    display: flex;
    margin: 0 20px;
    vertical-align: middle;
  }
  .prev {
    margin-right: 10px;
  }
  .single-double-tabs {
    min-width: 200px;
  }
  .primary-color-tab {
    color: var(--primary-color);
  }
  .font-color-primary-tab {
    color: var(--neutral8);
  }
}
</style>
