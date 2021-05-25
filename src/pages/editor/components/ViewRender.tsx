import React, { memo } from 'react';
import DynamicEngine from '@/components/DynamicEngine';
import styled from 'styled-components';
import type { DraggableData } from 'react-draggable';
import Draggable from 'react-draggable';

interface PointDataItem {
  id: string;
  item: Record<string, any>;
  point: Record<string, any>;
}

export interface ViewProps {
  pointData: PointDataItem[];
  pageData?: any;
  width?: number;
  height?: number;
  dragStop?: (oldItem: PointDataItem, data: DraggableData) => void;
}
const DragItem = styled.div`
  position: absolute;
  display: inline-block;
  border: 2px solid transparent;
  cursor: move;
  &:hover {
    border: 2px solid #06c;
  }
  a {
    display: block;
    pointer-events: none;
  }
`;
const ViewRender = memo((props: ViewProps) => {
  const { pointData, pageData, width, height, dragStop } = props;
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: pageData && pageData.bgColor,
        backgroundImage:
          pageData && pageData.bgImage ? `url(${pageData.bgImage[0].url}) ` : 'initial',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {pointData.map((value: PointDataItem) => (
        <Draggable
          onStop={(e, data) => {
            dragStop && dragStop(value, data);
          }}
          defaultPosition={{ x: value.point.x, y: value.point.y }}
        >
          <DragItem draggable='true' key={value.id} id={value.id}>
            <DynamicEngine {...(value.item as any)} isTpl={false} />
          </DragItem>
        </Draggable>
      ))}
    </div>
  );
});

export default ViewRender;
