import configure from '@jimp/custom';

import types from '@jimp/types';
import plugins from '@jimp-native/plugins-napi';

export default configure({
    types: [types],
    plugins: [plugins]
});
