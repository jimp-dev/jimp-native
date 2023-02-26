{
    'includes': [
        './binding.gypi'
    ],
    'targets': [
        {
            'target_name': 'plugin-blur-napi',
            'include_dirs': [
                "<!@(node -p \"require('@jimp-native/plugin-blur-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
            ],
            'sources': [
                './src/addon.cpp',
                './src/wrapBlur.hpp',
                './src/wrapBlur.cpp'
            ]
        }
    ]
}
