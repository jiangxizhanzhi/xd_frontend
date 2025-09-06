<template>
  <div v-loading="loadingVolume" class="free-volume-wrapper">
    <div class="top-wrapper">
      <Block :title="$t('practice.examSetting')"></Block>
      <div class="exam-setting">
        <div class="row-item">
          <span class="row-label">{{ $t('practice.topicState') }}：</span>
          <div class="row-right">
            <cb-checkbox-group v-model="formObj.status">
              <cb-checkbox
                v-for="(item, index) in statusLists"
                :key="index"
                :label="item.code"
              >
                {{ item.name }}
              </cb-checkbox>
            </cb-checkbox-group>
          </div>
        </div>
        <div class="row-item">
          <span class="row-label">{{ $t('practice.topicCount') }}：</span>
          <div class="row-right">
            <cb-radio-group v-model="topicCount">
              <cb-radio :label="5">5{{ $t('practice.topic') }}</cb-radio>
              <cb-radio :label="10">10{{ $t('practice.topic') }}</cb-radio>
              <cb-radio :label="20">20{{ $t('practice.topic') }}</cb-radio>
              <cb-radio :label="30">30{{ $t('practice.topic') }}</cb-radio>
              <cb-radio :label="'custom'" class="custom-radio">
                {{ $t('practice.custom') }}
              </cb-radio>
              <span v-if="topicCount === 'custom'" class="custom-span">
                <cb-input
                  v-model="customCount"
                  class="custom-input"
                  :placeholder="$t('common.pleaseInput')"
                />
                <span class="custom-label">{{ $t('practice.topic') }}</span>
              </span>
            </cb-radio-group>
          </div>
        </div>
        <div class="row-item">
          <span class="row-label">{{ $t('practice.topicDifficult') }}：</span>
          <div class="row-right">
            <cb-checkbox-group v-model="formObj.difficulty">
              <cb-checkbox
                v-for="(item, index) in difficultLists"
                :key="index"
                :label="item.code"
              >
                {{ item.name }}
              </cb-checkbox>
            </cb-checkbox-group>
          </div>
        </div>
        <div class="row-item">
          <span class="row-label">{{ $t('practice.topicType') }}：</span>
          <div class="row-right">
            <cb-checkbox-group v-model="formObj.type">
              <cb-checkbox
                v-for="(item, index) in typeLists"
                :key="index"
                :label="item.code"
              >
                {{ item.name }}
              </cb-checkbox>
            </cb-checkbox-group>
          </div>
        </div>
      </div>
      <div class="category-wrapper">
        <div class="check-all-box">
          <cb-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >
            {{ $t('practice.allSelect') }}
          </cb-checkbox>
        </div>
        <Block :title="$t('practice.categorySelect')"></Block>
        <div class="category-select-wrapper">
          <cb-checkbox-group
            v-model="formObj.direction"
            @change="checkboxChange"
            class="category-checkbox-group"
          >
            <div class="category-select">
              <div
                class="category-card"
                v-for="(item, index) in categoryLen"
                :key="index"
                @click="itemClick(item)"
              >
                <div class="checkbox-wrapper" @click="clickCheckbox">
                  <cb-checkbox
                    class="checkbox-item"
                    v-model="item.checked"
                    :key="item.category_id"
                    :label="item.category_id"
                    @change="handleCheckedItemChange"
                  ></cb-checkbox>
                </div>
                <div class="category-name one-overflow">{{ item.name }}</div>
                <div class="category-count one-overflow">
                  {{ $t('practice.haveDone') }}
                  <span class="finished-count">{{ item.count }}</span>
                  {{ $t('practice.topic') }}/
                  <span class="total-count">
                    {{ item.sum }}
                  </span>
                  {{ $t('practice.topic') }}
                </div>
              </div>
            </div>
          </cb-checkbox-group>
        </div>
      </div>
    </div>
    <div class="bottom-wrapper">
      <cb-button
        :loading="loadingStartBtn"
        :disabled="loadingStartBtn"
        @click="startExam"
      >
        {{ $t('practice.startPractice') }}
      </cb-button>
    </div>
  </div>
