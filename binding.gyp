{
    'targets': [
        {
            'target_name': 'oidNative',
            'sources': [ 'src/oidNative.cc' ],
            'include_dirs': ["<!(node -e \"require('nan')\")"]
        }
    ]
}
