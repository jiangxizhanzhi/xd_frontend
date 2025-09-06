<template>
  <cb-inner-page :background="false">
    <cb-search-table
      :cols.sync="cols"
      :selector="selector"
      :selection.sync="selection"
      url="/sys/notice/page/"
      :baseURL="baseURL"
      ref="noticeListRef"
      row-key="id"
      :searchBarBg="true"
    >
      <template v-slot:search>
        <cb-button
          button-type="add"
          link-name="notice-add"
          :disabled="is_admin === 0"
        />
        <cb-button
          buttonType="delete"
          hollow
          @click="deleteSelectNotice(selection, $event)"
          :disabled="selection.length === 0 || is_admin === 0"
        />
      </template>
      <template v-slot:type="scope">
        {{ typeList[scope.data.type] }}
      </template>
      <template v-slot:role_names="scope">
        {{ getNoticeRole(scope.data.is_public, scope.data.role_names) }}
      </template>
      <template v-slot:group="scope">
        <span
          v-if="
            Array.isArray(getGroupData(scope.data.group, scope.data)) &&
            getGroupData(scope.data.group, scope.data).length
          "
          :title="getGroupData(scope.data.group, scope.data).join('/')"
        >
          <span
            v-for="(item, index) in getGroupData(scope.data.group, scope.data)"
            :key="index"
          >
            <span v-if="index == 0" :style="{ color: colorCode(index) }">{{
              item
            }}</span>
            <span v-else>
              /
              <span :style="{ color: colorCode(index) }">{{ item }}</span></span
            >
          </span>
        </span>
        <span v-else> {{ getGroupData(scope.data.group, scope.data) }}</span>
      </template>
      <template v-slot:operate="scope">
        <cb-button
          @click="editRow(scope.data)"
          type="text"
          buttonType="edit"
          :disabled="is_admin === 0"
          mr
        ></cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import { deleteSelectNotice } from '@/api/notice';
import Utils from '@/utils/utils';
import constant from './constant.js';
import { getOrganization } from '@/api/notice';
import { typeData } from '../../../api/notice';

export default {
  data() {
    return {
      baseURL: '/api/mp',
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [],
      resource_id: '',
      orgs: [],
      orgColorMap: ['#ffa940', '#0bdaff'],
      typeList: {},
    };
  },
  computed: {
    is_admin() {
      return _.get(this.$store.state.user, 'is_admin');
    },
  },
  created() {
    const that = this;
    that.cols = [
      {
        label: this.$t('notice.title'),
        prop: 'title',
        width: 300,
        resizable: true,
      },
      {
        label: this.$t('notice.type'),
        slot: 'type',
      },
      {
        label: this.$t('notice.group'),
        slot: 'role_names',
      },
      {
        label: this.$t('notice.organization'),
        prop: 'org_paths',
      },
      {
        label: this.$t('notice.content'),
        prop: 'content',
        width: 300,
        resizable: true,
      },
      {
        label: this.$t('notice.creator'),
        prop: 'publisher_name',
      },
      {
        label: this.$t('notice.created'),
        prop: 'create_time',
      },

      {
        label: this.$t('notice.operate'),
        slot: 'operate',
        width: '120px',
      },
    ];
    getOrganization().then((resp) => {
      that.orgs = resp.data.data;
    });
    this.getTypeList();
  },
  mounted() {},
  methods: {
    getTypeList() {
      this.typeList = {};
      typeData().then((res) => {
        let tempList = _.get(res, 'data.data', []);
        tempList?.forEach((item) => {
          this.typeList[item.code] = item.name;
        });
      });
    },
    getNoticeRole(tag, name) {
      if (tag === 1) {
        return this.$t('notice.groupEnum.all');
      }
      if (tag === 0) {
        return name || '-';
      }
    },
    getGroupData(group, row) {
      const that = this;
      const noticeGroupOption = {
        [constant.groupEnum.all]: that.$t('notice.groupEnum.all'),
        [constant.groupEnum.teacher]: that.$t('notice.groupEnum.teacher'),
        [constant.groupEnum.student]: that.$t('notice.groupEnum.student'),
        [constant.groupEnum.custom]: that.$t('notice.groupEnum.custom'),
      };
      if (group === 4) {
        const node = Utils.getNodeInTree(that.orgs, row.organization);
        if (node) {
          let curr = node;
          const arr = [];
          while (curr && curr.name) {
            arr.unshift(curr.name);
            curr = curr.parent;
          }
          return arr;
        } else {
          return '-';
        }
      } else {
        return noticeGroupOption[group];
      }
    },
    getEleFromArr(arr, idx, defaultValue) {
      try {
        if (idx < arr.length) {
          return arr[idx];
        }
        return defaultValue || idx;
      } catch (ex) {
        return defaultValue || idx;
      }
    },
    colorCode(idx) {
      return this.getEleFromArr(this.orgColorMap, idx);
    },
    // 删除所选公告
    deleteSelectNotice(data, done) {
      const that = this;
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.id));
      } else {
        ids.push(data.id);
      }
      deleteSelectNotice([...ids]).then(() => {
        done();
        that.selection = [];
        that.$refs.noticeListRef.reload();
      });
    },
    // 编辑
    editRow(data) {
      const that = this;
      that.$router.push({
        path: '/admin/system-notice/edit',
        query: {
          noticeId: data.id,
        },
      });
    },
  },
};
</script>
