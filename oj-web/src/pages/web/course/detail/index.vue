<template>
  <div>
    <div class="course-detail">
      <div class="course-detail-content">
        <div class="left-content">
          <div class="couse-info">
            <div class="img-box">
              <img :src="courseInfo.logo || defaultLogo" alt="" />
              <div
                class="level-box"
                :class="{
                  'level-high':
                    courseInfo.difficulty === DIFFICULTY.ADVANCED ||
                    courseInfo.stage === DIFFICULTY.ADVANCED,
                  'level-middle':
                    courseInfo.difficulty === DIFFICULTY.MEDIUM ||
                    courseInfo.stage === DIFFICULTY.MEDIUM,
                  'level-low':
                    courseInfo.difficulty === DIFFICULTY.PRIMARY ||
                    courseInfo.stage === DIFFICULTY.PRIMARY,
                }"
              >
                <template
                  v-if="
                    courseInfo.difficulty === DIFFICULTY.ADVANCED ||
                    courseInfo.stage === DIFFICULTY.ADVANCED
                  "
                >
                  <div
                    class="level-span"
                    :class="language === 'en-US' ? 'level-span-high-en' : ''"
                  >
                    {{ $t('m.highLevel') }}
                  </div>
                </template>
                <template
                  v-if="
                    courseInfo.difficulty === DIFFICULTY.MEDIUM ||
                    courseInfo.stage === DIFFICULTY.MEDIUM
                  "
                >
                  <div
                    class="level-span"
                    :class="language === 'en-US' ? 'level-span-middle-en' : ''"
                  >
                    {{ $t('m.middleLevel') }}
                  </div>
                </template>
                <template
                  v-if="
                    courseInfo.difficulty === DIFFICULTY.PRIMARY ||
                    courseInfo.stage === DIFFICULTY.PRIMARY
                  "
                >
                  <div
                    class="level-span"
                    :class="language === 'en-US' ? 'level-span-low-en' : ''"
                  >
                    {{ $t('m.lowLevel') }}
                  </div>
                </template>
              </div>
            </div>
            <div class="info-box">
              <span class="course-name one-overflow">{{
                courseInfo.name
              }}</span>
              <div class="info-detail">
                <cb-row>
                  <cb-col
                    class="one-overflow common-label"
                    :class="
                      language === 'en-US' ? 'width-left-en' : 'width-left'
                    "
                  >
                    <cb-iconfont
                      class="icontime"
                      type="icon-fenlei"
                      themedColor="--parimary-color"
                    ></cb-iconfont>
                    <div class="left-label">{{ $t('m.classify') }}</div>
                  </cb-col>
                  <cb-col
                    class="common-label"
                    :class="
                      language === 'en-US' ? 'width-center-en' : 'width-center'
                    "
                    >：</cb-col
                  >
                  <cb-col
                    class="common-label"
                    :class="
                      language === 'en-US' ? 'width-right-en' : 'width-right'
                    "
                    ><span class="tag-span">{{
                      courseInfo.direction_name
                    }}</span>
                  </cb-col>
                </cb-row>
                <cb-row>
                  <cb-col
                    class="one-overflow common-label"
                    :class="
                      language === 'en-US' ? 'width-left-en' : 'width-left'
                    "
                  >
                    <cb-iconfont
                      class="icontime"
                      type="icon-keshishu"
                      themedColor="--green-color"
                    ></cb-iconfont>
                    <div class="left-label">{{ $t('m.lessonCount') }}</div>
                  </cb-col>
                  <cb-col
                    class="common-label"
                    :class="
                      language === 'en-US' ? 'width-center-en' : 'width-center'
                    "
                    >：</cb-col
                  >
                  <cb-col
                    class="common-label"
                    :class="
                      language === 'en-US' ? 'width-right-en' : 'width-right'
                    "
                    ><span class="lesson-count">{{
                      courseInfo.lesson_count
                    }}</span></cb-col
                  >
                </cb-row>
                <cb-row>
                  <cb-col
                    class="one-overflow common-label"
                    :class="
                      language === 'en-US' ? 'width-left-en' : 'width-left'
                    "
                  >
                    <cb-iconfont
                      class="icontime"
                      type="icon-xuefen"
                      themedColor="--green-color"
                    ></cb-iconfont>
                    <div class="left-label">{{ $t('course.credit') }}</div>
                  </cb-col>
                  <cb-col
                    class="common-label"
                    :class="
                      language === 'en-US' ? 'width-center-en' : 'width-center'
                    "
                    >：</cb-col
                  >
                  <cb-col
                    class="common-label"
                    :class="
                      language === 'en-US' ? 'width-right-en' : 'width-right'
                    "
                    ><span class="course-score">{{
                      courseInfo.score
                    }}</span></cb-col
                  >
                </cb-row>
                <cb-row>
                  <cb-col
                    class="one-overflow common-label"
                    :class="
                      language === 'en-US' ? 'width-left-en' : 'width-left'
                    "
                  >
                    <cb-iconfont
                      class="icontime"
                      type="icon-jiangshi"
                      themedColor="--primary-color"
                    ></cb-iconfont>
                    <div class="left-label">{{ $t('course.lecturer') }}</div>
                  </cb-col>
                  <cb-col
                    class="common-label"
                    :class="
                      language === 'en-US' ? 'width-center-en' : 'width-center'
                    "
                    >：</cb-col
                  >
                  <cb-col
                    class="common-label"
                    :class="
                      language === 'en-US' ? 'width-right-en' : 'width-right'
                    "
                    ><span class="course-lecturer">{{
                      courseInfo.lecturer
                    }}</span></cb-col
                  >
                </cb-row>
                <cb-row>
                  <cb-col
                    class="one-overflow common-label"
                    :class="
                      language === 'en-US' ? 'width-left-en' : 'width-left'
                    "
                  >
                    <cb-iconfont
                      class="icontime"
                      type="icon-jianjie"
                      themedColor="--orange-color"
                    ></cb-iconfont>
                    <div class="left-label">{{ $t('m.desc') }}</div>
                  </cb-col>
                  <cb-col
                    class="common-label"
                    :class="
                      language === 'en-US' ? 'width-center-en' : 'width-center'
                    "
                    >：</cb-col
                  >
                  <cb-col
                    class="common-label desc-box"
                    :class="
                      language === 'en-US' ? 'width-right-en' : 'width-right'
                    "
                  >
                    <div class="desc-div four-overflow">
                      <span
                        class="course-desc-span"
                        :title="courseInfo.description"
                      >
                        {{ courseInfo.description }}
                      </span>
                    </div>
                  </cb-col>
                </cb-row>
              </div>
            </div>
            <div class="favorite-star" @click="collectCourse">
              <cb-iconfont
                :type="isCollect ? 'icon-yishoucang' : 'icon-weishoucang'"
                themedColor="orange-color"
                size="16"
              />
              <span
                ><template v-if="isCollect">{{ $t('m.collected') }}</template
                ><template v-else>{{ $t('m.collect') }}</template></span
              >
            </div>
          </div>
          <div class="couse-bottom">
            <div class="tabs-header">
              <cb-tabs v-model="tabActive" type="border-card">
                <cb-tab-pane :name="$t('m.courseOutline')" v-if="isOutLine">
                  <span slot="label">
                    <span class="label-span">{{ $t('m.courseOutline') }}</span>
                  </span>
                  <course-outline
                    v-if="tabActive === this.$t('m.courseOutline') && isOutLine"
                    :outline-data="isOutLine"
                  ></course-outline>
                </cb-tab-pane>
                <cb-tab-pane :name="$t('m.courseCatalog')">
                  <span slot="label">
                    <span class="label-span">{{ $t('m.courseCatalog') }}</span>
                  </span>
                  <course-tree :tree-data="courseTree"></course-tree>
                </cb-tab-pane>
                <cb-tab-pane :name="$t('m.myNotes')" :lazy="true">
                  <span slot="label">
                    <span class="label-span">{{ $t('m.myNotes') }}</span>
                  </span>
                  <my-notes
                    ref="detailNotes"
                    :mark-notes.sync="courseNotes"
                    :businessType="BUSINESS_TYPE.OJ_WEB_COURSE"
                    @submitNote="detailSubmitNote"
                    :restType="1"
                    :fileSize="1024 * 1024 * 1024"
                  ></my-notes>
                </cb-tab-pane>
                <cb-tab-pane :name="$t('m.leaveMessage')">
                  <span slot="label">
                    <span class="label-span">{{ $t('m.leaveMessage') }}</span>
                  </span>
                  <leave-message
                    :comment-type="COMMENT_TYPE.COURSE"
                    :comments="comments"
                    @sendComment="sendComment"
                    @subLike="sendLike"
                  ></leave-message>
                </cb-tab-pane>
              </cb-tabs>
            </div>
          </div>
        </div>
        <div class="see-more">
          <Block
            :title="
              $route.path.indexOf('all-course') != -1
                ? $t('m.goodCourses')
                : $t('m.careerPathCourses')
            "
          ></Block>
          <div class="related-course">
            <template v-if="relatedLists.length">
              <template v-if="$route.path.indexOf('all-course') == -1">
                <course-card
                  v-for="(item, index) in relatedLists"
                  :key="index"
                  @goTo="gotoLesson"
                  :card-data="item"
                  :currentId="currentId"
                ></course-card>
              </template>
              <template v-else>
                <course-card-good
                  v-for="(item, index) in relatedLists"
                  :key="index"
                  @goTo="gotoLesson"
                  :card-data="item"
                  :currentId="currentId"
                ></course-card-good>
              </template>
            </template>
            <empty v-else></empty>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Empty from '@/components/empty/index.vue';
