{
    'includes': [
        './binding.gypi'
    ],
    'targets': [
        {
            'target_name': 'plugin-dither-napi',
            'include_dirs': [
                "<!@(node -p \"require('@jimp-native/plugin-dither-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
            ],
            'sources': [
                './src/addon.cpp',
                './src/wrapDither.hpp',
                './src/wrapDither.cpp'
            ]
        }
    ]
}
