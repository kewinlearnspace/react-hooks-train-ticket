import { useState, useEffect } from 'react';
/**
 * 监听浏览器窗口变化的hooks函数
 */
export default function useWinSize() {
  const [width, setWidth] = useState(document.documentElement.clientWidth);
  const [height, setHeight] = useState(document.documentElement.clientHeight);

  function onResize() {
    setWidth(document.documentElement.clientWidth);
    setHeight(document.documentElement.clientHeight);
  }

  useEffect(() => {
    window.addEventListener('resize', onResize, false);
    return () => {
      window.removeEventListener('resize', onResize, false);
    };
  }, []);
  return { width, height };
}
