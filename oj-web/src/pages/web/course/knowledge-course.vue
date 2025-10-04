<template>
  <cb-inner-page class="oj-course" :background="false">
    <div class="overflow bg-inner">
      <div class="menuControl">
        <cb-button-group space="middle">
          <cb-button type="text" @click="expand" icon="icon-quanbuzhankai">{{
            $t('course.expandAll')
          }}</cb-button>
          <cb-button type="text" @click="shrink" icon="icon-quanbushouqi">{{
            $t('course.contractAll')
          }}</cb-button>
        </cb-button-group>
      </div>

      <div class="kownledge-course-wrapper" v-loading="loading">
        <div class="jsmind-box" id="jsmindCourse" @click="goToCourse"></div>
      </div>
    </div>
  </cb-inner-page>
</template>
<script>
// import jsMind from 'jsmind';
// import 'jsmind/style/jsmind.css';
import _ from 'lodash';
export default {
  components: {},
  props: {},
  data() {
    return {
      jsmimd: null,
      mindData: [],
      loading: false,
      level1Arr: [],
      level2Arr: [],
    };
  },
  computed: {},
  mounted() {
    // this.initJsMind();
    this.getMindData();
  },
  methods: {
    expand() {
      this.jsmimd.expand_all();
    },
    shrink() {
      for (let i = 0; i < this.level2Arr.length; i++) {
        this.jsmimd.collapse_node(this.level2Arr[i]);
      }
      for (let i = 0; i < this.level1Arr.length; i++) {
        this.jsmimd.collapse_node(this.level1Arr[i]);
      }
    },
    getMindData() {
      this.loading = true;
      this.$request
        .get(
          '/rtks/training-plan/knowledgeTree',
          {},
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          let data = _.get(res, 'data.data');
          this.mindData = data;
          this.showMindData();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    initJsMind() {
      let options = {
        container: 'jsmindCourse',
        editable: false,
        theme: 'primary',
        view: {
          engine: 'svg',
          line_width: 1,
          line_color: '#5D7499',
        },
        layout: {
          hspace: 40,
        },
      };
      // this.jsmimd = new jsMind(options);
    },
    showMindData() {
      let mind = {
        meta: {},
        format: 'node_tree',
        data: this.compileData(),
      };
      this.jsmimd.show(mind);
    },
    goToCourse() {
      let node = _.cloneDeep(this.jsmimd.get_selected_node());
      if (!node || !/^course[0-9]*_/.test(node.id)) return;
      let id = node.id.replace(/^course[0-9]*_/, '');
      if (
        JSON.parse(id.split('%')[1]) == false ||
        JSON.parse(id.split('%')[2]) == 0
      ) {
        if (JSON.parse(id.split('%')[1]) == false) {
          this.$message.error({
            message: this.$t('course.authWarn'),
          });
        } else {
          this.$message.error({
            message: this.$t('course.noCourses'),
          });
        }
      } else {
        this.$router.push({
          path: `/knowledge-course/detail/${id.split('%')[0]}/`,
        });
      }
    },
    compileData() {
      this.level1Arr = [];
      this.level2Arr = [];
      let obj = {
        id: 'root',
        topic: this.$t('course.knowledgeBase'),
        children: [],
      };
      let data = _.cloneDeep(this.mindData);
      let half = ~~(data.length / 2);
      let count = 0;
      data.forEach((el, i) => {
        let idBakup = 'level_' + el.category + '-' + ~~(Math.random() * 9999);
        this.level1Arr.push(idBakup);
        obj.children.push({
          id: idBakup,
          topic: el.category,
          direction: i < half ? 'left' : 'right',
          children: el.knowledge_res_list.map((skill) => {
            count++;
            this.level2Arr.push('skill_' + skill.resource_id + skill.content);
            return {
              id: 'skill_' + skill.resource_id + skill.content,
              topic: skill.resource_id + '\t\t' + skill.content,
              children: skill.course_list
                ? skill.course_list.map((course) => {
                    return {
                      id:
                        'course' +
                        count +
                        '_' +
                        course.resource_id +
                        '%' +
                        course.interview +
                        '%' +
                        course.lesson_count,
                      topic: course.name,
                    };
                  })
                : [],
            };
          }),
        });
      });
      return obj;
    },
  },
};
</script>
<style lang="scss" scoped>
.menuControl {
  display: flex;
  justify-content: flex-end;
  position: relative;
  top: -10px;
}
.oj-course {
  .course-fade-enter-active,
  .course-fade-leave-active {
    transition: all 0.5s;
  }
  .course-fade-enter,
  .course-fade-leave-to {
    opacity: 0;
  }
  .course-pagination {
    .ant-pagination.mini {
      margin: 0 !important;
    }
  }
}
.jsmind-inner {
  overflow: initial;
}

.kownledge-course-wrapper {
  ::v-deep .jsmind-inner {
    min-height: 760px;

    &::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--scroll-bar-bg-color);
    }
    jmnodes {
      min-width: 620px;
    }
    jmnode {
      max-width: 600px;
      white-space: normal;
      overflow: auto;
    }
    jmnode {
      background: var(--bg-color-secondary) !important;
      border: 1px solid rgba(11, 218, 255, 0.6) !important;
      box-shadow: none !important;
      border-radius: 3px !important;
      font-size: 14px;
      padding: 8px 10px;
      min-width: 120px;
      box-sizing: border-box;
      color: var(--font-color-primary);
    }

    jmnode[nodeid='root'] {
      font-size: 16px !important;
      min-width: unset;
      min-height: 120px;
      font-weight: bold;
      writing-mode: vertical-lr;
      text-align: center;
    }

    jmnode[nodeid^='course'] {
      color: var(--primary-color);
      cursor: pointer;
    }

    jmexpander {
      width: 12px;
      height: 12px;
      border-color: var(--primary-color) !important;
      color: var(--primary-color) !important;
      line-height: 8px;
    }

    jmnode:hover {
      box-shadow: none !important;
    }

    .selected {
      box-shadow: none !important;
      background: var(--bg-color-secondary) !important;
      border: 1px solid rgba(11, 218, 255, 0.6) !important;
    }
  }
}
</style>
