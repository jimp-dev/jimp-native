import { mergeDeep } from 'timm';
import { jimpEvChange } from '@jimp/core';

import blit from '@jimp-native/plugin-blit-napi';

const plugins = [
    blit,
];

export default (evChange) => plugins
    .map((pluginInitializer: (evChange?: typeof jimpEvChange) => Object) => pluginInitializer(evChange))
    .reduce((result, currentPlugin) => mergeDeep(result, currentPlugin), {});