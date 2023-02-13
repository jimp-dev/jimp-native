{
    "target_defaults": {
        "cflags": ["-fexceptions"],
        "cflags!": ["-fno-exceptions"],
        "cflags_cc": ["-std=c++17", "-fexceptions"],
        "cflags_cc!": ["-fno-exceptions"],
        'defines': ['_HAS_EXCEPTIONS=1'],
        'include_dirs': [
            "<!@(node -p \"require('node-addon-api').include.replace(/(\s+)/g, '\\\\\$1')\")",
            "<!@(node -p \"require('@jimp-native/utils-cpp').include.replace(/(\s+)/g, '\\\\\$1')\")",
            "<!@(node -p \"require('@jimp-native/utils-napi').include.replace(/(\s+)/g, '\\\\\$1')\")",
        ],
        'libraries': [],
        'msvs_settings': {
            'VCCLCompilerTool': {'ExceptionHandling': 1, 'AdditionalOptions': ['-std:c++17']},
        },
        'conditions': [
            ['OS=="mac"', {
                'xcode_settings': {
                    'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
                    'MACOSX_DEPLOYMENT_TARGET': '10.14',
                    'CLANG_CXX_LANGUAGE_STANDARD': 'c++17',
                }
            }]
        ]
    }
}
