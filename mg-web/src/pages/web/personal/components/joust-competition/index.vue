<template>
  <div class="contest-overview-page">
    <Block :title="$t('personal.contestStatistic')">
      <cb-row :gutter="24">
        <cb-col :span="24">
          <div class="data-box">
            <!-- 荣耀时刻 -->
            <div class="glory-box">
              <div class="title">
                {{ $t('personal.contestOverview.gloryMoment') }}
              </div>
              <div class="content-box">
                <div
                  :class="[
                    'rank-box',
                    {
                      'rank-box-t36':
                        item.key === 'silver' || item.key === 'bronze',
                    },
                  ]"
                  v-for="item in rankList"
                  :key="item.key"
                >
                  <img :src="item.img" alt="" />
                  <div class="times-tip">
                    {{ $t('personal.contestOverview.get')
                    }}<span>{{ item.times }}</span
                    >{{ $t('personal.contestOverview.times') }}
                  </div>
                </div>
              </div>
              <div class="glory-info-box">
                <div class="title-box duration-box">
                  <cb-iconfont
                    style="margin-right: 4px"
                    themedColor="--neutral9"
                    type="icon-lishizuijinshijian"
                    :size="18"
                  ></cb-iconfont>
                  <div>
                    {{
                      $t('personal.contestOverview.contestDuration') +
                      $t('personal.contestOverview.colon')
                    }}<span
                      >{{ durationH }}
                      {{ $t('personal.contestOverview.hour') }}
                      {{ durationM }}
                      {{ $t('personal.contestOverview.minute') }}</span
                    >
                  </div>
                </div>
                <div class="title-box times-box">
                  <cb-iconfont
                    style="margin-right: 4px"
                    themedColor="--neutral9"
                    type="icon-saishiguanli"
                    :size="18"
                  ></cb-iconfont>
                  <div>
                    {{
                      $t('personal.contestOverview.contestTimes') +
                      $t('personal.contestOverview.colon')
                    }}<span
                      >{{ times }}
                      {{ $t('personal.contestOverview.times') }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- 竞赛类型分布 -->
            <div class="distribute-box">
              <div class="title">
                {{ $t('personal.contestOverview.contestTypeDistribute') }}
              </div>
              <div v-if="distributeData.length" class="chart-box">
                <contest-type-chart
                  :title="$t('personal.contestOverview.contestTypeNum')"
                  :dataList="distributeData"
                ></contest-type-chart>
              </div>
              <div v-else class="no-data">
                <div class="icon">
                  <cb-iconfont type="icon-zanwuziyuan" :size="56"></cb-iconfont>
                  <div>{{ $t('personal.noData') }}</div>
                </div>
              </div>
            </div>
          </div>
        </cb-col>
      </cb-row>
    </Block>
    <!-- list -->
    <div class="contest-task-list">
      <Block :title="$t('personal.contestOverview.listTitle')">
        <div class="contest-task-list-row">
          <cb-search-table
            ref="sdlRef"
            :thumb-card="{ number: 1, width: '100%' }"
            row-key="resource_id"
            :search-bar-bg="false"
            baseURL="/api/ct"
            url="/web/arena/arena/me/"
            :data.sync="query"
            :scroll="{ x: 1238 }"
          >
            <template v-slot:filter>
              <div class="select-style">
                <cb-select
                  v-model="query.category"
                  :options="contestOptionsList"
                  :first="{
                    label: $t('personal.contestOverview.allType'),
                    value: '',
                  }"
                ></cb-select>
                <cb-select
                  v-model="query.race_status"
                  :options="statusOptionsList"
                  :first="{
                    label: $t('personal.contestOverview.allStatus'),
                    value: '',
                  }"
                ></cb-select>
              </div>
            </template>
            <template v-slot:thumb="scope">
              <div class="content-card-wrapper">
                <div class="content-card">
                  <div
                    class="card-logo"
                    :style="{
                      'background-image': `url(${
                        categoryLogoMap[scope.data.race_type]
                      })`,
                    }"
                  >
                    <div class="contest-tag">
                      {{ contestOptionsMap[scope.data.race_type] }}
                    </div>
                  </div>
                  <div class="race-info">
                    <div class="race-name-wrapper">
                      <div class="race-name" :title="scope.data.name">
                        {{ scope.data.name }}
                      </div>
                      <div class="race-type">
                        {{ joinTypeOptions[scope.data.type] }}
                      </div>
                      <div
                        class="race-status contest-status"
                        :class="`contest-status-${scope.data.progress}`"
                      >
                        {{ contestStatusOptions[scope.data.progress] }}
                      </div>
                    </div>
                    <div class="race-time">
                      <span>
                        {{ $t('personal.myExam.startTime') + '：'
                        }}{{ scope.data.start_time }}</span
                      ><span style="margin-left: 12px">{{
                        $t('personal.contestOverview.contestDuration') + '：'
                      }}</span
                      ><span v-if="scope.data.duration.hour"
                        >{{ scope.data.duration.hour
                        }}{{ $t('personal.contestOverview.hour') }}</span
                      ><span v-if="scope.data.duration.minute"
                        >{{ scope.data.duration.minute
                        }}{{ $t('personal.contestOverview.minute') }}</span
                      >
                    </div>
                  </div>
                  <div class="race-rank">
                    <div class="race-score-wrapper">
                      <div class="race-name-wrapper">
                        <div class="race-name">
                          {{ scope.data.score || '-' }}
                        </div>
                        <div v-if="scope.data.score">
                          {{ $t('personal.contestOverview.score') }}
                        </div>
                      </div>
                      <div class="title">
                        <span>
                          {{ $t('personal.contestOverview.gameResult') }}</span
                        >
                      </div>
                    </div>
                    <div class="race-rank-wrapper">
                      <div class="race-name-wrapper">
                        <div v-if="scope.data.rank" class="race-name">
                          {{
                            $t('personal.contestOverview.rank', [
                              scope.data.rank,
                            ])
                          }}
                        </div>
                        <div v-else>-</div>
                      </div>
                      <div class="title">
                        <span>
                          {{ $t('personal.contestOverview.gameRank') }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <cb-button
                    loading
                    hollow
                    :disabled="scope.data.progress === 0"
                    @click="goToDetail(scope.data, $event)"
                    >{{ $t('personal.contestOverview.enterGame') }}</cb-button
                  >
                </div>
              </div>
            </template>
          </cb-search-table>
        </div>
      </Block>
    </div>
  </div>
</template>

<script>
import Block from '@/components/block';
import contestTypeChart from './contest-type-chart.vue';
import rank1Img from './assets/rank-1.png';
import rank2Img from './assets/rank-2.png';
import rank3Img from './assets/rank-3.png';
import itemLogoOperation from './assets/operation-default.png';
import itemLogoExam from './assets/theory-default.png';
import itemLogoFlag from './assets/flag-default.png';
import itemLogoAttack from './assets/attack-default.png';
import itemLogoCfs from './assets/cfs-default.png';
import itemLogoAwdp from './assets/awdp-default.png';
import itemLogoAi from './assets/ai-default.png';

export default {
  components: {
    contestTypeChart,
    Block,
  },
  data() {
    return {
      // glory
      rankList: [
        {
          key: 'silver',
          img: rank2Img,
          times: 0,
        },
        {
          key: 'golden',
          img: rank1Img,
          times: 0,
        },
        {
          key: 'bronze',
          img: rank3Img,
          times: 0,
        },
      ],
      durationH: 0,
      durationM: 0,
      times: 0,
      // 竞赛分布
      distributeData: [],
      // img
      rank1Img,
      rank2Img,
      rank3Img,
      // list
      listData: [],
      query: {
        category: '',
        race_status: '',
      },
      contestOptionsMap: {
        0: this.$t('personal.myExam.theoryContest'), // 理论赛
        1: this.$t('personal.myExam.Q_MContest'), // 运维赛
        2: this.$t('personal.myExam.CTFContest'), // 夺旗赛
        3: this.$t('personal.myExam.A_DContest'), // 攻防赛
        4: this.$t('personal.myExam.CFSContest'), // 渗透赛
        5: this.$t('personal.myExam.AWDPContest'), // 沙盒攻防赛
        8: this.$t('personal.myExam.AIContest'), // 攻防赛
      },
      joinTypeOptions: [
        this.$t('personal.contestOverview.joinPerson'), // 个人赛
        this.$t('personal.contestOverview.joinGroup'), // 团队赛
      ],
      contestStatusOptions: [
        this.$t('personal.contestOverview.unstart'), // 未开始
        this.$t('personal.contestOverview.ongoing'), // 进行中
        this.$t('personal.contestOverview.finished'), // 已结束
        this.$t('personal.contestOverview.paused'), // 暂停中
      ],
      categoryLogoMap: {
        0: itemLogoExam, // 理论赛
        1: itemLogoOperation, // 运维赛
        2: itemLogoFlag, // 夺旗赛
        3: itemLogoAttack, // 攻防赛
        4: itemLogoCfs, // 渗透赛
        5: itemLogoAwdp, // 沙盒攻防赛
        8: itemLogoAi, // 人工智能赛
      },
    };
  },
  computed: {
    contestOptionsList() {
      return Object.entries(this.contestOptionsMap).map(([value, label]) => {
        return {
          label,
          value: parseInt(value),
        };
      });
    },
    statusOptionsList() {
      return this.contestStatusOptions.map((item, index) => {
        return {
          label: item,
          value: index,
        };
      });
    },
  },
  mounted() {
    this.getGloryData();
    this.getStatisticData();
  },
  methods: {
    // 荣耀时刻
    getGloryData() {
      this.$request
        .get('/web/arena/arena/me/glory/', null, {
          baseURL: '/api/ct',
        })
        .then((res) => {
          const data = _.get(res, 'data.data', {});
          if (!_.isEmpty(data)) {
            for (let item in data) {
              this.rankList.forEach((rankItem) => {
                if (item === rankItem.key) {
                  rankItem.times = data[item];
                }
              });
            }
          }
        });
    },
    // 战绩
    getStatisticData() {
      this.$request
        .get('/web/arena/arena/me/statistic/', null, {
          baseURL: '/api/ct',
        })
        .then((res) => {
          const data = _.get(res, 'data.data', {});
          if (!_.isEmpty(data)) {
            this.durationH = data.duration_hour || 0;
            this.durationM = data.duration_min || 0;
            this.times = data.num || 0;
            let chartData = data.chart || [];
            if (chartData.length) {
              chartData.forEach((item) => {
                item.name = this.contestOptionsMap[item.race_type];
                item.value = item.num;
                item.num > 0 && this.distributeData.push(item);
              });
            }
          }
        });
    },
    goToDetail(item, done) {
      // console.log(item, 11111);
      let verifyUrl = '';
      let theoryIntroUrl = '';
      let href = '';
      switch (item.race_type) {
        case 0:
          verifyUrl =
            item.progress === 2
              ? `/web/theory_race/exam/review/?exam_id=${item.resource_id}`
              : `/web/theory_race/exam/enroll/?exam_id=${item.resource_id}`;
          theoryIntroUrl =
            item.progress === 2
              ? ''
              : `/web/theory_race/exam/introduce/?exam_id=${item.resource_id}`;
          href =
            item.progress === 2
              ? `${location.origin}/page/mg/ct/contest/exam-review/${item.resource_id}`
              : `${location.origin}/page/mg/ct/contest/exam-guid/${item.resource_id}`;
          break;
        case 1:
          verifyUrl = `web/ops_race/race/${item.resource_id}/enroll/`;
          href = `${location.origin}/page/ct/contest/operation/${item.resource_id}/GuidePage`;
          break;
        case 2:
          verifyUrl = `/web/jeopardy_race/race/${item.resource_id}/enroll/`;
          href = `${location.origin}/page/ct/contest/flag/${item.resource_id}/GuidePage`;
          break;
        case 3:
          verifyUrl = `/web/awd_race/race/${item.resource_id}/enroll/`;
          href = `${location.origin}/page/ct/contest/attack-defense/${item.resource_id}/GuidePage`;
          break;
        case 4:
          verifyUrl = `web/cfs_race/race/${item.resource_id}/enroll/`;
          href = `${location.origin}/page/ct/contest/cfs/${item.resource_id}/GuidePage`;
          break;
        case 5:
          verifyUrl = `web/awdp_race/race/${item.resource_id}/enroll/`;
          href = `${location.origin}/page/ct/contest/awdp/${item.resource_id}/GuidePage`;
          break;
        case 8:
          verifyUrl = `web/ai_race/race/${item.resource_id}/enroll/`;
          href = `${location.origin}/page/ct/contest/ai/${item.resource_id}/GuidePage`;
          break;
      }
      this.$request
        .get(verifyUrl, null, { baseURL: '/api/ct' })
        .then((res) => {
          if (theoryIntroUrl) {
            this.$request
              .get(theoryIntroUrl, null, { baseURL: '/api/ct' })
              .then((res) => {
                window.open(href, '_blank');
              });
          } else {
            window.open(href, '_blank');
          }
        })
        .finally(() => {
          done();
        });
    },
  },
};
</script>

<style scoped lang="scss">
.contest-overview-page {
  padding-top: 16px;
  .cb-block {
    ::v-deep .cb-block-title-container {
      margin-bottom: 12px !important;
    }
  }
  .data-box {
    display: flex;
    width: 100%;
    height: 330px;

    .glory-box,
    .distribute-box {
      background: var(--bg-color-3);
      .title {
        padding-left: 16px;
        line-height: 48px;
        font-size: 14px;
        color: var(--neutral8);
      }
    }
    // 荣耀
    .glory-box {
      margin-right: 16px;
      padding-bottom: 40px;
      width: 54%;
      height: 100%;
      .title {
        margin-bottom: 0px;
      }
      .content-box {
        display: flex;
        justify-content: space-between;
        margin: 0 auto 22px auto;
        width: 90%;
        height: calc(100% - 48px - 24px - 20px);
        .rank-box {
          // outline: 1px solid pink;
          width: 33%;
          max-width: 142px;
          &-t36 {
            margin-top: 36px;
          }
          img {
            display: block;
            margin-bottom: 14px;
            width: 100%;
            // height: 60%;
          }
          .times-tip {
            width: 100%;
            text-align: center;
            line-height: 22px;
            font-size: 14px;
            color: var(--neutral7);
            span {
              display: inline-block;
              margin: 0 6px;
              font-size: 16px;
              color: var(--neutral8);
              line-height: 24px;
            }
          }
        }
      }
      .glory-info-box {
        display: flex;
        justify-content: center;
        width: 94%;
        margin: 0 auto;
        .duration-box {
          margin-right: 12px;
        }
        .times-box {
          margin-left: 12px;
        }
        .title-box {
          display: flex;
          align-items: center;
          line-height: 24px;
          font-size: 16px;
          color: var(--neutral7);
          span {
            color: var(--neutral7);
          }
        }
      }
    }
    // 类型分布
    .distribute-box {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 48%;
      height: 100%;
      .chart-box {
        position: absolute;
        left: 0;
        right: 0;
        top: 24px;
        bottom: 24px;
      }
    }
  }
  // 列表
  .contest-task-list {
    margin-top: 24px;

    .contest-status {
      border-radius: 2px;
      &-0 {
        color: var(--green-color);
        background: var(--green-color-2);
      }
      &-1 {
        color: var(--primary-color);
        background: var(--primary-color-2);
      }
      &-2 {
        color: var(--neutral4);
        background: var(--neutral0);
      }
      &-3 {
        color: var(--orange-color);
        background: var(--orange-color-2);
      }
    }
  }
  .no-data {
    width: 100%;
    height: 100%;
    position: relative;
    min-height: 100px;
    .icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .content-card-wrapper {
    height: 86px;
    padding: 12px 16px 0 16px;
    background: var(--bg-color-3);
    position: relative;
    box-sizing: content-box;
    .content-card {
      position: absolute;
      height: calc(100% - 12px);
      padding-bottom: 12px;
      left: 16px;
      right: 16px;
      border-bottom: 1px solid var(--neutral1);
      display: flex;
      align-items: center;
      justify-content: space-around;
      .card-logo {
        width: 112px;
        height: 74px;
        background-repeat: no-repeat;
        background-size: cover;
        position: relative;
        flex: none;
        .contest-tag {
          position: absolute;
          top: 0;
          left: 0;
          padding: 2px 4px;
          box-sizing: border-box;
          background: var(--neutral1);
          font-size: 12px;
          font-weight: 400;
          color: var(--white-color);
        }
      }
      .race-info {
        flex: 1;
        margin-left: 16px;
        .race-name-wrapper {
          display: flex;
          align-items: center;
          line-height: 22px;
          margin-bottom: 8px;
          .race-name {
            max-width: 250px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--neutral8);
            font-size: 14px;
            font-weight: 600;
          }
          .race-type {
            font-size: 14px;
            color: var(--neutral8);
            font-weight: 600;
            margin-left: 4px;
          }
          .race-status {
            font-size: 12px;
            padding: 2px 8px;
            margin-left: 8px;
          }
        }
        .race-time {
          font-size: 12px;
          color: var(--neutral8);
        }
      }
      .race-rank {
        margin: 0 24px 0 24px;
        display: flex;
        .race-rank-wrapper {
          margin: 0 8px;
          min-width: 56px;
        }
        .race-score-wrapper {
          margin: 0 16px;
          min-width: 40px;
        }
        .race-name-wrapper {
          display: flex;
          align-items: center;
          line-height: 24px;
          margin-bottom: 8px;
          .race-name {
            white-space: nowrap;
            color: var(--neutral8);
            font-size: 16px;
            font-weight: 600;
          }
        }
        .title {
          font-size: 12px;
          color: var(--neutral5);
        }
      }
    }
  }
  .contest-task-list-row {
    position: relative;
  }
  .select-style {
    position: absolute;
    right: -8px;
    top: -40px;
  }
}
@media screen and (min-width: 1800px) {
  .race-info {
    .race-name-wrapper {
      .race-name {
        max-width: 640px !important;
      }
    }
  }
}
</style>
