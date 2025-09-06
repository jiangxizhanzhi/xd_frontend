<template>
  <cb-drawer
    title=""
    :visible="visible"
    direction="rtl"
    :modal="false"
    show-close
    size="640px"
    height="100%"
    :with-header="false"
    @close="handleClose"
    append-to-body
  >
    <div class="header">
      <cb-button
        v-if="tabActive === 1 && model && Object.keys(model).length"
        :loading="exportLoading"
        @click="exportToPDF"
        class="download-btn"
        icon="icon-xiazai"
        type="text"
        >{{ $t('intelligence.report.download') }}</cb-button
      >
      <cb-radio-group v-model="tabActive" @change="handleChangeTab($event)">
        <cb-radio-button :label="1">{{
          $t('intelligence.report.tab')[0]
        }}</cb-radio-button>
        <cb-radio-button :label="2">{{
          $t('intelligence.report.tab')[1]
        }}</cb-radio-button>
      </cb-radio-group>
      <cb-iconfont
        class="close-btn"
        type="icon-guanbi"
        color="var(--netural5)"
        @click="handleClose"
      ></cb-iconfont>
    </div>
    <div ref="pdfContent" v-if="tabActive === 1" v-loading="loading">
      <div
        class="content current cyber-scroll-bar-small"
        v-if="model && Object.keys(model).length"
      >
        <div class="title">{{ model.report_name }}</div>
        <div class="info">
          <span class="name"
            >{{ $t('intelligence.report.name') }}：{{
              model.user_name || '-'
            }}</span
          >
          <span
            >{{ $t('intelligence.report.dimension') }}：{{
              model.dimension || '-'
            }}</span
          >
        </div>
        <card
          v-if="handleContent('course_data')"
          type="course"
          :data="model.course_data"
          :index="cardIndex['course_data']"
        ></card>
        <card
          v-if="handleContent('practice_data')"
          type="practice"
          :data="model.practice_data"
          :index="cardIndex['practice_data']"
        ></card>
        <card
          v-if="handleContent('training_data')"
          type="comprehensive"
          :data="model.training_data"
          :index="cardIndex['training_data']"
        ></card>
        <card
          v-if="handleContent('evaluation_data')"
          type="job"
          :data="model.evaluation_data"
          :index="cardIndex['evaluation_data']"
        ></card>
        <card
          v-if="handleContent('summary_data')"
          type="summary"
          :data="model"
          :index="cardIndex['summary']"
        ></card>
      </div>
      <no-data v-else></no-data>
    </div>
    <div v-if="tabActive === 2" v-loading="loading">
      <div
        class="content history cyber-scroll-bar-small"
        v-if="reportList.length"
      >
        <div
          class="box"
          v-for="(item, index) in reportList"
          :key="index"
          @click="gotoReportDetail(item)"
        >
          <div class="name">{{ item.report_name || '-' }}</div>
          <div class="date">
            <cb-iconfont
              type="icon-lishizuijinshijian"
              color="var(--neutral7)"
            ></cb-iconfont>
            <span class="txt">{{ item.create_time || '-' }}</span>
          </div>
        </div>
      </div>
      <no-data v-else></no-data>
    </div>
  </cb-drawer>
</template>

<script>
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Card from './card';
import {
  getProfileReportDetail,
  getProfileReportList,
} from '../../../../api/intelligence';
import _ from 'lodash';
import NoData from '@/components/empty/index.vue';

