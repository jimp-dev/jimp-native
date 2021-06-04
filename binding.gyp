{
    "targets": [{
        "target_name": "jimp-native",
        "cflags": ["-fexceptions"],
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc": [ "-std=c++17", "-fexceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        'defines': ['_HAS_EXCEPTIONS=1'],
        "sources": [
            "<!@(node gyp-source-loader.js)"
        ],
        'include_dirs': [
            "<!@(node -p \"require('node-addon-api').include.replace(/(\s+)/g, '\\\\\$1')\")",
        ],
        'libraries': [],
        'dependencies': [
            "<!(node -p \"require('node-addon-api').gyp.replace(/(\s+)/g, '\\\\\$1')\")"
        ],
        'msvs_settings': {
            'VCCLCompilerTool': { 'ExceptionHandling': 1, 'AdditionalOptions': ['-std:c++17'] },
        },
    }]
}
