import req from './request';

export default {
    //获取 文件列表
    getFiles(url, form) {
        return req.get(url, form);
    },
    //获取 上传策略
    getPolicy(url, form) {
        return req.get(url, form);
    },
    //创建 目录
    postFolder(url, form) {
        return req.post(url, form);
    },
    //检查 文件是否存在
    headFile(url, form) {
        return req.head(url, form);
    },
    //检查 文件是否存在
    checkFile(url, form) {
        return req.post(url, form);
    },
    //删除 文件
    delFiles(url, form) {
        return req.del(url, form);
    },
    //设置 文件可见性
    patchFileVisible(url, form) {
        return req.patch(url, form);
    },
    //复制移动 文件
    postFiles(url, form) {
        return req.post(url, form);
    },
    //重命名 文件
    putFileName(url, form) {
        return req.put(url, form);
    },
    //远程获取 图片
    getFilesByServer(url, form) {
        return req.post(url, form);
    },
    postFile(url, form) {
        return req.post(url, form);
    },
};
