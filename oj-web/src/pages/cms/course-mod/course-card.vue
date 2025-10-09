<template>
  <div class="course-card-wrapper" v-if="courseListData.length">
    <div
      class="card"
      v-for="(item, index) in courseListData"
      :key="index + item.resource_id"
      @mouseover="mouseover(item.resource_id)"
      @mouseleave="mouseleave"
      @click="goToDetail(item)"
    >
      <div class="img-box">
      <img class="logo" :src="item.logo || defaultPic" alt="" />
      </div>
      <div class="detail-top-info">
        <span class="name">{{item.name}}</span>
        <span class="student-num">已学习{{item.student_num}}人</span>
      </div>
      <div class="detail-bottom-info">
        <span class="lesson-count">
          <cb-iconfont type="icon-liebiao" size="18" themed-color="var(--neutral4)" />
          共计{{item.lesson_count}}节
        </span>
        <span class="course-duration">
          <cb-iconfont type="icon-xuexitongji" size="18" themed-color="var(--neutral4)" />
          {{item.course_duration}}小时
        </span>
      </div>
      <!-- 编辑 删除图标 -->
      <transition name="el-fade-in" v-if="teacher_flag === 1">
        <div class="edit-delete-btn" v-show="item.resource_id === activeId">
          <div @click.stop="editItem(item)">
            <cb-iconfont type="icon-bianji" size="20" />
          </div>
          <div @click.stop="deleteItem(item)">
            <cb-iconfont type="icon-shanchu" size="20" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import defaultPic from '@/assets/img/course/default.png'
export default {
  name: "course-card",
  components: {},
  props: {
    courseListData: {
      type: Array,
      default: [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    teacher_flag: {
      type: Number,
      default: 1,
    },
  },
  setup(props, {emit}) {
    return {}
  },
  data() {
    return {
      activeId: '',
      defaultPic: defaultPic,
    }
  },
  methods: {
    goToDetail(data) {
      this.$emit('detail', data);
    },
    mouseover(id) {
      this.activeId = id;
    },
    mouseleave() {
      this.activeId = '';
    },
    editItem(data) {
      this.$emit('edit', data);
    },
    deleteItem(data) {
      this.$emit('delete', data);
    }
  }
}
</script>

<style scoped lang="scss">
.course-card-wrapper {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  //background-color: var(--bg-color-1);
  padding-top: 8px;
  padding-bottom: 8px;
  .card {
    position: relative;
    flex: 0 0 calc(25% - 12px);
    height: 290px;
    background: var(--bg-color-1);
    cursor: pointer;
    overflow: hidden;
    .img-box {
      height: 220px;
      width: 100%;
      overflow: hidden;
    }
    .logo {
      height: 100%;
      width: 100%;
      border-radius: 2px;
    }
    .detail-top-info {
      display: flex;
      justify-content: space-between;
      line-height: 2;
      padding: 0 16px;
      .name {
        font-size: 18px;
      }
      .student-num {
        color: var(--info-text);
      }
    }
    .detail-bottom-info {
      color: var(--info-text);
      padding: 0 16px;
      .course-duration {
        margin-left: 16px;
      }
    }
    &:hover {
      background: var(--bg-color-3);
      img {
        transform: scale(1.05);
        transition: all 0.5s ease;
      }
      .name {
        color: var(--primary-color);
      }
    }
    .edit-delete-btn {
      position: absolute;
      bottom: 6px;
      right: 16px;
      width: 60px;
      display: flex;
      justify-content: space-between;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