import CourseCard from './components/course-card.vue';
import CourseCardGood from './components/course-card-good.vue';
import Default from '@/assets/img/course/logo.jpg';
import CourseOutline from './components/course-outline';
import CourseTree from './components/course-tree';
import MyNotes from '@/components/notes/my-notes';
import LeaveMessage from '@/components/leave-message/index';
import Block from '@/components/block';
import _ from 'lodash';
import { setBreadcrumbTitle } from '@cyber/ui';
import { getLanguage } from '@cyber/helper';
import {
  NOTE_TYPE,
  RESOURCE_TYPE,
  COMMENT_TYPE,
  BUSINESS_TYPE,
  DIFFICULTY,
} from '@/pages/web/course/constant.js';
export default {
  components: {
    CourseCard,
    CourseOutline,
    CourseTree,
    MyNotes,
    LeaveMessage,
    Empty,
    Block,
    CourseCardGood,
  },
  data() {
    return {
      DIFFICULTY,
      BUSINESS_TYPE,
      COMMENT_TYPE,
      isOutLine: false,
      tabActive: this.$t('m.courseCatalog'),
      defaultLogo: Default,
      courseInfo: {},
      relatedLists: [],
      isCollect: false,
      courseTree: [],
      comments: [],
      resourceId: '',
      courseNotes: '',
      isShowDialog: false,
      dialogContent: '',
      dialogType: '',
      courseName: '',
      language: getLanguage(),
    };
  },
  computed: {
    breadList: {
      get() {
        return [
          {
            title: this.$t('m.course'),
            path: '/course',
          },
          {
            title: this.courseName,
          },
        ];
      },
    },
    currentId() {
      return this.$route.params.resource_id;
    },
  },
  watch: {
    tabActive: {
      handler(val, oldval) {
        if (val === this.$t('m.myNotes')) {
          this.getNotes();
        }
        if (val === this.$t('m.leaveMessage')) {
          this.getLeaveMessage();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.resourceId = this.$route.params && this.$route.params.resource_id;
    if (Number(this.$route.query.comment_type) === COMMENT_TYPE.COURSE) {
      this.tabActive = this.$t('m.leaveMessage');
    } else if (Number(this.$route.query.resource_type) === 1) {
      this.tabActive = this.$t('m.myNotes');
    }
  },
  mounted() {
    this.getCourseDetail();
    this.initTreeData();
    this.getGoodCourse();
  },
  methods: {
    // 相关好课跳转
    gotoLesson(val) {
      if (val.interview == false || val.lesson_count == 0) {
        if (val.interview == false) {
          this.$message.error({
            message: this.$t('course.authWarn'),
          });
        } else {
          this.$message.error({
            message: this.$t('course.noCourses'),
          });
        }
      } else {
        if (this.$route.path.indexOf('all-course') != -1) {
          this.$router.push({ path: `/all-course/detail/${val.resource_id}/` });
        } else if (this.$route.path.indexOf('knowledge-course') != -1) {
          this.$router.push({
            path: `/knowledge-course/detail/${val.resource_id}/`,
          });
        } else {
          this.$router.push({ path: `/course/detail/${val.resource_id}/` });
        }
      }

      // this.$router.go(0)
    },
    // 获取课程详细信息
    getCourseDetail() {
      this.$request
        .get(
          '/oj/course',
          {
            resource_id: this.resourceId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.courseInfo = res.data.data;
          this.courseName = res.data.data.name;
          setBreadcrumbTitle(this.courseName);
          if (res.data.data.outline) {
            this.isOutLine = res.data.data.outline;
            this.tabActive = this.$t('m.courseOutline');
            if (
              Number(this.$route.query.comment_type) === COMMENT_TYPE.COURSE
            ) {
              this.tabActive = this.$t('m.leaveMessage');
            }
          }
          if (res.data.data.is_collection) {
            this.isCollect = true;
          }
        });
    },
    // 收藏课程
    collectCourse() {
      // business_type	资源类型 0=理论题 1=漏洞题(暂时无用) 2=实操题 3=课程 4=课时
      this.$request
        .post(
          '/oj/collection',
          {
            business_id: this.resourceId,
            business_type: 3,
            is_collection: !this.isCollect,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.isCollect = !this.isCollect;
        });
    },
    // 获取课程目录
    initTreeData() {
      this.$request
        .get(
          '/oj/lessonconfig',
          {
            course_id: this.resourceId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const treeArray = [];
          treeArray.push(res.data.data);
          _.forEach(treeArray, (item) => {
            _.forEach(item.children, (list) => {
              if (item.course_id) {
                // 1、章节  course有值时，显示 第1章             没值时，显示1.1  1.2
                // 1、课时  course有值时，显示 课时12345         没值时，显示1.1  1.2
                this.$set(list, 'course_type', true);
              } else {
                this.$set(list, 'course_type', false);
              }
              if (list.children) {
                _.forEach(list.children, (third) => {
                  if (list.course_id) {
                    this.$set(third, 'course_type', true);
                  } else {
                    this.$set(third, 'course_type', false);
                  }
                  if (third.children) {
                    _.forEach(third.children, (fourth) => {
                      if (third.course_id) {
                        this.$set(fourth, 'course_type', true);
                      } else {
                        this.$set(fourth, 'course_type', false);
                      }
                      if (fourth.children) {
                        _.forEach(fourth.children, (fifth) => {
                          if (fourth.course_id) {
                            this.$set(fifth, 'course_type', true);
                          } else {
                            this.$set(fifth, 'course_type', false);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          });
          this.courseTree = treeArray;
        });
    },
    // 获取相关好课
    getGoodCourse() {
      this.$request
        .get(
          '/api/ojj/course/train/role/path',
          {
            resource_id: this.resourceId,
          },
          {
            baseURL: '',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', []);
          this.relatedLists = data;
          if (this.relatedLists === null) {
            this.relatedLists = [];
          }
          let index = this.relatedLists.findIndex((el) => {
            return el.resource_id == this.currentId;
          });
          if (index > -1) {
            index = index === 0 ? index : --index;
            this.relatedLists = this.relatedLists.splice(index, 3);
            this.relatedLists.forEach((el) => {
              el.course_time_formate = this.formatCourseTime(
                el.course_duration,
              );
            });
          } else {
            this.relatedLists.forEach((el) => {
              el.course_time_formate = this.formatCourseTime(
                el.course_duration,
              );
            });
          }
        });
    },
    formatCourseTime(minutes) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      let time = '';
      let hourFormat = '';
      if (hour > 1) {
        hourFormat = hour + (this.language === 'en-US' ? 'h ' : ' 小时 ');
      } else {
        hourFormat = hour + (this.language === 'en-US' ? 'h ' : ' 小时 ');
      }
      let minFormat = '';
      if (min > 1) {
        minFormat = min + (this.language === 'en-US' ? 'm' : ' 分 ');
      } else {
        minFormat = min + (this.language === 'en-US' ? 'm' : ' 分 ');
      }
      if (hour > 0 && min > 0) {
        time = hourFormat + minFormat;
      } else if (hour <= 0 && min > 0) {
        time = minFormat;
      } else if (hour > 0 && min <= 0) {
        time = hourFormat;
      }
      return time;
    },
    // 获取我的笔记
    getNotes() {
      this.$request
        .get(
          '/oj/note',
          {
            resource_id: this.resourceId,
            note_type: NOTE_TYPE.NOTE,
            resource_type: RESOURCE_TYPE.COURSE,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.courseNotes = res.data.data == null ? '' : res.data.data.content;
        });
    },
    // 提交笔记
    detailSubmitNote(val) {
      this.$request
        .post(
          '/oj/note',
          {
            business_id: this.resourceId,
            note_type: NOTE_TYPE.NOTE,
            business_type: RESOURCE_TYPE.COURSE,
            content: val,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.$message.success(this.$t('m.saveSuccessful'));
        });
    },
    // 获取留言()
    getLeaveMessage() {
      this.$request
        .get(
          '/oj/comment/list',
          {
            business_id: this.resourceId,
            business_type: RESOURCE_TYPE.COURSE,
            per_page: 1000,
            page: 1,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.comments = res.data.data.list;
          _.forEach(this.comments, (item) => {
            this.$set(item, 'inputShow', false);
            if (item.comment_reply) {
              _.forEach(item.comment_reply, (second) => {
                this.$set(second, 'inputShow', false);
              });
            }
          });
        });
    },
    // 提交留言
    sendComment(params) {
      this.$request
        .post(
          '/oj/comment/',
          Object.assign({}, params, {
            business_id: this.resourceId,
            business_type: RESOURCE_TYPE.COURSE,
            theme_name: this.courseName,
          }),
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.getLeaveMessage();
        });
    },
    sendLike(val, isLike) {
      this.$request
        .post(
          '/oj/comment/is_like',
          {
            resource_id: val,
            is_like: !isLike,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.getLeaveMessage();
        });
    },
  },
};
</script>
<style scoped lang="scss">
.course-detail {
  width: 100%;

  .course-detail-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .left-content {
      width: calc(100% - 25.84% - 10px);
      margin-right: 20px;
      .couse-info {
        display: flex;
        width: 100%;
        border-radius: 2px;
        box-sizing: border-box;
        padding: 24px;
        overflow: hidden;
        position: relative;
        margin-bottom: 20px;
        background-color: var(--bg-color-2);
        .img-box {
          width: 30%;
          max-width: 360px;
          position: relative;
          img {
            width: 100%;
            display: block;
            border-radius: 2px;
          }
          .level-box {
            min-width: 56px;
            height: 24px;
            position: absolute;
            top: 0;
            left: 0;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px 0px 4px 0px;
            .level-span {
              font-size: 14px;
              color: var(--white-color);
            }
          }
        }
        .level-low {
          background: var(--primary-color);
        }
        .level-middle {
          background: var(--orange-color);
        }
        .level-high {
          background: var(--red-color);
        }
        .info-box {
          width: 60%;
          padding-left: 30px;
          box-sizing: border-box;
          .course-name {
            display: block;
            font-size: 20px;
            font-family: Microsoft YaHei;
            font-weight: 400;
          }
          .info-detail {
            margin-top: 13px;
            .el-row {
              padding: 7px 0;
            }
            .common-label {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              height: 16px;
              line-height: 16px;
            }
            .left-label {
              width: calc(100% - 30px);
              float: right;
              text-align: justify;
              text-align-last: justify;
            }
            .tag-span {
              text-align: center;
              margin: 0 10px 5px 0;
              border-radius: 2px;
            }
            .desc-div {
              width: 100%;
            }
            .desc-box {
              height: auto;
            }
          }
        }
        .favorite-star {
          position: absolute;
          top: 20px;
          right: 15px;
          text-align: center;
          cursor: pointer;
          i {
            display: block;
            margin-bottom: 5px;
          }
          span {
            font-size: 14px;
          }
        }
      }
      .couse-bottom {
        .tabs-header {
          width: 100%;
        }
        .tabs-content {
          width: 100%;
          min-height: 400px;
        }
      }
    }
    .see-more {
      width: 25.84%;
      border-radius: 2px;
      background: var(--bg-color-2);
      padding: 16px;

      .related-course {
        min-height: 260px;
        display: flex;
        flex-direction: column;

        .course-card:nth-last-child(2) {
          ::v-deep .link-line {
            display: none;
          }
        }

        .view-more {
          clear: both;
          text-align: center;
          .elc-dialog-btn-cancel {
            width: 168px;
            margin-right: 0;
          }
        }
      }
      .empty_page {
        height: 224px;
      }
    }
  }
  .width-left-en {
    width: 111px;
  }
  .width-center-en {
    width: 15px;
  }
  .width-right-en {
    width: calc(100% - 126px);
  }
  .width-left {
    width: 90px;
  }
  .width-center {
    width: 15px;
  }
  .width-right {
    width: calc(100% - 105px);
  }
}
</style>
<style lang="scss" scope>
.course-name,
.common-label {
  color: var(--neutral8);
}
.tag-span,
.lesson-count,
.course-score,
.course-lecturer,
.course-desc-span {
  color: var(--neutral7);
}
</style>
