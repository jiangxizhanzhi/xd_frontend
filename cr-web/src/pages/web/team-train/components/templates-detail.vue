<template>
  <cb-inner-page :background="false">
    <div class="template-detail-wrap">
      <temp-detail>
        <cb-button @click="createTrain(resourceId, templateId)" hollow>{{
          $t('list.addTraining')
        }}</cb-button>
      </temp-detail>
    </div>
  </cb-inner-page>
</template>

<script>
import { getTemplatePermission } from '@/api/web/red-blue';
import tempDetail from './temp-detail.vue';
export default {
  components: {
    tempDetail,
  },
  props: {},
  data() {
    return {
      breadcrumbName: '',
      resourceId: '',
      templateId: '',
    };
  },
  watch: {},
  computed: {},
  created() {
    this.resourceId = this.$route.params.resource_id;
    this.templateId = this.$route.params.template_id;
  },
  mounted() {},
  methods: {
    // 训练模板详情页面点击创建训练
    createTrain(resourceId, templateId) {
      getTemplatePermission({ resource_id: templateId }).then((res) => {
        this.$router.push({
          name: 'team-train-add',
          params: {
            resource_id: this.$route.params.resource_id,
            template_id: this.$route.params.template_id,
            templateId: resourceId,
            business_template_id: this.$route.params.template_id,
          },
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