</template>
<script>
import Block from '@/components/block';
import { getCategoryTopicProgress, volumeSubmit } from '@/api/practice.ts';
export default {
  name: 'FreeVolume',
  components: {
    Block,
  },
  props: {
    difficultLists: {
      type: Array,
      default: () => [],
    },
    statusLists: {
      type: Array,
      default: () => [],
    },
    typeLists: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formObj: {
        status: [],
        count: '',
        difficulty: [],
        type: [],
        direction: [], // 选中的方向
      },
      topicCount: 10,
      customCount: '', // 自定义题目数量
      categoryLen: [], // 方向列表
      checkAll: true, // 默认 方向 全选，控制右上角按钮
      isIndeterminate: false,
      loadingVolume: false,
      loadingStartBtn: false,
    };
  },
  computed: {
    // 方向 所有 category_id
    allId() {
      return _.map(this.categoryLen, (item) => {
        return item.category_id;
      });
    },
  },
  watch: {
    topicCount(val) {
      if (val !== 'custom') {
        this.customCount = '';
      }
    },
    difficultLists: {
      handler(nv, ov) {
        this.formObj.difficulty = _.map(nv, (item) => {
          return item.code;
        });
      },
      immediate: true,
      deep: true,
    },
    statusLists: {
      handler(nv, ov) {
        this.formObj.status = _.map(this.statusLists, (item) => {
          return item.code;
        });
      },
      immediate: true,
      deep: true,
    },
    typeLists: {
      handler(nv, ov) {
        this.formObj.type = _.map(this.typeLists, (item) => {
          return item.code;
        });
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getCategoryTopicProgressTh();
  },
  methods: {
    // 获取所有方向
    getCategoryTopicProgressTh() {
      this.loadingVolume = true;
      getCategoryTopicProgress().then((res) => {
        const data = _.get(res, 'data.data');
        _.forEach(data, (item) => {
          this.$set(item, 'checked', true);
        });
        this.categoryLen = data;
        this.formObj.direction = _.map(this.categoryLen, (item) => {
          return item.category_id;
        });
        this.loadingVolume = false;
      });
    },
    handleCheckAllChange(val) {
      this.formObj.direction = val ? this.allId : [];
      this.isIndeterminate = false;
    },
    checkboxChange(val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.allId.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allId.length;
    },
    handleCheckedItemChange(val) {},
    // checkbox click事件
    clickCheckbox(e) {
      e.preventDefault();
    },
    itemClick(val) {
      const filterIndex = _.findIndex(this.formObj.direction, (item) => {
        return item === val.category_id;
      });
      if (filterIndex > -1) {
        this.formObj.direction.splice(filterIndex, 1);
      } else {
        this.formObj.direction.push(val.category_id);
      }
      this.checkboxChange(this.formObj.direction);
    },
    startExam() {
      if (this.topicCount === 'custom') {
        const reg = /(^[1-9]\d*$)/;
        if (this.customCount) {
          // 自由组卷自定义数量1-100
          if (
            reg.test(this.customCount) &&
            Number(this.customCount) >= 1 &&
            Number(this.customCount) <= 100
          ) {
            this.formObj.count = this.customCount;
          } else {
            this.$message.error(this.$t('practice.plzEnterTopicCount100'));
            return;
          }
        } else {
          this.$message.error(this.$t('practice.plzEnterTopicCount'));
          return;
        }
      } else {
        this.formObj.count = this.topicCount;
      }
      this.loadingStartBtn = true;
      volumeSubmit({
        ...this.formObj,
      })
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.loadingStartBtn = false;
          if (data.resource_id) {
            this.$router.push({
              path: `/practice/volume-exam/${data.resource_id}`,
              query: {
                from: 'volume-normal',
              },
            });
          }
        })
        .catch((err) => {
          this.loadingStartBtn = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.free-volume-wrapper {
  .top-wrapper {
    padding: 16px;
  }
  .exam-setting {
    min-height: 100px;
    background: var(--bg-color-3);
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
    .row-item {
      display: flex;
      margin-bottom: 9px;
      height: 32px;
      line-height: 32px;
      &:last-child {
        margin-bottom: 0;
      }
      .row-label {
        font-size: 14px;
        color: var(--neutral8);
        // line-height: 22px;
      }
      .row-right {
        .custom-span {
          line-height: 32px;
        }
        .custom-input {
          width: 74px;
        }
        .custom-label {
          margin-left: 4px;
          font-size: 14px;
          color: var(--neutral8);
        }
      }
    }
  }
  .category-wrapper {
    position: relative;
    .check-all-box {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .category-checkbox-group {
    width: 100%;
  }
  .category-select {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .category-card {
      width: calc(20% - 10px);
      margin: 0 12px 12px 0;
      background: var(--bg-color-3);
      border-radius: 4px;
      font-size: 14px;
      padding: 16px;
      position: relative;
      cursor: pointer;

      &:nth-child(5n) {
        margin: 0 0 12px 0;
      }
      .checkbox-wrapper {
        display: inline-block;
        position: absolute;
        top: 9px;
        right: 9px;
      }
      .category-name {
        font-weight: 600;
        color: var(--neutral8);
        line-height: 22px;
        margin-bottom: 8px;
      }
      .category-count {
        color: var(--neutral5);
        line-height: 22px;
        .finished-count {
          color: var(--primary-color);
        }
        .total-count {
        }
      }
      &:hover {
        background: var(--neutral0);
      }
    }
    .category-card:has(.is-checked) {
      background: var(--neutral0);
      &:hover {
        background: var(--neutral1);
      }
    }
  }
  .bottom-wrapper {
    height: 56px;
    background: var(--bg-color-2);
    box-shadow: 6px 6px 20px 0px var(--box-shadow-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
<style lang="scss">
.category-select-wrapper {
  .checkbox-item {
    .el-checkbox__label {
      display: none;
    }
  }
}
.free-volume-wrapper {
  .custom-radio {
    margin: 5px 8px 5px 0 !important;
  }
  .row-right {
    height: 32px;
    line-height: 32px;
    .cb-checkbox-group,
    .cb-radio-group {
      height: 32px;
      line-height: 32px;
    }
  }
  .category-wrapper .check-all-box {
    .el-checkbox
      .el-checkbox__input.is-indeterminate
      .el-checkbox__inner::before {
      top: 5px;
    }
  }
}
</style>
