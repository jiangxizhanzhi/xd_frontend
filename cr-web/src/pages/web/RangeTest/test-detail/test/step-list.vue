<template>
  <div
    class="right-combat"
    :class="showTask ? 'cssAnimate' : 'cssAnimateRight'"
  >
    <cb-scrollbar>
      <div v-if="showTask" class="content">
        <div class="head">
          <div>{{ $t('test.stepList') }}</div>
          <div
            :class="taskId === null ? 'disabled' : 'flow-simulation'"
            @click="flowEmulation"
          >
            <cb-iconfont
              :class="taskId === null ? 'disabled' : ''"
              type="icon-liuliangguanli"
            ></cb-iconfont>
            <span>{{ $t('test.flowSimulation') }}</span>
          </div>
        </div>
        <div class="step-area">
          <div v-for="(item, index) in listData" :key="index" class="step">
            <div class="title" @click="showStep(item)">
              <span v-if="item.status == '0'" class="no-start">{{
                $t('test.notStart')
              }}</span>
              <span v-else-if="item.status == '1'" class="testing">{{
                $t('test.testing')
              }}</span>
              <span v-else-if="item.status == '2'" class="finshed">{{
                $t('test.completed')
              }}</span>
              <span v-else class="testing">{{ $t('test.notFinish') }}</span>
              <span>{{ $t('test.step') }}{{ item.stage }}</span>
            </div>
            <div v-if="item.show" class="operation-area">
              <p>{{ item.title }}</p>
              <p class="text">{{ item.process }}</p>
              <p class="button">
                <span
                  class="start-button"
                  :class="
                    item.status == '0' && item.pre_step_status == '2'
                      ? ''
                      : 'disable'
                  "
                  @click="start(item, index)"
                  >{{ $t('test.startTest') }}</span
                >
                <span
                  class="finish-button"
                  :class="
                    item.status == '1' && item.pre_step_status == '2'
                      ? ''
                      : 'disable'
                  "
                  @click="finish(item, index)"
                  >{{ $t('test.completeTest') }}</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </cb-scrollbar>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'TrainTask',
  components: {},
  props: {
    taskLists: {
      type: Array,
      default: () => [],
    },
    // trainDescription: {
    //   type: Object,
    //   default: () => {},
    // },
    // sceneId: {
    //   type: String,
    //   default: '',
    // },
  },
  data() {
    return {
      mpSceneId: '',
      templateId: '',
      taskId: '',
      showTask: true,
      resource_id: '',
      stepOpen: '',
      listData: [],
    };
  },
  computed: {
    ...mapGetters(['theme']),
  },
  watch: {},
  created() {
    this.templateId = this.$route.params && this.$route.params.templateId;
  },
  mounted() {
    // this.getStepList();
  },
  methods: {
    start(item) {
      this.$request
        .post(
          '/cr/eval/task/step/start',
          {
            step_id: item.step_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.getStepList();
          this.$emit('updateTimeLine');
        });
    },
    //点击完成
    finish(item, index) {
      this.$request
        .post(
          '/cr/eval/task/step/finish',
          {
            step_id: item.step_id,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.getStepList();
          this.$emit('updateTimeLine');
        });
    },
    getStepList() {
      const params = {};
      params.template_id = this.templateId;
      if (this.taskId) {
        params.task_id = this.taskId;
      }
      this.$request
        .get('/cr/eval/task/step/list', params, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          const data = _.get(res, 'data.data'); //status: 0-未开始 1-测试中 2-已完成
          this.listData = data.map((v) => {
            return { ...v, show: true };
          });
        });
    },
    showTaskPanel() {
      this.showTask = !this.showTask;
    },
    showStep(item) {
      // item.show = !item.show;
    },

    // 流量仿真
    flowEmulation() {
      this.$router.push({
        name: 'flow-emulation',
        params: {
          templateId: this.templateId,
          mpSceneId: this.mpSceneId,
          taskId: this.taskId,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.cssAnimate {
  width: 22%;
  //min-width: 400px;
  transition: all 0.5s ease;
}
.cssAnimateRight {
  width: 1px;
  transition: all 0.5s ease;
}
.right-combat {
  height: 100%;
  background: var(--bg-color-2);
  position: absolute;
  right: 0;
  z-index: 2;
  .btn-left {
    cursor: pointer;
    width: 20px;
    height: 50px;
    border-radius: 2px 0 0 2px;
    line-height: 50px;
    text-align: center;
    position: absolute;
    top: 34px;
    left: -20px;
    z-index: 10;
    svg {
      font-size: 12px !important;
    }
  }
  .content {
    height: 100%;
    padding: 15px 10px 15px 15px;
    .head {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      .flow-simulation {
        color: var(--primary-color);
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .disabled {
        color: var(--neutral4);
        pointer-events: none;
      }
    }
    .step-area {
      // height: 90%;
      p {
        word-break: break-all;
      }
    }
    .step {
      background: var(--bg-color-3);
      font-size: 14px;
      margin-top: 8px;
      color: var(--neutral8);
      .title {
        padding: 12px 5px 1px 15px;
        cursor: pointer;
        .no-start {
          border: 1px solid var(--neutral3);
          color: var(--neutral4);
          font-size: 12px;
          margin-right: 8px;
          padding: 3px 6px;
          background: var(--neutral0);
        }
        .testing {
          height: 20px;
          border: 1px solid var(--primary-color);
          color: var(--primary-color);
          font-size: 12px;
          margin-right: 8px;
          padding: 3px 6px;
          background: var(--primary-color-2);
        }
        .finshed {
          height: 20px;
          border: 1px solid var(--green-color);
          color: var(--green-color);
          font-size: 12px;
          margin-right: 8px;
          padding: 3px 6px;
          background: var(--green-color-2);
        }
      }
      .operation-area {
        padding: 15px;
      }
    }
    .text {
      margin-top: 10px;
    }
    .button {
      color: var(--primary-color);
      margin-top: 15px;
      .start-button {
        cursor: pointer;
      }
      .finish-button {
        margin-left: 20px;
        cursor: pointer;
      }
      .disable {
        color: var(--neutral4);
        pointer-events: none;
      }
    }
  }
}
</style>
