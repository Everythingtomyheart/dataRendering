import { useEffect } from 'react';
/**
 * 组件初始化成功后触发hook
 * @param fn 初始化成功后触发函数
 */
const useMount = (fn: () => void) => {
  useEffect(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useMount;
