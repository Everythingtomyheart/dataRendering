import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDrop } from 'react-dnd';
import Draggable from 'react-draggable';
import type { ItemCallback, ViewProps } from './ViewRender';
import ViewRender from './ViewRender';
import { getuuid } from '@/utils';
import { Menu, Item, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import { useModel } from '@/.umi/plugin-model/useModel';
import styled from 'styled-components';

interface TargetBoxProps {
  width: number;
  height: number;
  scaleNum: number;
  canvasId: string;
  allType: string[];
}
const CanvasBox = styled.div<{ width: number; height: number }>`
  position: relative;
  box-sizing: content-box;
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
  padding-right: 50px;
  padding-bottom: 50px;
  .canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: ${(props) => props.width - 50}px;
    height: ${(props) => props.height - 50}px;
    background-color: #fff;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
    transition: transform 300ms ease-out;
    .selected {
      position: absolute;
      z-index: 2;
      display: inline-block;
      border: 2px solid #06c;
      cursor: move;
      :global(a) {
        display: block;
        pointer-events: none;
      }
      .tooltip {
        position: relative;
        width: 388px;
        text-align: right;
      }
    }
  }
`;
const TargetBox = memo((props: TargetBoxProps) => {
  const { scaleNum, canvasId, allType, width, height } = props;
  const editorModel = useModel('useEditorModel');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pointData = editorModel.state ? editorModel.state.pointData : [];

  const [canvasRect, setCanvasRect] = useState<number[]>([]);
  const [isShowTip, setIsShowTip] = useState(true);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: allType,
    drop: (item: { w: number; h: number; type: string; x: number }, monitor) => {
      const parentDiv = document.getElementById(canvasId);
      const pointRect = parentDiv!.getBoundingClientRect();
      const { top } = pointRect;
      const pointEnd = monitor.getSourceClientOffset();
      const y = pointEnd!.y < top ? 0 : pointEnd!.y - top;
      const cellHeight = 2;
      // 转换成网格规则的坐标和大小
      const gridY = Math.ceil(y / cellHeight);
      editorModel.addPointData({
        id: getuuid(),
        item,
        point: {
          x: 0,
          y: gridY,
          w: item.w,
          h: item.h,
          isBounded: true
        },
        status: 'inToCanvas'
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      dropItem: monitor.getItem()
    })
  });

  const dragStop: ViewProps['dragStop'] = useMemo(() => {
    return (oldItem, e) => {
      const curPointData = pointData.filter((item) => item.id === oldItem.id)[0];
      editorModel.modPointData({
        ...curPointData,
        point: {
          x: e.x,
          y: e.y,
          w: oldItem.item.w,
          h: oldItem.item.h,
          isBounded: true
        },
        status: 'inToCanvas'
      });
    };
  }, [editorModel, pointData]);

  // const onDragStart: ItemCallback = useMemo(() => {
  //   return (oldItem) => {
  //     const curPointData = pointData.filter((item) => item.id === oldItem.id)[0];
  //     editorModel.modPointData({ ...curPointData, status: 'inToCanvas' });
  //   };
  // }, [editorModel, pointData]);

  // const onResizeStop: ItemCallback = useMemo(() => {
  //   return (layout, oldItem, newItem) => {
  //     const curPointData = pointData.filter((item) => item.id === newItem.i)[0];
  //     editorModel.modPointData({ ...curPointData, point: newItem, status: 'inToCanvas' });
  //   };
  // }, [editorModel, pointData]);

  const handleContextMenuDel = useCallback(() => {
    if (editorModel.state.curPoint) {
      editorModel.delPointData({ id: editorModel.state.curPoint.id });
    }
  }, [editorModel, editorModel.state.curPoint]);
  const handleContextMenuCopy = useCallback(() => {
    if (editorModel.state.curPoint) {
      editorModel.copyPointData({ id: editorModel.state.curPoint.id });
    }
  }, [editorModel, editorModel.state.curPoint]);

  const onConTextClick = useCallback(
    (type: string) => {
      if (type === 'del') {
        handleContextMenuDel();
      } else if (type === 'copy') {
        handleContextMenuCopy();
      }
    },
    [handleContextMenuDel, handleContextMenuCopy]
  );

  const MyAwesomeMenu = useCallback(
    () => (
      <Menu id='menu_id'>
        <Item onClick={() => onConTextClick('copy')}>复制</Item>
        <Item onClick={() => onConTextClick('del')}>删除</Item>
      </Menu>
    ),
    [onConTextClick]
  );

  useEffect(() => {
    const rect = document.getElementById(canvasId)!.getBoundingClientRect();
    setCanvasRect([rect.width, rect.height]);
  }, [canvasId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsShowTip(false);
    }, 3000);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);
  const opacity = isOver ? 0.7 : 1;

  const render = useMemo(() => {
    return (
      <Draggable position={{ x: 0, y: 0 }} handle='.js_box'>
        <CanvasBox width={width} height={height}>
          <MenuProvider id='menu_id'>
            <div
              style={{
                transform: `scale(${scaleNum})`,
                position: 'relative'
              }}
            >
              <div
                id={canvasId}
                className='canvas'
                style={{
                  opacity
                }}
                ref={drop}
              >
                {pointData.length > 0 ? (
                  <ViewRender
                    pointData={pointData}
                    width={canvasRect[0] || 0}
                    height={canvasRect[1] || 0}
                    dragStop={dragStop}
                    // onDragStart={onDragStart}
                    // onResizeStop={onResizeStop}
                  />
                ) : null}
              </div>
            </div>
          </MenuProvider>
        </CanvasBox>
      </Draggable>
    );
  }, [
    canvasId,
    canvasRect,
    dragStop,
    drop,
    isShowTip,
    // onDragStart,
    // onResizeStop,
    opacity,
    pointData,
    scaleNum
  ]);

  return (
    <>
      {render}
      <MyAwesomeMenu />
    </>
  );
});

export default TargetBox;
