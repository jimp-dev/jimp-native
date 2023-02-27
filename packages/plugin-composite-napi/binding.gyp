{
    'includes': [
        './binding.gypi'
    ],
    'targets': [
        {
            'target_name': 'plugin-composite-napi',
            'include_dirs': [
                "<!@(node -p \"require('@jimp-native/plugin-composite-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
                "<!@(node -p \"require('@jimp-native/plugin-color-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
            ],
            'sources': [
                './src/addon.cpp',
                './src/wrapComposite.hpp',
                './src/wrapComposite.cpp'
            ]
        }
    ]
}
