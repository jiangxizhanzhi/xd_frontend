<template>
  <div class="team-content-top">
    <Block title="队伍总排行榜" title-position="center">
      <div class="container">
        <div class="rank-left">
          <RankItem
            v-for="(item, i) in rank.slice(0, 4)"
            :rank="item.rank"
            :model="item"
            :key="i"
          />
        </div>
        <div class="rank-center">
          <div class="rank-second">
            <TopRank :model="second" :rank="second.rank" />
          </div>
          <div class="rank-first">
            <TopRank :model="top" :rank="top.rank" />
          </div>
          <div class="rank-third">
            <TopRank :model="third" :rank="third.rank" />
          </div>
        </div>
        <div class="rank-right">
          <RankItem
            v-for="(item, i) in rank.slice(4)"
            :rank="item.rank"
            :model="item"
            :key="i"
          />
        </div>
      </div>
    </Block>
  </div>
</template>
<script>
import {
  defineComponent,
  ref,
  onMounted,
  watch,
  onUnmounted,
} from '@vue/composition-api';
import Block from '../../components/block.vue';
import RankItem from './components/rank-item.vue';
import TopRank from './components/top-rank.vue';
import { queryRank } from '../../api';
export default defineComponent({
  name: 'Top',
  components: { Block, RankItem, TopRank },
  props: {
    id: String,
  },
  setup(props) {
    const rank = ref([]);
    const top = ref({});
    const second = ref({});
    const third = ref({});
    let tick;

    const getRank = () => {
      queryRank().then((res) => {
        rank.value = res.data.data.sort(
          (a, b) => parseInt(a.rank) - parseInt(b.rank),
        );
        top.value = rank.value[0] || {};
        second.value = rank.value[1] || {};
        third.value = rank.value[2] || {};
      });
    };

    watch(
      () => props.id,
      () => {
        getRank();
      },
    );

    onMounted(() => {
      getRank();
      tick = setInterval(() => {
        getRank();
      }, 10 * 1000);
    });

    onUnmounted(() => {
      if (tick) {
        clearInterval(tick);
      }
    });

    return {
      rank,
      top,
      second,
      third,
    };
  },
});
</script>
<style lang="scss" scoped></style>
