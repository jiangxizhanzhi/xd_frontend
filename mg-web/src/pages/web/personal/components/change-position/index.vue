<template>
  <div class="change-position">
    <cb-dialog :visible.sync="dialogPosition" width="80%">
      <template slot="title">
        <div class="min-height" v-if="isSelectButton">
          {{ $t('personal.changePost') }}
        </div>
        <div class="min-height" v-else>{{ $t('personal.selectPost') }}</div>
      </template>
      <div
        class="position-content cyber-scroll-bar"
        style="overflow: auto; height: 600px"
        v-loading="loading"
      >
        <div
          v-for="item in list"
          :key="item.resource_id"
          class="position-block"
        >
          <div class="position-block-title">{{ item.name }}</div>
          <div class="position-block-detail">
            <div
              v-for="item1 in item.children"
              :key="item1.resource_id"
              class="position-list"
            >
              <div class="second-title">{{ item1.name }}</div>
              <ul class="third-list">
                <li
                  v-for="item2 in item1.children"
                  :key="item2.resource_id"
                  @click="handlePositionClick(item2)"
                >
                  {{ item2.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import { frameTree } from '@/api/personal';
import _ from 'lodash';
const dealWithData = (list) => {
  const data = list.map((item) => {
    if (item.children && item.children.length) {
      item.disabled = true;
      dealWithData(item.children);
    } else {
      item.children = item.role_detail_list || [];
    }
    return item;
  });
  return data;
};
export default {
  data() {
    return {
      dialogPosition: false,
      isSelectButton: false,
      list: [],
      loading: false,
    };
  },
  mounted() {
    this.getPositionList();
  },
  methods: {
    getPositionList() {
      this.loading = true;
      const data = {
        resource_id: -1,
      };
      frameTree(data).then((res) => {
        this.loading = false;
        const resData = _.get(res, 'data.data.children');
        if (resData && resData.length) {
          this.list = dealWithData(resData);
        } else {
          this.list = [];
        }
      });
    },
    handlePositionClick(value) {
      this.$emit('value', value);
      this.dialogPosition = false;
      this.isSelectButton = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.change-position {
  .position-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: 200px;
    .position-block {
      width: 49%;
      margin-bottom: 20px;
      &-title {
        border-bottom: 1px solid;
        padding-bottom: 10px;
        font-size: 15px;
      }
      &-detail {
        padding-top: 20px;
        .position-list {
          display: flex;
          .second-title {
            width: 35%;
            border-right: 1px solid var(--primary-color);
            height: 20px;
            line-height: 20px;
          }
          .third-list {
            margin-left: -20px;
            margin-top: 0;
            min-height: 20px;
            li {
              float: left;
              margin: 0 4px;
              list-style: none;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.change-position {
  .position-content {
    .position-block {
      &-title {
        border-color: var(--primary-color);
        color: var(--neutral8);
      }
      &-detail {
        .second-title {
          border-color: var(--primary-color);
          color: var(--neutral8);
        }
        .third-list {
          li:hover {
            color: var(--primary-color);
          }
        }
      }
    }
  }
}
</style>
