<template>
  <div>
    <!-- 章节 -->
    <div class="chapter-content" v-if="chapterData.node_type === 1">
      <div class="chapter-name-wrapper" @click="chapterClick(chapterData)">
        <cb-iconfont
          v-if="!chapterData.checked"
          :size="14"
          type="icon-xiala"
          color="var(--neutral6)"
        ></cb-iconfont>
        <cb-iconfont
          v-if="chapterData.checked"
          :size="14"
          type="icon-control"
          color="var(--neutral6)"
        ></cb-iconfont>
        <div
          class="chapter-name"
          :title="
            $t('m.theFirst') +
            (chapterData.type_index || '-') +
            $t('m.chapter') +
            ' ' +
            (chapterData.name || '-')
          "
        >
          {{
            $t('m.theFirst') +
            (chapterData.type_index || '-') +
            $t('m.chapter') +
            ' ' +
            (chapterData.name || '-')
          }}
          <!-- <span>{{ $t('m.theFirst') }}</span>
          <span>{{ chapterData.type_index || '-' }}</span>
          <span>{{ $t('m.chapter') }}</span>
          <span>{{ chapterData.name || '-' }}</span> -->
        </div>
        <!-- <div class="captor-progress">
          {{ captorProgress(chapterData) }}
        </div> -->
      </div>
      <template
        v-if="
          chapterData.checked &&
          chapterData.children &&
          chapterData.children.length
        "
      >
        <div class="chapter-child-content">
          <div
            class="chapter-child-item"
            v-for="item in chapterData.children"
            :key="item.resource_id"
          >
            <!-- 章节递归 -->
            <chapter-lesson
              :node-index="nodeIndex"
              :chapter-data="item"
              v-if="item.node_type === 1"
            ></chapter-lesson>
            <!-- 课时 -->
            <lesson
              :item="item"
              v-if="item.node_type === 2"
              :no-background="true"
            >
            </lesson>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import Lesson from './lesson';
export default {
  components: {
    Lesson,
  },
  props: {
    nodeIndex: {
      type: Number,
      default: 0,
    },
    chapterData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    // 章节标题点击
    chapterClick(itemData) {
      itemData.checked = !itemData.checked;
      /* itemData.children.forEach((item) => {
        if (item.resource_id != itemData.resource_id) {
          if (item.node_type === 1) {
            item.checked = false;
          }
        } else {
          item.checked = !item.checked;
        }
      }); */
      this.$nextTick(() => {
        const lineElement = document.querySelector(
          `.mainAxisLine${this.nodeIndex}`,
        );
        const downElement = document.querySelector(
          `.courseDownContent${this.nodeIndex}`,
        );
        lineElement.style.height = downElement.offsetHeight + 'px';
      });
    },

    // 章节进度
    captorProgress(item) {
      if (item.children.length) {
        let finishedAll = 0;
        item.children.forEach((value) => {
          if (value.learn === 100) {
            finishedAll++;
          }
        });
        return `${finishedAll}/${item.children.length}`;
      } else {
        return '';
      }
    },
  },
};
</script>
<style scoped lang="scss">
@mixin ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chapter-content {
  .chapter-name-wrapper {
    display: flex;
    font-size: 16px;
    color: var(--neutral8);
    align-items: center;
    padding: 4px 12px;
    margin-bottom: 4px;
    border-radius: 4px;
    background-color: var(--neutral0);
    position: relative;
    cursor: pointer;
    .chapter-name {
      margin-left: 8px;
      font-weight: 600;
      width: calc(100% - 25px);
      @include ellipsis;
    }
    /* .captor-progress {
      position: absolute;
      top: 6px;
      right: 12px;
      font-size: 14px;
      color: var(--neutral6);
    } */
  }
  .chapter-child-content {
    padding-left: 22px;
    background-color: var(--bg-color-3);
  }
}
</style>
