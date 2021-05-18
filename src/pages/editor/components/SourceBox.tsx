import type { ReactNode, CSSProperties } from 'react';
import React, { useMemo, memo } from 'react';
import { useDrag } from 'react-dnd';
import schema from '@/materials/schema';
import styled from 'styled-components';

interface SourceBoxProps {
  item: any;
  children: ReactNode;
  canvasId: string;
}
const ListWrap = styled.div`
  width: 100%;
  .module {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
    overflow: hidden;
    border: 2px solid #9e9e9e3d;
    transition: border 0.3s;
    user-select: none;
    :hover {
      border: 2px solid #06c;
    }
    ::after {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      width: 100%;
      height: 100%;
      content: '';
    }
  }
`;
const SourceBox = memo((props: SourceBoxProps) => {
  const { item } = props;
  const [{ isDragging }, drag] = useDrag({
    type: item.type,
    item: {
      type: item.type,
      config: schema[item.type as keyof typeof schema].config,
      h: item.h,
      editableEl: schema[item.type as keyof typeof schema].editData,
      category: item.category,
      x: item.x || 0
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const containerStyle: CSSProperties = useMemo(
    () => ({
      opacity: isDragging ? 0.4 : 1,
      cursor: 'move',
      height: '140px'
    }),
    [isDragging]
  );
  return (
    <>
      <ListWrap>
        <div className='module' style={{ ...containerStyle }} ref={drag}>
          <div
            style={{
              height: '110px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {props.children}
          </div>
          <div
            style={{
              height: '30px',
              lineHeight: '30px',
              textAlign: 'center',
              backgroundColor: 'rgba(245, 245, 245, 1)',
              color: 'rgba(118, 118, 118, 1)'
            }}
          >
            {props.item.displayName}
          </div>
        </div>
      </ListWrap>
    </>
  );
});

export default SourceBox;
