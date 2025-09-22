<template>
  <div>
    <cb-dialog
      :title="$t('场景排队')"
      :visible.sync="dialogVisible"
      width="1000px"
      @close="close"
    >
      <cb-search-table
        :cols.sync="cols"
        ref="tableRef"
        row-key="room_id"
        :fetchPromise="fetchPromise"
        :searchBarBg="true"
        showIndex
      >

        <template v-slot:status="scope">
          <div :class="[scope.data.status ? 'running' : 'queue']">{{ scope.data.status ? '启用中' : '排队中' }}</div>
        </template>
        <template v-slot:operate="scope">
          <template v-if="scope.data.status == 0">
            <cb-button
              type="text"
              @click="cancelQueue(scope.data)"
              button-type="edit"
              mr
            >取消排队</cb-button>
          </template>
          <template v-else>
            <div>-</div>
          </template>
        </template>
      </cb-search-table>
    </cb-dialog>
  </div>
</template>

<script>
import {
  getSceneQueueApi,
  cancelQueueApi,
} from '@/api/web/team-training';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    resource_id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogVisible: this.visible,
      cols: [
        {
          label: this.$t('排队用户'),
          prop: 'room_name',
        },
        {
          label: this.$t('时间'),
          prop: 'apply_time',
        },
        {
          label: this.$t('状态'),
          slot: 'status',
        },
        {
          label: this.$t('操作'),
          slot: 'operate',
        },
      ],
    }
  },
  methods: {
    fetchPromise(queryData, option) {
      return new Promise((resolve) => {
        queryData.room_id = this.resource_id
        getSceneQueueApi(queryData).then((res) => {
          const resp = {
            data: {
              data: {
                list: res.data.data
              }
            }
          }
          resolve(resp);
        });
      });
    },
    // 取消排队
    cancelQueue(data) {
      cancelQueueApi({
        resouceId: data.room_id
      }).then(res => {
        this.$refs.tableRef.reload();
      })
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.running {
  color: var(--green-color);
}

.queue {
  color: var(--orange-color);
}
</style>