import React, { memo } from 'react';
import type { ItemCallback } from 'react-grid-layout';
import GridLayout from 'react-grid-layout';
import DynamicEngine from '@/components/DynamicEngine';
import styled from 'styled-components';

interface PointDataItem {
  id: string;
  item: Record<string, any>;
  point: Record<string, any>;
}

interface ViewProps {
  pointData: PointDataItem[];
  pageData?: any;
  width?: number;
  dragStop?: ItemCallback;
  onDragStart?: ItemCallback;
  onResizeStop?: ItemCallback;
}
const DragItem = styled.div`
  position: absolute;
  z-index: 2;
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
  const { pointData, pageData, width, dragStop, onDragStart, onResizeStop } = props;

  return (
    <GridLayout
      cols={24}
      rowHeight={2}
      width={width}
      margin={[0, 0]}
      onDragStop={dragStop}
      onDragStart={onDragStart}
      onResizeStop={onResizeStop}
      style={{
        minHeight: '100vh',
        backgroundColor: pageData && pageData.bgColor,
        backgroundImage:
          pageData && pageData.bgImage ? `url(${pageData.bgImage[0].url}) ` : 'initial',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {pointData.map((value: PointDataItem) => (
        <DragItem key={value.id} data-grid={value.point}>
          <DynamicEngine {...(value.item as any)} isTpl={false} />
        </DragItem>
      ))}
    </GridLayout>
  );
});

export default ViewRender;
