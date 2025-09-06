<template>
  <div class="team-content-bottom">
    <Block title-position="center" title="网络侦查排名">
      <RankList :model="rank[0] || []" />
    </Block>
    <Block title-position="center" title="抵近分析排名">
      <RankList :model="rank[1] || []" />
    </Block>
    <Block title-position="center" title="外网突破排名">
      <RankList :model="rank[2] || []" />
    </Block>
    <Block title-position="center" title="里应外合排名">
      <RankList :model="rank[3] || []" />
    </Block>
    <Block title-position="center" title="内网失陷排名">
      <RankList :model="rank[4] || []" />
    </Block>
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from '@vue/composition-api';
import Block from '../../components/block.vue';
import RankList from './rank-list.vue';
import { querySubRank } from '../../api';
export default defineComponent({
  name: 'Bottom',
  components: { Block, RankList },
  props: {
    props: {
      id: String,
    },
  },
  setup(props) {
    const rank = ref([]);
    let tick;

    const getSubRank = () => {
      querySubRank().then((res) => {
        rank.value = res.data.data.map((el) =>
          el.ranking_rep_list.sort(
            (a, b) => parseInt(a.rank) - parseInt(b.rank),
          ),
        );
      });
    };

    watch(() => props.id, getSubRank);

    onMounted(() => {
      getSubRank();
      tick = setInterval(() => {
        getSubRank();
      }, 15 * 1000);
    });

    onUnmounted(() => {
      if (tick) {
        clearInterval(tick);
      }
    });

    return {
      rank,
    };
  },
});
</script>
<style lang="scss" scoped></style>
