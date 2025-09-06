<template>
  <div class="event-content">
    <!-- 事件模型弹框 -->
    <cb-dialog
      class="dialog-style"
      :title="$t('rbt.trafficEventAttackModel')"
      :visible.sync="sonEventVisible"
      center="center"
      @close="closeFn"
      height="600px"
      width="880px"
    >
      <div class="main-content">
        <cb-search-input
          @keyup.enter.native="getSearchName"
          v-model="search"
          :placeholder="$t('rbt.inputText')"
        ></cb-search-input>
        <div class="table-content">
          <div class="title">
            <div>{{ $t('rbt.attackType') }}</div>
            <div :class="language === 'en-US' ? 'flow-style-en' : 'flow-style'">
              {{ $t('rbt.trafficEventTypeAndLevel') }}
            </div>
          </div>
          <div class="title-content" v-for="item in this.eventModel">
            <!-- {{item}} -->
            <div :class="language === 'en-US' ? 'name-style-en' : 'name-style'">
              {{ item.attack_type }}
            </div>
            <div
              :class="
                language === 'en-US' ? 'right-content-en' : 'right-content'
              "
            >
              <div class="level-content" v-for="itme2 in item.flow_events">
                <span
                  :class="
                    search && itme2.flow_event_type.includes(search)
                      ? 'color-style'
                      : 'type-style'
                  "
                >
                  {{ itme2.flow_event_type }}</span
                >
                <span class="level-one" v-if="itme2.severity_desc == 1">
                  {{ $t('rbt.levelOne') }}
                </span>
                <span class="level-two" v-if="itme2.severity_desc == 2">
                  {{ $t('rbt.levelTwo') }}
                </span>
                <span class="level-three" v-if="itme2.severity_desc == 3">
                  {{ $t('rbt.levelThree') }}
                </span>
                <span class="level-four" v-if="itme2.severity_desc == 4">
                  {{ $t('rbt.levelFour') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import { getLanguage } from '@cyber/helper';
export default {
  props: {
    eventVisible: {
      type: Boolean,
      default: false,
    },
    eventModel: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      language: getLanguage(),
      search: '',
      sonEventVisible: this.eventVisible,
    };
  },
  created() {},
  mounted() {},
  methods: {
    closeFn() {
      this.$emit('eventVisibleChange', false);
      this.search = '';
    },
    getSearchName() {
      this.$nextTick(() => {
        document.getElementsByClassName('el-scrollbar__wrap')[0].scrollTop =
          document.getElementsByClassName('color-style')[0].offsetTop - 100;
      });
    },
  },
  watch: {
    eventVisible: {
      handler(val) {
        this.sonEventVisible = val;
      },
    },
  },
};
</script>

<style scoped lang="scss">
.event-content {
  .main-content {
    .table-content {
      .title {
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
        width: 100%;
        display: flex;
        background: var(--neutral1);
        font-size: 14px;
        margin-top: 16px;
        .flow-style {
          margin-left: 76px;
        }
        .flow-style-en {
          margin-left: 86px;
        }
      }
      .title-content {
        padding: 0 20px;
        display: flex;
        width: 100%;
        min-height: 57px;
        border-bottom: 1px solid var(--neutral1);
        .name-style {
          min-width: 74px;
          line-height: 57px;
          color: var(--neutral8);
          font-size: 14px;
        }
        .name-style-en {
          min-width: 147px;
          line-height: 57px;
          color: var(--neutral8);
          font-size: 14px;
        }
        .right-content {
          padding: 4px 0px;
          display: flex;
          flex-wrap: wrap;
          margin-left: 42px !important;
          margin: auto 0;
        }
        .right-content-en {
          padding: 4px 0px;
          display: flex;
          flex-wrap: wrap;
          margin: auto 0;
        }
        .level-content {
          margin-left: 24px;
          height: 32px;
          line-height: 32px;
          .level-one,
          .level-two,
          .level-three,
          .level-four {
            width: 33px;
            height: 22px;
            font-size: 12px;
            padding: 4px 8px;
          }
          .level-one {
            background: var(--red-color-2);
            color: var(--red-color);
          }
          .level-two {
            background: var(--orange-color-2);
            color: var(--orange-color);
          }
          .level-three {
            background: var(--yellow-color-2);
            color: var(--yellow-color);
          }
          .level-four {
            background: var(--primary-color-2);
            color: var(--primary-color);
          }
        }
      }
      .color-style {
        color: var(--primary-color);
      }
    }
  }
}
</style>
