export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

export async function handleClearBlank(url) {
  const base64 = await clearblankimg(url);
  return base64;
}

export function clearImageEdgeBlank(url, padding = 0) {
  return new Promise((resolve, reject) => {
    // create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // create image
    const image = new Image();
    image.onload = draw;
    image.src = url;
    image.crossOrigin = 'Anonymous';

    function draw() {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data, width, height } = imageData;

      // 裁剪需要的起点和终点,初始值为画布左上和右下点互换设置成极限值。
      let startX = width,
        startY = height,
        endX = 0,
        endY = 0;

      /*
      col为列，row为行，两层循环构造每一个网格，
      便利所有网格的像素，如果有色彩则设置裁剪的起点和终点
      */
      for (let col = 0; col < width; col++) {
        for (let row = 0; row < height; row++) {
          // 网格索引
          const pxStartIndex = (row * width + col) * 4;

          // 网格的实际像素RGBA
          const pxData = {
            r: data[pxStartIndex],
            g: data[pxStartIndex + 1],
            b: data[pxStartIndex + 2],
            a: data[pxStartIndex + 3],
          };

          // 存在色彩：不透明
          const colorExist = pxData.a !== 0;

          /*
          如果当前像素点有色彩
          startX坐标取当前col和startX的最小值
          endX坐标取当前col和endX的最大值
          startY坐标取当前row和startY的最小值
          endY坐标取当前row和endY的最大值
          */
          if (colorExist) {
            startX = Math.min(col, startX);
            endX = Math.max(col, startX);
            startY = Math.min(row, startY);
            endY = Math.max(row, endY);
          }
        }
      }

      // 右下坐标需要扩展1px,才能完整的截取到图像
      endX += 1;
      endY += 1;

      // 加上padding
      startX -= padding;
      startY -= padding;
      endX += padding;
      endY += padding;

      // 根据计算的起点终点进行裁剪
      const cropCanvas = document.createElement('canvas');
      const cropCtx = cropCanvas.getContext('2d');
      cropCanvas.width = endX - startX;
      cropCanvas.height = endY - startY;
      cropCtx.drawImage(
        image,
        startX,
        startY,
        cropCanvas.width,
        cropCanvas.height,
        0,
        0,
        cropCanvas.width,
        cropCanvas.height,
      );

      // rosolve裁剪后的图像字符串
      resolve(cropCanvas.toDataURL());
    }
  });
}

export function clearblankimg(imgData) {
  return new Promise((resolve, reject) => {
    var img = new Image(); //创建图片对象
    img.src = imgData;
    img.onload = function () {
      var c = document.createElement('canvas'); //创建处理画布对象
      var ctx = c.getContext('2d');
      c.width = img.width;
      c.height = img.height;
      ctx.drawImage(img, 0, 0); //绘制
      var imgData = ctx.getImageData(0, 0, c.width, c.height).data; //读取图片数据
      var lOffset = c.width,
        rOffset = 0,
        tOffset = c.height,
        bOffset = 0;
      for (var i = 0; i < c.width; i++) {
        for (var j = 0; j < c.height; j++) {
          var pos = (i + c.width * j) * 4;
          if (
            imgData[pos] == 255 ||
            imgData[pos + 1] == 255 ||
            imgData[pos + 2] == 255 ||
            imgData[pos + 3] == 255
          ) {
            bOffset = Math.max(j, bOffset); // 找到有色彩的最下端
            rOffset = Math.max(i, rOffset); // 找到有色彩的最右端
            tOffset = Math.min(j, tOffset); // 找到有色彩的最上端
            lOffset = Math.min(i, lOffset); // 找到有色彩的最左端
          }
        }
      }
      lOffset++;
      rOffset++;
      tOffset++;
      bOffset++;
      var x = document.createElement('canvas'); //创建处理后画布对象
      x.width = rOffset - lOffset;
      x.height = bOffset - tOffset;
      var xx = x.getContext('2d');
      xx.drawImage(
        img,
        lOffset,
        tOffset,
        x.width,
        x.height,
        0,
        0,
        x.width,
        x.height,
      ); //绘制

      // console.log(x.toDataURL()); //得到最终裁剪出来的base64
      resolve(x.toDataURL());
    };
  });
}
