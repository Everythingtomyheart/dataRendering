import type { SetStateAction } from 'react';
import { useEffect, useRef } from 'react';
import useCombineState from './useCombineState';
/**
 * 实现类class组件形式的setState后的回调函数功能的自定义hook使用如下
 *
 * const [state, setState] = useCallbackState('');
 * @param initState 初始化state
 * @returns [state, setState]
 */
const useCallbackState = <S>(
  initState: S | (() => S)
): [S, (value: SetStateAction<S>, cb?: (state: S) => void) => void] => {
  const [state, originSetState] = useCombineState(initState);
  const fnRef = useRef<(state: S) => void>();
  const setState = (value: SetStateAction<S>, cb?: (state: S) => void) => {
    originSetState((prev) => {
      fnRef.current = cb;
      return value instanceof Function ? value(prev) : value;
    });
  };
  useEffect(() => {
    fnRef.current && fnRef.current(state);
  }, [state]);
  return [state, setState];
};

export default useCallbackState;
