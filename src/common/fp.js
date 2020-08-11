/**
 * 年月日-时间戳函数(五时分秒毫秒)
 * @param {*} timestamp
 */
export function h0(timestamp = Date.now()) {
  const target = new Date(timestamp);

  target.setHours(0); // 将小时设置为0
  target.setMinutes(0);
  target.setSeconds(0);
  target.setMilliseconds(0);

  return target.getTime();
}
