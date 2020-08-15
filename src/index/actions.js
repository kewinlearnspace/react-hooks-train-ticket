export const ACTION_SET_FROM = 'SET_FROM';
export const ACTION_SET_TO = 'SET_TO';
export const ACTION_SET_IS_CITY_SELECTOR_VISIBLE =
  'SET_IS_CITY_SELECTOR_VISIBLE';
export const ACTION_SET_CURRENT_SELECTING_LEFT_CITY =
  'SET_CURRENT_SELECTING_LEFT_CITY';
export const ACTION_SET_CITY_DATA = 'SET_CITY_DATA';
export const ACTION_SET_IS_LOADING_CITY_DATA = 'SET_IS_LOADING_CITY_DATA';
export const ACTION_SET_IS_DATE_SELECTOR_VISIBLE =
  'SET_IS_DATE_SELECTOR_VISIBLE';
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE';
export const ACTION_SET_HIGH_SPEED = 'SET_HIGH_SPEED';

// 设置起始站
export function setFrom(from) {
  return {
    type: ACTION_SET_FROM,
    payload: from,
  };
}

// 设置终点站
export function setTo(to) {
  return {
    type: ACTION_SET_TO,
    payload: to,
  };
}

// 控制城市数据的展示
export function setIsLoadingCityData(isLoadingCityData) {
  return {
    type: ACTION_SET_IS_LOADING_CITY_DATA,
    payload: isLoadingCityData,
  };
}

// 设置日期
export function setCityData(cityData) {
  return {
    type: ACTION_SET_CITY_DATA,
    payload: cityData,
  };
}

export function setDepartDate(departDate) {
  return {
    type: ACTION_SET_DEPART_DATE,
    payload: departDate,
  };
}

// 高铁动车切换
export function toggleHighSpeed() {
  // 异步
  return (dispatch, getState) => {
    const { highSpeed } = getState(); // 获取到当前highSpeed的当前值
    dispatch({
      type: ACTION_SET_HIGH_SPEED,
      payload: !highSpeed,
    }); // 派发新的action
  };
}

/**
 *  城市选择浮层
 * @param {*} currentSelectingLeftCity
 * 异步action使用场景:并不是要使用到当前的值或者进行异步操作的时候才可以使用
 */

// 多个参数绑定
// 显示城市浮层
export function showCitySelector(currentSelectingLeftCity) {
  return dispatch => {
    dispatch({
      type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
      payload: true,
    });
    dispatch({
      type: ACTION_SET_CURRENT_SELECTING_LEFT_CITY,
      payload: currentSelectingLeftCity,
    });
  };
}
// 隐藏城市浮层
export function hideCitySelector() {
  return {
    type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
    payload: false,
  };
}

// 选择城市后所需要修改的值
export function setSelectedCity(city) {
  return (dispatch, getState) => {
    const { currentSelectingLeftCity } = getState();
    currentSelectingLeftCity ? dispatch(setFrom(city)) : dispatch(setTo(city));
    dispatch(hideCitySelector());
  };
}

// 日期选择浮层
export function showDateSelector() {
  return {
    type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    payload: true,
  };
}

export function hideDateSelector() {
  return {
    type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    payload: false,
  };
}

// 起始站和终点站切换
export function exchangeFromTo() {
  return (dispatch, getState) => {
    const { from, to } = getState();
    dispatch(setFrom(to));
    dispatch(setTo(from));
  };
}

export function fetchCityData() {
  return (dispatch, getState) => {
    const { isLoadingCityData } = getState();
    if (isLoadingCityData) {
      return;
    }
    // localStorage种缓存有数据则不发送请求,直接去本地缓存的数据
    const { expires = 0, data } = JSON.parse(
      localStorage.getItem('city_data_cache') || '{}'
    );
    if (Date.now() < expires) {
      dispatch(setCityData(data));
      return;
    }

    dispatch(setIsLoadingCityData(true));
    fetch('/rest/cities?_' + Date.now())
      .then(res => res.json())
      .then(cityData => {
        dispatch(setCityData(cityData));
        // 将请求与的数据缓存到localStroage
        localStorage.setItem(
          'city_data_cache',
          JSON.stringify({ expires: Date.now() + 60 * 1000, data: cityData })
        );
        dispatch(setIsLoadingCityData(false));
      })
      .catch(() => {
        dispatch(setIsLoadingCityData(false));
      });
  };
}
