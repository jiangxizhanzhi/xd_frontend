<template>
  <div class="package-card">
    <div class="title-box">
      <div
        :title="cardData.name"
        class="card-name"
      >{{ cardData.name }}</div>
      <div class="card-desc">
        {{ cardData.desc }}
      </div>
      <div
        class="tag-wrap"
        :style="{
          background: cardData.published_flag ? $themed('primary-color') : '#a6b0c4'
        }"
      >
        <span class="outer-round">
          <span
            class="inner-round"
            :style="{
              background: cardData.published_flag ? $themed('primary-color') : '#a6b0c4'
            }"
          ></span>
        </span>
        <span class="text">{{ cardData.published_flag ? '已发布' : '未发布' }}</span>
      </div>
    </div>
    <div class="img-wrap">
      <div class="img-box">
        <img
          :src="cardData.logo"
          alt=""
        />
      </div>
    </div>
    <div class="card-bottom">
      <cb-button
        type="text"
        @click="handlerDistribute(cardData)"
      >发布</cb-button>
      <cb-button
        type="text"
        @click="handlerCopy(cardData)"
      >复制</cb-button>
      <cb-button
        type="text"
        @click="handlerEdit(cardData)"
      >编辑</cb-button>
      <cb-button
        type="text"
        @click="handlerDelete(cardData)"
      >删除</cb-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cardData: {
      type: [Object, Array],
      default: {}
    }
  },
  data() {
    return {
    };
  },
  methods: {
    handlerEdit(data) {
      this.$emit('edit', data)
    },
    handlerDelete(data) {
      this.$emit('delete', data)
    },
    handlerCopy(data) {
      this.$emit('copy', data)
    },
    handlerDistribute(data) {
      this.$emit('distribute', data)
    },
  }
};
</script>
<style lang="scss" scoped>
.package-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(25% - 12px);
  margin-right: 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid var(--neutral2);

  &:nth-child(4n) {
    margin-right: 0;
  }

  .title-box {
    width: 100%;
    height: 66px;
    padding-top: 14px;
    padding-left: 16px;
    background: linear-gradient(#e8f4ff, #ffffff);
    position: relative;
    margin-bottom: 8px;

    .card-name {
      font-size: 14px;
      height: 22px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: var(--neutral8);
      line-height: 22px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      padding-right: 64px;
    }

    .card-desc {
      font-size: 12px;
      height: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: var(--neutral5);
      line-height: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      padding-right: 60px;
      margin-top: 8px;
    }

    .tag-wrap {
      width: 64px;
      height: 24px;
      position: absolute;
      top: 16px;
      right: 0;
      background: var(--primary-color);
      border-radius: 24px 0 0 24px;
      display: flex;
      align-items: center;

      .outer-round {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: #ffffff;
        margin-left: 2px;

        .inner-round {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--primary-color);
        }
      }

      .text {
        font-size: 12px;
        color: #ffffff;
        margin-left: 2px;
      }
    }
  }

  .img-wrap {
    padding: 0 16px;

    .img-box {
      width: 100%;
      padding-bottom: 56%;
      position: relative;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 4px 4px 0 0;
        transition: all 0.5s ease;
        object-fit: contain;
      }
    }
  }

  .card-bottom {
    width: 100%;
    height: 30px;
    text-align: center;

    .cb-button {
      margin: 0 4px;
    }
  }
}
</style>
