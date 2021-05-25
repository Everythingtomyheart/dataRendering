import React, { memo } from 'react';
import type { ILineSimpleConfig } from './schema';
import logo from '@/assets/images/charts/line/line-simple.png';

const SimpleLine = memo((props: ILineSimpleConfig & { isTpl: boolean }) => {
  const { height, width, isTpl } = props;
  return (
    <>
      {isTpl ? (
        <div>
          <img src={logo} style={{ width: '100%' }} alt='普通折线图'></img>
        </div>
      ) : (
        <div style={{ height, width }}>123</div>
      )}
    </>
  );
});

export default SimpleLine;
