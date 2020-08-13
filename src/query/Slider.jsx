import React, { memo, useState, useMemo, useRef, useEffect } from "react";
import PropTyeps from "prop-types";
import leftPad from "left-pad";

import useWinSize from "../common/useWinSize.js";

import "./Slider.css";

const Slider = memo(function Slider(props) {
  const {
    title,
    currentStatrHours,
    currentEndHours,
    onStartChange,
    onEndChange
  } = props;

  const winSize = useWinSize();

  // 左侧滑块ref
  const startHandle = useRef();
  // 右侧滑块ref
  const endHandle = useRef();
  // 左侧滑块的上一次坐标
  const lastStartX = useRef();
  // 右侧滑块的上一次坐标
  const lastEndX = useRef();
  const range = useRef();
  const rangeWidth = useRef();
  const [start, setStart] = useState(() => (currentStatrHours / 24) * 100);
  const [end, setEnd] = useState(() => (currentEndHours / 24) * 100);
  // 使用useMemo生成计算值
  const startPercent = useMemo(() => {
    if (start > 100) {
      return 100;
    }
    if (start < 0) {
      return 0;
    }
    return start;
  }, [start]);
  const endPercent = useMemo(() => {
    if (end > 100) {
      return 100;
    }
    if (end < 0) {
      return 0;
    }
    return end;
  }, [end]);

  const startHours = useMemo(() => {
    return Math.round((startPercent * 24) / 100);
  }, [startPercent]);
  const endHours = useMemo(() => {
    return Math.round((endPercent * 24) / 100);
  }, [endPercent]);

  const startText = useMemo(() => {
    return leftPad(startHours, 2, "0") + ":00";
  }, [startHours]);
  const endText = useMemo(() => {
    return leftPad(endHours, 2, "0") + ":00";
  }, [endHours]);
  function onStartTouchBegin(e) {
    // 设置横坐标的初始值
    const touch = e.targetTouches[0];
    lastStartX.current = touch.pageX;
  }
  function onEndTouchBegin(e) {
    // 设置横坐标的初始值
    const touch = e.targetTouches[0];
    lastEndX.current = touch.pageX;
  }
  // 左侧滑块
  function onStartTouchMove(e) {
    const touch = e.targetTouches[0];
    const distance = touch.pageX - lastStartX.current;
    lastStartX.current = touch.pageX;
    setStart(start => start + (distance / rangeWidth.current) * 100);
  }

  // 右侧滑块
  function onEndTouchMove(e) {
    const touch = e.targetTouches[0];
    const distance = touch.pageX - lastEndX.current;
    lastEndX.current = touch.pageX;
    setEnd(end => end + (distance / rangeWidth.current) * 100);
  }

  // 测量滑动区域的宽度
  useEffect(() => {
    rangeWidth.current = parseFloat(
      window.getComputedStyle(range.current).width
    );
  }, [winSize.width]);

  // 事件监听
  useEffect(() => {
    // 左侧滑块监听事件
    startHandle.current.addEventListener(
      "touchstart",
      onStartTouchBegin,
      false
    );
    startHandle.current.addEventListener("touchmove", onStartTouchMove, false);
    // 右侧滑块监听事件
    endHandle.current.addEventListener("touchstart", onEndTouchBegin, false);
    endHandle.current.addEventListener("touchmove", onEndTouchMove, false);
    return () => {
      // 事件解绑
      startHandle.current.removeEventListener(
        "touchstart",
        onStartTouchBegin,
        false
      );
      startHandle.current.removeEventListener(
        "touchmove",
        onStartTouchMove,
        false
      );
      endHandle.current.removeEventListener(
        "touchstart",
        onEndTouchBegin,
        false
      );
      endHandle.current.removeEventListener("touchmove", onEndTouchMove, false);
    };
  });

  useEffect(() => {
    onStartChange(startHours);
  }, [startHours]);

  useEffect(() => {
    onEndChange(endHours);
  }, [endHours]);
  return (
    <div className="option">
      <h3>{title}</h3>
      <div className="range-slider">
        <div className="slider" ref={range}>
          <div
            className="slider-range"
            style={{
              left: startPercent + "%",
              width: endPercent - startPercent + "%"
            }}
          ></div>
          <i
            ref={startHandle}
            className="slider-handle"
            style={{ left: startPercent + "%" }}
          >
            <span>{startText}</span>
          </i>
          <i
            ref={endHandle}
            className="slider-handle"
            style={{ left: endPercent + "%" }}
          >
            <span>{endText}</span>
          </i>
        </div>
      </div>
    </div>
  );
});

Slider.prototype = {
  title: PropTyeps.string.isRequired,
  currentStatrHours: PropTyeps.number.isRequired,
  currentEndHours: PropTyeps.number.isRequired,
  onStartChange: PropTyeps.func.isRequired,
  onEndChange: PropTyeps.func.isRequired
};

export default Slider;
