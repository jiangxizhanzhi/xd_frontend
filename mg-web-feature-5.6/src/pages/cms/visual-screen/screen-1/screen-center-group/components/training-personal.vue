<template>
  <div class="personnel_div" ref="containRef">
    <Header :level="1" title="训练人员" />
    <!-- <div class="mrTop"></div> -->
    <cb-scroll
      ref="tableRfe"
      :data="users"
      class="seamless-warp personnel"
      :class-option="optionSingleHeight"
    >
      <div class="personnel">
        <div
          class="des_more"
          :style="{ height: lineHeight + 'px' }"
          v-for="item in users"
          :key="item.id"
        >
          <!-- 图片 -->
          <div class="img_div">
            <div
              class="img"
              :style="{ height: imgSize + 'px', width: imgSize + 'px' }"
            >
              <img :src="item.logo" alt="" />
            </div>
          </div>
          <div class="role_info">
            <div class="role_des">{{ item.name }}</div>
            <div class="role_name">{{ item.role }}</div>
          </div>
        </div>
      </div>
    </cb-scroll>
  </div>
</template>

<script>
import Header from '../../components/header';
import { traniningRole } from '@/api/screen-center-group';
import { ref, reactive, onMounted, watch } from '@vue/composition-api';
import { getScreenInfo } from '@/hooks';
export default {
  name: 'AttackScore',
  components: {
    Header,
  },
  props: {
    color: {
      type: String,
      default: 'red',
    },

    score: {
      type: Number,
      default: 0,
    },
  },
  computed: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {},
  setup() {
    let screen = getScreenInfo();
    const tableRfe = ref(null);
    const containRef = ref(null);
    const users = ref([
      // {
      //   id: 7,
      //   resource_id: 'e3e863a529054868a823bead825a2226',
      //   name: 'director',
      //   logo: '/fdfs/group1/M00/00/00/CmQAlmEbVpuAOFrbAADZj_AdtGM493.png',
      //   role_name: '教员',
      //   role_desc: '教员角色负责训练创建、过程导调、结果评估、训练回顾',
      //   role: '教员',
      // },
    ]);
    // 每一项的高度，默认120px
    let lineHeight = ref(120);
    // 图片默认大小
    let imgSize = ref(60);
    const optionSingleHeight = reactive({
      // 滚动方向
      direction: 1,
      // 滚2行停一下
      singleHeight: 120 * 2,
      // // 等待时间
      waitTime: 2500,
      limitMoveNum: 3,
    });
    function getSize() {
      // 获取包裹层高度
      lineHeight.value = Math.ceil((containRef.value.offsetHeight - 55) / 2);
      imgSize.value = Math.ceil((containRef.value.offsetHeight - 55) / 4);
      optionSingleHeight.singleHeight =
        lineHeight.value * Math.ceil(users.value.length / 3);
    }
    watch(screen, () => {
      getSize();
    });

    onMounted(() => {
      traniningRole(
        '/training_team/v/user_list/',
        'b21a7d72756fa5b828edd4433194ff33',
      ).then((res) => {
        users.value = _.cloneDeep(res.data.users);
        tableRfe.value.reset();
        getSize();
      });
    });

    return {
      users,
      tableRfe,
      containRef,
      optionSingleHeight,
      lineHeight,
      imgSize,
    };
  },
};
</script>

<style lang="scss">
.personnel_div {
  flex: 2;
  overflow: hidden;
  .mrTop {
    height: var(--header-2-content-space);
  }
  .seamless-warp {
    height: calc(100% - 40px - var(--header-2-content-space));
    overflow: hidden;
    .personnel {
      display: flex;
      overflow: hidden;
      flex-wrap: wrap;
      .des_more {
        width: 33%;
        justify-content: space-between;
        display: flex;
        flex-wrap: wrap;
        .img_div {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .img {
            width: var(--train-role-height);
            border-radius: 50%;
            background: var(--img-bg-color);
            img {
              height: 100%;
              width: 100%;
            }
          }
        }
        .role_info {
          width: 100%;
          .role_des {
            width: 100%;
            text-align: center;
            font-size: var(--font-size-12);
            font-weight: bold;
            line-height: 30px;
          }
          .role_name {
            width: 100%;
            text-align: center;
            font-size: var(--font-size-12);
          }
        }
      }
    }
  }
}
</style>
