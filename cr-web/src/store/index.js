import { getUserStore } from '@cyber/helper';
import { getUiFrameStore } from '@cyber/ui';
import _ from 'lodash';
import getters from './getters';
const storeData = {
  modules: {
    user: getUserStore(getUiFrameStore()),
  },
  getters,
};

export default storeData;
