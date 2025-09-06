<template>
  <div class="info-content">
    <div class="user-title">
      <top-title
        :name="$t('learningStatistics.personalInformation')"
      ></top-title>
    </div>
    <div class="user-footer">
      <div class="user">
        <img
          class="showImg"
          :src="userData.avatar ? userData.avatar : defaultImg"
        />
      </div>
      <div class="info">
        <div class="info-item">
          <label class="mr10">
            <span class="mr10 iconfont iconuser"></span>
            <span>{{ $t('m.Account') }}:</span>
          </label>
          <!-- 账号 -->
          <span> {{ userData.username }}</span>
        </div>
        <div class="info-item">
          <label class="mr10">
            <span class="mr10 iconfont iconname"></span>
            <span>{{ $t('m.name') }}:</span>
          </label>
          <!-- <span> {{ userData.rep_name }}</span>
           -->
          <!-- 姓名 -->
          <span> {{ userData.name }}</span>
        </div>
        <div class="info-item">
          <label class="mr10">
            <span class="mr10 iconfont iconjueseguanli"></span>
            <!-- 角色 -->
            <span>{{ $t('m.role') }}:</span>
          </label>
          <span v-if="userData.role">
            {{ userData.role }}
          </span>
        </div>
        <!-- 组织 -->
        <div class="info-item">
          <label class="mr10">
            <span class="mr10 iconfont iconorganization"></span>
            <span>{{ $t('m.organization') }}:</span>
          </label>
          <span>
            {{ userData.organization_data }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import topTitle from '@/components/Title/index.vue';
export default {
  components: {
    topTitle,
  },
  props: {
    userData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      defaultImg: require('@/assets/img/avatar.png').default,
    };
  },
  watch: {},
  methods: {},
};
</script>
<style scoped lang="scss">
.info-content {
  width: 100%;
  height: 220px;
  padding: 10px 20px 20px;
  display: flex;
  flex-direction: column;
  background: var(--bg-color-2);
  .user-title {
    width: 100%;
  }
  .user-footer {
    display: flex;
    flex: 1;
    height: 0;
    .user {
      width: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
      .showImg {
        width: 120px;
        height: 120px;
        border-radius: 50%;
      }
    }
    .info {
      color: inherit;
      flex: 1;
      width: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      box-sizing: border-box;
      .info-item {
        label,
        span {
          font-size: 14px;
          font-weight: 400;
          color: var(--neutral8);
        }
      }
    }
  }
  .radar {
    width: 50%;
    height: 220px;
  }
}
</style>
