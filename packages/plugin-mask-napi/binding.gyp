{
    'includes': [
        './binding.gypi'
    ],
    'targets': [
        {
            'target_name': 'plugin-mask-napi',
            'include_dirs': [
                "<!@(node -p \"require('@jimp-native/plugin-mask-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
            ],
            'sources': [
                './src/addon.cpp',
                './src/wrapMask.hpp',
                './src/wrapMask.cpp'
            ]
        }
    ]
}
