import {
  ACTION_SET_ARRIVE_DATE,
  ACTION_SET_DEPART_DATE,
  ACTION_SET_DEPART_TIME_STR,
  ACTION_SET_ARRIVE_TIME_STR,
  ACTION_SET_DEPART_STATION,
  ACTION_SET_ARRVIE_STATION,
  ACTION_SET_TRAIN_NUMBER,
  ACTION_SET_DURATION_STR,
  ACTION_SET_TICKETS,
  ACTION_SET_IS_SCHEDULE_VISIBLE,
  ACTION_SET_SEARCH_PARSED,
} from './actions'
export default {
  departDate(state = Date.now(), action) {
    const { type, payload } = action
    switch (type) {
      case ACTION_SET_DEPART_DATE:
        return payload // payload表示当前state的最新值
      default:
    }
    return state
  },
  arriveDate(state = Date.now(), action) {
    const { type, payload } = action
    switch (type) {
      case ACTION_SET_ARRIVE_DATE:
        return payload // payload表示当前state的最新值
      default:
    }
    return state
  },
  departTimeStr(state = null, action) {
    const { type, payload } = action
    switch (type) {
      case ACTION_SET_DEPART_TIME_STR:
        return payload // payload表示当前state的最新值
      default:
    }
    return state
  },
  arriveTimeStr(state = null, action) {
    const { type, payload } = action
    switch (type) {
      case ACTION_SET_ARRIVE_TIME_STR:
        return payload // payload表示当前state的最新值
      default:
    }
    return state
  },
  departStation(state = null, action) {
    const { type, payload } = action
    switch (type) {
      case ACTION_SET_DEPART_STATION:
        return payload // payload表示当前state的最新值
      default:
    }
    return state
  },
  arrvieStation(state = null, action) {
    const { type, payload } = action
    switch (type) {
      case ACTION_SET_ARRVIE_STATION:
        return payload // payload表示当前state的最新值
      default:
    }
    return state
  },
  trainNumber(state = null, action) {
    const { type, payload } = action
    switch (type) {
      case ACTION_SET_TRAIN_NUMBER:
        return payload // payload表示当前state的最新值
      default:
    }
    return state
  },
  durationStr(state = null, action) {
    const { type, payload } = action
    switch (type) {
      case ACTION_SET_DURATION_STR:
        return payload // payload表示当前state的最新值
      default:
    }
    return state
  },
  tickets(state = [], action) {
    const { type, payload } = action
    switch (type) {
      case ACTION_SET_TICKETS:
        return payload // payload表示当前state的最新值
      default:
    }
    return state
  },
  isScheduleVisible(state = false, action) {
    const { type, payload } = action
    switch (type) {
      case ACTION_SET_IS_SCHEDULE_VISIBLE:
        return payload // payload表示当前state的最新值
      default:
    }
    return state
  },
  searchParsed(state = false, action) {
    const { type, payload } = action
    switch (type) {
      case ACTION_SET_SEARCH_PARSED:
        return payload // payload表示当前state的最新值
      default:
    }
    return state
  },
}
