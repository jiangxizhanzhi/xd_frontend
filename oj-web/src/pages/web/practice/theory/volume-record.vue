<template>
  <cb-inner-page :background="false">
    <div class="volume-record-wrapper">
      <div class="top-wrapper">
        <cb-select
          v-model="query.status"
          :options="statusLists"
          clearable
          :placeholder="$t('practice.allStatus')"
          @change="changeStatus"
          :first="{
            value: '',
            label: $t('practice.allStatus'),
          }"
        ></cb-select>
        <div class="right-title">
          <cb-iconfont
            type="icon-jinggao"
            class="mr5"
            size="14"
            themedColor="neutral4"
          />
          <span>{{ $t('practice.onlyLastVolumeRecord') }}</span>
        </div>
      </div>
      <div v-if="dataLists.length > 0" class="bottom-wrapper">
        <div
          v-for="(item, index) in dataLists"
          :key="index"
          class="item-detail"
        >
          <div class="left-line">
            <div class="line-top"></div>
            <div class="circle"></div>
            <div class="line"></div>
          </div>
          <div class="right-info">
            <div class="time">{{ item.time }}</div>
            <div class="card-wrapper">
              <div v-for="(itm, index) in item.summary_res" class="single-card">
                <VolumeRecordCard
                  :detailObj="itm"
                  @go-detail="goDetail"
                  @continue-practice="continuePractice"
                  @again-practice="againPractice"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-box" style="height: 240px">
        <Empty />
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
import VolumeRecordCard from './components/volume-record-card.vue';
import Empty from '@/components/empty/index.vue';
import { getRecordList, againVolume } from '@/api/practice.ts';

import { VOLUME_STATUS } from '../constant';
export default {
  name: 'VolumeRecord',
  components: {
    VolumeRecordCard,
    Empty,
  },
  data() {
    return {
      VOLUME_STATUS,
      query: {
        status: '',
      },
      statusLists: [
        {
          label: this.$t('m.completed'),
          value: VOLUME_STATUS.Finish,
        },
        {
          label: this.$t('practice.unfinished'),
          value: VOLUME_STATUS.NoFinish,
        },
      ],
      dataLists: [],
    };
  },
  created() {
    this.getRecordListTh();
  },
  methods: {
    // 获取记录列表
    getRecordListTh() {
      getRecordList({ is_finish: this.query.status }).then((res) => {
        const data = _.get(res, 'data.data');
        this.dataLists = data;
      });
    },
    changeStatus() {
      this.getRecordListTh();
    },
    // 进入详情
    goDetail(val) {
      this.$router.push({
        path: `/practice/volume-detail/${val.paper_id}`,
      });
    },
    // 继续练习
    continuePractice(val) {
      this.$router.push({
        path: `/practice/volume-exam/${val.paper_id}`,
        query: {
          from: 'volume-record',
        },
      });
    },
    againPractice(val) {
      againVolume({
        paper_id: val.paper_id,
      }).then((res) => {
        const data = _.get(res, 'data.data');
        this.$router.push({
          path: `/practice/volume-exam/${data.resource_id}`,
          query: {
            from: 'volume-record',
          },
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.volume-record-wrapper {
  padding: 16px;
  background: var(--bg-color-2);
  .top-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    .right-title {
      line-height: 32px;
      color: var(--neutral4);
      font-size: 12px;
    }
  }
  .bottom-wrapper {
    .item-detail {
      display: flex;

      .left-line {
        width: 24px;

        .line-top {
          height: 4px;
          border-left: 1px dashed var(--neutral5);
          margin-left: 5.5px;
        }
        .circle {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid var(--neutral5);
        }
        .line {
          border-left: 1px dashed var(--neutral5);
          height: calc(100% - 16px);
          margin-left: 5.5px;
        }
      }
      &:first-child {
        .line-top {
          height: 4px;
          border-left: 1px dashed transparent;
        }
      }
      .right-info {
        width: calc(100% - 24px);
        margin-bottom: 8px;
        .time {
          color: var(--neutral8);
          line-height: 22px;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .card-wrapper {
          display: flex;
          flex-wrap: wrap;

          .single-card {
            width: 310px;
            height: 196px;
            margin-right: 16px;
            margin-bottom: 8px;
          }
          // 1440屏幕
          @media screen and (max-width: 1440px) {
            .single-card {
              width: 300px;
              height: 196px;
              margin-right: 16px;
              margin-bottom: 8px;
            }
          }
        }
      }
      &:last-child {
        .line {
          display: none;
        }
      }
    }
  }
}
</style>
