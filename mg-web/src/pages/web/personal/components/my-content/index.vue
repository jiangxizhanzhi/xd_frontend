<template>
  <div class="oj-my-module">
    <!-- 我的提问 -->
    <div v-show="this.indexValue === 1">
      <div class="title">
        <i class="el-icon-arrow-left arrow-style" @click="goNextFn()"></i>
        <span class="text-style">
          <span> {{ $t('personal.myQuestion') }}</span>
        </span>
        <span class="num-style">({{ this.questionNum }})</span>
      </div>
      <div>
        <cb-search-table
          v-if="showQuestion"
          ref="myQuestionRef"
          :fetchPromise="fetchPromise"
          :thumbCard="thumbCard"
        >
          <template v-slot:thumb="scope">
            <my-question :tableDatas="scope.data" />
          </template>
        </cb-search-table>
      </div>
    </div>
    <!-- 我的回复 -->
    <div v-show="this.indexValue === 2">
      <div class="title">
        <i class="el-icon-arrow-left arrow-style" @click="goNextFn()"></i>
        <span class="text-style">
          <span>{{ $t('personal.myReply') }}</span>
        </span>
        <span class="num-style">({{ this.answerNum }})</span>
      </div>

      <div>
        <cb-search-table
          v-if="showReplay"
          ref="myAnswerRef"
          :fetchPromise="fetchPromiseAnswer"
          :thumbCard="thumbCard"
        >
          <template v-slot:thumb="scope">
            <my-answer :tableDatas="scope.data" />
          </template>
        </cb-search-table>
      </div>
    </div>
    <!-- 我的笔记 -->
    <div v-show="this.indexValue === 3">
      <div class="title">
        <i class="el-icon-arrow-left arrow-style" @click="goNextFn()"></i>
        <span class="text-style">
          <span>{{ $t('personal.myNotes') }}</span>
        </span>
        <span class="num-style">({{ this.noteNum }})</span>
      </div>
      <div class="select-style">
        <cb-radio-group v-model="queryNote.businessType" size="medium">
          <cb-radio-button
            v-for="(item, index) in radioBtnNoteLists"
            :key="index"
            :label="item.value"
          >
            {{ item.label }}
          </cb-radio-button>
        </cb-radio-group>
      </div>
      <div>
        <cb-search-table
          v-if="showNote"
          ref="myNotesRef"
          :fetchPromise="fetchPromiseNote"
          :thumbCard="thumbCard"
          :data="queryNote"
        >
          <template v-slot:thumb="scope">
            <my-note
              :tableDatas="scope.data"
              :theoryType="getNoteTheoryType(scope.data)"
              :filterType="getFilterType(scope.data)"
            />
          </template>
        </cb-search-table>
      </div>
    </div>

    <!-- 我的收藏 -->
    <div v-show="this.indexValue === 4">
      <div>
        <div class="title collection-style">
          <i class="el-icon-arrow-left arrow-style" @click="goNextFn()"></i>
          <span class="text-style">
            <span> {{ $t('personal.myCollection') }}</span>
          </span>
          <span class="num-style">({{ collectionNum }})</span>
        </div>
        <div class="type-style"></div>
      </div>
      <div class="select-style">
        <cb-radio-group v-model="query.type" size="medium">
          <cb-radio-button
            v-for="(item, index) in radioBtnLists"
            :key="index"
            :label="item.value"
          >
            {{ item.label }}
          </cb-radio-button>
        </cb-radio-group>
      </div>
      <div style="position: relative">
        <cb-search-table
          v-if="showCollection"
          ref="myCollectionRef"
          :thumbCard="thumbCard"
          :data="query"
          :fetchPromise="fetchPromiseCollection"
        >
          <template v-slot:thumb="scope">
            <my-collection
              :tableDatas="scope.data"
              :collectionLists="collectionLists"
              :theoryType="getNoteTheoryType(scope.data)"
            ></my-collection>
          </template>
        </cb-search-table>
      </div>
    </div>
    <!-- 我的错题 -->
    <div v-show="this.indexValue === 5">
      <div class="title">
        <i class="el-icon-arrow-left arrow-style" @click="goNextFn()"></i>
        <span class="text-style">
          <span>{{ $t('personal.myMistake') }}</span>
        </span>
        <span class="num-style">({{ this.questionMistakeNum }})</span>
      </div>
      <div class="select-btn">
        <cb-button
          hollow
          icon="icon-chuanshu"
          :disabled="selection.length === 0"
          @click="deleteSelectError(selection, $event)"
        >
          {{ $t('personal.batchRemove') }}
        </cb-button>
      </div>
      <div>
        <cb-search-table
          v-if="showError"
          ref="myErrorRef"
          :fetchPromise="fetchPromiseMistake"
          :searchBarBg="false"
          :cols.sync="cols"
          :selector="selector"
          :selection.sync="selection"
          :data="queryMistake"
          rowKey="practice_id"
        >
          <template v-slot:content="scope">
            <div
              style="cursor: pointer"
              :title="scope.data.content"
              @click="toMistake(scope.data)"
              class="title-content one-overflow"
            >
              【
              {{ getName(typeLists, scope.data.theory_type, 'code', 'name') }}
              】
              {{ scope.data.content }}
            </div>
          </template>
          <template v-slot:category="scope">
            <div
              class="category-content-com one-overflow"
              :title="scope.data.direction"
            >
              {{ scope.data.direction }}
            </div>
          </template>
          <template v-slot:difficulty="scope">
            <span
              :class="{
                lower: scope.data.difficulty % 3 === 0,
                middle: scope.data.difficulty % 3 === 1,
                high: scope.data.difficulty % 3 === 2,
              }"
            >
              {{
                getName(difficultLists, scope.data.difficulty, 'code', 'name')
              }}
            </span>
          </template>
        </cb-search-table>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import MyQuestion from './my-question.vue';
