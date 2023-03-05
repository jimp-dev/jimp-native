{
    'includes': [
        './binding.gypi'
    ],
    'targets': [
        {
            'target_name': 'plugin-flip-napi',
            'include_dirs': [
                "<!@(node -p \"require('@jimp-native/plugin-flip-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
            ],
            'sources': [
                './src/addon.cpp',
                './src/wrapFlip.hpp',
                './src/wrapFlip.cpp'
            ]
        }
    ]
}
