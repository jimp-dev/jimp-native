{
    'includes': [
        './binding.gypi'
    ],
    'targets': [
        {
            'target_name': 'plugin-circle-napi',
            'include_dirs': [
                "<!@(node -p \"require('@jimp-native/plugin-circle-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
            ],
            'sources': [
                './src/addon.cpp',
                './src/wrapCircle.hpp',
                './src/wrapCircle.cpp'
            ]
        }
    ]
}
