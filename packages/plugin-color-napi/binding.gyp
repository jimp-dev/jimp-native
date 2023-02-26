{
    'includes': [
        './binding.gypi'
    ],
    'targets': [
        {
            'target_name': 'plugin-color-napi',
            'include_dirs': [
                "<!@(node -p \"require('@jimp-native/plugin-color-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
            ],
            'sources': [
                './src/addon.cpp',
                './src/wrapColor.hpp',
                './src/wrapColor.cpp'
            ]
        }
    ]
}
