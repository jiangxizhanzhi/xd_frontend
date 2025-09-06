/*
 * 大文件上传、分片上传
 */
import {
  getUploadStatus,
  sliceUpload,
  mergeUpload,
} from '@/api/device/chunk.js';
// 切片大小(单位:B)
const CHUNK_SIZE = 50 * 1024 * 1024;

/**
 * @description: 文件切片
 * @param {*} file
 * @param {*} size 切片大小
 * @returns [{file}]
 */
export function createFileChunk(file, size = CHUNK_SIZE) {
  const chunks = [];
  let cur = 0;
  while (cur < file.size) {
    chunks.push({ file: file.slice(cur, cur + size) });
    cur += size;
  }
  return chunks;
}

/**
 * @description: 获取文件的后缀名
 */
export function getFileType(fileName) {
  return fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
}

/**
 * @description: 根据文件的md5值判断文件是否已经上传过了
 * @param {*} md5 文件的md5
 * @param file
 * @returns {Promise}
 */
export function checkMd5(md5, file) {
  return new Promise((resolve) => {
    // 文件不存在需要上传
    getUploadStatus({ md5 })
      .then((res) => {
        if (res.data.data !== 0) {
          // 文件已经存在了，秒传（后端直接返回已上传的文件）
          resolve({
            uploaded: true,
            url: res.data.msg,
            code: res.data.data,
          });
        } else {
          // 文件不存在需要上传
          resolve({ uploaded: false, url: '', code: res.data.data });
        }
      })
      .catch(() => {
        resolve({ uploaded: false, url: '', code: 500 });
      });
  });
}

/**
 * @description: 执行分片上传
 * @param {*} file 上传的文件
 * @param {*} i 第几分片，从0开始
 * @param {*} md5 文件的md5值
 * @param {*} vm 虚拟 dom 指向组件 this
 * @returns {Promise}
 */
export function PostFile(file, i, md5, vm) {
  const name = file.name; // 文件名
  const size = file.size; // 总大小
  const shardCount = Math.ceil(size / CHUNK_SIZE); // 总片数
  if (i - 1 >= shardCount) {
    return;
  }
  const start = (i - 1) * CHUNK_SIZE;
  const end = start + CHUNK_SIZE;
  const packet = file.slice(start, end); // 将文件进行切片
  /*  构建form表单进行提交  */
  const form = new FormData();
  form.append('md5', md5); // 前端生成uuid作为标识符传个后台每个文件都是一个uuid防止文件串了
  form.append('fileName', name);
  form.append('fileSize', size);
  form.append('total', shardCount); // 总片数
  form.append('index', i); // 当前是第几片
  form.append('file', packet); // slice方法用于切出文件的一部分

  return new Promise((resolve, reject) => {
    sliceUpload(form)
      .then((res) => {
        resolve({ num: i });
      })
      .catch(() => {
        reject();
      });
  });
}

/**
 * @description: 合并文件
 * @param {*} total 分片数
 * @param {*} file_name 文件名
 * @param {*} md5 文件md值
 * @param {*} file_type 文件类型
 * @param {*} file_size 文件大小
 * @returns {Promise}
 */
export function mergeFile(total, file_name, md5, file_type, file_size) {
  return mergeUpload({ total, file_name, md5, file_type, file_size });
}
