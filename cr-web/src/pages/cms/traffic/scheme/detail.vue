<template>
  <cb-inner-page :background="false">
    <cb-form
      ref="formRef"
      label-position="right"
      label-width="120px"
      :model.sync="model"
      :rules="rules"
      :url="url"
      :id="id"
      :json="true"
      :isBgColor="true"
      baseURL="/api/mp"
    >
      <cb-form-item :label="$t('traffic.SetName')" prop="title">
        <cb-input
          v-model="model.title"
          :placeholder="$t('traffic.pleaseInputSetName')"
        />
      </cb-form-item>

      <cb-form-item :label="$t('traffic.SetDesc')" prop="description">
        <cb-input
          v-model="model.description"
          :placeholder="$t('traffic.pleaseInputSetDesc')"
          type="textarea"
          @blur="removeBlank"
        />
      </cb-form-item>

      <cb-form-item :label="$t('traffic.category')">
        <cb-radio-group v-model="model.type_flag">
          <cb-radio
            v-for="option in trafficCategoryOptions"
            :key="option.value"
            :label="option.value"
          >
            {{ option.label }}
          </cb-radio>
        </cb-radio-group>
      </cb-form-item>

      <cb-form-item :label="$t('traffic.SetType')" prop="category">
        <cb-select v-model="model.category" :options="categoryOptions" />
      </cb-form-item>

      <cb-form-item :label="$t('traffic.flowConfig')">
        <cb-search-table
          :scroll="{ y: 480 }"
          rowKey="id"
          :cols="cols"
          :dataSource="model.flow_info_list"
          :selection.sync="trafficSelection"
          :hidePaginOnDemand="true"
          ref="tableRef"
          :searchBarBg="false"
        >
          <template v-slot:search>
            <cb-button button-type="import" hollow @click="importTraffic">
              {{ $t('common.import') }}
            </cb-button>
            <cb-button
              hollow
              button-type="delete"
              @click="deleteSelected(trafficSelection, $event)"
              :disabled="trafficSelection.length === 0"
            ></cb-button>
          </template>
        </cb-search-table>
      </cb-form-item>

      <div class="form-button-bar">
        <cb-button-group space="middle">
          <cb-button button-type="confirm" mr @click="submitForm"> </cb-button>
          <cb-button button-type="cancel" @click="resetForm"> </cb-button>
        </cb-button-group>
      </div>
    </cb-form>
    <traffic-select-modal
      ref="flowSelectModal"
      @updateTraffic="updateTraffic"
    />
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';

import {
  validateTitleLength,
  validateDescriptionLength,
} from '@/utils/rules-cms';
import { trans } from '@/lang';
import '@/lang/all-lang/index';
import { getOptionList } from '@/api/traffic/traffic';
import { TRAFFICATEGORYLISTS } from '../constant';
import TrafficSelectModal from './components/traffic_select_table';
export default {
  name: 'TrafficSchemeDetail',
  props: ['id'],
  components: {
    TrafficSelectModal,
  },
  data() {
    return {
      value: [],
      url: '/flow/collection/bulk',
      trafficList: [],
      trafficCategoryOptions: TRAFFICATEGORYLISTS,
      model: {
        title: '',
        description: '',
        type_flag: 0,
        category: null,
        flow_info_list: [],
      },
      trafficSelection: [],
      categoryOptions: [],
      rules: {
        title: [
          {
            required: true,
            message: this.$t('traffic.pleaseInputSetName'),
            trigger: 'blur',
          },
          { validator: validateTitleLength, trigger: 'blur' },
        ],
        // 取消集合描述验证规则
        // description: [
        //   {
        //     required: true,
        //     message: this.$t('traffic.inputSchemeDes'),
        //     trigger: 'blur',
        //   },
        //   { validator: validateDescriptionLength, trigger: 'blur' },
        // ],
        category: [
          {
            required: true,
            message: this.$t('traffic.selectCategory'),
            trigger: 'blur',
          },
        ],
      },
      cols: [
        {
          label: this.$t('table.title'),
          prop: 'title',
        },
        {
          label: this.$t('event.desc'),
          prop: 'flow_desc',
        },
        {
          label: this.$t('table.type'),
          getData: (row) => {
            if (row?.interactive_type === 0) {
              return this.$CONSTANT.Traffic.TrafficType.BACKGROUND.name.toString();
            } else {
              return this.$CONSTANT.Traffic.TrafficType.INTELLIGENT.name.toString();
            }
          },
        },
        {
          label: this.$t('common.createTime'),
          prop: 'create_time',
        },
      ],
    };
  },
  mounted() {
    if (this.id) {
      this.$refs.formRef.getModelData();
    }
    this.getOptionsList();
  },
  computed: {},
  methods: {
    removeBlank() {
      this.model.description = this.model.description.trim();
    },
    submitForm() {
      this.$refs.formRef
        .submit(this.model)
        .then(() => {
          this.$router.push({ path: '/admin/traffic/scheme' });
        })
        .catch((err) => {});
    },
    resetForm() {
      this.$router.push({ path: '/admin/traffic/scheme' });
    },
    //获取下拉选框options列表数据
    getOptionsList() {
      getOptionList().then((res) => {
        const tempList = (this.options = _.get(res, 'data.data', []));
        this.categoryOptions = tempList.map((item) => {
          return {
            label: item.name,
            value: item.code,
          };
        });
      });
    },
    trans,
    //导入流量
    importTraffic() {
      //背景流量，攻击流量
      if (
        this.model.type_flag ==
          this.$CONSTANT.Traffic.TrafficCategory.BACKGROUND.value ||
        this.model.type_flag ==
          this.$CONSTANT.Traffic.TrafficCategory.INTELLIGENT.value
      ) {
        this.$refs.flowSelectModal.showType = false;
        this.$refs.flowSelectModal.model.interactive_type =
          this.model.type_flag;
      } else {
        //混合流量
        this.$refs.flowSelectModal.model.interactive_type =
          this.$CONSTANT.Traffic.TrafficCategory.BACKGROUND.value;
        this.$refs.flowSelectModal.showType = true;
      }
      this.$refs.flowSelectModal.show();
    },
    //删除流量
    deleteSelected(selection, done) {
      this.trafficSelection.forEach((item) => {
        let index = this.model.flow_info_list.findIndex(
          (obj) => obj.id == item.id,
        );
        if (index != -1) {
          this.model.flow_info_list.splice(index, 1);
        }
      });
      done();
    },
    //更新流量
    updateTraffic(data) {
      data.forEach((item) => {
        item.id = item.resource_id;
        let index = this.model.flow_info_list.findIndex(
          (obj) => obj.resource_id == item.resource_id,
        );
        //不重复添加
        if (index == -1) {
          this.model.flow_info_list.push(item);
        } else {
          return;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
