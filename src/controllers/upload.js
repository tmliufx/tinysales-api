import fs from 'fs';
import path from 'path';
import Config from 'config';
import logger from '../lib/logger';

export default ctx => {
    // 文件将要上传到哪个文件夹下面
    const uploadfolderpath = path.join(__dirname, '../../assets/uploads');

    const files = ctx.request.body.files;

    // 设置允许跨域的域名称
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'X-Requested-With');
    ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');

    // ----- 情况1：跨域时，先发送一个options请求，此处要返回200 -----
    if (ctx.method === 'OPTIONS') {
        logger.debug('options 请求时，返回 200');

        // 返回结果
        ctx.status = 200;
        ctx.body = 'options OK';
        return;
    }

    // ----- 情况2：发送post请求，上传图片 -----

    // 处理 request
    logger.debug('parse ok');

    // formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
    const tempFilePath = files.file.path;
    // 获取文件类型
    const type = files.file.type;

    // 获取文件名，并根据文件名获取扩展名
    let filename = files.file.name;
    let extName = filename.lastIndexOf('.') >= 0 ? filename.slice(filename.lastIndexOf('.') - filename.length) : '';
    // 文件名没有扩展名时候，则从文件类型中取扩展名
    if (extName === '' && type.indexOf('/') >= 0) {
        extName = `.${type.split('/')[1]}`;
    }
    // 将文件名重新赋值为一个随机数（避免文件重名）
    filename = Math.random().toString().slice(2) + extName;

    // 构建将要存储的文件的路径
    const fileNewPath = path.join(uploadfolderpath, filename);

    let result = '';

    // 将临时文件保存为正式的文件
    try {
        fs.renameSync(tempFilePath, fileNewPath);
    } catch (err) {
        if (err) {
            // 发生错误
            logger.warn('fs.rename err');
            result = 'error|save error';
        }
    }
    // 保存成功
    logger.debug('fs.rename done');
    // 拼接url地址
    result = `${Config.get('api_server.type')}${Config.get('api_server.host')}${Config.get('api_server.port')}/assets/uploads${filename}`;

    logger.info('上传文件%s成功，访问地址：%s', filename, result);
    // 返回结果
    ctx.body = result;
};
