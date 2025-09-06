<template>
  <div class="dynamic_div">
    <Header :level="1" title="训练动态" />
    <div class="dynamic flex-fill-col">
      <transition-group name="addFirst">
        <div
          class="dynamic-item"
          v-for="item in DynamicData"
          :key="item.action_time"
        >
          <div class="state">
            <training-dynamic-header
              :type="item.action_type"
            ></training-dynamic-header>
          </div>
          <div class="more-info">
            <div class="more-info-contain">
              <!-- 下发|驳回 -->
              <div
                class="more-info-des"
                v-if="item.action_type == 1 || item.action_type == 5"
              >
                教员 {{ getState(item.action_type) }} {{ item.user }}
                <span>{{ item.mission_name }}</span>
              </div>
              <!-- 提交上报 -->
              <div class="more-info-des" v-else-if="item.action_type == 2">
                {{ item.user }} {{ getState(item.action_type) }}
                <span>{{ item.mission_name }}</span>
              </div>
              <!-- 成功 -->
              <div class="more-info-des" v-else>
                {{ item.user }} 完成
                <span>{{ item.mission_name }}</span>
              </div>
              <div class="more-info-time">
                {{ timeFormate(item.action_time) }}
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import Header from '../../components/header';
import TrainingDynamicHeader from './training-dynamic-header.vue';
import { traniningDynamic } from '@/api/screen-center-group';
import { onMounted, ref, computed } from '@vue/composition-api';
import ReconnectingWebSocket from 'reconnecting-websocket';

export default {
  name: 'AttackScore',
  components: {
    Header,
    TrainingDynamicHeader,
  },
  props: {},
  computed: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {},
  setup() {
    const timeFormate = computed(() => {
      return function (time) {
        // 2021-09-11T09:56:49.016555
        let Date = '';
        if (time.indexOf('T') != -1) {
          Date = `${time.split('T')[0]} ${time.split('T')[1].split('.')[0]}`;
        } else {
          Date = `${time.split('.')[0]}`;
        }
        return Date;
      };
    });
    const DynamicData = ref([]);
    const getData = () => {
      traniningDynamic(
        '/training_team/v/training_trends/',
        'fef94844f63be6a40ec118430fe2e901',
      ).then((res) => {
        res.data.forEach((element, index) => {
          if (index < 3) {
            DynamicData.value.push(element);
          }
        });
      });
    };
    onMounted(() => {
      getData();
      const room_id = 'b21a7d72756fa5b828edd4433194ff33';
      const rws = new ReconnectingWebSocket(
        `ws://${location.host}/api/cr/ws/training_team/training_team_trend/${room_id}/`,
      );
      rws.addEventListener('open', () => {
        console.log('连接成功');
      });

      rws.addEventListener('message', (e) => {
        if (e.data) {
          const message = JSON.parse(e.data);
          DynamicData.value.unshift(JSON.parse(e.data));
          DynamicData.value.length > 3 && DynamicData.value.pop();
        }
      });
    });

    const getState = (type) => {
      let state = '成功';
      switch (type) {
        case 1:
          state = '下发';
          break;
        case 2:
          // 待审核
          state = '提交';
          break;
        case 3:
          state = '成功';
          break;
        case 4:
          state = '失败';
          break;
        case 5:
          state = '驳回';
          break;
        default:
          break;
      }
      return state;
    };

    function add() {
      DynamicData.value.unshift({
        user: 'red_user',
        action_type: 2,
        action_time: '2021-09-29 09:33:18',
        mission_name: '你好',
      });
      DynamicData.value.length >= 3 && DynamicData.value.pop();
    }
    return {
      DynamicData,
      getState,
      timeFormate,
      add,
    };
  },
};
</script>

<style scoped lang="scss">
.dynamic_div {
  flex: 1.5;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .dynamic {
    height: calc(100% - 40px - var(--header-2-content-space));
    overflow: hidden;

    .dynamic-item {
      &:nth-child(2n) {
        background: var(--train-bg-color);
      }
      display: flex;
      height: 33%;
      align-content: space-between;
      .state {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25%;
      }
      .more-info {
        width: 75%;
        display: flex;
        align-items: center;
        .more-info-contain {
          width: 100%;
          .more-info-des {
            width: 100%;
            font-size: var(--font-size-12);
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            & > span {
              font-weight: normal;
            }
          }
          .more-info-time {
            margin-top: 5px;
            color: var(--train-font-color);
            font-size: 12px;
            text-shadow: 0px 0px 9px var(--train-font-color);
          }
        }
      }
    }
  }
}
</style>
