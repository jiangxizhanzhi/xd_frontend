<template>
  <div class="course-card-wrapper" v-if="courseListData.length">
    <div class="card" v-for="(item, index) in courseListData" :key="index" @click="goToDetail(item)">
      <img class="logo" :src="item.logo" alt="" />
      <div class="detail-top-info">
        <span class="name">{{item.name}}</span>
        <span class="student-num">已学习{{item.student_num}}人</span>
      </div>
      <div class="detail-bottom-info">
        <span class="lesson-count">共计{{item.lesson_count}}节</span>
        <span class="course-duration">{{item.course_duration}}小时</span>
      </div>
    </div>
  </div>
</template>

<script>
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
  },
  setup(props, {emit}) {
    return {}
  },
  methods: {
    goToDetail(data) {
      this.$emit('detail', data);
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
  .card {
    flex: 0 0 calc(25% - 12px);
    height: 290px;
    background: var(--bg-color-3);
    cursor: pointer;
    &:hover {
      //transform: scale(1.005);
      //transition: 0.3s;
      color: var(--primary-color);
    }
    .logo {
      height: 220px;
      width: 100%;
      border-radius: 6px;
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
  }
}
</style>
