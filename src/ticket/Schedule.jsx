import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import leftPad from "left-pad";
import URI from "urijs";
import dayjs from "dayjs";
import "./Schedule.css";

const ScheduleRow = memo(function ScheduleRow(props) {
  const {
    index,
    station,
    arriveTime,
    departTime,
    stay,
    isStartStation, // 起点站
    isEndStation, // 终点站
    isDepartStation, // 出发站
    isArriveStation, // 抵达站
    beforeDepartStation,
    afterArriveStation
  } = props;

  return (
    <li>
      <div
        className={classnames("icon", {
          "icon-red": isDepartStation || isArriveStation
        })}
      >
        {isDepartStation
          ? "出"
          : isArriveStation
          ? "到"
          : leftPad(index, 2, "0")}
      </div>
      <div
        className={classnames("row", {
          grey: beforeDepartStation || afterArriveStation
        })}
      >
        <span
          className={classnames("station", {
            red: isArriveStation || isDepartStation
          })}
        >
          {station}
        </span>
        <span className={classnames("arrtime", { red: isArriveStation })}>
          {isStartStation ? "始发站" : arriveTime}
        </span>
        <span className={classnames("deptime", { red: isDepartStation })}>
          {isEndStation ? "终到站" : departTime}
        </span>
        <span className="stoptime">
          {isStartStation || isEndStation ? "--" : stay + "分"}
        </span>
      </div>
    </li>
  );
});

ScheduleRow.prototype = {
  //   index
  // station
  // arriveTime
  // departTime
  // stay
  // isStartStation
  // isEndStation
  // isDepartStation
  // isArriveStation
  // beforeDepartStation
  // afterArriveStation
};

const Schedule = memo(function Schedule(props) {
  const { date, trainNumber, departStation, arriveStation } = props;
  const [scheduleList, setScheduleList] = useState([]);

  useEffect(() => {
    const url = new URI("/rest/schedule")
      .setSearch("trainNumber", trainNumber)
      .setSearch("departStation", departStation)
      .setSearch("arriveStation", arriveStation)
      .setSearch("date", dayjs(date).format("YYYY-MM-DD"))
      .toString();
    fetch(url)
      .then(res => res.json())
      .then(data => {
        let departRow; // 出发车站
        let arriveRow; // 到达车站
        for (let i = 0; i < data.length; ++i) {
          // 查询出发车站
          if (!departRow) {
            // 当前车站为出发车站
            if (data[i].station === departStation) {
              departRow = Object.assign(data[i], {
                beforeDepartStation: false,
                isDepartStation: true,
                afterArriveStation: false,
                isArriveStation: false
              });
            } else {
              // 当前车站非,即在出发车站前
              Object.assign(data[i], {
                beforeDepartStation: true,
                isDepartStation: false,
                afterArriveStation: false,
                isArriveStation: false
              });
            }
          } else if (!arriveRow) {
            // 有出发车站,无到达车站
            if (data[i].station === arriveStation) {
              // 当前车站为到达车站
              arriveRow = Object.assign(data[i], {
                beforeDepartStation: false,
                isDepartStation: false,
                afterArriveStation: false,
                isArriveStation: true
              });
            } else {
              // 当前车站为途径的车站、
              Object.assign(data[i], {
                beforeDepartStation: false,
                isDepartStation: false,
                afterArriveStation: false,
                isArriveStation: false
              });
            }
          } else {
            // 找到了出发车站和到达车站,那么当前车站是在到达车站之后的
            Object.assign(data[i], {
              beforeDepartStation: false,
              isDepartStation: false,
              afterArriveStation: true,
              isArriveStation: false
            });
          }
          Object.assign(data[i], {
            isStartStation: i === 0,
            isEndStation: i === data.length - 1
          });
        }
        setScheduleList(data);
      });
  }, [date, trainNumber, departStation, arriveStation]);
  return (
    <div className="schedule">
      <div className="dialog">
        <h1>列车时刻表</h1>
        <div className="head">
          <span className="station">车站</span>
          <span className="deptime">到达</span>
          <span className="arrtime">发车</span>
          <span className="stoptime">停留</span>
        </div>
        <ul>
          {scheduleList.map((schedule, index) => (
            <ScheduleRow
              key={schedule.station}
              index={index + 1}
              {...schedule}
            ></ScheduleRow>
          ))}
        </ul>
      </div>
    </div>
  );
});
export default Schedule;

Schedule.prototype = {
  date: PropTypes.number.isRequired,
  trainNumber: PropTypes.string.isRequired,
  departStation: PropTypes.string.isRequired,
  arriveStation: PropTypes.string.isRequired
};
