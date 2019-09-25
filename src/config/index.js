const suffixList = {
    'xlsx': 'iconfont icon-xls',
    'xltx': 'iconfont icon-xls',
    'potx': 'iconfont icon-ppt',
    'ppsx': 'iconfont icon-ppt',
    'pptx': 'iconfont icon-ppt',
    'sldx': 'iconfont icon-ppt',
    'docx': 'iconfont icon-doc',
    'dotx': 'iconfont icon-doc',
    'doc': 'iconfont icon-doc',
    'pdf': 'iconfont icon-pdf',
    'xls': 'iconfont icon-xls',
    'ppt': 'iconfont icon-ppt',
    'zip': 'iconfont icon-zip',
    'wav': 'iconfont icon-wav',
    'css': 'iconfont icon-css',
    'avi': 'iconfont icon-avi',
    'htm': 'iconfont icon-html',
    'html': 'iconfont icon-html',
    'mp3': 'iconfont icon-mp3',
    'txt': 'iconfont icon-txt',
};

export default {
    formatIcon(suffix) {
        return suffixList[suffix] ? suffixList[suffix] : 'iconfont icon-unknow';
    },
};