class Helper {
  // 函数实现，参数 delay 单位 毫秒 ；
  static sleep(delay) {
    const start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
      // 使用  continue 实现；
      // eslint-disable-next-line no-continue
      continue;
    }
  }
}

module.exports = Helper;
