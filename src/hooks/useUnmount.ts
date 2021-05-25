import { isFunction } from '@/utils/is';
import { useEffect, useRef } from 'react';
/**
 * 组件卸载时触发的自定义hook
 * @param fn //卸载时触发的方法
 */
const useUnmount = (fn: () => void) => {
  const fnPersist = useRef(fn);

  useEffect(
    () => () => {
      if (isFunction(fnPersist.current)) {
        fnPersist.current();
      }
    },
    [fnPersist]
  );
};

export default useUnmount;
