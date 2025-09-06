<template>
  <cb-dialog
    :visible="visible"
    width="960px"
    @close="handleClose"
    custom-class="import-dialog"
  >
    <template slot="title">
      <div>{{ $t('assessment.ahpAssignment') }}</div>
    </template>
    <div>
      <div class="pre-stage">
        {{ $t('assessment.preModel') }}:{{ pre_name }}
      </div>
      <div
        class="cyber-scroll-bar-small"
        style="max-height: 500px; overflow: auto"
      >
        <table class="ahp-table">
          <thead>
            <tr>
              <th></th>
              <th
                class="head-th one-overflow"
                v-for="(col, index) in columns"
                :key="index"
                :title="col.label"
              >
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
              <th class="tbody-th one-overflow" :title="row.label">
                {{ row.label }}
              </th>
              <td v-for="(col, colIndex) in columns" :key="colIndex">
                <cb-select
                  :disabled="row.key === col.key"
                  :options="options"
                  v-model="row.data[col.key]"
                  @change="updateData(row, col)"
                >
                </cb-select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <cb-button-group>
        <cb-button
          button-type="confirm"
          :loading="loading"
          @click="dialogConfirm"
        ></cb-button>
        <cb-button button-type="cancel" @click="dialogCancel"></cb-button>
      </cb-button-group>
    </div>
  </cb-dialog>
</template>

<script>
import { LABEL_VALUES } from '../constant';
import { editAlgorithm } from '@/api/web/range-test';

export default {
  props: {
    algorithm_id: {
      type: String,
      default: '',
    },
    rows: {
      type: Array,
      default() {
        return [];
      },
    },
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      loading: false,
      options: LABEL_VALUES,
      visible: false,
      pre_name: '',
      // rows: [
      //   { label: 'A', data: { A: 1, B: 1, C: 1, D: 1 } },
      //   { label: 'B', data: { A: 1, B: 1, C: 1, D: 1 } },
      //   { label: 'C', data: { A: 1, B: 1, C: 1, D: 1 } },
      //   { label: 'D', data: { A: 1, B: 1, C: 1, D: 1 } },
      // ],
      // columns: [
      //   { key: 'A', label: 'A' },
      //   { key: 'B', label: 'B' },
      //   { key: 'C', label: 'C' },
      //   { key: 'D', label: 'D' },
      // ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    dialogConfirm() {
      this.loading = true;
      const data = {
        resource_id: this.algorithm_id,
        mode: 1,
        matrix_data: JSON.stringify(this.rows),
      };
      editAlgorithm(data).then((res) => {
        const data = _.get(res, 'data.data');
        if (!data.cr) {
          this.$message.warning(this.$t('assessment.warningInfo'));
        }
        this.loading = false;
        this.visible = false;
      });
    },
    dialogCancel() {
      this.visible = false;
    },
    updateData(row, col) {
      this.rows.map((item) => {
        if (item.key === col.key) {
          item.data[row.key] = 1 / row.data[col.key];
        }
      });
      this.$forceUpdate();
    },
    handleClose() {
      this.visible = false;
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.pre-stage {
  margin-bottom: 16px;
}
.ahp-table {
  border: 1px solid var(--neutral0);
  width: 100%;
  th {
    border-bottom: 1px solid var(--neutral0);
    border-right: 1px solid var(--neutral0);
    line-height: 40px;
    // width: 100%;
    max-width: 200px;
    min-width: 200px;
  }
  .head-th {
    border-right-width: 0;
  }
  .tbody-th {
    border-bottom-width: 0;
  }
  tbody td {
    padding: 0 4px;
    text-align: center;
  }
}
</style>
