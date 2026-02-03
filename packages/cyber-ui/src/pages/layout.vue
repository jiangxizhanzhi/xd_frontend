<template>
  <div class="cy-layout">
    <div class="cy-layout-menus cyber-scroll-bar">
      <div class="cy-layout-menus-list">
        <cb-search-input
          @change="searchFunc"
          clearable
          v-model="searchVal"
          @clear="searchFunc"
          style="margin: 20px 0"
        />
        <div v-for="(item, key) in menusData" :key="key">
          <div class="cy-layout-menus-list-classify">{{ key }}</div>
          <router-link
            :to="{ path: a.path }"
            v-for="(a, index) in item"
            :key="index"
            class="cy-layout-menus-list-item"
            tag="div"
          >
            <div
              @click="menusClick(a.path)"
              :class="{ 'menus-active': active === a.path }"
            >
              {{ a.name }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="cy-layout-content">
      <div class="cy-layout-content-header">
        <div class="cy-layout-content-header-action">
          <ToggleButton
            v-model="currentTheme"
            :labels="{
              checked: '深',
              unchecked: '浅',
            }"
            :color="{
              checked: '#273041',
            }"
            :width="52"
            :height="24"
            style="margin-right: 12px"
          />
          <ToggleButton
            v-model="currentLanguage"
            :color="{
              checked: '#fd3a2c',
            }"
            :labels="{
              checked: '中',
              unchecked: '英',
            }"
            :width="52"
            :height="24"
          />
        </div>
      </div>
      <div class="cy-layout-content-body cyber-scroll-bar">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ToggleButton } from 'vue-js-toggle-button';
import { cloneDeep } from 'lodash';
import { setTheme } from '../utils/themes';

export default {
  name: 'layout',
  components: {
    ToggleButton,
  },
  inject: ['title', 'description', 'version'],
  data() {
    return {
      searchVal: '',
      title: this.title,
      version: this.version,
      routes: this.$router.options.routes,
      currentPath: this.$router.options.routes[0].children[1].path,
      currentTheme: true,
      currentLanguage: true,
      description: this.description,
      menusList: {},
      menusData: {},
      active: '/button',
      sortArr: [
        'Basic/基础',
        'Navigation/导航',
        'Form/表单',
        'Data/数据',
        'Prompt/提示',
        'View/视图',
        'Visualize/可视化',
        'Layout/布局',
        'Editor/编辑器',
        'Business/业务',
        'Others',
      ],
      menus: [],
    };
  },
  watch: {
    '$route.path': function (val) {
      this.currentPath = val;
    },
    currentTheme: function (val) {
      const theme = val ? 'theme-dark' : 'theme-light';
      setTheme(theme);
      // document.body.className = theme;
    },
    currentLanguage: function (val) {
      this.$root.$i18n.locale = val ? 'zh-CN' : 'en-US';
    },
  },
  mounted() {
    console.log('测试');
  },
  methods: {
    searchFunc() {
      // if (this.searchVal === '') {
      this.menusData = cloneDeep(this.menus);
      // }
      for (let i in this.menusData) {
        let arr = [];
        this.menusData[i].forEach((element) => {
          if (element.name.indexOf(this.searchVal) != -1) {
            arr.push(element);
          }
        });
        this.menusData[i] = arr;
        if (this.menusData[i].length == 0) {
          delete this.menusData[i];
        }
      }
    },
    menusClick(item) {
      console.log(item);
      this.active = item;
    },
    onClickMenu(path) {
      this.$router.push(path);
    },
    sortMenu() {
      this.sortArr.forEach((element) => {
        for (let a in this.menusList) {
          if (a == element) {
            this.menusData[a] = this.menusList[a];
          }
        }
      });
    },
  },
  created() {
    document.body.className = 'theme-dark';
    this.routes[0].children.forEach((element) => {
      if (element.props) {
        if (!this.menusList[element.props.classify]) {
          this.menusList[element.props.classify] = [];
        }
        this.menusList[element.props.classify].push({
          name: element.props.displayName,
          path: element.path,
        });
      }
    });
    this.sortMenu();
    this.menus = cloneDeep(this.menusData);
    let theme = localStorage.getItem('cb-theme');
    if (theme == 'theme-light') {
      this.currentTheme = false;
    } else {
      this.currentTheme = true;
    }
  },
};
</script>
<style>
.cy-layout {
  outline: 1px solid red;
  /* background: var(--primary-color); */
}
</style>
<style lang="scss">
.cb-search-input {
  width: 100% !important;
}
body {
  .menus-active {
    color: var(--primary-color);
  }
  background: var(--bg-color-2) !important;
  overflow: hidden;
  .cy-layout {
    width: 100%;
    height: 100%;
    display: flex;
    &-menus {
      padding: 0 10px;
      flex-basis: 300px;
      //border-right: 1px solid themed(cy22);
      flex-shrink: 0;
      overflow: auto;
      color: var(--neutral8);
      background: var(--neutral0);
      &-list {
        &-classify {
          height: 30px;
          line-height: 30px;
          //color: themed(cy5);
        }
        &-item {
          padding-left: 20px;
          height: 40px;
          line-height: 40px;
          cursor: pointer;
          &:hover {
            color: var(--primary-color-8);
          }
        }
      }
    }
    &-content {
      flex-grow: 1;
      max-width: calc(100% - 300px);
      &-header {
        width: 100%;
        height: 60px;
        background: var(--neutral0);
        &-action {
          float: right;
          display: flex;
          align-items: center;
          height: 100%;
        }
      }
      &-body {
        height: calc(100% - 60px);
        overflow: auto;
      }
    }
  }
}
</style>
