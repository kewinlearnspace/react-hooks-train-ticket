export const ACTION_SET_TRAIN_NUMBER = 'SET_TRAIN_NUMBER';
export const ACTION_SET_DEPART_STATION = 'SET_DEPART_STATION';
export const ACTION_SET_ARRIVE_STATION = 'SET_ARRIVE_STATION';
export const ACTION_SET_SEAT_TYPE = 'SET_SEAT_TYPE';
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE';
export const ACTION_SET_ARRIVE_DATE = 'SET_ARRIVE_DATE';
export const ACTION_SET_DEPART_TIME_STR = 'SET_DEPART_TIME_STR';
export const ACTION_SET_ARRIVE_TIME_STR = 'SET_ARRIVE_TIME_STR';
export const ACTION_SET_DURATION_STR = 'SET_DURATION_STR';
export const ACTION_SET_PRICE = 'SET_PRICE';
export const ACTION_SET_PASSENGERS = 'SET_PASSENGERS';
export const ACTION_SET_MENU = 'SET_MENU';
export const ACTION_SET_IS_MENU_VISIBLE = 'SET_IS_MENU_VISIBLE';
export const ACTION_SET_SEARCH_PARSED = 'SET_SEARCH_PARSED';

export function setTrainNumber(trainNumber) {
  return {
    type: ACTION_SET_TRAIN_NUMBER,
    payload: trainNumber,
  };
}
export function setDepartStation(departStation) {
  return {
    type: ACTION_SET_DEPART_STATION,
    payload: departStation,
  };
}
export function setArriveStation(arriveStation) {
  return {
    type: ACTION_SET_ARRIVE_STATION,
    payload: arriveStation,
  };
}
export function setSeatType(seatType) {
  return {
    type: ACTION_SET_SEAT_TYPE,
    payload: seatType,
  };
}
export function setDepartDate(departDate) {
  return {
    type: ACTION_SET_DEPART_DATE,
    payload: departDate,
  };
}
export function setArriveDate(arriveDate) {
  return {
    type: ACTION_SET_ARRIVE_DATE,
    payload: arriveDate,
  };
}
export function setDepartTimeStr(departTimeStr) {
  return {
    type: ACTION_SET_DEPART_TIME_STR,
    payload: departTimeStr,
  };
}
export function setArriveTimeStr(arriveTimeStr) {
  return {
    type: ACTION_SET_ARRIVE_TIME_STR,
    payload: arriveTimeStr,
  };
}
export function setDurationStr(durationStr) {
  return {
    type: ACTION_SET_DURATION_STR,
    payload: durationStr,
  };
}
export function setPrice(price) {
  return {
    type: ACTION_SET_PRICE,
    payload: price,
  };
}
export function setPassengers(passengers) {
  return {
    type: ACTION_SET_PASSENGERS,
    payload: passengers,
  };
}
export function setMenu(menu) {
  return {
    type: ACTION_SET_MENU,
    payload: menu,
  };
}
export function setIsMenuVisible(isMenuVisible) {
  return {
    type: ACTION_SET_IS_MENU_VISIBLE,
    payload: isMenuVisible,
  };
}
export function setSearchParsed(searchParsed) {
  return {
    type: ACTION_SET_SEARCH_PARSED,
    payload: searchParsed,
  };
}

export function fetchInitial(url) {
  return (dispatch, getState) => {
    fetch(url)
      .then(res => res.json())
      .then(
        ({ departTimeStr, arriveTimeStr, arriveDate, durationStr, price }) => {
          dispatch(setDepartTimeStr(departTimeStr));
          dispatch(setArriveTimeStr(arriveTimeStr));
          dispatch(setArriveDate(arriveDate));
          dispatch(setDurationStr(durationStr));
          dispatch(setPrice(price));
        }
      );
  };
}

let passengerIdSeed = 0;
// 添加成人票
export function createAdult() {
  return (dispatch, getState) => {
    const { passengers } = getState();
    for (let passenger of passengers) {
      const keys = Object.keys(passenger);
      // 判断passengers中的每个对象的属性值是否为空.为空不允许继续添加成员
      for (let key of keys) {
        if (!passenger[key]) {
          return;
        }
      }
    }
    dispatch(
      setPassengers([
        ...passengers,
        {
          id: ++passengerIdSeed,
          name: '',
          ticketType: 'adult',
          licenceNo: '',
          seat: 'Z',
        },
      ])
    );
  };
}

