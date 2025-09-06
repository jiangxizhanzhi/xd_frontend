<template>
  <cb-inner-page :background="false">
    <div class="experiment-report-content">
      <div class="content-bottom">
        <div class="table-grid">
          <cb-search-table
            ref="experimentReportTable"
            :url4del="url4del"
            :url="url"
            :cols="columns"
            :data="query"
            :selector="tableSelector"
            :selection.sync="multipleSelection"
            row-key="resource_id"
            baseURL="/api/ojj"
          >
            <template v-slot:search>
              <cb-button
                buttonType="delete"
                hollow
                :disabled="multipleSelection.length === 0"
                @click="batchDestroy(multipleSelection, $event)"
              ></cb-button>
            </template>
            <template v-slot:filter>
              <cb-search-input
                v-model="query.user_name"
                :placeholder="$t('m.pleaseInputSelectName')"
              ></cb-search-input>
              <cb-search-input
                v-model="query.pattern"
                :placeholder="$t('m.experimentalReportContent')"
              ></cb-search-input>
            </template>
            <template v-slot:public="scope"
              ><span class="public" v-if="scope.data.is_public">{{
                $t('m.public')
              }}</span
              ><span class="hide" v-if="!scope.data.is_public">{{
                $t('m.hide')
              }}</span></template
            >
            <template v-slot:opeator="scope">
              <cb-button
                type="text"
                icon="icon-xiangqing"
                @click="detail(scope.data)"
                >{{ $t('device.realDetail') }}</cb-button
              >
            </template>
          </cb-search-table>
        </div>
      </div>
      <cb-dialog
        width="60%"
        :title="$t('m.experimentReport')"
        :visible.sync="detailVisible"
        center="center"
      >
        <mavon-read
          :mavonData="mavonContent"
          :autofocus="false"
          :editable="false"
          :toolbars-flag="true"
          :subfield="false"
          default-open="preview"
        ></mavon-read>
      </cb-dialog>
    </div>
  </cb-inner-page>
</template>
<script>
import _ from 'lodash';
import MavonRead from '@/components/markdown/mavon-read.vue';

export default {
  components: {
    MavonRead,
  },
  data() {
    return {
      query: {
        pattern: '',
        user_name: '',
        business_type: 2,
        note_type: 2,
        business_id: this.$route.params.lessonId,
      },
      multipleSelection: [],
      detailVisible: false,
      mavonContent: '',
    };
  },
  computed: {
    url4del() {
      return `/admin/course/lessons/${this.lessonId}/delete_lesson_report/`;
    },
    courseId() {
      return _.get(this, '$route.params.courseId');
    },
    lessonId() {
      return _.get(this, '$route.params.lessonId');
    },
  },
  created() {
    this.tableSelector = {
      maxSelect: 0,
    };
    // this.url = `/admin/course/lessons/${this.$route.params.lessonId}/lesson_report/`;
    this.url = `/oj/admin/note/list`;
    this.columns = [
      {
        label: this.$t('m.name'),
        prop: 'user_name',
      },
      {
        label: this.$t('m.experimentalReportContent'),
        prop: 'content',
      },
      {
        label: this.$t('m.status'),
        slot: 'public',
        // sorter: 'public',
        width: '100',
      },
      {
        label: this.$t('m.updateTime'),
        prop: 'update_time',
      },
      {
        label: this.$t('m.operation'),
        slot: 'opeator',
      },
    ];
  },
  methods: {
    batchDestroy(data, done) {
      const that = this;
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      that.$request
        .delete(
          '/oj/admin/note',
          {
            resource_ids: ids,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then(() => {
          done();
          that.multipleSelection = [];
          that.$refs.experimentReportTable.reload();
        })
        .catch(() => {
          done(false);
        });
    },
    detail(row) {
      this.mavonContent = row.content;
      this.detailVisible = true;
    },
  },
};
</script>
