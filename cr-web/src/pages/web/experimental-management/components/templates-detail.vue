<template>
  <cb-inner-page :background="false">
    <div class="template-detail-wrap">
      <temp-detail>
        <cb-button
          @click="createTrain(resourceId, templateId)"
          hollow
          mr
        >{{
          $t('list.addTraining')
        }}</cb-button>
        <cb-button
          hollow
          @click="templateChange(templateId)"
        >{{ $t('模板修改') }}</cb-button>
      </temp-detail>
    </div>
  </cb-inner-page>
</template>

<script>
import { getTemplatePermission } from '@/api/web/red-blue';
import tempDetail from './temp-detail.vue';
import { EXPERIMENTAL_SUBJECT_TEMPLATE_EDTAIL_TO_TEMPLATE_EDIT } from '../constants'
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
  mounted() { },
  methods: {
    // 训练模板详情页面点击创建训练
    createTrain(resourceId, templateId) {
      getTemplatePermission({ resource_id: templateId }).then((res) => {
        this.$router.push({
          name: this.$route.meta?.breadcrumb?.parentName + '-add',
          // name: 'team-train-add',
          params: {
            resource_id: this.$route.params.resource_id,
            template_id: this.$route.params.template_id,
            templateId: resourceId,
            business_template_id: this.$route.params.template_id,
          },
        });
      });
    },
    templateChange(business_template_id) {
      this.$router.push({
        name: EXPERIMENTAL_SUBJECT_TEMPLATE_EDTAIL_TO_TEMPLATE_EDIT[this.$route.name],
        params: {
          id: business_template_id
        }
      })
    },
  },
};
</script>
<style lang="scss" scoped></style>
