<template>
  <cb-inner-page class="app-container" :background="false">
    <div class="dynamic-effects-resources">
      <div class="left-wrap">
        <div class="block-wrap">
          <Block :title="$t('situation3DManage.ctAdEffective')"></Block>
        </div>
        <div
          class="category-item"
          :class="{
            active: item.resource_id === active,
          }"
          :key="item.resource_id"
          v-for="item in categoryList"
          @click="categoryChange(item)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="right-wrap">
        <div class="top-wrap">
          <cb-search-input></cb-search-input>
          <div class="btn-wrap">
            <cb-button button-type="add" mr @click="addDynamic">
              {{ $t('situation3DManage.addDynamic') }}
            </cb-button>
            <cb-button hollow @click="categoryManage" icon="icon-xiangqing">
              {{ $t('situation3DManage.classifyManage') }}
            </cb-button>
          </div>
        </div>
        <div class="bottom-wrap">
          <div
            class="effect-item"
            :key="item.resource_id"
            v-for="item in effectList"
            @mouseover="maskActive = item.resource_id"
            @mouseout="maskActive = ''"
          >
            <div class="name-wrap" :title="item.name">
              {{ item.name }}
            </div>
            <div class="img-wrap">
              <img :src="item.logo" alt="" />
            </div>
            <div class="mask-wrap" v-show="item.resource_id === maskActive">
              <cb-button type="text" @click="handlerPreview">{{
                $t('situation3DManage.preview')
              }}</cb-button>
              <cb-button
                color="red"
                type="text"
                button-type="delete"
              ></cb-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 动效预览弹窗 -->
    <cb-dialog
      :title="$t('situation3DManage.dynamicPreview')"
      :visible.sync="dialogVisible"
      width="1000px"
      height="600px"
    >
      <iframe
        ref="iframeRefTopo"
        v-if="dialogVisible"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
        :src="topoUrl"
        :style="{ width: '100%', height: '580px' }"
        @mouseover="setFocusTopo"
      ></iframe>
    </cb-dialog>
  </cb-inner-page>
</template>

<script>
import { getEffectCategory, getEffectList } from '@/api/situation-3D-manage';
import Block from '@/components/block';
export default {
  name: 'index',
  components: {
    Block,
  },
  data() {
    return {
      active: '',
      maskActive: '',
      dialogVisible: false,
      topoUrl: '',
      model: {
        categoryId: '',
        pattern: '',
      },
      categoryList: [
        {
          name: '扫描渗透',
        },
        {
          name: '扫描渗透',
        },
        {
          name: '扫描渗透',
        },
      ],
      effectList: [],
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getEffectCategory();
  },
  methods: {
    // 获取分类列表
    getEffectCategory() {
      getEffectCategory().then((res) => {
        this.categoryList = _.get(res, 'data.data', []);
        if (this.categoryList.length) {
          this.model.categoryId = this.categoryList[0].resource_id;
          this.active = this.categoryList[0].resource_id;
          this.getEffectList();
        }
      });
    },
    // 获取动效列表
    getEffectList() {
      getEffectList({
        categoryId: this.model.categoryId,
        pattern: this.model.pattern,
      }).then((res) => {
        this.effectList = _.get(res, 'data.data.list', []);
      });
    },
    categoryChange(data) {
      this.active = data.resource_id;
      this.model.categoryId = data.resource_id;
      this.getEffectList();
    },
    addDynamic() {
      this.$router.push({
        name: 'dynamic-effects-resources-create',
      });
    },
    categoryManage() {
      this.$router.push({
        name: 'dynamic-effects-resources-group',
      });
    },
    // 预览动效事件
    handlerPreview(data) {
      this.dialogVisible = true;
    },
    setFocusTopo() {
      this.$refs.iframeRefTopo.contentWindow.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
.dynamic-effects-resources {
  width: 100%;
  height: 100%;
  display: flex;
  .left-wrap {
    width: 208px;
    min-height: 100%;
    background: var(--bg-color-2);
    padding-top: 16px;
    .block-wrap {
      padding-left: 16px;
    }
    cursor: pointer;
    .category-item {
      height: 48px;
      line-height: 48px;
      padding-left: 32px;
      font-size: 14px;
      color: var(--neutral8);
      &:hover {
        background: var(--primary-color-2);
        color: var(--primary-color);
      }
    }
    .active {
      background: var(--primary-color-2);
      color: var(--primary-color);
    }
  }
  .right-wrap {
    width: calc(100% - 208px);
    height: 100%;
    margin-left: 14px;
    .top-wrap {
      height: 64px;
      line-height: 64px;
      padding: 0 16px;
      background: var(--bg-color-2);
      position: relative;
      .btn-wrap {
        position: absolute;
        top: 4px;
        right: 22px;
      }
    }
    .bottom-wrap {
      margin-top: 8px;
      width: 100%;
      height: calc(100% - 72px);
      max-height: calc(100% - 72px);
      background: var(--bg-color-2);
      padding: 16px;
      display: flex;
      align-content: flex-start;
      flex-flow: row wrap;
      .effect-item {
        width: calc(16.6% - 6.6px);
        height: 182px;
        margin-right: 8px;
        margin-bottom: 8px;
        background: var(--bg-color-3);
        position: relative;
        &:nth-child(6n) {
          margin-right: 0px;
        }
        .name-wrap {
          width: 100%;
          color: var(--neutral8);
          text-align: center;
          position: absolute;
          left: 50%;
          bottom: 8px;
          transform: translateX(-50%);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .img-wrap {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .mask-wrap {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: var(--mask-color);
        }
      }
      @media screen and (max-width: 1440px) {
        .effect-item {
          width: calc(25% - 6px);
          height: 182px;
          margin-right: 8px;
          margin-bottom: 8px;
          background: var(--bg-color-3);
          position: relative;
          &:nth-child(6n) {
            margin-right: 8px;
          }
          &:nth-child(4n) {
            margin-right: 0px;
          }
          .name-wrap {
            width: 100%;
            color: var(--neutral8);
            text-align: center;
            position: absolute;
            left: 50%;
            bottom: 8px;
            transform: translateX(-50%);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .img-wrap {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            width: 100%;
            height: 100%;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .mask-wrap {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: var(--mask-color);
          }
        }
      }

      // 1920屏幕
      .item-detail {
        width: calc(16.6% - 10px);
        margin-right: 12px;
        margin-bottom: 16px;
        &:nth-child(5n) {
          margin-right: 12px;
        }
        &:nth-child(6n) {
          margin-right: 0;
        }
      }
      // 1440屏幕
      @media screen and (max-width: 1440px) {
        .item-detail {
          width: calc(20% - 10px);
          margin-right: 12px;
          margin-bottom: 16px;
          &:nth-child(5n) {
            margin-right: 0;
          }
          &:nth-child(6n) {
            margin-right: 12px;
          }
        }
      }
    }
  }
}
</style>
