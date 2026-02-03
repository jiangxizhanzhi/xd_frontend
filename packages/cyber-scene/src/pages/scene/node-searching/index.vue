<template>
  <div class="search-wrapper" v-if="visibleCard" id="drag-wrapper">
    <cb-tabs type="border-card" class="">
      <cb-tab-pane :label="$tt('stage.search')">
        <cb-input
          v-model="keyword"
          type="text"
          size="small"
          :placeholder="$tt('global.placeInput')"
          show-word-limit
          autofocus
          @input="changeInput"
          @keyup.enter.native="nextNode"
        >
          <span slot="suffix" class="el-input__icon">{{currentIndex}}/{{total}}</span>
        </cb-input>
      </cb-tab-pane>
      <cb-tab-pane :label="$tt('stage.exchange')">
        <cb-input
          v-model="keyword"
          type="text"
          size="small"
          :placeholder="$tt('global.placeInput')"
          show-word-limit
          autofocus
          @input="changeInput"
          @keyup.enter.native="nextNode"
        >
          <span slot="suffix" class="el-input__icon">{{currentIndex}}/{{total}}</span>
        </cb-input>
        <div class="exchange-word">
          <cb-input
            v-model="exchangeWord"
            size="small"
            type="text"
            :placeholder="$tt('global.placeInput')"
          ></cb-input>
        </div>
        <div class="operation-btn-wrapper">
          <cb-button-group>
            <cb-button
              hollow
              mr
              :disabled="btnDisabled"
              @click="exchangeWordFunc(false)"
            >{{ $tt('stage.exchange') }}
            </cb-button>
            <cb-button
              hollow
              :disabled="btnDisabled"
              @click="exchangeWordFunc(true)"
            >{{ $tt('stage.exchangeAll') }}
            </cb-button>
          </cb-button-group>
        </div>
      </cb-tab-pane>
    </cb-tabs>
    <div class="btn-box" @click="closeSearchCard(false)">
      <cb-iconfont type="icon-guanbi"></cb-iconfont>
    </div>
  </div>
</template>

<script>
import t from "../../../utils/i18n";
import {computed, onMounted, ref} from "@vue/composition-api";
import sceneStore from "../../../store/scene-store";
import {getClientPageRect} from "../../../utils/common/set-dom-position";
import {updateName} from "../painter/common";

