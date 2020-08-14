import React, { memo, useState, useCallback, useMemo, useContext } from "react";
import PropTypes from "prop-types";
import URI from "urijs";
import "./Candidate.css";
import { TrainContext } from "./context";
import dayjs from "dayjs";

const Channel = memo(function Channel(props) {
  const { name, desc, type } = props;

  const { trainNumber, departStation, arriveStation, departDate } = useContext(
    TrainContext
  );
  const src = useMemo(() => {
    return new URI("order.html")
      .setSearch("trainNumber", trainNumber)
      .setSearch("dStation", departStation)
      .setSearch("aStation", arriveStation)
      .setSearch("type", type)
      .setSearch("date", dayjs(departDate).format("YYYY-MM-DD"))
      .toString();
  }, [trainNumber, departStation, arriveStation, departDate, type]);
  return (
    <div className="channel">
      <div className="middle">
        <div className="name">{name}</div>
        <div className="desc">{desc}</div>
      </div>
      <a href={src} className="buy-wrapper">
        <div className="buy">买票</div>
      </a>
    </div>
  );
});
Channel.prototype = {
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

const Seat = memo(function Seat(props) {
  const {
    type,
    priceMsg,
    ticketsLeft,
    channels,
    expended,
    onToggle,
    idx
  } = props;
  return (
    <li>
      <div className="bar" onClick={() => onToggle(idx)}>
        <span className="seat">{type}</span>
        <span className="price">
          <i>￥</i>
          {priceMsg}
        </span>
        <span className="btn">{expended ? "预订" : "收起"}</span>
        <span className="num">{ticketsLeft}</span>
      </div>
      <div
        className="channels"
        style={{ height: expended ? channels.length * 55 + "px" : 0 }}
      >
        {channels.map((channel, index) => (
          <Channel key={channel.name} {...channel} type={type}></Channel>
        ))}
      </div>
    </li>
  );
});

Seat.prototype = {
  type: PropTypes.string.isRequired,
  priceMsg: PropTypes.string.isRequired,
  ticketLeft: PropTypes.string.isRequired,
  channels: PropTypes.array.isRequired,
  expended: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired
};

const Candidate = memo(function Candidate(props) {
  const { tickets } = props;
  const [expendedIndex, setExpendedIndex] = useState(-1);

  const onToggle = useCallback(
    idx => {
      setExpendedIndex(expendedIndex === idx ? -1 : idx);
    },
    [expendedIndex]
  );
  return (
    <div className="candidate">
      <ul>
        {tickets.map((ticket, idx) => (
          <Seat
            {...ticket}
            key={ticket.type}
            expended={expendedIndex === idx}
            idx={idx}
            onToggle={onToggle}
          ></Seat>
        ))}
      </ul>
    </div>
  );
});
export default Candidate;

Candidate.prototype = {
  tickets: PropTypes.array.isRequired
};
