import CbPlayer from './src/player.vue';
/* istanbul ignore next */
CbPlayer.install = function (Vue) {
  Vue.component(CbPlayer.name, CbPlayer);
};
export default CbPlayer;