// 添加儿童票
export function createChild() {
  return (dispatch, getState) => {
    const { passengers } = getState();
    let adultFound = null; // 用于存储对应儿童的成人信息
    for (let passenger of passengers) {
      const keys = Object.keys(passenger);
      for (let key of keys) {
        if (!passenger[key]) {
          return;
        }
      }
      // 没有成人也不允许添加儿童
      if (passenger.ticketType === 'adult') {
        adultFound = passenger.id;
      }
    }
    if (!adultFound) {
      alert('请至少正确添加一个同行成人');
      return;
    }
    dispatch(
      setPassengers([
        ...passengers,
        {
          id: ++passengerIdSeed,
          name: '',
          gender: 'none',
          birthday: '',
          followAdult: adultFound,
          ticketType: 'child',
          seat: 'Z',
        },
      ])
    );
  };
}
// 删除乘客
export function removePassenger(id) {
  return (dispatch, getState) => {
    const { passengers } = getState();
    // 如果成人票被删除,那么对应的儿童票也应该被删除
    const newPassengers = passengers.filter(
      passenger => passenger.id !== id && passenger.followAdult !== id
    );
    dispatch(setPassengers(newPassengers));
  };
}

/**
 * @description 更新乘客信息
 * @param {*} id 更新数据的id
 * @param {*} data 更新数据的集合
 * @param {*} keysToBeRemoved 需要删除字段的集合
 */
export function updatePassenger(id, data, keysToBeRemoved = []) {
  return (dispatch, getState) => {
    const { passengers } = getState();
    for (let i = 0; i < passengers.length; ++i) {
      if (passengers[i].id === id) {
        const newPassengers = [...passengers];
        // onchang方法会在输入时一直触发,所以需要一直覆盖原来的值
        newPassengers[i] = Object.assign({}, passengers[i], data);
        for (let key of keysToBeRemoved) {
          delete newPassengers[i][key];
        }
        dispatch(setPassengers(newPassengers));
        break;
      }
    }
  };
}

export function showMenu(menu) {
  return dispatch => {
    dispatch(setMenu(menu));
    dispatch(setIsMenuVisible(true));
  };
}

export function hideMenu() {
  return setIsMenuVisible(false);
}

// 性别弹出菜单
export function showGenderMenu(id) {
  return (dispatch, getState) => {
    const { passengers } = getState();
    const passenger = passengers.find(passenger => passenger.id === id);
    if (!passenger) {
      return;
    }
    dispatch(
      showMenu({
        // 选择后出发的方法
        onPress(gender) {
          dispatch(updatePassenger(id, { gender }));
          dispatch(hideMenu());
        },
        options: [
          {
            title: '男',
            value: 'male',
            active: 'male' === passenger.gender,
          },
          {
            title: '女',
            value: 'female',
            active: 'female' === passenger.gender,
          },
        ],
      })
    );
  };
}

// 同行成人
export function showFollowAdultMenu(id) {
  return (dispatch, getState) => {
    const { passengers } = getState();
    const passenger = passengers.find(passenger => passenger.id === id);
    if (!passenger) {
      return;
    }
    dispatch(
      showMenu({
        onPress(followAdult) {
          dispatch(updatePassenger(id, { followAdult }));
          dispatch(hideMenu());
        },
        options: passengers
          .filter(passenger => passenger.ticketType === 'adult')
          .map(adult => {
            return {
              title: adult.name,
              value: adult.id,
              active: adult.id === passenger.followAdult,
            };
          }),
      })
    );
  };
}

// 票型选择弹窗
export function showTicketTypeMenu(id) {
  return (dispatch, getState) => {
    const { passengers } = getState();
    const passenger = passengers.find(passenger => passenger.id === id);
    if (!passenger) {
      return;
    }
    dispatch(
      showMenu({
        onPress(ticketType) {
          // 儿童切换成成人
          if ('adult' === ticketType) {
            dispatch(
              updatePassenger(id, { ticketType, licenceNo: '' }, [
                'gender',
                'followAdult',
                'birthday',
              ])
            );
          } else {
            // 成人切换成儿童
            // 1.除去自己还有无其他成人
            const adult = passengers.find(
              passenger =>
                passenger.id !== id && passenger.ticketType === 'adult'
            );
            if (adult) {
              dispatch(
                updatePassenger(
                  id,
                  {
                    ticketType,
                    gender: '',
                    followAdult: adult.id,
                    birthday: '',
                  },
                  ['licenceNo']
                )
              );
            } else {
              alert('没有其他成人乘客');
            }
          }
          dispatch(hideMenu());
        },
        options: [
          {
            title: '成人票',
            value: 'adult',
            active: 'adult' === passenger.ticketType,
          },
          {
            title: '儿童票',
            value: 'child',
            active: 'child' === passenger.ticketType,
          },
        ],
      })
    );
  };
}
