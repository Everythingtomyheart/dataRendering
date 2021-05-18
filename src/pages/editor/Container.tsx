import Calibration from '@/components/Calibration';
import useCombineState from '@/hooks/useCombineState';
import { Tabs } from 'antd';
import type { MouseEvent } from 'react';
import { useEffect } from 'react';
import { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import lineTemplate from '@/materials/line/template';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TargetBox from './components/TargetBox';
import SourceBox from './components/SourceBox';
import DynamicEngine from '@/components/DynamicEngine';
import schemaChart from '@/materials/schema';
import { DndProvider } from 'react-dnd';
import { throttle } from 'lodash-es';

const Layout = styled.div`
  height: 100%;
`;
const Header = styled.div`
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
  .logo {
    font-weight: 700;
    font-size: 24px;
  }
`;
const Action = styled.div`
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const Container = styled.div`
  display: flex;
  height: calc(100% - 80px);
`;
const ChartTabs = styled(Tabs)`
  width: 300px;
  padding-top: 5px;
  &&&& .ant-tabs-tabpane {
    padding-right: 10px;
    padding-left: 10px;
  }
`;
const CanvasRender = styled.div`
  position: relative;
  flex: 1 1 0%;
  overflow: hidden;
  background: #f5f5f5;
  .tick-top {
    position: sticky;
    top: 0;
    width: 100%;
    height: 50px;
    margin-left: 40px;
    padding-left: 10px;
    overflow: hidden;
  }
  .tick-right {
    position: absolute;
    top: 40px;
    bottom: 0;
    width: 50px;
    padding-top: 10px;
    overflow: hidden;
  }
`;
const RenderWrap = styled.div`
  width: calc(100% - 50px);
  height: calc(100% - 50px);
  margin-left: 50px;
  overflow: auto;
`;
const AttributesRender = styled.div`
  width: 300px;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
`;
const canvasId = 'dataCanvas';
export default function ViewRender() {
  const [scaleNum] = useState(1);
  const [canvasScreen] = useCombineState({ width: 1920, height: 1080 });
  const [canvasScroll, setCanvasScroll] = useCombineState({ left: 0, top: 0 });
  const allType = useMemo(() => {
    const arr: string[] = [];
    lineTemplate.forEach((v) => {
      arr.push(v.type);
    });
    return arr;
  }, [lineTemplate]);
  const tabRender = useMemo(() => {
    return (
      <Tabs.TabPane tabKey='line' tab='折现' key='line'>
        {lineTemplate.map((value) => (
          <SourceBox item={value} key={value.displayName} canvasId={canvasId}>
            <DynamicEngine
              {...value}
              config={schemaChart[value.type as keyof typeof schemaChart].config}
              componentsType={value.category}
              isTpl={true}
            />
          </SourceBox>
        ))}
      </Tabs.TabPane>
    );
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const [diffmove, setDiffMove] = useState({
    start: { x: 0, y: 0 },
    move: false
  });
  const mousedownfn = useMemo(() => {
    return (e: MouseEvent<HTMLDivElement>) => {
      console.log(e.target, containerRef.current);
      if (e.target === containerRef.current) {
        setDiffMove({
          start: {
            x: e.clientX,
            y: e.clientY
          },
          move: true
        });
      }
    };
  }, []);

  const mousemovefn = useMemo(() => {
    return (e: MouseEvent<HTMLDivElement>) => {
      if (diffmove.move) {
        const newX = e.clientX;
        const newY = e.clientY;
        setDiffMove({
          start: {
            x: newX,
            y: newY
          },
          move: true
        });
      }
    };
  }, [diffmove.move, diffmove.start.x, diffmove.start.y]);

  const mouseupfn = useMemo(() => {
    return () => {
      setDiffMove({
        start: { x: 0, y: 0 },
        move: false
      });
    };
  }, []);

  useEffect(() => {
    if (diffmove.move && containerRef.current) {
      containerRef.current.style.cursor = 'move';
    } else {
      containerRef.current!.style.cursor = 'default';
    }
  }, [diffmove.move]);
  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <Header>
          <div className='logo'>logo</div>
        </Header>
        <Action>action</Action>
        <Container>
          <ChartTabs tabPosition='left'>{tabRender}</ChartTabs>
          <CanvasRender
            id='canvasRender'
            ref={containerRef}
            onMouseDown={mousedownfn}
            onMouseMove={throttle(mousemovefn, 500)}
            onMouseUp={mouseupfn}
            onMouseLeave={mouseupfn}
          >
            <div className='tick-top' style={{ width: canvasScreen.width }}>
              <Calibration
                left={canvasScroll.left}
                direction='up'
                id='calibrationUp'
                multiple={scaleNum}
              />
            </div>
            <div className='tick-right' style={{ height: canvasScreen.height }}>
              <Calibration
                top={canvasScroll.top}
                direction='right'
                id='calibrationright'
                multiple={scaleNum}
              />
            </div>
            <RenderWrap
              onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                setCanvasScroll({
                  left: target.scrollLeft,
                  top: target.scrollTop
                });
              }}
            >
              <TargetBox
                {...canvasScreen}
                scaleNum={scaleNum}
                canvasId={canvasId}
                allType={allType}
              />
            </RenderWrap>
          </CanvasRender>
          <AttributesRender>属性</AttributesRender>
        </Container>
      </Layout>
    </DndProvider>
  );
}
