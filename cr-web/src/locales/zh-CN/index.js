import _ from 'lodash';

import webZh from './web';
import cmsZh from './cms';
const allZh = _.merge(webZh, cmsZh);

export default {
  ...allZh,
};
