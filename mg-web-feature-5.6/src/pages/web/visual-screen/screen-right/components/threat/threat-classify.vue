<template>
  <div class="flex-column">
    <Header :level="3" title="威胁分类" />
    <div class="threat flex-column">
      <div
        class="class-item flex-column"
        v-for="item in threatClass"
        :key="item.name"
      >
        <div class="class-des-contain">
          <div class="percent-count-before"></div>

          <div class="percent-count">{{ item.percent }}%</div>
        </div>

        <div class="class-process">
          <div class="class-des">{{ item.name }}</div>
          <!-- 最下面的div -->
          <div class="under-div">
            <!-- 影藏div用于控制宽度 -->
            <div
              class="under-div-percent"
              :style="{ width: `${item.percent}%` }"
            >
              <!-- 红色长条 -->
              <div class="red-line"></div>
              <!-- 红色方框 -->
              <div class="red-square"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from '../../../components/header';
export default {
  components: {
    Header,
  },
  props: {},
  data() {
    return {
      le: '50%',
      threatClass: [
        {
          name: '可以行为',
          percent: 78,
        },
        {
          name: '恶意行为',
          percent: 30,
        },
        {
          name: '恶意内容',
          percent: 40,
        },
        {
          name: '关联恶意软件',
          percent: 80,
        },
        {
          name: '网站信任',
          percent: 40,
        },
      ],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.threat {
  margin-top: var(--header-3-content-space);
  margin-right: var(--margin-size);
  .class-item {
    justify-content: center;

    .class-des-contain {
      display: flex;
      width: 100%;
      .percent-count-before {
        width: 30%;
      }
      // 百分比位置
      .percent-count {
        width: 70%;
        display: flex;
        justify-content: flex-end;
        font-size: var(--font-size-14);
        color: var(--font-yellow-color);
        font-weight: bold;
      }
    }
    .class-process {
      width: 100%;
      display: flex;
      .class-des {
        font-size: var(--font-size-14);
        width: 30%;
      }
      .under-div {
        height: var(--threat-class-process-under-div-height);
        background: var(--threat-line-under-bg);
        border: 1px solid var(--threat-line-under-bg);

        width: 70%;
        &-percent {
          display: flex;
          align-items: center;
          height: 100%;
          .red-line {
            flex: 1;
            height: var(--threat-class-process-red-line-height);
            background: var(--threat-line-red-bg);
          }
          .red-square {
            height: 100%;
            width: var(--threat-class-process-red-line-width);
            background-color: var(--threat-square-red-bg);
          }
        }
      }
      .percent-count {
        display: flex;
        width: 100%;
        flex-direction: row-reverse;
        height: 50%;
        align-items: center;
      }
    }
  }
}
</style>