export default {
  name: 'report-drawer',
  components: {
    Card,
    NoData,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tabActive: 1,
      pdfOptions: {
        filename: this.$t('intelligence.report.fileName'),
        title: '',
        format: 'a4',
        orientation: 'portrait',
        quality: '1',
      },
      exportLoading: false,
      model: {},
      reportList: [],
      reportId: this.id, // 当前报告id
      loading: false,
      cardIndex: {}, // 卡片序号
      ORDER: [
        'course_data',
        'practice_data',
        'training_data',
        'evaluation_data',
      ],
    };
  },
  computed: {
    computedReportId: {
      get() {
        return this.reportId;
      },
      set(val) {
        this.computedReportId = val;
        return val;
      },
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.reportId = this.id;
      }
    },
    computedReportId(val) {
      if (val) {
        this.initData();
      }
    },
  },
  methods: {
    initData() {
      if (!this.reportId) return;
      // 根据报告id查询报告详情
      this.loading = true;
      getProfileReportDetail({ reportId: this.reportId }).then((res) => {
        this.model = res.data.data;
        this.loading = false;
        // 计算卡片序号,根据ORDER常量排序，如果卡片数据有值，则按序赋值index
        let order = this.ORDER.filter((item, index) => {
          return this.handleContent(item);
        });
        order.forEach((item, index) => {
          this.cardIndex[item] = index + 1;
        });
        this.cardIndex['summary'] = order.length + 1;
      });
    },
    handleChangeTab(data) {
      if (data === 2) {
        this.loading = true;
        getProfileReportList().then((res) => {
          this.reportList = res.data.data || [];
          this.loading = false;
        });
      }
    },
    gotoReportDetail(data) {
      this.tabActive = 1;
      this.reportId = data.report_id;
    },
    // 判断是否有内容，有内容则展示
    handleContent(obj) {
      if (this.model?.hasOwnProperty(obj)) {
        if (!_.isEmpty(this.model[obj])) {
          return true;
        }
      }
      return false;
    },
    async exportToPDF() {
      this.exportLoading = true;
      try {
        const element = this.$refs.pdfContent;
        const pdf = new jsPDF({
          orientation: this.pdfOptions.orientation,
          unit: 'mm',
          format: this.pdfOptions.format,
        });

        // 设置PDF页面尺寸
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // 使用html2canvas将DOM转换为Canvas
        const canvas = await html2canvas(element, {
          scale: 2, // 提高分辨率
          useCORS: true,
          logging: false,
        });
        const imgData = canvas.toDataURL('image/jpeg', this.pdfOptions.quality);
        const imgWidth = pageWidth; // 减去页边距
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let position = 0;
        this.pdfPageCount = 0;

        pdf.addImage(
          imgData,
          'JPEG',
          0,
          0,
          imgWidth,
          imgHeight,
          undefined,
          'FAST',
        );
        position = pageHeight;

        // 计算需要多少页
        let remainingHeight = imgHeight - pageHeight;
        // 添加额外页
        while (remainingHeight > 0) {
          pdf.addPage();
          this.pdfPageCount++;
          pdf.addImage(
            imgData,
            'JPEG',
            0,
            -position,
            imgWidth,
            imgHeight,
            undefined,
            'FAST',
          );
          position += pageHeight;
          remainingHeight -= pageHeight;
        }
        // 保存PDF
        pdf.save(this.pdfOptions.filename);
      } catch (error) {
        console.error('导出PDF失败:', error);
      } finally {
        this.exportLoading = false;
      }
    },
    handleClose() {
      this.reportId = '';
      this.tabActive = 1;
      this.model = {};
      this.reportList = [];
      this.$emit('close', false);
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .cb-drawer .el-drawer__body {
  padding: 16px 0;
}
.header {
  text-align: center;
  .close-btn {
    position: absolute;
    right: 12px;
    cursor: pointer;
  }
  .download-btn {
    position: absolute;
    left: 16px;
  }
}
.content {
  padding: 16px 0;
  background-color: var(--bg-color-2);
  &.current {
    .title {
      font-weight: 600;
      color: var(--netural8);
      font-size: 20px;
      text-align: center;
    }
    .info {
      color: var(--netural7);
      font-size: 14px;
      line-height: 3;
      text-align: center;
      .name {
        margin-right: 24px;
      }
    }
  }
  &.history {
    padding: 16px 0;
    .box {
      display: flex;
      justify-content: space-between;
      background-color: var(--neutral0);
      padding: 8px 24px;
      flex-direction: column;
      color: var(--neutral8);
      cursor: pointer;
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      .name {
        font-weight: 600;
        font-size: 16px;
        line-height: 2;
      }
      .date {
        display: flex;
        align-items: center;
        margin-top: 4px;
        font-size: 12px;
        .txt {
          margin-left: 4px;
        }
      }
    }
  }
}
.empty_page {
  height: calc(100vh - 80px);
}
</style>
