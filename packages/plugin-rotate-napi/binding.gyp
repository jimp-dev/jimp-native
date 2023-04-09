{
    'includes': [
        './binding.gypi'
    ],
    'targets': [
        {
            'target_name': 'plugin-rotate-napi',
            'include_dirs': [
                "<!@(node -p \"require('@jimp-native/plugin-rotate-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
            ],
            'sources': [
                './src/addon.cpp',
                './src/wrapRotate.hpp',
                './src/wrapRotate.cpp'
            ]
        }
    ]
}
