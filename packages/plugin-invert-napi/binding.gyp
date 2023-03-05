{
    'includes': [
        './binding.gypi'
    ],
    'targets': [
        {
            'target_name': 'plugin-invert-napi',
            'include_dirs': [
                "<!@(node -p \"require('@jimp-native/plugin-invert-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
            ],
            'sources': [
                './src/addon.cpp',
                './src/wrapInvert.hpp',
                './src/wrapInvert.cpp'
            ]
        }
    ]
}
