<template>
  <div class="dynamic cyber-scroll-bar-small">
    <ul v-if="dynamicData.length > 0">
      <li
        v-for="(dynamic, index) in dynamicData"
        :key="index"
        class="agile-detail"
      >
        <div class="wrapper-box">
          <div class="img-box">
            <img :src="dynamic.avatar" />
          </div>
          <div class="info-box">
            <div class="name-box one-overflow" :title="dynamic.user_realname">
              {{ dynamic.user_realname }}
            </div>
            <div class="content-box" :title="dynamic.content">
              {{ dynamic.content }}
            </div>
          </div>
          <div class="time">
            <span class="timecolor">{{
              convertTime(dynamic.op_mill_seconds_before)
            }}</span>
          </div>
        </div>
      </li>
    </ul>
    <no-data v-else></no-data>
  </div>
</template>

<script>
import NoData from '@/components/empty/index.vue';
export default {
  name: 'dynamicNews',
  components: { NoData },
  data() {
    return {
      dynamicData: [],
      clock: null,
      allUser: [],
    };
  },
  created() {
    this.getData();
    this.clock = setInterval(() => {
      this.getData();
    }, 30000);
  },
  methods: {
    getData() {
      this.$request
        .get(
          '/devops/log/operate/page',
          {
            per_page: 12,
            page: 1,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data.list', []);
          const userList = _.map(data, (item) => {
            return item.user_id;
          });
          this.allUser = _.uniq(userList);
          this.$request
            .post('/auth/users/no_restrict/by_ids', this.allUser, {
              baseURL: '/api/mp',
            })
            .then((res) => {
              const userData = _.get(res, 'data.data', []);
              _.forEach(data, (item) => {
                const filterData = _.find(userData, (user) => {
                  return user.id === item.user_id;
                });
                // find方法如果没有符合条件的元素就返回undefined
                if (filterData !== undefined) {
                  this.$set(item, 'avatar', filterData.avatar);
                }
              });
              this.dynamicData = data;
            });
        });
    },
    convertTime(value) {
      const passedTime = value;
      if (passedTime > 3600 * 1000) {
        const hour = parseInt(passedTime / (3600 * 1000));
        if (hour > 24) {
          return parseInt(hour / 24) + this.$t('dashboard.dayAgo');
        }
        return hour + this.$t('dashboard.hour');
      } else if (passedTime > 60 * 1000) {
        return (
          parseInt(passedTime / (60 * 1000)) + this.$t('dashboard.minutes')
        );
      } else {
        return parseInt(passedTime / 1000) + this.$t('dashboard.seconds');
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.clock);
  },
};
</script>
<style lang="scss" scoped>
@import '@/style/dashboard/components/dynamic-news.scss';
.dynamic {
  padding: 0 8px 0 0;
  height: calc(100% - 19px);
  overflow-y: auto;
  position: relative;
  ul {
    padding-inline-start: 10px;
    padding-inline-end: 10px;
    max-width: 475px;
    padding-left: 0;
    margin: 0;
    li {
      padding: 16px 8px;
      font-size: 14px;
      list-style: none;

      &:last-child {
        margin-bottom: 0;
      }
      .agile-detail {
        height: 20px;
        width: 80px;
        margin-left: 20px;
        display: flex;
        justify-content: flex-end;
      }
      .wrapper-box {
        position: relative;
        display: flex;
        .img-box {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 8px;
          background: var(--neutral0);
          border: 1px solid var(--neutral1);
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .info-box {
          width: calc(100% - 48px);
          .name-box {
            font-size: 14px;
            font-weight: 600;
            color: var(--neutral8);
            line-height: 22px;
          }
          .content-box {
            font-size: 14px;
            font-weight: 400;
            color: var(--neutral7);
            line-height: 22px;
          }
        }
        .time {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 12px;
        }
      }
    }
  }
}
.pagebottom {
  margin-top: 30px;
}
</style>
