import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './Choose.css'

const Seat = memo(function Seat(props) {
  const { passengers, updatePassenger, seatType } = props
  return (
    <div>
      {passengers.map((passenger) => (
        <p
          key={passenger.id}
          className={classnames('seat', { active: passenger.seat === seatType })}
          data-text={seatType}
          onClick={() => updatePassenger(passenger.id, { seat: seatType })}
        >
          {/* data-text={seatType} 在对应的类名css中 使用content:attr(data-text) 设置其值 */}
          &#xe02d;
        </p>
      ))}
    </div>
  )
})

Seat.prototype = {
  passengers: PropTypes.array.isRequired,
  updatePassenger: PropTypes.func.isRequired,
  seatType: PropTypes.string.isRequired,
}
const Choose = memo(function Choose(props) {
  const { passengers, updatePassenger } = props

  // function creataSeat(seatType) {
  //   return (
  //     <div>
  //       {passengers.map((passenger) => (
  //         <p
  //           key={passenger.id}
  //           className={classnames('seat', { active: passenger.seat === seatType })}
  //           data-text={seatType}
  //           onClick={() => updatePassenger(passenger.id, { seat: seatType })}
  //         >
  //           {/* data-text={seatType} 在对应的类名css中 使用content:attr(data-text) 设置其值 */}
  //           &#xe02d;
  //         </p>
  //       ))}
  //     </div>
  //   )
  // }
  return (
    <div className="choose">
      <p className="tip">在线选座</p>
      <div className="container">
        <div className="seats">
          <div>窗</div>
          {/* {creataSeat('A')}
          {creataSeat('B')}
          {creataSeat('C')} */}
          {['A', 'B', 'C'].map((seatType) => (
            <Seat
              passengers={passengers}
              updatePassenger={updatePassenger}
              seatType={seatType}
            ></Seat>
          ))}
          <div>过道</div>
          {/* {creataSeat('D')}
          {creataSeat('F')} */}
          {['D', 'F'].map((seatType) => (
            <Seat
              passengers={passengers}
              updatePassenger={updatePassenger}
              seatType={seatType}
            ></Seat>
          ))}
          <div>窗</div>
        </div>
      </div>
    </div>
  )
})

Choose.prototype = {
  passengers: PropTypes.array.isRequired,
  updatePassenger: PropTypes.func.isRequired,
}

export default Choose
