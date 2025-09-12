<template>
  <cb-inner-page :background="true" title="课程规划">
    <div class="box-card add-content">
      <cb-form
        :ref="formRef"
        :model.sync="model"
        label-width="100px"
        :rules="rules"
        :url="url"
        baseURL="/api/ojj"
        :id="id && { resource_id: id }"
        json
        :isBgColor="true"
      >
        <cb-form-item :label="$t('m.courseName')" prop="name">
          <cb-input v-model="model.name"></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('m.direction')" prop="category_id">
          <cb-select
            v-model="model.category_id"
            :options="directionOptions"
            title-field="name"
            value-field="resource_id"
          ></cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('m.difficulty')" prop="difficulty">
          <cb-select
            v-model="model.difficulty"
            :options="difficultyOptions"
          ></cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('course.cover')" prop="Logo">
          <cb-button
            color-type="hollow"
            icon="icon-daoru"
            @click="openUploadImg"
            >{{ $t('common.import') }}</cb-button
          >
        </cb-form-item>
        <cb-form-item v-if="model.logo !== ''">
          <img class="showImg" v-if="model.logo !== ''" :src="model.logo" />
        </cb-form-item>
        <cb-form-item :label="$t('m.lecturer')" prop="lecturer">
          <cb-input v-model="model.lecturer"></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('m.studentScore')" prop="score">
          <cb-input-number
            class="number-text"
            v-model="model.score"
            :controls="false"
            :min="0"
          ></cb-input-number>
        </cb-form-item>
        <cb-form-item v-if="id" :label="$t('m.courseNumber')" prop="course_num">
          <cb-input
            v-model="model.course_num"
            :disabled="id ? true : false"
          ></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('m.description')" prop="description">
          <cb-input
            v-model="model.description"
            type="textarea"
            :rows="5"
          ></cb-input>
        </cb-form-item>
        <cb-form-item
          :label="$t('m.syllabus')"
          prop="outline"
          style="width: 100%"
        >
          <mavon-editor
            :mavon-data.sync="model.outline"
            :businessType="BUSINESS_TYPE.OJ_CMS_COURSE"
            :attachmentType="ATTACHMENT_TYPE.OJ_ADMIN_COURSE"
            :fileSize="1024 * 1024 * 1024"
          ></mavon-editor>
        </cb-form-item>
        <cb-form-item :label="$t('m.isPublic')" prop="is_public">
          <cb-switch
            :active-color="$themed('--green-color')"
            v-model="model.is_public"
          ></cb-switch>
        </cb-form-item>
        <template slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button
              class="mr"
              @click="submit"
              button-type="confirm"
            ></cb-button>
            <cb-button @click="cancel" button-type="cancel"></cb-button>
          </cb-button-group>
        </template>
      </cb-form>
      <cb-dialog :visible.sync="dialogVisible" :title="$t('m.courseUpload')"
        ><span class="modal-style">
          <cutimg
            :businessType="BUSINESS_TYPE.OJ_CMS_COURSE"
            @sendFormData="getImgUrl"
          ></cutimg> </span
      ></cb-dialog>
    </div>
  </cb-inner-page>
</template>
<script>
import Cutimg from '@/components/cut-img/index.vue';
import Constant from './course-constant.js';
import MavonEditor from '@/components/markdown/mavon-editor.vue';
import Validate from '@/utils/validate.js';
import Utils from '@/utils/util';
import { BUSINESS_TYPE } from '@/pages/cms/course-mod/course-constant.js';
import { ATTACHMENT_TYPE } from '@/constants/attachment.js';

export default {
  components: {
    Cutimg,
    MavonEditor,
  },
  props: {
    id: {
      type: String,
      default() {
        return undefined;
      },
    },
  },
  data() {
    var description = (rule, value, callback) => {
      if (value) {
        const len = Utils.getByteLen(value);
        if (len < 1 || len > 2048) {
          callback(new Error(this.$t('m.validataProfile')));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    //学分校验0-1000
    const score = (rule, value, callback) => {
      if (value) {
        if (value < 0 || value > 1000) {
          callback(new Error(this.$t('m.validataScore')));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      // 难度分类
      difficultyOptions: [],
      BUSINESS_TYPE,
      ATTACHMENT_TYPE,
      formRef: 'formRef',
      model: {
        name: '',
        category_id: '',
        difficulty: 0,
        lecturer: '',
        score: '',
        description: '',
        outline: '',
        is_public: true,
        logo: '',
        // 配合java 新接口，先设置0，基础课程
        course_type: 0,
        course_num: '',
      },
      url: '/oj/admin/course',
      rules: {
        name: [
          {
            required: true,
            validator: Validate.courseName,
            trigger: ['blur', 'change'],
          },
        ],
        category_id: [
          {
            required: true,
            message: this.$t('m.pleaseChooseDirection'),
            trigger: 'change',
          },
        ],
        description: [{ validator: description, trigger: 'blur' }],
        score: [{ validator: score, trigger: 'blur' }],
        course_num: [
          // {
          //   required: true,
          //   message: this.$t('m.pleaseEnterCourseNum'),
          //   trigger: 'blur',
          // },
        ],
        // 讲师校验1-64
        lecturer: [{ validator: Validate.lecturers64, trigger: 'blur' }],
      },
      directionOptions: [],
      dialogVisible: false,
    };
  },
  computed: {
    labelWidth() {
      return this.$store.state.app.labelWidth;
    },
    labelWidthForm() {
      return `${this.labelWidth}px`;
    },
    $CONSTANT() {
      return Constant;
    },
  },
  created() {
    this.getDirectionOptions();
    this.getDifficultyOptions();
  },
  mounted() {
    if (this.id) {
      this.$refs.formRef.getModelData();
    }
  },
  methods: {
    getDifficultyOptions() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 9,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          let arr = res.data.data;
          arr = arr.map((item) => {
            return {
              value: item.code,
              label: item.name,
            };
          });
          this.difficultyOptions = arr;
        });
    },
    getDirectionOptions() {
      this.$request
        .get(
          '/oj/admin/course/direction/list',
          {
            children: false,
            page: 1,
            per_page: 9999,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.directionOptions = _.get(res, 'data.data.list', []);
          this.model.category_id = _.get(
            res,
            'data.data.list',
            [],
          )[0].resource_id;
        });
    },
    openUploadImg() {
      this.dialogVisible = true;
    },
    getImgUrl(data) {
      this.model.logo = data;
      this.dialogVisible = false;
    },
    cancel() {
      this.$router.push({
        name: 'courses',
      });
    },
    // 表单提交
    submit() {
      this.$refs.formRef.submit().then((res) => {
        this.cancel();
      });
    },
  },
};
</script>
<style lang="scss">
.number-text .el-input .el-input__inner {
  text-align: left;
}
.showImg {
  width: 300px;
  height: 170px;
}
</style>
