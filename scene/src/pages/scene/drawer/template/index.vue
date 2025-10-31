<template>
  <div :class="{'drawer-wrapper template-wrapper': true, 'hide-title': !showTitle }">
    <!--标题-->
    <div class="title-box">
      <span class="title ft14">{{ $tt('menu.menu.sceneTemplate') }}</span>
      <div class="search-input">
        <cb-search-input
          size="small"
          v-model="query.search"
          :placeholder="$tt('menu.drawer.placeInputTemplateName')"
          width="100%"
        >
        </cb-search-input>
      </div>
    </div>

    <!--内容-->
    <div class="container" v-loading="loading">
      <transition>
        <cb-search-table
          ref="sdlRef"
          :url="url"
          :data="query"
          :base-u-r-l="'/api/mp'"
          :thumbCard="thumbCard"
          :pageSizeOptions="['6', '12', '18', '24', '30']"
          :pageSize="6"
          :simple-pagination="true"
          showLessItems
          :simplePagination="true"
          @data-loaded="loadedData"
        >
          <template v-slot:thumb="scope">
            <div>
              <TemplateCard
                :item="scope.data"
                @onDelete="onDelete(scope)"
              ></TemplateCard>
            </div>
          </template>
        </cb-search-table>
      </transition>
    </div>
  </div>
</template>

<script>
import TemplateCard from '../components/template-card';
import t from '../../../../utils/i18n';

export default {
  name: 'DrawerTemplate',
  components: { TemplateCard },
  props: {
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      url: '/cscene/cscenes?type=1',
      query: { search: '' },
      thumbCard: {
        number: 2,
        width: '49%',
      },
      loading: true,
    };
  },
  methods: {
    $tt: t,
    /**
     * 删除数据
     * @param data
     */
    onDelete(data) {
      this.$message.success(this.$tt('stage.deleteSuccess'));
      this.$refs.sdlRef.reload();
    },
    loadedData() {
      this.loading = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.template-wrapper {
  width: 480px;
  //height: unset;
  max-height: calc(100% - 75px);

  .title-box {
    margin-bottom: unset;
    height: 50px;
    line-height: 50px;
  }

  .search-input {
    float: right;
    //width: 200px;
    margin: 0 10px;
    width: 60%;
  }

  .container {
    padding: 0 0 0 10px;
    height: calc(100% - 75px);
  }
  &.hide-title {
    top: 12px;
    max-height: calc(100% - 23px);
  }
}
</style>
