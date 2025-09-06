<template>
  <div class="type-content">
    <div class="content-table">
      <cb-search-table
        ref="sdlRef"
        :tableData="lessonData"
        :selector="tableSelector"
        :cols="columns"
        :selection.sync="multipleSelection"
        :paginator="false"
        :fetchPromise="fetchPromise"
        :hidePaginOnDemand="true"
        row-key="resource_id"
      >
        <template v-slot:search>
          <cb-button
            icon="icon-gongkai"
            :warnMsg="$t('m.comfirmOpenAttachment')"
            :completeMsg="$t('m.successful')"
            :disabled="multipleSelection.length === 0"
            @click="toPublic(multipleSelection, $event)"
            >{{ $t('m.public') }}</cb-button
          >
          <cb-button
            icon="icon-yincang"
            :warnMsg="$t('m.comfirmHideAttachment')"
            :disabled="multipleSelection.length === 0"
            :completeMsg="$t('m.successful')"
            @click="toHide(multipleSelection, $event)"
            >{{ $t('m.hide') }}</cb-button
          >
        </template>
        <template v-slot:public="scope"
          ><span class="marleft5 public" v-if="scope.data.is_public">{{
            $t('m.public')
          }}</span
          ><span class="marleft5 hide" v-else>{{
            $t('m.hide')
          }}</span></template
        >
      </cb-search-table>
    </div>
  </div>
</template>
<script>
import SearchInput from '@/components/search-condition/search-input.vue';
import _ from 'lodash';
export default {
  components: {
    SearchInput,
  },
  props: {
    lessonData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      typeData: [],
      multipleSelection: [],
      selectDevice: {},
    };
  },
  watch: {},
  created() {
    for (let item of this.lessonData) {
      item.key = item.resource_id;
    }
    this.tableSelector = {
      maxSelect: 0,
    };
    this.columns = [
      {
        label: this.$t('m.fileName'),
        dataIndex: 'file_name',
        prop: 'file_name',
      },
      {
        label: this.$t('m.isPublic'),
        dataIndex: 'public',
        prop: 'public',
        slot: 'public',
      },
    ];
  },
  methods: {
    fetchPromise(queryData, option) {
      const that = this;
      const data = that.lessonData;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              data,
            },
          });
        }, 500);
      });
    },
    toPublic(data, done) {
      const arry = [];
      if (data.length > 0) {
        const validSelection = _.filter(data, ['is_public', false]);
        if (validSelection.length <= 0) {
          this.$message({
            type: 'error',
            message: this.$t('m.selectRecordToOvert'),
          });
          done(false);
          return;
        }
      }
      data.forEach((item) => {
        arry.push(item.resource_id);
      });
      this.$request
        .patch(
          '/oj/admin/attachment/batch-public',
          {
            resource_ids: arry,
            is_public: true,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          this.multipleSelection = [];
          done();

          for (const ele of this.lessonData) {
            const found = _.find(arry, (target) => {
              return target === ele.resource_id;
            });
            if (found) {
              ele.is_public = true;
            }
          }
        })
        .catch(() => {
          done(false);
        });
    },
    toHide(data, done) {
      const arry = [];
      // let public_num = false
      if (this.multipleSelection.length > 0) {
        const validSelection = _.filter(this.multipleSelection, [
          'is_public',
          true,
        ]);
        if (validSelection.length <= 0) {
          this.$message({
            type: 'error',
            message: this.$t('m.selectRecordToConceal'),
          });
          done(false);
          return;
        }
      }
      data.forEach((item) => {
        arry.push(item.resource_id);
      });

      this.$request
        .patch(
          '/oj/admin/attachment/batch-public',
          {
            resource_ids: arry,
            is_public: false,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          this.multipleSelection = [];
          done();
          for (const ele of this.lessonData) {
            const found = _.find(arry, (target) => target === ele.resource_id);
            if (found) {
              ele.is_public = false;
            }
          }
        })
        .catch(() => {
          done(false);
        });
    },
  },
};
</script>
<style scoped lang="scss">
.in {
  margin-bottom: 10px;
}
</style>
