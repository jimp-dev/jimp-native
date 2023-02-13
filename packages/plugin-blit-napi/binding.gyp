{
    'includes': [
        './binding.gypi'
    ],
    'targets': [
        {
            'target_name': 'plugin-blit-napi',
            'include_dirs': [
                "<!@(node -p \"require('@jimp-native/plugin-blit-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
            ],
            'sources': [
                './src/addon.cpp',
                './src/wrapBlit.hpp',
                './src/wrapBlit.cpp'
            ]
        }
    ]
}
