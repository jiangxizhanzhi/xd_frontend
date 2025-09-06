const indexedDB =
  window.indexedDB ||
  window.webkitindexedDB ||
  window.msIndexedDB ||
  window.mozIndexedDB; //兼容

export function dbInit(storeName) {
  return new Promise((resolve, reject) => {
    //打开数据库，如果没有就新建一个
    //dbname库的名称，2为版本号，切记，版本号不能为小数，会自动四舍五入
    const connection = indexedDB.open('cyber', 3);
    connection.onblocked = function (event) {
      // 如果其他的一些页签加载了该数据库，在我们继续之前需要关闭它们
      alert('请关闭其他由该站点打开的页签！');
    };
    connection.addEventListener('success', (event) => {
      const db = event.target.result;
      db.addEventListener('versionchange', (event) => {
        console.log('The version of this database has changed');
      });
    });
    //成功回调
    connection.onsuccess = function (event) {
      resolve(event.target.result);
    };
    //
    connection.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        //为该数据库创建一个对象仓库，person,主键为id，下面使用调用的时候主要对应主键
        //autoIncrement 标记会为该仓库开启键生成器。默认该设置是不开启的
        //使用键生成器，当你向对象仓库新增记录时键会自动生成。对象仓库生成的键往往从 1 开始，然后自动生成的新的键会在之前的键的基础上加 1。生成的键的值从来不会减小，除非数据库操作结果被回滚
        // db.createObjectStore(
        //   storeName,
        //   { keyPath: 'id' },
        //   // { autoIncrement: true }
        // );
        db.createObjectStore('single', { keyPath: 'id' });
        db.createObjectStore('team', { keyPath: 'id' });
        db.createObjectStore('red', { keyPath: 'id' });
        db.createObjectStore('topo', { keyPath: 'id' });
        db.createObjectStore('range', { keyPath: 'id' });
      }
    };
    //失败回调
    connection.onerror = function (err) {
      reject(err);
    };
  });
}

export function dbInitAI(storeName, tableName) {
  return new Promise((resolve, reject) => {
    //打开数据库，如果没有就新建一个
    //dbname库的名称，2为版本号，切记，版本号不能为小数，会自动四舍五入
    const connection = indexedDB.open(storeName, 3);
    connection.onblocked = function (event) {
      // 如果其他的一些页签加载了该数据库，在我们继续之前需要关闭它们
      alert('请关闭其他由该站点打开的页签！');
    };
    connection.addEventListener('success', (event) => {
      const db = event.target.result;
      db.addEventListener('versionchange', (event) => {
        console.log('The version of this database has changed');
      });
    });
    //成功回调
    connection.onsuccess = function (event) {
      resolve(event.target.result);
    };
    //
    connection.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(tableName)) {
        //为该数据库创建一个对象仓库，person,主键为id，下面使用调用的时候主要对应主键
        //autoIncrement 标记会为该仓库开启键生成器。默认该设置是不开启的
        //使用键生成器，当你向对象仓库新增记录时键会自动生成。对象仓库生成的键往往从 1 开始，然后自动生成的新的键会在之前的键的基础上加 1。生成的键的值从来不会减小，除非数据库操作结果被回滚
        db.createObjectStore(tableName, { keyPath: 'id' });
      }
    };
    //失败回调
    connection.onerror = function (err) {
      reject(err);
    };
  });
}

//type 方法类型  data第几条
export async function dbOperation(storeName, type, data) {
  let typeList = ['add', 'get', 'getAll', 'delete', 'put']; //方法名字
  //如果传的值不在这个列表中
  if (!typeList.includes(type)) {
    throw new Error(`操作类型错误, 仅支持: ${typeList.toString()} 方法`);
  }
  //事务模式有两个选项 readonly 或 readwrite ，默认为 readonly 模式，只读和写入数据
  const readType =
    type === 'add' || 'delete' || 'put' ? 'readwrite' : 'readonly';
  const res = await dbInit();
  const objectStore = res
    .transaction(storeName, readType)
    .objectStore(storeName);

  const response = new Promise((resolve, reject) => {
    const request = objectStore[type](data);
    request.onsuccess = (res) => {
      resolve(res.target.result);
    };
    request.onerror = (err) => {
      reject(err);
    };
    request.oncomplete = (event) => {
      alert('All done!');
    };
  });
  return response;
}
/**
 * AI操作数据库
 * @param storeName 数据库
 * @param tableName 表名
 * @param type 操作类型
 * @param data find时传入用来查找
 * @param key 需要查值的key
 * @returns {Promise<unknown>}
 */
export async function dbOperationAI(storeName, tableName, type, data, key) {
  let typeList = ['add', 'get', 'getAll', 'delete', 'put', 'find']; //方法名字
  //如果传的值不在这个列表中
  if (!typeList.includes(type)) {
    throw new Error(`操作类型错误, 仅支持: ${typeList.toString()} 方法`);
  }
  //事务模式有两个选项 readonly 或 readwrite ，默认为 readonly 模式，只读和写入数据
  const readType =
    type === 'add' || 'delete' || 'put' ? 'readwrite' : 'readonly';
  const res = await dbInitAI(storeName, tableName);
  const objectStore = res
    .transaction(tableName, readType)
    .objectStore(tableName);

  const response = new Promise((resolve, reject) => {
    let request;
    if (type === 'find') {
      request = objectStore.get(key);
    } else if (type === 'delete') {
      request = objectStore.delete(key);
    } else {
      request = objectStore[type](data);
    }
    request.onsuccess = (res) => {
      resolve(res.target.result);
    };
    request.onerror = (err) => {
      reject(err);
    };
    request.oncomplete = (event) => {
      alert('All done!');
    };
  });
  return response;
}
export default {
  dbInit,
  dbInitAI,
  dbOperation,
  dbOperationAI,
};
