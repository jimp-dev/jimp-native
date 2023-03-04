{
    'includes': [
        './binding.gypi'
    ],
    'targets': [
        {
            'target_name': 'plugin-crop-napi',
            'include_dirs': [
                "<!@(node -p \"require('@jimp-native/plugin-crop-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
            ],
            'sources': [
                './src/addon.cpp',
                './src/wrapCrop.hpp',
                './src/wrapCrop.cpp'
            ]
        }
    ]
}