export default {
  name: "index",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    topologySceneClass: {
      type: String,
      default: '',
    },
  },
  setup(props, {emit}) {
    let keyword = ref('');
    // let exchangeKeyWord = ref(''); // 替换的查找值
    let exchangeWord = ref(''); // 要替换的值
    let total = ref(0); // 匹配到的总数
    let currentIndex = ref(0); // 当前匹配的节点序号
    let currentNode = ref(); // 当前匹配的节点
    let result = ref([]); // 所有匹配到的节点数组
    let btnDisabled = ref(true); // 替换按钮默认禁用
    const MATCHED = 'rgba(255, 153, 51, 0.7)'; // 匹配到的色值
    const HIGHLIGHTED = '#FF9933'; // 高亮的色值

    const visibleCard = computed({
      get: () => {
        if (!props.visible) {
          resetSearch(true);
        }
        return props.visible;
      },
      set: (val) => {
        emit('update:visible', val);
        return val;
      }
    })

    const closeSearchCard = (data) => {
      visibleCard.value = data;
      keyword.value = '';
      exchangeWord.value = '';
    }

    // 设置节点名称颜色
    const setLabelColor = (node, color, reset) => {
      let fillColor = reset ? node.data?.textFill : color;
      // 节点的多样性颜色冲突？
      if (node?.shape === 'image') {
        // TODO 层节点设置字体颜色
        node?.setAttrs({ label: { fill: fillColor } });
      } else {
        node?.setAttrs({ text: { fill: fillColor } });
      }
    };
    // 修改输入框内容
    const changeInput = (data, keepSearchTxt) => {
      !keepSearchTxt && resetSearch();
      // TODO 区块的搜索
      sceneStore.state.graph?.getNodes()?.forEach((node) => {
        if (node.shape === 'rect' || node.shape === 'image') {
          if (node.label?.indexOf(data) >= 0) {
            result.value.push(node);
            // 搜索到的节点名称显示匹配色值
            // setLabelColor(node, MATCHED);
          } else {
            // 没有搜索到的节点名称恢复默认色值
            // setLabelColor(node, null, true);
          }
        }
      });
      if (!data) return;
      total.value = result.value?.length;
      if (total.value) {
        btnDisabled.value = false;
        nextNode();
      } else {
        btnDisabled.value = true;
      }
    }
    // enter键定位下一个节点
    const nextNode = () => {
      sceneStore.state.graph.resetSelection();
      if (total.value) {
        // 当前节点重置为匹配色值
        // setLabelColor(currentNode.value, MATCHED);
        if (currentIndex.value < total.value) {
          currentIndex.value++;
        } else {
          currentIndex.value = 1;
        }
        currentNode.value = result.value[currentIndex.value - 1];
      } else {
        currentIndex.value = 0;
        total.value = 0;
        currentNode.value = undefined;
        btnDisabled.value = true;
      }
      // 下一步的节点置为高亮红色
      // setLabelColor(currentNode.value, HIGHLIGHTED);
      sceneStore.state.graph.select(currentNode.value);
      // 遍历匹配到的所有节点，然后获取到节点的坐标位置，将坐标位置转换为页面坐标值，再与pageRect的宽高位置做比较
      // 只需要判断当前currentNode是否在可视区内
      nodeIsInPageRect(currentNode.value);
    }

    // 将在可视区域外面的节点放到可视区
    const nodeIsInPageRect = (node) => {
      let pageRect = getClientPageRect(props.topologySceneClass);
      let pagePos = sceneStore.state.graph.localToPage(node?.position());
      if (!node) return;
      // TODO 以节点的中心点为基准
      if (
        (pagePos.x <= pageRect.x + pageRect.width) &&
        (pagePos.x >= pageRect.x) &&
        (pagePos.y <= pageRect.y + pageRect.height) &&
        (pagePos.y >= pageRect.y)
      ) {
        // x在可视区内，不需要操作
      } else {
        // 不在可视区
        sceneStore.state.graph.centerCell(node);
      }
    }

    const resetSearch = (clearSearchContent) => {
      total.value = 0;
      currentIndex.value = 0;
      currentNode.value = undefined;
      result.value = [];
      // 清除搜索内容
      if (clearSearchContent) {
        keyword.value = '';
        exchangeWord.value = '';
      }
    }

    /**
     * 替换文字
     * @param isAll 全部替换
     * 默认替换单个节点
     */
    const exchangeWordFunc = (isAll) => {
      let oldName = currentNode.value?.getAttrs()?.text?.text;
      let newName = oldName?.replaceAll(keyword.value, exchangeWord.value);

      if (isAll) {
        result.value?.forEach(item => {
          let nodeData = _.cloneDeep(item.getData());
          nodeData.basicConfig.name = newName;
          item.setData(nodeData, { silent: true });
          updateName(newName, item);
        })
        total.value = 0;
        currentIndex.value = 0;
        btnDisabled.value = true;
        sceneStore.state.graph.resetSelection();
      } else {
        let nodeData = _.cloneDeep(currentNode.value.getData());
        nodeData.basicConfig.name = newName;
        currentNode.value.setData(nodeData, { silent: true });
        updateName(newName, currentNode.value);
        currentIndex.value >= 0 && result.value.splice(currentIndex.value - 1, 1);
        total.value--;
        currentIndex.value++;
        nextNode();
      }
    }

    onMounted(() => {
      let dragWrapper = document.getElementById('drag-wrapper');
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;
      // dragWrapper?.addEventListener('mousedown', (event) => {
      //   console.log('哈哈哈 start')
      //   isDragging = true;
      //   offsetX = event.offsetX;
      //   offsetY = event.offsetY;
      //   event.preventDefault();
      // })
      // // 绑定鼠标移动事件
      // dragWrapper?.addEventListener('mousemove', function(event) {
      //   if (isDragging) {
      //     dragWrapper.style.left = (event.pageX - offsetX) + 'px';
      //     dragWrapper.style.top = (event.pageY - offsetY) + 'px';
      //     console.log('dragWrapper', dragWrapper)
      //   }
      // });
      // // 绑定鼠标松开事件
      // dragWrapper?.addEventListener('mouseup', function() {
      //   isDragging = false;
      // });
    })

    return {
      $tt: t,
      keyword,
      exchangeWord,
      visibleCard,
      total,
      currentIndex,
      btnDisabled,
      closeSearchCard,
      changeInput,
      nextNode,
      exchangeWordFunc,
    }
  }
}
</script>

<style scoped lang="scss">
.search-wrapper {
  //cursor: move;
  //border: 1px solid var(--neutral3);
  position: absolute;
  right: 20px;
  top: 15px;
  width: 320px;
  height: 110px;
  background-color: var(--bg-color-2);
  box-shadow: 0 5px 15px 8px rgba(0, 0, 0, 0.10), 0 6px 10px 1px rgba(0, 0, 0, 0.18);
  //box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  .btn-box {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
  .operation-btn-wrapper {
    text-align: center;
  }
  .exchange-word {
    margin: 10px 0;
  }
}
</style>
