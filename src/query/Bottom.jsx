import React, { memo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import "./Bottom.css";
import { ORDER_DEPART } from "./constant";
import Slider from "./Slider.jsx";

const Filter = memo(function Filter(props) {
  const { name, checked, value, toggle } = props;
  return (
    <li className={classnames({ checked })} onClick={() => toggle(value)}>
      {name}
    </li>
  );
});
Filter.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired
  // dispatch: PropTypes.func.isRequired,
};

const Option = memo(function Option(props) {
  const { title, options, checkedMap, update } = props;
  const toggle = useCallback(
    value => {
      const newCheckedMap = { ...checkedMap };
      if (value in checkedMap) {
        delete newCheckedMap[value];
      } else {
        newCheckedMap[value] = true;
      }
      update(newCheckedMap);
    },
    [checkedMap, update]
  );
  return (
    <div className="option">
      <h3>{title}</h3>
      <ul>
        {options.map(option => (
          <Filter
            key={option.value}
            {...option}
            checked={option.value in checkedMap}
            toggle={toggle}
          ></Filter>
        ))}
      </ul>
    </div>
  );
});

Option.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  checkedMap: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired
  // dispatch: PropTypes.func.isRequired,
};

const BottomModal = memo(function BottomModal(props) {
  const {
    ticketTypes,
    trainTypes,
    departStations,
    arriveStations,
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeStart,
    setDepartTimeEnd,
    setArriveTimeStart,
    setArriveTimeEnd,
    toggleIsFiltersVisible
  } = props;

  const [localCheckedTicketTypes, setLocalCheckedTicketTypes] = useState(() => {
    return { ...checkedTicketTypes };
  });
  const [localCheckedTrainTypes, setLocalCheckedTrainTypes] = useState(() => {
    return { ...localCheckedTrainTypes };
  });
  const [localCheckedDepartStations, setLocalCheckedDepartStations] = useState(
    () => {
      return { ...localCheckedDepartStations };
    }
  );
  const [localCheckedArriveStations, setLocalCheckedArriveStations] = useState(
    () => {
      return {
        ...localCheckedArriveStations
      };
    }
  );

  // 缓存出发起点时间
  const [localDepartTimeStart, setLocalDepartTimeStart] = useState(
    departTimeStart
  );
  // 缓存出发结束时间
  const [localDepartTimeEnd, setLocalDepartTimeEnd] = useState(departTimeEnd);
  // 缓存到达起点时间
  const [localArriveTimeStart, setLocalArriveTimeStart] = useState(
    arriveTimeStart
  );
  // 缓存到达结束时间
  const [localArriveTimeEnd, setLocalArriveTimeEnd] = useState(arriveTimeEnd);

  const optionGroup = [
    {
      title: "坐席类型",
      options: ticketTypes,
      // checkedMap: checkedTicketTypes,
      checkedMap: localCheckedTicketTypes,
      update: setLocalCheckedTicketTypes
      // dispatch: localCheckedTicketTypesDispatch,
    },
    {
      title: "车次类型",
      options: trainTypes,
      // checkedMap: checkedTrainTypes,
      checkedMap: localCheckedTrainTypes,
      update: setLocalCheckedTrainTypes
      // dispatch: localCheckedTrainTypesDispatch,
    },
    {
      title: "出发车站",
      options: departStations,
      // checkedMap: checkedDepartStations,
      checkedMap: localCheckedDepartStations,
      update: setLocalCheckedDepartStations
      // dispatch: localCheckedDepartStationsDispatch,
    },
    {
      title: "到达车站",
      options: arriveStations,
      // checkedMap: checkedArriveStations,
      checkedMap: localCheckedArriveStations,
      update: setLocalCheckedArriveStations
      // dispatch: localCheckedArriveStationsDispatch,
    }
  ];

  return (
    <div className="bottom-modal">
      <div className="bottom-dialog">
        <div className="bottom-dialog-content">
          <div className="title">
            <span className="reset">重置</span>
            <span className="ok">确定</span>
          </div>
          <div className="options">
            {optionGroup.map(group => (
              <Option {...group} key={group.title}></Option>
            ))}
          </div>
          <Slider
            title="出发时间"
            currentStatrHours={localDepartTimeStart}
            currentEndHours={localDepartTimeEnd}
            onStartChange={setLocalDepartTimeStart}
            onEndChange={setLocalDepartTimeEnd}
          ></Slider>
          <Slider
            title="到达时间"
            currentStatrHours={localArriveTimeStart}
            currentEndHours={localArriveTimeEnd}
            onStartChange={setLocalArriveTimeStart}
            onEndChange={setLocalArriveTimeEnd}
          ></Slider>
        </div>
      </div>
    </div>
  );
});

