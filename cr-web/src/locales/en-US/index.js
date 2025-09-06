import _ from 'lodash';

import webEn from './web';
import cmsEn from './cms';
const allEn = _.merge(webEn, cmsEn);

export default {
  ...allEn,
};
