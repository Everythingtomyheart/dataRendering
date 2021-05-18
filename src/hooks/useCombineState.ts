import { useState } from 'react';

const useCombineState = <S>(
  state: S | (() => S)
): [S, (nextState: Partial<S> | ((prevState: S) => S)) => void] => {
  const [os, setOS] = useState(state);
  const setState = (nextState: Partial<S> | ((prevState: S) => S)) => {
    if (typeof nextState === 'function') {
      setOS(nextState);
    } else {
      setOS((prev: S) => {
        return (typeof os === 'object' ? { ...prev, ...nextState } : nextState) as S;
      });
    }
  };
  return [os, setState];
};

export default useCombineState;