BottomModal.propTypes = {
  ticketTypes: PropTypes.array.isRequired,
  trainTypes: PropTypes.array.isRequired,
  departStations: PropTypes.array.isRequired,
  arriveStations: PropTypes.array.isRequired,
  checkedTicketTypes: PropTypes.object.isRequired,
  checkedTrainTypes: PropTypes.object.isRequired,
  checkedDepartStations: PropTypes.object.isRequired,
  checkedArriveStations: PropTypes.object.isRequired,
  departTimeStart: PropTypes.number.isRequired,
  departTimeEnd: PropTypes.number.isRequired,
  arriveTimeStart: PropTypes.number.isRequired,
  arriveTimeEnd: PropTypes.number.isRequired,
  setCheckedTicketTypes: PropTypes.func.isRequired,
  setCheckedTrainTypes: PropTypes.func.isRequired,
  setCheckedDepartStations: PropTypes.func.isRequired,
  setCheckedArriveStations: PropTypes.func.isRequired,
  setDepartTimeStart: PropTypes.func.isRequired,
  setDepartTimeEnd: PropTypes.func.isRequired,
  setArriveTimeStart: PropTypes.func.isRequired,
  setArriveTimeEnd: PropTypes.func.isRequired,
  toggleIsFiltersVisible: PropTypes.func.isRequired
};

export default function Bottom(props) {
  const {
    highSpeed,
    orderType,
    onlyTickets,
    isFiltersVisible,
    toggleOrderType,
    toggleHighSpeed,
    toggleOnlyTickets,
    toggleIsFiltersVisible,
    ticketTypes,
    trainTypes,
    departStations,
    arriveStations,
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeStart,
    setDepartTimeEnd,
    setArriveTimeStart,
    setArriveTimeEnd
  } = props;
  return (
    <div className="bottom">
      <div className="bottom-filters">
        <span className="item" onClick={toggleOrderType}>
          <i className="icon">&#xf065;</i>
          {orderType === ORDER_DEPART ? "出发 早->晚" : "耗时 短->长"}
        </span>
        <span
          className={classnames("item", { "item-on": highSpeed })}
          onClick={toggleHighSpeed}
        >
          <i className="icon">{highSpeed ? "\uf43f" : "\uf43e"}</i>
          只看高铁动车
        </span>
        <span
          className={classnames("item", { "item-on": onlyTickets })}
          onClick={toggleOnlyTickets}
        >
          <i className="icon">{onlyTickets ? "\uf43d" : "\uf43c"}</i>
          只看有票
        </span>
        <span
          className={classnames("item", {
            "item-on": isFiltersVisible
          })}
          onClick={toggleIsFiltersVisible}
        >
          <i className="icon">{"\uf0f7"}</i>
          综合筛选
        </span>
      </div>
      {isFiltersVisible && (
        <BottomModal
          ticketTypes={ticketTypes}
          trainTypes={trainTypes}
          departStations={departStations}
          arriveStations={arriveStations}
          checkedTicketTypes={checkedTicketTypes}
          checkedTrainTypes={checkedTrainTypes}
          checkedDepartStations={checkedDepartStations}
          checkedArriveStations={checkedArriveStations}
          departTimeStart={departTimeStart}
          departTimeEnd={departTimeEnd}
          arriveTimeStart={arriveTimeStart}
          arriveTimeEnd={arriveTimeEnd}
          setCheckedTicketTypes={setCheckedTicketTypes}
          setCheckedTrainTypes={setCheckedTrainTypes}
          setCheckedDepartStations={setCheckedDepartStations}
          setCheckedArriveStations={setCheckedArriveStations}
          setDepartTimeStart={setDepartTimeStart}
          setDepartTimeEnd={setDepartTimeEnd}
          setArriveTimeStart={setArriveTimeStart}
          setArriveTimeEnd={setArriveTimeEnd}
          toggleIsFiltersVisible={toggleIsFiltersVisible}
        ></BottomModal>
      )}
    </div>
  );
}

Bottom.prototype = {
  toggleOrderType: PropTypes.func.isRequired,
  toggleHighSpeed: PropTypes.func.isRequired,
  toggleOnlyTickets: PropTypes.func.isRequired,
  toggleIsFiltersVisible: PropTypes.func.isRequired,
  highSpeed: PropTypes.bool.isRequired,
  orderType: PropTypes.number.isRequired,
  onlyTickets: PropTypes.bool.isRequired,
  isFiltersVisible: PropTypes.bool.isRequired,

  ticketTypes: PropTypes.array.isRequired,
  trainTypes: PropTypes.array.isRequired,
  departStations: PropTypes.array.isRequired,
  arriveStations: PropTypes.array.isRequired,
  checkedTicketTypes: PropTypes.object.isRequired,
  checkedTrainTypes: PropTypes.object.isRequired,
  checkedDepartStations: PropTypes.object.isRequired,
  checkedArriveStations: PropTypes.object.isRequired,
  departTimeStart: PropTypes.number.isRequired,
  departTimeEnd: PropTypes.number.isRequired,
  arriveTimeStart: PropTypes.number.isRequired,
  arriveTimeEnd: PropTypes.number.isRequired,
  setCheckedTicketTypes: PropTypes.func.isRequired,
  setCheckedTrainTypes: PropTypes.func.isRequired,
  setCheckedDepartStations: PropTypes.func.isRequired,
  setCheckedArriveStations: PropTypes.func.isRequired,
  setDepartTimeStart: PropTypes.func.isRequired,
  setDepartTimeEnd: PropTypes.func.isRequired,
  setArriveTimeStart: PropTypes.func.isRequired,
  setArriveTimeEnd: PropTypes.func.isRequired
};
