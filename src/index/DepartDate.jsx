import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { h0 } from '../common/fp.js';
import './DepartDate.css';

/**
 * 问题:当前数据来源不仅仅来源于props。也来源于fp.js中的h0() 不传递参数时是从系统获取当前时间的,
 * 所以其数据来源不单纯,因此不能使用memo优化。
 * 解决:可以将当前时间通过props传递当当前组件给h0(date)使用
 * @param {*} props
 */

export default function DepartDate(props) {
  const { time, onClick } = props;

  // 由于time是一直在变化的。但是天基本是不变的,所以需要将时分秒这些去掉
  const h0OfDepart = h0(time);
  const departDate = new Date(h0OfDepart);
  const departDateString = useMemo(() => {
    return dayjs(h0OfDepart).format('YYYY-MM-DD');
  }, [h0OfDepart]);

  const isToday = h0OfDepart === h0();

  const weekString = `周${
    ['日', '一', '二', '三', '四', '五', '六'][departDate.getDay()]
  }${isToday ? '(今天)' : ''}`;
  return (
    <div className="depart-date" onClick={onClick}>
      <input type="hidden" name="date" value={departDateString} />
      {departDateString}
      <span className="depart-week">{weekString}</span>
    </div>
  );
}

DepartDate.prototype = {
  time: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};
