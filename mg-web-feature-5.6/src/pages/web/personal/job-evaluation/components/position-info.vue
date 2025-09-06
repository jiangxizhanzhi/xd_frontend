<template>
  <div class="position-detail">
    <div class="row-content">
      <div class="img">
        <img :src="user.avatar ? user.avatar : defaultAvatar" alt="" />
        <div class="info">
          <div>{{ user && user.name }}</div>
          <div>
            <span
              v-for="(item, index) in getLastList()"
              :key="index + Math.random()"
            >
              <span v-show="index">/</span>
              <span>{{ item }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="row-content">
      <div class="info">
        <label>{{ $t('personal.positionRoleDegree') }}：</label>
        <span>{{ positionData && positionData.percent }}%</span>
      </div>
    </div>
    <div class="row-content">
      <div class="info">
        <label>{{ $t('personal.positionRole') }}：</label>
        <span>{{ positionData && positionData.name }}</span>
      </div>
    </div>
    <div class="row-content">
      <div class="info">
        <span class="des" :title="positionData && positionData.description"
          ><label>{{ $t('personal.positionRoleDesc') }}：</label
          >{{ positionData && positionData.description }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import defaultAvatar from '@/assets/default-avatar.png';

export default {
  props: {
    positionData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      defaultAvatar,
      user: {},
    };
  },
  watch: {
    user(value) {
      if (value) {
      }
    },
  },
  mounted() {
    this.user = this.$store.state.user;
  },
  methods: {
    getLastList() {
      let arr = Object.keys(this.user);
      if (arr.length) {
        return this.getLastOrgList(this.user);
      }
    },
    getLastOrgList(data) {
      let arrTmp = [],
        orgList = data.orgpaths;
      if (orgList.length > 0) {
        arrTmp = orgList[orgList.length - 1];
      }
      return arrTmp;
    },
  },
};
</script>

<style lang="scss" scoped>
.position-detail {
  font-size: 14px;
  .row-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
    margin-right: 20px;
    line-height: 24px;
    .img {
      display: flex;
      img {
        width: 50px;
        height: 50px;
        border-radius: 25px;
        display: block;
      }
      .info {
        span {
          font-size: 16px;
          line-height: 24px;
        }
      }
    }
  }
}
.des {
  display: inline;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 10;
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
.position-detail {
  .info {
    label {
      color: var(--neutral5);
    }
  }
}
</style>