import MyAnswer from './my-answer.vue';
import MyNote from './my-note.vue';
import MyCollection from './my-collection.vue';
import { getMyQsuestion } from '@/api/personal';
import { getMyReply } from '@/api/personal';
import { getMyNotes } from '@/api/personal';
import {
  getMyMistake,
  getMyCollection,
  getComConstantsConfig,
  deleteBatchMistake,
} from '@/api/personal.ts';
export default {
  components: {
    MyQuestion,
    MyAnswer,
    MyNote,
    MyCollection,
  },
  props: {
    indexValue: {
      type: Number,
      default: 0,
    },
    // 从练习进来，去哪个模块
    toContent: {
      type: String,
      default: '',
    },
    // 从练习进来，区分理论和实操
    toType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isGo: true,
      query: {
        type: '',
      },
      //我的笔记
      queryNote: {
        businessType: '',
      },
      // 我的错题
      queryError: {
        type: '',
      },
      radioBtnLists: [],
      radioBtnNoteLists: [],
      NoteTypeLists: [], // 我的笔记分类
      collectionLists: [],
      noteNum: 0,
      questionNum: 0,
      answerNum: 0,
      collectionNum: 0,
      questionMistakeNum: 0,
      thumbCard: {
        number: 1,
        width: '100%',
      },
      showError: true,
      showQuestion: true,
      showReplay: true,
      showNote: true,
      showCollection: true,
      queryMistake: {
        sort: '',
      },
      cols: [
        {
          label: this.$t('personal.question'),
          prop: 'content',
          slot: 'content',
        },
        {
          label: this.$t('personal.numberOfWrong'),
          prop: 'incorrect',
          sorter: 'incorrect',
          width: 100,
        },
        {
          label: this.$t('personal.numberOfRight'),
          prop: 'correct',
          sorter: 'correct',
          width: 100,
        },
        {
          label: this.$t('personal.courseLearn.category'),
          prop: 'direction',
          slot: 'category',
          width: 150,
        },
        {
          label: this.$t('personal.courseLearn.difficulty'),
          slot: 'difficulty',
          width: 100,
        },
      ],
      selector: {
        maxSelect: 0,
      },
      selection: [],
      typeLists: [],
      difficultLists: [],
    };
  },
  mounted() {},
  watch: {
    indexValue(val) {
      this.selection = [];
      if (val === 1) {
        this.showQuestion = false;
        setTimeout(() => {
          this.showQuestion = true;
          this.fetchPromise();
        }, 30);
      } else if (val === 2) {
        this.showReplay = false;
        setTimeout(() => {
          this.showReplay = true;
          this.fetchPromiseAnswer();
        }, 30);
      } else if (val === 3) {
        this.showNote = false;
        setTimeout(() => {
          this.showNote = true;
          this.fetchPromiseNote();
        }, 30);
      } else if (val === 4) {
        this.showCollection = false;
        setTimeout(() => {
          this.showCollection = true;
          this.fetchPromiseCollection();
        }, 30);
      } else if (val === 5) {
        this.showError = false;
        setTimeout(() => {
          this.showError = true;
          this.queryError.type = '';
          this.fetchPromiseMistake();
        }, 30);
      }
    },
  },
  created() {
    this.getNoteType();
    this.getCollection();
    this.getTopicType();
    this.getDifficultList();
  },
  mounted() {
    if (this.toContent === 'note') {
      if (this.toType === 'theory') {
        this.queryNote.businessType = 5;
      } else if (this.toType === 'flag') {
        this.queryNote.businessType = 3;
      } else {
        this.queryNote.businessType = '';
      }
    } else if (this.toContent === 'collection') {
      if (this.toType === 'theory') {
        this.query.type = 0;
      } else if (this.toType === 'flag') {
        this.query.type = 2;
      } else {
        this.query.type = '';
      }
    }
  },
  methods: {
    getNoteTheoryType(val) {
      return (
        this.getName(this.typeLists, val.practice_type, 'code', 'name') || ''
      );
    },
    getFilterType(val) {
      return (
        this.getName(
          this.NoteTypeLists,
          JSON.stringify(val.business_type),
          'value',
          'label',
        ) || ''
      );
    },
    // 跳转错题
    toMistake(row) {
      this.$router.push({
        path: `/oj/practice/rationale/exercise-details/${row.practice_id}`,
        query: {
          from: 'mistake',
        },
      });
    },
    getName(list, id, key, name) {
      const data = list.filter((item) => item[key] === id);
      return data.length && data[0][name];
    },
    getTopicType() {
      getComConstantsConfig({ type: 21 }).then((res) => {
        let arr = res.data.data;
        this.typeLists = arr;
      });
    },
    getDifficultList() {
      getComConstantsConfig({ type: 10 }).then((res) => {
        let arr = res.data.data;
        this.difficultLists = arr;
      });
    },

    //返回课程训练
    goNextFn() {
      this.$emit('isGoFn', this.isGo);
    },
    // 获取 笔记分类
    getNoteType() {
      getComConstantsConfig({ type: 40 }).then((res) => {
        let arr = res.data.data;
        arr = arr.map((item) => {
          return {
            label: item.name,
            value: item.code.toString(),
          };
        });
        const radioBtnNoteLists = _.clone(arr);
        this.radioBtnNoteLists = [
          { label: this.$t('personal.selectCategory'), value: '' },
          ...radioBtnNoteLists,
        ];
        this.NoteTypeLists = arr;
      });
    },
    // 获取收藏分类
    getCollection() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 13,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          let arr = res.data.data;
          arr = arr.map((item) => {
            return {
              label: item.name,
              value: item.code.toString(),
            };
          });
          const radioBtnLists = _.clone(arr);
          this.radioBtnLists = [
            { label: this.$t('personal.selectCategory'), value: '' },
            ...radioBtnLists,
          ];
          this.collectionLists = arr;
        });
    },
    // 我的提问
    fetchPromise(queryData, option) {
      const that = this;
      return new Promise((resolve) => {
        getMyQsuestion(queryData).then((resp) => {
          this.questionNum = resp.data.data.total;
          _.forEach(resp.data.data.list, (item) => {
            that.$set(item, 'resource_desc', item.theme_name);
          });
          resolve(resp);
        });
      });
    },
    //我的回复
    fetchPromiseAnswer(queryData, option) {
      const that = this;
      return new Promise((resolve) => {
        getMyReply(queryData).then((resp) => {
          this.answerNum = resp.data.data.total;

          _.forEach(resp.data.data.list, (item) => {
            that.$set(item, 'resource_desc', item.theme_name);
          });
          resolve(resp);
        });
      });
    },
    //我的笔记
    fetchPromiseNote(queryData, option) {
      const that = this;
      return new Promise((resolve) => {
        getMyNotes(queryData).then((resp) => {
          this.noteNum = resp.data.data.total;
          _.forEach(resp.data.data.list, (item) => {
            that.$set(item, 'resource_desc', item.theme_name);
          });
          resolve(resp);
        });
      });
    },

    //我的收藏
    fetchPromiseCollection(queryData, option) {
      const that = this;
      return new Promise((resolve) => {
        getMyCollection(queryData).then((resp) => {
          this.collectionNum = resp.data.data.total;
          _.forEach(resp.data.data.list, (item) => {
            that.$set(item, 'resource_desc', item.theme_name);
            that.$set(
              item,
              'business_name',
              this.collectionLists.filter(
                (i) => i.value === item.business_type,
              )[0].label,
            );
          });
          resolve(resp);
        });
      });
    },
    // 我的错题
    fetchPromiseMistake(queryData, option) {
      const that = this;
      return new Promise((resolve) => {
        getMyMistake(queryData).then((resp) => {
          this.questionMistakeNum = resp.data.data.total;
          resolve(resp);
        });
      });
    },
    deleteSelectError(data, done) {
      const resource_ids = [];
      if (data && data.length) {
        data.map((item) => resource_ids.push(item.practice_id));
      } else {
        resource_ids.push(data.practice_id);
      }
      deleteBatchMistake({
        ids: resource_ids,
      })
        .then((res) => {
          done();
          this.selection = [];
          this.$refs.myErrorRef.reload();
          this.$emit('refreshMistake');
        })
        .catch((err) => {
          done(false);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.high {
  color: var(--red-color);
}
.middle {
  color: var(--orange-color);
}
.lower {
  color: var(--green-color);
}
.category-content-com {
  font-size: 12px;
  font-weight: 400;
  color: var(--neutral8);
  background: var(--neutral0);
  border-radius: 2px;
  padding: 2px 8px;
  display: inline-block;
  max-width: 100%;
}

.oj-my-module {
  padding-top: 16px;
}
.title {
  margin-bottom: 8px;
  .text-style {
    height: 24px;
    font-size: 16px;
    font-weight: 600;
    border-left: 2px solid var(--neutral3);
    padding-left: 12px;
  }
  .arrow-style {
    color: var(--neutral7);
    margin-right: 4px;
    cursor: pointer;
    &:hover {
      color: var(--primary-color);
    }
  }
}
.my-question-wrapper {
  height: 100%;
}
.select-style {
  position: absolute;
  right: 0px;
  top: 4px;
}
.select-btn {
  position: absolute;
  right: 0px;
  top: 6px;
}
::v-deep .cb-select {
  height: 24px;
  .el-input {
    height: 24px;
  }

  .el-input__inner {
    height: 24px;
  }
  .el-input__suffix {
    top: -3px;
  }
  .el-input__icon {
    line-height: inherit;
  }
  .el-input__suffix-inner {
    display: inline-block;
  }
}
.cb-search-table {
  ::v-deep.search-bar {
    .cb-search-bar {
      padding: 8px 16px 0 16px;
    }
  }
}
</style>
<style lang="scss">
.oj-my-module {
  .cb-a-table-container-bg {
    padding: 0 0 16px;
  }
}
</style>
