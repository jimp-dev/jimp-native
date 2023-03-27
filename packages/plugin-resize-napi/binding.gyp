{
    'includes': [
        './binding.gypi'
    ],
    'targets': [
        {
            'target_name': 'plugin-resize-napi',
            'include_dirs': [
                "<!@(node -p \"require('@jimp-native/plugin-resize-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
            ],
            'sources': [
                './src/addon.cpp',
                './src/wrapResize.hpp',
                './src/wrapResize.cpp'
            ]
        }
    ]
}
